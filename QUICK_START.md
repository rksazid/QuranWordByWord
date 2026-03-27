# Quran Word By Word - Quick Start for Feature Development

## Project Overview

**Type**: Vanilla JavaScript Progressive Web App (PWA)
**Version**: 4.3.1
**Performance**: 87% optimized, 5-8x faster loading
**Mobile Ready**: Yes, responsive design with mobile-first approach
**Offline Support**: Yes, via Service Worker + IndexedDB backup
**Deep Links**: Hash-based URL routing (`#/surah/1`, `#/hifz/5`, `#/dua/100_ayat_amal`)

---

## Key Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Vanilla JavaScript (No dependencies) |
| Styling | CSS3 with CSS Variables |
| HTML | HTML5 Semantic Markup |
| Icons | Font Awesome 6.4.0 |
| Fonts | Google Fonts (Amiri, Scheherazade, Noto Naskh Arabic, Harmattan, Alkalami, Markazi Text, Noto Serif Bengali, Inter) |
| Storage | localStorage + IndexedDB (IDB helper) |
| PWA | Service Worker (cache-first) + manifest.json |
| Compression | Pako (gzip) via CDN with SRI |

---

## Project Structure at a Glance

```
├── index.html              (1008 lines)   Main UI
├── script.js               (3791 lines)   Application logic
├── styles.css              (5206 lines)   Styling system
├── manifest.json                          PWA configuration (v4.3.1)
├── sw.js                                  Service Worker (cache-first + offline fallback)
├── data/
│   ├── surah_name.json                    All 114 surah metadata
│   ├── juz_data.json                      30 Juz page mappings
│   ├── quran_pages.json                   604 Quran page data
│   ├── duas.json                          Dua collections with counter configs
│   └── surahs/
│       ├── surah_001.json...surah_114.json  Quran content
├── TECH_STACK_SUMMARY.md                  Full documentation
├── COMPONENT_PATTERNS.md                  Coding patterns & examples
├── COLOR_SYSTEM.md                        Color design tokens
└── DOCUMENTATION_INDEX.md                 Documentation navigation
```

---

## Color System (Easy to Customize)

### Light Theme (Default)
- **Primary**: #2d7d32 (Deep Green) & #4caf50 (Light Green)
- **Secondary**: #d4af37 (Gold) & #ffd54f (Light Gold)
- **Text**: #1a1a1a (Dark)
- **Background**: #fafafa (Light gray)

### Dark Theme (Auto-switched)
- **Background**: #121212 (Very Dark)
- **Card**: #2d2d2d (Dark Gray)
- **Text**: #ffffff (White)

All colors use CSS variables in `:root` selector - easy to update globally!

---

## Essential DOM Elements to Know

### Pages (6 total)
- `#surahListPage` - Home page with surah card/list grid
- `#surahReadingPage` - Reading interface for selected surah
- `#hifzListPage` - Hifz mode: 30 Juz list
- `#hifzReadingPage` - Hifz mode: single Quran page view
- `#duaListPage` - Dua collections list with progress rings
- `#duaReadingPage` - Dua detail page with counters and Quran references

### Key Containers
- `#surahList` - Grid of surah cards
- `#versesContainer` - Verses/ayahs display
- `#searchContainer` - Search bar with Makki/Madani filters
- `#settingsModal` - Settings panel (4 tabs: Display, Reading, Theme, About)
- `#favoritesModal` - User's favorite surahs
- `#mainViewToggle` - Surahs / Hifz / Dua's tab buttons
- `#duaList` - Dua collection cards container
- `#duaItemsContainer` - Dua items with counters
- `#bottomNav` - Mobile bottom navigation bar

### Important Buttons
- `#searchBtn` - Open search
- `#settingsBtn` - Open settings
- `#favoritesBtn` - Open favorites
- `#toggleFavoriteBtn` - Add/remove current surah
- `#toggleControlsBtn` - Show/hide reading controls
- `#duaTranslationToggle` - Show/hide dua translations
- `#duaResetAllBtn` - Reset all dua counters in a collection

---

## Application State (appData)

```javascript
{
    surahNames: {},           // All 114 surah metadata
    quranData: {},            // Current surah verses
    currentSurah: null,       // Currently reading surah ID

    // Translation
    currentTranslationLang: 'bangla',  // 'bangla' or 'english'
    isTranslationVisible: true,
    isWordByWordMode: false,

    // Search
    searchQuery: '',
    searchFilter: 'all',      // 'all', 'makkah', 'madinah'

    // View Modes
    viewMode: 'normal',       // 'normal', 'reading', 'compact'
    mainView: 'surahs',       // 'surahs', 'hifz', 'dua'
    currentView: 'card',      // 'card' or 'list'

    // Multi-Select
    isSelectionMode: false,
    selectedVerses: new Set(),

    // Hifz Mode
    juzData: null,
    quranPages: null,
    currentHifzPage: 1,
    currentJuz: null,

    // Dua Mode
    duaData: null,            // Loaded from data/duas.json
    duaCounts: {},            // {itemId: count, ...}
    currentDua: null,         // Current dua collection ID
    duaTranslationVisible: false,

    settings: {
        theme: 'light',             // 'light' or 'dark'
        fontSize: 'medium',
        fontSizeMultiplier: 1.0,    // 0.7 to 2.0
        arabicFont: 'Amiri',
        bengaliFont: 'Noto Serif Bengali',
        uiFont: 'Inter',
        primaryColor: '#2d7d32',
        autoScroll: false,
        scrollSpeed: 1.0,           // 0.1 to 3.0
        favorites: []               // Array of surah IDs
    }
}
```

---

## Common Tasks & Code Snippets

### 1. Get Current Surah ID
```javascript
const surahId = appData.currentSurah;
```

### 2. Get User Settings
```javascript
const fontSize = appData.settings.fontSize;
const theme = appData.settings.theme;
```

### 3. Save Settings
```javascript
appData.settings.myOption = value;
saveSettings();  // Automatically saves to localStorage
```

### 4. Show Notification
```javascript
showLoading();    // Show spinner
hideLoading();    // Hide spinner
showError('Error message');      // Red alert
showSuccess('Success message');  // Green alert
```

### 5. Load Surah Data
```javascript
const verses = await loadSurahData(surahId);
// Returns: { "1": { arabic_text, bangla_trans, english_trans, word_by_word }, ... }
```

### 6. Get All Surah Names
```javascript
const allSurahs = appData.surahNames;
// Example: appData.surahNames["1"] = { name_arabic, name_bengali, name_english, type, ayah_number }
```

### 7. Toggle Modal Display
```javascript
document.getElementById('myModal').style.display = 'flex';  // Open
document.getElementById('myModal').style.display = 'none';  // Close
```

### 8. Use Hash Routing (Deep Links)
```javascript
setAppHash('surah/67');           // Set URL to #/surah/67
setAppHash('dua/100_ayat_amal');  // Set URL to #/dua/100_ayat_amal
setAppHash('');                   // Clear hash (go home)

const route = parseAppHash();     // Returns { type: 'surah', id: '67' } or null
```

### 9. Use IndexedDB Backup
```javascript
await IDB.set('my_key', myData);          // Store data
const data = await IDB.get('my_key');     // Retrieve data
```

### 10. Switch Main View
```javascript
switchMainView('surahs');  // Show surah list
switchMainView('hifz');    // Show Hifz/Juz list
switchMainView('dua');     // Show Dua collections
```

---

## Feature Development Checklist

When adding a new feature:

### HTML
- [ ] Add semantic elements to `index.html`
- [ ] Use meaningful IDs (e.g., `#featureNameModal`)
- [ ] Include proper ARIA labels for accessibility
- [ ] Hide elements with `style="display: none;"` initially

### CSS
- [ ] Use CSS variables for colors: `var(--primary-color)`
- [ ] Use flexbox/grid for layout
- [ ] Add responsive breakpoints at 768px and 480px
- [ ] Use transition for smooth animations: `var(--transition)`
- [ ] Support dark theme via `[data-theme="dark"]`
- [ ] Follow BEM naming: `.component__element--modifier`

### JavaScript
- [ ] Add DOM element reference to `elements` object
- [ ] Create open/close functions
- [ ] Use `escapeHtml()` for any user-generated content in innerHTML
- [ ] Use try-catch for error handling
- [ ] Call `saveSettings()` when state changes
- [ ] Add IDB backup for important data: `IDB.set(key, data)`
- [ ] Update hash routing if page is navigable: `setAppHash('type/id')`
- [ ] Handle mobile responsiveness
- [ ] Close on Escape key press

### Testing
- [ ] Test on mobile devices (< 768px and < 480px)
- [ ] Test in light and dark themes
- [ ] Test with different font sizes (0.7x to 2.0x)
- [ ] Test with Arabic and Bengali text
- [ ] Test offline behavior (disconnect network)
- [ ] Test deep link URL sharing

---

## Important Functions You'll Use Often

### State & Settings
```javascript
loadSettings()          // Load user preferences from storage
saveSettings()          // Save current state to storage
saveLastSurah(id)       // Remember last opened surah
clearAllData()          // Reset everything
```

### Navigation
```javascript
switchMainView(view)    // Switch between 'surahs', 'hifz', 'dua'
switchToReadingPage()   // Show reading interface
setAppHash(path)        // Set hash URL for deep linking
navigateToHash(route)   // Navigate to a parsed hash route
```

### Rendering
```javascript
renderSurahList()       // Draw all surah cards
renderVerses(data)      // Draw verses for current surah
renderFavorites()       // Draw favorite surahs
renderDuaList()         // Draw dua collection cards with progress rings
renderDuaContent(col)   // Draw dua items with counters and Quran refs
renderJuzList()         // Draw 30 Juz cards
```

### Favorites
```javascript
toggleCurrentSurahFavorite()   // Add/remove from favorites
updateFavoriteButtonState()    // Update UI button
```

### Display Control
```javascript
toggleTranslation()     // Show/hide translations
setTranslationLanguage('bangla')  // Switch Bengali/English
toggleWordByWord()      // Enable word-by-word mode
toggleDuaTranslations() // Show/hide dua translations
```

### Data with Offline Backup
```javascript
loadSurahData(id)       // Load surah (network → cache → IDB fallback)
loadDuaData()           // Load duas.json with IDB fallback
loadHifzData()          // Load juz/page data with IDB fallback
IDB.set(key, value)     // Store data in IndexedDB
IDB.get(key)            // Retrieve data from IndexedDB
```

### Utilities
```javascript
showLoading()           // Show loading spinner
hideLoading()           // Hide loading spinner
showError(msg)          // Show error notification
showSuccess(msg)        // Show success notification
escapeHtml(str)         // Sanitize HTML to prevent XSS
```

---

## CSS Tips & Tricks

### Use Existing Variables
```css
color: var(--text-primary);        /* Dark text */
background: var(--bg-card);        /* Card background */
border-color: var(--border-color);
box-shadow: var(--shadow-md);
border-radius: var(--border-radius);
transition: var(--transition);     /* 0.3s smooth animation */
font-family: var(--font-arabic);   /* For Arabic text */
font-family: var(--font-bengali);  /* For Bengali text */
```

### Media Queries for Mobile
```css
@media (max-width: 768px) { /* Tablet */ }
@media (max-width: 480px) { /* Phone */ }
```

### Dark Theme Automatic
All colors automatically switch in dark theme using `[data-theme="dark"]` selector. No extra work needed!

---

## localStorage Keys to Know

```javascript
'quranAppSettings'            // User settings (theme, font, favorites, etc.)
'quranAppLastSurah'           // Last opened surah ID
'quranAppSearchQuery'         // Last search query
'quranAppTranslationVisible'  // Translation visibility state
'quranAppTranslationLang'     // Current language ('bangla' or 'english')
'quranAppWordByWordMode'      // Word-by-word mode state
'quranAppMainView'            // Active main view ('surahs', 'hifz', 'dua')
'quranAppActivePage'          // Current page state
'quranAppViewMode'            // Reading view mode ('normal', 'reading', 'compact')
'quranAppCurrentHifzPage'     // Current Hifz page number
'quranAppCurrentDua'          // Current dua collection ID
'quranAppDuaCounts'           // Dua counter states { itemId: count }
'quranAppDuaLastDate'         // Date of last dua reset (daily auto-reset)
'surahView'                   // Surah list view ('card' or 'list')
```

## IndexedDB Keys (quranAppDB)

```javascript
'surah_names'    // Backup of surah metadata
'surah_XXX'      // Individual surah data (XXX = surah number)
'duas'           // Dua collections and items
'juz_data'       // Hifz/Juz information
```

---

## Build & Deploy

- Build minified files: `node minify-assets.js`
- All assets are minified (styles.min.css, script.min.js, sw.min.js)
- Service Worker enabled for offline support with embedded fallback page
- Favicon and PWA icons in `/favicon` folder
- No external dependencies to install (npm only for build tools)

---

## Where to Put New Code

1. **HTML** → Add elements to `index.html` (before closing `</body>`)
2. **CSS** → Add to `styles.css` (with section comment headers)
3. **JavaScript** → Add to `script.js` (organize by feature section)
4. **Data** → Add JSON files to `/data`, add to `sw.js` CORE_URLS, run `node minify-assets.js`

---

## Common Gotchas

1. **Always run `node minify-assets.js`** after editing source files
2. **Use `escapeHtml()`** for any dynamic content in innerHTML to prevent XSS
3. **Remember to save settings** after changes with `saveSettings()`
4. **Add IDB backup** for important data fetched from network
5. **Update `sw.js` CORE_URLS** when adding new data files
6. **Use `var(--variable)` in CSS** instead of hardcoded colors
7. **Test mobile at 768px and 480px** breakpoints
8. **All strings should support Bengali** in addition to English
9. **Hash routing** — update `setAppHash()` when navigating to new pages
10. **Bottom nav** — update `updateBottomNavForPage()` when adding new page types

---

## Getting Help

1. Check `TECH_STACK_SUMMARY.md` for full documentation
2. Check `COMPONENT_PATTERNS.md` for coding examples
3. Check `COLOR_SYSTEM.md` for styling guidance
4. Check `DOCUMENTATION_INDEX.md` for navigation
5. Search `script.js` for similar functionality
6. Use browser DevTools console for debugging

---

Happy coding! The codebase is well-organized and ready for new features!
