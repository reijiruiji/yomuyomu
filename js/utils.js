/**
 * 共通ユーティリティ
 */

function log_debug(message, level = 'info') {
  const fn =
    level === 'error'
      ? console.error
      : level === 'warn'
        ? console.warn
        : console.log;
  fn('[yomuyomu]', message);
}
