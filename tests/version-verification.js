#!/usr/bin/env node

/**
 * Version Verification Test
 * Ensures all version references are synchronized across the application
 */

const fs = require('fs');
const path = require('path');

class VersionVerifier {
    constructor() {
        this.rootDir = path.join(__dirname, '..');
        this.expectedVersion = '3.0.0';
        this.issues = [];
        this.passed = 0;
        this.failed = 0;
    }

    async verifyAllVersions() {
        console.log('🔍 VERSION VERIFICATION TEST\n');
        console.log(`Expected Version: ${this.expectedVersion}`);
        console.log('='.repeat(60));

        this.verifyPackageJson();
        this.verifyManifestJson();
        this.verifyHtmlFiles();
        this.verifyServiceWorker();
        
        this.generateReport();
    }

    verifyPackageJson() {
        console.log('\n📦 Checking package.json...');
        try {
            const packagePath = path.join(this.rootDir, 'package.json');
            const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            
            if (pkg.version === this.expectedVersion) {
                console.log(`  ✅ Package version: ${pkg.version}`);
                this.passed++;
            } else {
                console.log(`  ❌ Package version: ${pkg.version} (expected ${this.expectedVersion})`);
                this.issues.push(`Package.json version mismatch: ${pkg.version}`);
                this.failed++;
            }
        } catch (error) {
            console.log(`  ❌ Error reading package.json: ${error.message}`);
            this.failed++;
        }
    }

    verifyManifestJson() {
        console.log('\n📱 Checking manifest.json...');
        try {
            const manifestPath = path.join(this.rootDir, 'manifest.json');
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            
            if (manifest.version === this.expectedVersion) {
                console.log(`  ✅ Manifest version: ${manifest.version}`);
                this.passed++;
            } else {
                console.log(`  ❌ Manifest version: ${manifest.version || 'not set'} (expected ${this.expectedVersion})`);
                this.issues.push(`Manifest.json version mismatch: ${manifest.version}`);
                this.failed++;
            }
        } catch (error) {
            console.log(`  ❌ Error reading manifest.json: ${error.message}`);
            this.failed++;
        }
    }

    verifyHtmlFiles() {
        console.log('\n🌐 Checking HTML files...');
        const htmlFiles = ['index.html'];
        
        for (const htmlFile of htmlFiles) {
            try {
                const htmlPath = path.join(this.rootDir, htmlFile);
                if (fs.existsSync(htmlPath)) {
                    const content = fs.readFileSync(htmlPath, 'utf8');
                    
                    console.log(`  📄 ${htmlFile}:`);
                    
                    // Check for version parameters (?v=x.x.x)
                    const versionMatches = content.match(/\?v=([\d.]+)/g) || [];
                    const uniqueVersions = [...new Set(versionMatches.map(match => match.replace('?v=', '')))];
                    
                    let htmlPassed = true;
                    for (const version of uniqueVersions) {
                        if (version === this.expectedVersion) {
                            console.log(`    ✅ Asset version: v=${version}`);
                        } else {
                            console.log(`    ❌ Asset version: v=${version} (expected ${this.expectedVersion})`);
                            this.issues.push(`${htmlFile} has wrong asset version: v=${version}`);
                            htmlPassed = false;
                        }
                    }
                    
                    // Check for app version displays in HTML
                    const appVersionMatches = content.match(/<strong>Version:?\s*<\/strong>\s*([\d.]+)|<strong>Version\s*([\d.]+)<\/strong>/g) || [];
                    for (const match of appVersionMatches) {
                        const versionMatch = match.match(/([\d.]+)/);
                        if (versionMatch) {
                            const displayVersion = versionMatch[1];
                            if (displayVersion === this.expectedVersion) {
                                console.log(`    ✅ App version display: ${displayVersion}`);
                            } else {
                                console.log(`    ❌ App version display: ${displayVersion} (expected ${this.expectedVersion})`);
                                this.issues.push(`${htmlFile} has wrong app version display: ${displayVersion}`);
                                htmlPassed = false;
                            }
                        }
                    }
                    
                    if (htmlPassed && (uniqueVersions.length > 0 || appVersionMatches.length > 0)) {
                        this.passed++;
                    } else if (uniqueVersions.length === 0 && appVersionMatches.length === 0) {
                        console.log(`    ⚠️ No version references found`);
                        this.issues.push(`${htmlFile} has no version references`);
                        this.failed++;
                    } else {
                        this.failed++;
                    }
                }
            } catch (error) {
                console.log(`  ❌ Error reading ${htmlFile}: ${error.message}`);
                this.failed++;
            }
        }
    }

    verifyServiceWorker() {
        console.log('\n⚙️ Checking Service Worker...');
        try {
            const swPath = path.join(this.rootDir, 'sw.min.js');
            if (fs.existsSync(swPath)) {
                const content = fs.readFileSync(swPath, 'utf8');
                
                // Check cache name version
                const cacheMatch = content.match(/CACHE_NAME\s*=\s*['"`]quran-word-by-word-v([\d.]+)['"`]/);
                
                if (cacheMatch) {
                    const swVersion = cacheMatch[1];
                    if (swVersion === this.expectedVersion) {
                        console.log(`  ✅ Service Worker cache: v${swVersion}`);
                        this.passed++;
                    } else {
                        console.log(`  ❌ Service Worker cache: v${swVersion} (expected ${this.expectedVersion})`);
                        this.issues.push(`Service Worker cache version mismatch: v${swVersion}`);
                        this.failed++;
                    }
                } else {
                    console.log(`  ❌ Service Worker cache version not found`);
                    this.issues.push('Service Worker cache version not found');
                    this.failed++;
                }
            } else {
                console.log(`  ❌ Service Worker file not found`);
                this.failed++;
            }
        } catch (error) {
            console.log(`  ❌ Error reading service worker: ${error.message}`);
            this.failed++;
        }
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 VERSION VERIFICATION REPORT');
        console.log('='.repeat(60));
        
        console.log(`✅ Tests Passed: ${this.passed}`);
        console.log(`❌ Tests Failed: ${this.failed}`);
        
        if (this.failed === 0) {
            console.log('\n🎉 ALL VERSION REFERENCES SYNCHRONIZED!');
            console.log(`🚀 App version ${this.expectedVersion} is consistent across all files`);
        } else {
            console.log('\n🚨 VERSION INCONSISTENCIES FOUND:');
            for (const issue of this.issues) {
                console.log(`   • ${issue}`);
            }
        }
        
        console.log('\n💡 Use "npm run version:status" to check version status');
        console.log('='.repeat(60));
    }
}

// CLI execution
if (require.main === module) {
    const verifier = new VersionVerifier();
    verifier.verifyAllVersions();
}

module.exports = VersionVerifier;
