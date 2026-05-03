/**
 * 功徳計算など（フォームと連携）
 */

const merit_system = {
  chant: { per_unit: 1, multiplier: 1 },
  gongyo: {
    per_char: 1,
    standard_chars: {
      morning: 2840,
      evening: 1420,
    },
  },
};

function calculate_daily_merit(chant_count, gongyo_type, custom_chars = 0) {
  const c = Math.max(0, Math.round(Number(chant_count) || 0));
  let merit = c * merit_system.chant.per_unit * merit_system.chant.multiplier;
  if (gongyo_type === 'morning') merit += merit_system.gongyo.standard_chars.morning * merit_system.gongyo.per_char;
  else if (gongyo_type === 'evening') merit += merit_system.gongyo.standard_chars.evening * merit_system.gongyo.per_char;
  else if (gongyo_type === 'custom') {
    const chars = Math.max(0, Math.round(Number(custom_chars) || 0));
    merit += chars * merit_system.gongyo.per_char;
  }
  return Math.round(merit);
}

function computePracticeMerit(count, durationMinutes) {
  const chantMerit = Math.max(0, Math.round(Number(count) || 0)) * (merit_system.chant.per_unit || 1);
  const gongyoMerit = Math.max(0, Math.round(Number(durationMinutes) || 0) * 10);
  return chantMerit + gongyoMerit;
}

window.merit_system = merit_system;
window.calculate_daily_merit = calculate_daily_merit;
