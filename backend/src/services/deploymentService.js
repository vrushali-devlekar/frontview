const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const Project = require('../models/Project');
const Deployment = require('../models/Deployment');
const User = require('../models/User');
const Integration = require('../models/Integration');
const { cloneRepo } = require('./fsManager');
const { getAvailablePort, releasePort } = require('../utils/portManager');
const { detectFramework } = require('../utils/frameworkDetector');
const { streamLogs } = require('../utils/logStreamer');
const { decrypt } = require('../utils/crypto');
const { notifyIntegrations } = require('./notificationService');
const { backendUrl } = require('../config/runtime');

const activeProcesses = new Map();
const STOPPED_DEPLOYMENT_MESSAGE = 'Deployment stopped by user';

const getLiveDeploymentUrl = (deploymentId) => `${backendUrl}/live/${deploymentId}`;

const runCommandAndWaitForExit = (command, args) =>
    new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: 'ignore',
            windowsHide: true
        });

        child.once('error', reject);
        child.once('close', (code) => {
            if (code === 0) {
                resolve();
                return;
            }

            reject(new Error(`${command} exited with code ${code}`));
        });
    });

const appendDeploymentLog = async (deploymentRecord, level, message) => {
    if (!deploymentRecord) return;

    const entry = `[${new Date().toISOString()}] [${String(level).toUpperCase()}] ${message}`;
    deploymentRecord.logs = deploymentRecord.logs || [];
    deploymentRecord.logs.push(entry);

    if (deploymentRecord.logs.length > 5000) {
        deploymentRecord.logs = deploymentRecord.logs.slice(-5000);
    }

    await deploymentRecord.save();
};

const setActiveProcess = (deploymentId, childProcess) => {
    activeProcesses.set(deploymentId.toString(), childProcess);
};

const clearActiveProcess = (deploymentId, childProcess) => {
    const key = deploymentId.toString();
    const current = activeProcesses.get(key);

    if (!current) {
        return;
    }

    if (!childProcess || current === childProcess) {
        activeProcesses.delete(key);
    }
};

const spawnShellCommand = (command, options = {}) =>
    spawn(command, {
        ...options,
        shell: true
    });

const terminateProcessTree = async (childProcess) => {
    if (!childProcess?.pid) {
        return;
    }

    if (process.platform === 'win32') {
        await runCommandAndWaitForExit('taskkill', ['/PID', String(childProcess.pid), '/T', '/F']);
        return;
    }

    try {
        process.kill(-childProcess.pid, 'SIGTERM');
    } catch (error) {
        if (error.code !== 'ESRCH') {
            throw error;
        }
    }
};

const buildStoppedDeploymentError = () => {
    const error = new Error(STOPPED_DEPLOYMENT_MESSAGE);
    error.code = 'DEPLOYMENT_STOPPED';
    return error;
};

const ensureDeploymentNotStopped = async (deploymentId) => {
    const latest = await Deployment.findById(deploymentId).select('status');
    if (latest?.status === 'stopped') {
        throw buildStoppedDeploymentError();
    }
};

const waitForProcessStartup = async (childProcess, timeoutMs = 1500) => {
    await new Promise((resolve, reject) => {
        let settled = false;
        const timer = setTimeout(() => {
            settled = true;
            resolve();
        }, timeoutMs);

        childProcess.once('exit', (code, signal) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            reject(new Error(`Application exited during startup (code ${code}${signal ? `, signal ${signal}` : ''})`));
        });

        childProcess.once('error', (error) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            reject(error);
        });
    });
};

const attachProcessCloseHandler = (deploymentId, port, processRef) => {
    const key = deploymentId.toString();
    processRef.on('close', async (code, signal) => {
        try {
            const latest = await Deployment.findById(deploymentId);
            clearActiveProcess(key, processRef);

            if (!latest) return;
            if (latest.port) {
                releasePort(latest.port);
            }

            if (['stopped', 'failed'].includes(latest.status)) {
                return;
            }

            latest.completedAt = new Date();
            if (code === 0) {
                latest.status = 'stopped';
                await appendDeploymentLog(latest, 'info', `Process exited normally (code 0${signal ? `, signal ${signal}` : ''})`);
            } else {
                latest.status = 'failed';
                latest.errorMessage = `Process exited unexpectedly (code ${code}${signal ? `, signal ${signal}` : ''})`;
                await appendDeploymentLog(latest, 'error', latest.errorMessage);
            }

            await latest.save();
        } catch (closeError) {
            console.error(`Failed to persist process close state for ${deploymentId}: ${closeError.message}`);
            if (port) {
                releasePort(port);
            }
        }
    });
};

const buildEnvContent = async (project, integrations) => {
    let envContent = '';

    if (project.envVars && project.envVars.length > 0) {
        for (const env of project.envVars) {
            const decryptedValue = decrypt(env.encryptedValue, env.iv);
            envContent += `${env.key}="${decryptedValue}"\n`;
        }
    }

    integrations.forEach((integration) => {
        const config = Object.fromEntries(integration.config);
        if (integration.provider === 'mongodb' && config.uri) {
            envContent += `MONGODB_URI="${config.uri}"\n`;
            envContent += `MONGO_URL="${config.uri}"\n`;
        } else if (integration.provider === 'redis' && config.uri) {
            envContent += `REDIS_URL="${config.uri}"\n`;
        }
    });

    return envContent;
};

const executeInstall = async (deploymentRecord, appPath, frameworkInfo, io) => {
    if (!frameworkInfo.installCmd) {
        await appendDeploymentLog(deploymentRecord, 'info', 'Skipping install phase');
        return;
    }

    await appendDeploymentLog(deploymentRecord, 'info', `Running install command: ${frameworkInfo.installCmd}`);

    await new Promise((resolve, reject) => {
        const installProcess = spawnShellCommand(frameworkInfo.installCmd, { cwd: appPath });
        setActiveProcess(deploymentRecord._id, installProcess);
        streamLogs(deploymentRecord._id.toString(), installProcess, io);

        installProcess.on('close', (code) => {
            clearActiveProcess(deploymentRecord._id, installProcess);
            if (code === 0) resolve();
            else reject(new Error(`Install failed with exit code ${code}`));
        });

        installProcess.on('error', (error) => {
            clearActiveProcess(deploymentRecord._id, installProcess);
            reject(error);
        });
    });

    await appendDeploymentLog(deploymentRecord, 'info', 'Install completed');
};

const executeBuild = async (deploymentRecord, appPath, frameworkInfo, io) => {
    if (!frameworkInfo.buildCmd) return;

    await appendDeploymentLog(deploymentRecord, 'info', `Running build command: ${frameworkInfo.buildCmd}`);

    await new Promise((resolve, reject) => {
        const buildProcess = spawnShellCommand(frameworkInfo.buildCmd, { cwd: appPath });
        setActiveProcess(deploymentRecord._id, buildProcess);
        streamLogs(deploymentRecord._id.toString(), buildProcess, io);

        buildProcess.on('close', (code) => {
            clearActiveProcess(deploymentRecord._id, buildProcess);
            if (code === 0) resolve();
            else reject(new Error(`Build failed with exit code ${code}`));
        });

        buildProcess.on('error', (error) => {
            clearActiveProcess(deploymentRecord._id, buildProcess);
            reject(error);
        });
    });

    await appendDeploymentLog(deploymentRecord, 'info', 'Build completed');
};

const startApplicationProcess = async (deploymentRecord, appPath, frameworkInfo, port, io) => {
    const startCmdString = frameworkInfo.startCmd.replace('$PORT', String(port));
    await appendDeploymentLog(deploymentRecord, 'info', `Start command launched: ${startCmdString}`);

    const startProcess = spawnShellCommand(startCmdString, {
        cwd: appPath,
        env: { ...process.env, PORT: String(port) }
    });

    setActiveProcess(deploymentRecord._id, startProcess);
    attachProcessCloseHandler(deploymentRecord._id, port, startProcess);
    streamLogs(deploymentRecord._id.toString(), startProcess, io);
    startProcess.stdout.on('data', (data) => console.log(`[APP ${port}]: ${data}`));
    startProcess.stderr.on('data', (data) => console.error(`[APP ERR]: ${data}`));

    await waitForProcessStartup(startProcess);

    return startProcess;
};

const executeDeployment = async (deploymentId, io) => {
    let deploymentRecord = null;
    let assignedPort = null;

    try {
        deploymentRecord = await Deployment.findById(deploymentId);
        if (!deploymentRecord) throw new Error('Deployment record not found');
        if (deploymentRecord.status === 'stopped') {
            return;
        }

        const project = await Project.findById(deploymentRecord.projectId);
        if (!project) throw new Error('Project not found');

        deploymentRecord.status = 'building';
        await deploymentRecord.save();
        await appendDeploymentLog(deploymentRecord, 'info', 'Deployment started');

        const user = await User.findById(deploymentRecord.userId).select('+githubAccessToken');
        const targetPath = await cloneRepo(
            project.repoUrl,
            deploymentRecord._id.toString(),
            project.branch || 'main',
            user?.githubAccessToken || null
        );
        await appendDeploymentLog(deploymentRecord, 'info', `Repository cloned to ${targetPath}`);
        await ensureDeploymentNotStopped(deploymentRecord._id);

        const integrations = await Integration.find({ projectId: project._id, isActive: true });
        const envContent = await buildEnvContent(project, integrations);

        if (envContent) {
            await fs.writeFile(path.join(targetPath, '.env'), envContent);
            await appendDeploymentLog(deploymentRecord, 'info', 'Environment variables injected');
        } else {
            await appendDeploymentLog(deploymentRecord, 'info', 'No environment variables to inject');
        }

        await appendDeploymentLog(deploymentRecord, 'info', 'Analyzing repository structure');
        const frameworkInfo = await detectFramework(targetPath);
        if (frameworkInfo.error) {
            throw new Error(frameworkInfo.error);
        }
        await ensureDeploymentNotStopped(deploymentRecord._id);

        const appPath = frameworkInfo.projectPath || targetPath;
        await appendDeploymentLog(deploymentRecord, 'info', `Detected framework type: ${frameworkInfo.type}`);
        await appendDeploymentLog(deploymentRecord, 'info', `Using project path: ${appPath}`);

        await executeInstall(deploymentRecord, appPath, frameworkInfo, io);
        await ensureDeploymentNotStopped(deploymentRecord._id);
        await executeBuild(deploymentRecord, appPath, frameworkInfo, io);
        await ensureDeploymentNotStopped(deploymentRecord._id);

        assignedPort = getAvailablePort();
        await appendDeploymentLog(deploymentRecord, 'info', `Starting application on port ${assignedPort}`);
        await startApplicationProcess(deploymentRecord, appPath, frameworkInfo, assignedPort, io);

        deploymentRecord.status = 'running';
        deploymentRecord.port = assignedPort;
        await deploymentRecord.save();

        project.activeDeploymentId = deploymentRecord._id;
        await project.save();

        await appendDeploymentLog(deploymentRecord, 'info', `Deployment live at ${getLiveDeploymentUrl(deploymentRecord._id)}`);
        notifyIntegrations(project._id, { ...deploymentRecord.toObject(), projectName: project.name }, 'success');
    } catch (error) {
        console.error(`Deployment failed: ${error.message}`);
        clearActiveProcess(deploymentId);

        const latest = deploymentRecord ? await Deployment.findById(deploymentRecord._id) : null;
        if (error.code === 'DEPLOYMENT_STOPPED' || latest?.status === 'stopped') {
            if (assignedPort) {
                releasePort(assignedPort);
            }
            return;
        }

        if (assignedPort) {
            releasePort(assignedPort);
        }

        if (deploymentRecord) {
            deploymentRecord.status = 'failed';
            deploymentRecord.errorMessage = error.message;
            deploymentRecord.completedAt = new Date();
            await appendDeploymentLog(deploymentRecord, 'error', `Deployment failed: ${error.message}`);
            await deploymentRecord.save();

            const project = await Project.findById(deploymentRecord.projectId);
            if (project) {
                notifyIntegrations(project._id, { ...deploymentRecord.toObject(), projectName: project.name }, 'failed');
            }
        }
    }
};

const stopDeployment = async (deploymentId) => {
    const key = deploymentId.toString();
    const processToKill = activeProcesses.get(key);
    const deployment = await Deployment.findById(deploymentId);
    if (!deployment) {
        return;
    }

    if (!['queued', 'building', 'running', 'rolling_back'].includes(deployment.status)) {
        return;
    }

    deployment.status = 'stopped';
    deployment.completedAt = new Date();
    deployment.errorMessage = '';
    await appendDeploymentLog(deployment, 'info', 'Deployment stop requested by user');

    if (processToKill) {
        try {
            await terminateProcessTree(processToKill);
            console.log(`Process tree killed for deployment ${deploymentId}`);
        } catch (error) {
            console.error(`Failed to fully stop deployment ${deploymentId}: ${error.message}`);
            await appendDeploymentLog(deployment, 'error', `Failed to stop process tree cleanly: ${error.message}`);
        } finally {
            activeProcesses.delete(key);
        }
    }

    if (deployment.port) {
        releasePort(deployment.port);
    }

    await deployment.save();
};

const executeRollback = async (newDeploymentId, oldDeploymentId, io) => {
    let rollbackDeploymentRecord = null;
    let assignedPort = null;

    try {
        rollbackDeploymentRecord = await Deployment.findById(newDeploymentId);
        const oldDeploymentRecord = await Deployment.findById(oldDeploymentId);
        if (!rollbackDeploymentRecord || !oldDeploymentRecord) {
            throw new Error('Rollback deployment data not found');
        }

        const project = await Project.findById(rollbackDeploymentRecord.projectId);
        if (!project) throw new Error('Project not found');

        await appendDeploymentLog(rollbackDeploymentRecord, 'info', `Rollback started. Target deployment: ${oldDeploymentId}`);

        const basePath = process.platform === 'win32' ? 'C:\\tmp\\deploypilot' : '/tmp/deploypilot';
        const oldAppPath = path.join(basePath, oldDeploymentRecord._id.toString());
        await appendDeploymentLog(rollbackDeploymentRecord, 'info', `Located old build directory: ${oldAppPath}`);

        const frameworkInfo = await detectFramework(oldAppPath);
        if (frameworkInfo.error) throw new Error(frameworkInfo.error);

        assignedPort = getAvailablePort();
        await appendDeploymentLog(rollbackDeploymentRecord, 'info', `Assigning new port ${assignedPort} for rollback app`);

        await startApplicationProcess(
            rollbackDeploymentRecord,
            frameworkInfo.projectPath || oldAppPath,
            frameworkInfo,
            assignedPort,
            io
        );

        rollbackDeploymentRecord.status = 'running';
        rollbackDeploymentRecord.port = assignedPort;
        await rollbackDeploymentRecord.save();

        project.activeDeploymentId = rollbackDeploymentRecord._id;
        await project.save();

        await appendDeploymentLog(rollbackDeploymentRecord, 'info', `Rollback successful. Live at ${getLiveDeploymentUrl(rollbackDeploymentRecord._id)}`);
    } catch (error) {
        console.error(`Rollback failed: ${error.message}`);
        if (assignedPort) {
            releasePort(assignedPort);
        }

        if (rollbackDeploymentRecord) {
            rollbackDeploymentRecord.status = 'failed';
            rollbackDeploymentRecord.errorMessage = error.message;
            rollbackDeploymentRecord.completedAt = new Date();
            await appendDeploymentLog(rollbackDeploymentRecord, 'error', `Rollback failed: ${error.message}`);
            await rollbackDeploymentRecord.save();
        }
    }
};

module.exports = { executeDeployment, stopDeployment, executeRollback };
