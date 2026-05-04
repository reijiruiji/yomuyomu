/**
 * メイン：フォーム・ボタン・設定画面を HTML と接続
 */

(function () {
  let chantingTimer = null;
  let chantingRunning = false;

  function applyYomyDisplaySettings(settings = {}) {
    const frame = settings.uiFrame || 'default';
    const text = settings.uiTextScale || 'normal';
    const shell = document.getElementById('yomy-fixed-device');
    if (shell) {
      const px = frame === 'narrow' ? '360px' : frame === 'wide' ? '428px' : '390px';
      shell.style.maxWidth = px;
    }
    const v15 = document.querySelector('#screen-practice .yomy-v15-shell');
    if (v15) {
      const mode = settings.themeMode || 'light';
      v15.classList.toggle('dark', mode === 'dark');
      const preset = settings.themePreset || 'default';
      v15.classList.toggle('yomy-theme-calm', preset === 'calm');
    }
    document.body.classList.remove('yomy-ui-text-compact', 'yomy-ui-text-comfort');
    if (text === 'compact') document.body.classList.add('yomy-ui-text-compact');
    else if (text === 'comfort') document.body.classList.add('yomy-ui-text-comfort');
  }

  window.applyYomyDisplaySettings = applyYomyDisplaySettings;

  async function refreshAll() {
    await updateDashboard?.();
    await updateCharts?.();
    const verEl = document.getElementById('app-version');
    const updEl = document.getElementById('app-updated');
    if (verEl) verEl.textContent = '1.0.0';
    if (updEl) {
      updEl.textContent = new Date().toLocaleDateString('ja-JP');
    }
  }

  async function hydrateSettings() {
    const data = await StorageManager.getUserData();
    const nameEl = document.getElementById('settings-name');
    const emailEl = document.getElementById('settings-email');
    const notifEl = document.getElementById('settings-notifications');
    const timeEl = document.getElementById('settings-notification-time');
    if (nameEl) nameEl.value = data.name || '';
    if (emailEl) emailEl.value = data.email || '';
    if (notifEl) notifEl.checked = !!data.settings?.notifications;
    if (timeEl) timeEl.value = data.settings?.notificationTime || '08:00';

    const frameSel = document.getElementById('settings-ui-frame');
    const textSel = document.getElementById('settings-ui-text');
    const themeModeSel = document.getElementById('settings-theme-mode');
    const themePresetSel = document.getElementById('settings-theme-preset');
    const debugCk = document.getElementById('settings-debug-mode');
    const s = data.settings || {};
    if (frameSel) frameSel.value = s.uiFrame || 'default';
    if (textSel) textSel.value = s.uiTextScale || 'normal';
    if (themeModeSel) themeModeSel.value = s.themeMode || 'light';
    if (themePresetSel) themePresetSel.value = s.themePreset || 'default';
    if (debugCk && typeof window.isDebugMode === 'function')
      debugCk.checked = window.isDebugMode();

    applyYomyDisplaySettings(s);

    const pDate = document.getElementById('practice-date');
    if (pDate && !pDate.value) {
      pDate.value = window.getTodayDateString?.() || new Date().toISOString().split('T')[0];
    }
  }

  async function showDanaInputModal(defaultValue = 500) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'yomy-modal-overlay';
      overlay.innerHTML = `
        <div class="yomy-modal-card">
          <h3>布施額を入力</h3>
          <p>円で半角数字をご入力ください。</p>
          <input type="number" inputmode="numeric" min="1" step="1" value="${defaultValue}" />
          <div class="yomy-modal-actions">
            <button type="button" class="btn btn-secondary" data-action="cancel">キャンセル</button>
            <button type="button" class="btn btn-primary" data-action="ok">保存</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      const input = overlay.querySelector('input');
      const ok = overlay.querySelector('[data-action="ok"]');
      const cancel = overlay.querySelector('[data-action="cancel"]');
      const close = (value) => {
        overlay.remove();
        resolve(value);
      };
      ok?.addEventListener('click', () => close(input?.value ?? null));
      cancel?.addEventListener('click', () => close(null));
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) close(null);
      });
      input?.focus();
      input?.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          ok?.click();
        } else if (ev.key === 'Escape') {
          cancel?.click();
        }
      });
    });
  }

  async function onPracticeSubmit(e) {
    e.preventDefault();
    const date = document.getElementById('practice-date')?.value;
    const count = Number(document.getElementById('practice-count')?.value);
    const minutes = Number(document.getElementById('practice-duration')?.value);
    const notes = document.getElementById('practice-notes')?.value?.trim() || '';

    if (!date) {
      showError?.('日付を入力してください');
      return;
    }
    if (Number.isNaN(count) || count < 1 || !Number.isInteger(count) || count > 9999) {
      showError?.('回数は1～9999の整数で入力してください');
      return;
    }
    if (Number.isNaN(minutes) || minutes < 0 || minutes > 1440) {
      showError?.('時間は0～1440分（24時間以内）で入力してください');
      return;
    }

    const durationSec = Math.round(minutes * 60);
    const selectedGongyo = window.st?.selectedGongyo;
    const gongyo = window.GG?.find(g => g.id === selectedGongyo);
    const merit_gongyo = gongyo ? gongyo.lines.join('').length * 10 : 0;
    const merit_chanting = Math.max(0, Math.round(count * (window.merit_system?.chant?.per_unit ?? 1)));
    const merit = merit_chanting + merit_gongyo;
    const count_gongyo = minutes > 0 ? Math.max(1, Math.round(minutes / 20)) : 0;

    await StorageManager.mergeSessionDay(date, {
      count,
      duration: durationSec,
      merit,
      notes,
      count_chanting: count,
      count_gongyo,
      merit_chanting,
      merit_gongyo,
    });

    showSuccess?.('修行を記録しました');
    if (notes) window.showReflectionPrompt?.(notes);
    else window.schedulePostPracticeReflection?.();
    window.startEvening19Schedule?.();
    await refreshAll();
    e.target.reset();
    document.getElementById('practice-date').value = window.getTodayDateString?.() || new Date().toISOString().split('T')[0];
  }

  function setupChantingCounter() {
    const btn = document.getElementById('btn-start-chanting');
    const resetBtn = document.getElementById('btn-reset-count');
    const display = document.getElementById('chanting-count');
    if (!btn || !display) return;

    btn.addEventListener('click', async () => {
      if (!chantingRunning) {
        chantingRunning = true;
        btn.textContent = 'お題目を停止（記録）';
        chantingTimer = window.setInterval(async () => {
          const n = Number(display.textContent) || 0;
          display.textContent = String(n + 1);
        }, 1500);
      } else {
        chantingRunning = false;
        window.clearInterval(chantingTimer);
        chantingTimer = null;
        btn.textContent = 'お題目を開始';
        const delta = Number(display.textContent) || 0;
        display.textContent = '0';
        if (delta > 0) {
          await StorageManager.mergeChantingDelta(delta);
          showSuccess?.(`${delta} 回を記録しました`);
          window.schedulePostPracticeReflection?.();
          window.startEvening19Schedule?.();
          await refreshAll();
        }
      }
    });

    resetBtn?.addEventListener('click', () => {
      display.textContent = '0';
      if (chantingRunning && chantingTimer) {
        window.clearInterval(chantingTimer);
        chantingTimer = null;
        chantingRunning = false;
        btn.textContent = 'お題目を開始';
      }
    });
  }

  function setupDana() {
    document.getElementById('btn-add-dana')?.addEventListener('click', async () => {
      const raw = await showDanaInputModal(500);
      if (raw == null) return;
      const amt = Number(String(raw).replace(/,/g, ''));
      if (!Number.isFinite(amt) || amt <= 0 || amt > 10000000) {
        showWarning?.('1円～1000万円の範囲で入力してください');
        return;
      }
      await StorageManager.addDanaRecord(amt);
      showSuccess?.('布施を記録しました');
      await refreshAll();
    });
  }

  function setupEmotionForm() {
    document.getElementById('btn-save-emotion')?.addEventListener('click', async () => {
      const readOptional10 = (id) => {
        const el = document.getElementById(id);
        const v = el?.value?.trim();
        if (v === '' || v === undefined) return null;
        const num = Number(v);
        if (!Number.isFinite(num) || num < 0 || num > 10 || !Number.isInteger(num)) return null;
        return num;
      };
      await StorageManager.saveTodayEmotion({
        log_pain: readOptional10('emo-pain'),
        log_refresh: readOptional10('emo-refresh'),
        log_joy: readOptional10('emo-joy'),
      });
      showSuccess?.('今日の主観ログを保存しました');
      await refreshAll();
    });
    document.getElementById('btn-clear-emotion')?.addEventListener('click', async () => {
      ['emo-pain', 'emo-refresh', 'emo-joy'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      await StorageManager.saveTodayEmotion({
        log_pain: null,
        log_refresh: null,
        log_joy: null,
      });
      showSuccess?.('クリアしました');
      await refreshAll();
    });
  }

  function setupDataButtons() {
    document.getElementById('btn-export-csv-sessions')?.addEventListener('click', async () => {
      const csv = await StorageManager.exportSessionsCsv();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `yomuyomu-sessions-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
      showInfo?.('セッション CSV を出力しました');
    });

    document.getElementById('btn-export-data')?.addEventListener('click', () => {
      const blob = new Blob([StorageManager.exportJson()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `yomuyomu-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      showInfo?.('エクスポートしました');
    });

    document.getElementById('btn-import-data')?.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json,.json';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        const text = await file.text();
        try {
          await StorageManager.importJson(text);
          showSuccess?.('インポートしました');
          await refreshAll();
        } catch {
          showError?.('JSON を読み取れませんでした');
        }
      };
      input.click();
    });

    document.getElementById('btn-clear-data')?.addEventListener('click', () => {
      showConfirmDialog?.(
        'データ削除',
        'すべてのローカルデータを削除します。よろしいですか？',
        async () => {
          await StorageManager.clearAll();
          await StorageManager.saveUserData({});
          showSuccess?.('クリアしました');
          await refreshAll();
          await hydrateSettings();
        },
      );
    });
  }

  function setupSettingsSave() {
    document.getElementById('btn-save-profile')?.addEventListener('click', async () => {
      const card = document.getElementById('btn-save-profile')?.closest?.('.card');
      if (!card || !document.getElementById('settings-name')) return;
      const data = await StorageManager.getUserData();
      data.name = document.getElementById('settings-name')?.value?.trim() || 'ゲスト';
      data.email = document.getElementById('settings-email')?.value?.trim() || '';
      data.settings = data.settings || {};
      data.settings.notifications = !!document.getElementById('settings-notifications')?.checked;
      data.settings.notificationTime = document.getElementById('settings-notification-time')?.value || '08:00';
      await StorageManager.saveUserData(data);
      window.__yomyApplyProfileName?.(data.name);
      showSuccess?.('プロフィールを保存しました');
      await refreshAll();
    });

    document.getElementById('btn-test-notification')?.addEventListener('click', async () => {
      showInfo?.('テスト通知を送信しました（対応ブラウザのみ）');
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('よむよむ', { body: 'これはテスト通知です', icon: '/images/icon-192x192.png' });
      }
    });
  }

  function setupFooter() {
    const about = (t, m) =>
      document.getElementById(t)?.addEventListener('click', (ev) => {
        ev.preventDefault();
        showInfo?.(m);
      });
    about('footer-about', 'よむよむお題目 — ローカル保存の勤行記録アプリです。');
    about('footer-privacy', 'データはあなたのブラウザ内にのみ保存されます（外部送信なし）。');
    about('footer-contact', 'お問い合わせはリポジトリのIssue等からどうぞ。');
  }

  function setupMisc() {
    document.getElementById('btn-check-updates')?.addEventListener('click', () => {
      showInfo?.('このビルドはローカル版です。更新はページの再読み込みで確認してください。');
    });

    document.getElementById('btn-cache-status')?.addEventListener('click', async () => {
      if (!('caches' in window)) {
        showWarning?.('Cache API が使えません');
        return;
      }
      const keys = await caches.keys();
      showInfo?.(`キャッシュ: ${keys.length} 件 — ${keys.join(', ') || 'なし'}`);
    });

    document.getElementById('btn-save-display')?.addEventListener('click', async () => {
      const d = await StorageManager.getUserData();
      d.settings = d.settings || {};
      d.settings.uiFrame =
        document.getElementById('settings-ui-frame')?.value || 'default';
      d.settings.uiTextScale =
        document.getElementById('settings-ui-text')?.value || 'normal';
      d.settings.themeMode =
        document.getElementById('settings-theme-mode')?.value || 'dark';
      d.settings.themePreset =
        document.getElementById('settings-theme-preset')?.value || 'default';
      await StorageManager.saveUserData(d);
      try {
        localStorage.setItem(
          'DEBUG_MODE',
          document.getElementById('settings-debug-mode')?.checked ? 'true' : 'false',
        );
      } catch {
        /* ignore */
      }
      applyYomyDisplaySettings(d.settings);
      showSuccess?.('表示を保存しました');
      await refreshAll();
    });

    document.querySelector('.tabs')?.addEventListener('click', (ev) => {
      if (!ev.target.closest('.tab[data-t]')) return;
      requestAnimationFrame(() => updateCharts?.());
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await hydrateSettings();
    setupChantingCounter();
    setupDana();
    setupEmotionForm();
    setupDataButtons();
    setupSettingsSave();
    setupFooter();
    setupMisc();

    document.getElementById('practice-form')?.addEventListener('submit', onPracticeSubmit);

    await refreshAll();
    // 設定タブ内のレポートボタンのイベントを追加
if (typeof generateWeekReport === 'function' && typeof generateMonthReport === 'function') {
  const weekBtn = document.getElementById('btn-gen-week-settings');
  const monthBtn = document.getElementById('btn-gen-month-settings');
  const copyBtn = document.getElementById('btn-copy-report-settings');
  const output = document.getElementById('report-output-settings');
  
  if (weekBtn) weekBtn.addEventListener('click', async () => {
    const report = await generateWeekReport();
    if (output) output.value = report;
  });
  if (monthBtn) monthBtn.addEventListener('click', async () => {
    const report = await generateMonthReport();
    if (output) output.value = report;
  });
  if (copyBtn && output) copyBtn.addEventListener('click', () => {
    output.select();
    document.execCommand('copy');
    showSuccess?.('コピーしました');
  });
}

// CSV/JSON 出力ボタン（設定タブ内）
const csvBtn = document.getElementById('btn-export-csv-sessions-settings');
const jsonBtn = document.getElementById('btn-export-json-settings');
if (csvBtn && typeof StorageManager !== 'undefined') {
  csvBtn.addEventListener('click', async () => {
    const csv = await StorageManager.exportSessionsCsv();
    const blob = new Blob([csv], {type: 'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `yomuyomu-${Date.now()}.csv`;
    a.click();
  });
}
if (jsonBtn) {
  jsonBtn.addEventListener('click', () => {
    const json = StorageManager.exportJson();
    const blob = new Blob([json], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `yomuyomu-${Date.now()}.json`;
    a.click();
  });
}
  });
})();
