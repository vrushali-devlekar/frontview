// services/fsManager.js
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');


// Base directory jahan hum saare projects clone karenge (Backend folder ke andar ek 'deployments' folder)
const BASE_DIR = path.join(__dirname, '../../deployments_temp'); 
fs.mkdir(BASE_DIR, { recursive: true }).catch(() => {});


// 1. Repo Clone karne ka function
const cloneRepo = async (repoUrl, deploymentId) => {
    const targetPath = path.join(BASE_DIR, deploymentId);

    // Agar same ID ka folder pehle se hai (retry case), toh usko clean kar do
    try {
        await fs.rm(targetPath, { recursive: true, force: true });
    } catch (err) {
        // Ignore agar folder exist nahi karta
    }

    return new Promise((resolve, reject) => {
        console.log(`🚀 Cloning repo into ${targetPath}...`);
        
        // Child Process: "git clone --depth 1 <URL> <Path>"
        // --depth 1 se cloning ultra-fast hoti hai kyunki sirf latest code aata hai, poori history nahi
        const gitProcess = spawn('git', ['clone', '--depth', '1', repoUrl, targetPath]);

        gitProcess.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ Cloning successful for ${deploymentId}`);
                resolve(targetPath); // Folder ka path return kar do jahan code rakha hai
            } else {
                reject(new Error(`Git clone failed with exit code ${code}`));
            }
        });
    });
};

// 2. .env file create karne ka function
const createEnvFile = async (targetPath, envVars = []) => {
    if (!envVars || envVars.length === 0) return;
    
    const envPath = path.join(targetPath, '.env');
    // Array ko ek string mein convert kar rahe hain: KEY=VALUE format mein
    const envContent = envVars.map(env => `${env.key}=${env.value}`).join('\n');
    
    await fs.writeFile(envPath, envContent);
    console.log(`🔐 .env file created at ${envPath}`);
};

module.exports = { cloneRepo, createEnvFile };