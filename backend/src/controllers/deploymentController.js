// controllers/deploymentController.js
const asyncHandler = require('../middlewares/asyncHandler');
const Project = require('../models/Project');
const Deployment = require('../models/Deployment');
const { executeDeployment, stopDeployment } = require('../services/deploymentService');

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
    const io = req.app.get('io');

    // Service function call karo jo process ko kill karega aur DB update karega
    await stopDeployment(deploymentId, io);

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

    const provider = req.body.provider || 'gemini';
    const { analyzeLogsWithAI } = require('../services/logAnalysisService');

    const analysisResult = await analyzeLogsWithAI(deployment.logs, provider);

    res.status(200).json({
        success: true,
        data: analysisResult
    });
});