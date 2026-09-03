# Changelog

All notable changes to Al-Quran Word by Word will be documented in this file.

## [Unreleased]

### Fixed
- **Sticky reading bar covered the app header** — the frosted progress bar was `position: fixed; top: 0; z-index: 950`, sitting on top of the sticky app header and making Back / Go-to-Ayah / Favorite / Settings unclickable while reading. It now docks directly *below* the header (`top: var(--app-header-h)`, measured at runtime via `ResizeObserver`, `z-index: 90`), is `visibility: hidden` when collapsed (no phantom tab stops), and `scroll-padding-top` accounts for both bars so ayah jumps land fully visible. The duplicate Back button in the bar was removed (the header already has one); the keyboard-shortcuts button is hidden on touch widths.
- **Broken `calc()` in production CSS** — the hand-rolled minifier stripped spaces around `+`, turning `calc(2rem + env(...))` into invalid `calc(2rem+env(...))`. Browsers dropped those declarations, so the reading-controls FAB rendered mid-page on desktop, the back-to-top button / install banner lost their safe-area offsets, and the mobile body lost its bottom-nav padding. Fixed by switching the build to **terser + csso** (see Changed).
- **Unreadable "Begin Your Journey" pills** — white text on a pale-green card; now primary-green on a tinted chip in light/sepia and light-green in dark theme.
- **Blocking `confirm()` on app update** replaced by a non-blocking "New version ready · Refresh" toast, so an update never interrupts reading.
- Install banner now clears the bottom nav plus the iOS home-indicator inset.
- **Auto-scroll stutter** — two compounding causes: the global `html { scroll-behavior: smooth }` turned every per-frame `scrollBy` into an animated scroll that the next frame interrupted, and whole-pixel stepping produced a periodic `1px,1px,0px` (1.0x) / `1px,0px` (0.5x) hitch. Auto-scroll now forces instant scroll behaviour only while running (restored on stop), advances a fractional target with `scrollTo` (sub-pixel on hi-DPI screens), uses real frame timing so speed no longer sags on slow frames, re-anchors if the reader scrolls manually, and suspends the sticky-bar / bottom-nav backdrop blur (a per-frame GPU cost on mobile) while running.

### Added
- **Resume at the exact ayah** — the Continue Reading card now shows "Ayah N of M · 3 hours ago" and jumps straight to that ayah. The current ayah (already tracked by the sticky bar's `IntersectionObserver`) is saved to `localStorage('quranAppLastRead')` with a 400 ms debounce; cleared by "Clear all data".

### Changed
- **Build: real minifiers** — `node minify-assets.js` now uses `terser` (JS, scope-aware, drops `console.log`/`info`/`debug` from production bundles) and `csso` (CSS) when installed (`npm install`), falling back to the legacy regex pass otherwise. `script.min.js` shrank 150 KB → 132 KB and no longer risks corrupting string literals containing `-`.
- **Faster first paint** — the default Uthman Taha font is `<link rel="preload">`ed and the large Google Fonts stylesheet loads non-render-blocking (`media="print"` → `all` on load, with a `<noscript>` fallback).
- Service Worker cache bumped to `v4.7.0`; asset cache-busters and manifest/package versions to 4.7.0.

### Added (earlier in cycle)
- **Hifz spaced-repetition tracker** — per-page state machine (`New → Learning → Reviewing → Memorized`) with spaced review intervals (1d → 3d → 7d → 14d → 30d). State chips and a "Mark reviewed" button live in the reading page header; a "Last reviewed · next in N d" line shows when each page is due.
- **"Due today" widget** on the Juz list page — shows all pages whose review window has elapsed with quick-jump pills and a "Start review" CTA. Hides when nothing is due.
- **Per-Juz progress bars + ✓ stamp** — every Juz card on the list page now shows `N/M pages memorized` with a green bar, and earns a checkmark stamp at 100%.
- **Mushaf-width toggle** on the Hifz reading page — constrains the page container to ~580px to mimic a real Madinah Mushaf page width, with a paper-style shadow + line guides. Persisted in `localStorage('quranAppHifzPrefs')`. Note: pixel-perfect line matching to a hardcopy Mushaf requires page-by-page glyph fonts (QCF v1/v2 — not bundled). We constrain the column width and use Uthman Taha to get visually close.
- **Verse highlights** — tap "Mark" on any ayah to pick one of four colors (yellow / green / blue / pink). Highlight renders as a soft left-stripe + gradient that stays readable in light, dark, and sepia themes. Persisted across sessions in `localStorage('quranAppHighlights')`.
- **Private notes per ayah** — attach a personal reflection (up to 2000 chars) via the same popover. Saved ayahs show a small sticky-note indicator in the top-right; tap it to re-open the note. Stored in `localStorage('quranAppNotes')`.
- **Highlight popover** — floating menu with 4 color swatches + clear + Add/Edit note, smartly positioned above or below the trigger button, dismissed on outside click, scroll, resize, or `Esc`.
- **Note editor modal** — focused textarea with live character counter, primary Save / secondary Delete, accessible via `Esc`.
- **Sepia / Paper theme** — third theme option (Light · Sepia · Dark · Auto) with warm cream paper background, easier on the eyes for long Mushaf-style reading.
- **Home greeting card** — time-based salutation in Arabic + English (morning / afternoon / evening / Maghrib / night) with a dynamic sun → moon icon.
- **Home stats row** — three quick pills (streak · saved ayahs · duas completed today) visible the moment the app opens.
- **Swipe gestures on reading page** — swipe-left for next surah, swipe-right for previous (mobile). Quick-flick detection with vertical-scroll guard so it doesn't fight scrolling.
- **Skeleton loader** for Verse of the Day card (shimmer animation while the daily surah JSON is fetched).
- **Centralized `haptic()` helper** that respects `prefers-reduced-motion` — used by dua counter, dua complete, and bookmark actions.
- **`prefers-reduced-motion` honoured globally** — disables animations, transitions, and skeleton shimmer for users who prefer reduced motion.

### Changed
- **iOS safe-area insets** — `viewport-fit=cover` plus `env(safe-area-inset-*)` on the sticky reading header (top), floating controls, back-to-top button, selection bar, and share toast so nothing hides under the iPhone notch or home indicator.
- Dua counter and complete buttons now vibrate via the central helper (gentle 15ms tick, 40ms on completion, success pattern on full-complete).
- Bookmark action uses the centralized haptic helper.

### Added (earlier in cycle)
- **Ruqyah Shariah collection** (12 items) — Surah Al-Fatihah, Ayatul Kursi, last two ayahs of Al-Baqarah, the three Quls, sihr-breaking verses (Al-A'raf 117-122, Yunus 81-82, Ta-Ha 69), shifa verse (Al-Isra 82), the Prophet's ﷺ healing du'a (Allahumma Rabban-nas) and Jibril's ruqyah. Each item carries authentic source citations.
- **Adhkar After Obligatory Prayer collection** (8 items) — istighfar 3x, Allahumma antas-salam, la ilaha illallah wahdahu (mu'aqqibat), SubhanAllah / Alhamdulillah / Allahu Akbar 33x each, the 100th tahlil, and Ayatul Kursi.
- **Dua list search** — debounced search box on the Dua list page that matches collection titles, descriptions, item labels, Arabic text, and English translations.
- **Dua category filter chips** — All / Protection / Ruqyah / Adhkar / Nightly with badge counts. Persisted within the session.
- **Dua empty-state** when search/filter returns no matches.
- **Per-dua share & copy button** — uses `navigator.share` on mobile (system share sheet) or falls back to clipboard. Composes Arabic + Bengali + English + source citation. For Qur'an references, pulls the actual ayah text from the surah cache.
- **Category pill on each Dua card** showing protection / ruqyah / adhkar / nightly badge.
- **Reader power-up** — sticky frosted-glass reading header that fades in on scroll, showing surah title, live "X / Y" ayah counter, scroll progress bar, and quick-action icons (jump-to-ayah, shortcuts help, back). Works on mobile and desktop.
- **Live current-ayah tracking** via `IntersectionObserver` — the visible ayah gets a subtle left-border accent and the sticky header counter follows the reader.
- **Reading streak tracker** — daily streak (consecutive days) shown as a fire-pill in the surah header; gracefully tolerates a one-day gap before resetting.
- **Reading time estimate** — `~N min` pill in the surah header based on ayah count (~12 s/ayah).
- **Extended keyboard shortcuts** for desktop power users:
  - `J` / `↓` next ayah, `K` / `↑` previous ayah
  - `]` / `[` next / previous surah
  - `T` toggle translation, `W` toggle word-by-word, `L` switch BN/EN
  - `B` bookmark current ayah, `C` copy current ayah
  - `?` open shortcuts cheatsheet
- **Keyboard shortcuts modal** — organized cheatsheet (Navigation / Reader / App) reachable from `?` or the sticky header.
- **More Arabic font options** matching quran.com selections, organized by script style (Madinah Mushaf, IndoPak, Calligraphic, Modern).
- **Mehr Nastaliq** — authentic Indo-Pak Nastaliq script for IndoPak readers.
- **Aref Ruqaa** and **Aref Ruqaa Ink** — traditional Ruq'ah calligraphic styles.
- **Noto Kufi Arabic**, **Cairo**, **Tajawal** — additional modern and Kufi Arabic font choices.

### Changed
- Arabic font select grouped via `<optgroup>` (Madinah Mushaf / IndoPak / Calligraphic / Modern).
- All modal overlays now use `backdrop-filter: blur(6px)` for a modernized dim.
- Bumped Service Worker cache to `v4.4.1` so the expanded Google Fonts URL re-caches on existing installs.

---

## [4.3.1] - 2026-03-28

### Fixed
- **Pako SRI hash mismatch** — corrected Subresource Integrity hash for pako.min.js CDN, which was blocking compressed data loading
- **Deprecated meta tag** — replaced `apple-mobile-web-app-capable` with `mobile-web-app-capable`
- **iOS offline data loss** — fixed critical Promise bug in Service Worker fetch handler where `caches.match('./') || caches.match('./index.html')` always returned the first Promise (truthy). Replaced with proper `.then()` chain

### Added
- **IndexedDB backup layer** — all data (surah names, surah content, hifz data, dua data) now backed up to IndexedDB for iOS offline resilience
- **Embedded offline fallback page** — bilingual (Bengali/English) fallback served when both cache and network are unavailable
- **`navigator.storage.persist()`** — requests persistent storage to prevent iOS cache eviction
- **Deep link sharing** — hash-based URL routing (`#/surah/1`, `#/hifz/5`, `#/dua/100_ayat_amal`) for shareable page links
- **Daily dua counter auto-reset** — counters automatically reset when a new day starts (compared via `quranAppDuaLastDate`)

### Changed
- Service Worker strategy changed to **cache-first for all requests** (previously network-first for data files) for better iOS offline reliability

---

## [4.3.0] - 2026-03-27

### Added
- **Dua's feature** — new main view tab alongside Surahs and Hifz with dua collections, tasbeeh counter buttons, and progress tracking
- **"বাধ্যতামূলক হিফাজতের আমল"** (Essential Protection Amal) — first dua collection with 6 items including Ayatul Kursi, 3 Quls, and Tawbah 9:129
- **"১০০ আয়াতের আমল"** (100 Ayat Nightly Recitation) — second dua collection with 9 items totaling 101 ayahs
- **Circular progress rings** on dua collection cards showing completion ratio
- **Sticky dua item headers** — GitHub-style sticky headers with IntersectionObserver for stuck-state detection
- **Dua translation toggle** — show/hide Arabic translations and English labels on dua reading page
- **Bottom nav Dua's button** — quick mobile access to dua collections

### Changed
- **Dua item layout restructured** — changed from 3-column flex to header/body card layout for better Arabic text readability on mobile
- **Footer redesigned** — professional layout with Islamic quote section, ornamental dividers, version pill badge, copyright/tagline meta line
- **Arabic text styling** — right green border, gradient background, improved line-height and word-spacing for readability

---

## [4.2.12] - 2026-03-24

### Changed
- Lighthouse performance audit improvements
- Favorite button state persistence fix
- Tab state persistence across page navigation

---

## [4.2.11] - 2026-03-21

### Changed
- Bug fixes and UI improvements

---

## [4.2.10] - 2026-03-21

### Changed
- Bug fixes and improvements

---

## [4.2.9] - 2026-03-21

### Changed
- Bug fixes and improvements

---

## [4.2.8] - 2026-03-21

### Changed
- Bug fixes and improvements

---

## [4.2.7] - 2026-03-20

### Changed
- Bug fixes and improvements

---

## [4.2.6] - 2026-03-20

### Changed
- Bug fixes and improvements

---

## [4.2.5] - 2026-03-20

### Changed
- Bug fixes and improvements

---

## [4.2.4] - 2026-03-20

### Changed
- Bug fixes and improvements

---

## [4.2.3] - 2026-03-20

### Changed
- Bug fixes and improvements

---

## [4.2.2] - 2026-03-19

### Changed
- Bug fixes and improvements

---

## [4.2.1] - 2026-03-19

### Changed
- Bug fixes and improvements

---

## [4.2.0] - 2026-03-19

### Added
- **Hifz (Memorization) mode** — page-by-page Quran reading with 30 Juz navigation
- **Multi-verse selection** — select, copy, and share multiple verses at once
- **Main view toggle** — Surahs / Hifz tab switching

---

## [4.1.x] - 2026-03-17

### Added
- **Reading Mode** with Normal/Reading/Compact view tabs and sticky reading mode bar
- **Enhanced Search** with Makki/Madani filters, numeric search, and result count display
- **Smooth Auto-scroll** using `requestAnimationFrame` with 0.1-3.0x speed range
- **Granular font size slider** — 0.7x to 2.0x multiplier with 8 presets (XS through 4XL)
- **Extended Arabic fonts** — added Noto Naskh Arabic, Harmattan, Alkalami, Markazi Text
- **Install button** in footer with `deferredPrompt` support and manual instructions fallback

---

## [4.0.0] - 2026-03-16

### Added
- **Bottom navigation bar** for mobile with contextual items (home vs reading page)
- **Floating controls panel** with translation, language, and word-by-word toggles
- **Floating scroll control bar** with pause/resume, speed adjustment
- **Go to Ayah modal** with number input and quick navigation (First/Middle/Last)
- **Privacy policy modal**

### Changed
- Major UI overhaul with improved mobile responsiveness
- Bottom-safe-area-aware layout for notched devices

---

## [3.5.0] - 2026-03-16

### Changed
- Security hardening and XSS prevention with `escapeHtml()` utility
- Improved accessibility with ARIA labels and button titles

---

## [3.1.0 - 3.4.0] - 2026-03-13

### Added
- **Word-by-word mode** — click any Arabic word to see its Bengali meaning
- **Favorites system** — bookmark surahs with persistent localStorage storage
- **Settings modal** with 4 tabs (Display, Reading, Theme, About)
- **Theme system** — light/dark mode with 6 primary color options
- **Auto-scroll feature** with configurable speed
- **Keyboard shortcuts** — Ctrl+F (search), Ctrl+, (settings), Escape (close)

---

## [3.0.0] - 2025-09-02

### Major Release - Performance Revolution

#### Added
- **87% total data reduction** through compression and minification
- **Advanced compression system** with 86.9% JSON data reduction
- **Asset minification** with 34.4% file size reduction
- **Comprehensive test suite** with production validation
- **Enhanced service worker** with perfect cache consistency
- **Production deployment tools** and validation

#### Technical Improvements
- **Data compression**: 31.8 MB → 4.2 MB (86.9% reduction)
- **Asset optimization**: 167 KB → 107.8 KB (35.4% reduction)
- **Load time**: 5-8x faster loading
- **Cache efficiency**: Under 200KB for mobile optimization

---
\n## [4.8.0] - 2026-09-03

### Changed
- Version update
- Bug fixes and improvements

---
\n## [4.6.0] - 2026-05-17

### Changed
- Version update
- Bug fixes and improvements

---
\n## [4.5.0] - 2026-05-11

### Changed
- Version update
- Bug fixes and improvements

---
\n## [4.4.0] - 2026-03-31

### Changed
- Version update
- Bug fixes and improvements

---
\n## [4.3.3] - 2026-03-30

### Changed
- Version update
- Bug fixes and improvements

---
\n## [4.3.2] - 2026-03-27

### Changed
- Version update
- Bug fixes and improvements

---
