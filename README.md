# Aweta Video Catalog

This build uses an Iron Man-inspired armored interface: deep metallic red, gold, graphite, and AI-reactor cyan accents. It is explicitly network-enabled for live YouTube thumbnails and duration lookup while retaining an offline local app shell.

Static, mobile-first PWA for GitHub Pages.

## Publish on GitHub Pages
1. Create a new GitHub repository.
2. Upload the **contents of this folder** to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
5. Open the Pages URL in Safari on iPhone. To install it, tap **Share → Add to Home Screen**.

## Catalog
- 60 source rows were read from `AAYoutubeVideos(4).xlsx`.
- 59 unique YouTube video IDs are included after removing duplicate links.
- Direct YouTube watch URLs are used for every catalog item.
- Thumbnails use YouTube's standard thumbnail CDN with a local fallback.
- Durations are resolved through the YouTube IFrame API when online and cached in `localStorage`.
- Favorites are stored in `localStorage`.

## Files
- `index.html` — full catalog UI and data
- `manifest.webmanifest` — PWA metadata
- `service-worker.js` — network-first navigation + offline shell caching; cross-origin YouTube requests always bypass the cache
- `qr.js` — local QR generator
- `apple-touch-icon.png` and `icons/` — install icons
- `thumbnail-fallback.svg` — offline/error thumbnail

## Network behavior
- GitHub Pages HTML is network-first so published changes refresh promptly.
- YouTube thumbnails and IFrame API calls always go directly to the network.
- The service worker caches only same-origin app-shell files.
- If the device is offline, the catalog UI still opens and previously cached duration/favorite data remains available.


## Catalog Admin Portal

This package includes a separate editor at `admin/index.html`. After publishing to GitHub Pages, open `/admin/` in the same site. The editor loads `data/videos.json`, lets you add/edit/delete catalog entries, validates duplicate YouTube IDs, and downloads a replacement `videos.json`.

Because GitHub Pages is static, the editor does not write directly to the repository. To publish edits: download `videos.json`, replace `data/videos.json` in GitHub, and commit the change. The public `index.html` now reads that JSON file as its primary catalog source.
