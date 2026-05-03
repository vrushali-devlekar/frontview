const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getWorkspaceOverview,
  getWorkspaceMetrics,
  getWorkspaceEnvironments,
  getWorkspaceNotifications,
  getWorkspaceMembers,
  inviteWorkspaceMember,
  searchWorkspace
} = require('../controllers/workspaceController');

router.use(protect);

router.get('/overview', getWorkspaceOverview);
router.get('/metrics', getWorkspaceMetrics);
router.get('/environments', getWorkspaceEnvironments);
router.get('/notifications', getWorkspaceNotifications);
router.get('/members', getWorkspaceMembers);
router.post('/members/invite', inviteWorkspaceMember);
router.get('/search', searchWorkspace);

module.exports = router;
