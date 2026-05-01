const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatCohere } = require('@langchain/cohere');
const { ChatMistralAI } = require('@langchain/mistralai');
const { PromptTemplate } = require('@langchain/core/prompts');
const crypto = require('crypto');

const ANALYSIS_CACHE_TTL_MS = 5 * 60 * 1000;
const analysisCache = new Map();

const stableHash = (text) =>
    crypto.createHash('sha256').update(String(text || ''), 'utf8').digest('hex');

const IMPORTANT_PATTERNS = [
    /(\berror\b|\bfailed\b|\bfailure\b|\bexception\b|\btrace\b)/i,
    /(\bnpm\s+err\b|\byarn\s+err\b|\bpnpm\b|\bnode:\b|\bE[A-Z0-9_]{3,}\b)/i,
    /(\bwarn\b|\bwarning\b|\bdeprecated\b)/i,
    /(exit code|returned non-zero|killed|SIGTERM|SIGKILL)/i,
];

const buildSignalExcerpt = (rawLogs) => {
    const lines = Array.isArray(rawLogs)
        ? rawLogs.flatMap((entry) => String(entry || '').split('\n'))
        : String(rawLogs || '').split('\n');

    const trimmed = lines.map((l) => l.trimEnd()).filter(Boolean);
    if (trimmed.length === 0) return '';

    const window = 2;
    const selected = new Set();

    for (let i = 0; i < trimmed.length; i += 1) {
        const line = trimmed[i];
        if (IMPORTANT_PATTERNS.some((re) => re.test(line))) {
            for (let j = Math.max(0, i - window); j <= Math.min(trimmed.length - 1, i + window); j += 1) {
                selected.add(j);
            }
        }
    }

    const tailCount = 140;
    for (let i = Math.max(0, trimmed.length - tailCount); i < trimmed.length; i += 1) {
        selected.add(i);
    }

    const indices = Array.from(selected).sort((a, b) => a - b);
    const maxLines = 220;
    const final = indices.slice(Math.max(0, indices.length - maxLines)).map((i) => trimmed[i]);
    return final.join('\n');
};

const getCachedAnalysis = (cacheKey) => {
    const entry = analysisCache.get(cacheKey);
    if (!entry) return null;
    if (Date.now() - entry.createdAt > ANALYSIS_CACHE_TTL_MS) {
        analysisCache.delete(cacheKey);
        return null;
    }
    return entry.value;
};

const setCachedAnalysis = (cacheKey, value) => {
    analysisCache.set(cacheKey, { createdAt: Date.now(), value });
};

const normalizeModelContent = (content) => {
    if (typeof content === 'string') return content.trim();
    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === 'string') return part;
                if (typeof part?.text === 'string') return part.text;
                if (typeof part?.content === 'string') return part.content;
                return '';
            })
            .join('\n')
            .trim();
    }
    return String(content || '').trim();
};

const extractLikelyJson = (raw) => {
    let text = raw.trim();

    if (text.startsWith('```json')) {
        text = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
    } else if (text.startsWith('```')) {
        text = text.replace(/^```/i, '').replace(/```$/i, '').trim();
    }

    // If extra explanation text exists, isolate the first JSON object body.
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        text = text.slice(firstBrace, lastBrace + 1).trim();
    }

    return text;
};

const createModelForProvider = (provider) => {
    const selected = (provider || 'gemini').toLowerCase();

    switch (selected) {
        case 'mistral': {
            if (!process.env.MISTRAL_API_KEY) {
                const err = new Error('MISTRAL_API_KEY is missing in environment');
                err.statusCode = 400;
                throw err;
            }
            return new ChatMistralAI({
                apiKey: process.env.MISTRAL_API_KEY,
                // Quality-first, speed kept by curated excerpt + cache.
                model: 'mistral-large-latest',
                temperature: 0.2,
                maxTokens: 900
            });
        }
        case 'cohere': {
            if (!process.env.COHERE_API_KEY) {
                const err = new Error('COHERE_API_KEY is missing in environment');
                err.statusCode = 400;
                throw err;
            }
            return new ChatCohere({
                apiKey: process.env.COHERE_API_KEY,
                model: 'command-a-03-2025',
                temperature: 0.2,
                maxTokens: 900
            });
        }
        case 'gemini':
        default: {
            if (!process.env.GEMINI_API_KEY) {
                const err = new Error('GEMINI_API_KEY is missing in environment');
                err.statusCode = 400;
                throw err;
            }
            return new ChatGoogleGenerativeAI('gemini-2.0-flash', {
                apiKey: process.env.GEMINI_API_KEY,
                temperature: 0.2,
                maxOutputTokens: 900
            });
        }
    }
};

const analyzeLogsWithAI = async (logs, provider = 'gemini') => {
    // Keep latency stable WITHOUT sacrificing quality:
    // feed the model a signal-dense excerpt (errors/warns + tail + local context).
    const logsToAnalyze = buildSignalExcerpt(logs);

    const cacheKey = `${String(provider || 'gemini').toLowerCase()}:${stableHash(logsToAnalyze)}`;
    const cached = getCachedAnalysis(cacheKey);
    if (cached) return cached;

    const promptText = `You are a senior DevOps engineer. Analyze the deployment log and return ONLY valid JSON (no markdown, no code fences, no extra keys).

Schema (example JSON shape):
{{"rootCause":"string","stepByStepFix":["string"],"securityFlags":["string"]}}

Rules:
- Be specific and actionable; avoid vague advice.
- Keep each array to at most 8 items.
- Include exact commands/config snippets where relevant (but keep each item <= 220 chars).
- Root cause must cite 1-2 concrete log clues (error line, exit code, missing env var, etc.).

Deployment Logs:
{logs}`;

    const promptTemplate = PromptTemplate.fromTemplate(promptText);
    
    const model = createModelForProvider(provider);

    const chain = promptTemplate.pipe(model);
    const response = await chain.invoke({ logs: logsToAnalyze });
    
    // Parse the JSON output from the model
    let parsedResult;
    try {
        let content = normalizeModelContent(response.content);

        if (!content) {
            throw new Error('AI response was empty');
        }
        content = extractLikelyJson(content);
        parsedResult = JSON.parse(content);
    } catch (e) {
        console.error('Error parsing AI response:', e);
        parsedResult = {
            rootCause: 'Failed to parse AI response.',
            stepByStepFix: [],
            securityFlags: [],
            rawOutput: response.content
        };
    }

    setCachedAnalysis(cacheKey, parsedResult);
    return parsedResult;
};

module.exports = {
    analyzeLogsWithAI
};
