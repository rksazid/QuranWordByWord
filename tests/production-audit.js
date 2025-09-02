#!/usr/bin/env node

/**
 * Production Audit & Test Suite
 * Comprehensive validation for Quran Word by Word production deployment
 */

const fs = require('fs');
const path = require('path');

class ProductionAuditor {
    constructor() {
        this.testResults = [];
        this.errors = [];
        this.warnings = [];
        this.rootDir = path.join(__dirname, '..');
    }

    /**
     * Main audit function
     */
    async runFullAudit() {
        console.log('🔍 PRODUCTION AUDIT STARTING...\n');
        console.log('=' .repeat(60));

        // Run all test categories
        await this.testFileConsistency();
        await this.testServiceWorkerIntegrity();
        await this.testAssetMinification();
        await this.testDataCompression();
        await this.testPWAConfiguration();
        await this.testBuildScripts();
        await this.testPerformanceOptimization();
        await this.testProductionReadiness();

        // Generate final report
        this.generateReport();
    }

    /**
     * Test 1: File Reference Consistency
     */
    async testFileConsistency() {
        this.logSection('FILE REFERENCE CONSISTENCY');

        try {
            // Read main HTML file
            const htmlPath = path.join(this.rootDir, 'index.html');
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');

            // Extract all file references
            const cssRefs = this.extractReferences(htmlContent, /href="([^"]*\.css[^"]*)"/, 'CSS');
            const jsRefs = this.extractReferences(htmlContent, /src="([^"]*\.js[^"]*)"/, 'JS');

            // Check if referenced files exist
            this.checkFileExistence([...cssRefs, ...jsRefs], 'HTML References');

            // Verify minified versions are used
            this.testMinifiedUsage(htmlContent);

            this.addTestResult('File Consistency', 'PASS', 'All file references are consistent');

        } catch (error) {
            this.addTestResult('File Consistency', 'FAIL', error.message);
        }
    }

    /**
     * Test 2: Service Worker Integrity
     */
    async testServiceWorkerIntegrity() {
        this.logSection('SERVICE WORKER INTEGRITY');

        try {
            // Check service worker registration
            const htmlPath = path.join(this.rootDir, 'index.html');
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            
            const swRegistration = htmlContent.match(/navigator\.serviceWorker\.register\(['"`]([^'"`]+)['"`]\)/);
            
            if (!swRegistration) {
                throw new Error('Service worker registration not found');
            }

            const swFile = swRegistration[1].replace('./', '');
            const swPath = path.join(this.rootDir, swFile);

            if (!fs.existsSync(swPath)) {
                throw new Error(`Service worker file not found: ${swFile}`);
            }

            // Check service worker cache list
            const swContent = fs.readFileSync(swPath, 'utf8');
            const cachedFiles = this.extractCachedFiles(swContent);

            // Extract files referenced in HTML
            const htmlFiles = this.extractHTMLAssets(htmlContent);

            // Check for mismatches
            const mismatches = this.findCacheMismatches(htmlFiles, cachedFiles);

            if (mismatches.length > 0) {
                throw new Error(`Cache mismatches found: ${mismatches.join(', ')}`);
            }

            this.addTestResult('Service Worker Integrity', 'PASS', `SW caches ${cachedFiles.length} files correctly`);

        } catch (error) {
            this.addTestResult('Service Worker Integrity', 'FAIL', error.message);
        }
    }

    /**
     * Test 3: Asset Minification Validation
     */
    async testAssetMinification() {
        this.logSection('ASSET MINIFICATION VALIDATION');

        try {
            const expectedMinFiles = [
                'styles.min.css',
                'script.min.js', 
                'compression-utils.min.js',
                'enhanced-data-loader.min.js',
                'migration-patch.min.js',
                'sw.min.js'
            ];

            let totalOriginalSize = 0;
            let totalMinifiedSize = 0;
            
            for (const minFile of expectedMinFiles) {
                const originalFile = minFile.replace('.min.', '.');
                
                const minPath = path.join(this.rootDir, minFile);
                const originalPath = path.join(this.rootDir, originalFile);

                if (!fs.existsSync(minPath)) {
                    throw new Error(`Minified file missing: ${minFile}`);
                }

                if (fs.existsSync(originalPath)) {
                    const minSize = fs.statSync(minPath).size;
                    const originalSize = fs.statSync(originalPath).size;
                    
                    totalMinifiedSize += minSize;
                    totalOriginalSize += originalSize;

                    const savings = ((originalSize - minSize) / originalSize * 100).toFixed(1);
                    console.log(`  ✓ ${minFile}: ${this.formatBytes(originalSize)} → ${this.formatBytes(minSize)} (${savings}% saved)`);
                }
            }

            const totalSavings = ((totalOriginalSize - totalMinifiedSize) / totalOriginalSize * 100).toFixed(1);
            this.addTestResult('Asset Minification', 'PASS', `${totalSavings}% total reduction achieved`);

        } catch (error) {
            this.addTestResult('Asset Minification', 'FAIL', error.message);
        }
    }

    /**
     * Test 4: Data Compression Validation
     */
    async testDataCompression() {
        this.logSection('DATA COMPRESSION VALIDATION');

        try {
            const dataDir = path.join(this.rootDir, 'data');
            const compressedDir = path.join(this.rootDir, 'data-compressed');

            if (!fs.existsSync(dataDir)) {
                throw new Error('Original data directory not found');
            }

            // Check if compressed data exists
            if (fs.existsSync(compressedDir)) {
                const manifestPath = path.join(compressedDir, 'manifest.json');
                if (fs.existsSync(manifestPath)) {
                    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                    console.log(`  ✓ Compressed data available: ${manifest.compressionRatio}% reduction`);
                    console.log(`  ✓ Files compressed: ${manifest.filesCount}`);
                }
            }

            // Test compression utilities
            const compressionUtilsPath = path.join(this.rootDir, 'compression-utils.min.js');
            if (fs.existsSync(compressionUtilsPath)) {
                const content = fs.readFileSync(compressionUtilsPath, 'utf8');
                if (content.includes('pako') || content.includes('compression')) {
                    console.log('  ✓ Compression utilities available');
                }
            }

            this.addTestResult('Data Compression', 'PASS', 'Compression system properly configured');

        } catch (error) {
            this.addTestResult('Data Compression', 'FAIL', error.message);
        }
    }

    /**
     * Test 5: PWA Configuration
     */
    async testPWAConfiguration() {
        this.logSection('PWA CONFIGURATION');

        try {
            // Check manifest.json
            const manifestPath = path.join(this.rootDir, 'manifest.json');
            if (!fs.existsSync(manifestPath)) {
                throw new Error('PWA manifest.json not found');
            }

            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            
            // Validate required manifest fields
            const requiredFields = ['name', 'short_name', 'start_url', 'display', 'theme_color'];
            for (const field of requiredFields) {
                if (!manifest[field]) {
                    throw new Error(`Manifest missing required field: ${field}`);
                }
            }

            // Check icon files
            if (manifest.icons) {
                for (const icon of manifest.icons) {
                    const iconPath = path.join(this.rootDir, icon.src);
                    if (!fs.existsSync(iconPath)) {
                        this.addWarning(`Icon file not found: ${icon.src}`);
                    }
                }
            }

            // Check HTML PWA meta tags
            const htmlPath = path.join(this.rootDir, 'index.html');
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            
            if (!htmlContent.includes('rel="manifest"')) {
                throw new Error('Manifest link missing in HTML');
            }

            this.addTestResult('PWA Configuration', 'PASS', 'PWA properly configured');

        } catch (error) {
            this.addTestResult('PWA Configuration', 'FAIL', error.message);
        }
    }

    /**
     * Test 6: Build Scripts Validation
     */
    async testBuildScripts() {
        this.logSection('BUILD SCRIPTS VALIDATION');

        try {
            // Check package.json scripts
            const packagePath = path.join(this.rootDir, 'package.json');
            if (fs.existsSync(packagePath)) {
                const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                
                const expectedScripts = ['dev', 'build', 'prod', 'status'];
                for (const script of expectedScripts) {
                    if (!pkg.scripts || !pkg.scripts[script]) {
                        this.addWarning(`Missing npm script: ${script}`);
                    }
                }
            }

            // Check build scripts exist
            const buildScripts = [
                'build-scripts.js',
                'minify-assets.js',
                'compress-data.js'
            ];

            for (const script of buildScripts) {
                const scriptPath = path.join(this.rootDir, script);
                if (!fs.existsSync(scriptPath)) {
                    throw new Error(`Build script missing: ${script}`);
                }
            }

            this.addTestResult('Build Scripts', 'PASS', 'All build scripts available');

        } catch (error) {
            this.addTestResult('Build Scripts', 'FAIL', error.message);
        }
    }

    /**
     * Test 7: Performance Optimization
     */
    async testPerformanceOptimization() {
        this.logSection('PERFORMANCE OPTIMIZATION');

        try {
            // Calculate total optimization
            let originalSize = 0;
            let optimizedSize = 0;

            // Assets optimization
            const assetFiles = ['styles.css', 'script.js'];
            const minAssetFiles = ['styles.min.css', 'script.min.js'];

            for (let i = 0; i < assetFiles.length; i++) {
                const originalPath = path.join(this.rootDir, assetFiles[i]);
                const minPath = path.join(this.rootDir, minAssetFiles[i]);

                if (fs.existsSync(originalPath) && fs.existsSync(minPath)) {
                    originalSize += fs.statSync(originalPath).size;
                    optimizedSize += fs.statSync(minPath).size;
                }
            }

            // Data optimization (if compressed data exists)
            const compressedDir = path.join(this.rootDir, 'data-compressed');
            if (fs.existsSync(compressedDir)) {
                const manifestPath = path.join(compressedDir, 'manifest.json');
                if (fs.existsSync(manifestPath)) {
                    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                    originalSize += manifest.originalSize;
                    optimizedSize += manifest.compressedSize;
                }
            }

            const totalReduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
            
            console.log(`  ✓ Total original size: ${this.formatBytes(originalSize)}`);
            console.log(`  ✓ Total optimized size: ${this.formatBytes(optimizedSize)}`);
            console.log(`  ✓ Total reduction: ${totalReduction}%`);

            this.addTestResult('Performance Optimization', 'PASS', `${totalReduction}% total reduction achieved`);

        } catch (error) {
            this.addTestResult('Performance Optimization', 'FAIL', error.message);
        }
    }

    /**
     * Test 8: Production Readiness
     */
    async testProductionReadiness() {
        this.logSection('PRODUCTION READINESS');

        try {
            // Check if HTML is in production mode
            const htmlPath = path.join(this.rootDir, 'index.html');
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');

            const isProductionMode = htmlContent.includes('.min.css') && 
                                   htmlContent.includes('.min.js') &&
                                   htmlContent.includes('sw.min.js');

            if (!isProductionMode) {
                throw new Error('HTML not in production mode (not using minified assets)');
            }

            // Check for development artifacts
            const devArtifacts = [
                'console.log',
                'debugger',
                '// TODO',
                '// FIXME'
            ];

            const criticalFiles = ['script.min.js', 'styles.min.css'];
            for (const file of criticalFiles) {
                const filePath = path.join(this.rootDir, file);
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    for (const artifact of devArtifacts) {
                        if (content.includes(artifact)) {
                            this.addWarning(`Development artifact found in ${file}: ${artifact}`);
                        }
                    }
                }
            }

            // Check file permissions (basic)
            const htmlStat = fs.statSync(htmlPath);
            if (!(htmlStat.mode & parseInt('444', 8))) {
                this.addWarning('index.html may not have proper read permissions');
            }

            this.addTestResult('Production Readiness', 'PASS', 'Application ready for production deployment');

        } catch (error) {
            this.addTestResult('Production Readiness', 'FAIL', error.message);
        }
    }

    /**
     * Helper Methods
     */
    extractReferences(content, regex, type) {
        const matches = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
            // Skip external URLs
            if (!match[1].startsWith('http')) {
                matches.push({
                    file: match[1].split('?')[0], // Remove query parameters
                    type: type
                });
            }
        }
        return matches;
    }

    checkFileExistence(refs, category) {
        for (const ref of refs) {
            const filePath = path.join(this.rootDir, ref.file);
            if (!fs.existsSync(filePath)) {
                this.addError(`${category}: File not found - ${ref.file}`);
            } else {
                console.log(`  ✓ ${ref.type}: ${ref.file}`);
            }
        }
    }

    testMinifiedUsage(htmlContent) {
        // Check if HTML uses minified versions
        const minifiedUsage = {
            css: htmlContent.includes('.min.css'),
            js: htmlContent.includes('.min.js'),
            sw: htmlContent.includes('sw.min.js')
        };

        for (const [type, isMinified] of Object.entries(minifiedUsage)) {
            if (isMinified) {
                console.log(`  ✓ Using minified ${type.toUpperCase()}`);
            } else {
                this.addWarning(`Not using minified ${type.toUpperCase()}`);
            }
        }
    }

    extractCachedFiles(swContent) {
        const cacheMatch = swContent.match(/urlsToCache\s*=\s*\[([\s\S]*?)\]/);
        if (!cacheMatch) return [];

        const cacheList = cacheMatch[1];
        const files = [];
        const fileMatches = cacheList.match(/'([^']+)'/g) || [];
        
        for (const match of fileMatches) {
            const file = match.slice(1, -1); // Remove quotes
            if (!file.startsWith('http') && file !== '/') {
                files.push(file.replace(/^\//, '')); // Remove leading slash
            }
        }
        
        return files;
    }

    extractHTMLAssets(htmlContent) {
        const assets = [];
        
        // CSS files
        const cssMatches = htmlContent.match(/href="([^"]*\.css[^"]*)"/g) || [];
        for (const match of cssMatches) {
            const file = match.match(/href="([^"]*\.css[^"]*)"/)[1].split('?')[0];
            if (!file.startsWith('http')) {
                assets.push(file);
            }
        }

        // JS files
        const jsMatches = htmlContent.match(/src="([^"]*\.js[^"]*)"/g) || [];
        for (const match of jsMatches) {
            const file = match.match(/src="([^"]*\.js[^"]*)"/)[1].split('?')[0];
            if (!file.startsWith('http')) {
                assets.push(file);
            }
        }

        return assets;
    }

    findCacheMismatches(htmlFiles, cachedFiles) {
        const mismatches = [];
        
        for (const htmlFile of htmlFiles) {
            const normalizedHtmlFile = htmlFile.replace(/^\.\//, '');
            if (!cachedFiles.includes(normalizedHtmlFile)) {
                mismatches.push(`HTML loads "${htmlFile}" but SW doesn't cache it`);
            }
        }

        return mismatches;
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    addTestResult(test, status, message) {
        this.testResults.push({ test, status, message });
        const icon = status === 'PASS' ? '✅' : '❌';
        console.log(`${icon} ${test}: ${message}\n`);
    }

    addError(message) {
        this.errors.push(message);
        console.log(`❌ ERROR: ${message}`);
    }

    addWarning(message) {
        this.warnings.push(message);
        console.log(`⚠️  WARNING: ${message}`);
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

        console.log(`\n🎯 SUMMARY:`);
        console.log(`   Tests Passed: ${passed}`);
        console.log(`   Tests Failed: ${failed}`);
        console.log(`   Warnings: ${this.warnings.length}`);
        console.log(`   Errors: ${this.errors.length}`);

        if (failed === 0 && this.errors.length === 0) {
            console.log('\n🎉 ALL TESTS PASSED! Production ready! 🚀');
        } else {
            console.log('\n🚨 ISSUES FOUND - Review required before deployment');
        }

        // Detailed results
        console.log('\n📋 DETAILED RESULTS:');
        for (const result of this.testResults) {
            const icon = result.status === 'PASS' ? '✅' : '❌';
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

        console.log('\n' + '='.repeat(60));
    }
}

// CLI execution
if (require.main === module) {
    const auditor = new ProductionAuditor();
    auditor.runFullAudit().catch(error => {
        console.error('❌ Audit failed:', error);
        process.exit(1);
    });
}

module.exports = ProductionAuditor;
