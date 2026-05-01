// services/deploymentService.js
const { spawn } = require('child_process');
const Project = require('../models/Project');
const Deployment = require('../models/Deployment');
const { cloneRepo } = require('./fsManager');
const { getAvailablePort, releasePort } = require('../utils/portManager');
const { detectFramework } = require('../utils/frameworkDetector');
const { streamLogs } = require('../utils/logStreamer');
const fs = require('fs').promises;
const path = require('path');
const { decrypt } = require('../utils/crypto');

// Ye Map track karega ki kaunsa deployment kis process me chal raha hai (Stop karne ke kaam aayega)
const activeProcesses = new Map();

const appendDeploymentLog = async (deploymentRecord, level, message) => {
    if (!deploymentRecord) return;

    const entry = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
    deploymentRecord.logs = deploymentRecord.logs || [];
    deploymentRecord.logs.push(entry);

    if (deploymentRecord.logs.length > 5000) {
        deploymentRecord.logs = deploymentRecord.logs.slice(-5000);
    }

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
        await appendDeploymentLog(deploymentRecord, 'info', 'Deployment started');

        // 3. GitHub se Repo Clone karo
        const targetPath = await cloneRepo(
            project.repoUrl,
            deploymentRecord._id.toString(),
            project.branch || 'main'
        );
        await appendDeploymentLog(deploymentRecord, 'info', `Repository cloned to ${targetPath}`);

        // 🌟 NEW: Auto-Detect Framework & Commands
        console.log(`🔍 Analyzing repository structure...`);
        await appendDeploymentLog(deploymentRecord, 'info', 'Analyzing repository structure');
        const frameworkInfo = await detectFramework(targetPath);

        if (frameworkInfo.error) {
            throw new Error(frameworkInfo.error);
        }

        const appPath = frameworkInfo.projectPath || targetPath;
        console.log(`🎯 Detected Type: ${frameworkInfo.type}`);
        await appendDeploymentLog(deploymentRecord, 'info', `Detected framework type: ${frameworkInfo.type}`);
        await appendDeploymentLog(deploymentRecord, 'info', `Using project path: ${appPath}`);

        // 4. NPM Install chalao (Sirf tab jab frameworkInfo me installCmd ho)
        if (frameworkInfo.installCmd) {
            await appendDeploymentLog(deploymentRecord, 'info', `Running install command: ${frameworkInfo.installCmd}`);
            await new Promise((resolve, reject) => {
                console.log(`📦 Running ${frameworkInfo.installCmd} for ${deploymentRecord._id}...`);
                const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

                const installProcess = spawn(npmCmd, ['install', '--legacy-peer-deps'], { 
                    cwd: appPath,
                    shell: true 
                });

                // 🌟 JADOO YAHAN HAI: Socket.io ko Install logs bhej do
                streamLogs(deploymentRecord._id.toString(), installProcess, io);

                installProcess.on('close', (code) => {
                    if (code === 0) resolve();
                    else reject(new Error('npm install failed'));
                });
            });
            await appendDeploymentLog(deploymentRecord, 'info', 'Install completed');
        } else {
            console.log(`⚡ Skipping install phase (Vanilla Frontend detected)`);
            await appendDeploymentLog(deploymentRecord, 'info', 'Skipping install phase');
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
                streamLogs(deploymentRecord._id.toString(), buildProcess, io);

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
        await appendDeploymentLog(deploymentRecord, 'info', `Start command launched: ${startCmdString}`);

        // 🌟 START COMMAND KE LOGS BHI STREAM KARO
        streamLogs(deploymentRecord._id.toString(), startProcess, io);

        // Is process ko Map mein save kar lo taaki baad me Kill kar sakein
        activeProcesses.set(deploymentRecord._id.toString(), startProcess);

        // Terminal ke liye local logs taaki VS Code me bhi dikhe
        startProcess.stdout.on('data', (data) => console.log(`[APP ${assignedPort}]: ${data}`));
        startProcess.stderr.on('data', (data) => console.error(`[APP ERR]: ${data}`));

        // 6. Agar process bina kisi error ke start ho gaya, toh DB update kar do
        deploymentRecord.status = 'running';
        deploymentRecord.port = assignedPort;
        await deploymentRecord.save();
        
        // Project ka active deployment update kar do
        project.activeDeploymentId = deploymentRecord._id;
        await project.save();

        console.log(`✅ Deployment ${deploymentRecord._id} is now LIVE at http://localhost:${assignedPort}`);
        await appendDeploymentLog(deploymentRecord, 'info', `Deployment live at http://localhost:${assignedPort}`);

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
        }
    }
};

// Stop Deployment Function
const killProcessTree = async (childProcess) => {
    if (!childProcess || !childProcess.pid) return;

    // Best-effort: kill the whole tree on Windows, fallback to kill() elsewhere
    if (process.platform === 'win32') {
        await new Promise((resolve) => {
            const killer = spawn('taskkill', ['/pid', String(childProcess.pid), '/T', '/F'], {
                shell: true
            });
            killer.on('close', () => resolve());
            killer.on('error', () => resolve());
        });
        return;
    }

    try {
        childProcess.kill('SIGTERM');
    } catch {
        // ignore
    }
};

const stopDeployment = async (deploymentId, io) => {
    const processToKill = activeProcesses.get(deploymentId.toString());
    
    if (processToKill) {
        await killProcessTree(processToKill);
        activeProcesses.delete(deploymentId.toString());
        console.log(`🛑 Process killed for deployment ${deploymentId}`);
    }

    const deployment = await Deployment.findById(deploymentId);
    if (!deployment) return;

    if (deployment.port) {
        releasePort(deployment.port);
    }

    deployment.status = 'stopped';
    deployment.completedAt = new Date();
    await deployment.save();

    if (io) {
        const roomName = `dep:${deploymentId}`;
        io.to(roomName).emit('log:line', {
            timestamp: new Date(),
            level: 'info',
            message: 'Deployment stopped by user'
        });
        io.to(roomName).emit('log:complete', {
            timestamp: new Date(),
            message: 'Deployment stopped'
        });
    }
};

module.exports = { executeDeployment, stopDeployment };