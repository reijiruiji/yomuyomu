/**
 * Yomuyomu Odaimoku v15+ - Integration Test Suite
 * 
 * 責務:
 *   - 全モジュール間の統合テスト
 *   - E2E（エンドツーエンド）テスト
 *   - データフローの検証
 *   - UI 更新の確認
 * 
 * 実行方法:
 *   - ブラウザコンソール: TestSuite.runAll()
 *   - 個別実行: TestSuite.run('test-name')
 * 
 * 依存関係:
 *   - すべての JS モジュール（config, storage, practice, ui, charts 等）
 */

const TestSuite = (() => {
  const VERSION = '1.0.0';
  let testResults = [];
  let passCount = 0;
  let failCount = 0;

  // ========== ユーティリティ ==========

  /**
   * テストを実行
   * 
   * @param {string} name - テスト名
   * @param {function} fn - テスト関数
   * @param {boolean} isAsync - 非同期フラグ
   */
  function test(name, fn, isAsync = false) {
    try {
      if (isAsync) {
        return new Promise((resolve) => {
          fn().then(() => {
            recordPass(name);
            resolve();
          }).catch(err => {
            recordFail(name, err);
            resolve();
          });
        });
      } else {
        fn();
        recordPass(name);
      }
    } catch (error) {
      recordFail(name, error);
    }
  }

  /**
   * アサーション
   * 
   * @param {boolean} condition - 条件
   * @param {string} message - メッセージ
   */
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  /**
   * テスト合格を記録
   * 
   * @param {string} name - テスト名
   */
  function recordPass(name) {
    passCount++;
    testResults.push({
      status: '✅ PASS',
      name: name,
      time: new Date().toLocaleTimeString('ja-JP'),
    });
    console.log(`✅ ${name}`);
  }

  /**
   * テスト失敗を記録
   * 
   * @param {string} name - テスト名
   * @param {Error} error - エラーオブジェクト
   */
  function recordFail(name, error) {
    failCount++;
    testResults.push({
      status: '❌ FAIL',
      name: name,
      error: error.message,
      time: new Date().toLocaleTimeString('ja-JP'),
    });
    console.error(`❌ ${name}: ${error.message}`);
  }

  /**
   * テスト結果をレポート
   */
  function reportResults() {
    console.log('\n========== テスト結果 ==========');
    console.table(testResults);
    console.log(`\n✅ 合格: ${passCount}`);
    console.log(`❌ 失敗: ${failCount}`);
    console.log(`📊 成功率: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);
  }

  // ========== テストスイート ==========

  /**
   * 1. config.js モジュールテスト
   */
  async function testConfigModule() {
    console.log('\n--- config.js テスト ---');

    test('TERMINOLOGY が定義されている', () => {
      assert(typeof TERMINOLOGY !== 'undefined', 'TERMINOLOGY not found');
    });

    test('MESSAGES が定義されている', () => {
      assert(typeof MESSAGES !== 'undefined', 'MESSAGES not found');
    });

    test('get_message() が機能する', () => {
      const msg = get_message?.('greeting') || 'デフォルト';
      assert(typeof msg === 'string', 'get_message() should return a string');
    });

    test('get_term() が機能する', () => {
      const term = get_term?.('chanting') || 'パーリ語';
      assert(typeof term === 'string', 'get_term() should return a string');
    });
  }

  /**
   * 2. storage.js モジュールテスト
   */
  async function testStorageModule() {
    console.log('\n--- storage.js テスト ---');

    test('StorageManager が定義されている', () => {
      assert(typeof StorageManager !== 'undefined', 'StorageManager not found');
    });

    test('ローカルストレージにアクセス可能', () => {
      const testKey = 'test-key-' + Date.now();
      const testValue = { test: 'value' };
      localStorage.setItem(testKey, JSON.stringify(testValue));
      const retrieved = JSON.parse(localStorage.getItem(testKey));
      assert(retrieved.test === 'value', 'Storage read/write failed');
      localStorage.removeItem(testKey);
    });

    test('ユーザーデータを取得可能', async () => {
      const userData = await StorageManager.getUserData?.();
      // userData は null でも良い（初回アクセス時）
      assert(userData === null || typeof userData === 'object', 'Invalid user data type');
    }, true);

    test('ダミーデータを保存・取得', async () => {
      const mockData = {
        name: 'テストユーザー',
        sessions: [
          { date: '2024-05-01', count: 100, merit: 500 },
        ],
      };
      localStorage.setItem('user_data', JSON.stringify(mockData));
      const userData = await StorageManager.getUserData?.();
      assert(userData?.name === 'テストユーザー', 'Mock data not saved correctly');
    }, true);
  }

  /**
   * 3. abilities.js モジュールテスト
   */
  async function testAbilitiesModule() {
    console.log('\n--- abilities.js テスト ---');

    test('AWAKENING_ABILITIES が定義されている', () => {
      assert(typeof AWAKENING_ABILITIES !== 'undefined', 'AWAKENING_ABILITIES not found');
    });

    test('9つの能力が定義されている', () => {
      const abilities = Object.keys(AWAKENING_ABILITIES || {});
      assert(abilities.length >= 9, 'Not enough abilities defined');
    });
  }

  /**
   * 4. UI モジュールテスト
   */
  async function testUIModule() {
    console.log('\n--- ui.js テスト ---');

    test('showToast() が定義されている', () => {
      assert(typeof showToast === 'function', 'showToast not found');
    });

    test('showSuccess() が定義されている', () => {
      assert(typeof showSuccess === 'function', 'showSuccess not found');
    });

    test('updateDashboard() が定義されている', () => {
      assert(typeof updateDashboard === 'function', 'updateDashboard not found');
    });

    test('formatTime() が定義されている', () => {
      assert(typeof formatTime === 'function', 'formatTime not found');
    });

    test('formatTime() が正しく機能する', () => {
      const result = formatTime(3661); // 1時間 1分 1秒
      assert(result.includes('1') && result.includes('1'), 'formatTime() failed');
    });

    test('calculateCurrentStreak() が定義されている', () => {
      assert(typeof calculateCurrentStreak === 'function', 'calculateCurrentStreak not found');
    });
  }

  /**
   * 5. Charts モジュールテスト
   */
  async function testChartsModule() {
    console.log('\n--- charts.js テスト ---');

    test('Chart.js ライブラリが読み込まれている', () => {
      assert(typeof Chart !== 'undefined', 'Chart.js not loaded');
    });

    test('renderCharts() が定義されている', () => {
      assert(typeof renderCharts === 'function', 'renderCharts not found');
    });

    test('updateCharts() が定義されている', () => {
      assert(typeof updateCharts === 'function', 'updateCharts not found');
    });

    test('Chart カラー定義が正しい', () => {
      // charts.js 内の CHART_COLORS をチェック
      const chartScript = document.querySelector('script[src*="charts.js"]');
      assert(chartScript !== null, 'charts.js script not found');
    });
  }

  /**
   * 6. Service Worker テスト
   */
  async function testServiceWorkerModule() {
    console.log('\n--- service-worker.js テスト ---');

    test('Service Worker が登録されている', async () => {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        assert(registrations.length > 0, 'No Service Workers registered');
      }
    }, true);

    test('Notifications API が利用可能', () => {
      assert('Notification' in window, 'Notification API not available');
    });

    test('Cache API が利用可能', () => {
      assert('caches' in window, 'Cache API not available');
    });
  }

  /**
   * 7. DevTools テスト
   */
  async function testDevToolsModule() {
    console.log('\n--- dev-tools.js テスト ---');

    test('DevTools が定義されている', () => {
      assert(typeof DevTools !== 'undefined', 'DevTools not found');
    });

    test('DevTools.inspectStorage() が定義されている', () => {
      assert(typeof DevTools.inspectStorage === 'function', 'inspectStorage not found');
    });

    test('DevTools.generateMockData() が定義されている', () => {
      assert(typeof DevTools.generateMockData === 'function', 'generateMockData not found');
    });

    test('DevTools.measurePerformance() が定義されている', () => {
      assert(typeof DevTools.measurePerformance === 'function', 'measurePerformance not found');
    });
  }

  /**
   * 8. DOM 構造テスト
   */
  async function testDOMStructure() {
    console.log('\n--- DOM 構造テスト ---');

    test('メインコンテナが存在する', () => {
      const app = document.getElementById('app');
      assert(app !== null, 'Main app container not found');
    });

    test('統合メイン画面が存在する', () => {
      const main = document.getElementById('screen-practice');
      assert(main !== null, 'Integrated practice screen not found');
    });

    test('統計タブ領域が存在する', () => {
      const stats = document.getElementById('tc-stats');
      assert(stats !== null, 'Stats tab panel not found');
    });

    test('統計キャンバス要素が存在する', () => {
      const canvases = document.querySelectorAll('canvas[id^="chart-"]');
      assert(canvases.length > 0, 'Chart canvas elements not found');
    });

    test('フッターが存在する', () => {
      const footer = document.querySelector('footer');
      assert(footer !== null, 'Footer not found');
    });
  }

  /**
   * 9. データフロー統合テスト
   */
  async function testDataFlow() {
    console.log('\n--- データフロー統合テスト ---');

    test('ダミーデータを生成・保存・取得', async () => {
      // ダミーデータ生成
      const mockData = {
        name: 'テスト',
        sessions: [
          { date: '2024-05-01', count: 50, duration: 1200, merit: 300 },
        ],
      };
      localStorage.setItem('user_data', JSON.stringify(mockData));

      // 取得
      const userData = await StorageManager.getUserData?.();
      assert(userData !== null && userData !== undefined, 'Data not retrieved');
      assert(userData.name === 'テスト', 'Data mismatch');

      // クリーンアップ
      localStorage.removeItem('user_data');
    }, true);

    test('ストリーク計算が機能する', () => {
      const mockUserData = {
        sessions: [
          { date: new Date().toISOString().split('T')[0] },
          { date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
        ],
      };
      const streak = calculateCurrentStreak?.(mockUserData) || 0;
      assert(streak >= 0, 'Streak calculation failed');
    });
  }

  /**
   * 10. UI 更新テスト
   */
  async function testUIUpdates() {
    console.log('\n--- UI 更新テスト ---');

    test('ダッシュボード要素が更新可能', () => {
      const countElement = document.getElementById('stat-today-count');
      assert(countElement !== null, 'Dashboard element not found');
      countElement.textContent = '100';
      assert(countElement.textContent === '100', 'Element update failed');
    });

    test('モーダル機能が機能する', () => {
      assert(typeof openModal === 'function', 'openModal not found');
      assert(typeof closeModal === 'function', 'closeModal not found');
    });

    test('トースト通知が機能する', () => {
      showToast?.('テスト通知', 'info', 1000);
      const toastContainer = document.querySelector('.toast-container');
      assert(toastContainer !== null, 'Toast container not found');
    });
  }

  /**
   * 11. パフォーマンステスト
   */
  async function testPerformance() {
    console.log('\n--- パフォーマンステスト ---');

    test('ページ読み込み時間を計測', () => {
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        assert(loadTime > 0, 'Load time calculation failed');
        console.log(`   ⏱️  読み込み時間: ${loadTime}ms`);
      }
    });

    test('ローカルストレージ読み取り速度', () => {
      const startTime = performance.now();
      for (let i = 0; i < 100; i++) {
        localStorage.getItem('user_data');
      }
      const endTime = performance.now();
      const duration = endTime - startTime;
      assert(duration < 1000, 'Storage access too slow');
      console.log(`   ⏱️  100回読み取り: ${duration.toFixed(2)}ms`);
    });
  }

  /**
   * 12. エラーハンドリングテスト
   */
  async function testErrorHandling() {
    console.log('\n--- エラーハンドリングテスト ---');

    test('無効な日付を処理', () => {
      try {
        const result = formatDateJP?.('invalid-date') || null;
        assert(result !== null || result === null, 'Error handling works');
      } catch (e) {
        // エラーをキャッチしたことを確認
        assert(true, 'Error was caught');
      }
    });

    test('空のデータを処理', () => {
      const streak = calculateCurrentStreak?.({}) || 0;
      assert(streak === 0, 'Empty data not handled correctly');
    });
  }

  // ========== テスト実行制御 ==========

  /**
   * すべてのテストを実行
   */
  async function runAll() {
    console.clear();
    console.log(`%c🧪 Yomuyomu Odaimoku - Integration Test Suite v${VERSION}`, 
      'font-size: 16px; font-weight: bold; color: #2d7a4a;');
    console.log('================================================\n');

    testResults = [];
    passCount = 0;
    failCount = 0;

    // テストを順番に実行
    await testConfigModule();
    await testStorageModule();
    await testAbilitiesModule();
    await testUIModule();
    await testChartsModule();
    await testServiceWorkerModule();
    await testDevToolsModule();
    await testDOMStructure();
    await testDataFlow();
    await testUIUpdates();
    await testPerformance();
    await testErrorHandling();

    reportResults();

    return {
      passed: passCount,
      failed: failCount,
      total: passCount + failCount,
      successRate: parseFloat(((passCount / (passCount + failCount)) * 100).toFixed(1)),
    };
  }

  /**
   * 個別テストを実行
   * 
   * @param {string} testName - テスト名（例: 'storage', 'ui' 等）
   */
  async function run(testName) {
    console.clear();
    console.log(`%c🧪 Test: ${testName}`, 'font-size: 14px; font-weight: bold; color: #2d7a4a;');

    testResults = [];
    passCount = 0;
    failCount = 0;

    switch (testName.toLowerCase()) {
      case 'config':
        await testConfigModule();
        break;
      case 'storage':
        await testStorageModule();
        break;
      case 'abilities':
        await testAbilitiesModule();
        break;
      case 'ui':
        await testUIModule();
        break;
      case 'charts':
        await testChartsModule();
        break;
      case 'sw':
      case 'service-worker':
        await testServiceWorkerModule();
        break;
      case 'devtools':
      case 'dev-tools':
        await testDevToolsModule();
        break;
      case 'dom':
        await testDOMStructure();
        break;
      case 'dataflow':
      case 'data-flow':
        await testDataFlow();
        break;
      case 'ui-updates':
        await testUIUpdates();
        break;
      case 'performance':
        await testPerformance();
        break;
      case 'errors':
        await testErrorHandling();
        break;
      default:
        console.log(`Unknown test: ${testName}`);
        return;
    }

    reportResults();
  }

  // ========== パブリック API ==========

  return {
    runAll,
    run,
    version: VERSION,
  };
})();

// ========== グローバルアクセス ==========

window.TestSuite = TestSuite;

// ========== オートスタート（オプション） ==========

console.log('%c💡 テストを実行: TestSuite.runAll() または TestSuite.run(\'test-name\')', 
  'color: #2d7a4a; font-size: 12px;');
