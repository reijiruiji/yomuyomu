/**
 * ユーザーデータの永続化（localStorage key: user_data）
 */

const USER_STORAGE_KEY = 'user_data';

function clampOptionalEmotion10(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(10, Math.round(n)));
}

function clampJournalCountField(v) {
  if (v == null || v === '') return 0;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(999, Math.round(n));
}

function normalizeJournalMemo(m) {
  if (typeof m !== 'string') return '';
  return m.slice(0, 2000);
}

function getTodayDateString() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - offsetMs);
  return localDate.toISOString().split('T')[0];
}

window.getTodayDateString = getTodayDateString;

const JOURNAL_PATCH_KEYS = [
  'journal_joy_count',
  'journal_luck_count',
  'journal_relation_count',
  'journal_memo',
  'journal_awakening_requested',
];

const GONGYO_PATCH_KEYS = ['gongyo_type', 'gongyo_custom_chars'];

const AWAKENING_TEST_KEYS = [
  'aw_samadhi',
  'aw_sila',
  'aw_indriya_hearing',
  'aw_indriya_sight',
  'aw_indriya_smell',
  'aw_indriya_taste',
  'aw_indriya_touch',
];

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
    reflections: {
      weekly: {},
      monthly: {},
    },
    settings: {
      notifications: true,
      notificationTime: '08:00',
      /** メイン枠: narrow | default | wide */
      uiFrame: 'default',
      /** 統計まわりの文字: compact | normal | comfort */
      uiTextScale: 'normal',
      /** テーマ: light | dark */
      themeMode: 'dark',
      /** 色プリセット: default | calm */
      themePreset: 'default',
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
    log_pain: clampOptionalEmotion10(s.log_pain),
    log_refresh: clampOptionalEmotion10(s.log_refresh),
    log_joy: clampOptionalEmotion10(s.log_joy),
    journal_joy_count: clampJournalCountField(s.journal_joy_count),
    journal_luck_count: clampJournalCountField(s.journal_luck_count),
    journal_relation_count: clampJournalCountField(s.journal_relation_count),
    journal_memo: normalizeJournalMemo(s.journal_memo),
    journal_awakening_requested: !!s.journal_awakening_requested,
    gongyo_type:
      s.gongyo_type === 'morning' || s.gongyo_type === 'evening' || s.gongyo_type === 'custom'
        ? s.gongyo_type
        : 'none',
    gongyo_custom_chars: (() => {
      const n = Number(s.gongyo_custom_chars);
      if (!Number.isFinite(n) || n < 0) return 0;
      return Math.min(99999, Math.round(n));
    })(),
    aw_samadhi: clampOptionalEmotion10(s.aw_samadhi),
    aw_sila: (() => {
      const n = Number(s.aw_sila);
      if (!Number.isFinite(n) || n < 0) return 0;
      return Math.min(999, Math.round(n));
    })(),
    aw_indriya_hearing: clampOptionalEmotion10(s.aw_indriya_hearing),
    aw_indriya_sight: clampOptionalEmotion10(s.aw_indriya_sight),
    aw_indriya_smell: clampOptionalEmotion10(s.aw_indriya_smell),
    aw_indriya_taste: clampOptionalEmotion10(s.aw_indriya_taste),
    aw_indriya_touch: clampOptionalEmotion10(s.aw_indriya_touch),
  };
}

function normalizeUserData(raw) {
  const d = { ...defaultUserData(), ...raw };
  d.sessions = Array.isArray(raw.sessions)
    ? raw.sessions.map(normalizeSession)
    : [];
  d.dana = Array.isArray(raw.dana) ? raw.dana : [];
  if (!d.reflections || typeof d.reflections !== 'object') d.reflections = { weekly: {}, monthly: {} };
  if (!d.reflections.weekly || typeof d.reflections.weekly !== 'object') d.reflections.weekly = {};
  if (!d.reflections.monthly || typeof d.reflections.monthly !== 'object') d.reflections.monthly = {};
  ABILITY_KEYS.forEach((k) => {
    const n = Number(raw[k]);
    d[k] = Number.isFinite(n) ? Math.min(10, Math.max(0, n)) : 3;
  });
  const defS = defaultUserData().settings;
  if (!d.settings || typeof d.settings !== 'object') d.settings = { ...defS };
  else d.settings = { ...defS, ...d.settings };
  if (!['narrow', 'default', 'wide'].includes(d.settings.uiFrame)) d.settings.uiFrame = 'default';
  if (!['compact', 'normal', 'comfort'].includes(d.settings.uiTextScale)) d.settings.uiTextScale = 'normal';
  if (!['light', 'dark'].includes(d.settings.themeMode)) d.settings.themeMode = 'dark';
  if (!['default', 'calm'].includes(d.settings.themePreset)) d.settings.themePreset = 'default';
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
    const rawNext = {
      date,
      count: Number(patch.count) || 0,
      duration: Number(patch.duration) || 0,
      merit: meritAdd,
      notes: patch.notes || '',
      count_chanting: patch.count_chanting,
      count_gongyo: patch.count_gongyo,
      merit_chanting: patch.merit_chanting,
      merit_gongyo: patch.merit_gongyo,
    };
    ['log_pain', 'log_refresh', 'log_joy'].forEach((ek) => {
      if (Object.prototype.hasOwnProperty.call(patch, ek)) rawNext[ek] = patch[ek];
    });
    JOURNAL_PATCH_KEYS.forEach((jk) => {
      if (Object.prototype.hasOwnProperty.call(patch, jk)) rawNext[jk] = patch[jk];
    });
    GONGYO_PATCH_KEYS.forEach((gk) => {
      if (Object.prototype.hasOwnProperty.call(patch, gk)) rawNext[gk] = patch[gk];
    });
    AWAKENING_TEST_KEYS.forEach((ak) => {
      if (Object.prototype.hasOwnProperty.call(patch, ak)) rawNext[ak] = patch[ak];
    });
    const nextPatch = normalizeSession(rawNext);

    if (idx === -1) {
      sessions.push(nextPatch);
    } else {
      const cur = sessions[idx];
      const emo = {
        log_pain: Object.prototype.hasOwnProperty.call(patch, 'log_pain')
          ? clampOptionalEmotion10(patch.log_pain)
          : cur.log_pain,
        log_refresh: Object.prototype.hasOwnProperty.call(patch, 'log_refresh')
          ? clampOptionalEmotion10(patch.log_refresh)
          : cur.log_refresh,
        log_joy: Object.prototype.hasOwnProperty.call(patch, 'log_joy')
          ? clampOptionalEmotion10(patch.log_joy)
          : cur.log_joy,
      };
      const jour = {
        journal_joy_count: Object.prototype.hasOwnProperty.call(patch, 'journal_joy_count')
          ? clampJournalCountField(patch.journal_joy_count)
          : cur.journal_joy_count,
        journal_luck_count: Object.prototype.hasOwnProperty.call(patch, 'journal_luck_count')
          ? clampJournalCountField(patch.journal_luck_count)
          : cur.journal_luck_count,
        journal_relation_count: Object.prototype.hasOwnProperty.call(patch, 'journal_relation_count')
          ? clampJournalCountField(patch.journal_relation_count)
          : cur.journal_relation_count,
        journal_memo: Object.prototype.hasOwnProperty.call(patch, 'journal_memo')
          ? normalizeJournalMemo(patch.journal_memo)
          : cur.journal_memo,
        journal_awakening_requested: Object.prototype.hasOwnProperty.call(
          patch,
          'journal_awakening_requested',
        )
          ? !!patch.journal_awakening_requested
          : cur.journal_awakening_requested,
      };
      const gong = {
        gongyo_type: Object.prototype.hasOwnProperty.call(patch, 'gongyo_type')
          ? patch.gongyo_type
          : cur.gongyo_type,
        gongyo_custom_chars: Object.prototype.hasOwnProperty.call(patch, 'gongyo_custom_chars')
          ? patch.gongyo_custom_chars
          : cur.gongyo_custom_chars,
      };
      const awt = {};
      AWAKENING_TEST_KEYS.forEach((ak) => {
        awt[ak] = Object.prototype.hasOwnProperty.call(patch, ak) ? patch[ak] : cur[ak];
      });
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
        log_pain: emo.log_pain,
        log_refresh: emo.log_refresh,
        log_joy: emo.log_joy,
        ...jour,
        ...gong,
        ...awt,
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
    const today = getTodayDateString();
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

  /**
   * sessions 行の CSV（議事録想定: 分析用）。evidence_day_index は EvidenceMetrics による記録用スコア。
   */
  async exportSessionsCsv() {
    const u = await StorageManager.getUserData();
    const rows = u.sessions || [];
    const header = [
      'date',
      'count',
      'duration_sec',
      'merit',
      'count_chanting',
      'count_gongyo',
      'gongyo_type',
      'gongyo_custom_chars',
      'notes',
      'log_pain',
      'log_refresh',
      'log_joy',
      'aw_samadhi',
      'aw_sila',
      'aw_indriya_hearing',
      'aw_indriya_sight',
      'aw_indriya_smell',
      'aw_indriya_taste',
      'aw_indriya_touch',
      'journal_joy_count',
      'journal_luck_count',
      'journal_relation_count',
      'journal_memo',
      'journal_awakening_requested',
      'evidence_day_index',
    ];
    const lines = [header.join(',')];
    for (const raw of rows) {
      const s = normalizeSession(raw);
      let idx = '';
      if (typeof window.EvidenceMetrics !== 'undefined' && EvidenceMetrics.computeEvidenceDayIndex) {
        idx = String(EvidenceMetrics.computeEvidenceDayIndex(s).index);
      }
      const esc = (t) => {
        const x = t == null ? '' : String(t);
        if (/[",\n\r]/.test(x)) return '"' + x.replace(/"/g, '""') + '"';
        return x;
      };
      lines.push(
        [
          s.date,
          s.count,
          s.duration,
          s.merit,
          s.count_chanting,
          s.count_gongyo,
          esc(s.gongyo_type),
          s.gongyo_custom_chars ?? '',
          esc(s.notes),
          s.log_pain == null ? '' : s.log_pain,
          s.log_refresh == null ? '' : s.log_refresh,
          s.log_joy == null ? '' : s.log_joy,
          s.aw_samadhi == null ? '' : s.aw_samadhi,
          s.aw_sila == null ? '' : s.aw_sila,
          s.aw_indriya_hearing == null ? '' : s.aw_indriya_hearing,
          s.aw_indriya_sight == null ? '' : s.aw_indriya_sight,
          s.aw_indriya_smell == null ? '' : s.aw_indriya_smell,
          s.aw_indriya_taste == null ? '' : s.aw_indriya_taste,
          s.aw_indriya_touch == null ? '' : s.aw_indriya_touch,
          s.journal_joy_count ?? '',
          s.journal_luck_count ?? '',
          s.journal_relation_count ?? '',
          esc(s.journal_memo),
          s.journal_awakening_requested ? '1' : '',
          idx,
        ].join(','),
      );
    }
    return '\uFEFF' + lines.join('\n');
  },

  /** 今日の主観ログのみ更新（唱数と独立） */
  async saveTodayEmotion({ log_pain, log_refresh, log_joy }) {
    const today = getTodayDateString();
    return StorageManager.mergeSessionDay(today, {
      count: 0,
      duration: 0,
      merit: 0,
      count_chanting: 0,
      count_gongyo: 0,
      merit_chanting: 0,
      merit_gongyo: 0,
      log_pain,
      log_refresh,
      log_joy,
    });
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
