#!/usr/bin/env node

/**
 * Server-side Data Compression Script
 * Pre-compresses JSON files for faster loading
 * Run with: node compress-data.js
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class ServerDataCompressor {
    constructor() {
        this.dataDir = path.join(__dirname, 'data');
        this.compressedDir = path.join(__dirname, 'data-compressed');
        this.stats = {
            totalOriginal: 0,
            totalCompressed: 0,
            filesProcessed: 0
        };
    }

    /**
     * Initialize compression directory
     */
    init() {
        if (!fs.existsSync(this.compressedDir)) {
            fs.mkdirSync(this.compressedDir, { recursive: true });
        }
        
        // Create subdirectories
        const surahsCompressedDir = path.join(this.compressedDir, 'surahs');
        if (!fs.existsSync(surahsCompressedDir)) {
            fs.mkdirSync(surahsCompressedDir, { recursive: true });
        }
    }

    /**
     * Optimize JSON structure for better compression
     */
    optimizeJsonStructure(data, filename) {
        if (filename.includes('surah_') && data.surah_id && data.verses) {
            // Optimize individual surah files
            return this.optimizeSurahData(data);
        } else if (filename === 'surah_name.json') {
            // Optimize surah names
            return this.optimizeSurahNames(data);
        } else if (filename === 'al-quran-word-by-word.json') {
            // Optimize main Quran data
            return this.optimizeMainQuranData(data);
        }
        
        return data; // Return as-is for other files
    }

    optimizeSurahData(data) {
        const optimized = {
            id: data.surah_id,
            v: {} // verses
        };

        for (const [verseKey, verseData] of Object.entries(data.verses)) {
            optimized.v[verseKey] = {
                ar: verseData.arabic_text,
                bn: verseData.bangla_trans,
                en: verseData.english_trans
            };

            if (verseData.word_by_word) {
                optimized.v[verseKey].w = {};
                for (const [wordKey, wordData] of Object.entries(verseData.word_by_word)) {
                    optimized.v[verseKey].w[wordKey] = {
                        ar: wordData.words_ar,
                        bn: wordData.translate_bn
                    };
                }
            }
        }

        return optimized;
    }

    optimizeSurahNames(data) {
        const optimized = {};
        for (const [key, surah] of Object.entries(data)) {
            optimized[key] = {
                ar: surah.name_arabic,
                bn: surah.name_bangla,
                en: surah.name_english,
                t: surah.type,
                n: surah.ayah_number
            };
        }
        return optimized;
    }

    optimizeMainQuranData(data) {
        const optimized = {};
        for (const [surahKey, surahData] of Object.entries(data)) {
            optimized[surahKey] = {};
            for (const [verseKey, verseData] of Object.entries(surahData)) {
                optimized[surahKey][verseKey] = {
                    ar: verseData.arabic_text,
                    bn: verseData.bangla_trans,
                    en: verseData.english_trans
                };

                if (verseData.word_by_word) {
                    optimized[surahKey][verseKey].w = {};
                    for (const [wordKey, wordData] of Object.entries(verseData.word_by_word)) {
                        optimized[surahKey][verseKey].w[wordKey] = {
                            ar: wordData.words_ar,
                            bn: wordData.translate_bn
                        };
                    }
                }
            }
        }
        return optimized;
    }

    /**
     * Compress a single file
     */
    compressFile(inputPath, outputPath) {
        return new Promise((resolve, reject) => {
            try {
                // Read and parse JSON
                const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
                const filename = path.basename(inputPath);
                
                // Optimize structure
                const optimized = this.optimizeJsonStructure(data, filename);
                
                // Minify JSON (remove unnecessary whitespace)
                const minified = JSON.stringify(optimized);
                
                // Compress with Gzip
                zlib.gzip(minified, { level: 9 }, (err, compressed) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    // Write compressed file
                    fs.writeFileSync(outputPath, compressed);
                    
                    // Update statistics
                    const originalSize = fs.statSync(inputPath).size;
                    const compressedSize = compressed.length;
                    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
                    
                    this.stats.totalOriginal += originalSize;
                    this.stats.totalCompressed += compressedSize;
                    this.stats.filesProcessed++;
                    
                    console.log(`✓ ${filename}`);
                    console.log(`  Original: ${this.formatBytes(originalSize)}`);
                    console.log(`  Compressed: ${this.formatBytes(compressedSize)}`);
                    console.log(`  Saved: ${savings}%\n`);
                    
                    resolve({
                        original: originalSize,
                        compressed: compressedSize,
                        savings: parseFloat(savings)
                    });
                });
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Compress all JSON files in data directory
     */
    async compressAllFiles() {
        console.log('🗜️  Starting data compression...\n');
        
        this.init();
        
        try {
            // Compress main files
            const mainFiles = ['al-quran-word-by-word.json', 'surah_name.json', 'juz_data.json', 'quran_pages.json', 'duas.json'];
            
            for (const file of mainFiles) {
                const inputPath = path.join(this.dataDir, file);
                const outputPath = path.join(this.compressedDir, file + '.gz');
                
                if (fs.existsSync(inputPath)) {
                    await this.compressFile(inputPath, outputPath);
                }
            }
            
            // Compress surah files
            const surahsDir = path.join(this.dataDir, 'surahs');
            const surahsCompressedDir = path.join(this.compressedDir, 'surahs');
            
            if (fs.existsSync(surahsDir)) {
                const surahFiles = fs.readdirSync(surahsDir).filter(f => f.endsWith('.json'));
                
                for (const file of surahFiles) {
                    const inputPath = path.join(surahsDir, file);
                    const outputPath = path.join(surahsCompressedDir, file + '.gz');
                    
                    await this.compressFile(inputPath, outputPath);
                }
            }
            
            // Print summary
            this.printSummary();
            
        } catch (error) {
            console.error('❌ Compression failed:', error);
        }
    }

    /**
     * Create a manifest file with compression info
     */
    createManifest() {
        const manifest = {
            version: '1.0.0',
            compressed: true,
            compressionRatio: ((this.stats.totalOriginal - this.stats.totalCompressed) / this.stats.totalOriginal * 100).toFixed(1),
            originalSize: this.stats.totalOriginal,
            compressedSize: this.stats.totalCompressed,
            filesCount: this.stats.filesProcessed,
            timestamp: new Date().toISOString()
        };
        
        const manifestPath = path.join(this.compressedDir, 'manifest.json');
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        
        console.log(`📋 Manifest created: ${manifestPath}`);
    }

    /**
     * Print compression summary
     */
    printSummary() {
        const totalSavings = ((this.stats.totalOriginal - this.stats.totalCompressed) / this.stats.totalOriginal * 100).toFixed(1);
        
        console.log('📊 COMPRESSION SUMMARY');
        console.log('═'.repeat(50));
        console.log(`Files processed: ${this.stats.filesProcessed}`);
        console.log(`Original size: ${this.formatBytes(this.stats.totalOriginal)}`);
        console.log(`Compressed size: ${this.formatBytes(this.stats.totalCompressed)}`);
        console.log(`Total savings: ${totalSavings}%`);
        console.log(`Space saved: ${this.formatBytes(this.stats.totalOriginal - this.stats.totalCompressed)}`);
        
        this.createManifest();
    }

    /**
     * Format bytes to human readable format
     */
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}

// Run compression if this script is executed directly
if (require.main === module) {
    const compressor = new ServerDataCompressor();
    compressor.compressAllFiles().then(() => {
        console.log('\n✅ Compression completed successfully!');
        console.log('\n💡 Next steps:');
        console.log('1. Update your server to serve .gz files with proper headers');
        console.log('2. Update your client code to handle compressed data');
        console.log('3. Test the performance improvements');
    }).catch(error => {
        console.error('❌ Compression failed:', error);
        process.exit(1);
    });
}

module.exports = ServerDataCompressor;
