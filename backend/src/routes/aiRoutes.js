// routes/aiRoutes.js — AI Streaming Diagnostics (SSE) with Fallback
const express = require('express');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// @desc    Diagnose error logs with Multi-AI Fallback (SSE streaming)
// @route   POST /api/ai/diagnose
// @access  Private (JWT required)
router.post('/diagnose', protect, async (req, res) => {
    const { errorLogs } = req.body;

    if (!errorLogs) {
        return res.status(400).json({ message: 'errorLogs field is required' });
    }

    // 1. SSE Headers
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    try {
        res.write(`data: ${JSON.stringify({ text: "[🔄 ENGINE: VELORA_AI_ANALYZING]\n\n" })}\n\n`);

        const { analyzeLogsWithAI } = require('../services/logAnalysisService');
        // Gemini removed, using Cohere as default stable provider
        const result = await analyzeLogsWithAI(errorLogs, 'cohere');
        
        let text = '';
        if (typeof result === 'string') text = result;
        else if (result.markdown) text = result.markdown;
        else {
            text = `### 🔍 Root Cause Analysis\n${result.rootCause || 'No specific root cause identified.'}\n\n`;
            if (result.stepByStepFix && result.stepByStepFix.length > 0) {
                text += `### 🛠️ How to Fix (Step-by-Step)\n`;
                result.stepByStepFix.forEach((step, idx) => text += `${idx + 1}. ${step}\n`);
                text += '\n';
            }
            if (result.securityFlags && result.securityFlags.length > 0) {
                text += `### 🚨 Security Warnings\n`;
                result.securityFlags.forEach(flag => text += `- ⚠️ **${flag}**\n`);
                text += '\n';
            }
        }
        
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error("AI Streaming Error:", error);
        res.write(`data: ${JSON.stringify({ text: "\n\n### ❌ SYSTEM_ERROR\nAI Diagnostics failed. Please ensure COHERE_API_KEY is valid." })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
    }
});

module.exports = router;
