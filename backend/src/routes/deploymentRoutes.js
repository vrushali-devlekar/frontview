// routes/deploymentRoutes.js
const express = require('express');
const router = express.Router();
const { triggerDeployment, getDeploymentStatus, stopActiveDeployment, analyzeLogs } = require('../controllers/deploymentController');
const { protect } = require('../middlewares/authMiddleware');

// Sabhi deployment actions protected hone chahiye
router.use(protect);

router.post('/', triggerDeployment);
router.get('/:id', getDeploymentStatus);
router.post('/:id/stop', stopActiveDeployment);
router.post('/:id/analyze-logs', analyzeLogs);

module.exports = router;