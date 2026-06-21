/**
 * service-worker.js
 * 
 * 目的：
 * 1. キャッシング戦略（オフライン対応）
 * 2. Push通知（スケジュール通知）
 * 3. バックグラウンド同期
 */

const CACHE_NAME = 'yomuyomu-v16';
const urlsToCache = [
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
  '/js/ui.js',
  '/js/charts.js',
  '/js/dev-tools.js',
  '/js/app.js',
  '/manifest.json',
];

// ============================================
// インストール
// ============================================

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// ============================================
// 起動
// ============================================

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ============================================
// フェッチ（キャッシュ優先戦略）
// ============================================

self.addEventListener('fetch', (event) => {
  // API リクエストはキャッシュしない
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        
        // なければネットワークから取得
        return fetch(event.request).then((response) => {
          // ネットワークレスポンスをキャッシュに追加
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // オフラインで、キャッシュもなければ
        return new Response('オフラインです。接続を確認してください。');
      })
  );
});

// ============================================
// Push通知（受信時）
// ============================================

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'よむよむお題目',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'yomuyomu-notification',
    requireInteraction: false,
  };
  
  event.waitUntil(
    self.registration.showNotification('よむよむお題目', options)
  );
});

// ============================================
// 通知クリック
// ============================================

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // 既に開いているウィンドウがあればフォーカス
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // なければ新規オープン
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
