const CACHE_NAME = 'quran-word-by-word-v4.2.2';

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
    './data/surah_name.json',
    './data/juz_data.json',
    './data/quran_pages.json',
    './data/duas.json'
];

// External CDN resources — cached individually, failure won't block install
const CDN_URLS = [
    'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&family=Lateef:wght@400&family=Reem+Kufi:wght@400;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Harmattan:wght@400;700&family=Alkalami&family=Markazi+Text:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Noto+Serif+Bengali:wght@400;700&family=Noto+Sans+Bengali:wght@400;700&display=swap',
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

// Fetch event - smart caching strategy
// App shell: cache-first (fast loads)
// Data files: network-first (fresh data), fallback to cache
// All successful responses are cached for offline use
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip chrome-extension and other non-http(s) requests
    if (!event.request.url.startsWith('http')) return;

    const url = new URL(event.request.url);
    const isDataFile = url.pathname.includes('/data/');
    const isSameOrigin = url.origin === self.location.origin;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            // Network fetch with dynamic caching
            const fetchPromise = fetch(event.request.clone())
                .then((response) => {
                    // Cache all successful responses (same-origin and CORS)
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

                    // For navigation requests, return the cached app shell
                    if (event.request.destination === 'document') {
                        return caches.match('./') || caches.match('./index.html');
                    }

                    // Return offline response for uncached resources
                    return new Response('Offline content not available', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({ 'Content-Type': 'text/plain' })
                    });
                });

            // Data files: network-first (get fresh data when online)
            // App shell & assets: cache-first (fast loads, update in background)
            if (isDataFile) {
                return fetchPromise;
            }
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
