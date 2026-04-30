// routes/envRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { addEnvVar, getEnvVars } = require('../controllers/envController');

// Dhyan de: Hum isko app.js me '/api/projects' par mount karenge
// Toh iska actual path ban jayega: /api/projects/:id/env

router.route('/:id/env')
    .post(protect, addEnvVar)   // Naya variable add/update karne ke liye
    .get(protect, getEnvVars);  // Saare variables (masked) dekhne ke liye

module.exports = router;