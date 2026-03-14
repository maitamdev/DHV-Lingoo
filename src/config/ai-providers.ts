export const AI_PROVIDERS = {
  OPENAI: { name: 'OpenAI', models: ['gpt-4o-mini', 'gpt-4o'], default: 'gpt-4o-mini' },
  GEMINI: { name: 'Google Gemini', models: ['gemini-2.0-flash', 'gemini-1.5-pro'], default: 'gemini-2.0-flash' },
  GROQ: { name: 'Groq', models: ['llama-3.1-70b-versatile'], default: 'llama-3.1-70b-versatile' },
} as const;

export const DEFAULT_AI_CONFIG = {
  temperature: 0.7,
  maxTokens: 1024,
  topP: 0.9,
};