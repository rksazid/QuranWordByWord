/**
 * Migration Patch for Enhanced Data Loading
 * Add this to the beginning of your script.js file, or run it before your main application starts
 */

// Initialize enhanced data loader
let enhancedLoader;

// Initialize compression system
function initializeCompression() {
    try {
        enhancedLoader = new EnhancedDataLoader();
        enhancedLoader.init();
        console.log('✅ Enhanced compression system initialized');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize compression system:', error);
        return false;
    }
}

// Enhanced loadInitialData function
async function loadInitialData() {
    try {
        showLoading();
        
        // Initialize compression if not already done
        if (!enhancedLoader) {
            initializeCompression();
        }
        
        console.log('📚 Loading surah names with compression...');
        
        // Use enhanced loader for surah names
        if (enhancedLoader) {
            appData.surahNames = await enhancedLoader.loadSurahNames();
        } else {
            // Fallback to original method
            const surahNamesResponse = await fetch('./data/surah_name.json');
            if (!surahNamesResponse.ok) {
                throw new Error('Failed to fetch surah names');
            }
            appData.surahNames = await surahNamesResponse.json();
        }
        
        console.log('✅ Surah names loaded successfully');
        
        // Render surah list
        renderSurahList();
        
        // Load last read surah
        const lastReadSurah = parseInt(localStorage.getItem('lastReadSurah')) || 1;
        showLastSurahSuggestion(lastReadSurah);
        
        // Start background preloading of popular surahs
        setTimeout(() => {
            if (enhancedLoader) {
                preloadPopularSurahsEnhanced();
            } else {
                preloadPopularSurahs();
            }
        }, 1000);
        
        hideLoading();
        
    } catch (error) {
        hideLoading();
        showToast('Failed to load data. Please check your connection.', 'error');
        console.error('Data loading error:', error);
    }
}

// Enhanced loadSurahData function
async function loadSurahData(surahId) {
    const surahIdStr = surahId.toString();
    
    // Return cached data if available (check both old and new cache)
    if (surahCache.has(surahIdStr)) {
        console.log(`📖 Surah ${surahId} loaded from memory cache`);
        return surahCache.get(surahIdStr);
    }
    
    // Check if already loading
    if (loadingPromises.has(surahIdStr)) {
        return loadingPromises.get(surahIdStr);
    }
    
    // Create loading promise
    const loadingPromise = (async () => {
        try {
            let surahData;
            
            // Use enhanced loader if available
            if (enhancedLoader) {
                surahData = await enhancedLoader.loadSurahData(surahId);
            } else {
                // Fallback to original method
                const surahFile = `surah_${surahIdStr.padStart(3, '0')}.json`;
                const response = await fetch(`./data/surahs/${surahFile}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: Failed to fetch surah ${surahId}`);
                }
                
                surahData = await response.json();
            }
            
            // Cache the loaded data
            surahCache.set(surahIdStr, surahData);
            
            // Start background preloading of adjacent surahs
            preloadAdjacentSurahs(parseInt(surahId));
            
            return surahData;
            
        } catch (error) {
            console.error(`❌ Failed to load Surah ${surahId}:`, error);
            throw error;
        } finally {
            // Remove from loading promises
            loadingPromises.delete(surahIdStr);
        }
    })();
    
    // Store the promise
    loadingPromises.set(surahIdStr, loadingPromise);
    
    return loadingPromise;
}

// Enhanced preloading function
async function preloadPopularSurahsEnhanced() {
    if (!enhancedLoader) {
        console.log('⚠️ Enhanced loader not available, using standard preloading');
        return preloadPopularSurahs();
    }
    
    const popularSurahs = [1, 2, 18, 36, 55, 67, 112, 113, 114];
    
    console.log('📚 Enhanced preloading of popular surahs...');
    
    try {
        await enhancedLoader.preloadSurahs(popularSurahs, {
            maxConcurrent: 2, // Reduced for mobile performance
            showProgress: true
        });
        
        // Store preloaded surahs in memory cache
        for (const surahId of popularSurahs) {
            try {
                const cacheKey = `surah_${surahId}_compressed`;
                const data = await enhancedLoader.compressor.retrieveCompressedData(cacheKey);
                if (data) {
                    surahCache.set(surahId.toString(), data);
                }
            } catch (error) {
                console.log(`⚠️ Could not cache Surah ${surahId} in memory:`, error.message);
            }
        }
        
        console.log('🎉 Enhanced preloading completed successfully');
        
    } catch (error) {
        console.error('❌ Enhanced preloading failed:', error);
        // Fallback to standard preloading
        preloadPopularSurahs();
    }
}

// Compression utilities for developers
window.compressionUtils = {
    // Test compression performance
    async testPerformance() {
        if (!enhancedLoader) {
            console.error('❌ Enhanced loader not initialized');
            return;
        }
        return await enhancedLoader.testPerformance();
    },
    
    // Get cache statistics
    getCacheStats() {
        if (!enhancedLoader) {
            console.error('❌ Enhanced loader not initialized');
            return;
        }
        return enhancedLoader.getCacheStats();
    },
    
    // Clear compressed cache
    clearCache() {
        if (!enhancedLoader) {
            console.error('❌ Enhanced loader not initialized');
            return false;
        }
        return enhancedLoader.clearCache();
    },
    
    // Show compression stats
    showStats() {
        console.log('\n📊 COMPRESSION SYSTEM STATUS');
        console.log('═'.repeat(50));
        console.log(`Enhanced Loader: ${enhancedLoader ? '✅' : '❌'}`);
        console.log(`Pako Library: ${typeof pako !== 'undefined' ? '✅' : '❌'}`);
        console.log(`Compression Enabled: ${enhancedLoader?.useCompression ? '✅' : '❌'}`);
        
        if (enhancedLoader) {
            const stats = enhancedLoader.getCacheStats();
            console.log(`Cache Size: ${stats.size}`);
            console.log(`Cached Items: ${stats.count}`);
            console.log(`Cache Version: ${stats.version}`);
        }
        
        console.log('═'.repeat(50));
        console.log('💡 Available commands:');
        console.log('  compressionUtils.testPerformance() - Test loading speed');
        console.log('  compressionUtils.getCacheStats() - Get cache information');
        console.log('  compressionUtils.clearCache() - Clear compressed cache');
    }
};

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeCompression();
    
    // Show compression status in console
    setTimeout(() => {
        window.compressionUtils.showStats();
    }, 2000);
});

// Override original functions if they exist
if (typeof window.loadInitialData === 'function') {
    window.originalLoadInitialData = window.loadInitialData;
    window.loadInitialData = loadInitialData;
}

if (typeof window.loadSurahData === 'function') {
    window.originalLoadSurahData = window.loadSurahData;
    window.loadSurahData = loadSurahData;
}

console.log('🔧 Migration patch loaded - Enhanced compression system ready!');
