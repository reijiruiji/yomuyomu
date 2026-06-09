const CACHE = 'yomuyomu-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/dq-data.js',
  '/manifest.json',
  '/images/hope.png',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){return c.addAll(ASSETS).catch(function(){});})
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(function(cached){
      var network=fetch(e.request).then(function(resp){
        if(resp&&resp.status===200){
          var clone=resp.clone();
          caches.open(CACHE).then(function(c){c.put(e.request,clone);});
        }
        return resp;
      }).catch(function(){return cached;});
      return cached||network;
    })
  );
});

// 日次リマインダー（Periodic Background Sync）
self.addEventListener('periodicsync', function(e){
  if(e.tag==='daily-reminder'){
    e.waitUntil(showDailyReminder());
  }
});

function showDailyReminder(){
  return self.registration.showNotification('よむよむお題目', {
    body: '今日の修行はまだですか？ 南無妙法蓮華経 🪷',
    icon: '/images/icon-192x192.png',
    badge: '/images/icon-192x192.png',
    tag: 'daily-reminder',
    renotify: false,
    data: {url: '/'},
    actions: [
      {action: 'open', title: '今すぐ唱える'},
      {action: 'dismiss', title: 'あとで'}
    ]
  });
}

// プッシュ通知受信（Firebase等のバックエンドから）
self.addEventListener('push', function(e){
  var data = e.data ? e.data.json() : {title:'よむよむ', body:'修行の時間です 🪷'};
  e.waitUntil(
    self.registration.showNotification(data.title||'よむよむお題目', {
      body: data.body||'今日の修行はまだですか？',
      icon: '/images/icon-192x192.png',
      badge: '/images/icon-192x192.png',
      tag: 'push-notif',
      data: {url: data.url||'/'}
    })
  );
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  if(e.action==='dismiss')return;
  var url=e.notification.data&&e.notification.data.url||'/';
  e.waitUntil(
    self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(clients){
      for(var i=0;i<clients.length;i++){
        if(clients[i].url.includes(self.location.origin)){
          clients[i].focus();return;
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
