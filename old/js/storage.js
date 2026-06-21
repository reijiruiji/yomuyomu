/**
 * ユーザーデータの永続化（localStorage key: user_data）
 */

const USER_STORAGE_KEY = 'user_data';

const ABILITY_KEYS = [
  'ability_sati',
  'ability_vipassana',
  'ability_bodhi',
  'ability_prajna',
  'ability_samadhi',
  'ability_shila',
  'ability_metta',
  'ability_karuna',
  'ability_mudita',
];

function defaultUserData() {
  const base = {
    name: 'ゲスト',
    email: '',
    sessions: [],
    dana: [],
    settings: {
      notifications: true,
      notificationTime: '08:00',
    },
  };
  ABILITY_KEYS.forEach((k) => {
    base[k] = 3;
  });
  return base;
}

function normalizeSession(s) {
  const date = (s.date || '').split('T')[0];
  const count = Number(s.count) || 0;
  const duration = Number(s.duration) || 0;
  const merit = Number(s.merit) || 0;
  const cc = Number(s.count_chanting);
  const cg = Number(s.count_gongyo);
  const count_chanting = Number.isFinite(cc) ? cc : count;
  const count_gongyo = Number.isFinite(cg) ? cg : 0;
  let merit_chanting = Number(s.merit_chanting);
  let merit_gongyo = Number(s.merit_gongyo);
  if (!Number.isFinite(merit_chanting)) merit_chanting = merit;
  if (!Number.isFinite(merit_gongyo)) merit_gongyo = 0;
  return {
    ...s,
    date,
    count,
    duration,
    merit,
    count_chanting,
    count_gongyo,
    merit_chanting,
    merit_gongyo,
    notes: s.notes || '',
  };
}

function normalizeUserData(raw) {
  const d = { ...defaultUserData(), ...raw };
  d.sessions = Array.isArray(raw.sessions)
    ? raw.sessions.map(normalizeSession)
    : [];
  d.dana = Array.isArray(raw.dana) ? raw.dana : [];
  ABILITY_KEYS.forEach((k) => {
    const n = Number(raw[k]);
    d[k] = Number.isFinite(n) ? Math.min(10, Math.max(0, n)) : 3;
  });
  if (!d.settings || typeof d.settings !== 'object') d.settings = defaultUserData().settings;
  return d;
}

function bumpAbilitiesFromMerit(userData, meritDelta) {
  if (!meritDelta || meritDelta <= 0) return userData;
  const keys = [...ABILITY_KEYS];
  const idx = Math.floor(Math.random() * keys.length);
  const k = keys[idx];
  const add = Math.min(10 - userData[k], meritDelta / 500);
  userData[k] = Math.round((userData[k] + add) * 10) / 10;
  userData[k] = Math.min(10, userData[k]);
  return userData;
}

const StorageManager = {
  async getUserData() {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      if (!raw) return normalizeUserData({});
      return normalizeUserData(JSON.parse(raw));
    } catch (e) {
      console.error('[Storage]', e);
      return normalizeUserData({});
    }
  },

  async saveUserData(data) {
    const normalized = normalizeUserData(data);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  },

  /**
   * 指定日のセッションをマージ保存（同一日は count / duration / merit を加算）
   */
  async mergeSessionDay(dateStr, patch) {
    const u = await StorageManager.getUserData();
    const date = dateStr.split('T')[0];
    let sessions = [...u.sessions];
    const idx = sessions.findIndex((s) => s.date === date);
    const meritAdd = Number(patch.merit) || 0;
    const nextPatch = normalizeSession({
      date,
      count: Number(patch.count) || 0,
      duration: Number(patch.duration) || 0,
      merit: meritAdd,
      notes: patch.notes || '',
      count_chanting: patch.count_chanting,
      count_gongyo: patch.count_gongyo,
      merit_chanting: patch.merit_chanting,
      merit_gongyo: patch.merit_gongyo,
    });

    if (idx === -1) {
      sessions.push(nextPatch);
    } else {
      const cur = sessions[idx];
      sessions[idx] = normalizeSession({
        date,
        count: cur.count + nextPatch.count,
        duration: cur.duration + nextPatch.duration,
        merit: cur.merit + nextPatch.merit,
        notes: nextPatch.notes || cur.notes,
        count_chanting: cur.count_chanting + nextPatch.count_chanting,
        count_gongyo: cur.count_gongyo + nextPatch.count_gongyo,
        merit_chanting: cur.merit_chanting + nextPatch.merit_chanting,
        merit_gongyo: cur.merit_gongyo + nextPatch.merit_gongyo,
      });
    }

    u.sessions = sessions;
    bumpAbilitiesFromMerit(u, meritAdd);
    await StorageManager.saveUserData(u);
    return u;
  },

  async mergeChantingDelta(deltaCount) {
    const n = Number(deltaCount) || 0;
    if (n <= 0) return StorageManager.getUserData();
    const today = new Date().toISOString().split('T')[0];
    const merit = n * 5;
    return StorageManager.mergeSessionDay(today, {
      count: n,
      duration: 0,
      merit,
      count_chanting: n,
      count_gongyo: 0,
      merit_chanting: merit,
      merit_gongyo: 0,
    });
  },

  async addDanaRecord(amountYen) {
    const u = await StorageManager.getUserData();
    const amt = Number(amountYen);
    if (!Number.isFinite(amt) || amt <= 0) return u;
    u.dana.push({
      date: new Date().toISOString(),
      amount: Math.round(amt),
    });
    await StorageManager.saveUserData(u);
    return u;
  },

  exportJson() {
    return localStorage.getItem(USER_STORAGE_KEY) || JSON.stringify(normalizeUserData({}));
  },

  async importJson(text) {
    const obj = JSON.parse(text);
    await StorageManager.saveUserData(obj);
  },

  async clearAll() {
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};

window.StorageManager = StorageManager;
