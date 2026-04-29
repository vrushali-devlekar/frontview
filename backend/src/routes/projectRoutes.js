// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getUserRepos, 
    createProject, 
    getUserProjects, 
    getProjectById, 
    deleteProject 
} = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');

// Sabhi routes protected hain (JWT Token zaroori hai)
router.use(protect);

// Repos list (GitHub se real-time)
router.get('/repos', getUserRepos);

// Projects CRUD (Database se)
router.route('/')
    .get(getUserProjects)
    .post(createProject);

router.route('/:id')
    .get(getProjectById)
    .delete(deleteProject);

module.exports = router;