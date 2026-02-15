import { useState } from 'react';
import {
  User,
  Clock,
  Bell,
  BellOff,
  Plus,
  Trash2,
  Save,
  Check,
  FileText,
  Target,
  Zap,
} from 'lucide-react';
import useStore from '../store/useStore';

export default function SettingsScreen() {
  const {
    xProfile,
    setXProfile,
    scheduleSettings,
    setScheduleSettings,
    addScheduleTime,
    removeScheduleTime,
  } = useStore();

  const [saved, setSaved] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [profileForm, setProfileForm] = useState({ ...xProfile });

  const handleSaveProfile = () => {
    setXProfile(profileForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddTime = () => {
    if (!newTime) return;
    if (scheduleSettings.times.includes(newTime)) return;
    addScheduleTime(newTime);
    setNewTime('');
  };

  const handleRequestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('このブラウザは通知をサポートしていません');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setScheduleSettings({ notificationsEnabled: true });
      new Notification('X Post Master', {
        body: '通知が有効になりました！投稿時間になったらお知らせします。',
        icon: '/favicon.ico',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          設定
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          プロフィール・投稿スケジュール・通知の設定
        </p>
      </div>

      {/* Xプロフィール設定 */}
      <section className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-6">
        <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-1">
          <User className="w-5 h-5 text-blue-400" />
          Xプロフィール
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          AI生成時にあなたのプロフィール情報を参考にしてポストを作成します
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-1.5 block">表示名（X上の名前）</label>
            <input
              type="text"
              value={profileForm.displayName}
              onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
              placeholder="例: たなか太郎 / Tanaka Taro"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              紹介文（bio）
            </label>
            <textarea
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder={"例: フリーランスエンジニア｜AI×生産性を追求｜朝活3年目\n\n※ Xの紹介文をそのままコピペしてください"}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-gray-400" />
              ターゲット層
            </label>
            <input
              type="text"
              value={profileForm.targetAudience}
              onChange={(e) => setProfileForm({ ...profileForm, targetAudience: e.target.value })}
              placeholder="例: 20-30代のエンジニア、副業に興味がある会社員"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              参考ポスト（過去の自分のポスト）
            </label>
            <textarea
              value={profileForm.samplePosts}
              onChange={(e) => setProfileForm({ ...profileForm, samplePosts: e.target.value })}
              placeholder={"バズったポストや自分らしいポストをコピペしてください。\nAIがあなたの文体・トーンを学習して似たスタイルで生成します。\n\n例:\n---\n正直、プログラミングで一番大事なのは「検索力」だと思う。\nコードを書く力より、答えを探す力。\nこれに気づくのに3年かかった。\n---\n朝5時起きを始めて1ヶ月。\n生産性が上がったかは正直わからん。\nでも「自分の時間がある」という満足感がヤバい。"}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              rows={8}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  保存しました
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  プロフィールを保存
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 投稿スケジュール設定 */}
      <section className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-6">
        <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-1">
          <Clock className="w-5 h-5 text-green-400" />
          投稿スケジュール
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          設定した時間にアクティブアイディアから自動でAI生成し、通知でお知らせします
        </p>

        {/* スケジュール有効/無効 */}
        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3 mb-4">
          <div>
            <div className="text-sm text-gray-200">スケジュール投稿</div>
            <div className="text-xs text-gray-500">
              ONにすると、設定した時間に自動でポストを生成します
            </div>
          </div>
          <button
            onClick={() => setScheduleSettings({ enabled: !scheduleSettings.enabled })}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              scheduleSettings.enabled ? 'bg-green-600' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                scheduleSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* 自動生成 */}
        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3 mb-4">
          <div>
            <div className="text-sm text-gray-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              自動AI生成
            </div>
            <div className="text-xs text-gray-500">
              スケジュール時間にアクティブアイディアの優先順位1位から自動でAI生成
            </div>
          </div>
          <button
            onClick={() => setScheduleSettings({ autoGenerate: !scheduleSettings.autoGenerate })}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              scheduleSettings.autoGenerate ? 'bg-yellow-600' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                scheduleSettings.autoGenerate ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* 投稿時間一覧 */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-2 block">投稿時間</label>
          <div className="space-y-2">
            {scheduleSettings.times.map((time, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-gray-200 text-sm font-mono">{time}</span>
                  <span className="text-xs text-gray-500">
                    {getTimeLabel(time)}
                  </span>
                </div>
                <button
                  onClick={() => removeScheduleTime(i)}
                  className="p-1.5 rounded hover:bg-gray-700 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 新しい時間を追加 */}
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleAddTime}
            disabled={!newTime}
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 font-medium px-4 py-2 rounded-lg transition-colors border border-gray-700 text-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            追加
          </button>
        </div>
      </section>

      {/* 通知設定 */}
      <section className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-6">
        <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-1">
          <Bell className="w-5 h-5 text-purple-400" />
          通知設定
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          投稿時間になったらブラウザ通知でお知らせします
        </p>

        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
          <div>
            <div className="text-sm text-gray-200 flex items-center gap-1.5">
              {scheduleSettings.notificationsEnabled ? (
                <Bell className="w-3.5 h-3.5 text-purple-400" />
              ) : (
                <BellOff className="w-3.5 h-3.5 text-gray-500" />
              )}
              ブラウザ通知
            </div>
            <div className="text-xs text-gray-500">
              {scheduleSettings.notificationsEnabled
                ? '通知は有効です'
                : '通知を有効にすると、投稿時間にお知らせが届きます'}
            </div>
          </div>
          {scheduleSettings.notificationsEnabled ? (
            <button
              onClick={() => setScheduleSettings({ notificationsEnabled: false })}
              className="text-xs bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-600 transition-colors"
            >
              無効にする
            </button>
          ) : (
            <button
              onClick={handleRequestNotificationPermission}
              className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              通知を許可する
            </button>
          )}
        </div>
      </section>

      {/* 説明セクション */}
      <section className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-3">使い方ガイド</h3>
        <div className="space-y-3 text-xs text-gray-500">
          <div className="flex gap-2">
            <span className="text-blue-400 shrink-0">1.</span>
            <span>ネタ帳にアイディアを追加し、使いたいものをピン留めして「アクティブ」にする</span>
          </div>
          <div className="flex gap-2">
            <span className="text-blue-400 shrink-0">2.</span>
            <span>アクティブアイディアの優先順位を設定する（上から順にAI生成される）</span>
          </div>
          <div className="flex gap-2">
            <span className="text-blue-400 shrink-0">3.</span>
            <span>投稿スケジュールで時間を設定し、通知を有効にする</span>
          </div>
          <div className="flex gap-2">
            <span className="text-blue-400 shrink-0">4.</span>
            <span>設定した時間になると自動でAIが優先アイディアからポストを生成し、通知で知らせます</span>
          </div>
          <div className="flex gap-2">
            <span className="text-blue-400 shrink-0">5.</span>
            <span>プロフィールに紹介文や過去のポストを入れておくと、あなたの文体に近いポストが生成されます</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function getTimeLabel(time) {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour >= 5 && hour < 9) return '朝（通勤時間帯）';
  if (hour >= 9 && hour < 12) return '午前';
  if (hour >= 12 && hour < 14) return '昼（昼休み）';
  if (hour >= 14 && hour < 17) return '午後';
  if (hour >= 17 && hour < 20) return '夕方';
  if (hour >= 20 && hour < 24) return '夜（ゴールデンタイム）';
  return '深夜';
}
