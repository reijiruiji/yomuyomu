/**
 * 用語・メッセージ（UI はここを参照）
 */

const TERMINOLOGY = {
  chanting: 'お題目',
  gongyo: '勤行',
  CHANT: 'お題目',
  GONGYO: '勤行',
  GONGYO_MORNING: '朝の勤行',
  GONGYO_EVENING: '夜の勤行',
};

const MESSAGES = {
  greeting: 'ようこそ',
  toastSuccess: '保存しました',
  toastError: 'エラーが発生しました',
  toastWarning: '確認してください',
  toastInfo: 'お知らせ',
};

function get_message(key) {
  const k = String(key || '');
  const parts = k.split('.');
  let cur = MESSAGES;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return k;
  }
  return typeof cur === 'string' ? cur : k;
}

function get_term(key) {
  return TERMINOLOGY[key] || key;
}
