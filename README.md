# Al-Quran Word by Word Application

A beautiful, responsive **Progressive Web App (PWA)** for reading the Holy Quran with word-by-word translations in Bengali and English, featuring advanced customization and modern web technologies.

## 🌟 Features

### ✨ New in Latest Update
- **🖼️ Favicon Logo**: Beautiful logo in the navbar using favicon icons
- **❤️ Favorites System**: Add/remove surahs to favorites with heart button
- **🔤 Fixed Arabic Fonts**: All Arabic fonts (Amiri, Scheherazade New, Lateef, Reem Kufi) now working
- **🚀 Lazy Loading**: 99.9% faster initial loading (16KB vs 17MB)
- **📱 Enhanced Mobile**: Better touch targets and mobile optimization

### Core Functionality
- **Complete Surah List**: Browse all 114 surahs with Arabic, Bengali, and English names
- **Beautiful Reading Interface**: Clean, Islamic-themed design optimized for reading
- **Dual Translation Support**: Toggle between Bengali and English translations
- **Word-by-Word Mode**: Click on any Arabic word to see its Bengali meaning
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Progressive Web App (PWA)**: Install on any device for native app-like experience with offline support

### Advanced Settings & Customization
- **Font Customization**: 
  - Adjustable font sizes (Small, Medium, Large, Extra Large)
  - Multiple Arabic fonts (Amiri, Scheherazade New, Lateef, Reem Kufi)
  - UI font selection (Inter, System Default, Poppins, Roboto)
- **Theme Options**: 
  - Light, Dark, and Auto (follows system preference) themes
  - 8 customizable color schemes for primary accent color
- **Reading Enhancement**:
  - Auto-scroll feature with adjustable speed (0.5x to 3.0x)
  - Smart pause when reaching page bottom
- **Session Management**:
  - Automatic saving of all preferences and settings
  - Last opened surah suggestion on homepage
  - Quick reset option for all user data

### User Interface Features
- **Smart Search**: Find surahs by name in any language (Arabic, Bengali, English) or by number
- **Continue Reading**: Smart suggestion to resume from your last opened surah
- **Keyboard Shortcuts**: 
  - `Ctrl+F`: Open search
  - `Ctrl+,`: Open settings
  - `Escape`: Close modals, search, or navigate back
- **Loading States**: Smooth loading animations and comprehensive error handling
- **Islamic Design**: Beautiful color schemes with gradients and Islamic geometric elements
- **Install Prompt**: Custom PWA installation banner for supported devices

### Reading Features
- **Verse-by-verse Layout**: Each verse is clearly separated and numbered
- **Arabic Typography**: Professional Arabic font selection for optimal readability
- **Translation Controls**: 
  - Toggle translation visibility on/off
  - Switch between Bengali and English translations
  - Word-by-word mode toggle with interactive highlighting
- **Interactive Words**: In word-by-word mode, click any Arabic word for instant Bengali meaning
- **Bismillah Display**: Automatic and intelligent handling of Bismillah for different surahs
- **Responsive Font Scaling**: All text scales proportionally with selected font size

### Developer Information
- **About Developer**: MD Rezaul Karim - Full Stack Developer
- **LinkedIn**: [Connect on LinkedIn](https://www.linkedin.com/in/rksazid/)
- **Version**: 2.0.0 with comprehensive feature set

## 🚀 How to Use

### Getting Started
1. **Open in Browser**: Visit the application URL or open `index.html`
2. **Auto-Loading**: The app automatically loads Quran data with progress indication
3. **Browse & Read**: Click any surah card to start reading
4. **Install (Optional)**: Accept the install prompt to add to your device

### Navigation & Controls
- **Surah Selection**: Click any surah card to open for reading
- **Continue Reading**: Use the highlighted suggestion to resume your last session
- **Back Navigation**: Header back button or `Escape` key
- **Search**: Header search icon or `Ctrl+F` for quick surah finding
- **Settings**: Gear icon in header or `Ctrl+,` for comprehensive customization

### Advanced Reading Features
1. **Font & Theme Customization**:
   - Access settings → Display tab
   - Adjust font size with +/- buttons
   - Select preferred Arabic and UI fonts
   - Choose theme (Light/Dark/Auto) and accent colors

2. **Auto-Scroll Reading**:
   - Enable in settings → Reading tab
   - Adjust scroll speed to your reading pace
   - Automatically pauses at page bottom

3. **Word-by-Word Study**:
   - Toggle "Word by Word" mode in reading controls
   - Click any highlighted Arabic word
   - View Bengali meaning in beautiful popup modal

4. **Translation Management**:
   - Toggle translation visibility on/off
   - Switch between Bengali (বাংলা) and English
   - Translations adjust to your font size preferences

## 📱 Installation & Compatibility

### PWA Installation
- **Chrome/Edge**: Accept install prompt or use "Install" from menu
- **Firefox**: Use "Install" option from address bar
- **Safari iOS**: "Add to Home Screen" from share menu
- **Android**: "Add to Home screen" prompt or browser menu

### Device Support
- **Desktop**: Full-featured experience with keyboard shortcuts
- **Tablet**: Touch-optimized interface with responsive layout
- **Mobile**: Optimized mobile interface with gesture support
- **Offline**: Core functionality available without internet connection

## 🎨 Design & Technical Features

### Visual Design
- **Islamic Color Palette**: Green primary with gold accents
- **Typography**: Professional font stack with Arabic optimization
- **Animations**: Smooth transitions and meaningful micro-interactions
- **Responsive Grid**: Intelligent layout adaptation for all screen sizes
- **Dark Mode**: Full dark theme with proper contrast ratios

### Technical Architecture
- **Pure Web Technologies**: HTML5, CSS3, JavaScript ES6+
- **No Dependencies**: Zero external libraries for maximum compatibility
- **Service Worker**: Offline-first architecture with smart caching
- **Session Storage**: Persistent user preferences and reading progress
- **Performance Optimized**: Lazy loading, debounced search, efficient DOM handling

### Accessibility
- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Readers**: Semantic HTML with proper ARIA labels
- **High Contrast**: Meets WCAG guidelines for text readability
- **Focus Management**: Logical tab order and focus indicators
- **Font Scaling**: Respects user font size preferences

## 📋 File Structure

```
QuranWordByWord/
├── index.html          # Main application structure
├── styles.css          # Complete styling with themes and responsive design
├── script.js           # Application logic and PWA functionality
├── manifest.json       # PWA manifest with app metadata
├── sw.js              # Service worker for offline functionality
├── README.md          # This comprehensive documentation
└── data/
    ├── surah_name.json           # Surah metadata (names, types, ayah counts)
    └── al-quran-word-by-word.json # Complete Quran with Bengali word meanings
```

## 🛠️ Development Setup

### Quick Start
```bash
# Clone or download the project
cd QuranWordByWord

# Serve locally (choose one method):
python -m http.server 8000      # Python
npx http-server                 # Node.js
php -S localhost:8000          # PHP

# Open in browser: http://localhost:8000
```

### Development Features
- **No Build Process**: Direct editing and testing
- **Hot Reload**: Use Live Server or similar for instant updates
- **Browser DevTools**: Full debugging support with source maps
- **Service Worker**: Test PWA features locally
- **Responsive Testing**: Built-in mobile viewport simulation

## 🌍 Multilingual Support & Data

### Languages Supported
- **Arabic**: Original Quranic text with proper RTL rendering
- **Bengali**: Complete translation with word-by-word meanings
- **English**: Complete surah translations

### Data Sources
- **Authentic Quran Text**: Verified Arabic script
- **Bengali Translations**: Word-by-word meanings and complete translations
- **Metadata**: Comprehensive surah information (Makkah/Madinah, ayah counts)

## 🔐 Privacy & Data

- **Local Storage Only**: All data stored locally on your device
- **No Tracking**: Zero analytics or tracking scripts
- **Offline Capable**: Complete functionality without internet
- **No Registration**: Immediate access without accounts
- **Open Source**: Transparent code for community review

## 📈 Performance & Optimization

### Core Optimizations
- **Lazy Loading**: Progressive content loading
- **Efficient Caching**: Smart service worker caching strategy
- **Debounced Search**: Optimized search with 300ms delay
- **Event Delegation**: Memory-efficient event handling
- **CSS Grid/Flexbox**: Modern layout with optimal rendering

### Accessibility Compliance
- **WCAG 2.1 AA**: Meets accessibility guidelines
- **Keyboard Navigation**: Full functionality without mouse
- **Screen Reader Support**: Comprehensive ARIA implementation
- **Color Contrast**: Proper ratios for all theme variations
- **Font Scaling**: Respects browser and system font settings

## 🤝 Contributing & Support

### Open Source
This application is built with vanilla web technologies for:
- **Maximum Compatibility**: Works in all modern browsers
- **Easy Maintenance**: No complex build processes or dependencies
- **Transparency**: Fully auditable code
- **Performance**: Optimized for speed and efficiency

### Community
- **Educational Purpose**: Created for Islamic education and research
- **Religious Respect**: Quran text handled with utmost reverence
- **Global Access**: Free and accessible to all Muslims worldwide

## 📄 License & Credits

- **License**: Open source for educational and religious purposes
- **Quran Text**: Sacred text, free for all humanity
- **Developer**: MD Rezaul Karim ([LinkedIn](https://www.linkedin.com/in/rksazid/))
- **Version**: 2.0.0 - Feature-complete with PWA support

---

## 🤲 Final Note

**Barakallahu feekum** - May Allah bless you in your journey of understanding and reciting the Holy Quran. This application is developed with the intention of making Quranic study more accessible and meaningful for Muslims around the world.

### Features at a Glance:
✅ Complete 114 Surahs with Bengali & English translations  
✅ Word-by-word Bengali meanings with click interaction  
✅ Progressive Web App with offline support  
✅ Multiple themes (Light/Dark/Auto) and color schemes  
✅ Font customization with multiple Arabic fonts  
✅ Auto-scroll reading with speed control  
✅ Smart session management and reading suggestions  
✅ Fully responsive design for all devices  
✅ Comprehensive keyboard shortcuts  
✅ Beautiful Islamic-inspired UI design  

**Install today and enhance your Quran study experience!** 📱✨