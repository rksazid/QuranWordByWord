/**
 * Enhanced Data Loader with Compression Support
 * Integrates with existing Quran Word by Word application
 */

class EnhancedDataLoader {
    constructor() {
        this.compressor = new DataCompressor();
        this.useCompression = true;
        this.compressionSupported = typeof pako !== 'undefined';
        this.cacheVersion = 'v2.0-compressed';
        this.loadingStats = {
            originalSize: 0,
            compressedSize: 0,
            timesSaved: 0
        };
    }

    /**
     * Initialize the enhanced loader
     */
    init() {
        // Check if compression is available
        if (!this.compressionSupported) {
            console.warn('⚠️ Pako compression library not found. Falling back to uncompressed data.');
            this.useCompression = false;
        } else {
            console.log('✅ Compression support enabled');
        }

        // Clear old cache if version changed
        this.clearOldCache();
    }

    /**
     * Clear old cache versions
     */
    clearOldCache() {
        try {
            const currentVersion = localStorage.getItem('cacheVersion');
            if (currentVersion !== this.cacheVersion) {
                console.log('🗑️ Clearing old cache...');
                
                // Clear old surah cache
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (key.startsWith('surah_') || key.startsWith('quran_'))) {
                        localStorage.removeItem(key);
                    }
                }
                
                localStorage.setItem('cacheVersion', this.cacheVersion);
                console.log('✅ Cache cleared and version updated');
            }
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    /**
     * Enhanced surah names loader with compression
     */
    async loadSurahNames() {
        const cacheKey = 'surah_names_compressed';
        
        try {
            // Try to load from compressed cache first
            console.log('📚 Loading surah names...');
            let surahNames = await this.compressor.retrieveCompressedData(cacheKey);
            
            if (surahNames) {
                console.log('✅ Surah names loaded from compressed cache');
                return surahNames;
            }

            // If not in cache, fetch from server
            console.log('🌐 Fetching surah names from server...');
            const startTime = performance.now();
            
            // Try compressed version first, fallback to original
            let response;
            let isCompressed = false;
            
            if (this.useCompression) {
                try {
                    response = await fetch('./data-compressed/surah_name.json.gz');
                    if (response.ok) {
                        isCompressed = true;
                        console.log('📦 Loading compressed surah names');
                    }
                } catch (error) {
                    console.log('🔄 Compressed version not available, trying original...');
                }
            }
            
            if (!response || !response.ok) {
                response = await fetch('./data/surah_name.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch surah names');
                }
            }

            let data;
            if (isCompressed) {
                // Handle compressed data
                const compressedData = await response.arrayBuffer();
                const decompressed = pako.ungzip(compressedData, { to: 'string' });
                data = JSON.parse(decompressed);
                
                // Restore optimized structure if needed
                if (data['1'] && data['1'].ar) {
                    data = this.restoreSurahNamesStructure(data);
                }
            } else {
                data = await response.json();
            }

            const loadTime = performance.now() - startTime;
            console.log(`⚡ Surah names loaded in ${loadTime.toFixed(2)}ms`);

            // Store in compressed cache for next time
            await this.compressor.storeCompressedData(cacheKey, data);
            
            return data;

        } catch (error) {
            console.error('❌ Failed to load surah names:', error);
            throw error;
        }
    }

    /**
     * Enhanced surah data loader with compression
     */
    async loadSurahData(surahId) {
        const cacheKey = `surah_${surahId}_compressed`;
        
        try {
            // Try to load from compressed cache first
            let surahData = await this.compressor.retrieveCompressedData(cacheKey);
            
            if (surahData) {
                console.log(`✅ Surah ${surahId} loaded from compressed cache`);
                return surahData;
            }

            // If not in cache, fetch from server
            console.log(`🌐 Fetching Surah ${surahId} from server...`);
            const startTime = performance.now();
            
            const surahFile = `surah_${surahId.toString().padStart(3, '0')}.json`;
            let response;
            let isCompressed = false;
            
            if (this.useCompression) {
                try {
                    response = await fetch(`./data-compressed/surahs/${surahFile}.gz`);
                    if (response.ok) {
                        isCompressed = true;
                        console.log(`📦 Loading compressed Surah ${surahId}`);
                    }
                } catch (error) {
                    console.log(`🔄 Compressed version not available for Surah ${surahId}, trying original...`);
                }
            }
            
            if (!response || !response.ok) {
                response = await fetch(`./data/surahs/${surahFile}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch Surah ${surahId}`);
                }
            }

            let data;
            if (isCompressed) {
                // Handle compressed data
                const compressedData = await response.arrayBuffer();
                const decompressed = pako.ungzip(compressedData, { to: 'string' });
                data = JSON.parse(decompressed);
                
                // Restore optimized structure if needed
                if (data.id && data.v) {
                    data = this.compressor.restoreStructure(data);
                }
            } else {
                data = await response.json();
            }

            const loadTime = performance.now() - startTime;
            console.log(`⚡ Surah ${surahId} loaded in ${loadTime.toFixed(2)}ms`);

            // Update loading stats
            this.updateLoadingStats(response);

            // Store in compressed cache for next time
            await this.compressor.storeCompressedData(cacheKey, data);
            
            return data;

        } catch (error) {
            console.error(`❌ Failed to load Surah ${surahId}:`, error);
            throw error;
        }
    }

    /**
     * Preload multiple surahs with compression
     */
    async preloadSurahs(surahIds, options = {}) {
        const { maxConcurrent = 3, showProgress = true } = options;
        
        console.log(`📚 Preloading ${surahIds.length} surahs with compression...`);
        
        let loaded = 0;
        const total = surahIds.length;
        
        // Process in batches to avoid overwhelming the network
        for (let i = 0; i < surahIds.length; i += maxConcurrent) {
            const batch = surahIds.slice(i, i + maxConcurrent);
            
            await Promise.allSettled(
                batch.map(async (surahId) => {
                    try {
                        await this.loadSurahData(surahId);
                        loaded++;
                        
                        if (showProgress) {
                            console.log(`✅ Preloaded Surah ${surahId} (${loaded}/${total})`);
                        }
                    } catch (error) {
                        console.log(`❌ Failed to preload Surah ${surahId}:`, error.message);
                    }
                })
            );
        }
        
        console.log(`🎉 Preloading completed: ${loaded}/${total} surahs loaded`);
        this.printLoadingStats();
    }

    /**
     * Restore optimized surah names structure
     */
    restoreSurahNamesStructure(optimizedData) {
        const restored = {};
        for (const [key, data] of Object.entries(optimizedData)) {
            restored[key] = {
                name_arabic: data.ar,
                name_bangla: data.bn,
                name_english: data.en,
                type: data.t,
                ayah_number: data.n
            };
        }
        return restored;
    }

    /**
     * Update loading statistics
     */
    updateLoadingStats(response) {
        if (response.headers.get('content-length')) {
            this.loadingStats.compressedSize += parseInt(response.headers.get('content-length'));
            this.loadingStats.timesSaved++;
        }
    }

    /**
     * Print loading statistics
     */
    printLoadingStats() {
        if (this.loadingStats.timesSaved > 0) {
            console.log('\n📊 LOADING PERFORMANCE STATS');
            console.log('═'.repeat(40));
            console.log(`Files loaded: ${this.loadingStats.timesSaved}`);
            console.log(`Total data transferred: ${this.compressor.formatBytes(this.loadingStats.compressedSize)}`);
            console.log(`Compression enabled: ${this.useCompression ? '✅' : '❌'}`);
        }
    }

    /**
     * Get cache size and statistics
     */
    getCacheStats() {
        let cacheSize = 0;
        let cacheCount = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('surah_') || key.includes('quran_'))) {
                const value = localStorage.getItem(key);
                if (value) {
                    cacheSize += value.length;
                    cacheCount++;
                }
            }
        }
        
        return {
            size: this.compressor.formatBytes(cacheSize),
            count: cacheCount,
            version: this.cacheVersion
        };
    }

    /**
     * Clear all cached data
     */
    clearCache() {
        try {
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && (key.includes('surah_') || key.includes('quran_'))) {
                    localStorage.removeItem(key);
                }
            }
            
            console.log('🗑️ Cache cleared successfully');
            return true;
        } catch (error) {
            console.error('❌ Error clearing cache:', error);
            return false;
        }
    }

    /**
     * Test compression performance
     */
    async testPerformance() {
        console.log('🧪 Testing compression performance...');
        
        try {
            // Test with a sample surah
            const testSurahId = 1; // Al-Fatihah
            
            // Clear cache for fair test
            const cacheKey = `surah_${testSurahId}_compressed`;
            localStorage.removeItem(cacheKey);
            
            // Test compressed loading
            const startTime = performance.now();
            const data = await this.loadSurahData(testSurahId);
            const loadTime = performance.now() - startTime;
            
            console.log(`⚡ Test completed in ${loadTime.toFixed(2)}ms`);
            console.log(`📦 Data size: ${JSON.stringify(data).length} characters`);
            
            return {
                loadTime,
                dataSize: JSON.stringify(data).length,
                compressionEnabled: this.useCompression
            };
            
        } catch (error) {
            console.error('❌ Performance test failed:', error);
            return null;
        }
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedDataLoader;
} else {
    window.EnhancedDataLoader = EnhancedDataLoader;
}
