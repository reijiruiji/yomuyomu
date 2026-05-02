/**
 * メイン：フォーム・ボタン・設定画面を HTML と接続
 */

(function () {
  let chantingTimer = null;
  let chantingRunning = false;

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

    const pDate = document.getElementById('practice-date');
    if (pDate && !pDate.value) {
      pDate.value = new Date().toISOString().split('T')[0];
    }
  }

  async function onPracticeSubmit(e) {
    e.preventDefault();
    const date = document.getElementById('practice-date')?.value;
    const count = Number(document.getElementById('practice-count')?.value);
    const minutes = Number(document.getElementById('practice-duration')?.value);
    const notes = document.getElementById('practice-notes')?.value?.trim() || '';

    if (!date || Number.isNaN(count) || Number.isNaN(minutes)) {
      showError?.('日付・回数・時間を入力してください');
      return;
    }

    const durationSec = Math.round(minutes * 60);
    const merit = computePracticeMerit(count, minutes);
    const merit_gongyo = Math.round(minutes * 10);
    const merit_chanting = Math.max(0, merit - merit_gongyo);
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
    showReflectionPrompt?.(notes);
    await refreshAll();
    e.target.reset();
    document.getElementById('practice-date').value = new Date().toISOString().split('T')[0];
  }

  function setupChantingCounter() {
    const btn = document.getElementById('btn-start-chanting');
    const resetBtn = document.getElementById('btn-reset-count');
    const display = document.getElementById('chanting-count');
    if (!btn || !display) return;

    btn.addEventListener('click', async () => {
      if (!chantingRunning) {
        chantingRunning = true;
        btn.textContent = '念仏を停止（記録）';
        chantingTimer = window.setInterval(async () => {
          const n = Number(display.textContent) || 0;
          display.textContent = String(n + 1);
        }, 1500);
      } else {
        chantingRunning = false;
        window.clearInterval(chantingTimer);
        chantingTimer = null;
        btn.textContent = '念仏を開始';
        const delta = Number(display.textContent) || 0;
        display.textContent = '0';
        if (delta > 0) {
          await StorageManager.mergeChantingDelta(delta);
          showSuccess?.(`${delta} 回を記録しました`);
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
        btn.textContent = '念仏を開始';
      }
    });
  }

  function setupDana() {
    document.getElementById('btn-add-dana')?.addEventListener('click', async () => {
      const raw = window.prompt('布施額（円・半角数字）', '500');
      if (raw == null) return;
      const amt = Number(String(raw).replace(/,/g, ''));
      if (!Number.isFinite(amt) || amt <= 0) {
        showWarning?.('有効な金額を入力してください');
        return;
      }
      await StorageManager.addDanaRecord(amt);
      showSuccess?.('布施を記録しました');
      await refreshAll();
    });
  }

  function setupDataButtons() {
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
    document.querySelector('#screen-settings .btn.btn-primary')?.addEventListener('click', async (e) => {
      const card = e.target.closest('.card');
      if (!card || !card.querySelector('#settings-name')) return;
      const data = await StorageManager.getUserData();
      data.name = document.getElementById('settings-name')?.value?.trim() || 'ゲスト';
      data.email = document.getElementById('settings-email')?.value?.trim() || '';
      data.settings = data.settings || {};
      data.settings.notifications = !!document.getElementById('settings-notifications')?.checked;
      data.settings.notificationTime = document.getElementById('settings-notification-time')?.value || '08:00';
      await StorageManager.saveUserData(data);
      showSuccess?.('プロフィールを保存しました');
      await refreshAll();
    });

    document.querySelector('#screen-settings .btn.btn-secondary')?.addEventListener('click', async () => {
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

    document.querySelector('nav')?.addEventListener('click', (ev) => {
      const link = ev.target.closest('[data-screen]');
      if (!link) return;
      requestAnimationFrame(() => updateCharts?.());
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await hydrateSettings();
    setupChantingCounter();
    setupDana();
    setupDataButtons();
    setupSettingsSave();
    setupFooter();
    setupMisc();

    document.getElementById('practice-form')?.addEventListener('submit', onPracticeSubmit);

    await refreshAll();
  });
})();
