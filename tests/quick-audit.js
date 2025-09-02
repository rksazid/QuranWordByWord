#!/usr/bin/env node

/**
 * Quick Production Audit
 * Memory-efficient validation for production readiness
 */

const fs = require('fs');
const path = require('path');

class QuickAudit {
    constructor() {
        this.rootDir = path.join(__dirname, '..');
        this.issues = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, condition, message) {
        if (condition) {
            console.log(`✅ ${name}: ${message}`);
            this.passed++;
        } else {
            console.log(`❌ ${name}: ${message}`);
            this.issues.push(`${name}: ${message}`);
            this.failed++;
        }
    }

    runQuickAudit() {
        console.log('🔍 QUICK PRODUCTION AUDIT\n');

        // Test 1: Critical files exist
        console.log('📁 Checking Critical Files...');
        const criticalFiles = [
            'index.html',
            'styles.min.css',
            'script.min.js', 
            'sw.min.js',
            'manifest.json'
        ];

        for (const file of criticalFiles) {
            const exists = fs.existsSync(path.join(this.rootDir, file));
            this.test(`File: ${file}`, exists, exists ? 'Found' : 'Missing');
        }

        // Test 2: HTML uses minified assets
        console.log('\n🗜️ Checking Minification Usage...');
        const htmlPath = path.join(this.rootDir, 'index.html');
        if (fs.existsSync(htmlPath)) {
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            
            this.test('CSS Minification', htmlContent.includes('styles.min.css'), 
                     htmlContent.includes('styles.min.css') ? 'Using minified CSS' : 'Using original CSS');
            
            this.test('JS Minification', htmlContent.includes('script.min.js'), 
                     htmlContent.includes('script.min.js') ? 'Using minified JS' : 'Using original JS');
            
            this.test('SW Minification', htmlContent.includes('sw.min.js'), 
                     htmlContent.includes('sw.min.js') ? 'Using minified SW' : 'Using original SW');
        }

        // Test 3: Service Worker consistency
        console.log('\n⚙️ Checking Service Worker...');
        const swPath = path.join(this.rootDir, 'sw.min.js');
        if (fs.existsSync(swPath)) {
            const swContent = fs.readFileSync(swPath, 'utf8');
            
            this.test('SW Caches CSS', swContent.includes('styles.min.css'), 
                     swContent.includes('styles.min.css') ? 'Caches minified CSS' : 'Caches wrong CSS');
            
            this.test('SW Caches JS', swContent.includes('script.min.js'), 
                     swContent.includes('script.min.js') ? 'Caches minified JS' : 'Caches wrong JS');
        }

        // Test 4: File sizes (minification effectiveness)
        console.log('\n📊 Checking File Sizes...');
        const sizePairs = [
            ['styles.css', 'styles.min.css'],
            ['script.js', 'script.min.js']
        ];

        for (const [original, minified] of sizePairs) {
            const origPath = path.join(this.rootDir, original);
            const minPath = path.join(this.rootDir, minified);
            
            if (fs.existsSync(origPath) && fs.existsSync(minPath)) {
                const origSize = fs.statSync(origPath).size;
                const minSize = fs.statSync(minPath).size;
                const isSmaller = minSize < origSize;
                const savings = ((origSize - minSize) / origSize * 100).toFixed(1);
                
                this.test(`Size: ${minified}`, isSmaller, 
                         isSmaller ? `${savings}% smaller than original` : 'Not smaller than original');
            }
        }

        // Test 5: Data compression
        console.log('\n🗜️ Checking Data Compression...');
        const compressedDir = path.join(this.rootDir, 'data-compressed');
        const dataDir = path.join(this.rootDir, 'data');
        
        this.test('Data Directory', fs.existsSync(dataDir), 
                 fs.existsSync(dataDir) ? 'Original data exists' : 'Original data missing');
        
        this.test('Compressed Data', fs.existsSync(compressedDir), 
                 fs.existsSync(compressedDir) ? 'Compressed data available' : 'Compressed data missing');

        // Test 6: Compression utilities
        console.log('\n🛠️ Checking Optimization Tools...');
        const utilFiles = [
            'compression-utils.min.js',
            'enhanced-data-loader.min.js',
            'migration-patch.min.js'
        ];

        for (const file of utilFiles) {
            const exists = fs.existsSync(path.join(this.rootDir, file));
            this.test(`Utility: ${file}`, exists, exists ? 'Available' : 'Missing');
        }

        // Final report
        this.generateReport();
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📋 QUICK AUDIT RESULTS');
        console.log('='.repeat(60));
        
        console.log(`✅ Tests Passed: ${this.passed}`);
        console.log(`❌ Tests Failed: ${this.failed}`);
        
        if (this.failed === 0) {
            console.log('\n🎉 ALL TESTS PASSED!');
            console.log('🚀 Production deployment ready!');
        } else {
            console.log('\n🚨 ISSUES FOUND:');
            for (const issue of this.issues) {
                console.log(`   • ${issue}`);
            }
            console.log('\n⚠️ Fix issues before deployment');
        }
        
        console.log('\n💡 Run detailed tests with: npm run test:performance');
        console.log('='.repeat(60));
    }
}

// CLI execution
if (require.main === module) {
    const audit = new QuickAudit();
    audit.runQuickAudit();
}

module.exports = QuickAudit;
