/**
 * utils.js
 * 
 * 目的：全アプリ共通で使用するヘルパー関数群
 * パーリ語を変数名のメインとして使用
 * 
 * 含まれる機能：
 * - 日付操作（Divasam = 日、Sattahassa = 週）
 * - データ型変換
 * - UI ヘルパー
 * - ログ出力
 */

// ============================================
// 日付操作（Divasam = 日、Sattahassa = 週）
// ============================================

/**
 * 本日の日付を YYYY-MM-DD 形式で取得
 * Divasam = 日（パーリ語）
 * 
 * @returns {string} 本日の日付 YYYY-MM-DD
 */
function get_divasam_ajja() {
  return new Date().toISOString().split('T')[0];
}

/**
 * N日前の日付を取得
 * 
 * @param {number} divasam_purvo - N日前（purvo = 以前）
 * @returns {string} YYYY-MM-DD 形式
 */
function get_divasam_purvo(divasam_purvo) {
  const date = new Date();
  date.setDate(date.getDate() - divasam_purvo);
  return date.toISOString().split('T')[0];
}

/**
 * 週の開始日（日曜）を取得
 * Sattahassa = 週（パーリ語）
 * Adi = 最初
 * 
 * @param {string} divasam - YYYY-MM-DD 形式（省略時は本日）
 * @returns {string} その週の日曜日
 */
function get_sattahassa_adi(divasam = get_divasam_ajja()) {
  const date = new Date(divasam);
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff)).toISOString().split('T')[0];
}

/**
 * 週の終了日（土曜）を取得
 * 
 * @param {string} divasam - YYYY-MM-DD 形式（省略時は本日）
 * @returns {string} その週の土曜日
 */
function get_sattahassa_anta(divasam = get_divasam_ajja()) {
  const start = get_sattahassa_adi(divasam);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end.toISOString().split('T')[0];
}

/**
 * 月の最初の日を取得
 * Masam = 月（パーリ語）
 * 
 * @param {number} vussa - 年
 * @param {number} masam - 月（1-12）
 * @returns {string} YYYY-MM-01
 */
function get_masam_adi(vussa, masam) {
  return `${vussa}-${String(masam).padStart(2, '0')}-01`;
}

/**
 * 月の最後の日を取得
 * Anta = 最後
 * 
 * @param {number} vussa - 年
 * @param {number} masam - 月（1-12）
 * @returns {string} YYYY-MM-最終日
 */
function get_masam_anta(vussa, masam) {
  const next_month = masam === 12 ? 1 : masam + 1;
  const next_year = masam === 12 ? vussa + 1 : vussa;
  const last_day = new Date(next_year, next_month - 1, 0).getDate();
  return `${vussa}-${String(masam).padStart(2, '0')}-${String(last_day).padStart(2, '0')}`;
}

/**
 * 週範囲を日本語文字列で取得
 * 
 * @param {string} divasam_sattahassa_adi - 週の開始日
 * @returns {string} 例：「5月1日〜5月7日」
 */
function get_sattahassa_range_nihongo(divasam_sattahassa_adi = get_sattahassa_adi()) {
  const start = new Date(divasam_sattahassa_adi);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  
  const start_month = start.getMonth() + 1;
  const start_day = start.getDate();
  const end_month = end.getMonth() + 1;
  const end_day = end.getDate();
  
  if (start_month === end_month) {
    return `${start_month}月${start_day}日〜${end_day}日`;
  } else {
    return `${start_month}月${start_day}日〜${end_month}月${end_day}日`;
  }
}

// ============================================
// 数値操作
// ============================================

/**
 * 平均値を計算
 * Majjha = 中央（平均）
 * 
 * @param {number[]} numbers - 数値配列
 * @returns {number} 平均値（小数第2位まで）
 */
function calc_majjha(numbers) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return Math.round((sum / numbers.length) * 100) / 100;
}

/**
 * パーセンテージ増減を計算
 * Vuddhi = 増加、Parihani = 減少
 * 
 * @param {number} previous - 前月の値
 * @param {number} current - 今月の値
 * @returns {number} パーセンテージ（例：15 = 15%増）
 */
function calc_vuddhi_percent(previous, current) {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * ピアソン相関係数を計算
 * Sambandha = 関係、Samuggaha = 相関
 * 
 * @param {number[]} array1 - 第1グループ
 * @param {number[]} array2 - 第2グループ
 * @returns {number} 相関係数（-1 〜 1）
 */
function calc_sambandha_samuggaha(array1, array2) {
  if (array1.length !== array2.length || array1.length === 0) return 0;
  
  const n = array1.length;
  const mean1 = calc_majjha(array1);
  const mean2 = calc_majjha(array2);
  
  let numerator = 0;
  let denominator1 = 0;
  let denominator2 = 0;
  
  for (let i = 0; i < n; i++) {
    const diff1 = array1[i] - mean1;
    const diff2 = array2[i] - mean2;
    numerator += diff1 * diff2;
    denominator1 += diff1 * diff1;
    denominator2 += diff2 * diff2;
  }
  
  if (denominator1 === 0 || denominator2 === 0) return 0;
  return Math.round((numerator / Math.sqrt(denominator1 * denominator2)) * 100) / 100;
}

// ============================================
// UI ヘルパー
// ============================================

/**
 * 要素の表示/非表示を切り替え
 * Dassaniya = 見える、Addassaniya = 見えない
 * 
 * @param {string} element_id - 要素の ID
 * @param {boolean} dassaniya - true = 表示、false = 非表示
 */
function toggle_dassaniya(element_id, dassaniya) {
  const element = document.getElementById(element_id);
  if (element) {
    element.style.display = dassaniya ? 'block' : 'none';
  }
}

/**
 * モーダルを開く
 * Asannam = ウィンドウ（モーダル）
 * 
 * @param {string} modal_id - モーダルの ID
 */
function open_asannam(modal_id) {
  const modal = document.getElementById(modal_id);
  if (modal) {
    modal.style.display = 'flex';
    modal.style.animation = 'slideUpModal 0.3s ease-out';
  }
}

/**
 * モーダルを閉じる
 * 
 * @param {string} modal_id - モーダルの ID
 */
function close_asannam(modal_id) {
  const modal = document.getElementById(modal_id);
  if (modal) {
    modal.style.animation = 'slideDownModal 0.3s ease-out';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
}

// ============================================
// ログ・デバッグ
// ============================================

/**
 * 本番環境 / デバッグ環境の判定
 * 
 * @returns {boolean} デバッグモードなら true
 */
function is_debug_mode() {
  return localStorage.getItem('DEBUG_MODE') === 'true';
}

/**
 * ログを出力（デバッグモード時のみ）
 * 
 * @param {*} message - ログメッセージ
 * @param {string} level - ログレベル（'info', 'warn', 'error'）
 */
function log_debug(message, level = 'info') {
  if (!is_debug_mode()) return;
  
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  switch (level) {
    case 'warn':
      console.warn(prefix, message);
      break;
    case 'error':
      console.error(prefix, message);
      break;
    default:
      console.log(prefix, message);
  }
}

/**
 * localStorage に保存されたデータサイズを取得
 * 
 * @returns {object} { total_size_kb, item_count }
 */
function get_storage_size() {
  let total_size = 0;
  let item_count = 0;
  
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total_size += localStorage.getItem(key).length;
      item_count++;
    }
  }
  
  return {
    total_size_kb: (total_size / 1024).toFixed(2),
    item_count: item_count,
  };
}

/**
 * 時間を日本語で表示
 * 
 * @param {number} hour - 時間（0-23）
 * @returns {string} 例：「朝6時」「昼12時」「夜8時」
 */
function hour_to_nihongo(hour) {
  if (hour >= 5 && hour < 12) {
    return `朝${hour}時`;
  } else if (hour >= 12 && hour < 17) {
    return `昼${hour}時`;
  } else if (hour >= 17 && hour < 21) {
    return `夕方${hour}時`;
  } else if (hour >= 21 || hour < 5) {
    return `夜${hour}時`;
  }
}
