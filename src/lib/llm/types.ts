export interface GenerationParams {
  idea: string;
  tone: string;
  targetAudience: string;
  brandVoice: string;
  maxLength: number;
  hashtagCount: number;
  emojiLimit: number;
  additionalContext?: string;
}

export interface GenerationResult {
  content: string;
  hashtags: string[];
  coaching: {
    strengths: string[];
    improvements: string[];
    algorithmTips: string[];
    engagementPrediction: string;
  };
  scores: {
    overall: number;
    engagement: number;
    clarity: number;
    hook: number;
    replyPotential: number;
    controversyRisk: number;
  };
  provider: string;
  model: string;
}

export interface LLMProvider {
  generate(params: GenerationParams, apiKey: string): Promise<GenerationResult>;
  readonly name: string;
  readonly defaultModel: string;
}
