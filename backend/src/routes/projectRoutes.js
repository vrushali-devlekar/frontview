// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const {
    getUserRepos,
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    getDashboardStats,
    deleteProject,
    createProjectFromFolder
} = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');
const { rollbackDeployment } = require('../controllers/deploymentController');

// Sabhi routes protected hain (JWT Token zaroori hai)
router.use(protect);

// Repos list (GitHub se real-time)
router.get('/repos', getUserRepos);
router.get('/stats', getDashboardStats);

// Projects CRUD (Database se)
router.route('/')
    .get(getUserProjects)
    .post(createProject);

router.post('/upload', createProjectFromFolder);

router.route('/:id')
    .get(getProjectById)
    .put(updateProject)
    .delete(deleteProject);

router.post('/:id/rollback/:version', protect, rollbackDeployment);
router.post('/:id/deploy', protect, require('../controllers/projectController').deployProject);

module.exports = router;