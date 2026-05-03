// controllers/deploymentController.js
const asyncHandler = require('../middlewares/asyncHandler');
const Project = require('../models/Project');
const Deployment = require('../models/Deployment');
const { executeDeployment, stopDeployment, executeRollback } = require('../services/deploymentService');

// @desc    List deployments for a project
// @route   GET /api/deployments?projectId=
exports.listDeploymentsForProject = asyncHandler(async (req, res) => {
    const { projectId } = req.query;

    if (!projectId) {
        res.status(400);
        throw new Error('projectId query parameter is required');
    }

    const project = await Project.findOne({
        _id: projectId,
        owner: req.user.id,
        isDeleted: false
    });

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const deployments = await Deployment.find({ projectId: project._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-logs -buildLogs -runtimeLogs'); // Selection optimization 🚀

    const total = await Deployment.countDocuments({ projectId: project._id });

    res.status(200).json({
        success: true,
        count: deployments.length,
        data: deployments,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        }
    });
});

exports.rollbackDeployment = asyncHandler(async (req, res) => {
    const { id: projectId, version } = req.params;

    // 1. Project dhundo aur Ownership verify karo
    const project = await Project.findOne({ _id: projectId, owner: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // 2. Purana Deployment dhundo jisme rollback karna hai
    const targetOldDeployment = await Deployment.findOne({
        projectId,
        version: parseInt(version)
    });

    if (!targetOldDeployment) {
        return res.status(404).json({ message: `Version ${version} not found for this project.` });
    }

    // 3. Current active deployment ko stop karo
    if (project.activeDeploymentId) {
        await stopDeployment(project.activeDeploymentId);
    }

    // 4. Ek NAYA deployment document banao tracking ke liye
    const lastDeployment = await Deployment.findOne({ projectId }).sort({ version: -1 });
    const newVersion = lastDeployment ? lastDeployment.version + 1 : 1;

    const newRollbackDeployment = await Deployment.create({
        projectId,
        version: newVersion,
        userId: req.user.id, // 🌟 MISSING FIELD FIX: Current user ki ID
        branch: targetOldDeployment.branch || 'main', // 🌟 MISSING FIELD FIX: Purane wale ki branch copy ki
        status: 'rolling_back', // 🌟 Ab mongoose ispe nahi chillaeyga
        logs: [`[INFO] Initiating rollback to version ${version}...`]
    });

    // 5. Background mein Rollback Engine chala do
    const io = req.app.get('io'); // Agar socket.io app me set kiya hai
    executeRollback(newRollbackDeployment._id, targetOldDeployment._id, io);

    res.status(202).json({
        success: true,
        message: `Rollback to version ${version} initiated successfully.`,
        deploymentId: newRollbackDeployment._id,
        newVersion: newVersion
    });
});

// @desc    Trigger a new deployment
// @route   POST /api/deployments
exports.triggerDeployment = asyncHandler(async (req, res) => {
    const { projectId } = req.body;

    if (!projectId) {
        res.status(400);
        throw new Error('Project ID is required');
    }

    const project = await Project.findOne({ _id: projectId, owner: req.user.id, isDeleted: false });
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    // 🌟 SDE FIX: Engine start hone se pehle DB me entry banao
    const deployment = await Deployment.create({
        projectId: project._id,
        userId: req.user.id,
        branch: project.branch,
        status: 'queued', // Shuru mein queued
        startedAt: new Date()
    });

    const io = req.app.get('io');

    // Engine ko ab Project ID nahi, Deployment ID bhejenge
    executeDeployment(deployment._id, io).catch(console.error);

    // 🌟 Frontend ko Deployment ID de do taaki wo Socket Room join kar sake
    res.status(202).json({
        success: true,
        deploymentId: deployment._id, // Ye gaya ID frontend ke paas!
        message: 'Deployment triggered successfully.'
    });
});

// @desc    Get deployment status
// @route   GET /api/deployments/:id
exports.getDeploymentStatus = asyncHandler(async (req, res) => {
    const deployment = await Deployment.findOne({ _id: req.params.id, userId: req.user.id });

    if (!deployment) {
        res.status(404);
        throw new Error('Deployment not found');
    }

    res.status(200).json({
        success: true,
        data: deployment
    });
});

// @desc    Stop a running deployment
// @route   POST /api/deployments/:id/stop
exports.stopActiveDeployment = asyncHandler(async (req, res) => {
    const deploymentId = req.params.id;

    const deployment = await Deployment.findOne({ _id: deploymentId, userId: req.user.id });
    if (!deployment) {
        res.status(404);
        throw new Error('Deployment not found');
    }

    // If already stopped/failed/rolling_back/queued, do not pretend we stopped a running process.
    if (deployment.status !== 'running') {
        return res.status(200).json({
            success: true,
            message: `Deployment is already ${deployment.status}`
        });
    }

    // Service function call karo jo process ko kill karega aur DB update karega
    await stopDeployment(deploymentId);

    res.status(200).json({
        success: true,
        message: 'Deployment stopped successfully'
    });
});

// @desc    Analyze deployment logs with AI
// @route   POST /api/deployments/:id/analyze-logs
exports.analyzeLogs = asyncHandler(async (req, res) => {
    const deployment = await Deployment.findOne({ _id: req.params.id, userId: req.user.id });

    if (!deployment) {
        res.status(404);
        throw new Error('Deployment not found');
    }

    if (!deployment.logs || deployment.logs.length === 0) {
        res.status(400);
        throw new Error('No logs found for this deployment');
    }

    const provider = req.body.provider || 'mistral';
    const question = req.body.question || '';
    const { analyzeLogsWithAI } = require('../services/logAnalysisService');

    const analysisResult = await analyzeLogsWithAI(deployment.logs, provider, question);

    res.status(200).json({
        success: true,
        data: analysisResult
    });
});

// @desc    Stream AI analysis of deployment logs (SSE)
// @route   POST /api/deployments/:id/analyze/stream
// @access  Private
exports.analyzeLogsStream = async (req, res) => {
    try {
        const deployment = await Deployment.findOne({ _id: req.params.id, userId: req.user.id });

        if (!deployment) {
            return res.status(404).json({ message: 'Deployment not found' });
        }

        if (!deployment.logs || deployment.logs.length === 0) {
            return res.status(400).json({ message: 'No logs found for this deployment' });
        }

        const question = req.body.question || '';
        const logsText = deployment.logs.join('\n');

        // SSE Headers
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        // Prompt logic
        const prompt = question 
            ? `Follow-up question about these logs: ${logsText}\n\nQuestion: ${question}`
            : `Analyze these deployment logs for root cause and fix: ${logsText}`;

        // PROVIDER CHAIN
        // Start with stable providers (Cohere, Groq)
        
        const providers = [
            { id: 'cohere', key: process.env.COHERE_API_KEY },
            { id: 'groq', key: process.env.GROQ_API_KEY }
        ].filter(p => p.key);

        let success = false;

        for (const provider of providers) {
            try {
                if (provider.id === 'cohere') {
                    res.write(`data: ${JSON.stringify({ text: "[🔄 ENGINE: VELORA_AI_ANALYZING]\n\n" })}\n\n`);
                    const { analyzeLogsWithAI } = require('../services/logAnalysisService');
                    const result = await analyzeLogsWithAI(deployment.logs, 'cohere', question);
                    
                    let text = '';
                    if (typeof result === 'string') text = result;
                    else if (result.markdown) text = result.markdown;
                    else {
                        text = `### 🔍 Root Cause Analysis\n${result.rootCause || 'No specific root cause identified.'}\n\n`;
                        if (result.stepByStepFix && result.stepByStepFix.length > 0) {
                            text += `### 🛠️ How to Fix (Step-by-Step)\n`;
                            result.stepByStepFix.forEach((step, idx) => text += `${idx + 1}. ${step}\n`);
                            text += '\n';
                        }
                        if (result.securityFlags && result.securityFlags.length > 0) {
                            text += `### 🚨 Security Warnings\n`;
                            result.securityFlags.forEach(flag => text += `- ⚠️ **${flag}**\n`);
                            text += '\n';
                        }
                    }
                    res.write(`data: ${JSON.stringify({ text })}\n\n`);
                } else if (provider.id === 'groq') {
                    res.write(`data: ${JSON.stringify({ text: "[🔄 ENGINE: VELORA_AI_ANALYZING]\n\n" })}\n\n`);
                    const { analyzeLogsWithAI } = require('../services/logAnalysisService');
                    const result = await analyzeLogsWithAI(deployment.logs, 'groq', question);
                    
                    let text = '';
                    if (typeof result === 'string') text = result;
                    else if (result.markdown) text = result.markdown;
                    else {
                        text = `### 🔍 Root Cause Analysis\n${result.rootCause || 'No specific root cause identified.'}\n\n`;
                        if (result.stepByStepFix && result.stepByStepFix.length > 0) {
                            text += `### 🛠️ How to Fix (Step-by-Step)\n`;
                            result.stepByStepFix.forEach((step, idx) => text += `${idx + 1}. ${step}\n`);
                            text += '\n';
                        }
                        if (result.securityFlags && result.securityFlags.length > 0) {
                            text += `### 🚨 Security Warnings\n`;
                            result.securityFlags.forEach(flag => text += `- ⚠️ **${flag}**\n`);
                            text += '\n';
                        }
                    }
                    res.write(`data: ${JSON.stringify({ text })}\n\n`);
                }
                
                success = true;
                break;
            } catch (err) {
                console.error(`AI Provider ${provider.id} failed:`, err.message);
                res.write(`data: ${JSON.stringify({ text: `\n\n[⚠️ ${provider.id.toUpperCase()}_FAILED] Trying next...\n` })}\n\n`);
            }
        }

        if (!success) {
            res.write(`data: ${JSON.stringify({ text: "\n\n### ❌ ALL_AI_ENGINES_EXHAUSTED\nPlease add more API keys in .env or try again later." })}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error("AI Global Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.write('data: [DONE]\n\n');
            res.end();
        }
    }
};