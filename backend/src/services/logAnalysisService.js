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
            const { ChatMistralAI } = require('@langchain/mistralai');
            if (!process.env.MISTRAL_API_KEY) {
                throw new Error('Missing MISTRAL_API_KEY');
            }
            return new ChatMistralAI({
                apiKey: process.env.MISTRAL_API_KEY,
                model: 'mistral-large-latest',
                temperature: 0.2
            });
        }
        case 'cohere': {
            const { ChatCohere } = require('@langchain/cohere');
            if (!process.env.COHERE_API_KEY) {
                throw new Error('Missing COHERE_API_KEY');
            }
            return new ChatCohere({
                apiKey: process.env.COHERE_API_KEY,
                model: 'command-a-03-2025',
                temperature: 0.2
            });
        }
        case 'gemini':
        default: {
            const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
            if (!process.env.GEMINI_API_KEY) {
                throw new Error('Missing GEMINI_API_KEY');
            }
            return new ChatGoogleGenerativeAI({
                model: 'gemini-2.0-flash',
                apiKey: process.env.GEMINI_API_KEY,
                temperature: 0.2
            });
        }
    }
};

const analyzeLogsWithAI = async (logs, provider = 'gemini', question = '') => {

    const { PromptTemplate } = require('@langchain/core/prompts');

    const logsToAnalyze = Array.isArray(logs) ? logs.slice(-200).join('\n') : logs.split('\n').slice(-200).join('\n');

    const isFollowUp = Boolean(question && String(question).trim());

    const promptText = isFollowUp
        ? `You are a senior DevOps engineer helping a junior developer. Using the deployment logs below, answer the user's question clearly in VERY SIMPLE English.
Write in concise Markdown with headings and bullet points. Include exact commands/config where helpful.

User question:
{question}

Deployment Logs:
{logs}`
        : `You are a senior DevOps engineer helping a junior developer. Analyze this deployment log and: 
1) Identify the root cause in VERY SIMPLE English.
2) Provide a step-by-step fix using exact commands or code changes.
3) Flag any security issues clearly.

Provide the response in the following structured JSON format:
{{
  "rootCause": "string",
  "stepByStepFix": ["string"],
  "securityFlags": ["string"]
}}

Deployment Logs:
{logs}`;

    const promptTemplate = PromptTemplate.fromTemplate(promptText);

    const model = createModelForProvider(provider);

    const chain = promptTemplate.pipe(model);
    const response = await chain.invoke({ logs: logsToAnalyze, question: String(question || '').trim() });

    // Follow-ups should be readable chat output, not forced JSON.
    if (isFollowUp) {
        const markdown = normalizeModelContent(response.content) || '';
        return { markdown };
    }

    // Parse the JSON output from the model (initial analysis)
    try {
        let content = normalizeModelContent(response.content);

        if (!content) {
            throw new Error('AI response was empty');
        }
        content = extractLikelyJson(content);
        return JSON.parse(content);
    } catch (e) {
        console.error('Error parsing AI response:', e);
        return {
            rootCause: 'Failed to parse AI response.',
            stepByStepFix: [],
            securityFlags: [],
            rawOutput: response.content
        };
    }
};

const analyzeWithFallback = async (logs, preferredProvider, question) => {
    const preferred = preferredProvider ? String(preferredProvider).toLowerCase() : '';
    const providers = ['gemini', 'cohere', 'mistral'];
    const ordered = preferred && providers.includes(preferred)
        ? [preferred, ...providers.filter(p => p !== preferred)]
        : providers;

    const failures = [];
    for (const provider of ordered) {
        try {
            console.log(` Requesting AI Provider: [${provider.toUpperCase()}]...`);

            const result = await analyzeLogsWithAI(logs, provider, question);
            console.log(`✅ Success! Analysis completed by [${provider.toUpperCase()}].`);
            return result;

        } catch (error) {
            console.log(`⚠️ [${provider.toUpperCase()}] Failed: ${error.message.substring(0, 50)}...`);
            console.log(`🔄 Auto-switching to the next available AI...`);
            failures.push({
                provider,
                reason: error?.message || 'Unknown error'
            });
        }
    }

    console.log(` All AI Providers failed.`);
    return {
        rootCause: "All configured AI providers failed to respond.",
        stepByStepFix: [
            ...failures.map((f) => `${f.provider}: ${f.reason}`),
            "Verify API keys and model access for the selected provider.",
            "Retry analysis after resolving provider-specific errors."
        ],
        securityFlags: [],
        rawOutput: failures.map((f) => `[${f.provider}] ${f.reason}`).join('\n')
    };
};


module.exports = {
    analyzeLogsWithAI: analyzeWithFallback
};