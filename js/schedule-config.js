/**
 * スケジュール設定（将来拡張用のスタブ）
 */

const DEFAULT_SCHEDULE = {
  chantReminderEnabled: false,
  chantReminderTime: '08:00',
};

function get_schedule_config() {
  try {
    const raw = localStorage.getItem('yomuyomu_schedule');
    if (!raw) return { ...DEFAULT_SCHEDULE };
    return { ...DEFAULT_SCHEDULE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SCHEDULE };
  }
}

function save_schedule_config(cfg) {
  localStorage.setItem('yomuyomu_schedule', JSON.stringify({ ...DEFAULT_SCHEDULE, ...cfg }));
}
