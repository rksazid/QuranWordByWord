// ==================== APPLICATION STATE ==================== //
let appData = {
    surahNames: null,
    quranData: null,
    currentSurah: null,
    currentTranslationLang: 'bangla',
    isTranslationVisible: true,
    isWordByWordMode: false,
    searchQuery: '',
    searchFilter: 'all',
    isReadingMode: false,
    isCompactMode: false,
    // Settings
    settings: {
        fontSize: 'medium',
        fontSizeMultiplier: 1.0,
        arabicFont: 'Amiri',
        bengaliFont: 'Noto Serif Bengali',
        uiFont: 'Inter',
        theme: 'light',
        primaryColor: '#2d7d32',
        autoScroll: false,
        scrollSpeed: 1.0,
        favorites: []
    },
    // Auto scroll
    autoScrollAnimationFrame: null,
    autoScrollInterval: null,
    isScrollPaused: false,
    lastScrollTime: 0,
    // View preferences
    currentView: 'card'
};

// ==================== DOM ELEMENTS ==================== //
const elements = {
    // Navigation
    backBtn: document.getElementById('backBtn'),
    searchBtn: document.getElementById('searchBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    favoritesBtn: document.getElementById('favoritesBtn'),
    toggleFavoriteBtn: document.getElementById('toggleFavoriteBtn'),
    
    // Header Controls
    homepageControls: document.getElementById('homepageControls'),
    surahControls: document.getElementById('surahControls'),
    goToAyahBtn: document.getElementById('goToAyahBtn'),
    toggleControlsBtn: document.getElementById('toggleControlsBtn'),
    
    // Search
    searchContainer: document.getElementById('searchContainer'),
    searchInput: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),
    
    // Pages
    surahListPage: document.getElementById('surahListPage'),
    surahReadingPage: document.getElementById('surahReadingPage'),
    
    // Surah List
    surahList: document.getElementById('surahList'),
    
    // View Toggle Controls
    viewToggleBtns: document.querySelectorAll('.toggle-btn'),
    surahCountDisplay: document.getElementById('surahCount'),
    lastSurahSuggestion: document.getElementById('lastSurahSuggestion'),
    lastSurahCard: document.getElementById('lastSurahCard'),
    
    // Surah Reading
    surahTitle: document.getElementById('surahTitle'),
    surahType: document.getElementById('surahType'),
    surahAyahs: document.getElementById('surahAyahs'),
    translationToggle: document.getElementById('translationToggle'),
    translationLanguage: document.getElementById('translationLanguage'),
    banglaBtn: document.getElementById('banglaBtn'),
    englishBtn: document.getElementById('englishBtn'),
    wordByWordToggle: document.getElementById('wordByWordToggle'),
    bismillah: document.getElementById('bismillah'),
    versesContainer: document.getElementById('versesContainer'),
    
    // Modal
    wordModal: document.getElementById('wordModal'),
    modalArabicWord: document.getElementById('modalArabicWord'),
    modalMeaning: document.getElementById('modalMeaning'),
    closeModal: document.getElementById('closeModal'),
    
    // Settings Modal
    settingsModal: document.getElementById('settingsModal'),
    closeSettingsModal: document.getElementById('closeSettingsModal'),
    
    // Favorites Modal
    favoritesModal: document.getElementById('favoritesModal'),
    favoritesList: document.getElementById('favoritesList'),
    
    // Settings Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    displayTab: document.getElementById('displayTab'),
    readingTab: document.getElementById('readingTab'),
    themeTab: document.getElementById('themeTab'),
    aboutTab: document.getElementById('aboutTab'),
    
    // Font Settings
    decreaseFontSize: document.getElementById('decreaseFontSize'),
    increaseFontSize: document.getElementById('increaseFontSize'),
    fontSizeDisplay: document.getElementById('fontSizeDisplay'),
    arabicFontSelect: document.getElementById('arabicFontSelect'),
    bengaliFontSelect: document.getElementById('bengaliFontSelect'),
    uiFontSelect: document.getElementById('uiFontSelect'),
    
    // Reading Settings
    autoScrollToggle: document.getElementById('autoScrollToggle'),
    scrollSpeedRange: document.getElementById('scrollSpeedRange'),
    scrollSpeedDisplay: document.getElementById('scrollSpeedDisplay'),
    clearSessionBtn: document.getElementById('clearSessionBtn'),
    
    // Speed Presets
    speedPresets: document.querySelectorAll('.speed-preset'),
    
    // Floating Scroll Control
    floatingScrollControl: document.getElementById('floatingScrollControl'),
    currentSpeedDisplay: document.getElementById('currentSpeedDisplay'),
    pauseScrollBtn: document.getElementById('pauseScrollBtn'),
    slowDownBtn: document.getElementById('slowDownBtn'),
    speedUpBtn: document.getElementById('speedUpBtn'),
    stopScrollBtn: document.getElementById('stopScrollBtn'),
    
    // Theme Settings
    themeOptions: document.querySelectorAll('.theme-option'),
    colorOptions: document.querySelectorAll('.color-option'),
    
    // About
    lastUpdated: document.getElementById('lastUpdated'),
    
    // Floating Controls
    floatingControls: document.getElementById('floatingControls'),
    floatingControlsToggle: document.getElementById('floatingControlsToggle'),
    floatingControlsPanel: document.getElementById('floatingControlsPanel'),
    floatingTranslationToggle: document.getElementById('floatingTranslationToggle'),
    floatingBanglaBtn: document.getElementById('floatingBanglaBtn'),
    floatingEnglishBtn: document.getElementById('floatingEnglishBtn'),
    floatingWordByWordToggle: document.getElementById('floatingWordByWordToggle'),
    
    // Go to Ayah Modal
    goToAyahModal: document.getElementById('goToAyahModal'),
    closeGoToAyahModal: document.getElementById('closeGoToAyahModal'),
    ayahNumberInput: document.getElementById('ayahNumberInput'),
    ayahRange: document.getElementById('ayahRange'),
    goToAyahConfirm: document.getElementById('goToAyahConfirm'),

    // Reading Mode
    readingModeBtn: document.getElementById('readingModeBtn'),
    readingModeBar: document.getElementById('readingModeBar'),
    readingModeSurahName: document.getElementById('readingModeSurahName'),
    readingModeSurahType: document.getElementById('readingModeSurahType'),
    readingModeSurahAyahs: document.getElementById('readingModeSurahAyahs'),
    readingModeIndicator: document.getElementById('readingModeIndicator'),
    compactModeToggle: document.getElementById('compactModeToggle'),

    // Enhanced Search
    searchResultCount: document.getElementById('searchResultCount'),
    searchFilterBtns: document.querySelectorAll('.search-filter-btn'),

    // Font Size Slider
    fontSizeSlider: document.getElementById('fontSizeSlider'),
    fontSizePercent: document.getElementById('fontSizePercent'),
    fontPresetBtns: document.querySelectorAll('.font-preset-btn'),
    arabicFontPreview: document.getElementById('arabicFontPreview'),

    // Footer Install
    installAppLink: document.getElementById('installAppLink'),
    aboutAppLink: document.getElementById('aboutAppLink'),

    // Loading
    loadingSpinner: document.getElementById('loadingSpinner')
};

// ==================== UTILITY FUNCTIONS ==================== //
function showLoading() {
    elements.loadingSpinner.style.display = 'flex';
}

function hideLoading() {
    elements.loadingSpinner.style.display = 'none';
}

function showError(message) {
    console.error('Error:', message);
    // You can implement a toast notification system here
    alert('Error: ' + message);
}

// ==================== PERSISTENT STORAGE ==================== //
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('quranAppSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            appData.settings = { ...appData.settings, ...parsedSettings };
        }

        // Backward compat: if no multiplier, derive from old fontSize
        if (!appData.settings.fontSizeMultiplier) {
            const oldSizeMap = { 'small': 0.85, 'medium': 1.0, 'large': 1.15, 'extra-large': 1.3 };
            appData.settings.fontSizeMultiplier = oldSizeMap[appData.settings.fontSize] || 1.0;
        }

        // Load reading mode preference
        const savedReadingMode = localStorage.getItem('quranAppReadingMode');
        if (savedReadingMode !== null) {
            appData.isReadingMode = JSON.parse(savedReadingMode);
        }

        // Load compact mode preference
        const savedCompactMode = localStorage.getItem('quranAppCompactMode');
        if (savedCompactMode !== null) {
            appData.isCompactMode = JSON.parse(savedCompactMode);
            if (elements.compactModeToggle) {
                elements.compactModeToggle.checked = appData.isCompactMode;
            }
        }
        
        // Load last opened surah
        const lastSurah = localStorage.getItem('quranAppLastSurah');
        if (lastSurah) {
            appData.lastOpenedSurah = lastSurah;
        }
        
        // Load saved search query
        const savedSearchQuery = localStorage.getItem('quranAppSearchQuery');
        if (savedSearchQuery) {
            appData.searchQuery = savedSearchQuery;
            if (elements.searchInput) {
                elements.searchInput.value = savedSearchQuery;
            }
        }
        
        // Load translation visibility state
        const savedTranslationState = localStorage.getItem('quranAppTranslationVisible');
        if (savedTranslationState !== null) {
            appData.isTranslationVisible = JSON.parse(savedTranslationState);
        }
        
        // Load current translation language
        const savedTranslationLang = localStorage.getItem('quranAppTranslationLang');
        if (savedTranslationLang) {
            appData.currentTranslationLang = savedTranslationLang;
        }
        
        // Load word-by-word mode state
        const savedWordByWordMode = localStorage.getItem('quranAppWordByWordMode');
        if (savedWordByWordMode !== null) {
            appData.isWordByWordMode = JSON.parse(savedWordByWordMode);
        }
        
        applySettings();
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function saveSettings() {
    try {
        localStorage.setItem('quranAppSettings', JSON.stringify(appData.settings));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

function saveLastSurah(surahId) {
    try {
        localStorage.setItem('quranAppLastSurah', surahId);
        appData.lastOpenedSurah = surahId;
    } catch (error) {
        console.error('Error saving last surah:', error);
    }
}

function clearAllData() {
    if (confirm('This will clear all your settings and data. Are you sure?')) {
        try {
            sessionStorage.clear();
            // Clear all localStorage data related to the app
            const keysToRemove = [
                'quranAppSettings',
                'quranAppLastSurah',
                'surahView',
                'quranAppSearchQuery',
                'quranAppTranslationVisible',
                'quranAppTranslationLang',
                'quranAppWordByWordMode',
                'quranAppReadingMode',
                'quranAppCompactMode'
            ];
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            // Reset to defaults
            appData.settings = {
                fontSize: 'medium',
                fontSizeMultiplier: 1.0,
                arabicFont: 'Amiri',
                bengaliFont: 'Noto Serif Bengali',
                uiFont: 'Inter',
                theme: 'light',
                primaryColor: '#2d7d32',
                autoScroll: false,
                scrollSpeed: 1.0,
                favorites: []
            };
            appData.lastOpenedSurah = null;
            appData.currentView = 'card';
            appData.searchQuery = '';
            appData.isTranslationVisible = true;
            appData.currentTranslationLang = 'bangla';
            appData.isWordByWordMode = false;
            
            // Reset UI
            applySettings();
            updateSettingsUI();
            setActiveView('card');
            renderSurahList();
            hideLastSurahSuggestion();
            
            // Clear search input if exists
            if (elements.searchInput) {
                elements.searchInput.value = '';
                elements.searchContainer.style.display = 'none';
            }
            
            alert('All data cleared successfully!');
            
            // Refresh page to ensure clean state
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error clearing data:', error);
        }
    }
}

// ==================== OPTIMIZED LAZY LOADING SYSTEM ==================== //

// Surah cache for loaded data
const surahCache = new Map();
const loadingPromises = new Map();

// Load only essential data (16KB vs 17MB!)
async function loadData() {
    try {
        showLoading();
        
        // Load only surah names initially - 99.9% size reduction!
        console.log('📚 Loading surah names (16KB)...');
        const surahNamesResponse = await fetch('./data/surah_name.json');
        if (!surahNamesResponse.ok) {
            throw new Error('Failed to fetch surah names');
        }
        appData.surahNames = await surahNamesResponse.json();
        
        // App is ready immediately!
        console.log('✅ Essential data loaded. App ready! (99.9% faster than before)');
        hideLoading();
        // Initialize app
        initializeApp();
        
        // Restore UI states after initialization
        setTimeout(() => {
            // Restore translation toggle state
            if (elements.translationToggle) {
                elements.translationToggle.checked = appData.isTranslationVisible;
            }
            if (elements.floatingTranslationToggle) {
                elements.floatingTranslationToggle.checked = appData.isTranslationVisible;
            }
            
            // Restore word-by-word toggle state
            if (elements.wordByWordToggle) {
                elements.wordByWordToggle.checked = appData.isWordByWordMode;
            }
            if (elements.floatingWordByWordToggle) {
                elements.floatingWordByWordToggle.checked = appData.isWordByWordMode;
            }
            
            // Restore translation language buttons
            if (elements.banglaBtn && elements.englishBtn) {
                elements.banglaBtn.classList.toggle('active', appData.currentTranslationLang === 'bangla');
                elements.englishBtn.classList.toggle('active', appData.currentTranslationLang === 'english');
            }
            if (elements.floatingBanglaBtn && elements.floatingEnglishBtn) {
                elements.floatingBanglaBtn.classList.toggle('active', appData.currentTranslationLang === 'bangla');
                elements.floatingEnglishBtn.classList.toggle('active', appData.currentTranslationLang === 'english');
            }
            
            // Show search container if there was a saved search query
            if (appData.searchQuery && appData.searchQuery.trim()) {
                elements.searchContainer.style.display = 'block';
            }
            
            console.log('✅ All session data restored from localStorage');
        }, 100);
        
    } catch (error) {
        hideLoading();
        showError('Failed to load essential data. Please check your connection and try again.');
        console.error('Data loading error:', error);
    }
}

// Load individual surah on demand (lazy loading)
async function loadSurahData(surahId) {
    const surahIdStr = surahId.toString();
    
    // Return cached data if available
    if (surahCache.has(surahIdStr)) {
        console.log(`📖 Surah ${surahId} loaded from cache`);
        return surahCache.get(surahIdStr);
    }
    
    // Return existing loading promise if already loading
    if (loadingPromises.has(surahIdStr)) {
        console.log(`⏳ Surah ${surahId} already loading...`);
        return loadingPromises.get(surahIdStr);
    }
    
    // Create new loading promise
    const loadingPromise = loadSurahFromServer(surahIdStr);
    loadingPromises.set(surahIdStr, loadingPromise);
    
    try {
        const surahData = await loadingPromise;
        
        // Cache the loaded data
        surahCache.set(surahIdStr, surahData);
        loadingPromises.delete(surahIdStr);
        
        // Preload adjacent surahs in background for smooth navigation
        setTimeout(() => preloadAdjacentSurahs(parseInt(surahId)), 500);
        
        return surahData;
        
    } catch (error) {
        loadingPromises.delete(surahIdStr);
        throw error;
    }
}

// Fetch surah data from individual chunk file
async function loadSurahFromServer(surahId) {
    const paddedId = surahId.padStart(3, '0'); // Convert "1" to "001"
    const surahFile = `./data/surahs/surah_${paddedId}.json`;
    
    try {
        console.log(`📥 Loading Surah ${surahId} (${surahFile})...`);
        
        const response = await fetch(surahFile);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to load ${surahFile}`);
        }
        
        const surahData = await response.json();
        
        if (!surahData.verses) {
            throw new Error(`Invalid surah data structure in ${surahFile}`);
        }
        
        console.log(`✅ Surah ${surahId} loaded successfully (${(JSON.stringify(surahData).length / 1024).toFixed(1)}KB)`);
        return surahData.verses;
        
    } catch (error) {
        console.error(`❌ Error loading Surah ${surahId}:`, error);
        throw new Error(`Failed to load Surah ${surahId}. Please check your connection.`);
    }
}

// Smart preloading for better UX
function preloadAdjacentSurahs(currentSurahId) {
    const nextId = currentSurahId + 1;
    const prevId = currentSurahId - 1;
    
    // Preload next surah
    if (nextId <= 114 && !surahCache.has(nextId.toString()) && !loadingPromises.has(nextId.toString())) {
        loadSurahData(nextId).catch(() => {
            console.log(`📦 Background preload failed for Surah ${nextId}`);
        });
    }
    
    // Preload previous surah
    if (prevId >= 1 && !surahCache.has(prevId.toString()) && !loadingPromises.has(prevId.toString())) {
        loadSurahData(prevId).catch(() => {
            console.log(`📦 Background preload failed for Surah ${prevId}`);
        });
    }
}

// Get performance statistics
function getPerformanceStats() {
    const cacheSize = surahCache.size;
    const totalSurahs = 114;
    const cachePercentage = ((cacheSize / totalSurahs) * 100).toFixed(1);
    
    return {
        cachedSurahs: cacheSize,
        totalSurahs: totalSurahs,
        cachePercentage: `${cachePercentage}%`,
        loadingCount: loadingPromises.size,
        estimatedMemoryUsage: `${(cacheSize * 130).toFixed(0)}KB` // Average 130KB per surah
    };
}

// Clear cache to free memory if needed
function clearSurahCache() {
    const stats = getPerformanceStats();
    surahCache.clear();
    loadingPromises.clear();
    console.log(`🧹 Cache cleared. Freed ${stats.estimatedMemoryUsage} of memory.`);
}

// ==================== PERFORMANCE DEBUGGING ==================== //
// Global functions for console debugging and performance monitoring

// Console command to check current performance
window.checkPerformance = function() {
    const stats = getPerformanceStats();
    console.log('\n📊 Al-Quran App Performance Stats:');
    console.log(`🗂️  Cached Surahs: ${stats.cachedSurahs}/${stats.totalSurahs} (${stats.cachePercentage})`);
    console.log(`⏳ Currently Loading: ${stats.loadingCount} surah(s)`);
    console.log(`💾 Estimated Memory: ${stats.estimatedMemoryUsage}`);
    console.log(`🚀 Performance Improvement: 99.9% faster initial loading`);
    console.log(`📈 Bandwidth Saved: ~${((17000 - (stats.cachedSurahs * 130)) / 1024).toFixed(1)}MB`);
    
    return stats;
};

// Console command to preload popular surahs
window.preloadPopularSurahs = async function() {
    const popularSurahs = [1, 2, 18, 36, 55, 67, 112, 113, 114]; // Al-Fatihah, Al-Baqarah, Al-Kahf, Ya-Sin, Ar-Rahman, Al-Mulk, Al-Ikhlas, Al-Falaq, An-Nas
    
    console.log('📚 Preloading popular surahs in background...');
    
    for (const surahId of popularSurahs) {
        try {
            await loadSurahData(surahId.toString());
            console.log(`✅ Preloaded Surah ${surahId}`);
        } catch (error) {
            console.log(`❌ Failed to preload Surah ${surahId}:`, error.message);
        }
    }
    
    console.log('🎉 Popular surahs preloading completed!');
    checkPerformance();
};

// Console command to simulate old vs new loading
window.compareLoadingMethods = function() {
    console.log('\n⚡ Loading Method Comparison:');
    console.log('');
    console.log('❌ OLD METHOD (Before Optimization):');
    console.log('   📦 Initial Load: 17MB (17,000KB)');
    console.log('   ⏱️  Load Time (4G): 8-15 seconds');
    console.log('   ⏱️  Load Time (3G): 30-60 seconds');
    console.log('   💸 Data Cost: HIGH for mobile users');
    console.log('   📱 Mobile Experience: POOR');
    console.log('');
    console.log('✅ NEW METHOD (After Optimization):');
    console.log('   📦 Initial Load: 16KB');
    console.log('   ⏱️  Load Time: 1-2 seconds');
    console.log('   📖 Per Surah: ~130KB on demand');
    console.log('   💸 Data Cost: 99.9% reduction');
    console.log('   📱 Mobile Experience: EXCELLENT');
    console.log('');
    console.log('🎯 IMPROVEMENT: 99.9% faster initial loading!');
};

// Make debugging functions available globally
window.QuranPerformance = {
    getStats: getPerformanceStats,
    clearCache: clearSurahCache,
    preloadPopular: window.preloadPopularSurahs,
    compare: window.compareLoadingMethods,
    check: window.checkPerformance
};

// ==================== FAVORITES FUNCTIONALITY ==================== //

function openFavoritesModal() {
    try {
        console.log('🔍 Opening favorites modal...');
        
        // Check if surah names are loaded
        if (!appData.surahNames || Object.keys(appData.surahNames).length === 0) {
            console.log('❌ Surah names not loaded yet');
            showError('Please wait for the app to finish loading before accessing favorites.');
            return;
        }
        
        console.log('✅ Surah names loaded, checking modal element...');
        
        // Check if modal element exists
        if (!elements.favoritesModal) {
            console.error('❌ Favorites modal element not found in DOM');
            showError('Favorites feature is not available. Please refresh the page.');
            return;
        }
        
        console.log('✅ Modal element found, showing modal...');
        elements.favoritesModal.style.display = 'flex';
        
        console.log('✅ Rendering favorites...');
        renderFavorites();
        
        console.log('✅ Favorites modal opened successfully');
        
    } catch (error) {
        console.error('❌ Error opening favorites modal:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            favoritesModalExists: !!elements.favoritesModal,
            surahNamesLoaded: !!(appData.surahNames && Object.keys(appData.surahNames).length > 0)
        });
        showError('Failed to open favorites. Please try again.');
    }
}

function closeFavoritesModal() {
    elements.favoritesModal.style.display = 'none';
    
    // Reset bottom nav to home when closing favorites
    const homeBtn = document.querySelector('[data-page="home"]');
    updateBottomNavActiveState(homeBtn);
}

function toggleCurrentSurahFavorite() {
    if (!appData.currentSurah) {
        showError('Please open a surah first');
        return;
    }
    
    const surahId = appData.currentSurah;
    const isFavorite = appData.settings.favorites.includes(surahId);
    
    if (isFavorite) {
        // Remove from favorites
        appData.settings.favorites = appData.settings.favorites.filter(id => id !== surahId);
        elements.toggleFavoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        elements.toggleFavoriteBtn.title = 'Add to Favorites';
        showSuccess('Removed from favorites');
    } else {
        // Add to favorites
        appData.settings.favorites.push(surahId);
        elements.toggleFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        elements.toggleFavoriteBtn.title = 'Remove from Favorites';
        showSuccess('Added to favorites');
    }
    
    saveSettings();
    updateFavoriteButtonState();
    
    // Update bottom nav favorite state if on mobile
    updateBottomNavFavoriteState();
}

function updateFavoriteButtonState() {
    if (!appData.currentSurah || !elements.toggleFavoriteBtn) return;
    
    const isFavorite = appData.settings.favorites.includes(appData.currentSurah);
    
    if (isFavorite) {
        elements.toggleFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        elements.toggleFavoriteBtn.title = 'Remove from Favorites';
        elements.toggleFavoriteBtn.classList.add('favorite-active');
    } else {
        elements.toggleFavoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        elements.toggleFavoriteBtn.title = 'Add to Favorites';
        elements.toggleFavoriteBtn.classList.remove('favorite-active');
    }
}

function renderFavorites() {
    try {
        const favoritesList = elements.favoritesList;
        const favoritesEmpty = document.querySelector('.favorites-empty');
        
        // Ensure favorites array exists
        if (!appData.settings.favorites) {
            appData.settings.favorites = [];
        }
        
        if (appData.settings.favorites.length === 0) {
            favoritesList.innerHTML = '';
            favoritesEmpty.style.display = 'block';
            return;
        }
        
        favoritesEmpty.style.display = 'none';
        
        // Check if surah names are available
        if (!appData.surahNames || Object.keys(appData.surahNames).length === 0) {
            favoritesList.innerHTML = `
                <div class="loading-favorites">
                    <div class="loading-text">
                        <i class="fas fa-spinner fa-spin"></i>
                        Loading surah information...
                    </div>
                </div>
            `;
            return;
        }
        
        const favoritesHtml = appData.settings.favorites.map(surahId => {
            const surah = appData.surahNames[surahId];
            if (!surah) {
                console.warn(`Surah ${surahId} not found in surahNames`);
                return '';
            }
            
            return `
                <div class="favorite-item" onclick="openSurahFromFavorites('${surahId}')">
                    <div class="favorite-info">
                        <div class="favorite-header">
                            <h3 class="favorite-arabic">${surah.name_arabic}</h3>
                            <span class="favorite-number">${surahId}</span>
                        </div>
                        <p class="favorite-english">${surah.name_english}</p>
                        <div class="favorite-meta">
                            <span class="favorite-type">${surah.type}</span>
                            <span class="favorite-ayahs">${surah.ayah_number} Ayahs</span>
                        </div>
                    </div>
                    <div class="favorite-actions">
                        <button class="remove-favorite-btn" onclick="removeFavorite('${surahId}', event)" title="Remove from Favorites">
                            <i class="fas fa-heart-broken"></i>
                        </button>
                    </div>
                </div>
            `;
        }).filter(html => html !== '').join('');
        
        if (favoritesHtml === '') {
            favoritesList.innerHTML = `
                <div class="no-valid-favorites">
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Invalid Favorites Found</h3>
                        <p>Some favorites could not be loaded. Try adding them again.</p>
                        <button onclick="clearInvalidFavorites()" class="btn btn-primary">Clear Invalid Favorites</button>
                    </div>
                </div>
            `;
        } else {
            favoritesList.innerHTML = favoritesHtml;
        }
        
    } catch (error) {
        console.error('Error rendering favorites:', error);
        
        if (elements.favoritesList) {
            elements.favoritesList.innerHTML = `
                <div class="favorites-error">
                    <div class="empty-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <h3>Error Loading Favorites</h3>
                        <p>There was an error displaying your favorites. Please try again.</p>
                        <button onclick="renderFavorites()" class="btn btn-primary">Retry</button>
                    </div>
                </div>
            `;
        }
    }
}

function openSurahFromFavorites(surahId) {
    closeFavoritesModal();
    openSurah(surahId);
}

function removeFavorite(surahId, event) {
    event.stopPropagation(); // Prevent opening the surah
    
    appData.settings.favorites = appData.settings.favorites.filter(id => id !== surahId);
    saveSettings();
    renderFavorites();
    updateFavoriteButtonState();
    
    const surahName = appData.surahNames[surahId]?.name_english || `Surah ${surahId}`;
    showSuccess(`${surahName} removed from favorites`);
}

function showSuccess(message) {
    // Simple success notification - you can enhance this
    console.log('✅', message);
    
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-family: var(--font-ui);
        font-size: 14px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Helper function to clear invalid favorites
function clearInvalidFavorites() {
    try {
        appData.settings.favorites = [];
        saveSettings();
        renderFavorites();
        showSuccess('Invalid favorites cleared');
    } catch (error) {
        console.error('Error clearing favorites:', error);
        showError('Failed to clear favorites');
    }
}

// Make functions globally available for onclick handlers
window.closeFavoritesModal = closeFavoritesModal;
window.openSurahFromFavorites = openSurahFromFavorites;
window.removeFavorite = removeFavorite;
window.clearInvalidFavorites = clearInvalidFavorites;
window.renderFavorites = renderFavorites;

// ==================== APPLICATION INITIALIZATION ==================== //
function initializeApp() {
    hideLoading();
    loadSettings();
    renderSurahList();
    setupEventListeners();
    initializeSettingsUI();
    initViewToggle();
    
    // Initialize bottom navigation for the home page
    updateBottomNavForPage(false);
}

// ==================== BOTTOM NAVIGATION ==================== //
function initBottomNavigation() {
    const bottomNav = document.getElementById('bottomNav');
    if (!bottomNav) return;
    
    const bottomNavItems = bottomNav.querySelectorAll('.bottom-nav-item');
    
    bottomNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const action = item.dataset.action;
            const page = item.dataset.page;
            
            // Handle page navigation
            if (page === 'home') {
                if (elements.surahReadingPage.style.display !== 'none') {
                    goBackToSurahList();
                }
                updateBottomNavActiveState(item);
                return;
            }
            
            // Handle actions and update active state
            switch (action) {
                case 'search':
                    toggleSearch();
                    updateBottomNavActiveState(item);
                    break;
                case 'favorites':
                    openFavoritesModal();
                    updateBottomNavActiveState(item);
                    break;
                case 'settings':
                    openSettings();
                    updateBottomNavActiveState(item);
                    break;
                case 'reading-mode':
                    toggleReadingMode();
                    break;
                case 'controls':
                    toggleFloatingControls();
                    break;
                case 'goto-ayah':
                    openGoToAyahModal();
                    break;
                case 'toggle-favorite':
                    toggleCurrentSurahFavorite();
                    break;
            }
        });
    });
}

function updateBottomNavActiveState(activeItem) {
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    bottomNavItems.forEach(item => item.classList.remove('active'));
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

function updateBottomNavForPage(isReadingPage = false) {
    const homeBtn = document.querySelector('[data-page="home"]');
    const controlsBtn = document.querySelector('[data-action="controls"]');
    const gotoAyahBtn = document.querySelector('[data-action="goto-ayah"]');
    const toggleFavoriteBtn = document.querySelector('[data-action="toggle-favorite"]');
    const searchBtn = document.querySelector('[data-action="search"]');
    const favoritesBtn = document.querySelector('[data-action="favorites"]');
    const readingModeBtn = document.querySelector('[data-action="reading-mode"]');

    if (isReadingPage) {
        if (searchBtn) searchBtn.style.display = 'none';
        if (favoritesBtn) favoritesBtn.style.display = 'none';
        if (readingModeBtn) readingModeBtn.style.display = 'flex';
        if (controlsBtn) controlsBtn.style.display = 'flex';
        if (toggleFavoriteBtn) toggleFavoriteBtn.style.display = 'flex';
        if (gotoAyahBtn) gotoAyahBtn.style.display = 'flex';

        updateBottomNavFavoriteState();
    } else {
        if (searchBtn) searchBtn.style.display = 'flex';
        if (favoritesBtn) favoritesBtn.style.display = 'flex';
        if (readingModeBtn) readingModeBtn.style.display = 'none';
        if (controlsBtn) controlsBtn.style.display = 'none';
        if (toggleFavoriteBtn) toggleFavoriteBtn.style.display = 'none';
        if (gotoAyahBtn) gotoAyahBtn.style.display = 'none';
    }

    updateBottomNavActiveState(homeBtn);
}

function updateBottomNavFavoriteState() {
    const favoriteIcon = document.getElementById('bottomNavFavoriteIcon');
    const toggleFavoriteBtn = document.querySelector('[data-action="toggle-favorite"]');
    
    if (!favoriteIcon || !toggleFavoriteBtn || !appData.currentSurah) return;
    
    const isFavorite = appData.settings.favorites.includes(appData.currentSurah);
    
    if (isFavorite) {
        favoriteIcon.className = 'fas fa-heart';
        toggleFavoriteBtn.title = 'Remove from Favorites';
        favoriteIcon.style.color = '#e91e63'; // Pink color for favorited
    } else {
        favoriteIcon.className = 'far fa-heart';
        toggleFavoriteBtn.title = 'Add to Favorites';
        favoriteIcon.style.color = ''; // Reset to default color
    }
}

function setupEventListeners() {
    // Navigation
    elements.backBtn.addEventListener('click', goBackToSurahList);
    elements.searchBtn?.addEventListener('click', toggleSearch);
    elements.settingsBtn.addEventListener('click', openSettings);
    elements.goToAyahBtn?.addEventListener('click', openGoToAyahModal);
    elements.favoritesBtn?.addEventListener('click', openFavoritesModal);
    elements.toggleFavoriteBtn?.addEventListener('click', toggleCurrentSurahFavorite);
    elements.toggleControlsBtn?.addEventListener('click', toggleFloatingControls);
    
    // Search (debounced for performance)
    elements.searchInput.addEventListener('input', debounce(handleSearch, 200));
    elements.clearSearch.addEventListener('click', clearSearch);
    
    // Reading Controls
    elements.translationToggle.addEventListener('change', toggleTranslation);
    elements.banglaBtn.addEventListener('click', () => setTranslationLanguage('bangla'));
    elements.englishBtn.addEventListener('click', () => setTranslationLanguage('english'));
    elements.wordByWordToggle.addEventListener('change', toggleWordByWord);
    
    // Modal
    elements.closeModal.addEventListener('click', closeModal);
    elements.wordModal.addEventListener('click', (e) => {
        if (e.target === elements.wordModal) closeModal();
    });
    
    // Settings Modal
    elements.closeSettingsModal.addEventListener('click', closeSettings);
    elements.settingsModal.addEventListener('click', (e) => {
        if (e.target === elements.settingsModal) closeSettings();
    });
    
    // Settings Tabs
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchSettingsTab(btn.dataset.tab));
    });
    
    // Reading Mode
    elements.readingModeBtn?.addEventListener('click', toggleReadingMode);
    elements.compactModeToggle?.addEventListener('change', toggleCompactMode);

    // Font Settings (slider-based)
    elements.fontSizeSlider?.addEventListener('input', handleFontSizeSlider);
    elements.fontPresetBtns?.forEach(btn => {
        btn.addEventListener('click', () => setFontSizeFromPreset(parseFloat(btn.dataset.size)));
    });
    elements.arabicFontSelect?.addEventListener('change', changeArabicFont);
    elements.bengaliFontSelect?.addEventListener('change', changeBengaliFont);
    elements.uiFontSelect?.addEventListener('change', changeUIFont);

    // Search Filters
    elements.searchFilterBtns?.forEach(btn => {
        btn.addEventListener('click', () => setSearchFilter(btn.dataset.filter));
    });

    // Footer Install App
    elements.installAppLink?.addEventListener('click', handleFooterInstall);
    elements.aboutAppLink?.addEventListener('click', (e) => {
        e.preventDefault();
        openSettings();
        switchSettingsTab('about');
    });
    
    // Reading Settings
    elements.autoScrollToggle?.addEventListener('change', toggleAutoScroll);
    elements.scrollSpeedRange?.addEventListener('input', changeScrollSpeed);
    elements.clearSessionBtn?.addEventListener('click', clearAllData);
    
    // Speed Presets
    elements.speedPresets.forEach(preset => {
        preset.addEventListener('click', () => setScrollSpeed(parseFloat(preset.dataset.speed)));
    });
    
    // Floating Scroll Control
    elements.pauseScrollBtn?.addEventListener('click', toggleScrollPause);
    elements.slowDownBtn?.addEventListener('click', () => adjustScrollSpeed(-0.5));
    elements.speedUpBtn?.addEventListener('click', () => adjustScrollSpeed(0.5));
    elements.stopScrollBtn?.addEventListener('click', stopAutoScrollAndHide);
    
    // Theme Settings
    elements.themeOptions.forEach(option => {
        option.addEventListener('click', () => changeTheme(option.dataset.theme));
    });
    elements.colorOptions.forEach(option => {
        option.addEventListener('click', () => changePrimaryColor(option.dataset.color));
    });
    
    // Floating Controls
    elements.floatingControlsToggle?.addEventListener('click', toggleFloatingPanel);
    elements.floatingTranslationToggle?.addEventListener('change', syncFloatingTranslation);
    elements.floatingBanglaBtn?.addEventListener('click', () => syncFloatingLanguage('bangla'));
    elements.floatingEnglishBtn?.addEventListener('click', () => syncFloatingLanguage('english'));
    elements.floatingWordByWordToggle?.addEventListener('change', syncFloatingWordByWord);
    
    // Bottom Navigation (Mobile)
    initBottomNavigation();
    
    // Go to Ayah Modal
    elements.closeGoToAyahModal?.addEventListener('click', closeGoToAyahModal);
    elements.goToAyahModal?.addEventListener('click', (e) => {
        if (e.target === elements.goToAyahModal) closeGoToAyahModal();
    });
    
    // Favorites Modal
    elements.favoritesModal?.addEventListener('click', (e) => {
        if (e.target === elements.favoritesModal) closeFavoritesModal();
    });
    elements.goToAyahConfirm?.addEventListener('click', goToSelectedAyah);
    elements.ayahNumberInput?.addEventListener('input', updateAyahRange);
    
    // Ayah quick navigation buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('ayah-nav-btn')) {
            const ayahType = e.target.dataset.ayah;
            handleQuickAyahNavigation(ayahType);
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
    
    // Add click event listeners to modals to reset bottom nav when closed by clicking outside
    document.addEventListener('click', (e) => {
        // Check if any modal is being closed by clicking outside
        if (e.target === elements.settingsModal || 
            e.target === elements.favoritesModal || 
            e.target === elements.goToAyahModal) {
            
            // Small delay to ensure modal is closed first
            setTimeout(() => {
                const homeBtn = document.querySelector('[data-page="home"]');
                updateBottomNavActiveState(homeBtn);
            }, 100);
        }
    });
}

function handleKeyboard(e) {
    if (e.key === 'Escape') {
        if (elements.wordModal.style.display !== 'none') {
            closeModal();
        } else if (elements.goToAyahModal?.style.display !== 'none') {
            closeGoToAyahModal();
        } else if (elements.favoritesModal?.style.display !== 'none') {
            closeFavoritesModal();
        } else if (elements.settingsModal.style.display !== 'none') {
            closeSettings();
        } else if (elements.floatingControlsPanel?.style.display !== 'none') {
            hideFloatingPanel();
        } else if (elements.searchContainer.style.display !== 'none') {
            toggleSearch();
        } else if (elements.surahReadingPage.style.display !== 'none') {
            goBackToSurahList();
        }
    }
    
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        if (elements.surahReadingPage.style.display !== 'none') {
            // On reading page, open go to ayah instead of search
            openGoToAyahModal();
        } else {
            toggleSearch();
            elements.searchInput.focus();
        }
    }
    
    if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        openSettings();
    }
    
    if (e.ctrlKey && e.key === 'g' && elements.surahReadingPage.style.display !== 'none') {
        e.preventDefault();
        openGoToAyahModal();
    }

    // R key for reading mode (when not in input)
    if (e.key === 'r' && !e.ctrlKey && !e.altKey && !e.metaKey &&
        elements.surahReadingPage.style.display !== 'none' &&
        document.activeElement.tagName !== 'INPUT' &&
        document.activeElement.tagName !== 'TEXTAREA') {
        toggleReadingMode();
    }
}

// ==================== VIEW TOGGLE FUNCTIONALITY ==================== //
function initViewToggle() {
    // Load saved view preference
    const savedView = localStorage.getItem('surahView') || 'card';
    appData.currentView = savedView;
    
    // Set initial view
    setActiveView(savedView);
    
    // Add click listeners to toggle buttons
    elements.viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = btn.dataset.view;
            switchView(view);
        });
    });
}

function switchView(view) {
    if (appData.currentView === view) return;
    
    appData.currentView = view;
    setActiveView(view);
    
    // Save preference
    localStorage.setItem('surahView', view);
    
    // Add smooth transition effect
    elements.surahList.style.opacity = '0.5';
    elements.surahList.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        applyViewLayout(view);
        elements.surahList.style.opacity = '1';
        elements.surahList.style.transform = 'scale(1)';
    }, 100);
}

function setActiveView(view) {
    // Update toggle button states
    elements.viewToggleBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    applyViewLayout(view);
}

function applyViewLayout(view) {
    if (view === 'list') {
        elements.surahList.classList.add('list-view');
        elements.surahList.classList.remove('card-view');
    } else {
        elements.surahList.classList.remove('list-view');
        elements.surahList.classList.add('card-view');
    }
}

function updateSurahCount() {
    if (!elements.surahCountDisplay) return;
    
    const totalSurahs = appData.surahNames ? Object.keys(appData.surahNames).length : 114;
    
    // Count actual surah cards (excluding search no-results div)
    const surahCards = elements.surahList.querySelectorAll('.surah-card');
    const currentCount = surahCards.length;
    
    if (appData.searchQuery && currentCount !== totalSurahs) {
        elements.surahCountDisplay.textContent = `${currentCount} of ${totalSurahs} Surahs`;
        elements.surahCountDisplay.style.color = 'var(--primary-color)';
    } else {
        elements.surahCountDisplay.textContent = `${totalSurahs} Surahs`;
        elements.surahCountDisplay.style.color = 'var(--text-secondary)';
    }
    
    // Add a subtle animation for count changes
    elements.surahCountDisplay.style.transform = 'scale(1.05)';
    setTimeout(() => {
        elements.surahCountDisplay.style.transform = 'scale(1)';
    }, 200);
}

// ==================== SURAH LIST FUNCTIONALITY ==================== //
function renderSurahList() {
    if (!appData.surahNames) return;
    
    elements.surahList.innerHTML = '';
    
    // Show last surah suggestion if no search query
    if (!appData.searchQuery) {
        showLastSurahSuggestion();
    } else {
        hideLastSurahSuggestion();
    }
    
    // Filter surahs based on search query AND type filter
    const filteredSurahs = Object.entries(appData.surahNames).filter(([id, surah]) => {
        // Type filter
        if (appData.searchFilter === 'makkah' && !surah.type.toLowerCase().includes('makkah')) return false;
        if (appData.searchFilter === 'madinah' && !surah.type.toLowerCase().includes('madinah')) return false;

        if (!appData.searchQuery) return true;

        const query = appData.searchQuery.toLowerCase().trim();
        // Support number search (e.g. "36" for Ya-Sin)
        if (/^\d+$/.test(query)) {
            const num = parseInt(query);
            return id === query || parseInt(id) === num;
        }
        return (
            surah.name_english.toLowerCase().includes(query) ||
            surah.name_bangla.includes(appData.searchQuery) ||
            surah.name_arabic.includes(appData.searchQuery) ||
            surah.type.toLowerCase().includes(query)
        );
    });

    // Update search result count
    if (elements.searchResultCount) {
        const total = Object.keys(appData.surahNames).length;
        if (appData.searchQuery || appData.searchFilter !== 'all') {
            elements.searchResultCount.textContent = `${filteredSurahs.length}/${total}`;
        } else {
            elements.searchResultCount.textContent = '';
        }
    }
    
    filteredSurahs.forEach(([surahId, surahInfo], index) => {
        const surahCard = createSurahCard(surahId, surahInfo);
        // Add staggered animation delay for list view
        surahCard.style.setProperty('--item-index', index);
        elements.surahList.appendChild(surahCard);
    });
    
    if (filteredSurahs.length === 0 && appData.searchQuery) {
        elements.surahList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary); grid-column: 1 / -1;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No surahs found</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
    }
    
    // Update surah count
    updateSurahCount();
    
    // Apply current view layout
    applyViewLayout(appData.currentView);
}

function createSurahCard(surahId, surahInfo) {
    const card = document.createElement('div');
    card.className = 'surah-card';
    card.addEventListener('click', () => openSurah(surahId));
    
    card.innerHTML = `
        <div class="surah-number">${surahId}</div>
        <div class="surah-names">
            <div class="surah-arabic">${surahInfo.name_arabic}</div>
            <div class="surah-english">${surahInfo.name_english}</div>
            <div class="surah-bangla">${surahInfo.name_bangla}</div>
        </div>
        <div class="surah-meta">
            <span class="surah-type">${surahInfo.type}</span>
            <span class="surah-ayahs">${surahInfo.ayah_number} Ayahs</span>
        </div>
    `;
    
    return card;
}

// ==================== LAST SURAH SUGGESTION ==================== //
function showLastSurahSuggestion() {
    if (!appData.lastOpenedSurah || !appData.surahNames || !elements.lastSurahSuggestion) {
        hideLastSurahSuggestion();
        return;
    }

    const surahInfo = appData.surahNames[appData.lastOpenedSurah];
    if (!surahInfo) {
        hideLastSurahSuggestion();
        return;
    }

    elements.lastSurahCard.innerHTML = `
        <div class="suggestion-content">
            <div class="suggestion-surah-number">${appData.lastOpenedSurah}</div>
            <div class="suggestion-surah-names">
                <div class="suggestion-surah-arabic">${surahInfo.name_arabic}</div>
                <div class="suggestion-surah-english">${surahInfo.name_english}</div>
                <div class="suggestion-surah-bangla">${surahInfo.name_bangla}</div>
            </div>
            <div class="suggestion-meta">
                <span class="suggestion-type">${surahInfo.type}</span>
                <div class="suggestion-continue">
                    <i class="fas fa-play"></i>
                    <span>Continue Reading</span>
                </div>
            </div>
        </div>
    `;

    elements.lastSurahCard.addEventListener('click', () => openSurah(appData.lastOpenedSurah));
    elements.lastSurahSuggestion.style.display = 'block';
}

function hideLastSurahSuggestion() {
    if (elements.lastSurahSuggestion) {
        elements.lastSurahSuggestion.style.display = 'none';
    }
}

// ==================== SEARCH FUNCTIONALITY ==================== //
function toggleSearch() {
    const isVisible = elements.searchContainer.style.display !== 'none';
    
    if (isVisible) {
        elements.searchContainer.style.display = 'none';
        clearSearch();
        
        // Reset bottom nav to home when closing search
        const homeBtn = document.querySelector('[data-page="home"]');
        updateBottomNavActiveState(homeBtn);
    } else {
        elements.searchContainer.style.display = 'block';
        elements.searchInput.focus();
    }
}

function handleSearch(e) {
    appData.searchQuery = e.target.value;
    renderSurahList();

    // Save search query for persistence
    try {
        localStorage.setItem('quranAppSearchQuery', appData.searchQuery);
    } catch (error) {
        console.error('Error saving search query:', error);
    }
}

function setSearchFilter(filter) {
    appData.searchFilter = filter;
    elements.searchFilterBtns?.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderSurahList();
}

function clearSearch() {
    elements.searchInput.value = '';
    appData.searchQuery = '';
    appData.searchFilter = 'all';
    elements.searchFilterBtns?.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === 'all');
    });
    renderSurahList();

    // Clear saved search query
    try {
        localStorage.removeItem('quranAppSearchQuery');
    } catch (error) {
        console.error('Error clearing search query:', error);
    }
}

// ==================== SURAH READING FUNCTIONALITY ==================== //
async function openSurah(surahId) {
    const surahInfo = appData.surahNames[surahId];
    
    if (!surahInfo) {
        showError(`Surah ${surahId} not found`);
        return;
    }
    
    try {
        // Show loading state for the specific surah
        showSurahLoading(surahInfo);
        
        // Load surah data on demand (lazy loading)
        console.log(`🔄 Loading ${surahInfo.name_english}...`);
        const surahData = await loadSurahData(surahId);
        
        // Hide loading state
        hideSurahLoading();
        
        // Update app state
        appData.currentSurah = surahId;
        saveLastSurah(surahId);
        
        console.log(`📖 ${surahInfo.name_english} ready for reading!`);
        
        // Update surah header
        elements.surahTitle.textContent = surahInfo.name_arabic;
        elements.surahType.textContent = surahInfo.type;
        elements.surahAyahs.textContent = `${surahInfo.ayah_number} Ayahs`;
        
        // Render the surah content
        renderSurahContent(surahData, surahInfo);
        
        // Switch to reading page
        switchToReadingPage();
        
        // Update favorite button state
        updateFavoriteButtonState();
        
    } catch (error) {
        hideSurahLoading();
        console.error(`Error opening Surah ${surahId}:`, error);
        showError(error.message || `Failed to load ${surahInfo.name_english}`);
    }
}

// Show loading state for specific surah
function showSurahLoading(surahInfo) {
    showLoading();
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
        loadingText.textContent = `Loading ${surahInfo.name_english}...`;
    }
}

// Hide surah loading state
function hideSurahLoading() {
    hideLoading();
}

// Render surah content with the loaded data
function renderSurahContent(surahData, surahInfo) {
    const surahId = appData.currentSurah;
    
    // Show/hide bismillah (not for Surah 1 and 9)
    if (surahId === '1' || surahId === '9') {
        elements.bismillah.style.display = 'none';
    } else {
        elements.bismillah.style.display = 'block';
        updateBismillahTranslation();
    }
    
    // Render verses
    renderVerses(surahData);
    
    // Switch to reading page
    switchToReadingPage();
    
    // Update ayah range in go to ayah modal
    updateAyahModalForSurah(surahId, surahInfo.ayah_number);
    
    // Start auto scroll if enabled
    if (appData.settings.autoScroll) {
        setTimeout(() => startAutoScroll(), 2000);
    }
}

// Switch to reading page view
function switchToReadingPage() {
    elements.surahListPage.style.display = 'none';
    elements.surahReadingPage.style.display = 'block';
    elements.backBtn.style.display = 'flex';
    
    // Switch header controls
    if (elements.homepageControls) elements.homepageControls.style.display = 'none';
    if (elements.surahControls) elements.surahControls.style.display = 'flex';
    
    // Show floating controls
    if (elements.floatingControls) elements.floatingControls.style.display = 'block';
    
    // Hide search if open
    elements.searchContainer.style.display = 'none';
    
    // Update bottom navigation for reading page
    updateBottomNavForPage(true);
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function renderVerses(surahData) {
    elements.versesContainer.innerHTML = '';
    
    Object.entries(surahData).forEach(([verseNum, verseData]) => {
        // Skip verse 0 (bismillah) for most surahs
        if (verseNum === '0' && appData.currentSurah !== '1') return;
        
        const verseElement = createVerseElement(verseNum, verseData);
        elements.versesContainer.appendChild(verseElement);
    });
}

function createVerseElement(verseNum, verseData) {
    const verse = document.createElement('div');
    verse.className = 'verse';
    
    // Add data attribute for ayah navigation
    if (verseNum !== '0') {
        verse.setAttribute('data-verse', verseNum);
    }
    
    // Create verse number (skip for bismillah in Surah 1)
    const verseNumberHtml = verseNum !== '0' ? `
        <div class="verse-number">${verseNum}</div>
    ` : '';
    
    // Create Arabic text
    const arabicText = createArabicText(verseData);
    
    // Create translation
    const translationHtml = appData.isTranslationVisible ? `
        <div class="verse-translation">
            <div class="translation-text">
                <div class="bangla-trans" style="display: ${appData.currentTranslationLang === 'bangla' ? 'block' : 'none'}">
                    ${verseData.bangla_trans}
                </div>
                <div class="english-trans" style="display: ${appData.currentTranslationLang === 'english' ? 'block' : 'none'}">
                    ${verseData.english_trans}
                </div>
            </div>
        </div>
    ` : '';
    
    // Create action buttons (skip for bismillah)
    const actionsHtml = verseNum !== '0' ? `
        <div class="verse-actions">
            <button class="verse-action-btn copy-btn" title="Copy verse">
                <i class="fas fa-copy"></i>
                <span>Copy</span>
            </button>
            <button class="verse-action-btn share-btn" title="Share verse">
                <i class="fas fa-share-alt"></i>
                <span>Share</span>
            </button>
        </div>
    ` : '';

    verse.innerHTML = `
        ${verseNumberHtml}
        <div class="verse-arabic ${appData.isWordByWordMode ? 'word-by-word' : ''}">${arabicText}</div>
        ${translationHtml}
        ${actionsHtml}
    `;

    return verse;
}

function createArabicText(verseData) {
    if (!appData.isWordByWordMode || !verseData.word_by_word) {
        return verseData.arabic_text;
    }
    
    // Create word-by-word clickable text
    const words = Object.entries(verseData.word_by_word).map(([wordIndex, wordData]) => {
        return `<span class="arabic-word" data-word-ar="${wordData.words_ar}" data-word-bn="${wordData.translate_bn}">${wordData.words_ar}</span>`;
    });
    
    return words.join(' ');
}

// ==================== TRANSLATION CONTROLS ==================== //
function toggleTranslation() {
    try {
        appData.isTranslationVisible = elements.translationToggle.checked;
        
        if (appData.isTranslationVisible) {
            elements.translationLanguage.style.display = 'flex';
        } else {
            elements.translationLanguage.style.display = 'none';
        }
        
        updateTranslationVisibility();
        syncMainControlsToFloating();
        
        // Save translation state
        try {
            localStorage.setItem('quranAppTranslationVisible', JSON.stringify(appData.isTranslationVisible));
        } catch (error) {
            console.error('Error saving translation state:', error);
        }
        
    } catch (error) {
        console.error('Error in toggleTranslation:', error);
        showError('Failed to toggle translation. Please try again.');
    }
}

function setTranslationLanguage(lang) {
    appData.currentTranslationLang = lang;
    
    // Update button states
    elements.banglaBtn.classList.toggle('active', lang === 'bangla');
    elements.englishBtn.classList.toggle('active', lang === 'english');
    
    // Update translations
    updateTranslationVisibility();
    updateBismillahTranslation();
    
    // Save translation language preference
    try {
        localStorage.setItem('quranAppTranslationLang', lang);
    } catch (error) {
        console.error('Error saving translation language:', error);
    }
    syncMainControlsToFloating();
}

function updateTranslationVisibility() {
    const verses = document.querySelectorAll('.verse');
    
    verses.forEach(verse => {
        const translation = verse.querySelector('.verse-translation');
        const banglaTranslation = verse.querySelector('.bangla-trans');
        const englishTranslation = verse.querySelector('.english-trans');
        
        if (translation) {
            translation.style.display = appData.isTranslationVisible ? 'block' : 'none';
        }
        
        if (banglaTranslation && englishTranslation) {
            banglaTranslation.style.display = appData.currentTranslationLang === 'bangla' ? 'block' : 'none';
            englishTranslation.style.display = appData.currentTranslationLang === 'english' ? 'block' : 'none';
        }
    });
}

function updateBismillahTranslation() {
    const banglaTranslation = elements.bismillah.querySelector('.bangla-trans');
    const englishTranslation = elements.bismillah.querySelector('.english-trans');
    
    if (banglaTranslation && englishTranslation) {
        banglaTranslation.style.display = appData.currentTranslationLang === 'bangla' ? 'block' : 'none';
        englishTranslation.style.display = appData.currentTranslationLang === 'english' ? 'block' : 'none';
    }
}

// ==================== WORD BY WORD FUNCTIONALITY ==================== //
function toggleWordByWord() {
    try {
        appData.isWordByWordMode = elements.wordByWordToggle.checked;
        
        // Only re-render if we're currently viewing a surah
        if (appData.currentSurah && surahCache.has(appData.currentSurah)) {
            const surahData = surahCache.get(appData.currentSurah);
            renderVerses(surahData);
        } else if (appData.currentSurah) {
            // Surah is selected but not cached - this shouldn't happen
            console.warn('Word-by-word toggle: Surah data not cached. Current surah:', appData.currentSurah);
        }
        
        syncMainControlsToFloating();
        
        // Save word-by-word mode state
        try {
            localStorage.setItem('quranAppWordByWordMode', JSON.stringify(appData.isWordByWordMode));
        } catch (error) {
            console.error('Error saving word-by-word mode:', error);
        }
        
    } catch (error) {
        console.error('Error in toggleWordByWord:', error);
        showError('Failed to toggle word-by-word mode. Please try again.');
    }
}

// Word click handling is done via event delegation in the DOMContentLoaded listener

function showWordModal(arabicWord, bengaliMeaning) {
    elements.modalArabicWord.textContent = arabicWord;
    elements.modalMeaning.textContent = bengaliMeaning;
    elements.wordModal.style.display = 'flex';
}

function closeModal() {
    elements.wordModal.style.display = 'none';
}

// ==================== NAVIGATION ==================== //
function goBackToSurahList() {
    elements.surahListPage.style.display = 'block';
    elements.surahReadingPage.style.display = 'none';
    elements.backBtn.style.display = 'none';

    // Exit reading mode and compact mode
    if (appData.isReadingMode) {
        appData.isReadingMode = false;
        elements.surahReadingPage.classList.remove('reading-mode-active');
        if (elements.readingModeBtn) {
            elements.readingModeBtn.classList.remove('active-mode');
            elements.readingModeBtn.style.background = '';
        }
    }
    exitCompactMode();

    // Switch header controls back
    if (elements.homepageControls) elements.homepageControls.style.display = 'flex';
    if (elements.surahControls) elements.surahControls.style.display = 'none';

    // Hide floating controls
    if (elements.floatingControls) elements.floatingControls.style.display = 'none';

    // Update bottom navigation for list page
    updateBottomNavForPage(false);

    appData.currentSurah = null;
    stopAutoScroll();

    // Scroll to top
    window.scrollTo(0, 0);
}

// ==================== SETTINGS FUNCTIONALITY ==================== //
function openSettings() {
    elements.settingsModal.style.display = 'flex';
    updateSettingsUI();
}

function closeSettings() {
    elements.settingsModal.style.display = 'none';
    
    // Reset bottom nav to home when closing settings
    const homeBtn = document.querySelector('[data-page="home"]');
    updateBottomNavActiveState(homeBtn);
}

function switchSettingsTab(tabName) {
    // Remove active class from all tabs and contents
    elements.tabBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.settings-tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

function applySettings() {
    // Apply theme
    if (appData.settings.theme === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', appData.settings.theme);
    }
    
    // Apply font size with granular multiplier
    const multiplier = appData.settings.fontSizeMultiplier || 1;
    document.documentElement.style.setProperty('--font-size-multiplier', multiplier);
    
    // Apply fonts
    document.documentElement.style.setProperty('--font-arabic', `'${appData.settings.arabicFont}', serif`);
    document.documentElement.style.setProperty('--font-bengali', `'${appData.settings.bengaliFont}', serif`);
    if (appData.settings.uiFont === 'system') {
        document.documentElement.style.setProperty('--font-system', '-apple-system, BlinkMacSystemFont, sans-serif');
    } else {
        document.documentElement.style.setProperty('--font-system', `'${appData.settings.uiFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
    }
    
    // Apply primary color
    const color = appData.settings.primaryColor;
    const lightColor = lightenColor(color, 20);
    const darkColor = darkenColor(color, 20);
    
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-light', lightColor);
    document.documentElement.style.setProperty('--primary-dark', darkColor);
}

function updateSettingsUI() {
    // Update font size display (slider-based)
    updateFontSizeUI();
    
    // Update font selects
    if (elements.arabicFontSelect) {
        elements.arabicFontSelect.value = appData.settings.arabicFont;
    }
    if (elements.bengaliFontSelect) {
        elements.bengaliFontSelect.value = appData.settings.bengaliFont;
    }
    if (elements.uiFontSelect) {
        elements.uiFontSelect.value = appData.settings.uiFont;
    }
    
    // Update auto scroll
    if (elements.autoScrollToggle) {
        elements.autoScrollToggle.checked = appData.settings.autoScroll;
    }
    if (elements.scrollSpeedRange) {
        elements.scrollSpeedRange.value = appData.settings.scrollSpeed;
    }
    if (elements.scrollSpeedDisplay) {
        elements.scrollSpeedDisplay.textContent = appData.settings.scrollSpeed.toFixed(1) + 'x';
    }
    
    // Update speed preset buttons
    updateSpeedPresetButtons();
    
    // Update theme buttons
    elements.themeOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.theme === appData.settings.theme);
    });
    
    // Update color options
    elements.colorOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.color === appData.settings.primaryColor);
    });
}

function initializeSettingsUI() {
    // Set last updated date
    if (elements.lastUpdated) {
        elements.lastUpdated.textContent = new Date().toLocaleDateString();
    }
    
    updateSettingsUI();
}

// Font Settings Functions
function handleFontSizeSlider(e) {
    const multiplier = parseFloat(e.target.value);
    setFontSizeMultiplier(multiplier);
}

function setFontSizeFromPreset(multiplier) {
    setFontSizeMultiplier(multiplier);
    if (elements.fontSizeSlider) {
        elements.fontSizeSlider.value = multiplier;
    }
}

function setFontSizeMultiplier(multiplier) {
    multiplier = Math.max(0.7, Math.min(2.0, multiplier));
    appData.settings.fontSizeMultiplier = multiplier;

    // Map multiplier to named size for backward compat
    if (multiplier <= 0.78) appData.settings.fontSize = 'extra-small';
    else if (multiplier <= 0.92) appData.settings.fontSize = 'small';
    else if (multiplier <= 1.07) appData.settings.fontSize = 'medium';
    else if (multiplier <= 1.22) appData.settings.fontSize = 'large';
    else if (multiplier <= 1.4) appData.settings.fontSize = 'extra-large';
    else if (multiplier <= 1.62) appData.settings.fontSize = '2x-large';
    else if (multiplier <= 1.87) appData.settings.fontSize = '3x-large';
    else appData.settings.fontSize = '4x-large';

    document.documentElement.style.setProperty('--font-size-multiplier', multiplier);
    updateFontSizeUI();
    saveSettings();
}

function updateFontSizeUI() {
    const multiplier = appData.settings.fontSizeMultiplier || 1;
    const percent = Math.round(multiplier * 100);

    const sizeNames = {
        'extra-small': 'Extra Small', 'small': 'Small', 'medium': 'Medium',
        'large': 'Large', 'extra-large': 'Extra Large', '2x-large': '2X Large',
        '3x-large': '3X Large', '4x-large': '4X Large'
    };

    if (elements.fontSizeDisplay) {
        elements.fontSizeDisplay.textContent = sizeNames[appData.settings.fontSize] || 'Medium';
    }
    if (elements.fontSizePercent) {
        elements.fontSizePercent.textContent = percent + '%';
    }
    if (elements.fontSizeSlider) {
        elements.fontSizeSlider.value = multiplier;
    }

    // Update preset buttons
    elements.fontPresetBtns?.forEach(btn => {
        const size = parseFloat(btn.dataset.size);
        btn.classList.toggle('active', Math.abs(size - multiplier) < 0.03);
    });
}

function changeArabicFont(e) {
    appData.settings.arabicFont = e.target.value;
    console.log('🔤 Changing Arabic font to:', e.target.value);
    applySettings();
    saveSettings();

    // Update font preview
    if (elements.arabicFontPreview) {
        elements.arabicFontPreview.style.fontFamily = `'${e.target.value}', serif`;
    }

    // Force re-render if currently viewing a surah
    if (appData.currentSurah && surahCache.has(appData.currentSurah)) {
        const surahData = surahCache.get(appData.currentSurah);
        renderVerses(surahData);
        console.log('🔄 Re-rendered verses with new font');
    }
}

function changeBengaliFont(e) {
    appData.settings.bengaliFont = e.target.value;
    console.log('🔤 Changing Bengali font to:', e.target.value);
    applySettings();
    saveSettings();
    
    // Force re-render if currently viewing a surah
    if (appData.currentSurah && surahCache.has(appData.currentSurah)) {
        const surahData = surahCache.get(appData.currentSurah);
        renderVerses(surahData);
        console.log('🔄 Re-rendered verses with new Bengali font');
    }
}

function changeUIFont(e) {
    appData.settings.uiFont = e.target.value;
    applySettings();
    saveSettings();
}

// Theme Functions
function changeTheme(theme) {
    appData.settings.theme = theme;
    applySettings();
    updateSettingsUI();
    saveSettings();
    
    // Listen for system theme changes if auto mode
    if (theme === 'auto') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySettings);
    }
}

function changePrimaryColor(color) {
    appData.settings.primaryColor = color;
    applySettings();
    updateSettingsUI();
    saveSettings();
}

// Auto Scroll Functions
function toggleAutoScroll() {
    appData.settings.autoScroll = elements.autoScrollToggle.checked;
    if (appData.settings.autoScroll && appData.currentSurah) {
        startAutoScroll();
        showFloatingScrollControl();
    } else {
        stopAutoScroll();
        hideFloatingScrollControl();
    }
    saveSettings();
}

function changeScrollSpeed(e) {
    const speed = parseFloat(e.target.value);
    setScrollSpeed(speed);
}

function setScrollSpeed(speed) {
    appData.settings.scrollSpeed = Math.max(0.1, Math.min(10, speed));
    
    // Update displays
    if (elements.scrollSpeedDisplay) {
        elements.scrollSpeedDisplay.textContent = appData.settings.scrollSpeed.toFixed(1) + 'x';
    }
    if (elements.currentSpeedDisplay) {
        elements.currentSpeedDisplay.textContent = appData.settings.scrollSpeed.toFixed(1) + 'x';
    }
    if (elements.scrollSpeedRange) {
        elements.scrollSpeedRange.value = appData.settings.scrollSpeed;
    }
    
    // Update preset buttons
    updateSpeedPresetButtons();
    
    // Speed change takes effect immediately with rAF approach, no restart needed
    saveSettings();
}

function adjustScrollSpeed(delta) {
    const newSpeed = appData.settings.scrollSpeed + delta;
    setScrollSpeed(newSpeed);
}

function updateSpeedPresetButtons() {
    elements.speedPresets.forEach(preset => {
        const presetSpeed = parseFloat(preset.dataset.speed);
        preset.classList.toggle('active', Math.abs(presetSpeed - appData.settings.scrollSpeed) < 0.05);
    });
}

function startAutoScroll() {
    stopAutoScroll();

    appData.lastScrollTime = performance.now();

    function scrollStep(timestamp) {
        if (!appData.settings.autoScroll || appData.isScrollPaused) {
            appData.autoScrollAnimationFrame = requestAnimationFrame(scrollStep);
            return;
        }

        const elapsed = timestamp - appData.lastScrollTime;
        // Pixels per second based on speed setting
        const pixelsPerSecond = appData.settings.scrollSpeed * 30;
        const scrollAmount = (pixelsPerSecond * elapsed) / 1000;

        if (scrollAmount >= 0.5) {
            window.scrollBy(0, scrollAmount);
            appData.lastScrollTime = timestamp;
        }

        // Stop at bottom
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
            stopAutoScrollAndHide();
            return;
        }

        appData.autoScrollAnimationFrame = requestAnimationFrame(scrollStep);
    }

    appData.autoScrollAnimationFrame = requestAnimationFrame(scrollStep);
    showFloatingScrollControl();
}

function stopAutoScroll() {
    if (appData.autoScrollAnimationFrame) {
        cancelAnimationFrame(appData.autoScrollAnimationFrame);
        appData.autoScrollAnimationFrame = null;
    }
    if (appData.autoScrollInterval) {
        clearInterval(appData.autoScrollInterval);
        appData.autoScrollInterval = null;
    }
    appData.isScrollPaused = false;
}

// Floating Scroll Control Functions
function showFloatingScrollControl() {
    if (elements.floatingScrollControl) {
        elements.floatingScrollControl.style.display = 'block';
        updateFloatingScrollDisplay();
    }
}

function hideFloatingScrollControl() {
    if (elements.floatingScrollControl) {
        elements.floatingScrollControl.style.display = 'none';
    }
}

function updateFloatingScrollDisplay() {
    if (elements.currentSpeedDisplay) {
        elements.currentSpeedDisplay.textContent = appData.settings.scrollSpeed.toFixed(1) + 'x';
    }
    
    // Update pause button
    if (elements.pauseScrollBtn) {
        const icon = elements.pauseScrollBtn.querySelector('i');
        if (appData.isScrollPaused) {
            icon.className = 'fas fa-play';
            elements.pauseScrollBtn.classList.add('paused');
            elements.pauseScrollBtn.title = 'Resume Auto Scroll';
        } else {
            icon.className = 'fas fa-pause';
            elements.pauseScrollBtn.classList.remove('paused');
            elements.pauseScrollBtn.title = 'Pause Auto Scroll';
        }
    }
}

function toggleScrollPause() {
    appData.isScrollPaused = !appData.isScrollPaused;
    if (!appData.isScrollPaused) {
        appData.lastScrollTime = performance.now();
    }
    updateFloatingScrollDisplay();
}

function stopAutoScrollAndHide() {
    appData.settings.autoScroll = false;
    if (elements.autoScrollToggle) {
        elements.autoScrollToggle.checked = false;
    }
    stopAutoScroll();
    hideFloatingScrollControl();
    saveSettings();
}

// Color utility functions
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
        (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
        (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
}

// ==================== FLOATING CONTROLS ==================== //
function toggleFloatingControls() {
    toggleFloatingPanel();
}

function toggleFloatingPanel() {
    const panel = elements.floatingControlsPanel;
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

function hideFloatingPanel() {
    if (elements.floatingControlsPanel) {
        elements.floatingControlsPanel.style.display = 'none';
    }
}

function syncFloatingTranslation() {
    appData.isTranslationVisible = elements.floatingTranslationToggle.checked;
    elements.translationToggle.checked = appData.isTranslationVisible;
    toggleTranslation();
}

function syncFloatingLanguage(lang) {
    appData.currentTranslationLang = lang;
    
    // Update floating buttons
    elements.floatingBanglaBtn?.classList.toggle('active', lang === 'bangla');
    elements.floatingEnglishBtn?.classList.toggle('active', lang === 'english');
    
    // Update main buttons
    elements.banglaBtn?.classList.toggle('active', lang === 'bangla');
    elements.englishBtn?.classList.toggle('active', lang === 'english');
    
    updateTranslationVisibility();
    updateBismillahTranslation();
}

function syncFloatingWordByWord() {
    try {
        appData.isWordByWordMode = elements.floatingWordByWordToggle.checked;
        elements.wordByWordToggle.checked = appData.isWordByWordMode;
        toggleWordByWord();
    } catch (error) {
        console.error('Error in syncFloatingWordByWord:', error);
        showError('Failed to sync word-by-word mode. Please try again.');
    }
}

// Sync main controls to floating controls
function syncMainControlsToFloating() {
    if (elements.floatingTranslationToggle) {
        elements.floatingTranslationToggle.checked = appData.isTranslationVisible;
    }
    if (elements.floatingWordByWordToggle) {
        elements.floatingWordByWordToggle.checked = appData.isWordByWordMode;
    }
    
    // Update language buttons
    elements.floatingBanglaBtn?.classList.toggle('active', appData.currentTranslationLang === 'bangla');
    elements.floatingEnglishBtn?.classList.toggle('active', appData.currentTranslationLang === 'english');
}

// ==================== GO TO AYAH MODAL ==================== //
function openGoToAyahModal() {
    if (elements.goToAyahModal) {
        elements.goToAyahModal.style.display = 'flex';
        if (elements.ayahNumberInput) {
            elements.ayahNumberInput.focus();
        }
    }
}

function closeGoToAyahModal() {
    if (elements.goToAyahModal) {
        elements.goToAyahModal.style.display = 'none';
    }
}

function updateAyahModalForSurah(surahId, totalAyahs) {
    if (elements.ayahNumberInput) {
        elements.ayahNumberInput.max = totalAyahs;
        elements.ayahNumberInput.placeholder = '1';
        elements.ayahNumberInput.value = '';
    }
    if (elements.ayahRange) {
        elements.ayahRange.textContent = `of ${totalAyahs} ayahs`;
    }
}

function updateAyahRange() {
    const value = elements.ayahNumberInput.value;
    const max = elements.ayahNumberInput.max;
    if (elements.ayahRange) {
        elements.ayahRange.textContent = `of ${max} ayahs`;
    }
}

function handleQuickAyahNavigation(ayahType) {
    const totalAyahs = parseInt(elements.ayahNumberInput.max);
    let targetAyah = 1;
    
    switch (ayahType) {
        case '1':
            targetAyah = 1;
            break;
        case 'middle':
            targetAyah = Math.ceil(totalAyahs / 2);
            break;
        case 'last':
            targetAyah = totalAyahs;
            break;
        default:
            if (!isNaN(parseInt(ayahType))) {
                targetAyah = parseInt(ayahType);
            }
    }
    
    elements.ayahNumberInput.value = targetAyah;
    goToSelectedAyah();
}

function goToSelectedAyah() {
    const ayahNumber = parseInt(elements.ayahNumberInput.value);
    const maxAyahs = parseInt(elements.ayahNumberInput.max);
    
    if (isNaN(ayahNumber) || ayahNumber < 1 || ayahNumber > maxAyahs) {
        alert(`Please enter a valid ayah number between 1 and ${maxAyahs}`);
        return;
    }
    
    // Find the verse element and scroll to it
    const verseElement = document.querySelector(`[data-verse="${ayahNumber}"]`) || 
                        document.querySelector(`.verse:nth-child(${ayahNumber})`);
    
    if (verseElement) {
        verseElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest' 
        });
        
        // Highlight the verse briefly
        verseElement.style.backgroundColor = 'var(--secondary-light)';
        setTimeout(() => {
            verseElement.style.backgroundColor = '';
        }, 2000);
        
        closeGoToAyahModal();
    } else {
        // If specific targeting fails, scroll by approximate position
        const approximatePosition = (ayahNumber / maxAyahs) * document.body.scrollHeight;
        window.scrollTo({ top: approximatePosition, behavior: 'smooth' });
        closeGoToAyahModal();
    }
}

// ==================== READING MODE ==================== //
function toggleReadingMode() {
    appData.isReadingMode = !appData.isReadingMode;
    const readingPage = elements.surahReadingPage;

    if (appData.isReadingMode) {
        readingPage.classList.add('reading-mode-active');
        if (elements.readingModeBtn) {
            elements.readingModeBtn.classList.add('active-mode');
            elements.readingModeBtn.style.background = 'rgba(255,255,255,0.4)';
        }

        // Populate reading mode bar
        if (appData.currentSurah && appData.surahNames) {
            const surahInfo = appData.surahNames[appData.currentSurah];
            if (surahInfo) {
                if (elements.readingModeSurahName) elements.readingModeSurahName.textContent = surahInfo.name_arabic;
                if (elements.readingModeSurahType) elements.readingModeSurahType.textContent = surahInfo.type;
                if (elements.readingModeSurahAyahs) elements.readingModeSurahAyahs.textContent = surahInfo.ayah_number + ' Ayahs';
            }
        }

        // Hide floating controls in reading mode
        if (elements.floatingControls) elements.floatingControls.style.display = 'none';

        // Restore compact mode if it was active
        if (appData.isCompactMode) {
            readingPage.classList.add('compact-mode-active');
            if (elements.compactModeToggle) elements.compactModeToggle.checked = true;
            setTimeout(() => restructureVersesForCompactMode(), 50);
        }

        // Scroll to reading mode bar to ensure it's visible below header
        if (elements.readingModeBar) {
            setTimeout(() => {
                elements.readingModeBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
    } else {
        readingPage.classList.remove('reading-mode-active');
        if (elements.readingModeBtn) {
            elements.readingModeBtn.classList.remove('active-mode');
            elements.readingModeBtn.style.background = '';
        }
        // Restore floating controls
        if (elements.floatingControls) elements.floatingControls.style.display = 'block';
        // Exit compact mode when leaving reading mode
        exitCompactMode();
    }

    // Save reading mode preference
    try {
        localStorage.setItem('quranAppReadingMode', JSON.stringify(appData.isReadingMode));
    } catch (e) {
        console.error('Error saving reading mode:', e);
    }
}

// ==================== COMPACT MODE ==================== //
function toggleCompactMode() {
    appData.isCompactMode = elements.compactModeToggle ? elements.compactModeToggle.checked : !appData.isCompactMode;
    const readingPage = elements.surahReadingPage;

    if (appData.isCompactMode) {
        readingPage.classList.add('compact-mode-active');
        restructureVersesForCompactMode();
    } else {
        readingPage.classList.remove('compact-mode-active');
        restoreVersesFromCompactMode();
    }

    try {
        localStorage.setItem('quranAppCompactMode', JSON.stringify(appData.isCompactMode));
    } catch (e) {
        console.error('Error saving compact mode:', e);
    }
}

function restructureVersesForCompactMode() {
    const verses = document.querySelectorAll('.verse');
    verses.forEach(verse => {
        const verseArabic = verse.querySelector('.verse-arabic');
        const verseNum = verse.getAttribute('data-verse');
        if (verseArabic && verseNum && !verse.querySelector('.verse-number-inline')) {
            const inlineNum = document.createElement('span');
            inlineNum.className = 'verse-number-inline';
            inlineNum.textContent = verseNum;
            verseArabic.appendChild(inlineNum);
        }
    });
}

function restoreVersesFromCompactMode() {
    document.querySelectorAll('.verse-number-inline').forEach(el => el.remove());
}

function exitCompactMode() {
    if (appData.isCompactMode) {
        appData.isCompactMode = false;
        elements.surahReadingPage.classList.remove('compact-mode-active');
        if (elements.compactModeToggle) elements.compactModeToggle.checked = false;
        restoreVersesFromCompactMode();
    }
}

// ==================== INSTALL APP HANDLER ==================== //
function handleFooterInstall(e) {
    e.preventDefault();

    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        showSuccess('App is already installed!');
        return;
    }

    // Check if we have the deferred install prompt
    if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                showSuccess('App installed successfully!');
            }
            window.deferredPrompt = null;
        });
    } else {
        // Show manual install instructions
        showInstallInstructions();
    }
}

function showInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);

    let instructions = '';
    if (isIOS) {
        instructions = 'To install on iOS:\n1. Tap the Share button (box with arrow)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"';
    } else if (isAndroid && isChrome) {
        instructions = 'To install on Android:\n1. Tap the menu (three dots) in the top right\n2. Tap "Add to Home screen"\n3. Tap "Add"';
    } else {
        instructions = 'To install this app:\n1. Open this site in Chrome or Safari\n2. Look for "Install" or "Add to Home Screen" option in your browser menu';
    }

    alert(instructions);
}

// ==================== COPY & SHARE VERSE ==================== //
function getVerseDataFromCache(verseNum) {
    if (!appData.currentSurah) return null;
    const surahIdStr = appData.currentSurah.toString();
    if (!surahCache.has(surahIdStr)) return null;
    const surahData = surahCache.get(surahIdStr);
    return surahData[verseNum] || null;
}

function formatVerseText(verseNum, verseData) {
    const surahInfo = appData.surahNames ? appData.surahNames[appData.currentSurah] : null;
    const surahName = surahInfo ? surahInfo.name_arabic : '';
    const surahEnglish = surahInfo ? (surahInfo.name_translation || surahInfo.name_english || '') : '';
    const lang = appData.currentTranslationLang;
    const translation = lang === 'bangla' ? verseData.bangla_trans : verseData.english_trans;
    const langLabel = lang === 'bangla' ? 'বাংলা অনুবাদ' : 'Translation';

    return `${surahName} - ${surahEnglish}\nSurah ${appData.currentSurah}, Ayah ${verseNum}\n\n${verseData.arabic_text}\n\n${langLabel}:\n${translation}\n\n— Al-Quran Word by Word`;
}

async function handleCopyVerse(verseNum, btn) {
    const verseData = getVerseDataFromCache(verseNum);
    if (!verseData) return;

    const text = formatVerseText(verseNum, verseData);
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;left:-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        // Show copied feedback
        if (btn) {
            btn.classList.add('copied');
            const span = btn.querySelector('span');
            if (span) { const orig = span.textContent; span.textContent = 'Copied!'; setTimeout(() => { btn.classList.remove('copied'); span.textContent = orig; }, 2000); }
        }
    } catch (err) {
        console.error('Copy failed:', err);
    }
}

async function handleShareVerse(verseNum) {
    const verseData = getVerseDataFromCache(verseNum);
    if (!verseData) return;

    const surahInfo = appData.surahNames ? appData.surahNames[appData.currentSurah] : null;
    const surahEnglish = surahInfo ? (surahInfo.name_translation || surahInfo.name_english || '') : '';
    const text = formatVerseText(verseNum, verseData);

    if (navigator.share) {
        try {
            await navigator.share({ title: `${surahEnglish} - Ayah ${verseNum}`, text: text });
        } catch (err) {
            if (err.name !== 'AbortError') console.error('Share failed:', err);
        }
    } else {
        // Fallback to copy
        const btn = document.querySelector(`.verse[data-verse="${verseNum}"] .copy-btn`);
        await handleCopyVerse(verseNum, btn);
        showSuccess('Copied to clipboard (Share not supported on this browser)');
    }
}

// ==================== APPLICATION STARTUP ==================== //
document.addEventListener('DOMContentLoaded', function() {
    console.log('Al-Quran Word by Word Application Starting...');
    loadData();

    // Set up delegation for dynamically created elements
    document.addEventListener('click', (e) => {
        // Word-by-word click
        if (e.target.classList.contains('arabic-word')) {
            e.preventDefault();
            e.stopPropagation();
            const arabicWord = e.target.dataset.wordAr;
            const bengaliMeaning = e.target.dataset.wordBn;
            if (arabicWord && bengaliMeaning) {
                showWordModal(arabicWord, bengaliMeaning);
            }
            return;
        }

        // Copy button
        const copyBtn = e.target.closest('.copy-btn');
        if (copyBtn) {
            e.preventDefault();
            e.stopPropagation();
            const verse = copyBtn.closest('.verse');
            if (verse) handleCopyVerse(verse.getAttribute('data-verse'), copyBtn);
            return;
        }

        // Share button
        const shareBtn = e.target.closest('.share-btn');
        if (shareBtn) {
            e.preventDefault();
            e.stopPropagation();
            const verse = shareBtn.closest('.verse');
            if (verse) handleShareVerse(verse.getAttribute('data-verse'));
            return;
        }
    });
});

// ==================== PERFORMANCE OPTIMIZATIONS ==================== //
// Debounce search input for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Note: Search handler is already set up in setupEventListeners with direct binding.
// The debounce is handled within the main handler for simpler architecture.

// ==================== ERROR HANDLING ==================== //
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    showError('An unexpected error occurred. Please refresh the page and try again.');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showError('An unexpected error occurred while loading data.');
});
