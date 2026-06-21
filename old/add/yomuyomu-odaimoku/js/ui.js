/**
 * Yomuyomu Odaimoku v15+ - UI Management Module
 * 
 * 責務:
 *   - ダッシュボードの統計情報表示（DOMの直接更新）
 *   - リアルタイム通知表示（トースト）
 *   - ダイアログ & モーダル管理
 *   - フォーム入力の同期と検証
 *   - storage.js 経由でデータを取得
 *   - config.js の TERMINOLOGY, MESSAGES を使用
 * 
 * 依存関係:
 *   - storage.js (データペルシスト)
 *   - config.js (用語・メッセージ定義)
 */

// ========== トースト通知管理 ==========

/**
 * トースト通知を表示する
 * @param {string} message - 表示するメッセージ
 * @param {string} type - 通知タイプ ('success', 'error', 'warning', 'info')
 * @param {number} duration - 表示期間 (ミリ秒、デフォルト 3000ms)
 */
function showToast(message, type = 'info', duration = 3000) {
  // トーストコンテナが存在しなければ作成
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // トースト要素を作成
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // DOM に追加
  container.appendChild(toast);

  // 指定時間後に削除
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

/**
 * 成功通知を表示
 * @param {string} message - メッセージ
 */
function showSuccess(message) {
  const msg = MESSAGES.toastSuccess || message;
  showToast(msg, 'success', 2500);
}

/**
 * エラー通知を表示
 * @param {string} message - メッセージ
 */
function showError(message) {
  const msg = MESSAGES.toastError || message;
  showToast(msg, 'error', 3500);
}

/**
 * 警告通知を表示
 * @param {string} message - メッセージ
 */
function showWarning(message) {
  const msg = MESSAGES.toastWarning || message;
  showToast(msg, 'warning', 3000);
}

/**
 * 情報通知を表示
 * @param {string} message - メッセージ
 */
function showInfo(message) {
  const msg = MESSAGES.toastInfo || message;
  showToast(msg, 'info', 3000);
}

// ========== ダッシュボード更新 ==========

/**
 * ダッシュボード全体を更新する（統計情報）
 * storage.js から最新データを取得し、DOM を更新
 */
async function updateDashboard() {
  try {
    // storage.js からユーザーデータを取得
    const userData = await StorageManager.getUserData();
    if (!userData) {
      console.warn('ユーザーデータが見つかりません');
      return;
    }

    // 各統計セクションを更新
    updateTodayStats(userData);
    updateWeeklyStats(userData);
    updateMonthlyStats(userData);
    updateLeaderboardStats(userData);
    updateDanaStats(userData);

  } catch (error) {
    console.error('ダッシュボード更新エラー:', error);
    showError('ダッシュボードの更新に失敗しました');
  }
}

/**
 * 本日の統計を更新
 * @param {object} userData - ユーザーデータオブジェクト
 */
function updateTodayStats(userData) {
  // 本日のデータを計算
  const today = new Date().toISOString().split('T')[0];
  const todaySession = userData.sessions?.find(s => s.date === today) || {};

  // 本日の勤行回数（念仏回数）
  const todayCount = todaySession.count || 0;
  const countElement = document.getElementById('stat-today-count');
  if (countElement) {
    countElement.textContent = todayCount;
  }

  // 本日の勤行時間（分単位）
  const todayTime = todaySession.duration || 0;
  const timeElement = document.getElementById('stat-today-time');
  if (timeElement) {
    const minutes = Math.floor(todayTime / 60);
    const seconds = todayTime % 60;
    timeElement.textContent = `${minutes}分${seconds}秒`;
  }

  // 本日の功徳ポイント
  const todayMerit = todaySession.merit || 0;
  const meritElement = document.getElementById('stat-today-merit');
  if (meritElement) {
    meritElement.textContent = todayMerit;
  }

  // 本日のアチーブメント（ストリーク）
  const todayStreak = calculateCurrentStreak(userData);
  const streakElement = document.getElementById('stat-today-streak');
  if (streakElement) {
    streakElement.textContent = `${todayStreak}日`;
  }
}

/**
 * 週間統計を更新
 * @param {object} userData - ユーザーデータオブジェクト
 */
function updateWeeklyStats(userData) {
  const sessions = userData.sessions || [];
  const now = new Date();

  // 過去7日間のデータを抽出
  let weeklyCount = 0;
  let weeklyDuration = 0;
  let weeklyMerit = 0;

  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const session = sessions.find(s => s.date === dateStr);

    if (session) {
      weeklyCount += session.count || 0;
      weeklyDuration += session.duration || 0;
      weeklyMerit += session.merit || 0;
    }
  }

  // 総念仏回数
  const countElement = document.getElementById('stat-week-count');
  if (countElement) {
    countElement.textContent = weeklyCount;
  }

  // 平均時間
  const avgElement = document.getElementById('stat-week-avg');
  if (avgElement) {
    const avgTime = weeklyCount > 0 ? (weeklyDuration / weeklyCount).toFixed(0) : 0;
    avgElement.textContent = `${avgTime}秒`;
  }

  // 週間功徳
  const meritElement = document.getElementById('stat-week-merit');
  if (meritElement) {
    meritElement.textContent = weeklyMerit;
  }

  // 週間ランク（仮定：1日以上実施）
  const activeDays = new Set(
    sessions
      .filter(s => {
        const sessionDate = new Date(s.date);
        const daysDiff = Math.floor((now - sessionDate) / (1000 * 60 * 60 * 24));
        return daysDiff <= 7;
      })
      .map(s => s.date)
  ).size;

  const rankElement = document.getElementById('stat-week-rank');
  if (rankElement) {
    rankElement.textContent = `${activeDays}/7日`;
  }
}

/**
 * 月間統計を更新
 * @param {object} userData - ユーザーデータオブジェクト
 */
function updateMonthlyStats(userData) {
  const sessions = userData.sessions || [];
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  // 今月のデータを抽出
  let monthlyCount = 0;
  let monthlyDuration = 0;
  let monthlyMerit = 0;

  sessions.forEach(session => {
    const sessionDate = new Date(session.date);
    if (sessionDate.getMonth() === thisMonth && sessionDate.getFullYear() === thisYear) {
      monthlyCount += session.count || 0;
      monthlyDuration += session.duration || 0;
      monthlyMerit += session.merit || 0;
    }
  });

  // 月間総念仏回数
  const countElement = document.getElementById('stat-month-count');
  if (countElement) {
    countElement.textContent = monthlyCount;
  }

  // 月間平均時間
  const avgElement = document.getElementById('stat-month-avg');
  if (avgElement) {
    const avgTime = monthlyCount > 0 ? (monthlyDuration / monthlyCount).toFixed(0) : 0;
    avgElement.textContent = `${avgTime}秒`;
  }

  // 月間功徳
  const meritElement = document.getElementById('stat-month-merit');
  if (meritElement) {
    meritElement.textContent = monthlyMerit;
  }

  // 月間の日数目標進捗 (目標: 30日)
  const targetDays = 30;
  const activeMonthDays = new Set(
    sessions
      .filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate.getMonth() === thisMonth && sessionDate.getFullYear() === thisYear;
      })
      .map(s => s.date)
  ).size;

  const progressElement = document.getElementById('stat-month-progress');
  if (progressElement) {
    progressElement.textContent = `${activeMonthDays}/${targetDays}`;
  }

  // プログレスバーを更新
  const progressBar = document.getElementById('progress-bar-month');
  if (progressBar) {
    const percentage = (activeMonthDays / targetDays) * 100;
    progressBar.style.width = `${Math.min(percentage, 100)}%`;
  }
}

/**
 * リーダーボード情報を更新
 * @param {object} userData - ユーザーデータオブジェクト
 */
function updateLeaderboardStats(userData) {
  // ユーザー名
  const nameElement = document.getElementById('stat-user-name');
  if (nameElement && userData.name) {
    nameElement.textContent = userData.name;
  }

  // 総念仏回数（全期間）
  const totalSessions = userData.sessions || [];
  const totalCount = totalSessions.reduce((sum, s) => sum + (s.count || 0), 0);
  const totalElement = document.getElementById('stat-total-count');
  if (totalElement) {
    totalElement.textContent = totalCount;
  }

  // 総勤行時間
  const totalDuration = totalSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const durationElement = document.getElementById('stat-total-duration');
  if (durationElement) {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    durationElement.textContent = `${hours}時間${minutes}分`;
  }

  // ランク評価（功徳による）
  const totalMerit = totalSessions.reduce((sum, s) => sum + (s.merit || 0), 0);
  const rankElement = document.getElementById('stat-rank-level');
  if (rankElement) {
    let rankLabel = '初心者';
    if (totalMerit >= 10000) rankLabel = '阿弥陀仏';
    else if (totalMerit >= 5000) rankLabel = '諸菩薩';
    else if (totalMerit >= 1000) rankLabel = '十悪菩薩';
    rankElement.textContent = rankLabel;
  }

  // メダル表示（アチーブメント）
  updateAchievementBadges(userData);
}

/**
 * 布施（Dana）統計を更新
 * @param {object} userData - ユーザーデータオブジェクト
 */
function updateDanaStats(userData) {
  const dana = userData.dana || [];

  // 総布施額
  const totalDana = dana.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalElement = document.getElementById('stat-total-dana');
  if (totalElement) {
    totalElement.textContent = `¥${totalDana.toLocaleString('ja-JP')}`;
  }

  // 布施回数
  const countElement = document.getElementById('stat-dana-count');
  if (countElement) {
    countElement.textContent = dana.length;
  }

  // 平均布施額
  const avgElement = document.getElementById('stat-dana-avg');
  if (avgElement) {
    const avgAmount = dana.length > 0 ? (totalDana / dana.length).toFixed(0) : 0;
    avgElement.textContent = `¥${parseInt(avgAmount).toLocaleString('ja-JP')}`;
  }

  // 最新の布施
  updateRecentDanaList(dana);
}

/**
 * 最近の布施リストを更新
 * @param {array} dana - 布施データの配列
 */
function updateRecentDanaList(dana) {
  const listElement = document.getElementById('dana-recent-list');
  if (!listElement) return;

  // 最新5件を取得
  const recent = dana.slice(-5).reverse();

  // リストをクリア
  listElement.innerHTML = '';

  if (recent.length === 0) {
    listElement.innerHTML = '<p class="text-muted">布施がまだ登録されていません</p>';
    return;
  }

  // 各布施をリスト化
  recent.forEach(d => {
    const item = document.createElement('div');
    item.className = 'list-item';

    const content = document.createElement('div');
    content.innerHTML = `
      <div class="list-item-title">${d.description || '布施'}</div>
      <div class="list-item-meta">${new Date(d.date).toLocaleDateString('ja-JP')}</div>
    `;

    const amount = document.createElement('div');
    amount.className = 'text-success';
    amount.style.fontWeight = 'bold';
    amount.textContent = `¥${d.amount.toLocaleString('ja-JP')}`;

    item.appendChild(content);
    item.appendChild(amount);
    listElement.appendChild(item);
  });
}

// ========== アチーブメントバッジ ==========

/**
 * アチーブメント（メダル）を表示
 * @param {object} userData - ユーザーデータオブジェクト
 */
function updateAchievementBadges(userData) {
  const badgeContainer = document.getElementById('achievement-badges');
  if (!badgeContainer) return;

  // バッジをクリア
  badgeContainer.innerHTML = '';

  // アチーブメント判定ロジック
  const totalSessions = userData.sessions || [];
  const totalCount = totalSessions.reduce((sum, s) => sum + (s.count || 0), 0);
  const totalMerit = totalSessions.reduce((sum, s) => sum + (s.merit || 0), 0);
  const currentStreak = calculateCurrentStreak(userData);

  const achievements = [];

  // ストリーク: 7日連続
  if (currentStreak >= 7) {
    achievements.push({ icon: '🔥', label: '7日ストリーク' });
  }

  // ストリーク: 30日連続
  if (currentStreak >= 30) {
    achievements.push({ icon: '⭐', label: '30日達成' });
  }

  // 念仏: 1000回
  if (totalCount >= 1000) {
    achievements.push({ icon: '🙏', label: '千念達成' });
  }

  // 念仏: 10000回
  if (totalCount >= 10000) {
    achievements.push({ icon: '👑', label: '万念達成' });
  }

  // 功徳: 1000P
  if (totalMerit >= 1000) {
    achievements.push({ icon: '✨', label: '千功達成' });
  }

  // 功徳: 10000P
  if (totalMerit >= 10000) {
    achievements.push({ icon: '🌟', label: '万功達成' });
  }

  // バッジを DOM に追加
  if (achievements.length === 0) {
    badgeContainer.innerHTML = '<p class="text-muted small">アチーブメント達成を目指す</p>';
  } else {
    achievements.forEach(ach => {
      const badge = document.createElement('span');
      badge.className = 'badge badge-success';
      badge.innerHTML = `${ach.icon} ${ach.label}`;
      badgeContainer.appendChild(badge);
    });
  }
}

// ========== ストリーク計算 ==========

/**
 * 現在のストリーク（連続実施日数）を計算
 * @param {object} userData - ユーザーデータオブジェクト
 * @returns {number} 連続日数
 */
function calculateCurrentStreak(userData) {
  const sessions = userData.sessions || [];
  if (sessions.length === 0) return 0;

  // セッションを日付でソート（降順）
  const sortedSessions = sessions
    .map(s => new Date(s.date))
    .sort((a, b) => b - a);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 昨日以前から連続をカウント
  let checkDate = new Date(today);

  for (const sessionDate of sortedSessions) {
    const normalized = new Date(sessionDate);
    normalized.setHours(0, 0, 0, 0);

    if (normalized.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (normalized < checkDate) {
      break;
    }
  }

  return streak;
}

// ========== モーダル & ダイアログ管理 ==========

/**
 * モーダルを開く
 * @param {string} modalId - モーダル要素の ID
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    // 背景スクロール防止
    document.body.style.overflow = 'hidden';
  }
}

/**
 * モーダルを閉じる
 * @param {string} modalId - モーダル要素の ID
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    // 背景スクロール復帰
    document.body.style.overflow = '';
  }
}

/**
 * モーダルの閉じるボタンにイベントをバインド
 * クリック時に自動的にモーダルを閉じる
 */
function setupModalClosers() {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  // モーダル背景クリック時に閉じる
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
}

/**
 * 確認ダイアログを表示
 * @param {string} title - タイトル
 * @param {string} message - メッセージ
 * @param {function} onConfirm - 確認時のコールバック
 * @param {string} confirmText - 確認ボタンテキスト（デフォルト: '確認'）
 * @param {string} cancelText - キャンセルボタンテキスト（デフォルト: 'キャンセル'）
 */
function showConfirmDialog(title, message, onConfirm, confirmText = '確認', cancelText = 'キャンセル') {
  // モーダル要素を動的に作成
  const modalId = `confirm-dialog-${Date.now()}`;
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${escapeHtml(title)}</h2>
        <button class="modal-close" aria-label="閉じる">&times;</button>
      </div>
      <div class="modal-body">
        <p>${escapeHtml(message)}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" data-action="cancel">${escapeHtml(cancelText)}</button>
        <button class="btn btn-primary" data-action="confirm">${escapeHtml(confirmText)}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // イベントハンドラ
  modal.querySelector('[data-action="confirm"]').addEventListener('click', () => {
    closeModal(modalId);
    modal.remove();
    onConfirm();
  });

  modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
    closeModal(modalId);
    modal.remove();
  });

  modal.querySelector('.modal-close').addEventListener('click', () => {
    closeModal(modalId);
    modal.remove();
  });

  // モーダルを開く
  openModal(modalId);
}

// ========== フォーム & 入力管理 ==========

/**
 * フォーム入力を検証
 * @param {HTMLFormElement} form - フォーム要素
 * @returns {boolean} 検証結果
 */
function validateForm(form) {
  let isValid = true;

  // 必須フィールドをチェック
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('error');
      isValid = false;
    } else {
      field.classList.remove('error');
    }
  });

  // メールアドレスをチェック
  form.querySelectorAll('[type="email"]').forEach(field => {
    if (field.value && !isValidEmail(field.value)) {
      field.classList.add('error');
      isValid = false;
    } else {
      field.classList.remove('error');
    }
  });

  // 数値フィールドをチェック
  form.querySelectorAll('[type="number"]').forEach(field => {
    if (field.value && isNaN(field.value)) {
      field.classList.add('error');
      isValid = false;
    } else {
      field.classList.remove('error');
    }
  });

  return isValid;
}

/**
 * メールアドレスの簡易検証
 * @param {string} email - メールアドレス
 * @returns {boolean} 有効な形式か
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * フォームをリセット
 * @param {HTMLFormElement} form - フォーム要素
 */
function resetForm(form) {
  form.reset();
  form.querySelectorAll('.error').forEach(field => {
    field.classList.remove('error');
  });
}

// ========== HTML エスケープ ==========

/**
 * HTML 特殊文字をエスケープ（XSS 対策）
 * @param {string} text - エスケープするテキスト
 * @returns {string} エスケープされたテキスト
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========== 初期化 ==========

/**
 * UI 初期化（DOMContentLoaded 時に実行）
 */
function initializeUI() {
  // モーダルのセットアップ
  setupModalClosers();

  // ダッシュボードを初回更新
  updateDashboard();

  // 定期的にダッシュボードを更新（1分ごと）
  setInterval(updateDashboard, 60 * 1000);
}

// ========== ユーティリティ ==========

/**
 * 日付をフォーマット（日本語）
 * @param {Date|string} date - 日付オブジェクトまたはISO文字列
 * @returns {string} フォーマットされた日付文字列
 */
function formatDateJP(date) {
  const d = new Date(date);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 時間をフォーマット（H:MM:SS）
 * @param {number} seconds - 秒数
 * @returns {string} フォーマットされた時間文字列
 */
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  } else {
    return `${m}:${String(s).padStart(2, '0')}`;
  }
}

/**
 * DOM の準備完了時に初期化関数を実行
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUI);
} else {
  initializeUI();
}

// ========== エクスポート（他のモジュールから呼び出し可能） ==========
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    updateDashboard,
    openModal,
    closeModal,
    showConfirmDialog,
    validateForm,
    resetForm,
    formatDateJP,
    formatTime,
  };
}
