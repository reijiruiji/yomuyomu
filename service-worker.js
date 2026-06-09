const CACHE = 'yomuyomu-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/dq-data.js',
  '/manifest.json',
  '/images/lotus-hope.png',
  '/images/hope.png',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  '/images/icon-maskable-192x192.png',
  '/images/icon-maskable-512x512.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}).catch(function(){})
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
