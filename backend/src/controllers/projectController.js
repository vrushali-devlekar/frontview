// and ye phase 3 hai - imlementing the project management features and soft deletion of projects. if user se galti se delete ho gaya ho project so ham use database se pura nahi uda denge sirf value tru kr denge taki if use wapas chahiye ye tho wapas se recover kr pay ..
// controllers/projectController.js
const Project = require('../models/Project');
const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/User');
const { fetchUserRepos } = require('../services/repoService'); // Nayi service import ki

// @desc    Get user's GitHub repositories
// @route   GET /api/projects/repos
// @access  Private
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
    const { name, repoUrl, repoName, branch, installCommand, startCommand } = req.body;

    // 1. Validation
    if (!name || !repoUrl || !repoName) {
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
        repoName,
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
    const totalDeployments = await Deployment.countDocuments({ triggeredBy: userId }); // or owner via project
    
    // For simplicity, let's just count all deployments for now or filter by user projects
    // Better: get all projects ids, then count deployments
    const projectIds = (await Project.find({ owner: userId, isDeleted: false }).select('_id')).map(p => p._id);
    const deploymentsCount = await Deployment.countDocuments({ project: { $in: projectIds } });
    const successCount = await Deployment.countDocuments({ project: { $in: projectIds }, status: 'SUCCESS' });
    
    const successRate = deploymentsCount > 0 ? ((successCount / deploymentsCount) * 100).toFixed(1) : "0";

    res.status(200).json({
        success: true,
        stats: {
            totalProjects,
            totalDeployments: deploymentsCount,
            successRate: successRate + "%",
            avgBuildTime: "42s" // hardcoded for now or calculate from logs
        }
    });
});

// @desc    Project delete karna (Soft Delete)
// @route   DELETE /api/projects/:id
exports.deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findOne({ 
        _id: req.params.id, 
        owner: req.user.id 
    });

    if (!project) {
        res.status(404);
        throw new Error('Project not found or you are not authorized to delete it');
    }

    // Soft delete logic: data rahega par list me nahi dikhega
    project.isDeleted = true;
    await project.save();

    res.status(200).json({ success: true, message: 'Project removed successfully' });
});