const CACHE_NAME = 'quran-word-by-word-v2.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/data/surah_name.json',
    '/data/al-quran-word-by-word.json',
    'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache.map(url => {
                    // Handle external URLs differently
                    if (url.startsWith('http')) {
                        return new Request(url, { mode: 'cors' });
                    }
                    return url;
                }));
            })
            .catch((error) => {
                console.error('Service Worker: Cache failed:', error);
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
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Take control of all pages immediately
    self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http(s) requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if available
                if (response) {
                    return response;
                }

                // Make network request for non-cached resources
                return fetch(event.request.clone())
                    .then((response) => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response for caching
                        const responseToCache = response.clone();

                        // Cache the new resource
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.log('Service Worker: Fetch failed:', error);
                        
                        // Return offline page for navigation requests
                        if (event.request.destination === 'document') {
                            return caches.match('/');
                        }
                        
                        // Return a basic offline response for other requests
                        return new Response('Offline content not available', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Background sync for data updates (if supported)
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered');
    if (event.tag === 'background-sync-data') {
        event.waitUntil(
            // Update cache with fresh data
            caches.open(CACHE_NAME)
                .then((cache) => {
                    return Promise.all([
                        fetch('/data/surah_name.json').then(response => {
                            if (response.ok) {
                                cache.put('/data/surah_name.json', response.clone());
                            }
                            return response;
                        }),
                        fetch('/data/al-quran-word-by-word.json').then(response => {
                            if (response.ok) {
                                cache.put('/data/al-quran-word-by-word.json', response.clone());
                            }
                            return response;
                        })
                    ]);
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
        icon: '/manifest-icon-192.png',
        badge: '/manifest-icon-192.png',
        vibrate: [200, 100, 200],
        tag: 'quran-notification',
        actions: [
            {
                action: 'open',
                title: 'Open App',
                icon: '/manifest-icon-192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/manifest-icon-192.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Al-Quran Word by Word', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling for communication with main app
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Periodic background sync (for browsers that support it)
self.addEventListener('periodicsync', (event) => {
    console.log('Service Worker: Periodic sync triggered');
    if (event.tag === 'daily-data-sync') {
        event.waitUntil(
            // Refresh cache daily
            caches.open(CACHE_NAME)
                .then((cache) => {
                    return cache.addAll([
                        '/data/surah_name.json',
                        '/data/al-quran-word-by-word.json'
                    ]);
                })
                .catch((error) => {
                    console.error('Service Worker: Periodic sync failed:', error);
                })
        );
    }
});

console.log('Service Worker: Script loaded successfully');
