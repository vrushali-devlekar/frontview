// services/deploymentService.js
const { spawn } = require('child_process');
const Project = require('../models/Project');
const Deployment = require('../models/Deployment');
const User = require('../models/User');
const { cloneRepo } = require('./fsManager');
const { getAvailablePort, releasePort } = require('../utils/portManager');
const { detectFramework } = require('../utils/frameworkDetector');
const { streamLogs } = require('../utils/logStreamer');
const fs = require('fs').promises;
const path = require('path');
const { decrypt } = require('../utils/crypto');
const Integration = require('../models/Integration');
const { notifyIntegrations } = require('./notificationService');

// Ye Map track karega ki kaunsa deployment kis process me chal raha hai (Stop karne ke kaam aayega)
const activeProcesses = new Map();

const appendDeploymentLog = async (deploymentRecord, level, message, logType = 'build', io = null) => {
    if (!deploymentRecord) return;

    const entry = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
    const targetField = logType === 'runtime' ? 'runtimeLogs' : 'buildLogs';
    
    // Emit via Socket.io if available
    if (io) {
        const roomName = `dep:${deploymentRecord._id}`;
        io.to(roomName).emit('log:line', {
            timestamp: new Date(),
            level,
            message,
            logType
        });
    }

    deploymentRecord.logs = deploymentRecord.logs || [];
    deploymentRecord.logs.push(entry);
    
    if (logType === 'runtime') {
        deploymentRecord.runtimeLogs = deploymentRecord.runtimeLogs || [];
        deploymentRecord.runtimeLogs.push(entry);
    } else {
        deploymentRecord.buildLogs = deploymentRecord.buildLogs || [];
        deploymentRecord.buildLogs.push(entry);
    }

    if (deploymentRecord.logs.length > 5000) deploymentRecord.logs = deploymentRecord.logs.slice(-5000);
    if (deploymentRecord.buildLogs && deploymentRecord.buildLogs.length > 5000) deploymentRecord.buildLogs = deploymentRecord.buildLogs.slice(-5000);
    if (deploymentRecord.runtimeLogs && deploymentRecord.runtimeLogs.length > 5000) deploymentRecord.runtimeLogs = deploymentRecord.runtimeLogs.slice(-5000);

    await deploymentRecord.save();
};

const executeDeployment = async (deploymentId, io) => {
    let deploymentRecord = null;
    let assignedPort = null;

    try {
        // 1. Jo deployment controller ne banaya, use DB se nikalo
        deploymentRecord = await Deployment.findById(deploymentId);
        if (!deploymentRecord) throw new Error('Deployment record not found');

        // 2. Project details nikalo
        const project = await Project.findById(deploymentRecord.projectId);

        // Status update kar do ki build shuru ho gaya
        deploymentRecord.status = 'building';
        await deploymentRecord.save();
        io.to(`dep:${deploymentId}`).emit('deployment:status', { status: 'building' });
        await appendDeploymentLog(deploymentRecord, 'info', 'Deployment started', 'build', io);

        // 3. GitHub se Repo Clone karo (Sirf tab jab GitHub se ho)
        let targetPath;
        if (project.deploymentSource === 'upload') {
            targetPath = path.join(__dirname, '../../deployments_temp', deploymentRecord._id.toString());
            await appendDeploymentLog(deploymentRecord, 'info', 'Using uploaded files for deployment', 'build', io);
        } else {
            const user = await User.findById(deploymentRecord.userId).select('+githubAccessToken');
            targetPath = await cloneRepo(
                project.repoUrl,
                deploymentRecord._id.toString(),
                project.branch || 'main',
                user?.githubAccessToken || null
            );
            await appendDeploymentLog(deploymentRecord, 'info', `Repository cloned to ${targetPath}`, 'build', io);
        }

        // 🌟 INTEGRATIONS INJECTION (Category A)
        const integrations = await Integration.find({ projectId: project._id, isActive: true });
        
        let envContent = '';
        
        // 1. Regular project env vars
        if (project.envVars && project.envVars.length > 0) {
            for (const env of project.envVars) {
                const decryptedValue = decrypt(env.encryptedValue, env.iv);
                envContent += `${env.key}="${decryptedValue}"\n`;
            }
        }

        // 2. Integration-based env vars (Automatic Injection)
        integrations.forEach(integration => {
            const config = Object.fromEntries(integration.config);
            if (integration.provider === 'mongodb' && config.uri) {
                envContent += `MONGODB_URI="${config.uri}"\n`;
                envContent += `MONGO_URL="${config.uri}"\n`;
            } else if (integration.provider === 'redis' && config.uri) {
                envContent += `REDIS_URL="${config.uri}"\n`;
            }
        });

        if (envContent) {
            const envFilePath = path.join(targetPath, '.env');
            await fs.writeFile(envFilePath, envContent);
            await appendDeploymentLog(deploymentRecord, 'info', 'Environment variables (including integrations) successfully injected');
        } else {
            await appendDeploymentLog(deploymentRecord, 'info', 'No environment variables to inject');
        }

        // 🌟 NEW: Auto-Detect Framework & Commands
        console.log(`🔍 Analyzing repository structure...`);
        await appendDeploymentLog(deploymentRecord, 'info', 'Analyzing repository structure', 'build', io);
        const frameworkInfo = await detectFramework(targetPath);

        if (frameworkInfo.error) {
            throw new Error(frameworkInfo.error);
        }

        const appPath = frameworkInfo.projectPath || targetPath;
        console.log(`🎯 Detected Type: ${frameworkInfo.type}`);
        await appendDeploymentLog(deploymentRecord, 'info', `Detected framework type: ${frameworkInfo.type}`, 'build', io);
        await appendDeploymentLog(deploymentRecord, 'info', `Using project path: ${appPath}`, 'build', io);

        // 4. NPM Install chalao (Sirf tab jab frameworkInfo me installCmd ho)
        if (frameworkInfo.installCmd) {
            await appendDeploymentLog(deploymentRecord, 'info', `Running install command: ${frameworkInfo.installCmd}`, 'build', io);
            await new Promise((resolve, reject) => {
                console.log(`📦 Running ${frameworkInfo.installCmd} for ${deploymentRecord._id}...`);
                const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

                const installProcess = spawn(npmCmd, ['install', '--legacy-peer-deps'], {
                    cwd: appPath,
                    shell: true
                });

                // 🌟 JADOO YAHAN HAI: Socket.io ko Install logs bhej do
                streamLogs(deploymentRecord._id.toString(), installProcess, io, 'build');

                installProcess.on('close', (code) => {
                    if (code === 0) resolve();
                    else reject(new Error('npm install failed'));
                });
            });
            await appendDeploymentLog(deploymentRecord, 'info', 'Install completed', 'build', io);
        } else {
            console.log(`⚡ Skipping install phase (Vanilla Frontend detected)`);
            await appendDeploymentLog(deploymentRecord, 'info', 'Skipping install phase', 'build', io);
        }

        // 🌟 NEW: Agar Frontend hai, toh NPM Build chalao
        if (frameworkInfo.buildCmd) {
            await appendDeploymentLog(deploymentRecord, 'info', `Running build command: ${frameworkInfo.buildCmd}`);
            await new Promise((resolve, reject) => {
                console.log(`🔨 Building project: ${frameworkInfo.buildCmd}`);
                const buildCmdString = frameworkInfo.buildCmd;

                // Cross-platform support for build command
                const [bCmd, ...bArgs] = buildCmdString.split(' ');
                const finalBuildCmd = (bCmd === 'npm' && process.platform === 'win32') ? 'npm.cmd' : bCmd;

                const buildProcess = spawn(finalBuildCmd, bArgs, { cwd: appPath, shell: true });

                // 🌟 BUILD COMMAND KE LOGS BHI STREAM KARO
                streamLogs(deploymentRecord._id.toString(), buildProcess, io, 'build');

                buildProcess.on('close', (code) => {
                    if (code === 0) resolve();
                    else reject(new Error('Build failed'));
                });
            });
            await appendDeploymentLog(deploymentRecord, 'info', 'Build completed');
        }

        // 5. Port assign karo aur Start chalao
        assignedPort = getAvailablePort();
        console.log(`🚀 Starting app on port ${assignedPort}...`);
        await appendDeploymentLog(deploymentRecord, 'info', `Starting application on port ${assignedPort}`);

        // Custom start command use karo jo detector ne nikali hai
        const startCmdString = frameworkInfo.startCmd.replace('$PORT', assignedPort);
        const [cmd, ...args] = startCmdString.split(' ');

        const startProcess = spawn(cmd, args, {
            cwd: appPath,
            env: { ...process.env, PORT: assignedPort },
            shell: true
        });
        await appendDeploymentLog(deploymentRecord, 'info', `Start command launched: ${startCmdString}`, 'runtime');

        // 🌟 START COMMAND KE LOGS BHI STREAM KARO
        streamLogs(deploymentRecord._id.toString(), startProcess, io, 'runtime');

        // Is process ko Map mein save kar lo taaki baad me Kill kar sakein
        activeProcesses.set(deploymentRecord._id.toString(), startProcess);

        // Terminal ke liye local logs taaki VS Code me bhi dikhe
        startProcess.stdout.on('data', (data) => console.log(`[APP ${assignedPort}]: ${data}`));
        startProcess.stderr.on('data', (data) => console.error(`[APP ERR]: ${data}`));

        // If app process exits by itself, mark final status clearly.
        startProcess.on('close', async (code, signal) => {
            try {
                const latest = await Deployment.findById(deploymentRecord._id);
                if (!latest) return;

                // Already handled manually/earlier
                if (['stopped', 'failed'].includes(latest.status)) {
                    activeProcesses.delete(deploymentRecord._id.toString());
                    return;
                }

                activeProcesses.delete(deploymentRecord._id.toString());
                if (latest.port) {
                    releasePort(latest.port);
                }

                if (code === 0) {
                    latest.status = 'stopped';
                    latest.completedAt = new Date();
                    io.to(`dep:${deploymentRecord._id}`).emit('deployment:status', { status: 'stopped' });
                    await appendDeploymentLog(latest, 'info', `Process exited normally (code 0${signal ? `, signal ${signal}` : ''})`, 'runtime', io);
                } else {
                    latest.status = 'failed';
                    latest.errorMessage = `Process exited unexpectedly (code ${code}${signal ? `, signal ${signal}` : ''})`;
                    latest.completedAt = new Date();
                    io.to(`dep:${deploymentRecord._id}`).emit('deployment:status', { status: 'failed' });
                    await appendDeploymentLog(latest, 'error', latest.errorMessage, 'runtime', io);

                    // 🔥 Send Failure Notification
                    notifyIntegrations(latest.projectId, { 
                        projectName: project.name, 
                        errorMessage: latest.errorMessage 
                    }, 'failed').catch(e => console.log("Notification error:", e.message));
                }
                await latest.save();
            } catch (closeErr) {
                console.error(`Failed to persist process close state: ${closeErr.message}`);
            }
        });

        // 6. Agar process bina kisi error ke start ho gaya, toh DB update kar do
        deploymentRecord.status = 'running';
        deploymentRecord.port = assignedPort;
        await deploymentRecord.save();
        
        // 🔥 Send Success Notification
        const { notifyIntegrations } = require('./notificationService');
        notifyIntegrations(deploymentRecord.projectId, { 
            projectName: project.name, 
            version: deploymentRecord.version || '1.0.0' 
        }, 'success').catch(e => console.log("Notification error:", e.message));

        io.to(`dep:${deploymentId}`).emit('deployment:status', { status: 'running', url: deploymentRecord.url });

        // Project ka active deployment update kar do
        project.activeDeploymentId = deploymentRecord._id;
        await project.save();

        console.log(`✅ Deployment ${deploymentRecord._id} is now LIVE at http://localhost:${assignedPort}`);
        await appendDeploymentLog(deploymentRecord, 'info', `Deployment live at http://localhost:${assignedPort}`, 'runtime', io);

        // 🌟 NOTIFY SUCCESS (Category B)
        notifyIntegrations(project._id, { ...deploymentRecord.toObject(), projectName: project.name }, 'success');

    } catch (error) {
        console.error(`❌ Deployment failed: ${error.message}`);

        // Error aane par clean up karna zaroori hai
        if (assignedPort) releasePort(assignedPort);

        if (deploymentRecord) {
            deploymentRecord.logs = deploymentRecord.logs || [];
            deploymentRecord.logs.push(
                `[${new Date().toISOString()}] [ERROR] Deployment failed: ${error.message}`
            );

            if (deploymentRecord.logs.length > 5000) {
                deploymentRecord.logs = deploymentRecord.logs.slice(-5000);
            }

            deploymentRecord.status = 'failed';
            deploymentRecord.errorMessage = error.message;
            deploymentRecord.completedAt = new Date();
            await deploymentRecord.save();

            // 🌟 NOTIFY FAILURE (Category B)
            const project = await Project.findById(deploymentRecord.projectId);
            notifyIntegrations(project._id, { ...deploymentRecord.toObject(), projectName: project.name }, 'failed');
        }
    }
};

// Stop Deployment Function
const stopDeployment = async (deploymentId) => {
    const processToKill = activeProcesses.get(deploymentId.toString());

    if (processToKill) {
        processToKill.kill(); // Node.js ka command process rokne ke liye
        activeProcesses.delete(deploymentId.toString());
        console.log(`🛑 Process killed for deployment ${deploymentId}`);
    }

    const deployment = await Deployment.findById(deploymentId);
    if (deployment && deployment.status === 'running') {
        releasePort(deployment.port);
        deployment.status = 'stopped';
        deployment.completedAt = new Date();
        await deployment.save();
    }
};

const executeRollback = async (newDeploymentId, oldDeploymentId, io) => {
    let rollbackDeploymentRecord = null;
    let assignedPort = null;

    try {
        rollbackDeploymentRecord = await Deployment.findById(newDeploymentId);
        const oldDeploymentRecord = await Deployment.findById(oldDeploymentId);
        const project = await Project.findById(rollbackDeploymentRecord.projectId);

        await appendDeploymentLog(rollbackDeploymentRecord, 'info', `Rollback started. Target: Old Deployment ID ${oldDeploymentId}`);

        // 🌟 HACKATHON MVP MAGIC: Build/Install skip karo!
        // Seedha purane deployment ka path nikalo
        // DHYAN DE: Yahan '/tmp/deploypilot' ko apne actual base path se replace kar lena jo cloneRepo use karta hai
        const basePath = path.join(__dirname, '../../deployments_temp');
        const oldAppPath = path.join(basePath, oldDeploymentRecord._id.toString());

        await appendDeploymentLog(rollbackDeploymentRecord, 'info', `Located old build directory: ${oldAppPath}`);

        // Naya port assign karo
        assignedPort = getAvailablePort();
        await appendDeploymentLog(rollbackDeploymentRecord, 'info', `Assigning new port ${assignedPort} for rollback app`);

        // Framework detect karke wapas start command nikalo
        const frameworkInfo = await detectFramework(oldAppPath);
        if (frameworkInfo.error) throw new Error(frameworkInfo.error);

        const startCmdString = frameworkInfo.startCmd.replace('$PORT', assignedPort);
        const [cmd, ...args] = startCmdString.split(' ');

        // Start command chala do (Purane folder me!)
        const startProcess = spawn(cmd, args, {
            cwd: frameworkInfo.projectPath || oldAppPath,
            env: { ...process.env, PORT: assignedPort },
            shell: true
        });

        // Logs stream karo UI ke liye
        streamLogs(rollbackDeploymentRecord._id.toString(), startProcess, io);
        activeProcesses.set(rollbackDeploymentRecord._id.toString(), startProcess);

        // Success update
        rollbackDeploymentRecord.status = 'running';
        rollbackDeploymentRecord.port = assignedPort;
        await rollbackDeploymentRecord.save();

        project.activeDeploymentId = rollbackDeploymentRecord._id;
        await project.save();

        await appendDeploymentLog(rollbackDeploymentRecord, 'info', `✅ Rollback Successful! Live at http://localhost:${assignedPort}`);

    } catch (error) {
        console.error(`❌ Rollback failed: ${error.message}`);
        if (assignedPort) releasePort(assignedPort);

        if (rollbackDeploymentRecord) {
            rollbackDeploymentRecord.status = 'failed';
            rollbackDeploymentRecord.errorMessage = error.message;
            await appendDeploymentLog(rollbackDeploymentRecord, 'error', `Rollback failed: ${error.message}`);
            await rollbackDeploymentRecord.save();
        }
    }
};

module.exports = { executeDeployment, stopDeployment, executeRollback };