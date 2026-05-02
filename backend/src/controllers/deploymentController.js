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

    const deployments = await Deployment.find({ projectId: project._id })
        .sort({ createdAt: -1 })
        .limit(100)
        .select('-logs');

    res.status(200).json({
        success: true,
        count: deployments.length,
        data: deployments
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

    const provider = req.body.provider || 'gemini';
    const question = req.body.question || '';
    const { analyzeLogsWithAI } = require('../services/logAnalysisService');

    const analysisResult = await analyzeLogsWithAI(deployment.logs, provider, question);

    res.status(200).json({
        success: true,
        data: analysisResult
    });
});