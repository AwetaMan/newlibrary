const CACHE='aweta-video-shell-v4-admin-source';
const SHELL=['./','./index.html','./manifest.webmanifest','./qr.js','./thumbnail-fallback.svg','./data/videos.json','./apple-touch-icon.png','./icons/icon-96.png','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);

  // Never intercept YouTube, thumbnail CDN, sharing, or any other cross-origin request.
  // Those requests always go directly to the live network.
  if(url.origin!==self.location.origin) return;

  // Navigation is network-first so GitHub Pages updates appear immediately,
  // with the cached app shell only as an offline fallback.
  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req).then(resp=>{
        const copy=resp.clone();
        caches.open(CACHE).then(cache=>cache.put('./index.html',copy));
        return resp;
      }).catch(()=>caches.match('./index.html'))
    );
    return;
  }

  // Local static assets use stale-while-revalidate.
  event.respondWith(
    caches.match(req).then(cached=>{
      const fresh=fetch(req).then(resp=>{
        if(resp && resp.ok){
          const copy=resp.clone();
          caches.open(CACHE).then(cache=>cache.put(req,copy));
        }
        return resp;
      }).catch(()=>cached);
      return cached || fresh;
    })
  );
});
