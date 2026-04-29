// services/deploymentService.js
const { spawn } = require('child_process');
const Project = require('../models/Project');
const Deployment = require('../models/Deployment');
const { cloneRepo } = require('./fsManager');
const { getAvailablePort, releasePort } = require('../utils/portManager');

// Ye Map track karega ki kaunsa deployment kis process me chal raha hai (Stop karne ke kaam aayega)
const activeProcesses = new Map();

const executeDeployment = async (projectId, userId) => {
    let deploymentRecord = null;
    let assignedPort = null;

    try {
        // 1. Project details nikalo
        const project = await Project.findById(projectId);
        if (!project) throw new Error('Project not found');

        // 2. Database mein naya Deployment "building" status ke sath banao
        deploymentRecord = await Deployment.create({
            projectId,
            userId,
            branch: project.branch,
            status: 'building',
            startedAt: new Date()
        });

        // 3. GitHub se Repo Clone karo (Humara banaya hua fsManager)
        const targetPath = await cloneRepo(project.repoUrl, deploymentRecord._id.toString());

        // 4. NPM Install chalao (Dependencies download karne ke liye)
        await new Promise((resolve, reject) => {
            console.log(`📦 Running npm install for ${deploymentRecord._id}...`);
            // Windows pe 'npm.cmd', Mac/Linux pe 'npm' chalana padta hai
            const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
            
            const installProcess = spawn(npmCmd, ['install'], { cwd: targetPath });

            // Logs collect kar rahe hain (Phase 5 mein ye frontend pe bhejenge)
            installProcess.stdout.on('data', (data) => console.log(`[INSTALL]: ${data}`));
            installProcess.stderr.on('data', (data) => console.error(`[INSTALL ERR]: ${data}`));

            installProcess.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error('npm install failed'));
            });
        });

        // 5. Port assign karo aur NPM Start chalao
        assignedPort = getAvailablePort();
        console.log(`🚀 Starting app on port ${assignedPort}...`);

        const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        const startProcess = spawn(npmCmd, ['start'], { 
            cwd: targetPath,
            // Process ko environment variables de rahe hain, jisme uska naya PORT bhi hai
            env: { ...process.env, PORT: assignedPort } 
        });

        // Is process ko Map mein save kar lo taaki baad me Kill kar sakein
        activeProcesses.set(deploymentRecord._id.toString(), startProcess);

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

    } catch (error) {
        console.error(`❌ Deployment failed: ${error.message}`);
        
        // Error aane par clean up karna zaroori hai
        if (assignedPort) releasePort(assignedPort);
        
        if (deploymentRecord) {
            deploymentRecord.status = 'failed';
            deploymentRecord.errorMessage = error.message;
            deploymentRecord.completedAt = new Date();
            await deploymentRecord.save();
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

module.exports = { executeDeployment, stopDeployment };