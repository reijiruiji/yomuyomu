/**
 * schedule-config.js
 * 
 * 目的：チュートリアルでのスケジュール設定機能を管理
 * 
 * 機能：
 * 1. ユーザーが「毎日何時に通知を受け取るか」を設定
 * 2. お題目と勤行（朝/夜）で個別に時間を設定
 * 3. 設定を localStorage に保存
 * 4. 後続：Push通知で指定時間に通知を送る
 */

// ============================================
// スケジュール設定の取得・保存
// ============================================

/**
 * お題目の通知時間を保存
 * 
 * @param {number} hour - 時間（0-23）
 * @returns {boolean} 成功時 true
 */
function save_chant_schedule(hour) {
  try {
    const schedule = {
      hour: hour,
      enabled: true,
      saved_at: new Date().toISOString(),
    };
    localStorage.setItem('schedule_chant', JSON.stringify(schedule));
    log_debug(`【スケジュール保存】お題目通知: ${hour}時`, 'info');
    return true;
  } catch (error) {
    log_debug(`【スケジュール保存失敗】${error}`, 'error');
    return false;
  }
}

/**
 * 勤行の通知時間を保存
 * 
 * @param {string} gongyo_type - 勤行タイプ（'morning' または 'evening'）
 * @param {number} hour - 時間（0-23）
 * @returns {boolean} 成功時 true
 */
function save_gongyo_schedule(gongyo_type, hour) {
  try {
    const schedule = {
      type: gongyo_type,
      hour: hour,
      enabled: true,
      saved_at: new Date().toISOString(),
    };
    localStorage.setItem(`schedule_gongyo_${gongyo_type}`, JSON.stringify(schedule));
    log_debug(`【スケジュール保存】${gongyo_type === 'morning' ? '朝' : '夜'}の${get_term('GONGYO')}通知: ${hour}時`, 'info');
    return true;
  } catch (error) {
    log_debug(`【スケジュール保存失敗】${error}`, 'error');
    return false;
  }
}

/**
 * お題目の通知時間を取得
 * 
 * @returns {object|null} { hour, enabled } または null
 */
function get_chant_schedule() {
  try {
    const schedule = localStorage.getItem('schedule_chant');
    return schedule ? JSON.parse(schedule) : null;
  } catch (error) {
    log_debug(`【スケジュール取得失敗】${error}`, 'error');
    return null;
  }
}

/**
 * 勤行の通知時間を取得
 * 
 * @param {string} gongyo_type - 勤行タイプ
 * @returns {object|null} { hour, enabled } または null
 */
function get_gongyo_schedule(gongyo_type) {
  try {
    const schedule = localStorage.getItem(`schedule_gongyo_${gongyo_type}`);
    return schedule ? JSON.parse(schedule) : null;
  } catch (error) {
    log_debug(`【スケジュール取得失敗】${error}`, 'error');
    return null;
  }
}

// ============================================
// 通知時間の表示ヘルパー
// ============================================

/**
 * 設定されたスケジュールを表示テキストに変換
 * 
 * @returns {string} 例：「毎日朝6時と夜8時」
 */
function get_schedule_display_text() {
  const chant_schedule = get_chant_schedule();
  const morning_schedule = get_gongyo_schedule('morning');
  const evening_schedule = get_gongyo_schedule('evening');
  
  const parts = [];
  
  if (chant_schedule && chant_schedule.enabled) {
    parts.push(`${hour_to_nihongo(chant_schedule.hour)}にお題目通知`);
  }
  
  if (morning_schedule && morning_schedule.enabled) {
    parts.push(`${hour_to_nihongo(morning_schedule.hour)}に朝の${get_term('GONGYO')}通知`);
  }
  
  if (evening_schedule && evening_schedule.enabled) {
    parts.push(`${hour_to_nihongo(evening_schedule.hour)}に夜の${get_term('GONGYO')}通知`);
  }
  
  return parts.length > 0 ? parts.join(' / ') : 'スケジュール未設定';
}

// ============================================
// Push通知設定（Web Notification API）
// ============================================

/**
 * Push通知の許可を要求
 * 
 * 【動作】
 * - ブラウザが Push通知をサポートしているか確認
 * - ユーザーに許可を要求
 * - 許可されたら通知設定を開始
 */
function request_notification_permission() {
  if (!('Notification' in window)) {
    log_debug('【通知】このブラウザは通知に対応していません', 'warn');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    log_debug('【通知許可済み】既に許可されています', 'info');
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    // 許可を要求
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        log_debug('【通知許可】ユーザーが許可しました', 'info');
        setup_scheduled_notifications();
        return true;
      } else {
        log_debug('【通知拒否】ユーザーが拒否しました', 'info');
        return false;
      }
    });
  }
}

/**
 * スケジュール設定に基づいて通知をセットアップ
 * 
 * 【動作】
 * 1. 設定されたスケジュールを取得
 * 2. 毎日その時間に通知を送信
 * 3. Service Workerで通知を管理
 */
function setup_scheduled_notifications() {
  const chant_schedule = get_chant_schedule();
  const morning_schedule = get_gongyo_schedule('morning');
  const evening_schedule = get_gongyo_schedule('evening');
  
  // 設定情報を localStorage に保存（Service Workerが読み取る）
  const notification_config = {
    chant: chant_schedule && chant_schedule.enabled ? chant_schedule.hour : null,
    morning: morning_schedule && morning_schedule.enabled ? morning_schedule.hour : null,
    evening: evening_schedule && evening_schedule.enabled ? evening_schedule.hour : null,
  };
  
  localStorage.setItem('notification_config', JSON.stringify(notification_config));
  log_debug(`【通知設定】スケジュール登録完了`, 'info');
}

/**
 * テスト通知を送信（デバッグ用）
 * 
 * 【用途】
 * - チュートリアル完了後、通知が正しく動作するか確認
 */
function send_test_notification() {
  if (Notification.permission === 'granted') {
    new Notification(`${get_term('APP_NAME')}`, {
      body: '通知テストです。これが見えたら正常に動作しています。',
      icon: '/icons/icon-192x192.png',
      tag: 'test-notification',
    });
    log_debug('【テスト通知】送信しました', 'info');
  } else {
    log_debug('【テスト通知】通知許可がありません', 'warn');
  }
}
