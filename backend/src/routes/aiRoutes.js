const express = require('express');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

const normalizeModelText = (content) => {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === 'string') return part;
                if (typeof part?.text === 'string') return part.text;
                if (typeof part?.content === 'string') return part.content;
                return '';
            })
            .join('\n');
    }
    return String(content || '');
};

const toReadableStructuredText = (text) =>
    String(text || '')
        .replace(/\r/g, '')
        .replace(/^#{1,6}\s*/gm, '')
        .replace(/\*\*/g, '')
        .replace(/```/g, '')
        .replace(/`/g, '')
        .trim();

router.post('/diagnose', protect, async (req, res) => {
    const { errorLogs, provider = 'mistral' } = req.body;

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
        const result = await analyzeLogsWithAI(errorLogs, provider);

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
router.post('/chat', protect, async (req, res) => {
    const { message, context, provider = 'mistral' } = req.body;

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
        const logsText = Array.isArray(context) ? context.join('\n') : context;
        const response = await analyzeLogsWithAI(logsText || 'No logs available', provider, message);
        const structured = toReadableStructuredText(
            typeof response === 'string'
                ? response
                : response?.markdown || response?.rawOutput || response?.rootCause || ''
        );
        res.write(`data: ${JSON.stringify({ text: structured })}\n\n`);
        
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
