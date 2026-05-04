const PROVIDER_ENV_KEYS = {
    mistral: 'MISTRAL_API_KEY',
    cohere: 'COHERE_API_KEY',
    gemini: 'GEMINI_API_KEY',
    grok: 'GROK_API_KEY'
};

const SUPPORTED_PROVIDERS = ['mistral', 'cohere', 'gemini', 'grok'];

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

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        text = text.slice(firstBrace, lastBrace + 1).trim();
    }

    return text;
};

const parseApiKeys = (rawValue) =>
    String(rawValue || '')
        .split(',')
        .map((key) => key.trim())
        .filter(Boolean);

const normalizeProvider = (provider) => {
    const selected = String(provider || 'mistral').toLowerCase().trim();
    return SUPPORTED_PROVIDERS.includes(selected) ? selected : 'mistral';
};

const getProviderConfig = (provider) => {
    const selected = normalizeProvider(provider);
    const envName = PROVIDER_ENV_KEYS[selected] || PROVIDER_ENV_KEYS.mistral;
    const apiKeys = parseApiKeys(process.env[envName]);

    if (apiKeys.length === 0) {
        throw new Error(`Missing ${envName}`);
    }

    return { selected, envName, apiKeys };
};

const createModelForProvider = (provider, apiKey) => {
    const selected = normalizeProvider(provider);

    switch (selected) {
        case 'mistral': {
            const { ChatMistralAI } = require('@langchain/mistralai');
            return new ChatMistralAI({
                apiKey,
                model: 'mistral-large-latest',
                temperature: 0.2
            });
        }
        case 'cohere': {
            const { ChatCohere } = require('@langchain/cohere');
            return new ChatCohere({
                apiKey,
                model: 'command-a-03-2025',
                temperature: 0.2
            });
        }
        case 'gemini':
            {
            const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
            return new ChatGoogleGenerativeAI({
                model: 'gemini-2.0-flash',
                apiKey,
                temperature: 0.2
            });
        }
        default:
            return null;
    }
};

const invokeGrokChatCompletion = async (apiKey, prompt) => {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: process.env.GROK_MODEL || 'grok-4.20-reasoning',
            messages: [
                {
                    role: 'user',
                    content: String(prompt || '')
                }
            ],
            stream: false,
            temperature: 0.2
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Grok request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content =
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.message ||
        '';

    return { content };
};

const isKeyRotationCandidate = (error) => {
    const message = String(error?.message || '').toLowerCase();
    return [
        'rate limit',
        'quota',
        'too many requests',
        '429',
        'credit',
        'exceeded',
        'api key',
        'unauthorized',
        'forbidden',
        'resource exhausted'
    ].some((fragment) => message.includes(fragment));
};

const invokeProviderWithKeyRotation = async (provider, promptTemplate, variables) => {
    const { selected, envName, apiKeys } = getProviderConfig(provider);
    const failures = [];

    for (let index = 0; index < apiKeys.length; index += 1) {
        const apiKey = apiKeys[index];
        try {
            if (apiKeys.length > 1) {
                console.log(`[AI ${selected.toUpperCase()}] Trying API key ${index + 1}/${apiKeys.length}`);
            }

            if (selected === 'grok') {
                const formattedPrompt = await promptTemplate.format(variables);
                return await invokeGrokChatCompletion(apiKey, formattedPrompt);
            }

            const model = createModelForProvider(selected, apiKey);
            if (!model) {
                throw new Error(`Unsupported provider: ${selected}`);
            }

            const chain = promptTemplate.pipe(model);
            return await chain.invoke(variables);
        } catch (error) {
            const message = error?.message || 'Unknown error';
            failures.push(`key ${index + 1}: ${message}`);

            if (index < apiKeys.length - 1) {
                const reason = isKeyRotationCandidate(error)
                    ? 'rate/quota/auth issue'
                    : 'provider request failure';
                console.warn(`[AI ${selected.toUpperCase()}] Key ${index + 1} failed (${reason}), rotating to next key`);
                continue;
            }

            throw new Error(`${selected.toUpperCase()} failed for all configured keys in ${envName}: ${failures.join(' | ')}`);
        }
    }

    throw new Error(`${selected.toUpperCase()} has no usable API keys configured in ${envName}`);
};

const analyzeLogsWithProvider = async (logs, provider = 'mistral', question = '') => {
    const { PromptTemplate } = require('@langchain/core/prompts');

    const logsToAnalyze = Array.isArray(logs)
        ? logs.slice(-200).join('\n')
        : String(logs || '').split('\n').slice(-200).join('\n');

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
    const response = await invokeProviderWithKeyRotation(provider, promptTemplate, {
        logs: logsToAnalyze,
        question: String(question || '').trim()
    });

    if (isFollowUp) {
        const markdown = normalizeModelContent(response.content) || '';
        return { markdown };
    }

    try {
        let content = normalizeModelContent(response.content);
        if (!content) {
            throw new Error('AI response was empty');
        }
        content = extractLikelyJson(content);
        return JSON.parse(content);
    } catch (error) {
        console.error('Error parsing AI response:', error);
        return {
            rootCause: 'Failed to parse AI response.',
            stepByStepFix: [],
            securityFlags: [],
            rawOutput: response.content
        };
    }
};

const analyzeWithFallback = async (logs, preferredProvider, question) => {
    const preferred = normalizeProvider(preferredProvider);
    const providers = [...SUPPORTED_PROVIDERS];
    const ordered = preferred && providers.includes(preferred)
        ? [preferred, ...providers.filter((provider) => provider !== preferred)]
        : providers;

    const failures = [];

    for (const provider of ordered) {
        try {
            console.log(`Requesting AI Provider: [${provider.toUpperCase()}]...`);
            const result = await analyzeLogsWithProvider(logs, provider, question);
            console.log(`Success! Analysis completed by [${provider.toUpperCase()}].`);
            return result;
        } catch (error) {
            console.log(`[${provider.toUpperCase()}] Failed: ${String(error.message || '').substring(0, 120)}...`);
            console.log('Auto-switching to the next available AI...');
            failures.push({
                provider,
                reason: error?.message || 'Unknown error'
            });
        }
    }

    console.log('All AI providers failed.');
    return {
        rootCause: 'All configured AI providers failed to respond.',
        stepByStepFix: [
            ...failures.map((failure) => `${failure.provider}: ${failure.reason}`),
            'Verify API keys and model access for the selected provider.',
            'If you use multiple keys, confirm they are comma-separated with no extra quotes around the whole list.',
            'Retry analysis after resolving provider-specific errors.'
        ],
        securityFlags: [],
        rawOutput: failures.map((failure) => `[${failure.provider}] ${failure.reason}`).join('\n')
    };
};

module.exports = {
    analyzeLogsWithAI: analyzeWithFallback
};
