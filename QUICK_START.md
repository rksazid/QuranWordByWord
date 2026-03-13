# Quran Word By Word - Quick Start for Feature Development

## Project Overview

**Type**: Vanilla JavaScript Progressive Web App (PWA)
**Version**: 3.0.0
**Performance**: 87% optimized, 5-8x faster loading
**Mobile Ready**: Yes, responsive design with mobile-first approach
**Offline Support**: Yes, via Service Worker

---

## Key Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Vanilla JavaScript (No dependencies) |
| Styling | CSS3 with CSS Variables |
| HTML | HTML5 Semantic Markup |
| Icons | Font Awesome 6.4.0 |
| Fonts | Google Fonts (Amiri, Noto Serif Bengali, Inter) |
| Storage | localStorage + IndexedDB |
| PWA | Service Worker + manifest.json |

---

## Project Structure at a Glance

```
├── index.html              (3208 lines)  Main UI
├── script.js               (2185 lines)  Application logic
├── styles.css              (3208 lines)  Styling system
├── manifest.json                         PWA configuration
├── sw.js                                 Service Worker
├── data/
│   ├── surah_name.json                   All 114 surah metadata
│   └── surahs/
│       ├── surah_001.json...surah_114.json  Quran content
├── TECH_STACK_SUMMARY.md                 Full documentation
└── COMPONENT_PATTERNS.md                 Coding patterns & examples
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

### Pages
- `#surahListPage` - Home page with surah list
- `#surahReadingPage` - Reading interface for selected surah

### Key Containers
- `#surahList` - Grid of surah cards
- `#versesContainer` - Verses/ayahs display
- `#searchContainer` - Search bar
- `#settingsModal` - Settings panel (4 tabs)
- `#favoritesModal` - User's favorite surahs

### Important Buttons
- `#searchBtn` - Open search
- `#settingsBtn` - Open settings
- `#favoritesBtn` - Open favorites
- `#toggleFavoriteBtn` - Add/remove current surah
- `#toggleControlsBtn` - Show/hide reading controls

---

## Application State (appData)

```javascript
{
    surahNames: {},           // All surah metadata
    quranData: {},            // Current surah verses
    currentSurah: null,       // Currently reading
    
    settings: {
        theme: 'light',       // light|dark|auto
        fontSize: 'medium',   // small|medium|large|extra-large
        arabicFont: 'Amiri',
        autoScroll: false,
        scrollSpeed: 1.0,
        favorites: []         // Array of surah IDs
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
// Open
document.getElementById('myModal').style.display = 'flex';

// Close
document.getElementById('myModal').style.display = 'none';
```

### 8. Add Event Listener to Button
```javascript
document.getElementById('myBtn').addEventListener('click', () => {
    // Handle click
});
```

### 9. Render Dynamic List
```javascript
const container = document.getElementById('listContainer');
container.innerHTML = '';  // Clear

items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'list-item';
    el.innerHTML = `<h3>${item.title}</h3>`;
    container.appendChild(el);
});
```

### 10. Toggle Dark Mode
The app automatically uses CSS variables. To toggle theme:
```javascript
appData.settings.theme = 'dark';
document.documentElement.setAttribute('data-theme', 'dark');
saveSettings();
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
- [ ] Add responsive breakpoint at 768px
- [ ] Use transition for smooth animations: `var(--transition)`
- [ ] Follow BEM naming: `.component__element--modifier`

### JavaScript
- [ ] Add DOM element reference to `elements` object
- [ ] Create open/close functions
- [ ] Use try-catch for error handling
- [ ] Call `saveSettings()` when state changes
- [ ] Add console.log for debugging
- [ ] Handle mobile responsiveness
- [ ] Close on Escape key press

### Testing
- [ ] Test on mobile devices (< 768px)
- [ ] Test in light and dark themes
- [ ] Test with different font sizes
- [ ] Test with Arabic and Bengali text
- [ ] Test with slow network (DevTools)

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
switchToReadingPage()   // Show reading interface
switchToSurahListPage() // Show surah list
```

### Rendering
```javascript
renderSurahList()       // Draw all surah cards
renderVerses(data)      // Draw verses for current surah
renderFavorites()       // Draw favorite surahs
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
```

### Utilities
```javascript
showLoading()           // Show loading spinner
hideLoading()           // Hide loading spinner
showError(msg)          // Show error notification
showSuccess(msg)        // Show success notification
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
@media (max-width: 768px) {
    /* Mobile styles */
}
```

### Grid Layout for Cards
```css
display: grid;
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
gap: 1.5rem;
```

### Flexbox for Controls
```css
display: flex;
align-items: center;
justify-content: space-between;
gap: 1rem;
```

### Dark Theme Automatic
All colors automatically switch in dark theme using `[data-theme="dark"]` selector. No extra work needed!

---

## API/Data Endpoints

### Load Surah Names
```javascript
fetch('./data/surah_name.json')
  .then(r => r.json())
  .then(data => console.log(data))
```

### Load Specific Surah (001 = Surah Al-Fatihah)
```javascript
fetch('./data/surahs/surah_001.json')
  .then(r => r.json())
  .then(data => console.log(data))
```

---

## localStorage Keys to Know

```javascript
'quranAppSettings'         // User settings (theme, font, etc)
'quranAppLastSurah'        // Last opened surah ID
'quranAppFavorites'        // Favorite surah IDs
'quranAppTranslationLang'  // Current language (bengla/english)
```

---

## Testing the App

### Open Console Debugger
```javascript
// Check performance stats
window.checkPerformance()

// Preload popular surahs
window.preloadPopularSurahs()

// Compare old vs new loading
window.compareLoadingMethods()

// Get all stats
window.QuranPerformance.check()
```

---

## Deployment Notes

- Build with: `npm run build` or `npm run optimize`
- All assets are minified (styles.min.css, script.min.js)
- Service Worker enabled for offline support
- Favicon and PWA icons are in `/favicon` folder
- No external dependencies to install

---

## Where to Put New Code

### For New Feature:
1. **HTML** → Add elements to `index.html` (before closing `</body>`)
2. **CSS** → Add to `styles.css` (with proper organization comments)
3. **JavaScript** → Add to `script.js` (organize by feature)
4. **Data** → Add JSON files to `/data` if needed

### Structure JavaScript like this:
```javascript
// ==================== MY NEW FEATURE ==================== //

// State variables
let myFeatureState = {
    // ...
};

// DOM elements
const myFeatureElements = {
    btn: document.getElementById('myBtn'),
    // ...
};

// Core functions
function initMyFeature() { }
function openMyFeature() { }
function closeMyFeature() { }

// Event listeners
setupMyFeatureListeners() {
    myFeatureElements.btn.addEventListener('click', openMyFeature);
}
```

---

## Common Gotchas

1. **Always check if element exists** before using it
2. **Remember to save settings** after changes with `saveSettings()`
3. **Close modals on overlay click** by checking `if (e.target === this)`
4. **Use `var(--variable)` in CSS** instead of hardcoded colors
5. **Test mobile at 768px breakpoint** using DevTools
6. **Minified files are loaded in production**, not source files
7. **All strings should support Bengali** in addition to English
8. **Arabic text uses Amiri font** by default

---

## Getting Help

1. Check `TECH_STACK_SUMMARY.md` for full documentation
2. Check `COMPONENT_PATTERNS.md` for coding examples
3. Look at existing components in `index.html` for patterns
4. Search `script.js` for similar functionality
5. Use browser DevTools console for debugging

---

## Quick Links to Key Files

- **Main HTML**: `/Users/mdrezaulkarim/Documents/Projects/QuranWordByWord/index.html`
- **Logic**: `/Users/mdrezaulkarim/Documents/Projects/QuranWordByWord/script.js`
- **Styling**: `/Users/mdrezaulkarim/Documents/Projects/QuranWordByWord/styles.css`
- **Data**: `/Users/mdrezaulkarim/Documents/Projects/QuranWordByWord/data/surahs/`
- **Full Docs**: `/Users/mdrezaulkarim/Documents/Projects/QuranWordByWord/TECH_STACK_SUMMARY.md`
- **Patterns**: `/Users/mdrezaulkarim/Documents/Projects/QuranWordByWord/COMPONENT_PATTERNS.md`

---

Happy coding! The codebase is well-organized and ready for new features!
