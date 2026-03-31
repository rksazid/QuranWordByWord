# Changelog

All notable changes to Al-Quran Word by Word will be documented in this file.

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
