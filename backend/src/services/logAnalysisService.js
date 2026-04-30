const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatCohere } = require('@langchain/cohere');
const { ChatMistralAI } = require('@langchain/mistralai');
const { PromptTemplate } = require('@langchain/core/prompts');

const analyzeLogsWithAI = async (logs, provider = 'gemini') => {
    // We will give up to 200 lines of logs
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
    
    let model;

    switch (provider.toLowerCase()) {
        case 'mistral':
            model = new ChatMistralAI({
                apiKey: process.env.MISTRAL_API_KEY,
                modelName: 'mistral-large-latest',
                temperature: 0.2
            });
            break;
        case 'cohere':
            model = new ChatCohere({
                apiKey: process.env.COHERE_API_KEY,
                model: 'command-a-03-2025',
                temperature: 0.2
            });
            break;
        case 'gemini':
        default:
            model = new ChatGoogleGenerativeAI({
                apiKey: process.env.GEMINI_API_KEY,
                modelName: 'gemini-flash-latest',
                temperature: 0.2
            });
            break;
    }

    const chain = promptTemplate.pipe(model);
    const response = await chain.invoke({ logs: logsToAnalyze });
    
    // Parse the JSON output from the model
    let parsedResult;
    try {
        let content = response.content.trim();
        if (content.startsWith('```json')) {
            content = content.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (content.startsWith('```')) {
            content = content.replace(/^```/, '').replace(/```$/, '').trim();
        }
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

module.exports = {
    analyzeLogsWithAI
};
