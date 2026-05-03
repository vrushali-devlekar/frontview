// routes/envRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { addEnvVar, getEnvVars, deleteEnvVar } = require('../controllers/envController');

// Dhyan de: Hum isko app.js me '/api/projects' par mount karenge
// Toh iska actual path ban jayega: /api/projects/:id/env

    .get(protect, getEnvVars);  // Saare variables (masked) dekhne ke liye

router.delete('/:id/env/:key', protect, deleteEnvVar);

module.exports = router;