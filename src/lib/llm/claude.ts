import Anthropic from "@anthropic-ai/sdk";
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

class ClaudeProvider implements LLMProvider {
  readonly name = "claude";
  readonly defaultModel = "claude-sonnet-4-20250514";

  async generate(params: GenerationParams, apiKey: string): Promise<GenerationResult> {
    const client = new Anthropic({ apiKey });
    const prompt = buildGenerationPrompt(params);

    const response = await client.messages.create({
      model: this.defaultModel,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    const parsed = parseJsonFromResponse(text);

    return {
      ...parsed,
      provider: this.name,
      model: this.defaultModel,
    };
  }
}

export const claudeProvider = new ClaudeProvider();
