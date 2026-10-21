/*
 * LearnWise AI — offline app shell.
 *
 * Scope, stated honestly:
 *  - caches the built HTML/CSS/JS/fonts so the interface opens without a network;
 *  - never caches /api/* — live AI answers must not be served from a stale cache;
 *  - saved lessons live in localStorage, not in this cache.
 */
const VERSION = 'learnwise-v1'
const SHELL = ['/', '/index.html', '/offline.html', '/logo.svg', '/manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return // never cache model calls

  // Navigations: network first so a new build is picked up, offline shell as fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(VERSION).then((c) => c.put('/index.html', copy))
          return res
        })
        .catch(() => caches.match('/index.html').then((hit) => hit || caches.match('/offline.html'))),
    )
    return
  }

  // Static assets: cache first, then network, then cache.
  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit
      return fetch(request).then((res) => {
        if (res.ok && (url.pathname.startsWith('/assets/') || /\.(css|js|svg|woff2?|png|jpg)$/.test(url.pathname))) {
          const copy = res.clone()
          caches.open(VERSION).then((c) => c.put(request, copy))
        }
        return res
      })
    }),
  )
})
