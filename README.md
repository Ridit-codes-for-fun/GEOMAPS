# HeatShield Mumbai

Walking navigation for Mumbai, built on an embedded OpenStreetMap extract, with live weather, air quality and a heat forecast map from Open-Meteo. No API keys, no build step and no paid services.

## Run it on Windows 11

1. Install **Node.js 20 or newer** from https://nodejs.org/ (the LTS installer is fine).
2. Double-click **`start.bat`** in this folder. It starts the local server and opens http://127.0.0.1:5173/.

Or, from a terminal in this folder:

```bash
npm start
```

Then open http://127.0.0.1:5173/. Press Ctrl+C in the terminal to stop.

The **3D** button opens an optional 3D view with OpenStreetMap buildings and a labelled simulated route-follow; see docs/THREE_D.md. 2D remains the default and is used automatically if WebGL 2 is missing or 3D is too slow.

Use **⚙ Settings** in the panel for the language (English, हिन्दी, मराठी, ગુજરાતી), °C/°F, km/mi and the light/dark theme. The choices are remembered in this browser.

Opening `index.html` directly by double-clicking won't work, because browsers block ES modules on `file://`. The page shows a notice if you try. Add `?dev` to the URL (http://127.0.0.1:5173/?dev) for the diagnostics line: load times, frame time, edges drawn, memory, request counts.

### Tests

```bash
npm test
```

These use Node's built-in test runner and need no installs or internet. They run routing on the real map data and test the weather, AQI and heat logic against fixtures.

### Configuration

Optional environment variables: `PORT` (default 5173) and `HOST` (default 127.0.0.1). The app has no secrets and no `.env` file.

## Layout

```
index.html            page shell
css/app.css           styles (light/dark)
js/app.js             wiring: search UI, routes, navigation, panels, settings
js/i18n.js, js/i18n/  translations (en, hi, mr, gu); see docs/I18N.md
js/units.js           °C/°F, km/mi formatting
js/storage.js         consent-gated local storage (no cookies)
js/copilot/           Mumbai Copilot: intents.js (rule-based parser), copilot.js (tools + chat UI)
js/amenities.js       parking / EV / toilet layer and walking-distance ranking
js/services/overpass.js  OpenStreetMap facilities via the Overpass API
js/ui/consent.js      storage notice + preferences dialog
terms.html, privacy.html, cookies.html   legal pages (js/legal.js, css/legal.css)
demo.html, js/demo3d.js   3D demo neighbourhood (fictional teaching model), at /demo
css/consent.css       storage notice styles shared by all pages
js/three/             optional 3D view: geometry.js (pure), view3d.js (three.js scene)
vendor/               three.js r170 module build + licence (MIT); refresh with `npm run vendor:three`
js/map.js             canvas renderer + pan/zoom/keyboard
js/data.js            loads and indexes data/mumbai.bin.gz
js/routing.js         A* walking routes, turn-by-turn steps
js/search.js          offline place search
js/heat.js            heat categories, route exposure, departure advice
js/services/          http (cache/retry/timeout), weather, aqi, heatgrid, geocode
js/ui/                weather and heat panels
data/mumbai.bin.gz    OSM-derived walking network, places, land cover (2.6 MB)
server.js             zero-dependency static server with security headers
tests/                node --test suites
docs/                 audit, status/feature matrix, data sources, heat method
_backup/              the original single-file app, untouched
```

## Attribution and licences

- Map data © OpenStreetMap contributors, available under the Open Database License (ODbL): https://www.openstreetmap.org/copyright
- Weather and air-quality data by Open-Meteo.com, CC BY 4.0: https://open-meteo.com/en/terms. The free API is for non-commercial use. A commercial deployment needs an Open-Meteo plan or a self-hosted instance.
- Online place search uses OpenStreetMap Nominatim (https://operations.osmfoundation.org/policies/nominatim/). It only runs when the user clicks "Search online", at most one request per second, with results cached.

Privacy and legal: the app sets no cookies. Settings and a 7-day cache are stored in the browser only with consent (`js/storage.js`). The Terms, Privacy and Cookie pages are drafts with [OWNER] placeholders and need a legal review before launch. See `docs/LEGAL.md`.

See `docs/STATUS.md` for what works today, measured results and known limitations.
