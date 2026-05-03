/**
 * 軽量デバッグ（localStorage DEBUG_MODE が true のときだけ詳細ログ）
 */

function isDebugMode() {
  try {
    return localStorage.getItem('DEBUG_MODE') === 'true';
  } catch {
    return false;
  }
}

function logDebug(message, level = 'info') {
  if (!isDebugMode()) return;
  const ts = new Date().toISOString();
  const prefix = `[${ts}] [${String(level).toUpperCase()}]`;
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

function getStorageSize() {
  let totalChars = 0;
  let itemCount = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const v = localStorage.getItem(key);
      if (v == null) continue;
      totalChars += key.length + v.length;
      itemCount++;
    }
  } catch (e) {
    logDebug(e, 'error');
  }
  return {
    total_size_kb: (totalChars / 1024).toFixed(2),
    item_count: itemCount,
  };
}

window.isDebugMode = isDebugMode;
window.log_debug = logDebug;
window.get_storage_size = getStorageSize;
