import OpenAI from "openai";
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

class GrokProvider implements LLMProvider {
  readonly name = "grok";
  readonly defaultModel = "grok-3";

  async generate(params: GenerationParams, apiKey: string): Promise<GenerationResult> {
    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.x.ai/v1",
    });
    const prompt = buildGenerationPrompt(params);

    const response = await client.chat.completions.create({
      model: this.defaultModel,
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content:
            "あなたはXプラットフォームに精通したAIです。ウィットに富み、Xの文化やトレンドを熟知した投稿を作成します。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.choices[0]?.message?.content || "";
    const parsed = parseJsonFromResponse(text);

    return {
      ...parsed,
      provider: this.name,
      model: this.defaultModel,
    };
  }
}

export const grokProvider = new GrokProvider();
