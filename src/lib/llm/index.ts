import { claudeProvider } from "./claude";
import { chatgptProvider } from "./chatgpt";
import { geminiProvider } from "./gemini";
import { grokProvider } from "./grok";
import type { LLMProvider } from "./types";

export type { GenerationParams, GenerationResult, LLMProvider } from "./types";

export const providers: Record<string, LLMProvider> = {
  claude: claudeProvider,
  chatgpt: chatgptProvider,
  gemini: geminiProvider,
  grok: grokProvider,
};

export function getProvider(name: string): LLMProvider {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unknown LLM provider: ${name}`);
  }
  return provider;
}

export const providerList = [
  { id: "claude", name: "Claude", description: "論理的・分析的・構造化" },
  { id: "chatgpt", name: "ChatGPT", description: "クリエイティブ・多様な表現" },
  { id: "gemini", name: "Gemini", description: "データドリブン・トレンド分析" },
  { id: "grok", name: "Grok", description: "ウィット・X文化に精通" },
];
