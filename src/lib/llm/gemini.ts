import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildGenerationPrompt } from "@/lib/prompts/system-prompt";
import type { GenerationParams, GenerationResult, LLMProvider } from "./types";

function parseJsonFromResponse(text: string): Omit<GenerationResult, "provider" | "model"> {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      content: text.trim(),
      hashtags: [],
      coaching: { strengths: [], improvements: [], algorithmTips: [], engagementPrediction: "" },
      scores: { overall: 0.5, engagement: 0.5, clarity: 0.5, hook: 0.5, replyPotential: 0.5, controversyRisk: 0.3 },
    };
  }
  const jsonStr = jsonMatch[1] || jsonMatch[0];
  const data = JSON.parse(jsonStr);
  return {
    content: data.content || "",
    hashtags: data.hashtags || [],
    coaching: {
      strengths: data.coaching?.strengths || [],
      improvements: data.coaching?.improvements || [],
      algorithmTips: data.coaching?.algorithmTips || [],
      engagementPrediction: data.coaching?.engagementPrediction || "",
    },
    scores: {
      overall: data.scores?.overall || 0.5,
      engagement: data.scores?.engagement || 0.5,
      clarity: data.scores?.clarity || 0.5,
      hook: data.scores?.hook || 0.5,
      replyPotential: data.scores?.replyPotential || 0.5,
      controversyRisk: data.scores?.controversyRisk || 0.3,
    },
  };
}

class GeminiProvider implements LLMProvider {
  readonly name = "gemini";
  readonly defaultModel = "gemini-2.0-flash";

  async generate(params: GenerationParams, apiKey: string): Promise<GenerationResult> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: this.defaultModel });
    const prompt = buildGenerationPrompt(params);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const parsed = parseJsonFromResponse(text);

    return {
      ...parsed,
      provider: this.name,
      model: this.defaultModel,
    };
  }
}

export const geminiProvider = new GeminiProvider();
