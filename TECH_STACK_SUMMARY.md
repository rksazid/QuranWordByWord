# Quran Word By Word Application - Technology Stack & Architecture Summary

## 1. TECHNOLOGY STACK

### Framework & Platform
- **Type**: Vanilla JavaScript Progressive Web App (PWA)
- **Version**: 4.3.1
- **Architecture**: Single Page Application (SPA) with hash-based routing
- **Build System**: Node.js build scripts (`minify-assets.js`) — uses `terser` + `csso` when installed (`npm install`), legacy regex fallback otherwise
- **Package Manager**: NPM
- **Node Version**: >= 14.0.0

### Frontend Technologies
- **HTML5**: Semantic markup with PWA metadata
- **CSS3**: Custom properties (CSS variables), Flexbox, CSS Grid
- **JavaScript (ES6+)**: Vanilla JS (no framework dependencies)
- **Icons**: Font Awesome 6.4.0 (CDN with SRI)

### Font Stack
**Arabic Fonts** (8 options):
- Amiri (primary), Scheherazade New, Lateef, Reem Kufi
- Noto Naskh Arabic, Harmattan, Alkalami, Markazi Text

**Bengali Fonts**:
- Noto Serif Bengali (primary)
- Noto Sans Bengali

**UI Fonts**:
- Inter (default), Apple System Font, BlinkMacSystemFont

### External Libraries
- **Font Awesome 6.4.0**: Icon library (CDN: cdnjs.cloudflare.com)
- **Google Fonts**: Typography (fonts.googleapis.com)
- **Pako 2.1.0**: Gzip compression/decompression (CDN with SRI hash)
- **No Framework Dependencies**: Pure vanilla JavaScript

---

## 2. PROJECT STRUCTURE

```
QuranWordByWord/
├── index.html                    # Main HTML file (1,008 lines)
├── script.js                     # Main application logic (3,791 lines)
├── styles.css                    # Main stylesheet (5,206 lines)
├── styles.min.css               # Minified styles (77 KB)
├── script.min.js                # Minified scripts (98 KB)
├── manifest.json                # PWA manifest (v4.3.1)
├── sw.js                        # Service Worker (cache-first + offline fallback)
├── sw.prod.js                   # Production Service Worker
├── sw.min.js                    # Minified Service Worker
├── compression-utils.js         # Compression utilities
├── enhanced-data-loader.js      # Advanced data loading
├── migration-patch.js           # Data migration
├── env-config.js                # Environment configuration
│
├── data/
│   ├── surah_name.json          # All 114 surah metadata
│   ├── juz_data.json            # 30 Juz page mappings
│   ├── quran_pages.json         # 604 Quran page data
│   ├── duas.json                # Dua collections with counter configs
│   └── surahs/
│       ├── surah_001.json...surah_114.json  (114 files)
│
├── data-compressed/             # Compressed data versions (gzip)
├── favicon/                     # App icons & favicons
│
├── Build Scripts
│   ├── minify-assets.js         # Asset minification
│   ├── build-scripts.js         # Build system
│   ├── compress-data.js         # Data compression
│   └── version-manager.js       # Version management
│
├── Tests
│   └── tests/                   # Audit and performance tests
│
└── Documentation
    ├── README.md, CHANGELOG.md
    ├── QUICK_START.md, TECH_STACK_SUMMARY.md
    ├── COMPONENT_PATTERNS.md, COLOR_SYSTEM.md
    └── DOCUMENTATION_INDEX.md
```

---

## 3. STYLING APPROACH

### CSS Architecture
- **Methodology**: BEM-inspired with utility classes
- **Approach**: CSS Custom Properties (CSS Variables) for theming
- **Preprocessor**: None (vanilla CSS3)
- **Total Size**: 5,206 lines (minified: 77 KB)

### CSS Organization (Major Sections)
```
1.  CSS Variables (colors, fonts, shadows, spacing)
2.  Reset & Base Styles
3.  Header
4.  Search (with Makki/Madani filters)
5.  Main Content
6.  View Toggle Controls (Surahs/Hifz/Dua's)
7.  Surah List (card + list views)
8.  Surah Reading Page
9.  Reading Controls
10. Bismillah
11. Verses (word-by-word, multi-select)
12. Modals (Settings, Favorites, Word Meaning, Go to Ayah, Privacy)
13. Settings Modal (4 tabs)
14. Last Surah Suggestion
15. Floating Controls
16. Floating Scroll Control
17. Go to Ayah Modal
18. Loading Spinner
19. Animations
20. Hifz Mode (Juz list, page reading)
21. Dua Mode (cards, detail, counters, sticky headers, Quran refs)
22. Footer (brand, stats, quote, meta)
23. Bottom Navigation (Mobile)
24. Responsive Design (768px, 480px breakpoints)
25. Reading Mode (Normal/Reading/Compact)
26. Favorites Modal
27. Multi-Select Bar
```

### Color System
**Light Theme (Default)**:
```css
--primary-color: #2d7d32    --primary-light: #4caf50    --primary-dark: #1b5e20
--secondary-color: #d4af37  --secondary-light: #ffd54f  --secondary-dark: #bf9000
--text-primary: #1a1a1a     --text-secondary: #666666   --bg-primary: #fafafa
```

**Dark Theme** (`[data-theme="dark"]`):
```css
--text-primary: #ffffff     --text-secondary: #b0b0b0
--bg-primary: #121212       --bg-secondary: #1e1e1e     --bg-card: #2d2d2d
```

---

## 4. EXISTING COMPONENTS & PATTERNS

### Main Layout

#### Header
- Logo with gradient background, navigation buttons, settings control
- Contextual controls based on current page (home vs reading)

#### Search Bar
- Real-time search across Arabic, Bengali, English names
- **Filters**: All / Makkah / Madinah toggle buttons
- **Result count** display
- **Numeric search** support (e.g., type "67" to find Surah 67)

#### Main View Toggle (3 tabs)
- **Surahs** (`fa-quran`) — surah card/list grid
- **Hifz** (`fa-book-open`) — 30 Juz with page navigation
- **Dua's** (`fa-hands-praying`) — dua collections with counters

### Reading Components

#### Surah Card
- `createSurahCard(surahId, surahInfo)` — card or list item
- Arabic name, Bengali name, type badge, ayah count
- Hover effects, favorite toggle, last-opened highlighting

#### Verse Display
- `createVerseElement(verseNum, verseData)` — verse DOM element
- Arabic text → Full translation → Word-by-word breakdown
- Interactive word highlighting, click-to-view meanings
- Copy and share actions per verse

#### Reading Mode (3 views)
- **Normal**: Full controls with verse actions
- **Reading**: Distraction-free with sticky reading mode bar
- **Compact**: Tightly-spaced minimal layout

#### Multi-Select Mode
- Select multiple verses, copy/share as formatted text

### Hifz Components

#### Juz List
- 30 Juz cards with page ranges
- Click to open page-by-page reading

#### Hifz Page Reader
- Page number, Juz info, pagination indicator
- Previous/Next page navigation
- Renders verses from multiple surahs on a single page

### Dua Components

#### Dua Collection Cards
- Icon circle, title (Bengali + English), item count
- **Circular SVG progress ring** showing completion ratio (conic-gradient)

#### Dua Detail Page
- Collection title and description
- Translation toggle and Reset All button
- **Sticky item headers** (GitHub-style) with IntersectionObserver

#### Dua Items
- `.dua-item-header` — number badge + titles + counter buttons (sticky)
- `.dua-item-body` — Arabic text, translations, instructions, source
- **Counter button** (64px circle) showing current/target count
- `.counter-complete` state with green gradient + glow
- **Quran references** load verses from existing surah data (no duplication)

### Modal Components

| Modal | ID | Purpose |
|-------|-----|---------|
| Settings | `#settingsModal` | 4 tabs: Display, Reading, Theme, About |
| Word Meaning | `#wordModal` | Arabic word + Bengali meaning popup |
| Favorites | `#favoritesModal` | Bookmark list with remove buttons |
| Go to Ayah | `#goToAyahModal` | Number input + First/Middle/Last quick nav |
| Privacy | `#privacyModal` | Privacy policy display |

### Mobile Components

#### Bottom Navigation
- **Home page**: Home, Favorites, Dua's, Search, Settings
- **Reading page**: Home, Toggle Favorite, Go to Ayah, Controls, Settings
- Contextual items via `updateBottomNavForPage(isReadingPage)`

#### Floating Controls Panel
- Translation toggle, language buttons, word-by-word toggle
- Collapsible panel on reading page

#### Floating Scroll Control
- Pause/resume, slow down, speed up, stop buttons
- Shown during auto-scroll mode

### Footer
- **Brand section**: Logo, description, stats (114 Surahs · 6236 Ayahs · 2+ Languages)
- **Feature links**: Icons with labels
- **Support links**: Install, privacy, feedback
- **Quote section**: Arabic verse with ornamental dividers
- **Meta line**: Copyright · version pill badge · tagline

---

## 5. DATA STRUCTURES

### Application State (appData)
```javascript
{
    surahNames: null,           // All 114 surahs metadata (from surah_name.json)
    quranData: null,            // Current surah verses
    currentSurah: null,         // Currently displayed surah ID
    currentTranslationLang: 'bangla',
    isTranslationVisible: true,
    isWordByWordMode: false,
    searchQuery: '',
    searchFilter: 'all',        // 'all', 'makkah', 'madinah'
    viewMode: 'normal',         // 'normal', 'reading', 'compact'
    mainView: 'surahs',         // 'surahs', 'hifz', 'dua'
    isSelectionMode: false,
    selectedVerses: new Set(),
    juzData: null,              // 30 Juz data
    quranPages: null,           // 604 Quran pages
    currentHifzPage: 1,
    currentJuz: null,
    duaData: null,              // Dua collections from duas.json
    duaCounts: {},              // { itemId: count }
    currentDua: null,           // Active dua collection ID
    duaTranslationVisible: false,
    settings: {
        fontSize: 'medium',
        fontSizeMultiplier: 1.0,    // 0.7 to 2.0
        arabicFont: 'Amiri',
        bengaliFont: 'Noto Serif Bengali',
        uiFont: 'Inter',
        theme: 'light',
        primaryColor: '#2d7d32',
        autoScroll: false,
        scrollSpeed: 1.0,           // 0.1 to 3.0
        favorites: []
    },
    currentView: 'card'         // 'card' or 'list'
}
```

### Dua Data Structure (duas.json)
```json
{
  "collections": [
    {
      "id": "essential_protection",
      "title_bn": "...", "title_en": "...", "title_ar": "...",
      "description_bn": "...", "description_en": "...",
      "icon": "fa-shield-halved",
      "category": "protection",
      "items": [
        {
          "id": "item_1",
          "type": "quran_ref",
          "label_bn": "...", "label_en": "...",
          "instruction_bn": "...", "instruction_en": "...",
          "target_count": 3,
          "surah_id": 112,
          "ayah_start": 1, "ayah_end": null,
          "source_bn": "...", "source_en": "..."
        },
        {
          "id": "item_2",
          "type": "hadith",
          "arabic_text": "...",
          "target_count": 7,
          "partial_text_ar": "..."
        }
      ]
    }
  ]
}
```

---

## 6. KEY FUNCTIONS & UTILITIES

### Data Loading
```javascript
loadData()                    // Main init: loads surah_name.json with IDB backup
loadSurahData(surahId)        // Load specific surah (network → cache → IDB)
loadSurahFromServer(surahId)  // Fetch with IDB backup on success
loadDuaData()                 // Load duas.json with IDB fallback
loadHifzData()                // Load juz_data.json + quran_pages.json with IDB
preloadAdjacentSurahs(id)     // Background preload next/prev surahs
```

### Navigation & Routing
```javascript
switchMainView(view)          // Switch 'surahs'/'hifz'/'dua', hide others
switchToReadingPage()         // Show surah reading interface
setAppHash(path)              // Set hash URL: #/surah/1, #/hifz/5, #/dua/id
parseAppHash()                // Parse hash → { type, id } or null
navigateToHash(route)         // Navigate to parsed route
goBackToSurahList()           // Return to surah list, clear hash
initBottomNavigation()        // Setup bottom nav with page-specific items
updateBottomNavForPage(isReading)  // Show/hide contextual nav items
```

### Rendering
```javascript
renderSurahList()             // Render all surah cards/list items
renderVerses(surahData)       // Render verses with controls
createVerseElement(num, data) // Create single verse DOM element
renderFavorites()             // Render favorites modal content
renderJuzList()               // Render 30 Juz cards
renderHifzPageContent(page)   // Render verses for a Quran page
renderDuaList()               // Render dua collection cards with progress rings
renderDuaContent(collection)  // Render dua items with counters + Quran refs
renderQuranRefHtml(item, map, cls)  // Insert Quran verses into dua items
```

### Dua Counter Management
```javascript
saveDuaCounts()               // Persist to localStorage
incrementDuaCount(id, target) // Increment, wrap at target
resetDuaCount(id)             // Reset single counter
resetAllDuaCounts(colId)      // Reset entire collection
completeDuaCount(id, target)  // Mark as complete
updateDuaItemUI(id, cur, tgt) // Sync DOM without full re-render
toggleDuaTranslations()       // Show/hide translations + English labels
initDuaStickyHeaders()        // Setup sticky headers with IntersectionObserver
```

### Settings & State
```javascript
loadSettings()                // Load from localStorage (includes daily dua reset)
saveSettings()                // Save to localStorage
saveLastSurah(surahId)        // Track last opened surah
clearAllData()                // Reset all user data
```

### Translation & Display
```javascript
toggleTranslation()           // Show/hide translations
setTranslationLanguage(lang)  // Switch Bengali↔English
toggleWordByWord()            // Enable word-by-word mode
setViewMode(mode)             // Set 'normal'/'reading'/'compact'
toggleReadingMode()           // Toggle reading mode
handleFontSizeSlider(e)       // Granular font size (0.7x-2.0x)
```

### Auto-Scroll
```javascript
toggleAutoScroll()            // Start/stop
startAutoScroll()             // requestAnimationFrame smooth scroll
stopAutoScroll()              // Cancel animation frame
changeScrollSpeed(e)          // Speed slider handler
toggleScrollPause()           // Pause/resume
```

### Multi-Select
```javascript
toggleVerseSelection(num)     // Add/remove verse from selection
handleCopySelectedVerses()    // Copy selected verses to clipboard
handleShareSelectedVerses()   // Share via Web Share API
```

### Utilities
```javascript
escapeHtml(str)               // Sanitize HTML to prevent XSS
showLoading() / hideLoading() // Loading spinner
showError(msg)                // Error notification
showSuccess(msg)              // Success notification
debounce(func, wait)          // Event debouncing
```

### IndexedDB Helper (IDB)
```javascript
IDB.open()                    // Initialize database connection
IDB.set(key, value)           // Store data persistently
IDB.get(key)                  // Retrieve stored data
```

---

## 7. STORAGE & PERSISTENCE

### localStorage Keys
| Key | Purpose | Type |
|-----|---------|------|
| `quranAppSettings` | All user settings | JSON |
| `quranAppLastSurah` | Last opened surah ID | String |
| `quranAppSearchQuery` | Last search query | String |
| `quranAppTranslationVisible` | Translation visibility | JSON boolean |
| `quranAppTranslationLang` | Current language | String |
| `quranAppWordByWordMode` | Word-by-word state | JSON boolean |
| `quranAppMainView` | Active view (surahs/hifz/dua) | String |
| `quranAppActivePage` | Current page state | String |
| `quranAppViewMode` | Reading view mode | String |
| `quranAppCurrentHifzPage` | Current Hifz page | String |
| `quranAppCurrentDua` | Current dua collection ID | String |
| `quranAppDuaCounts` | Dua counter states | JSON object |
| `quranAppDuaLastDate` | Last dua reset date | Date string |
| `surahView` | List view preference (card/list) | String |

### IndexedDB (quranAppDB)
| Key | Purpose |
|-----|---------|
| `surah_names` | Backup of surah metadata |
| `surah_XXX` | Individual surah verse data |
| `duas` | Dua collections data |
| `juz_data` | Hifz/Juz page mappings |

**Fallback strategy**: Network → Service Worker Cache → IndexedDB

---

## 8. DESIGN SYSTEM

### Spacing Scale
- `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem`

### Border Radius
- `border-radius-sm`: 8px
- `border-radius`: 12px (default)
- `border-radius-lg`: 16px

### Shadows
- `shadow-sm`: 0 2px 4px rgba(0,0,0,0.1)
- `shadow-md`: 0 4px 12px rgba(0,0,0,0.15)
- `shadow-lg`: 0 8px 24px rgba(0,0,0,0.2)

### Typography
- **Base Font Size**: 16px (1rem)
- **Line Height**: 1.6
- **Arabic**: Amiri (default, 8 font options available)
- **Bengali**: Noto Serif Bengali
- **UI**: Inter

### Font Size Multipliers (8 presets)
```
XS: 0.7  |  S: 0.85  |  M: 1.0  |  L: 1.15
XL: 1.3  |  2XL: 1.5  |  3XL: 1.75  |  4XL: 2.0
```

---

## 9. MOBILE RESPONSIVENESS

### Breakpoints
```css
@media (max-width: 768px)  /* Tablet and below */
@media (max-width: 480px)  /* Phone and below */
```

### Mobile-Specific Features
1. **Bottom Navigation**: Contextual items for home vs reading page
2. **Floating Controls**: Collapsible translation/WbW toggles
3. **Safe Area Insets**: Notch/home indicator support
4. **Touch Targets**: Minimum 48px height
5. **Dua Counter Buttons**: 64px → 56px → 50px at smaller breakpoints
6. **Sticky Headers**: Different `top` offsets per breakpoint (50px/46px/42px)

---

## 10. PERFORMANCE

### Achievements
- **Data Compression**: 86.9%
- **Asset Minification**: ~30%
- **Load Time**: 5-8x faster than v2.x
- **Offline**: Full app works without network (Service Worker + IDB)

### Techniques
1. **Lazy Loading**: On-demand surah loading with in-memory cache
2. **IndexedDB Backup**: Persistent data survives iOS cache eviction
3. **Cache-First SW**: Service Worker serves cached assets immediately
4. **Compression**: Pako gzip for data files
5. **Preloading**: Adjacent surahs preloaded in background
6. **Debouncing**: Search input debounced

---

## 11. ACCESSIBILITY

- **ARIA Labels**: Button titles and descriptions
- **Semantic HTML**: Header, nav, main, footer
- **Keyboard Shortcuts**: Ctrl+F (search), Ctrl+, (settings), Escape (close)
- **Color Contrast**: WCAG AAA compliant
- **Focus Indicators**: Visible focus states
- **RTL Support**: Arabic text rendered right-to-left

---

## 12. PWA FEATURES

### Service Worker
- **Cache-first** strategy for all requests
- **Embedded offline fallback** — bilingual HTML page when cache is empty
- **Background sync** ready
- **Push notifications** ready
- Dynamic caching of network responses

### Deep Linking
- Hash-based routing: `#/surah/1`, `#/hifz/5`, `#/dua/collection_id`
- Browser back/forward navigation support
- Shareable URLs

### Installation
- Installable on Android/iOS
- App shortcuts (Fatihah, Baqarah)
- Custom splash screen
- Status bar styling

---

## SUMMARY

The Quran Word By Word application is a **feature-rich, performance-optimized Progressive Web App** built with vanilla JavaScript and modern CSS. Key capabilities:

1. **3 main views**: Surahs (114 surahs), Hifz (30 Juz, 604 pages), Dua's (collections with tasbeeh counters)
2. **Offline-first**: Service Worker + IndexedDB ensure full offline operation
3. **Deep linking**: Shareable URLs via hash routing
4. **Mobile-optimized**: Bottom navigation, floating controls, responsive breakpoints
5. **Customizable**: 8 Arabic fonts, granular font sizing (0.7x-2.0x), light/dark themes
6. **Bilingual**: Arabic, Bengali, and English throughout
7. **Reading modes**: Normal, Reading (distraction-free), Compact
8. **Counter system**: Dua tasbeeh counters with daily auto-reset and progress tracking
