const express = require('express');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/diagnose', protect, async (req, res) => {
    const { errorLogs } = req.body;

    if (!errorLogs) {
        return res.status(400).json({ message: 'errorLogs field is required' });
    }

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
    });

    try {
        res.write(`data: ${JSON.stringify({ text: "[ENGINE: VELORA_AI_ANALYZING]\n\n" })}\n\n`);

        const { analyzeLogsWithAI } = require('../services/logAnalysisService');
        const result = await analyzeLogsWithAI(errorLogs, 'mistral');

        let text = '';
        if (typeof result === 'string') {
            text = result;
        } else if (result?.markdown) {
            text = result.markdown;
        } else {
            text = `### Root Cause Analysis\n${result?.rootCause || 'No specific root cause identified.'}\n\n`;
            if (Array.isArray(result?.stepByStepFix) && result.stepByStepFix.length > 0) {
                text += '### How to Fix\n';
                result.stepByStepFix.forEach((step, idx) => {
                    text += `${idx + 1}. ${step}\n`;
                });
                text += '\n';
            }
            if (Array.isArray(result?.securityFlags) && result.securityFlags.length > 0) {
                text += '### Security Warnings\n';
                result.securityFlags.forEach((flag) => {
                    text += `- ${flag}\n`;
                });
                text += '\n';
            }
        }

        res.write(`data: ${JSON.stringify({ text })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error('AI Streaming Error:', error);
        res.write(`data: ${JSON.stringify({ text: "\n\n### SYSTEM_ERROR\nAI diagnostics failed. Please verify your configured AI provider API keys." })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
    }
});

// @desc    General AI Chat for debugging and questions
// @route   POST /api/ai/chat
router.post('/chat', protect, async (req, res) => {
    const { message, context } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'message field is required' });
    }

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    try {
        const { analyzeLogsWithAI } = require('../services/logAnalysisService');
        // We'll repurpose analyzeLogsWithAI for chat by passing the message as the 'question'
        const result = await analyzeLogsWithAI(context || [], 'cohere', message);
        
        const text = typeof result === 'string' ? result : (result.markdown || result.rootCause || "I'm not sure how to answer that.");
        
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.write(`data: ${JSON.stringify({ text: "I'm having trouble connecting to my brain right now. Please try again later." })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
    }
});

module.exports = router;
