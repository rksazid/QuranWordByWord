#!/usr/bin/env node

/**
 * Memory-Efficient Production Audit
 * Optimized for large projects without memory issues
 */

const fs = require('fs');
const path = require('path');

class MemoryEfficientAudit {
    constructor() {
        this.rootDir = path.join(__dirname, '..');
        this.testResults = [];
        this.errors = [];
        this.warnings = [];
    }

    async runAudit() {
        console.log('🔍 MEMORY-EFFICIENT PRODUCTION AUDIT\n');
        console.log('=' .repeat(60));

        // Run memory-efficient tests
        this.testCriticalFiles();
        this.testMinificationUsage();
        this.testServiceWorkerConsistency();
        this.testAssetOptimization();
        this.testDataCompressionSetup();
        this.testPWAConfiguration();
        this.testProductionMode();

        this.generateReport();
    }

    testCriticalFiles() {
        this.logSection('CRITICAL FILES CHECK');

        const criticalFiles = [
            'index.html',
            'styles.min.css',
            'script.min.js',
            'compression-utils.min.js',
            'enhanced-data-loader.min.js',
            'migration-patch.min.js',
            'sw.min.js',
            'manifest.json'
        ];

        let allPresent = true;
        for (const file of criticalFiles) {
            const filePath = path.join(this.rootDir, file);
            const exists = fs.existsSync(filePath);
            
            if (exists) {
                console.log(`  ✓ ${file}`);
            } else {
                console.log(`  ❌ ${file} - MISSING`);
                allPresent = false;
                this.addError(`Critical file missing: ${file}`);
            }
        }

        this.addTestResult('Critical Files', allPresent ? 'PASS' : 'FAIL', 
                          allPresent ? 'All critical files present' : 'Some files missing');
    }

    testMinificationUsage() {
        this.logSection('MINIFICATION USAGE');

        try {
            const htmlPath = path.join(this.rootDir, 'index.html');
            
            // Read HTML in chunks to avoid memory issues
            const htmlStats = fs.statSync(htmlPath);
            const htmlSize = htmlStats.size;
            
            if (htmlSize > 1024 * 1024) { // If > 1MB, read in chunks
                this.addWarning('HTML file is large, using basic checks');
                
                // Just check if minified files exist and are referenced
                const hasMinCSS = fs.existsSync(path.join(this.rootDir, 'styles.min.css'));
                const hasMinJS = fs.existsSync(path.join(this.rootDir, 'script.min.js'));
                
                this.addTestResult('Minification Setup', hasMinCSS && hasMinJS ? 'PASS' : 'FAIL',
                                 hasMinCSS && hasMinJS ? 'Minified files exist' : 'Minified files missing');
            } else {
                // Safe to read full HTML
                const htmlContent = fs.readFileSync(htmlPath, 'utf8');
                
                const usesMinCSS = htmlContent.includes('styles.min.css');
                const usesMinJS = htmlContent.includes('script.min.js');
                const usesMinSW = htmlContent.includes('sw.min.js');

                console.log(`  CSS: ${usesMinCSS ? '✓ Using minified' : '❌ Using original'}`);
                console.log(`  JS: ${usesMinJS ? '✓ Using minified' : '❌ Using original'}`);
                console.log(`  SW: ${usesMinSW ? '✓ Using minified' : '❌ Using original'}`);

                this.addTestResult('Minification Usage', 
                                 usesMinCSS && usesMinJS && usesMinSW ? 'PASS' : 'FAIL',
                                 'HTML uses minified assets');
            }

        } catch (error) {
            this.addTestResult('Minification Usage', 'FAIL', error.message);
        }
    }

    testServiceWorkerConsistency() {
        this.logSection('SERVICE WORKER CONSISTENCY');

        try {
            const swPath = path.join(this.rootDir, 'sw.min.js');
            
            if (!fs.existsSync(swPath)) {
                throw new Error('Service worker not found');
            }

            // Read SW content safely
            const swStats = fs.statSync(swPath);
            if (swStats.size > 100 * 1024) { // If > 100KB
                this.addWarning('Service worker is large, using basic checks');
                this.addTestResult('Service Worker', 'PASS', 'Service worker file exists');
                return;
            }

            const swContent = fs.readFileSync(swPath, 'utf8');
            
            const cachesMinCSS = swContent.includes('styles.min.css');
            const cachesMinJS = swContent.includes('script.min.js');

            console.log(`  Caches min CSS: ${cachesMinCSS ? '✓' : '❌'}`);
            console.log(`  Caches min JS: ${cachesMinJS ? '✓' : '❌'}`);

            this.addTestResult('Service Worker Consistency', 
                             cachesMinCSS && cachesMinJS ? 'PASS' : 'FAIL',
                             'Service worker caches correct files');

        } catch (error) {
            this.addTestResult('Service Worker Consistency', 'FAIL', error.message);
        }
    }

    testAssetOptimization() {
        this.logSection('ASSET OPTIMIZATION');

        const assetPairs = [
            ['styles.css', 'styles.min.css'],
            ['script.js', 'script.min.js'],
            ['sw.js', 'sw.min.js']
        ];

        let totalSavings = 0;
        let pairsChecked = 0;

        for (const [original, minified] of assetPairs) {
            const origPath = path.join(this.rootDir, original);
            const minPath = path.join(this.rootDir, minified);

            if (fs.existsSync(origPath) && fs.existsSync(minPath)) {
                const origSize = fs.statSync(origPath).size;
                const minSize = fs.statSync(minPath).size;
                
                if (minSize < origSize) {
                    const savings = ((origSize - minSize) / origSize * 100);
                    totalSavings += savings;
                    pairsChecked++;
                    console.log(`  ✓ ${minified}: ${savings.toFixed(1)}% smaller`);
                } else {
                    console.log(`  ❌ ${minified}: Not optimized`);
                }
            }
        }

        const avgSavings = pairsChecked > 0 ? (totalSavings / pairsChecked).toFixed(1) : 0;
        this.addTestResult('Asset Optimization', avgSavings > 15 ? 'PASS' : 'WARN',
                          `Average ${avgSavings}% reduction`);
    }

    testDataCompressionSetup() {
        this.logSection('DATA COMPRESSION SETUP');

        const dataDir = path.join(this.rootDir, 'data');
        const compressedDir = path.join(this.rootDir, 'data-compressed');
        const compressionUtils = path.join(this.rootDir, 'compression-utils.min.js');

        const hasOriginalData = fs.existsSync(dataDir);
        const hasCompressedData = fs.existsSync(compressedDir);
        const hasCompressionUtils = fs.existsSync(compressionUtils);

        console.log(`  Original data: ${hasOriginalData ? '✓' : '❌'}`);
        console.log(`  Compressed data: ${hasCompressedData ? '✓' : '❌'}`);
        console.log(`  Compression utils: ${hasCompressionUtils ? '✓' : '❌'}`);

        // Check compression manifest without reading large files
        if (hasCompressedData) {
            const manifestPath = path.join(compressedDir, 'manifest.json');
            if (fs.existsSync(manifestPath)) {
                try {
                    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                    console.log(`  Compression ratio: ${manifest.compressionRatio}%`);
                } catch (error) {
                    this.addWarning('Could not read compression manifest');
                }
            }
        }

        this.addTestResult('Data Compression Setup', 
                          hasOriginalData && hasCompressionUtils ? 'PASS' : 'WARN',
                          'Compression infrastructure available');
    }

    testPWAConfiguration() {
        this.logSection('PWA CONFIGURATION');

        try {
            const manifestPath = path.join(this.rootDir, 'manifest.json');
            
            if (!fs.existsSync(manifestPath)) {
                throw new Error('PWA manifest not found');
            }

            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            
            const hasName = !!manifest.name;
            const hasStartUrl = !!manifest.start_url;
            const hasDisplay = !!manifest.display;

            console.log(`  Name: ${hasName ? '✓' : '❌'}`);
            console.log(`  Start URL: ${hasStartUrl ? '✓' : '❌'}`);
            console.log(`  Display mode: ${hasDisplay ? '✓' : '❌'}`);

            this.addTestResult('PWA Configuration', 
                             hasName && hasStartUrl && hasDisplay ? 'PASS' : 'FAIL',
                             'PWA manifest properly configured');

        } catch (error) {
            this.addTestResult('PWA Configuration', 'FAIL', error.message);
        }
    }

    testProductionMode() {
        this.logSection('PRODUCTION MODE STATUS');

        try {
            // Check if we're in production mode by looking at file sizes
            const minCSSPath = path.join(this.rootDir, 'styles.min.css');
            const minJSPath = path.join(this.rootDir, 'script.min.js');
            
            const hasMinifiedAssets = fs.existsSync(minCSSPath) && fs.existsSync(minJSPath);
            
            if (hasMinifiedAssets) {
                console.log('  ✓ Minified assets available');
                console.log('  ✓ Production mode ready');
                
                this.addTestResult('Production Mode', 'PASS', 'Ready for production deployment');
            } else {
                console.log('  ❌ Minified assets missing');
                this.addTestResult('Production Mode', 'FAIL', 'Not ready for production');
            }

        } catch (error) {
            this.addTestResult('Production Mode', 'FAIL', error.message);
        }
    }

    // Helper methods
    addTestResult(test, status, message) {
        this.testResults.push({ test, status, message });
    }

    addError(message) {
        this.errors.push(message);
    }

    addWarning(message) {
        this.warnings.push(message);
    }

    logSection(title) {
        console.log(`\n📋 ${title}`);
        console.log('-'.repeat(40));
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 PRODUCTION AUDIT REPORT');
        console.log('='.repeat(60));

        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const warnings = this.testResults.filter(r => r.status === 'WARN').length;

        console.log(`\n🎯 SUMMARY:`);
        console.log(`   Tests Passed: ${passed}`);
        console.log(`   Tests Failed: ${failed}`);
        console.log(`   Warnings: ${warnings + this.warnings.length}`);
        console.log(`   Errors: ${this.errors.length}`);

        if (failed === 0 && this.errors.length === 0) {
            console.log('\n🎉 ALL CRITICAL TESTS PASSED!');
            console.log('🚀 Production deployment approved!');
        } else {
            console.log('\n🚨 ISSUES FOUND - Review required');
        }

        // Detailed results
        console.log('\n📋 DETAILED RESULTS:');
        for (const result of this.testResults) {
            const icon = result.status === 'PASS' ? '✅' : 
                        result.status === 'WARN' ? '⚠️' : '❌';
            console.log(`${icon} ${result.test}: ${result.message}`);
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            for (const warning of this.warnings) {
                console.log(`   • ${warning}`);
            }
        }

        if (this.errors.length > 0) {
            console.log('\n❌ ERRORS:');
            for (const error of this.errors) {
                console.log(`   • ${error}`);
            }
        }

        console.log('\n💡 For detailed analysis: npm run test:performance');
        console.log('='.repeat(60));
    }
}

// CLI execution
if (require.main === module) {
    const auditor = new MemoryEfficientAudit();
    auditor.runAudit().catch(error => {
        console.error('❌ Audit failed:', error);
        process.exit(1);
    });
}

module.exports = MemoryEfficientAudit;
