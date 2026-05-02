/**
 * Yomuyomu Odaimoku v15+ - Service Worker
 * 
 * 責務:
 *   - Push通知の受信・表示
 *   - オフラインキャッシュ戦略（CacheFirst / NetworkFirst）
 *   - バックグラウンド同期（修行ログ自動保存）
 *   - アプリの更新管理
 * 
 * キャッシュ戦略:
 *   - index.html, js/*, css/*: CacheFirst (オフライン時はキャッシュから)
 *   - API応答: NetworkFirst (常に新しいデータを優先)
 *   - images/*: CacheFirst (静的コンテンツ)
 */

const CACHE_VERSION = 'yomuyomu-v1';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;
const CACHE_IMAGES = `${CACHE_VERSION}-images`;

// キャッシュ対象ファイル（インストール時に事前キャッシュ）
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/config.js',
  '/js/utils.js',
  '/js/abilities.js',
  '/js/storage.js',
  '/js/schedule-config.js',
  '/js/practice.js',
  '/js/reflection.js',
  '/js/app.js',
  '/js/ui.js',
  '/js/charts.js',
];

// ========== Service Worker ライフサイクル ==========

/**
 * install イベント
 * - Service Worker 初回インストール時に発火
 * - 静的アセットを事前キャッシュ
 */
self.addEventListener('install', event => {
  console.log('[SW] Install event triggered');

  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      console.log('[SW] Caching static assets...');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Some static assets failed to cache:', err);
        // 一部のアセットが失敗してもインストール継続
      });
    })
  );

  // 新しい Service Worker を即座に有効化
  self.skipWaiting();
});

/**
 * activate イベント
 * - 古いキャッシュを削除
 * - Service Worker 更新時に実行
 */
self.addEventListener('activate', event => {
  console.log('[SW] Activate event triggered');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 現在のバージョン以外のキャッシュを削除
          if (!cacheName.startsWith(CACHE_VERSION)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // 新しい Service Worker をクライアントに反映
  self.clients.claim();
});

// ========== Fetch イベント（キャッシュ戦略） ==========

/**
 * fetch イベント
 * - すべてのネットワークリクエストをインターセプト
 * - CacheFirst / NetworkFirst 戦略でキャッシュを活用
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 同一オリジンのリクエストのみ処理
  if (url.origin !== location.origin) {
    return;
  }

  // ナビゲーションリクエスト（HTML）
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirstStrategy(request, CACHE_DYNAMIC)
    );
    return;
  }

  // CSS / JavaScript - CacheFirst (オフライン時はキャッシュから)
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      cacheFirstStrategy(request, CACHE_STATIC)
    );
    return;
  }

  // 画像 - CacheFirst
  if (request.destination === 'image') {
    event.respondWith(
      cacheFirstStrategy(request, CACHE_IMAGES)
    );
    return;
  }

  // デフォルト - NetworkFirst
  event.respondWith(
    networkFirstStrategy(request, CACHE_DYNAMIC)
  );
});

// ========== キャッシュ戦略の実装 ==========

/**
 * CacheFirst 戦略
 * - キャッシュがあれば優先的に使用
 * - キャッシュがなければネットワークから取得
 * - オフライン時はキャッシュから
 * 
 * @param {Request} request - リクエストオブジェクト
 * @param {string} cacheName - キャッシュ名
 * @returns {Promise<Response>} レスポンス
 */
function cacheFirstStrategy(request, cacheName) {
  return caches.match(request).then(response => {
    // キャッシュが見つかれば返す
    if (response) {
      console.log('[SW] CacheFirst - served from cache:', request.url);
      return response;
    }

    // キャッシュにないのでネットワークから取得
    return fetch(request).then(response => {
      // ネットワークレスポンスをキャッシュに保存
      if (response && response.status === 200 && response.type !== 'basic') {
        const responseToCache = response.clone();
        caches.open(cacheName).then(cache => {
          cache.put(request, responseToCache);
        });
      }

      return response;
    }).catch(error => {
      console.error('[SW] CacheFirst failed:', error);
      // フォールバック: キャッシュがあれば返す、なければエラー
      return caches.match(request).then(cachedResponse => {
        return cachedResponse || offlineFallback();
      });
    });
  });
}

/**
 * NetworkFirst 戦略
 * - 常にネットワークから新しいデータを取得
 * - ネットワークが使用できなければキャッシュから
 * - オフライン時はキャッシュから
 * 
 * @param {Request} request - リクエストオブジェクト
 * @param {string} cacheName - キャッシュ名
 * @returns {Promise<Response>} レスポンス
 */
function networkFirstStrategy(request, cacheName) {
  return fetch(request)
    .then(response => {
      // ネットワークが成功
      if (!response || response.status !== 200 || response.type === 'error') {
        return response;
      }

      // レスポンスをキャッシュに保存
      const responseToCache = response.clone();
      caches.open(cacheName).then(cache => {
        cache.put(request, responseToCache);
      });

      console.log('[SW] NetworkFirst - fetched from network:', request.url);
      return response;
    })
    .catch(error => {
      // ネットワークが失敗 → キャッシュから取得
      console.warn('[SW] NetworkFirst - network failed, using cache:', request.url);
      return caches.match(request).then(response => {
        return response || offlineFallback();
      });
    });
}

/**
 * オフラインフォールバック
 * キャッシュにもネットワークにもない場合のフォールバック
 * 
 * @returns {Response} フォールバックレスポンス
 */
function offlineFallback() {
  // キャッシュされた index.html を返す
  return caches.match('/index.html').then(response => {
    return response || new Response(
      '<h1>オフラインです</h1><p>インターネット接続を確認してください。</p>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  });
}

// ========== Push通知 ==========

/**
 * push イベント
 * - Push通知を受信
 * - Notification API で表示
 */
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');

  let notificationData = {
    title: '法華経勤行タイマー',
    body: '勤行の時間です',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    tag: 'yomuyomu-notification',
  };

  // Push イベントペイロードがあればパース
  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = { ...notificationData, ...payload };
    } catch (e) {
      // JSON パース失敗時はテキストを使用
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: false, // クリックまで残す（true の場合）
      actions: [
        { action: 'open', title: '開く' },
        { action: 'dismiss', title: '閉じる' },
      ],
      data: notificationData,
    })
  );
});

/**
 * notificationclick イベント
 * - ユーザーが通知をクリック
 * - アプリウィンドウをフォーカス/オープン
 */
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'dismiss') {
    // 通知を閉じる（何もしない）
    return;
  }

  // 既存のクライアント（ウィンドウ）をチェック
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // 既にアプリが開いていればフォーカス
      for (let i = 0; i < clientList.length; i++) {
        if (clientList[i].url === '/' && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }

      // アプリが開いていなければ新しいウィンドウを開く
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

/**
 * notificationclose イベント
 * - ユーザーが通知を閉じた
 * - アナリティクスロギング等で使用可能
 */
self.addEventListener('notificationclose', event => {
  console.log('[SW] Notification closed');
  // 将来的にアナリティクス送信などの処理をここに記述
});

// ========== バックグラウンド同期 ==========

/**
 * sync イベント
 * - バックグラウンド同期をトリガー
 * - 修行ログがオフラインで保存された場合、
 *   再度ネットワークが利用可能になった時に同期
 */
self.addEventListener('sync', event => {
  console.log('[SW] Background sync event:', event.tag);

  if (event.tag === 'sync-practice-logs') {
    event.waitUntil(
      syncPracticeLogs()
        .then(() => {
          console.log('[SW] Practice logs synced successfully');
          // クライアントに同期完了を通知
          notifyClients({ type: 'sync-complete', data: { type: 'practice-logs' } });
        })
        .catch(err => {
          console.error('[SW] Failed to sync practice logs:', err);
          // 再試行をスケジュール
          return Promise.reject(err);
        })
    );
  }
});

/**
 * 修行ログをサーバーに同期
 * 
 * @returns {Promise<void>}
 */
async function syncPracticeLogs() {
  try {
    // ローカルストレージから未同期のログを取得
    const pendingLogs = await getPendingPracticeLogs();

    if (pendingLogs.length === 0) {
      console.log('[SW] No pending logs to sync');
      return;
    }

    console.log('[SW] Syncing', pendingLogs.length, 'practice logs');

    // サーバーに送信（実装例）
    // const response = await fetch('/api/practice-logs/sync', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ logs: pendingLogs }),
    // });

    // if (!response.ok) {
    //   throw new Error('Sync failed: ' + response.statusText);
    // }

    // 同期完了をマーク
    // await markLogsAsSynced(pendingLogs);
  } catch (error) {
    console.error('[SW] Sync error:', error);
    throw error;
  }
}

/**
 * ローカルストレージから未同期のログを取得（スタブ）
 * 
 * @returns {Promise<Array>} 未同期のログ配列
 */
async function getPendingPracticeLogs() {
  // 実装: IndexedDB または localStorage から取得
  return [];
}

/**
 * すべてのクライアントにメッセージを送信
 * 
 * @param {object} message - 送信するメッセージオブジェクト
 */
function notifyClients(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  });
}

// ========== メッセージ受信（クライアント ← → SW） ==========

/**
 * message イベント
 * - クライアント JS からのメッセージを受信
 * - キャッシュ管理コマンドなど
 */
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);

  const { type, payload } = event.data;

  switch (type) {
    case 'clear-cache':
      handleClearCache(payload);
      break;

    case 'get-cache-status':
      handleGetCacheStatus(payload, event.ports[0]);
      break;

    case 'request-sync':
      // バックグラウンド同期をリクエスト
      if (self.registration.sync) {
        self.registration.sync.register('sync-practice-logs');
      }
      break;

    default:
      console.warn('[SW] Unknown message type:', type);
  }
});

/**
 * キャッシュをクリア
 * 
 * @param {object} payload - ペイロード { cacheName?: string }
 */
async function handleClearCache(payload) {
  const { cacheName } = payload || {};

  try {
    if (cacheName) {
      // 指定キャッシュを削除
      await caches.delete(cacheName);
      console.log('[SW] Cache cleared:', cacheName);
    } else {
      // すべてのキャッシュを削除
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('[SW] All caches cleared');
    }

    notifyClients({ type: 'cache-cleared', data: { cacheName } });
  } catch (error) {
    console.error('[SW] Failed to clear cache:', error);
  }
}

/**
 * キャッシュ状態を報告
 * 
 * @param {object} payload - ペイロード
 * @param {MessagePort} port - 応答用ポート
 */
async function handleGetCacheStatus(payload, port) {
  try {
    const cacheNames = await caches.keys();
    const cacheStats = {};

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      cacheStats[cacheName] = {
        count: keys.length,
        urls: keys.map(req => req.url),
      };
    }

    port.postMessage({
      type: 'cache-status',
      data: cacheStats,
    });
  } catch (error) {
    console.error('[SW] Failed to get cache status:', error);
    port.postMessage({
      type: 'error',
      error: error.message,
    });
  }
}

// ========== ログ（デバッグ用） ==========

/**
 * Service Worker のバージョン情報をコンソールに出力
 */
console.log(`[SW] Service Worker loaded - Version: ${CACHE_VERSION}`);
console.log(`[SW] Static cache: ${CACHE_STATIC}`);
console.log(`[SW] Dynamic cache: ${CACHE_DYNAMIC}`);
