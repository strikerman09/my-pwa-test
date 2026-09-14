```js
const CACHE_NAME = "mobile-v4-pwa-v12";

const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.json"
];

/* =====================================================
   INSTALL
===================================================== */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(async cache => {

                /*
                 * Cache each file separately.
                 *
                 * If one optional file fails, the
                 * Service Worker installation will
                 * still continue.
                 */

                for (const url of APP_SHELL) {

                    try {

                        await cache.add(url);

                        console.log(
                            "[PWA] Cached:",
                            url
                        );

                    } catch (error) {

                        console.warn(
                            "[PWA] Could not cache:",
                            url,
                            error
                        );

                    }

                }

            })

            .then(() => {

                return self.skipWaiting();

            })

    );

});


/* =====================================================
   ACTIVATE
===================================================== */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(keys => {

                return Promise.all(

                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => {

                            console.log(
                                "[PWA] Removing old cache:",
                                key
                            );

                            return caches.delete(key);

                        })

                );

            })

            .then(() => {

                return self.clients.claim();

            })

    );

});


/* =====================================================
   FETCH
===================================================== */

self.addEventListener("fetch", event => {

    const request = event.request;

    /*
     * Only handle GET requests.
     */
    if (request.method !== "GET") {
        return;
    }

    event.respondWith(

        caches.match(request)

            .then(cachedResponse => {

                /*
                 * Cached file exists.
                 */
                if (cachedResponse) {

                    return cachedResponse;

                }


                /*
                 * Not cached.
                 * Try the network.
                 */
                return fetch(request)

                    .then(response => {

                        /*
                         * Cache successful same-origin
                         * responses for future offline use.
                         */
                        if (
                            response &&
                            response.ok &&
                            new URL(request.url).origin ===
                                self.location.origin
                        ) {

                            const copy =
                                response.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {

                                    cache.put(
                                        request,
                                        copy
                                    );

                                })
                                .catch(error => {

                                    console.warn(
                                        "[PWA] Cache put failed:",
                                        error
                                    );

                                });

                        }

                        return response;

                    })

                    .catch(() => {

                        /*
                         * If navigation fails while
                         * offline, return index.html.
                         */
                        if (
                            request.mode === "navigate"
                        ) {

                            return caches.match(
                                "./index.html"
                            );

                        }


                        /*
                         * Other unavailable resources.
                         */
                        return new Response(
                            "",
                            {
                                status: 503,
                                statusText: "Offline"
                            }
                        );

                    });

            })

    );

});
```
