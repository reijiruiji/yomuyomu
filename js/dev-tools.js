/**
 * Yomuyomu Odaimoku v15+ - Development Tools
 * 
 * 責務:
 *   - ローカルストレージの検査・操作
 *   - 機能のテスト・デバッグ
 *   - パフォーマンス測定
 *   - ダミーデータの生成
 * 
 * 使用方法（ブラウザコンソール）:
 *   - DevTools.showPanel() → デバッグパネルを表示
 *   - DevTools.clearStorage() → すべてのデータをクリア
 *   - DevTools.generateMockData(days) → ダミーデータを生成
 *   - DevTools.inspectStorage() → ストレージを検査
 *   - DevTools.measurePerformance() → パフォーマンス測定
 * 
 * 本番環境での無効化:
 *   - NODE_ENV が 'production' のときは機能を無効化
 */

const DevTools = (() => {
  const VERSION = '1.0.0';
  const IS_PRODUCTION = typeof NODE_ENV !== 'undefined' && NODE_ENV === 'production';

  // デバッグパネルの参照
  let debugPanel = null;
  let isOpen = false;

  // ========== 初期化 ==========

  /**
   * DevTools を初期化
   */
  function init() {
    if (IS_PRODUCTION) {
      console.warn('[DevTools] Disabled in production environment');
      return;
    }

    console.log(`[DevTools] v${VERSION} initialized`);

    // キーボードショートカット: Ctrl+Shift+D でパネル表示
    document.addEventListener('keydown', event => {
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyD') {
        event.preventDefault();
        togglePanel();
      }
    });
  }

  // ========== パネル表示 ==========

  /**
   * デバッグパネルの表示/非表示を切り替え
   */
  function togglePanel() {
    if (isOpen) {
      closePanel();
    } else {
      showPanel();
    }
  }

  /**
   * デバッグパネルを表示
   */
  function showPanel() {
    if (IS_PRODUCTION) return;

    if (!debugPanel) {
      createDebugPanel();
    }

    debugPanel.classList.add('visible');
    isOpen = true;
    console.log('[DevTools] Panel opened');
  }

  /**
   * デバッグパネルを非表示
   */
  function closePanel() {
    if (debugPanel) {
      debugPanel.classList.remove('visible');
    }
    isOpen = false;
    console.log('[DevTools] Panel closed');
  }

  /**
   * デバッグパネルを DOM に作成
   */
  function createDebugPanel() {
    if (debugPanel) return;

    debugPanel = document.createElement('div');
    debugPanel.id = 'devtools-panel';
    debugPanel.innerHTML = `
      <div class="devtools-header">
        <h3>🔧 DevTools v${VERSION}</h3>
        <button class="devtools-close" title="Close (Ctrl+Shift+D)">&times;</button>
      </div>

      <div class="devtools-content">
        <div class="devtools-section">
          <h4>📊 ストレージ管理</h4>
          <button class="devtools-btn" id="btn-inspect-storage">検査</button>
          <button class="devtools-btn" id="btn-clear-storage">クリア</button>
          <button class="devtools-btn" id="btn-export-data">エクスポート</button>
          <button class="devtools-btn" id="btn-import-data">インポート</button>
        </div>

        <div class="devtools-section">
          <h4>🎲 テストデータ</h4>
          <label>
            日数:
            <input type="number" id="mock-days" min="1" max="365" value="30" style="width: 50px;">
          </label>
          <button class="devtools-btn" id="btn-generate-mock">生成</button>
          <button class="devtools-btn" id="btn-clear-mock">削除</button>
        </div>

        <div class="devtools-section">
          <h4>⚡ パフォーマンス</h4>
          <button class="devtools-btn" id="btn-measure-perf">計測</button>
          <button class="devtools-btn" id="btn-memory-usage">メモリ使用量</button>
          <button class="devtools-btn" id="btn-cache-status">キャッシュ状態</button>
        </div>

        <div class="devtools-section">
          <h4>🧪 ユーティリティ</h4>
          <button class="devtools-btn" id="btn-reset-ui">UI リセット</button>
          <button class="devtools-btn" id="btn-trigger-notification">通知テスト</button>
          <button class="devtools-btn" id="btn-simulate-offline">オフラインシミュレート</button>
        </div>

        <div class="devtools-output" id="devtools-output"></div>
      </div>
    `;

    // スタイルを追加
    addDevToolsStyles();

    // イベントリスナーを登録
    setupDevToolsListeners();

    // DOM に追加
    document.body.appendChild(debugPanel);
  }

  /**
   * DevTools パネルのスタイルを追加
   */
  function addDevToolsStyles() {
    if (document.getElementById('devtools-styles')) return;

    const style = document.createElement('style');
    style.id = 'devtools-styles';
    style.textContent = `
      #devtools-panel {
        position: fixed;
        bottom: -400px;
        right: 20px;
        width: 400px;
        max-height: 400px;
        background: #1a1a1a;
        color: #00ff00;
        border: 2px solid #00ff00;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        font-family: 'Courier New', monospace;
        font-size: 12px;
        z-index: 10000;
        transition: bottom 0.3s ease;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      #devtools-panel.visible {
        bottom: 20px;
      }

      .devtools-header {
        background: #00ff00;
        color: #1a1a1a;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #00ff00;
      }

      .devtools-header h3 {
        margin: 0;
        font-size: 14px;
      }

      .devtools-close {
        background: none;
        border: none;
        color: #1a1a1a;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .devtools-close:hover {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
      }

      .devtools-content {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        background: #1a1a1a;
      }

      .devtools-section {
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #333;
      }

      .devtools-section h4 {
        margin: 0 0 8px 0;
        color: #00ff00;
        font-size: 12px;
      }

      .devtools-btn {
        background: #333;
        color: #00ff00;
        border: 1px solid #00ff00;
        padding: 4px 8px;
        margin: 2px;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        transition: all 0.2s ease;
      }

      .devtools-btn:hover {
        background: #00ff00;
        color: #1a1a1a;
      }

      .devtools-output {
        margin-top: 10px;
        padding: 8px;
        background: #0a0a0a;
        border: 1px solid #333;
        border-radius: 4px;
        max-height: 150px;
        overflow-y: auto;
        white-space: pre-wrap;
        word-break: break-all;
        font-size: 10px;
        color: #00ff00;
      }

      label {
        color: #00ff00;
        margin-right: 5px;
      }

      label input {
        background: #333;
        color: #00ff00;
        border: 1px solid #00ff00;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
      }

      @media (max-width: 768px) {
        #devtools-panel {
          right: 10px;
          width: calc(100% - 20px);
          max-height: 300px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * DevTools ボタンにイベントリスナーを登録
   */
  function setupDevToolsListeners() {
    const output = document.getElementById('devtools-output');

    // クローズボタン
    document.querySelector('.devtools-close').addEventListener('click', closePanel);

    // ストレージ管理
    document.getElementById('btn-inspect-storage').addEventListener('click', () => {
      output.textContent = JSON.stringify(inspectStorage(), null, 2);
    });

    document.getElementById('btn-clear-storage').addEventListener('click', () => {
      if (confirm('すべてのデータを削除してもよろしいですか？')) {
        clearStorage();
        output.textContent = '[✓] Storage cleared';
      }
    });

    document.getElementById('btn-export-data').addEventListener('click', () => {
      exportData();
    });

    document.getElementById('btn-import-data').addEventListener('click', () => {
      importData();
    });

    // テストデータ
    document.getElementById('btn-generate-mock').addEventListener('click', () => {
      const days = parseInt(document.getElementById('mock-days').value) || 30;
      generateMockData(days);
      output.textContent = `[✓] Generated mock data for ${days} days`;
    });

    document.getElementById('btn-clear-mock').addEventListener('click', () => {
      clearStorage();
      output.textContent = '[✓] Mock data cleared';
    });

    // パフォーマンス
    document.getElementById('btn-measure-perf').addEventListener('click', () => {
      const metrics = measurePerformance();
      output.textContent = JSON.stringify(metrics, null, 2);
    });

    document.getElementById('btn-memory-usage').addEventListener('click', () => {
      const memory = getMemoryUsage();
      output.textContent = JSON.stringify(memory, null, 2);
    });

    document.getElementById('btn-cache-status').addEventListener('click', () => {
      getCacheStatus().then(status => {
        output.textContent = JSON.stringify(status, null, 2);
      });
    });

    // ユーティリティ
    document.getElementById('btn-reset-ui').addEventListener('click', () => {
      location.reload();
      output.textContent = '[✓] Reloading...';
    });

    document.getElementById('btn-trigger-notification').addEventListener('click', () => {
      triggerTestNotification();
      output.textContent = '[✓] Test notification sent';
    });

    document.getElementById('btn-simulate-offline').addEventListener('click', () => {
      simulateOffline();
      output.textContent = '[✓] Offline mode toggled';
    });
  }

  // ========== ストレージ管理 ==========

  /**
   * ローカルストレージを検査
   * 
   * @returns {object} ストレージの内容
   */
  function inspectStorage() {
    const storage = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);

      try {
        storage[key] = JSON.parse(value);
      } catch (e) {
        storage[key] = value;
      }
    }

    console.log('[DevTools] Storage inspection:', storage);
    return storage;
  }

  /**
   * すべてのストレージをクリア
   */
  function clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
    console.log('[DevTools] Storage cleared');
  }

  /**
   * データをエクスポート（JSON ファイル）
   */
  function exportData() {
    const data = inspectStorage();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yomuyomu-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('[DevTools] Data exported');
  }

  /**
   * JSON ファイルからデータをインポート
   */
  function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
          });
          console.log('[DevTools] Data imported');
          alert('✓ Data imported successfully');
        } catch (error) {
          console.error('[DevTools] Import failed:', error);
          alert('✗ Import failed: ' + error.message);
        }
      };
      reader.readAsText(file);
    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }

  // ========== テストデータ生成 ==========

  /**
   * ダミーデータを生成
   * 
   * @param {number} days - 生成日数
   */
  function generateMockData(days = 30) {
    const mockData = {
      name: 'テストユーザー',
      email: 'test@example.com',
      sessions: [],
    };

    const now = new Date();

    // 指定日数分のセッションを生成
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // ランダムにセッションを作成（70% の確率）
      if (Math.random() < 0.7) {
        mockData.sessions.push({
          date: dateStr,
          count_chanting: Math.floor(Math.random() * 100) + 10,
          count_gongyo: Math.floor(Math.random() * 30) + 5,
          merit_chanting: Math.floor(Math.random() * 500) + 100,
          merit_gongyo: Math.floor(Math.random() * 300) + 50,
          duration: Math.floor(Math.random() * 3600) + 300,
          notes: 'テストセッション',
        });
      }
    }

    // ローカルストレージに保存
    localStorage.setItem('user_data', JSON.stringify(mockData));

    console.log('[DevTools] Mock data generated:', mockData);
  }

  // ========== パフォーマンス測定 ==========

  /**
   * パフォーマンスメトリクスを計測
   * 
   * @returns {object} メトリクス情報
   */
  function measurePerformance() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');

    return {
      // ナビゲーション計時
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      timeToFirstByte: navigation?.responseStart - navigation?.requestStart,

      // レンダリング
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,

      // リソース
      resourceCount: performance.getEntriesByType('resource').length,
      totalResourceSize: performance
        .getEntriesByType('resource')
        .reduce((sum, r) => sum + (r.transferSize || 0), 0),
    };
  }

  /**
   * メモリ使用量を取得（Chrome/Edge のみ）
   * 
   * @returns {object} メモリ情報
   */
  function getMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        totalJSHeapSize: `${(performance.memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        jsHeapSizeLimit: `${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
      };
    }

    return { error: 'Memory API not available in this browser' };
  }

  /**
   * Service Worker キャッシュの状態を取得
   * 
   * @returns {Promise<object>} キャッシュ情報
   */
  async function getCacheStatus() {
    if (!('caches' in window)) {
      return { error: 'Cache API not available' };
    }

    const cacheNames = await caches.keys();
    const cacheInfo = {};

    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      cacheInfo[name] = {
        count: keys.length,
        urls: keys.map(req => req.url),
      };
    }

    return cacheInfo;
  }

  // ========== ユーティリティ ==========

  /**
   * テスト用通知を送信
   */
  function triggerTestNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('テスト通知', {
        body: '🔔 これはテスト通知です',
        icon: '/images/icon-192x192.png',
      });
    } else if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'show-notification',
        data: {
          title: 'テスト通知',
          body: '🔔 Service Worker から送信されました',
        },
      });
    }
  }

  /**
   * オフラインモードをシミュレート
   */
  function simulateOffline() {
    const isOnline = navigator.onLine;
    console.log('[DevTools] Current status:', isOnline ? 'online' : 'offline');

    // Chrome DevTools で Offline をシミュレート推奨
    alert(
      'Chrome DevTools > Network タブで Offline をチェックしてください\n' +
      '現在のステータス: ' +
      (isOnline ? 'オンライン' : 'オフライン')
    );
  }

  // ========== パブリック API ==========

  return {
    init,
    showPanel,
    closePanel,
    togglePanel,

    // ストレージ
    inspectStorage,
    clearStorage,
    exportData,
    importData,

    // テストデータ
    generateMockData,

    // パフォーマンス
    measurePerformance,
    getMemoryUsage,
    getCacheStatus,

    // ユーティリティ
    triggerTestNotification,
    simulateOffline,

    version: VERSION,
  };
})();

// ========== 初期化 ==========

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    DevTools.init();
  });
} else {
  DevTools.init();
}

// ========== グローバルアクセス（コンソール用） ==========

window.DevTools = DevTools;

// ========== ログ ==========

if (typeof NODE_ENV === 'undefined' || NODE_ENV !== 'production') {
  console.log('%c🔧 DevTools Ready', 'color: #00ff00; font-weight: bold; font-size: 12px;');
  console.log('%cShortcut: Ctrl+Shift+D to toggle panel', 'color: #00ff00; font-size: 11px;');
  console.log('%cAPI: window.DevTools.*', 'color: #00ff00; font-size: 11px;');
}
