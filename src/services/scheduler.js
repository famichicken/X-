// スケジューリング＆通知サービス
// ブラウザのsetIntervalで毎分チェックし、投稿時間になったら通知を出す

let schedulerInterval = null;
let lastTriggeredTime = '';

export function startScheduler(getState) {
  if (schedulerInterval) return;

  schedulerInterval = setInterval(() => {
    checkSchedule(getState);
  }, 30000); // 30秒ごとにチェック

  // 起動時にも即チェック
  checkSchedule(getState);
}

export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}

function checkSchedule(getState) {
  const state = getState();
  const { scheduleSettings, ideas } = state;

  if (!scheduleSettings.enabled) return;

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // 同じ時間に二重にトリガーしない
  if (currentTime === lastTriggeredTime) return;

  // 現在の時間がスケジュール時間に一致するか
  if (scheduleSettings.times.includes(currentTime)) {
    lastTriggeredTime = currentTime;

    // アクティブアイディアを取得（優先順位順）
    const activeIdeas = ideas
      .filter((i) => i.pinned)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    if (activeIdeas.length === 0) {
      sendNotification(
        '投稿時間です',
        'アクティブなアイディアがありません。ネタ帳でアイディアをピン留めしてください。'
      );
      return;
    }

    const topIdea = activeIdeas[0];

    if (scheduleSettings.autoGenerate) {
      // 自動生成モードの場合、通知で知らせてアプリを開かせる
      sendNotification(
        '投稿時間です！AI生成を開始します',
        `アイディア: 「${topIdea.text}」\nタップしてアプリを開き、生成結果を確認してください。`
      );

      // 自動で生成画面に遷移＆生成開始
      state.setSelectedIdea(topIdea);
      state.setCurrentView('generate');
    } else {
      sendNotification(
        '投稿時間です',
        `次のアイディア: 「${topIdea.text}」\nアプリを開いて投稿を作成しましょう。`
      );
    }
  }
}

function sendNotification(title, body) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'x-post-master-schedule',
      requireInteraction: true,
    });
  } catch {
    // Service Worker不要なFallback（モバイルの場合など）
    console.log('[Scheduler]', title, body);
  }
}
