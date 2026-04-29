// routes/projectRoutes.js
import express from 'express';
const router = express.Router();
import { 
    getUserRepos, 
    createProject, 
    getUserProjects, 
    getProjectById, 
    deleteProject 
} from '../controllers/projectController.js';
import { protect } from '../middlewares/authMiddleware.js';

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

export default router;