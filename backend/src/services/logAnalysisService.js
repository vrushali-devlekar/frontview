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
            return new ChatMistralAI({
                apiKey: process.env.MISTRAL_API_KEY,
                model: 'mistral-large-latest',
                temperature: 0.2
            });
        }
        case 'cohere': {
            const { ChatCohere } = require('@langchain/cohere');
            return new ChatCohere({
                apiKey: process.env.COHERE_API_KEY,
                model: 'command-a-03-2025',
                temperature: 0.2
            });
        }
        case 'gemini':
        default: {
            const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
            return new ChatGoogleGenerativeAI('gemini-2.0-flash', {
                apiKey: process.env.GEMINI_API_KEY,
                temperature: 0.2
            });
        }
    }
};

const analyzeLogsWithAI = async (logs, provider = 'gemini') => {

    const { PromptTemplate } = require('@langchain/core/prompts');

    const logsToAnalyze = Array.isArray(logs) ? logs.slice(-200).join('\n') : logs.split('\n').slice(-200).join('\n');

    const promptText = `You are a senior DevOps engineer. Analyze this deployment log and: 1) identify the root cause, 2) provide a step-by-step fix, 3) flag any security issues. 
    Provide the response in the following structured JSON format:
    {{
        "rootCause": "string",
        "stepByStepFix": ["string", "string"],
        "securityFlags": ["string", "string"]
    }}

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

    return parsedResult;
};

const analyzeWithFallback = async (logs) => {
    const providers = ['gemini', 'cohere', 'mistral'];

    for (const provider of providers) {
        try {
            console.log(` Requesting AI Provider: [${provider.toUpperCase()}]...`);

            const result = await analyzeLogsWithAI(logs, provider);
            console.log(`✅ Success! Analysis completed by [${provider.toUpperCase()}].`);
            return result;

        } catch (error) {
            console.log(`⚠️ [${provider.toUpperCase()}] Failed: ${error.message.substring(0, 50)}...`);
            console.log(`🔄 Auto-switching to the next available AI...`);
        }
    }

    console.log(` All AI Providers failed.`);
    return {
        rootCause: "Our AI systems are currently facing exceptionally high traffic and are rate-limited.",
        stepByStepFix: [
            "Please review the raw terminal logs provided above manually.",
            "Try hitting the 'Analyze Again' button in a few minutes."
        ],
        securityFlags: []
    };
};


module.exports = {
    analyzeLogsWithAI: analyzeWithFallback
};