/**
 * 一日の振り返り（下部バナー + サマリーモーダル）
 * 入口は window API と YomyReflection のみ（重複実装しない）
 */

(function () {
  let scheduleTimer = null;
  let eveningScheduleStarted = false;

  const BANNER_MSG = {
    practice:
      '修行おつかれさまです。<br />今日はどんな一日でしたか？',
    evening:
      '今日はどんな一日？<br /><span style="font-size:11px;opacity:.92;font-weight:400">タップして一日の記録（任意）</span>',
  };

  function todayIsoDate() {
    return window.getTodayDateString?.() || new Date().toISOString().split('T')[0];
  }

  function bannerEl() {
    return document.getElementById('post-practice-prompt');
  }

  function setBannerCopy(variant) {
    const wrap = bannerEl();
    const msgEl = document.getElementById('reflection-prompt-msg');
    if (!wrap || !msgEl) return;
    wrap.dataset.variant = variant === 'evening' ? 'evening' : 'practice';
    msgEl.innerHTML = BANNER_MSG[variant] || BANNER_MSG.practice;
  }

  function hideBanner() {
    const el = bannerEl();
    if (!el) return;
    el.classList.remove('yomy-reflection-tip--visible');
    el.hidden = true;
    setBannerCopy('practice');
  }

  function showBanner(variant) {
    const el = bannerEl();
    if (!el) return;
    setBannerCopy(variant);
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('yomy-reflection-tip--visible'));
  }

  async function loadTodaySlice() {
    if (typeof StorageManager === 'undefined')
      return { u: null, t: todayIsoDate(), session: null };
    const u = await StorageManager.getUserData();
    const t = todayIsoDate();
    const session = (u.sessions || []).find((x) => x.date === t) || null;
    return { u, t, session };
  }

  async function hasJournalFilledToday() {
    const { session: s } = await loadTodaySlice();
    if (!s) return false;
    if (s.journal_memo && String(s.journal_memo).trim()) return true;
    return (
      (Number(s.journal_joy_count) || 0) > 0 ||
      (Number(s.journal_luck_count) || 0) > 0 ||
      (Number(s.journal_relation_count) || 0) > 0
    );
  }

  function schedulePostPracticeReflection() {
    if (typeof StorageManager === 'undefined') return;
    window.clearTimeout(scheduleTimer);
    scheduleTimer = window.setTimeout(async () => {
      try {
        // 修行後は毎回（3秒後に）促す。すでに記録済みの日は出さない。
        if (await hasJournalFilledToday()) return;
        showBanner('practice');
      } catch (e) {
        console.warn('[Reflection]', e);
      }
    }, 3000);
  }

  function eveningKey(d) {
    return `yomy_evening19_${d}`;
  }

  async function tryEveningDailyPrompt() {
    const now = new Date();
    if (now.getHours() < 19) return;
    const d = todayIsoDate();
    const key = eveningKey(d);
    if (localStorage.getItem(key)) return;
    if (await hasJournalFilledToday()) {
      localStorage.setItem(key, '1');
      return;
    }
    const el = bannerEl();
    if (!el) return;
    if (!el.hidden && el.classList.contains('yomy-reflection-tip--visible')) return;
    localStorage.setItem(key, '1');
    showBanner('evening');
  }

  function startEvening19Schedule() {
    if (eveningScheduleStarted) return;
    eveningScheduleStarted = true;
    const run = () =>
      tryEveningDailyPrompt().catch((e) => console.warn('[Reflection evening]', e));
    run();
    const msToNextMinute = 60000 - (Date.now() % 60000);
    window.setTimeout(() => {
      run();
      window.setInterval(run, 60 * 1000);
    }, Math.max(0, msToNextMinute));
  }

  function setModalPracticeText(session) {
    const el = document.getElementById('modal-practice-info');
    if (!el) return;
    if (!session) {
      el.textContent =
        'まだ今日の修行は入っていません。あとから唱数を足しても、このメモは同日にまとまります。';
      return;
    }
    const c = Number(session.count) || 0;
    const m = Number(session.merit) || 0;
    const min = Math.round((Number(session.duration) || 0) / 60);
    const gt = session.gongyo_type || 'none';
    const gLabel =
      gt === 'morning'
        ? '朝'
        : gt === 'evening'
          ? '夜'
          : gt === 'custom'
            ? `カスタム ${Number(session.gongyo_custom_chars) || 0}`
            : 'なし';
    el.textContent = `お題目（合算） ${c} 回 · 勤行 ${gLabel} · 記録上の功徳 ${m}（合計）`;
  }

  async function hydrateDailySummaryForm() {
    const { t, session: s } = await loadTodaySlice();
    const title = document.getElementById('modal-date-title');
    if (title) title.textContent = `今日の一日（${t}）`;
    setModalPracticeText(s);

    const setNum = (id, field) => {
      const inp = document.getElementById(id);
      if (!inp) return;
      const raw = s != null ? s[field] : null;
      inp.value =
        raw != null && raw !== ''
          ? String(Number(raw))
          : '';
    };

    setNum('daily-joy-count', 'journal_joy_count');
    setNum('daily-luck-count', 'journal_luck_count');
    setNum('daily-relation-count', 'journal_relation_count');

    const memo = document.getElementById('daily-memo');
    if (memo) memo.value = s && s.journal_memo ? String(s.journal_memo) : '';

    const aw = document.getElementById('include-awakening-test');
    if (aw) aw.checked = !!(s && s.journal_awakening_requested);

    const gt = document.getElementById('daily-gongyo-type');
    const gc = document.getElementById('daily-gongyo-custom-chars');
    if (gt) gt.value = s && s.gongyo_type ? String(s.gongyo_type) : 'none';
    if (gc) gc.value = s && s.gongyo_custom_chars ? String(Number(s.gongyo_custom_chars) || 0) : '';
    const syncCustom = () => {
      if (!gt || !gc) return;
      const on = gt.value === 'custom';
      gc.disabled = !on;
      gc.style.opacity = on ? '1' : '0.55';
    };
    syncCustom();
    gt?.addEventListener('change', syncCustom, { once: true });
  }

  async function openDailySummaryModal() {
    const ov = document.getElementById('dailySummaryOverlay');
    if (!ov) return;
    await hydrateDailySummaryForm();
    ov.classList.add('show');
    hideBanner();
  }

  function closeDailySummary() {
    document.getElementById('dailySummaryOverlay')?.classList.remove('show');
  }

  function parseCountInput(id) {
    const el = document.getElementById(id);
    const raw = el?.value?.trim();
    if (raw === '' || raw == null) return 0;
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(999, Math.round(n));
  }

  async function saveDailySummaryFromForm() {
    if (typeof StorageManager === 'undefined') return;
    const t = todayIsoDate();
    const { session: cur } = await loadTodaySlice();
    const memoEl = document.getElementById('daily-memo');
    const memo = memoEl ? String(memoEl.value || '').slice(0, 2000) : '';
    const awakening = !!document.getElementById('include-awakening-test')?.checked;

    const gongyoType = document.getElementById('daily-gongyo-type')?.value || 'none';
    const customCharsRaw = document.getElementById('daily-gongyo-custom-chars')?.value;
    const customChars = Math.max(0, Math.round(Number(customCharsRaw) || 0));
    const desiredGongyoMerit =
      gongyoType === 'morning'
        ? 2840
        : gongyoType === 'evening'
          ? 1420
          : gongyoType === 'custom'
            ? customChars
            : 0;
    const desiredGongyoCount = gongyoType === 'none' ? 0 : desiredGongyoMerit > 0 ? 1 : 0;
    const curGongyoMerit = Number(cur?.merit_gongyo) || 0;
    const curGongyoCount = Number(cur?.count_gongyo) || 0;
    const deltaGongyoMerit = desiredGongyoMerit - curGongyoMerit;
    const deltaGongyoCount = desiredGongyoCount - curGongyoCount;

    await StorageManager.mergeSessionDay(t, {
      count: 0,
      duration: 0,
      merit: deltaGongyoMerit,
      count_chanting: 0,
      count_gongyo: deltaGongyoCount,
      merit_chanting: 0,
      merit_gongyo: deltaGongyoMerit,
      journal_joy_count: parseCountInput('daily-joy-count'),
      journal_luck_count: parseCountInput('daily-luck-count'),
      journal_relation_count: parseCountInput('daily-relation-count'),
      journal_memo: memo,
      journal_awakening_requested: awakening,
      gongyo_type: gongyoType,
      gongyo_custom_chars: customChars,
    });
    closeDailySummary();
    if (typeof showSuccess === 'function') showSuccess('今日の記録を保存しました');
    if (typeof updateDashboard === 'function') await updateDashboard();
    if (typeof updateCharts === 'function') await updateCharts();

    // 金曜/日曜/月末は「週/月のふりかえり」へ（任意）
    try {
      await maybeTriggerPeriodPrompts();
    } catch (e) {
      console.warn('[period prompts]', e);
    }
  }

  function showOverlay(id) {
    document.getElementById(id)?.classList.add('show');
  }
  function hideOverlay(id) {
    document.getElementById(id)?.classList.remove('show');
  }
  function ymd(d) {
    return d.toISOString().split('T')[0];
  }
  function weekKeySunday(d) {
    const dt = new Date(d);
    dt.setHours(12, 0, 0, 0);
    dt.setDate(dt.getDate() - dt.getDay());
    return ymd(dt);
  }
  function monthKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  async function maybeTriggerPeriodPrompts() {
    const { session: s } = await loadTodaySlice();
    if (!s) return;
    const didPractice = (Number(s.count) || 0) > 0 || (Number(s.count_gongyo) || 0) > 0;
    if (!didPractice) return;
    const now = new Date();
    const dow = now.getDay(); // 0 sun
    const isFri = dow === 5;
    const isSun = dow === 0;
    const isMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() === now.getDate();

    const u = await StorageManager.getUserData();
    const wk = weekKeySunday(now);
    const mk = monthKey(now);

    if ((isFri || isSun) && !u.reflections.weekly[wk]) {
      document.getElementById('weekly-title').textContent = `この週のふりかえり（${wk}〜）`;
      showOverlay('weeklySummaryOverlay');
      return;
    }
    if (isMonthEnd && !u.reflections.monthly[mk]) {
      document.getElementById('monthly-title').textContent = `この月のふりかえり（${mk}）`;
      showOverlay('monthlySummaryOverlay');
    }
  }

  async function saveWeeklyMemo() {
    const memo = String(document.getElementById('weekly-memo')?.value || '').slice(0, 2000);
    const now = new Date();
    const wk = weekKeySunday(now);
    const u = await StorageManager.getUserData();
    u.reflections.weekly[wk] = { memo, saved_at: new Date().toISOString() };
    await StorageManager.saveUserData(u);
    hideOverlay('weeklySummaryOverlay');
    showOverlay('growthOverlay');
  }

  async function saveMonthlyMemo() {
    const memo = String(document.getElementById('monthly-memo')?.value || '').slice(0, 2000);
    const now = new Date();
    const mk = monthKey(now);
    const u = await StorageManager.getUserData();
    u.reflections.monthly[mk] = { memo, saved_at: new Date().toISOString() };
    await StorageManager.saveUserData(u);
    hideOverlay('monthlySummaryOverlay');
    showOverlay('growthOverlay');
  }

  async function saveAwakeningPopup() {
    const clamp10 = (v) => {
      if (v == null || v === '') return null;
      const n = Number(v);
      if (!Number.isFinite(n)) return null;
      return Math.max(0, Math.min(10, Math.round(n)));
    };
    const clampCnt = (v) => {
      if (v == null || v === '') return 0;
      const n = Number(v);
      if (!Number.isFinite(n) || n < 0) return 0;
      return Math.min(999, Math.round(n));
    };
    const t = todayIsoDate();
    await StorageManager.mergeSessionDay(t, {
      count: 0,
      duration: 0,
      merit: 0,
      count_chanting: 0,
      count_gongyo: 0,
      merit_chanting: 0,
      merit_gongyo: 0,
      aw_samadhi: clamp10(document.getElementById('awp-samadhi')?.value),
      aw_sila: clampCnt(document.getElementById('awp-sila')?.value),
      aw_indriya_hearing: clamp10(document.getElementById('awp-hearing')?.value),
      aw_indriya_sight: clamp10(document.getElementById('awp-sight')?.value),
      aw_indriya_smell: clamp10(document.getElementById('awp-smell')?.value),
      aw_indriya_taste: clamp10(document.getElementById('awp-taste')?.value),
      aw_indriya_touch: clamp10(document.getElementById('awp-touch')?.value),
    });
    hideOverlay('awakeningTestOverlay');
    if (typeof showSuccess === 'function') showSuccess('覚醒度を保存しました');
    if (typeof updateDashboard === 'function') await updateDashboard();
    if (typeof updateCharts === 'function') await updateCharts();
  }

  function showReflectionPrompt(notePreview) {
    if (!notePreview || !notePreview.trim()) return;
    if (typeof showInfo === 'function') {
      showInfo(
        `記録しました。メモ: ${notePreview.slice(0, 80)}${notePreview.length > 80 ? '…' : ''}`,
      );
    }
    schedulePostPracticeReflection();
  }

  /** デバッグ・将来用：モジュールの単一参照 */
  const YomyReflection = {
    schedulePostPracticeReflection,
    dismissPostPracticePrompt: hideBanner,
    openDailySummaryModal,
    closeDailySummary,
    saveDailySummaryFromForm,
    showReflectionPrompt,
    tryEveningDailyPrompt,
    hasJournalFilledToday,
  };

  window.YomyReflection = YomyReflection;

  window.schedulePostPracticeReflection = schedulePostPracticeReflection;
  window.dismissPostPracticePrompt = hideBanner;
  window.openDailySummaryModal = openDailySummaryModal;
  window.closeDailySummary = closeDailySummary;
  window.showReflectionPrompt = showReflectionPrompt;

  window.open_daily_summary = openDailySummaryModal;
  window.dismiss_reflection = hideBanner;
  window.close_daily_summary = closeDailySummary;
  window.save_daily_summary = () =>
    saveDailySummaryFromForm().catch((e) => console.warn('[save_daily_summary]', e));

  function bindReflectionDom() {
    document.body.addEventListener('click', (ev) => {
      if (ev.target.closest?.('#reflection-open-summary')) {
        ev.preventDefault();
        openDailySummaryModal().catch((e) => console.warn('[Reflection]', e));
        return;
      }
      if (ev.target.closest?.('#reflection-dismiss')) {
        ev.preventDefault();
        hideBanner();
        return;
      }
      if (ev.target.closest?.('#daily-summary-save')) {
        ev.preventDefault();
        saveDailySummaryFromForm().catch(console.error);
        return;
      }
      if (ev.target.closest?.('#daily-summary-cancel')) {
        ev.preventDefault();
        closeDailySummary();
      }
    });

    document.getElementById('dailySummaryOverlay')?.addEventListener('click', (ev) => {
      if (ev.target === ev.currentTarget) closeDailySummary();
    });

    // 週/月/成長/覚醒度 ポップアップ
    document.getElementById('weekly-save')?.addEventListener('click', () => {
      saveWeeklyMemo().catch((e) => console.warn('[weekly save]', e));
    });
    document.getElementById('weekly-cancel')?.addEventListener('click', () => {
      hideOverlay('weeklySummaryOverlay');
    });
    document.getElementById('monthly-save')?.addEventListener('click', () => {
      saveMonthlyMemo().catch((e) => console.warn('[monthly save]', e));
    });
    document.getElementById('monthly-cancel')?.addEventListener('click', () => {
      hideOverlay('monthlySummaryOverlay');
    });
    document.getElementById('growth-next')?.addEventListener('click', () => {
      hideOverlay('growthOverlay');
      showOverlay('awakeningTestOverlay');
    });
    document.getElementById('growth-skip')?.addEventListener('click', () => {
      hideOverlay('growthOverlay');
    });
    document.getElementById('awp-save')?.addEventListener('click', () => {
      saveAwakeningPopup().catch((e) => console.warn('[awp save]', e));
    });
    document.getElementById('awp-cancel')?.addEventListener('click', () => {
      hideOverlay('awakeningTestOverlay');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindReflectionDom();
    startEvening19Schedule();
  });
})();
