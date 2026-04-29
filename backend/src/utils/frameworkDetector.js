// utils/frameworkDetector.js
const fs = require('fs').promises;
const path = require('path');

const detectFramework = async (targetPath) => {
    try {
        const packageJsonPath = path.join(targetPath, 'package.json');
        
        // 1. Check if package.json exists
        try {
            await fs.access(packageJsonPath);
        } catch {
            // 🌟 NEW: Agar package.json NAHI hai, toh check karo kya index.html hai?
            try {
                const indexPath = path.join(targetPath, 'index.html');
                await fs.access(indexPath);
                return {
                    type: 'frontend-vanilla',
                    installCmd: null, // Koi package nahi hai, toh install bhi nahi karna
                    buildCmd: null,   // Koi build nahi chahiye
                    startCmd: 'npx serve -s . -l $PORT' // Direct folder ko serve kar do
                };
            } catch {
                return { type: 'error', error: 'No package.json OR index.html found. Cannot determine project type.' };
            }
        }

        // 2. Read and parse package.json
        const packageData = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        const deps = { ...packageData.dependencies, ...packageData.devDependencies };
        const scripts = packageData.scripts || {};

        // 3. Detect Vite (Modern React/Vue) - FRONTEND
        if (deps['vite']) {
            return {
                type: 'frontend-vite',
                installCmd: 'npm install',
                buildCmd: 'npm run build',
                // Vite build 'dist' folder banata hai. npx serve usko live karta hai.
                startCmd: 'npx serve -s dist -l $PORT' 
            };
        }

        // 4. Detect Create React App (Older React) - FRONTEND
        if (deps['react-scripts']) {
            return {
                type: 'frontend-cra',
                installCmd: 'npm install',
                buildCmd: 'npm run build',
                // CRA 'build' folder banata hai.
                startCmd: 'npx serve -s build -l $PORT'
            };
        }

        // 5. Detect Standard Backend / Node.js
        if (scripts['start']) {
            return {
                type: 'backend-node',
                installCmd: 'npm install',
                buildCmd: null, // Backend me generally build nahi hota (unless TS ho)
                startCmd: 'npm start'
            };
        }

        // 6. Fallback (Agar koi script nahi hai, toh main file dhundo)
        const mainFile = packageData.main || 'index.js';
        return {
            type: 'backend-fallback',
            installCmd: 'npm install',
            buildCmd: null,
            startCmd: `node ${mainFile}` // e.g., node server.js
        };

    } catch (error) {
        console.error("Detector Error:", error);
        return { type: 'error', error: 'Failed to analyze repository' };
    }
};

module.exports = { detectFramework };