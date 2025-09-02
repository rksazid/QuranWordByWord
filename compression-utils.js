/**
 * Compression Utilities for Quran Word by Word App
 * Provides client-side compression/decompression for JSON data
 */

// Import Pako library for compression (add to HTML: <script src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"></script>)

class DataCompressor {
    constructor() {
        this.isCompressionSupported = typeof pako !== 'undefined';
        this.compressionLevel = 6; // Balance between speed and compression ratio (1-9)
    }

    /**
     * Compress JSON data to reduce size
     * @param {Object|String} data - JSON data to compress
     * @returns {Promise<String>} - Base64 encoded compressed data
     */
    async compressData(data) {
        try {
            if (!this.isCompressionSupported) {
                console.warn('Compression not supported, returning original data');
                return JSON.stringify(data);
            }

            // Convert to minified JSON string
            const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
            
            // Compress using Pako (gzip compression)
            const compressed = pako.gzip(jsonString, { level: this.compressionLevel });
            
            // Convert to Base64 for storage/transmission
            const base64Compressed = this.arrayBufferToBase64(compressed);
            
            const originalSize = new Blob([jsonString]).size;
            const compressedSize = new Blob([base64Compressed]).size;
            const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
            
            console.log(`Compression Stats:
                Original: ${this.formatBytes(originalSize)}
                Compressed: ${this.formatBytes(compressedSize)}
                Saved: ${compressionRatio}%`);
            
            return base64Compressed;
        } catch (error) {
            console.error('Compression failed:', error);
            return JSON.stringify(data);
        }
    }

    /**
     * Decompress data back to original JSON
     * @param {String} compressedData - Base64 encoded compressed data
     * @returns {Promise<Object>} - Decompressed JSON object
     */
    async decompressData(compressedData) {
        try {
            if (!this.isCompressionSupported) {
                return JSON.parse(compressedData);
            }

            // Convert Base64 back to Uint8Array
            const compressed = this.base64ToArrayBuffer(compressedData);
            
            // Decompress using Pako
            const decompressed = pako.ungzip(compressed, { to: 'string' });
            
            // Parse JSON
            return JSON.parse(decompressed);
        } catch (error) {
            console.error('Decompression failed:', error);
            // Fallback: try to parse as regular JSON
            return JSON.parse(compressedData);
        }
    }

    /**
     * Optimize JSON structure for better compression
     * @param {Object} surahData - Original surah data
     * @returns {Object} - Optimized surah data
     */
    optimizeStructure(surahData) {
        const optimized = {
            id: surahData.surah_id,
            v: {} // verses
        };

        // Optimize verses structure
        for (const [verseKey, verseData] of Object.entries(surahData.verses)) {
            optimized.v[verseKey] = {
                ar: verseData.arabic_text,        // arabic_text -> ar
                bn: verseData.bangla_trans,       // bangla_trans -> bn
                en: verseData.english_trans       // english_trans -> en
            };

            // Optimize word_by_word if exists
            if (verseData.word_by_word) {
                optimized.v[verseKey].w = {}; // word_by_word -> w
                for (const [wordKey, wordData] of Object.entries(verseData.word_by_word)) {
                    optimized.v[verseKey].w[wordKey] = {
                        ar: wordData.words_ar,        // words_ar -> ar
                        bn: wordData.translate_bn     // translate_bn -> bn
                    };
                }
            }
        }

        return optimized;
    }

    /**
     * Restore optimized structure to original format
     * @param {Object} optimizedData - Optimized surah data
     * @returns {Object} - Original format surah data
     */
    restoreStructure(optimizedData) {
        const restored = {
            surah_id: optimizedData.id,
            verses: {}
        };

        // Restore verses structure
        for (const [verseKey, verseData] of Object.entries(optimizedData.v)) {
            restored.verses[verseKey] = {
                arabic_text: verseData.ar,
                bangla_trans: verseData.bn,
                english_trans: verseData.en
            };

            // Restore word_by_word if exists
            if (verseData.w) {
                restored.verses[verseKey].word_by_word = {};
                for (const [wordKey, wordData] of Object.entries(verseData.w)) {
                    restored.verses[verseKey].word_by_word[wordKey] = {
                        words_ar: wordData.ar,
                        translate_bn: wordData.bn
                    };
                }
            }
        }

        return restored;
    }

    /**
     * Store compressed data in localStorage with fallback
     * @param {String} key - Storage key
     * @param {Object} data - Data to store
     */
    async storeCompressedData(key, data) {
        try {
            // Optimize structure first
            const optimized = this.optimizeStructure(data);
            
            // Compress the optimized data
            const compressed = await this.compressData(optimized);
            
            // Store with compression flag
            const storageData = {
                compressed: true,
                data: compressed,
                timestamp: Date.now()
            };
            
            localStorage.setItem(key, JSON.stringify(storageData));
            
        } catch (error) {
            console.error('Failed to store compressed data:', error);
            // Fallback: store without compression
            localStorage.setItem(key, JSON.stringify({
                compressed: false,
                data: data,
                timestamp: Date.now()
            }));
        }
    }

    /**
     * Retrieve and decompress data from localStorage
     * @param {String} key - Storage key
     * @returns {Promise<Object|null>} - Decompressed data or null
     */
    async retrieveCompressedData(key) {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return null;
            
            const storageData = JSON.parse(stored);
            
            if (storageData.compressed) {
                // Decompress and restore structure
                const decompressed = await this.decompressData(storageData.data);
                return this.restoreStructure(decompressed);
            } else {
                // Return uncompressed data
                return storageData.data;
            }
            
        } catch (error) {
            console.error('Failed to retrieve compressed data:', error);
            return null;
        }
    }

    // Utility methods
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * Test compression with sample data
     */
    async testCompression(sampleData) {
        console.log('Testing compression...');
        const compressed = await this.compressData(sampleData);
        const decompressed = await this.decompressData(compressed);
        
        console.log('Original:', sampleData);
        console.log('Decompressed:', decompressed);
        console.log('Data integrity:', JSON.stringify(sampleData) === JSON.stringify(decompressed));
        
        return {
            originalSize: JSON.stringify(sampleData).length,
            compressedSize: compressed.length,
            integrityCheck: JSON.stringify(sampleData) === JSON.stringify(decompressed)
        };
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataCompressor;
} else {
    window.DataCompressor = DataCompressor;
}
