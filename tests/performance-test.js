#!/usr/bin/env node

/**
 * Performance Test Suite
 * Tests loading times, file sizes, and optimization effectiveness
 */

const fs = require('fs');
const path = require('path');

class PerformanceTest {
    constructor() {
        this.rootDir = path.join(__dirname, '..');
        this.results = [];
    }

    async runPerformanceTests() {
        console.log('⚡ PERFORMANCE TESTING...\n');

        this.testAssetSizes();
        this.testCompressionRatios();
        this.testCacheEfficiency();
        this.generatePerformanceReport();
    }

    testAssetSizes() {
        console.log('📊 Asset Size Analysis:');
        
        const assetPairs = [
            ['styles.css', 'styles.min.css'],
            ['script.js', 'script.min.js'],
            ['compression-utils.js', 'compression-utils.min.js'],
            ['enhanced-data-loader.js', 'enhanced-data-loader.min.js'],
            ['migration-patch.js', 'migration-patch.min.js'],
            ['sw.js', 'sw.min.js']
        ];

        let totalOriginal = 0;
        let totalMinified = 0;

        for (const [original, minified] of assetPairs) {
            const origPath = path.join(this.rootDir, original);
            const minPath = path.join(this.rootDir, minified);

            if (fs.existsSync(origPath) && fs.existsSync(minPath)) {
                const origSize = fs.statSync(origPath).size;
                const minSize = fs.statSync(minPath).size;
                const savings = ((origSize - minSize) / origSize * 100).toFixed(1);

                totalOriginal += origSize;
                totalMinified += minSize;

                console.log(`  ${original.padEnd(25)} ${this.formatBytes(origSize).padEnd(8)} → ${this.formatBytes(minSize).padEnd(8)} (${savings}% saved)`);
                
                this.results.push({
                    test: `Minification: ${original}`,
                    status: savings > 10 ? 'PASS' : 'WARN',
                    value: `${savings}% reduction`,
                    benchmark: '> 10% reduction expected'
                });
            }
        }

        const totalSavings = ((totalOriginal - totalMinified) / totalOriginal * 100).toFixed(1);
        console.log(`\n  Total Assets: ${this.formatBytes(totalOriginal)} → ${this.formatBytes(totalMinified)} (${totalSavings}% saved)\n`);
    }

    testCompressionRatios() {
        console.log('🗜️ Data Compression Analysis:');

        const compressedManifest = path.join(this.rootDir, 'data-compressed', 'manifest.json');
        
        if (fs.existsSync(compressedManifest)) {
            const manifest = JSON.parse(fs.readFileSync(compressedManifest, 'utf8'));
            
            console.log(`  Original Data Size: ${this.formatBytes(manifest.originalSize)}`);
            console.log(`  Compressed Size: ${this.formatBytes(manifest.compressedSize)}`);
            console.log(`  Compression Ratio: ${manifest.compressionRatio}%`);
            console.log(`  Files Compressed: ${manifest.filesCount}\n`);

            this.results.push({
                test: 'Data Compression',
                status: parseFloat(manifest.compressionRatio) > 80 ? 'PASS' : 'WARN',
                value: `${manifest.compressionRatio}% reduction`,
                benchmark: '> 80% reduction expected'
            });
        } else {
            console.log('  ⚠️ Compressed data not available\n');
            this.results.push({
                test: 'Data Compression',
                status: 'SKIP',
                value: 'Not available',
                benchmark: 'Compressed data should exist'
            });
        }
    }

    testCacheEfficiency() {
        console.log('💾 Cache Efficiency Analysis:');

        try {
            const swPath = path.join(this.rootDir, 'sw.min.js');
            if (!fs.existsSync(swPath)) {
                throw new Error('Service worker not found');
            }

            const swContent = fs.readFileSync(swPath, 'utf8');
            const cacheMatches = swContent.match(/urlsToCache\s*=\s*\[(.*?)\]/s);
            
            if (cacheMatches) {
                const cacheList = cacheMatches[1];
                const fileCount = (cacheList.match(/'/g) || []).length / 2;
                
                console.log(`  Files in cache: ${fileCount}`);
                console.log(`  Cache strategy: Aggressive caching enabled`);
                
                // Calculate total cache size
                let totalCacheSize = 0;
                const htmlPath = path.join(this.rootDir, 'index.html');
                if (fs.existsSync(htmlPath)) {
                    totalCacheSize += fs.statSync(htmlPath).size;
                }

                const minFiles = ['styles.min.css', 'script.min.js', 'compression-utils.min.js', 
                                'enhanced-data-loader.min.js', 'migration-patch.min.js'];
                
                for (const file of minFiles) {
                    const filePath = path.join(this.rootDir, file);
                    if (fs.existsSync(filePath)) {
                        totalCacheSize += fs.statSync(filePath).size;
                    }
                }

                console.log(`  Estimated cache size: ${this.formatBytes(totalCacheSize)}\n`);

                this.results.push({
                    test: 'Cache Efficiency',
                    status: totalCacheSize < 200 * 1024 ? 'PASS' : 'WARN', // Under 200KB
                    value: this.formatBytes(totalCacheSize),
                    benchmark: '< 200KB for mobile efficiency'
                });
            }

        } catch (error) {
            console.log(`  ❌ Cache analysis failed: ${error.message}\n`);
        }
    }

    generatePerformanceReport() {
        console.log('📋 PERFORMANCE TEST RESULTS:');
        console.log('-'.repeat(80));
        
        for (const result of this.results) {
            const icon = result.status === 'PASS' ? '✅' : 
                        result.status === 'WARN' ? '⚠️' : 
                        result.status === 'SKIP' ? '⏭️' : '❌';
            
            console.log(`${icon} ${result.test.padEnd(30)} ${result.value.padEnd(20)} (${result.benchmark})`);
        }

        const passed = this.results.filter(r => r.status === 'PASS').length;
        const total = this.results.length;
        
        console.log('\n' + '='.repeat(80));
        console.log(`📊 Performance Score: ${passed}/${total} tests passed`);
        
        if (passed === total) {
            console.log('🎉 EXCELLENT PERFORMANCE! Ready for production.');
        } else {
            console.log('⚠️ Performance could be improved. Review warnings above.');
        }
        console.log('='.repeat(80));
    }

    formatBytes(bytes, decimals = 1) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}

// CLI execution
if (require.main === module) {
    const perfTest = new PerformanceTest();
    perfTest.runPerformanceTests().catch(error => {
        console.error('❌ Performance test failed:', error);
        process.exit(1);
    });
}

module.exports = PerformanceTest;
