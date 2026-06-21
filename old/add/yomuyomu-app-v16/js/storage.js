/**
 * storage.js
 * 
 * 目的：localStorage への『読み書き』を一元管理
 * 
 * ストレージキーの命名規則：
 * - 修行ログ：'practice_log_{YYYY-MM-DD}'
 * - 能力スコア：'ability_{pali_name}_{YYYY-MM-DD}'
 * - 出来事ログ：'phala_{YYYY-MM-DD}'
 * - テスト履歴：'test_history_{test_type}'
 * - キャッシュ：'cache_{name}'
 */

// ============================================
// ストレージキー定義
// ============================================

const STORAGE_KEYS = {
  // 修行ログ
  PRACTICE_LOG_PREFIX: 'practice_log_',
  
  // 能力スコア
  ABILITY_PREFIX: 'ability_',
  
  // 出来事ログ（phala = 果）
  PHALA_PREFIX: 'phala_',
  
  // テスト実施履歴
  TEST_HISTORY_PREFIX: 'test_history_',
  
  // キャッシュ
  CACHE_PREFIX: 'cache_',
  
  // その他
  TUTORIAL_COMPLETED: 'tutorial_completed',
  DEBUG_MODE: 'DEBUG_MODE',
  PWA_INSTALL_STATE: 'pwa_install_state',
};

// ============================================
// 修行ログ操作（Sadhana = 修行）
// ============================================

/**
 * 修行ログを保存
 * 
 * @param {string} divasam - YYYY-MM-DD 形式の日付
 * @param {object} sadhana_data - { chant_count, gongyo_type, timestamp }
 * @returns {boolean} 成功時 true
 */
function save_sadhana_log(divasam, sadhana_data) {
  try {
    const key = `${STORAGE_KEYS.PRACTICE_LOG_PREFIX}${divasam}`;
    const data = {
      ...sadhana_data,
      timestamp: new Date().toISOString(),
      divasam: divasam,
    };
    localStorage.setItem(key, JSON.stringify(data));
    log_debug(`【修行ログ保存】${divasam}`, 'info');
    return true;
  } catch (error) {
    log_debug(`【修行ログ保存失敗】${error}`, 'error');
    return false;
  }
}

/**
 * 修行ログを取得
 * 
 * @param {string} divasam - YYYY-MM-DD 形式
 * @returns {object|null} 修行ログ、ない場合は null
 */
function get_sadhana_log(divasam) {
  try {
    const key = `${STORAGE_KEYS.PRACTICE_LOG_PREFIX}${divasam}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    log_debug(`【修行ログ取得失敗】${error}`, 'error');
    return null;
  }
}

/**
 * 指定期間の修行ログをすべて取得
 * 
 * @param {string} divasam_adi - 開始日
 * @param {string} divasam_anta - 終了日
 * @returns {object[]} 修行ログの配列
 */
function get_sadhana_logs_range(divasam_adi, divasam_anta) {
  const logs = [];
  const current_date = new Date(divasam_adi);
  const end_date = new Date(divasam_anta);
  
  while (current_date <= end_date) {
    const date_str = current_date.toISOString().split('T')[0];
    const log = get_sadhana_log(date_str);
    if (log) {
      logs.push(log);
    }
    current_date.setDate(current_date.getDate() + 1);
  }
  
  return logs;
}

// ============================================
// 能力スコア操作
// ============================================

/**
 * 能力スコアを保存
 * 
 * @param {string} pali_ability - パーリ語能力名（例：'samadhi'）
 * @param {string} divasam - YYYY-MM-DD 形式
 * @param {number} score - スコア値（0-10）
 * @returns {boolean} 成功時 true
 */
function save_ability_score(pali_ability, divasam, score) {
  try {
    const key = `${STORAGE_KEYS.ABILITY_PREFIX}${pali_ability}_${divasam}`;
    const data = {
      pali_ability: pali_ability,
      divasam: divasam,
      score: score,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(data));
    log_debug(`【能力スコア保存】${pali_ability} = ${score}`, 'info');
    return true;
  } catch (error) {
    log_debug(`【能力スコア保存失敗】${error}`, 'error');
    return false;
  }
}

/**
 * 能力スコアを取得
 * 
 * @param {string} pali_ability - パーリ語能力名
 * @param {string} divasam - YYYY-MM-DD 形式
 * @returns {number|null} スコア、ない場合は null
 */
function get_ability_score(pali_ability, divasam) {
  try {
    const key = `${STORAGE_KEYS.ABILITY_PREFIX}${pali_ability}_${divasam}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data).score : null;
  } catch (error) {
    log_debug(`【能力スコア取得失敗】${error}`, 'error');
    return null;
  }
}

/**
 * 特定の能力の月ごとの平均スコアを計算
 * 
 * @param {string} pali_ability - パーリ語能力名
 * @param {number} vussa - 年
 * @param {number} masam - 月
 * @returns {number} 平均スコア
 */
function get_ability_monthly_average(pali_ability, vussa, masam) {
  const divasam_adi = get_masam_adi(vussa, masam);
  const divasam_anta = get_masam_anta(vussa, masam);
  
  const scores = [];
  const current_date = new Date(divasam_adi);
  const end_date = new Date(divasam_anta);
  
  while (current_date <= end_date) {
    const date_str = current_date.toISOString().split('T')[0];
    const score = get_ability_score(pali_ability, date_str);
    if (score !== null) {
      scores.push(score);
    }
    current_date.setDate(current_date.getDate() + 1);
  }
  
  return scores.length > 0 ? calc_majjha(scores) : 0;
}

// ============================================
// 出来事ログ操作（Phala = 果）
// ============================================

/**
 * 出来事を保存
 * 
 * @param {string} divasam - YYYY-MM-DD 形式
 * @param {object} phala_data - { joy_count, luck_count, relation_count, memo }
 * @returns {boolean} 成功時 true
 */
function save_phala_log(divasam, phala_data) {
  try {
    const key = `${STORAGE_KEYS.PHALA_PREFIX}${divasam}`;
    const data = {
      ...phala_data,
      timestamp: new Date().toISOString(),
      divasam: divasam,
    };
    localStorage.setItem(key, JSON.stringify(data));
    log_debug(`【出来事ログ保存】${divasam}`, 'info');
    return true;
  } catch (error) {
    log_debug(`【出来事ログ保存失敗】${error}`, 'error');
    return false;
  }
}

/**
 * 出来事を取得
 * 
 * @param {string} divasam - YYYY-MM-DD 形式
 * @returns {object|null} 出来事ログ
 */
function get_phala_log(divasam) {
  try {
    const key = `${STORAGE_KEYS.PHALA_PREFIX}${divasam}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    log_debug(`【出来事ログ取得失敗】${error}`, 'error');
    return null;
  }
}

// ============================================
// テスト履歴操作
// ============================================

/**
 * テスト実施を記録
 * 
 * @param {string} test_type - テストタイプ（'daily', 'weekly', 'monthly'）
 * @param {string} date_key - 日付キー
 * @returns {boolean} 成功時 true
 */
function save_test_completion(test_type, date_key) {
  try {
    const key = `${STORAGE_KEYS.TEST_HISTORY_PREFIX}${test_type}`;
    let history = localStorage.getItem(key);
    history = history ? JSON.parse(history) : [];
    
    history.push({
      date_key: date_key,
      timestamp: new Date().toISOString(),
    });
    
    localStorage.setItem(key, JSON.stringify(history));
    log_debug(`【テスト完了記録】${test_type}`, 'info');
    return true;
  } catch (error) {
    log_debug(`【テスト完了記録失敗】${error}`, 'error');
    return false;
  }
}

/**
 * テストが実施済みか確認
 * 
 * @param {string} test_type - テストタイプ
 * @param {string} date_key - 日付キー
 * @returns {boolean} 実施済み時 true
 */
function is_test_completed(test_type, date_key) {
  try {
    const key = `${STORAGE_KEYS.TEST_HISTORY_PREFIX}${test_type}`;
    const history = localStorage.getItem(key);
    if (!history) return false;
    
    const records = JSON.parse(history);
    return records.some(record => record.date_key === date_key);
  } catch (error) {
    log_debug(`【テスト確認失敗】${error}`, 'error');
    return false;
  }
}

// ============================================
// ストレージ管理ツール
// ============================================

/**
 * ストレージの使用状況を取得
 * 
 * @returns {object} { total_size_kb, item_count, available_mb }
 */
function get_storage_stats() {
  return get_storage_size();
}

/**
 * すべてのデータをエクスポート（デバッグ用）
 * 
 * @returns {object} 全データオブジェクト
 */
function export_all_data() {
  const all_data = {};
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      try {
        all_data[key] = JSON.parse(localStorage.getItem(key));
      } catch {
        all_data[key] = localStorage.getItem(key);
      }
    }
  }
  return all_data;
}

/**
 * すべてのデータを削除（危険：確認が必要）
 * 
 * @returns {boolean} 削除成功時 true
 */
function clear_all_data() {
  if (!confirm('⚠️ すべてのデータを削除します。本当ですか？')) {
    return false;
  }
  
  localStorage.clear();
  log_debug('【全データ削除完了】', 'warn');
  return true;
}
