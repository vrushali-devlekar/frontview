// controllers/projectController.js
const Project = require('../models/Project');
const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/User');
const { fetchUserRepos, deleteGithubRepo } = require('../services/repoService'); // Nayi service import ki
const Deployment = require('../models/Deployment');
const Integration = require('../models/Integration');
const EnvVar = require('../models/EnvVar');
const { stopDeployment } = require('../services/deploymentService');

const parseRepoNameFromUrl = (repoUrl = '') => {
    const match = String(repoUrl).trim().match(/^https:\/\/github\.com\/([^/]+)\/([^/.]+)(?:\.git)?$/i);
    if (!match) return '';
    return `${match[1]}/${match[2]}`;
};

// @desc    Get user's GitHub repositories
// @route   GET /api/projects/repos
// @access  Private
exports.getUserRepos = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const searchQuery = req.query.search ? req.query.search.toLowerCase() : '';

    const user = await User.findById(userId).select('+githubAccessToken');
    if (!user || !user.githubAccessToken) {
        return res.status(403).json({
            success: false,
            code: 'GITHUB_CONNECTION_REQUIRED',
            message: 'Connect GitHub to import repositories into Velora.'
        });
    }

    let repos;
    try {
        repos = await fetchUserRepos(user.githubAccessToken);
    } catch (error) {
        if (String(error.message || '').toLowerCase().includes('github api error')) {
            return res.status(403).json({
                success: false,
                code: 'GITHUB_CONNECTION_REQUIRED',
                message: 'Reconnect GitHub to import repositories into Velora.'
            });
        }
        throw error;
    }
    if (searchQuery) {
        repos = repos.filter(repo => repo.name.toLowerCase().includes(searchQuery));
    }

    res.status(200).json({ success: true, count: repos.length, repos });
});

// @desc    Naya Project create karna (Save to DB)
// @route   POST /api/projects
exports.createProject = asyncHandler(async (req, res) => {
    const { name, repoUrl, branch, installCommand, startCommand } = req.body;
    const resolvedRepoName = String(req.body.repoName || '').trim() || parseRepoNameFromUrl(repoUrl);

    // 1. Validation
    if (!name || !repoUrl || !resolvedRepoName) {
        res.status(400);
        throw new Error('Please provide name, repoUrl, and repoName');
    }

    // 2. Check for duplicate project (same repo for same user)
    const existingProject = await Project.findOne({ 
        repoUrl, 
        owner: req.user.id, 
        isDeleted: false 
    });

    if (existingProject) {
        res.status(400);
        throw new Error('You have already added this repository as a project.');
    }

    // 3. Create Project
    const project = await Project.create({
        name,
        repoUrl,
        repoName: resolvedRepoName,
        branch: branch || 'main',
        owner: req.user.id,
        installCommand: installCommand || 'npm install',
        startCommand: startCommand || 'npm start'
    });

    res.status(201).json({ success: true, data: project });
});

// @desc    User ke saare active projects lana
// @route   GET /api/projects
exports.getUserProjects = asyncHandler(async (req, res) => {
    // Sirf wahi projects laao jo is user ke hain aur delete nahi hue hain
    const projects = await Project.find({ 
        owner: req.user.id, 
        isDeleted: false 
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: projects.length, data: projects });
});

// @desc    Single project detail lana
// @route   GET /api/projects/:id
exports.getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findOne({ 
        _id: req.params.id, 
        owner: req.user.id, 
        isDeleted: false 
    });

    if (!project) {
        res.status(404);
        throw new Error('Project not found or you are not the owner');
    }

    res.status(200).json({ success: true, data: project });
});

// @desc    Update project detail
// @route   PUT /api/projects/:id
exports.updateProject = asyncHandler(async (req, res) => {
    let project = await Project.findOne({ 
        _id: req.params.id, 
        owner: req.user.id, 
        isDeleted: false 
    });

    if (!project) {
        res.status(404);
        throw new Error('Project not found or you are not the owner');
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: project });
});

// @desc    Get dashboard stats
// @route   GET /api/projects/stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const Project = require('../models/Project');
    const Deployment = require('../models/Deployment');

    const totalProjects = await Project.countDocuments({ owner: userId, isDeleted: false });
    const projectIds = (await Project.find({ owner: userId, isDeleted: false }).select('_id')).map(p => p._id);
    const deployments = await Deployment.find({ projectId: { $in: projectIds } })
        .select('status buildDuration startedAt completedAt');

    const deploymentsCount = deployments.length;
    const successCount = deployments.filter(deployment => ['running', 'stopped'].includes(deployment.status)).length;
    const successRate = deploymentsCount > 0 ? ((successCount / deploymentsCount) * 100).toFixed(1) : "0";
    const durations = deployments
        .map(deployment => {
            if (typeof deployment.buildDuration === 'number' && deployment.buildDuration > 0) {
                return deployment.buildDuration;
            }
            if (deployment.startedAt && deployment.completedAt) {
                return new Date(deployment.completedAt).getTime() - new Date(deployment.startedAt).getTime();
            }
            return 0;
        })
        .filter(duration => duration > 0);
    const avgMs = durations.length ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length : 0;
    const avgSeconds = Math.round(avgMs / 1000);
    const avgBuildTime = avgSeconds >= 60
        ? `${Math.floor(avgSeconds / 60)}m ${avgSeconds % 60}s`
        : `${avgSeconds}s`;

    res.status(200).json({
        success: true,
        stats: {
            totalProjects,
            totalDeployments: deploymentsCount,
            successRate: successRate + "%",
            avgBuildTime
        }
    });
});

// @desc    Project delete karna (Hard Delete)
// @route   DELETE /api/projects/:id
exports.deleteProject = asyncHandler(async (req, res) => {
    const { deleteRemoteRepo = false, confirmationName = '' } = req.body || {};
    const project = await Project.findOne({ 
        _id: req.params.id, 
        owner: req.user.id 
    });

    if (!project) {
        res.status(404);
        throw new Error('Project not found or you are not authorized to delete it');
    }

    if (String(confirmationName).trim() !== String(project.name).trim()) {
        res.status(400);
        throw new Error(`Type "${project.name}" to confirm project deletion`);
    }

    let remoteRepoDeleted = false;

    if (project.activeDeploymentId) {
        const activeDeployment = await Deployment.findById(project.activeDeploymentId).select('status');
        if (activeDeployment && ['queued', 'building', 'running', 'rolling_back'].includes(activeDeployment.status)) {
            await stopDeployment(project.activeDeploymentId);
        }
    }

    if (deleteRemoteRepo) {
        const user = await User.findById(req.user.id).select('+githubAccessToken');
        if (!user?.githubAccessToken) {
            res.status(400);
            throw new Error('Connect GitHub before deleting the linked repository.');
        }

        if (!project.repoName) {
            res.status(400);
            throw new Error('This project does not have a linked GitHub repository name.');
        }

        await deleteGithubRepo(user.githubAccessToken, project.repoName);
        remoteRepoDeleted = true;
    }

    await Promise.all([
        Deployment.deleteMany({ projectId: project._id }),
        Integration.deleteMany({ projectId: project._id }),
        EnvVar.deleteMany({ projectId: project._id })
    ]);

    await Project.deleteOne({ _id: project._id });

    res.status(200).json({
        success: true,
        message: remoteRepoDeleted
            ? 'Project records and GitHub repository removed successfully'
            : 'Project records removed successfully',
        data: {
            remoteRepoDeleted
        }
    });
});
