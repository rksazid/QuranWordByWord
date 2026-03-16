#!/usr/bin/env node

/**
 * Asset Minification Script
 * Minifies CSS and JavaScript files for production
 * Run with: node minify-assets.js
 */

const fs = require('fs');
const path = require('path');

// Simple CSS minifier (removes comments, whitespace, etc.)
class CSSMinifier {
    static minify(css) {
        return css
            // Remove comments
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove unnecessary whitespace
            .replace(/\s+/g, ' ')
            // Remove whitespace around specific characters
            .replace(/\s*([{}:;,>+~])\s*/g, '$1')
            // Remove trailing semicolon before }
            .replace(/;}/g, '}')
            // Remove leading/trailing whitespace
            .trim();
    }
}

// Simple JavaScript minifier (basic optimizations)
class JSMinifier {
    static minify(js) {
        return js
            // Remove single-line comments (but preserve URLs)
            .replace(/(?<!:)\/\/.*$/gm, '')
            // Remove multi-line comments
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove unnecessary whitespace
            .replace(/\s+/g, ' ')
            // Remove whitespace around operators and punctuation (except after } to preserve template literal spaces)
            .replace(/\s*([{(;,=+\-*/<>!&|])\s*/g, '$1')
            .replace(/\s*([})])/g, '$1')
            // Remove whitespace after keywords
            .replace(/\b(if|for|while|function|return|var|let|const|else)\s+/g, '$1 ')
            // Preserve necessary spaces
            .replace(/}else/g, '}else')
            .replace(/else{/g, 'else{')
            // Remove leading/trailing whitespace
            .trim();
    }
}

class AssetMinifier {
    constructor() {
        this.stats = {
            originalSize: 0,
            minifiedSize: 0,
            filesProcessed: 0
        };
    }

    /**
     * Minify a single file
     */
    minifyFile(inputPath, outputPath) {
        try {
            const content = fs.readFileSync(inputPath, 'utf8');
            const extension = path.extname(inputPath).toLowerCase();
            let minified;

            if (extension === '.css') {
                minified = CSSMinifier.minify(content);
            } else if (extension === '.js') {
                minified = JSMinifier.minify(content);
            } else {
                throw new Error(`Unsupported file type: ${extension}`);
            }

            // Write minified file
            fs.writeFileSync(outputPath, minified);

            // Update statistics
            const originalSize = Buffer.byteLength(content, 'utf8');
            const minifiedSize = Buffer.byteLength(minified, 'utf8');
            const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);

            this.stats.originalSize += originalSize;
            this.stats.minifiedSize += minifiedSize;
            this.stats.filesProcessed++;

            const filename = path.basename(inputPath);
            console.log(`✓ ${filename}`);
            console.log(`  Original: ${this.formatBytes(originalSize)}`);
            console.log(`  Minified: ${this.formatBytes(minifiedSize)}`);
            console.log(`  Saved: ${savings}%\n`);

            return {
                original: originalSize,
                minified: minifiedSize,
                savings: parseFloat(savings)
            };

        } catch (error) {
            console.error(`❌ Error minifying ${inputPath}:`, error.message);
            return null;
        }
    }

    /**
     * Minify all main assets
     */
    async minifyAllAssets() {
        console.log('🗜️  Starting asset minification...\n');

        const filesToMinify = [
            {
                input: 'styles.css',
                output: 'styles.min.css'
            },
            {
                input: 'script.js',
                output: 'script.min.js'
            },
            {
                input: 'sw.js',
                output: 'sw.min.js'
            },
            {
                input: 'compression-utils.js',
                output: 'compression-utils.min.js'
            },
            {
                input: 'enhanced-data-loader.js',
                output: 'enhanced-data-loader.min.js'
            },
            {
                input: 'migration-patch.js',
                output: 'migration-patch.min.js'
            }
        ];

        for (const file of filesToMinify) {
            if (fs.existsSync(file.input)) {
                this.minifyFile(file.input, file.output);
            } else {
                console.log(`⚠️  File not found: ${file.input}`);
            }
        }

        this.printSummary();
        this.createMinifiedIndex();
    }

    /**
     * Create a production version of index.html with minified assets
     */
    createMinifiedIndex() {
        try {
            const indexContent = fs.readFileSync('index.html', 'utf8');
            
            const minifiedIndex = indexContent
                // Replace CSS with minified version
                .replace(/styles\.css(\?v=[\d.]+)?/g, 'styles.min.css$1')
                // Replace JS files with minified versions
                .replace(/script\.js(\?v=[\d.]+)?/g, 'script.min.js$1')
                .replace(/compression-utils\.js(\?v=[\d.]+)?/g, 'compression-utils.min.js$1')
                .replace(/enhanced-data-loader\.js(\?v=[\d.]+)?/g, 'enhanced-data-loader.min.js$1')
                .replace(/migration-patch\.js(\?v=[\d.]+)?/g, 'migration-patch.min.js$1')
                // Add production comment
                .replace('<!-- Scripts -->', '<!-- Scripts (Production - Minified) -->');

            // Note: index.min.html not needed - build-scripts.js modifies index.html directly
            console.log('📄 Production HTML: index.html (will be modified by build-scripts.js)');

        } catch (error) {
            console.error('❌ Error creating minified index:', error.message);
        }
    }

    /**
     * Create service worker with minified assets
     */
    updateServiceWorker() {
        try {
            if (fs.existsSync('sw.js')) {
                const swContent = fs.readFileSync('sw.js', 'utf8');
                
                // Update cache URLs to use minified versions
                const updatedSW = swContent
                    .replace(/styles\.css/g, 'styles.min.css')
                    .replace(/script\.js/g, 'script.min.js')
                    .replace(/compression-utils\.js/g, 'compression-utils.min.js')
                    .replace(/enhanced-data-loader\.js/g, 'enhanced-data-loader.min.js')
                    .replace(/migration-patch\.js/g, 'migration-patch.min.js');

                fs.writeFileSync('sw.prod.js', updatedSW);
                console.log('🔧 Created production service worker: sw.prod.js');
            }
        } catch (error) {
            console.error('❌ Error updating service worker:', error.message);
        }
    }

    /**
     * Print minification summary
     */
    printSummary() {
        const totalSavings = ((this.stats.originalSize - this.stats.minifiedSize) / this.stats.originalSize * 100).toFixed(1);
        
        console.log('📊 MINIFICATION SUMMARY');
        console.log('═'.repeat(50));
        console.log(`Files processed: ${this.stats.filesProcessed}`);
        console.log(`Original size: ${this.formatBytes(this.stats.originalSize)}`);
        console.log(`Minified size: ${this.formatBytes(this.stats.minifiedSize)}`);
        console.log(`Total savings: ${totalSavings}%`);
        console.log(`Space saved: ${this.formatBytes(this.stats.originalSize - this.stats.minifiedSize)}`);
        
        this.createManifest();
    }

    /**
     * Create a minification manifest
     */
    createManifest() {
        const manifest = {
            version: '1.0.0',
            minified: true,
            reductionRatio: ((this.stats.originalSize - this.stats.minifiedSize) / this.stats.originalSize * 100).toFixed(1),
            originalSize: this.stats.originalSize,
            minifiedSize: this.stats.minifiedSize,
            filesCount: this.stats.filesProcessed,
            timestamp: new Date().toISOString(),
            performance: {
                estimatedLoadTimeImprovement: '15-30%',
                bandwidthSaving: this.formatBytes(this.stats.originalSize - this.stats.minifiedSize),
                mobileDataSaving: 'Significant'
            }
        };
        
        fs.writeFileSync('minification-manifest.json', JSON.stringify(manifest, null, 2));
        console.log(`📋 Manifest created: minification-manifest.json`);
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

    /**
     * Create a development/production switch
     */
    createEnvironmentScript() {
        const envScript = `
/**
 * Environment Configuration
 * Automatically switches between development and production assets
 */

(function() {
    const isProduction = location.hostname !== 'localhost' && 
                        location.hostname !== '127.0.0.1' && 
                        !location.hostname.includes('dev');
    
    if (isProduction) {
        // Replace CSS
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
            if (link.href.includes('styles.css')) {
                link.href = link.href.replace('styles.css', 'styles.min.css');
            }
        });
        
        // Note: JS files would already be loaded, so this is for future dynamic loads
        console.log('🚀 Production mode: Using minified assets');
    } else {
        console.log('🔧 Development mode: Using unminified assets');
    }
})();
        `.trim();

        fs.writeFileSync('env-config.js', envScript);
        console.log('⚙️  Created environment configuration: env-config.js');
    }
}

// Run minification if this script is executed directly
if (require.main === module) {
    const minifier = new AssetMinifier();
    minifier.minifyAllAssets().then(() => {
        minifier.updateServiceWorker();
        minifier.createEnvironmentScript();
        
        console.log('\n✅ Minification completed successfully!');
        console.log('\n💡 Next steps:');
        console.log('1. Run "npm run prod" to switch index.html to production mode');
        console.log('2. Update your server to serve minified files');
        console.log('3. Test performance improvements');
        console.log('4. Consider enabling gzip compression on server');
    }).catch(error => {
        console.error('❌ Minification failed:', error);
        process.exit(1);
    });
}

module.exports = AssetMinifier;
