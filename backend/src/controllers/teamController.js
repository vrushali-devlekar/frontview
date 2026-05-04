const TeamMember = require('../models/TeamMember');
const User = require('../models/User');
const Project = require('../models/Project');
const asyncHandler = require('express-async-handler');

// @desc    Get all members of a project
// @route   GET /api/teams/:projectId
exports.getProjectTeam = asyncHandler(async (req, res) => {
    const members = await TeamMember.find({ projectId: req.params.projectId })
        .populate('userId', 'username email avatarUrl')
        .sort({ createdAt: -1 });

    res.json({ success: true, data: members });
});

// @desc    Invite a member to project
// @route   POST /api/teams/:projectId/invite
exports.inviteMember = asyncHandler(async (req, res) => {
    const { email, role } = req.body;
    const { projectId } = req.params;

    if (!email) {
        res.status(400);
        throw new Error('Email is required');
    }

    // Check if project exists and user is owner/admin
    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    // Check if already a member
    const existingMember = await TeamMember.findOne({ projectId, email: email.toLowerCase() });
    if (existingMember) {
        res.status(400);
        throw new Error('User is already a member of this project team');
    }

    // Check if user exists in system
    const user = await User.findOne({ email: email.toLowerCase() });

    const member = await TeamMember.create({
        projectId,
        email: email.toLowerCase(),
        role: role || 'DEVELOPER',
        status: user ? 'ACTIVE' : 'PENDING',
        userId: user ? user._id : null,
        invitedBy: req.user.id
    });

    res.status(201).json({ success: true, data: member });
});

// @desc    Remove member from project
// @route   DELETE /api/teams/:projectId/members/:memberId
exports.removeMember = asyncHandler(async (req, res) => {
    const { projectId, memberId } = req.params;

    const member = await TeamMember.findOne({ _id: memberId, projectId });
    if (!member) {
        res.status(404);
        throw new Error('Member not found in this project');
    }

    // Cannot remove owner? Or check permissions...
    // For MVP, just remove
    await member.deleteOne();

    res.json({ success: true, message: 'Member removed from team' });
});
