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

class ChatGPTProvider implements LLMProvider {
  readonly name = "chatgpt";
  readonly defaultModel = "gpt-4o";

  async generate(params: GenerationParams, apiKey: string): Promise<GenerationResult> {
    const client = new OpenAI({ apiKey });
    const prompt = buildGenerationPrompt(params);

    const response = await client.chat.completions.create({
      model: this.defaultModel,
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content:
            "あなたはバズるX投稿の作成に特化したAIです。クリエイティブで読者の心に刺さる表現を得意とします。",
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

export const chatgptProvider = new ChatGPTProvider();
