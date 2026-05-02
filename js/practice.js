/**
 * 功徳計算など（フォームと連携）
 */

function computePracticeMerit(count, durationMinutes) {
  const c = Number(count) || 0;
  const m = Number(durationMinutes) || 0;
  return Math.round(c * 5 + m * 10);
}
