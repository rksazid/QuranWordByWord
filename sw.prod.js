const CACHE_NAME = 'quran-word-by-word-v4.8.0';

// Core app shell files — MUST cache successfully for SW to install
const CORE_URLS = [
    './',
    './index.html',
    './styles.min.css',
    './script.min.js',
    './compression-utils.min.js',
    './enhanced-data-loader.min.js',
    './migration-patch.min.js',
    './manifest.json',
    './fonts/UthmanTN1-Ver10.woff2',
    './fonts/UthmanTN1B-Ver10.woff2',
    './fonts/me_quran.woff2',
    './fonts/pdms-saleem.woff2',
    './data/surah_name.json',
    './data/juz_data.json',
    './data/quran_pages.json',
    './data/duas.json'
];

// External CDN resources — cached individually, failure won't block install
const CDN_URLS = [
    'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&family=Lateef:wght@400&family=Reem+Kufi:wght@400;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@400;700&family=Harmattan:wght@400;700&family=Alkalami&family=Markazi+Text:wght@400;500;600;700&family=Mehr+Nastaliq:wght@400;700&family=Aref+Ruqaa:wght@400;700&family=Aref+Ruqaa+Ink:wght@400;700&family=Cairo:wght@400;600;700&family=Tajawal:wght@400;500;700&family=Inter:wght@300;400;500;600;700&family=Noto+Serif+Bengali:wght@400;700&family=Noto+Sans+Bengali:wght@400;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js'
];

// Install event - cache core resources, then optionally cache CDN resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {
                // Core files MUST succeed for the app to work offline
                console.log('Service Worker: Caching core files...');
                await cache.addAll(CORE_URLS);
                console.log('Service Worker: Core files cached successfully');

                // CDN files are optional — cache each individually so one failure doesn't block install
                for (const url of CDN_URLS) {
                    try {
                        await cache.add(new Request(url, { mode: 'cors' }));
                        console.log('Service Worker: Cached CDN:', url.substring(0, 60) + '...');
                    } catch (e) {
                        console.warn('Service Worker: Optional CDN cache failed:', url.substring(0, 60));
                    }
                }
            })
            .catch((error) => {
                console.error('Service Worker: Core cache failed:', error);
            })
    );
    // Force the service worker to become active immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('Service Worker: Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    // Take control of all pages immediately
    self.clients.claim();
});

// Offline fallback page — served when cache is empty and device is offline
const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="bn" dir="ltr">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Al-Quran Word by Word — Offline</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif;background:#f5f5f5;color:#333;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1.5rem;text-align:center}
.card{background:#fff;border-radius:16px;padding:2.5rem 2rem;max-width:380px;box-shadow:0 4px 24px rgba(0,0,0,0.08)}
.icon{font-size:3rem;margin-bottom:1rem}
h1{color:#2d7d32;font-size:1.3rem;margin-bottom:0.75rem}
.msg{color:#666;line-height:1.7;margin-bottom:1.5rem;font-size:0.95rem}
.msg-bn{font-size:1rem;margin-bottom:0.5rem}
.btn{display:inline-block;background:linear-gradient(135deg,#2d7d32,#4caf50);color:#fff;border:none;padding:0.85rem 2rem;border-radius:10px;font-size:1rem;cursor:pointer;text-decoration:none}
.btn:active{transform:scale(0.97)}
.status{margin-top:1rem;font-size:0.8rem;color:#999}
</style>
</head>
<body>
<div class="card">
<div class="icon">📖</div>
<h1>Al-Quran Word by Word</h1>
<p class="msg msg-bn">ইন্টারনেট সংযোগ পাওয়া যাচ্ছে না। অ্যাপ পুনরায় লোড করতে ইন্টারনেটে সংযুক্ত হয়ে নিচের বাটনে ক্লিক করুন।</p>
<p class="msg">You are offline and app data needs to be restored. Please connect to the internet and tap below.</p>
<button class="btn" onclick="location.reload()">Retry / পুনরায় চেষ্টা</button>
<p class="status" id="status">Checking connection...</p>
</div>
<script>
function check(){
  if(navigator.onLine){document.getElementById('status').textContent='Online detected — reloading...';location.reload();return}
  document.getElementById('status').textContent='Still offline. Connect to Wi-Fi or mobile data.';
}
setInterval(check,3000);check();
window.addEventListener('online',function(){location.reload()});
</script>
</body>
</html>`;

// Fetch event - smart caching strategy
// App shell & assets: cache-first (fast loads, background update)
// Data files: cache-first with background update (reliable offline)
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip chrome-extension and other non-http(s) requests
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            // Network fetch with dynamic caching
            const fetchPromise = fetch(event.request.clone())
                .then((response) => {
                    // Cache all successful responses
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Network failed — return cached version if available
                    if (cached) return cached;

                    // For navigation requests, try cached app shell then offline fallback
                    if (event.request.mode === 'navigate' || event.request.destination === 'document') {
                        return caches.match('./').then((r) => {
                            if (r) return r;
                            return caches.match('./index.html');
                        }).then((r) => {
                            if (r) return r;
                            // Cache completely empty — serve embedded offline page
                            return new Response(OFFLINE_HTML, {
                                status: 200,
                                headers: new Headers({ 'Content-Type': 'text/html; charset=utf-8' })
                            });
                        });
                    }

                    // Return offline response for uncached resources
                    return new Response('Offline content not available', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({ 'Content-Type': 'text/plain' })
                    });
                });

            // Always cache-first, then update in background
            // This ensures offline reliability (critical for iOS)
            return cached || fetchPromise;
        })
    );
});

// Background sync for data updates (if supported)
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered');
    if (event.tag === 'background-sync-data') {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then((cache) => {
                    return fetch('./data/surah_name.json')
                        .then(response => {
                            if (response.ok) {
                                cache.put('./data/surah_name.json', response.clone());
                            }
                            return response;
                        });
                })
                .catch((error) => {
                    console.error('Service Worker: Background sync failed:', error);
                })
        );
    }
});

// Push notifications (for future features)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New content available!',
        icon: './favicon/android-chrome-192x192.png',
        badge: './favicon/android-chrome-192x192.png',
        vibrate: [200, 100, 200],
        tag: 'quran-notification',
        actions: [
            { action: 'open', title: 'Open App' },
            { action: 'close', title: 'Close' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Al-Quran Word by Word', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'open' || !event.action) {
        event.waitUntil(clients.openWindow('./'));
    }
});

// Message handling for communication with main app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Periodic background sync (for browsers that support it)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'daily-data-sync') {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then((cache) => {
                    return cache.add('./data/surah_name.json');
                })
                .catch((error) => {
                    console.error('Service Worker: Periodic sync failed:', error);
                })
        );
    }
});

console.log('Service Worker: Script loaded successfully');
