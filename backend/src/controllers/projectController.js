// controllers/projectController.js
const Project = require('../models/Project');
const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/User');
const { fetchUserRepos } = require('../services/repoService');

// @desc    Get user's GitHub repositories
// @route   GET /api/projects/repos
exports.getUserRepos = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const searchQuery = req.query.search ? req.query.search.toLowerCase() : '';

    const user = await User.findById(userId).select('+githubAccessToken');
    if (!user || !user.githubAccessToken) {
        res.status(401);
        throw new Error('Not authorized or GitHub token missing');
    }

    let repos = await fetchUserRepos(user.githubAccessToken);
    if (searchQuery) {
        repos = repos.filter(repo => repo.name.toLowerCase().includes(searchQuery));
    }

    res.status(200).json({ success: true, count: repos.length, repos });
});

// @desc    Naya Project create karna (Save to DB)
// @route   POST /api/projects
exports.createProject = asyncHandler(async (req, res) => {
    const { name, repoUrl, repoName, branch, installCommand, startCommand, framework } = req.body;

    if (!name || !repoUrl || !repoName) {
        res.status(400);
        throw new Error('Please provide name, repoUrl, and repoName');
    }

    // 2. Check for duplicate project (same repo for same user)
    // IMPORTANT: Since we are switching to hard delete, we only check active ones.
    const existingProject = await Project.findOne({ 
        repoUrl: repoUrl.trim(), 
        owner: req.user.id 
    });

    if (existingProject) {
        // If it exists, it's a conflict because we use hard delete now
        res.status(400);
        throw new Error('You have already added this repository as a project.');
    }

    // 3. Create Project
    try {
        const project = await Project.create({
            name,
            repoUrl,
            repoName,
            branch: branch || 'main',
            owner: req.user.id,
            installCommand: installCommand || 'npm install',
            startCommand: startCommand || 'npm start',
            framework: framework || 'other'
        });

        // 🌟 AUTO-TRIGGER FIRST DEPLOYMENT
        const Deployment = require('../models/Deployment');
        const { executeDeployment } = require('../services/deploymentService');
        
        const deployment = await Deployment.create({
            projectId: project._id,
            userId: req.user.id,
            branch: project.branch,
            status: 'queued',
            startedAt: new Date()
        });

        const io = req.app.get('io');
        executeDeployment(deployment._id, io).catch(console.error);

        res.status(201).json({ 
            success: true, 
            data: project,
            deploymentId: deployment._id 
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400);
            throw new Error('This repository has already been deployed as a project in your account. Please use the existing project or delete it first.');
        }
        throw error;
    }
});

// @desc    User ke saare active projects lana
// @route   GET /api/projects
exports.getUserProjects = asyncHandler(async (req, res) => {
    const Deployment = require('../models/Deployment');
    
    const projects = await Project.find({ 
        owner: req.user.id, 
        isDeleted: false 
    }).sort({ createdAt: -1 });

    const projectsWithDeployment = await Promise.all(projects.map(async (project) => {
        const latestDeployment = await Deployment.findOne({ projectId: project._id })
            .sort({ createdAt: -1 });
        
        const projectObj = project.toObject();
        projectObj.latestDeployment = latestDeployment;
        return projectObj;
    }));

    res.status(200).json({ success: true, count: projectsWithDeployment.length, data: projectsWithDeployment });
});

// @desc    Single project detail lana
// @route   GET /api/projects/:id
exports.getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findOne({ 
        _id: req.params.id, 
        owner: req.user.id 
    });

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    res.status(200).json({ success: true, data: project });
});

// @desc    Update project detail
// @route   PUT /api/projects/:id
exports.updateProject = asyncHandler(async (req, res) => {
    let project = await Project.findOne({ 
        _id: req.params.id, 
        owner: req.user.id 
    });

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: project });
});

exports.getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const Project = require('../models/Project');
    const Deployment = require('../models/Deployment');

    const projectIds = (await Project.find({ owner: userId }).select('_id')).map(p => p._id);
    const totalProjects = await Project.countDocuments({ owner: userId });
    const deploymentsCount = await Deployment.countDocuments({ project: { $in: projectIds } });
    const successCount = await Deployment.countDocuments({ project: { $in: projectIds }, status: 'SUCCESS' });
    const successRate = deploymentsCount > 0 ? ((successCount / deploymentsCount) * 100).toFixed(1) : "0";

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activityData = await Deployment.aggregate([
        {
            $match: {
                project: { $in: projectIds },
                createdAt: { $gt: thirtyDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    const activityBars = [];
    const dateMap = new Map(activityData.map(d => [d._id, d.count]));
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        activityBars.push(dateMap.get(dateStr) || 0);
    }

    res.status(200).json({
        success: true,
        stats: {
            totalProjects,
            totalDeployments: deploymentsCount,
            successRate: successRate + "%",
            avgBuildTime: "42s",
            activityBars
        }
    });
});

// @desc    Project delete karna (Hard Delete)
// @route   DELETE /api/projects/:id
exports.deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findOne({ 
        _id: req.params.id, 
        owner: req.user.id 
    });

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    // Hard delete logic: remove from DB
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Project removed permanently' });
});

// @desc    Trigger a new deployment for an existing project
// @route   POST /api/projects/:id/deploy
exports.deployProject = asyncHandler(async (req, res) => {
    console.log(`🚀 Manual deployment triggered for project: ${req.params.id}`);
    const project = await Project.findOne({ 
        _id: req.params.id, 
        owner: req.user.id 
    });

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    const Deployment = require('../models/Deployment');
    const { executeDeployment } = require('../services/deploymentService');
    
    const deployment = await Deployment.create({
        projectId: project._id,
        userId: req.user._id,
        branch: project.branch || 'main',
        status: 'queued',
        startedAt: new Date()
    });

    const io = req.app.get('io');
    executeDeployment(deployment._id, io).catch(err => {
        console.error(`❌ Deployment execution failed for ${deployment._id}:`, err);
    });

    console.log(`✅ Deployment ${deployment._id} queued successfully`);
    res.status(201).json({ 
        success: true, 
        deploymentId: deployment._id 
    });
});