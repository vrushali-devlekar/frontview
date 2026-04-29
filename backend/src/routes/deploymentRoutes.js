// routes/deploymentRoutes.js
import express from 'express'
const router = express.Router();
import { triggerDeployment, getDeploymentStatus, stopActiveDeployment } from '../controllers/deploymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

// Sabhi deployment actions protected hone chahiye
router.use(protect);

router.post('/', triggerDeployment);
router.get('/:id', getDeploymentStatus);
router.post('/:id/stop', stopActiveDeployment);

export default router;