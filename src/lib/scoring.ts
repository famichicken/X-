/**
 * Quality checks and composite scoring for tweet content.
 */

export interface QualityCheck {
  name: string;
  passed: boolean;
  score: number;
  message: string;
  severity: "info" | "warning" | "error";
}

export interface QualityCheckResult {
  checks: QualityCheck[];
  passed: boolean;
  overallScore: number;
  summary: string;
}

export interface QualityCheckOptions {
  maxCharacters?: number;
  maxHashtags?: number;
  maxEmojis?: number;
  customNgWords?: string[];
  allowExternalLinks?: boolean;
}

const DEFAULT_NG_WORDS = [
  "フォロバ",
  "相互フォロー",
  "フォロー返し",
  "いいね返し",
  "拡散希望",
  "リツイートお願い",
  "副業",
  "稼げる",
  "簡単に儲かる",
  "月収100万",
  "DMください",
  "LINE登録",
  "プレゼント企画",
  "無料配布",
  "限定公開",
  "今だけ無料",
  "guaranteed",
  "make money",
  "click here",
  "free giveaway",
];

const REPLY_INDUCING_PATTERNS = [
  /[？?]/, // question marks
  /あなたは[どう何なに]/,
  /どう思い?ますか/,
  /意見を?(聞|教|知)/,
  /みなさんは/,
  /皆さんは/,
  /あなたならどう/,
  /どっち派/,
  /選ぶなら/,
  /経験ありますか/,
  /やったことある/,
  /共感(する|できる|した)?人/,
  /当てはまる人/,
  /リプで教えて/,
  /コメント(で|して)/,
  /what do you think/i,
  /do you agree/i,
  /thoughts\??/i,
];

const HOOK_PATTERNS = [
  /^[【\[「『]/, // starts with brackets
  /^[0-9０-９]+[つ個選%％]/, // starts with numbers
  /^(実は|ぶっちゃけ|正直|衝撃|驚愕|速報|注意|重要|必見|保存版)/, // attention grabbers
  /^(知ってた|知らない人が多い|意外と知らない|99%の人が)/, // curiosity triggers
  /^(これ|この|あの|あれ)[はがを]/, // demonstrative hooks
  /^(.{1,15})[。\.]\n/, // short punchy first sentence
];

const EXTERNAL_LINK_PATTERN =
  /https?:\/\/(?!(?:twitter\.com|x\.com|t\.co))[^\s]+/;

const EMOJI_PATTERN =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{231A}-\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2614}-\u{2615}\u{2648}-\u{2653}\u{267F}\u{2693}\u{26A1}\u{26AA}-\u{26AB}\u{26BD}-\u{26BE}\u{26C4}-\u{26C5}\u{26CE}\u{26D4}\u{26EA}\u{26F2}-\u{26F3}\u{26F5}\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}]/gu;

function countEmojis(text: string): number {
  const matches = text.match(EMOJI_PATTERN);
  return matches ? matches.length : 0;
}

function countHashtags(text: string): number {
  const matches = text.match(/[#＃][^\s#＃]+/g);
  return matches ? matches.length : 0;
}

function checkCharacterCount(
  content: string,
  maxCharacters: number
): QualityCheck {
  const length = content.length;
  const passed = length <= maxCharacters;
  const ratio = Math.min(length / maxCharacters, 1);

  let score: number;
  if (length <= maxCharacters * 0.3) {
    score = 0.5; // too short
  } else if (length <= maxCharacters * 0.8) {
    score = 1.0; // good range
  } else if (length <= maxCharacters) {
    score = 0.8; // near limit but ok
  } else {
    score = Math.max(0, 1 - (length - maxCharacters) / maxCharacters);
  }

  let message: string;
  if (!passed) {
    message = `文字数が上限を超えています（${length}/${maxCharacters}文字）`;
  } else if (length <= maxCharacters * 0.3) {
    message = `文字数が少なすぎます（${length}/${maxCharacters}文字）。もう少し内容を充実させましょう`;
  } else {
    message = `文字数は適切です（${length}/${maxCharacters}文字）`;
  }

  return {
    name: "文字数チェック",
    passed,
    score,
    message,
    severity: passed ? (length <= maxCharacters * 0.3 ? "warning" : "info") : "error",
  };
}

function checkExternalLinks(
  content: string,
  allowExternalLinks: boolean
): QualityCheck {
  const hasExternalLink = EXTERNAL_LINK_PATTERN.test(content);
  const passed = allowExternalLinks || !hasExternalLink;

  return {
    name: "外部リンクチェック",
    passed,
    score: hasExternalLink ? 0.2 : 1.0,
    message: hasExternalLink
      ? "外部リンクが含まれています。Xアルゴリズムにより、リーチが大幅に制限されます"
      : "外部リンクなし。アルゴリズム的に最適です",
    severity: hasExternalLink ? "warning" : "info",
  };
}

function checkHashtagCount(
  content: string,
  maxHashtags: number
): QualityCheck {
  const count = countHashtags(content);
  const passed = count <= maxHashtags;

  let score: number;
  if (count === 0) {
    score = 0.7; // no hashtags is fine but could be better
  } else if (count <= 2) {
    score = 1.0; // optimal
  } else if (count <= maxHashtags) {
    score = 0.8;
  } else {
    score = Math.max(0, 1 - (count - maxHashtags) * 0.2);
  }

  let message: string;
  if (count > maxHashtags) {
    message = `ハッシュタグが多すぎます（${count}/${maxHashtags}個）。スパム判定のリスクがあります`;
  } else if (count === 0) {
    message = "ハッシュタグがありません。発見性を高めるために1〜2個の追加を検討してください";
  } else {
    message = `ハッシュタグ数は適切です（${count}個）`;
  }

  return {
    name: "ハッシュタグ数チェック",
    passed,
    score,
    message,
    severity: count > maxHashtags ? "warning" : "info",
  };
}

function checkReplyInducingElements(content: string): QualityCheck {
  const matchedPatterns = REPLY_INDUCING_PATTERNS.filter((pattern) =>
    pattern.test(content)
  );
  const count = matchedPatterns.length;

  let score: number;
  if (count === 0) {
    score = 0.2;
  } else if (count === 1) {
    score = 0.6;
  } else if (count <= 3) {
    score = 1.0;
  } else {
    score = 0.8; // too many can feel forced
  }

  return {
    name: "リプライ誘発要素チェック",
    passed: count > 0,
    score,
    message:
      count > 0
        ? `リプライ誘発要素が${count}個検出されました。会話を生みやすいツイートです`
        : "リプライ誘発要素がありません。質問や意見募集を追加すると、リプライ（27倍の重み）が増加します",
    severity: count === 0 ? "warning" : "info",
  };
}

function checkHookQuality(content: string): QualityCheck {
  const firstLine = content.split(/[\n。\.]/)[0] || "";
  const matchedHooks = HOOK_PATTERNS.filter((pattern) =>
    pattern.test(content)
  );
  const hasHook = matchedHooks.length > 0;
  const firstLineLength = firstLine.length;

  let score: number;
  if (hasHook && firstLineLength <= 30) {
    score = 1.0;
  } else if (hasHook) {
    score = 0.7;
  } else if (firstLineLength <= 20) {
    score = 0.5;
  } else {
    score = 0.3;
  }

  return {
    name: "フック品質チェック",
    passed: hasHook,
    score,
    message: hasHook
      ? "効果的なフックが検出されました。タイムラインでの注目度が高いです"
      : "フック要素が弱いです。冒頭に注目を引く表現（数字、括弧、衝撃的な一文）を追加しましょう",
    severity: hasHook ? "info" : "warning",
  };
}

function checkEmojiCount(content: string, maxEmojis: number): QualityCheck {
  const count = countEmojis(content);
  const passed = count <= maxEmojis;

  let score: number;
  if (count === 0) {
    score = 0.8; // fine without emojis
  } else if (count <= maxEmojis) {
    score = 1.0;
  } else {
    score = Math.max(0, 1 - (count - maxEmojis) * 0.15);
  }

  return {
    name: "絵文字数チェック",
    passed,
    score,
    message: passed
      ? `絵文字数は適切です（${count}個）`
      : `絵文字が多すぎます（${count}/${maxEmojis}個）。過度な絵文字はスパム感を与えます`,
    severity: passed ? "info" : "warning",
  };
}

function checkNgWords(
  content: string,
  customNgWords: string[]
): QualityCheck {
  const allNgWords = [...DEFAULT_NG_WORDS, ...customNgWords];
  const lowerContent = content.toLowerCase();
  const foundWords = allNgWords.filter((word) =>
    lowerContent.includes(word.toLowerCase())
  );
  const passed = foundWords.length === 0;

  return {
    name: "NGワードチェック",
    passed,
    score: passed ? 1.0 : Math.max(0, 1 - foundWords.length * 0.3),
    message: passed
      ? "NGワードは検出されませんでした"
      : `NGワードが検出されました: ${foundWords.join(", ")}。スパム判定やリーチ低下のリスクがあります`,
    severity: passed ? "info" : "error",
  };
}

function checkControversyRisk(content: string): QualityCheck {
  const controversialPatterns = [
    /政治|選挙|政党|与党|野党/,
    /宗教|信仰|神|仏/,
    /差別|ヘイト|人種|性別/,
    /戦争|軍事|核/,
    /死|殺|暴力/,
    /バカ|アホ|クソ|ゴミ/,
    /炎上|批判|叩[かきくけこ]/,
  ];

  const matchedPatterns = controversialPatterns.filter((pattern) =>
    pattern.test(content)
  );
  const riskLevel = Math.min(matchedPatterns.length * 0.25, 1);
  const passed = riskLevel < 0.5;

  let severity: "info" | "warning" | "error";
  if (riskLevel === 0) {
    severity = "info";
  } else if (riskLevel < 0.5) {
    severity = "warning";
  } else {
    severity = "error";
  }

  return {
    name: "炎上リスクチェック",
    passed,
    score: 1 - riskLevel,
    message:
      riskLevel === 0
        ? "炎上リスクは低いです"
        : riskLevel < 0.5
          ? "軽度の炎上リスクがあります。表現に注意してください"
          : "炎上リスクが高いです。センシティブなトピックが含まれています",
    severity,
  };
}

export function runQualityChecks(
  content: string,
  options?: QualityCheckOptions
): QualityCheckResult {
  const {
    maxCharacters = 280,
    maxHashtags = 3,
    maxEmojis = 5,
    customNgWords = [],
    allowExternalLinks = false,
  } = options ?? {};

  const checks: QualityCheck[] = [
    checkCharacterCount(content, maxCharacters),
    checkExternalLinks(content, allowExternalLinks),
    checkHashtagCount(content, maxHashtags),
    checkReplyInducingElements(content),
    checkHookQuality(content),
    checkEmojiCount(content, maxEmojis),
    checkNgWords(content, customNgWords),
    checkControversyRisk(content),
  ];

  const allPassed = checks.every((check) => check.passed);
  const errorChecks = checks.filter((c) => c.severity === "error");
  const warningChecks = checks.filter((c) => c.severity === "warning");

  const avgScore =
    checks.reduce((sum, check) => sum + check.score, 0) / checks.length;

  let summary: string;
  if (allPassed && warningChecks.length === 0) {
    summary = "全てのチェックをパスしました。投稿に最適な状態です。";
  } else if (errorChecks.length > 0) {
    summary = `${errorChecks.length}件の重大な問題があります。投稿前に修正してください。`;
  } else {
    summary = `${warningChecks.length}件の改善提案があります。修正するとエンゲージメントが向上する可能性があります。`;
  }

  return {
    checks,
    passed: allPassed,
    overallScore: Math.round(avgScore * 100) / 100,
    summary,
  };
}

export interface ScoreInput {
  engagement: number;
  clarity: number;
  hook: number;
  replyPotential: number;
  controversyRisk: number;
}

export function calculateCompositeScore(scores: ScoreInput): number {
  const weights = {
    engagement: 0.25,
    clarity: 0.15,
    hook: 0.2,
    replyPotential: 0.3,
    controversyRisk: 0.1,
  };

  const composite =
    scores.engagement * weights.engagement +
    scores.clarity * weights.clarity +
    scores.hook * weights.hook +
    scores.replyPotential * weights.replyPotential +
    (1 - scores.controversyRisk) * weights.controversyRisk;

  return Math.round(Math.min(Math.max(composite, 0), 1) * 100) / 100;
}
