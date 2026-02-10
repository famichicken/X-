// Mock LLMサービス
// 本番ではOpenAI / Anthropic / Google Generative AI / Grok APIを呼び出す
// 開発時はモックレスポンスを返す

import { ALGORITHM_PROMPT_INSTRUCTIONS } from '../constants/algorithmTips';

const MOCK_DELAY_MS = 1500;

// 各LLMキャラクター別のモックレスポンス生成
const mockResponses = {
  gemini: (idea, tone) => {
    const responses = {
      default: [
        `📊 データが示す真実\n\n${idea}について、最新の調査データが興味深い結果を示しています。\n\n実は全体の73%が同じ悩みを抱えているにも関わらず、解決策を知っているのはわずか12%。\n\nこの差が生まれる原因は3つ：\n①情報の非対称性\n②行動バイアス\n③環境要因\n\nあなたはどれに当てはまりますか？`,
        `🔍 興味深いトレンド発見\n\n「${idea}」に関するGoogle検索ボリュームが前月比340%増加。\n\nこの急上昇の背景には、多くの人がまだ気づいていない構造的な変化があります。\n\n3年後、この分野は今の5倍の規模になるという予測も。\n\n今から準備を始める人と、後から追いかける人の差は？`,
      ],
    };
    const list = responses.default;
    return list[Math.floor(Math.random() * list.length)];
  },

  chatgpt: (idea, tone) => {
    const responses = {
      default: [
        `これ、めちゃくちゃ共感する人多いと思う。\n\n${idea}って、誰もが一度は感じたことあるはず。\n\nでも大事なのは「感じた後にどう動くか」なんですよね。\n\n僕が実践して効果があった方法を3つシェアします👇\n\n①まず現状を書き出す\n②理想の状態を明確にする\n③最初の一歩だけ決める\n\nこの3ステップだけで、驚くほど変わります。\n\n試してみた感想、教えてください！`,
        `正直に言います。\n\n${idea}について、ずっとモヤモヤしてたことがあります。\n\nでも最近やっと答えが見つかった気がして。\n\n結論：完璧を目指すより、まず60%で出す方が100倍マシ。\n\n「準備が整ったら」は永遠に来ない。\n\n同じこと思ってる人、いませんか？`,
      ],
    };
    const list = responses.default;
    return list[Math.floor(Math.random() * list.length)];
  },

  claude: (idea, tone) => {
    const responses = {
      default: [
        `「${idea}」の本質を考えると、面白い構造が見えてきます。\n\n表面的には個人の問題に見えるこのテーマ、実は社会システムの設計に起因しています。\n\n具体的に言うと：\n\n・インセンティブ構造が「現状維持」に最適化されている\n・情報環境が「不安」を増幅する方向に設計されている\n・成功事例だけが可視化され、プロセスが見えない\n\nつまり、個人の努力だけでは限界がある。\n\n本当に必要なのは「環境のリデザイン」では？`,
        `少し深い話をします。\n\n${idea}について多くの人が見落としている視点があります。\n\nそれは「問い自体が間違っている」可能性。\n\n「どうすればうまくいくか？」ではなく\n「なぜうまくいかないと感じるのか？」\n\nこの問いの転換だけで、見える景色が変わる。\n\n反論も歓迎。どう思いますか？`,
      ],
    };
    const list = responses.default;
    return list[Math.floor(Math.random() * list.length)];
  },

  grok: (idea, tone) => {
    const responses = {
      default: [
        `ぶっちゃけ${idea}の話、みんなキレイゴト言いすぎ。\n\n現実見ろよって話。\n\n成功者の「努力しました」は生存バイアスの塊だし、\nインフルエンサーの「誰でもできる」は客寄せパンダ。\n\n本当に大事なのは：\n・才能の見極め（向いてないことはやめろ）\n・環境ガチャ（運も実力のうち認めろ）\n・損切りの速さ（沼にハマるな）\n\n厳しいけど、これが真実。\n異論は？`,
        `${idea}について思うこと。\n\n99%の人が知らない（というか知りたくない）事実：\n\nこの分野で「成功」してる人の大半は、\n単に「辞めなかった」だけ。\n\n才能？ 戦略？ そんなのは後付け。\n\n本質は「鈍感力」と「しつこさ」。\n\nカッコいい話じゃなくてすまんな。\nでもこれがリアル。\n\n反論どうぞ🫡`,
      ],
    };
    const list = responses.default;
    return list[Math.floor(Math.random() * list.length)];
  },
};

// ストリーミング風のモック生成（1文字ずつではなくチャンク単位）
function simulateStreaming(text, onChunk, onComplete) {
  const words = text.split('');
  let index = 0;
  const chunkSize = 3;

  const interval = setInterval(() => {
    if (index >= words.length) {
      clearInterval(interval);
      onComplete(text);
      return;
    }
    const chunk = words.slice(index, index + chunkSize).join('');
    index += chunkSize;
    onChunk(chunk);
  }, 20);

  return () => clearInterval(interval);
}

// メイン生成関数
export async function generatePost(llmId, idea, tone, options = {}) {
  const { onChunk, onComplete, signal } = options;

  // 実際のAPI呼び出し構造（コメントで残す）
  // switch (llmId) {
  //   case 'gemini':
  //     // const genAI = new GoogleGenerativeAI(API_KEY);
  //     // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  //     // const result = await model.generateContentStream(prompt);
  //     break;
  //   case 'chatgpt':
  //     // const openai = new OpenAI({ apiKey: API_KEY });
  //     // const stream = await openai.chat.completions.create({
  //     //   model: "gpt-4",
  //     //   messages: [{ role: "user", content: prompt }],
  //     //   stream: true,
  //     // });
  //     break;
  //   case 'claude':
  //     // const anthropic = new Anthropic({ apiKey: API_KEY });
  //     // const stream = anthropic.messages.stream({
  //     //   model: "claude-3-5-sonnet-20241022",
  //     //   messages: [{ role: "user", content: prompt }],
  //     // });
  //     break;
  //   case 'grok':
  //     // Grok API or GPT-4 with Grok-style prompt as fallback
  //     break;
  // }

  // モックモード
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS * (0.5 + Math.random())));

  if (signal?.aborted) {
    throw new Error('Generation cancelled');
  }

  const generator = mockResponses[llmId];
  if (!generator) throw new Error(`Unknown LLM: ${llmId}`);

  const fullText = generator(idea, tone);

  if (onChunk && onComplete) {
    return new Promise((resolve) => {
      simulateStreaming(fullText, onChunk, (text) => {
        onComplete(text);
        resolve(text);
      });
    });
  }

  return fullText;
}

// 炎上チェッカー（モック）
export async function checkControversy(text) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const riskyWords = ['バカ', '死ね', 'クソ', '消えろ', '障害', '差別', 'ゴミ'];
  const foundRisks = riskyWords.filter((w) => text.includes(w));

  if (foundRisks.length > 0) {
    return {
      safe: false,
      level: 'danger',
      message: `⚠️ 炎上リスク【高】: ${foundRisks.join(', ')} を含む表現が検出されました。投稿前に見直しを推奨します。`,
      suggestions: ['攻撃的な表現をより穏やかな表現に言い換えましょう', '個人を特定できる情報が含まれていないか確認しましょう'],
    };
  }

  const edgyPatterns = ['ぶっちゃけ', '正直言って', '批判', '問題', '終わってる', 'オワコン'];
  const foundEdgy = edgyPatterns.filter((w) => text.includes(w));

  if (foundEdgy.length > 1) {
    return {
      safe: true,
      level: 'warning',
      message: '⚡ 炎上リスク【中】: やや刺激的な表現が含まれます。意図的であれば問題ありませんが、注意してください。',
      suggestions: ['賛否が分かれる可能性があります。反論への準備をしておきましょう'],
    };
  }

  return {
    safe: true,
    level: 'safe',
    message: '✅ 炎上リスク【低】: 安全な内容です。',
    suggestions: [],
  };
}

// フック（1行目）バリエーション生成（モック）
export async function generateHookVariations(idea, currentHook) {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return [
    { text: `【衝撃】${idea}の真実を暴露します`, type: '衝撃系' },
    { text: `${idea}について、99%の人が知らないこと`, type: '数字系' },
    { text: `なぜ${idea}が今、注目されているのか？`, type: '疑問系' },
    { text: `${idea}を3年やって分かった、たった1つの本質`, type: '体験系' },
    { text: `${idea}がうまくいく人の共通点、見つけました`, type: '発見系' },
    { text: `正直、${idea}についてずっと黙ってたけど`, type: '告白系' },
    { text: `今すぐ${idea}をやめたほうがいい3つの理由`, type: '逆張り系' },
    { text: `${idea}の「当たり前」を疑ったら、世界が変わった`, type: '転換系' },
    { text: `${idea}で月収100万超えた方法（再現性あり）`, type: '実績系' },
    { text: `もし${idea}がなかったら、今頃どうなっていたか`, type: 'IF系' },
  ];
}

// A/Bテスト シミュレーション（モック）
export async function simulateABTest(posts) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return posts.map((post, i) => {
    const baseScore = 50 + Math.floor(Math.random() * 50);
    return {
      postIndex: i,
      text: post.substring(0, 50) + '...',
      reactions: {
        general: {
          label: '一般ユーザー',
          emoji: '👤',
          score: Math.min(100, baseScore + Math.floor(Math.random() * 20 - 10)),
          comment: ['共感できる', '面白い視点', '参考になる', 'ちょっと刺さった'][Math.floor(Math.random() * 4)],
        },
        anti: {
          label: 'アンチ',
          emoji: '👊',
          score: Math.min(100, Math.floor(Math.random() * 40 + 10)),
          comment: ['それは違う', '根拠は？', 'ポジショントークでは', '極論すぎる'][Math.floor(Math.random() * 4)],
        },
        fan: {
          label: 'ファン',
          emoji: '⭐',
          score: Math.min(100, baseScore + Math.floor(Math.random() * 30)),
          comment: ['さすがです', '保存しました', '共有します', '今日一番の投稿'][Math.floor(Math.random() * 4)],
        },
      },
      overallScore: baseScore,
      predictedImpressions: `${(baseScore * 100 + Math.floor(Math.random() * 5000)).toLocaleString()}`,
    };
  });
}

// プロンプト構築ヘルパー（実際のAPI呼び出し時に使用）
export function buildPrompt(idea, tone, postType, userProfile = {}) {
  return `
あなたはXの投稿を作成するプロフェッショナルです。
以下の条件で最適な投稿を生成してください。

【お題・ネタ】
${idea}

【テイスト】
${tone}

【投稿タイプ】
${postType}

${userProfile.target ? `【ターゲット層】\n${userProfile.target}` : ''}
${userProfile.style ? `【発信スタイル】\n${userProfile.style}` : ''}

${ALGORITHM_PROMPT_INSTRUCTIONS}

上記ルールを踏まえて、エンゲージメントを最大化する投稿を1つ生成してください。
  `.trim();
}
