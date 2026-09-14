Mobile V4 PWA Diagnostic V11

1. Serve this folder from your Android SHTTP/HTTPS server.
2. Open the app URL in Chrome while the server is running.
3. Add ?diagnose=1 to the end of the URL. Example: https://PHONE-IP:PORT/?diagnose=1
4. The diagnostic panel reports secure context, service-worker registration/scope/state, controller status, manifest/sw HTTP status, and Cache Storage.
5. If the page itself says ERR_CONNECTION_REFUSED, the server is not reachable; JavaScript cannot run and no PWA diagnostic can run.
6. If Secure context is false, fix/trust the HTTPS certificate first.
7. If Registration is NOT FOUND or sw.js is FAILED, fix server path/certificate access.
8. After the worker becomes active, reload once. Controller should become YES.
9. Install the PWA only after registration is working. Then stop the Android server and launch the installed PWA icon.

This package keeps the Mobile V4 IndexedDB file-manager logic and UI.
