#!/usr/bin/env node

/**
 * Complete Sitemap Generator for Al-Quran Word by Word
 * Generates a comprehensive sitemap.xml with all 114 Surahs
 */

const fs = require('fs');
const path = require('path');

// Surah names and information
const surahData = [
    { number: 1, name: "Al-Fatihah", priority: 0.9 },
    { number: 2, name: "Al-Baqarah", priority: 0.9 },
    { number: 3, name: "Ali-Imran", priority: 0.8 },
    { number: 4, name: "An-Nisa", priority: 0.8 },
    { number: 5, name: "Al-Ma'idah", priority: 0.8 },
    { number: 6, name: "Al-An'am", priority: 0.8 },
    { number: 7, name: "Al-A'raf", priority: 0.8 },
    { number: 8, name: "Al-Anfal", priority: 0.7 },
    { number: 9, name: "At-Tawbah", priority: 0.7 },
    { number: 10, name: "Yunus", priority: 0.7 },
    { number: 11, name: "Hud", priority: 0.7 },
    { number: 12, name: "Yusuf", priority: 0.7 },
    { number: 13, name: "Ar-Ra'd", priority: 0.6 },
    { number: 14, name: "Ibrahim", priority: 0.6 },
    { number: 15, name: "Al-Hijr", priority: 0.6 },
    { number: 16, name: "An-Nahl", priority: 0.6 },
    { number: 17, name: "Al-Isra", priority: 0.6 },
    { number: 18, name: "Al-Kahf", priority: 0.8 }, // Popular
    { number: 19, name: "Maryam", priority: 0.6 },
    { number: 20, name: "Ta-Ha", priority: 0.6 },
    { number: 21, name: "Al-Anbiya", priority: 0.6 },
    { number: 22, name: "Al-Hajj", priority: 0.6 },
    { number: 23, name: "Al-Mu'minun", priority: 0.6 },
    { number: 24, name: "An-Nur", priority: 0.6 },
    { number: 25, name: "Al-Furqan", priority: 0.6 },
    { number: 26, name: "Ash-Shu'ara", priority: 0.6 },
    { number: 27, name: "An-Naml", priority: 0.6 },
    { number: 28, name: "Al-Qasas", priority: 0.6 },
    { number: 29, name: "Al-Ankabut", priority: 0.6 },
    { number: 30, name: "Ar-Rum", priority: 0.6 },
    { number: 31, name: "Luqman", priority: 0.6 },
    { number: 32, name: "As-Sajdah", priority: 0.6 },
    { number: 33, name: "Al-Ahzab", priority: 0.6 },
    { number: 34, name: "Saba", priority: 0.5 },
    { number: 35, name: "Fatir", priority: 0.5 },
    { number: 36, name: "Ya-Sin", priority: 0.8 }, // Popular
    { number: 37, name: "As-Saffat", priority: 0.5 },
    { number: 38, name: "Sad", priority: 0.5 },
    { number: 39, name: "Az-Zumar", priority: 0.5 },
    { number: 40, name: "Ghafir", priority: 0.5 },
    { number: 41, name: "Fussilat", priority: 0.5 },
    { number: 42, name: "Ash-Shura", priority: 0.5 },
    { number: 43, name: "Az-Zukhruf", priority: 0.5 },
    { number: 44, name: "Ad-Dukhan", priority: 0.5 },
    { number: 45, name: "Al-Jathiyah", priority: 0.5 },
    { number: 46, name: "Al-Ahqaf", priority: 0.5 },
    { number: 47, name: "Muhammad", priority: 0.5 },
    { number: 48, name: "Al-Fath", priority: 0.5 },
    { number: 49, name: "Al-Hujurat", priority: 0.5 },
    { number: 50, name: "Qaf", priority: 0.5 },
    { number: 51, name: "Adh-Dhariyat", priority: 0.5 },
    { number: 52, name: "At-Tur", priority: 0.5 },
    { number: 53, name: "An-Najm", priority: 0.5 },
    { number: 54, name: "Al-Qamar", priority: 0.5 },
    { number: 55, name: "Ar-Rahman", priority: 0.7 }, // Popular
    { number: 56, name: "Al-Waqi'ah", priority: 0.6 },
    { number: 57, name: "Al-Hadid", priority: 0.5 },
    { number: 58, name: "Al-Mujadilah", priority: 0.5 },
    { number: 59, name: "Al-Hashr", priority: 0.5 },
    { number: 60, name: "Al-Mumtahanah", priority: 0.5 },
    { number: 61, name: "As-Saff", priority: 0.5 },
    { number: 62, name: "Al-Jumu'ah", priority: 0.6 },
    { number: 63, name: "Al-Munafiqun", priority: 0.5 },
    { number: 64, name: "At-Taghabun", priority: 0.5 },
    { number: 65, name: "At-Talaq", priority: 0.5 },
    { number: 66, name: "At-Tahrim", priority: 0.5 },
    { number: 67, name: "Al-Mulk", priority: 0.7 }, // Popular
    { number: 68, name: "Al-Qalam", priority: 0.5 },
    { number: 69, name: "Al-Haqqah", priority: 0.5 },
    { number: 70, name: "Al-Ma'arij", priority: 0.5 },
    { number: 71, name: "Nuh", priority: 0.5 },
    { number: 72, name: "Al-Jinn", priority: 0.5 },
    { number: 73, name: "Al-Muzzammil", priority: 0.5 },
    { number: 74, name: "Al-Muddaththir", priority: 0.5 },
    { number: 75, name: "Al-Qiyamah", priority: 0.5 },
    { number: 76, name: "Al-Insan", priority: 0.5 },
    { number: 77, name: "Al-Mursalat", priority: 0.5 },
    { number: 78, name: "An-Naba", priority: 0.6 },
    { number: 79, name: "An-Nazi'at", priority: 0.6 },
    { number: 80, name: "Abasa", priority: 0.6 },
    { number: 81, name: "At-Takwir", priority: 0.6 },
    { number: 82, name: "Al-Infitar", priority: 0.6 },
    { number: 83, name: "Al-Mutaffifin", priority: 0.6 },
    { number: 84, name: "Al-Inshiqaq", priority: 0.6 },
    { number: 85, name: "Al-Buruj", priority: 0.6 },
    { number: 86, name: "At-Tariq", priority: 0.6 },
    { number: 87, name: "Al-A'la", priority: 0.7 }, // Frequently recited
    { number: 88, name: "Al-Ghashiyah", priority: 0.6 },
    { number: 89, name: "Al-Fajr", priority: 0.6 },
    { number: 90, name: "Al-Balad", priority: 0.6 },
    { number: 91, name: "Ash-Shams", priority: 0.6 },
    { number: 92, name: "Al-Layl", priority: 0.6 },
    { number: 93, name: "Ad-Duha", priority: 0.7 }, // Frequently recited
    { number: 94, name: "Ash-Sharh", priority: 0.7 }, // Frequently recited
    { number: 95, name: "At-Tin", priority: 0.6 },
    { number: 96, name: "Al-Alaq", priority: 0.7 }, // First revelation
    { number: 97, name: "Al-Qadr", priority: 0.8 }, // Very popular
    { number: 98, name: "Al-Bayyinah", priority: 0.6 },
    { number: 99, name: "Az-Zalzalah", priority: 0.6 },
    { number: 100, name: "Al-Adiyat", priority: 0.6 },
    { number: 101, name: "Al-Qari'ah", priority: 0.6 },
    { number: 102, name: "At-Takathur", priority: 0.6 },
    { number: 103, name: "Al-Asr", priority: 0.7 }, // Popular
    { number: 104, name: "Al-Humazah", priority: 0.6 },
    { number: 105, name: "Al-Fil", priority: 0.6 },
    { number: 106, name: "Quraysh", priority: 0.6 },
    { number: 107, name: "Al-Ma'un", priority: 0.6 },
    { number: 108, name: "Al-Kawthar", priority: 0.7 }, // Shortest chapter
    { number: 109, name: "Al-Kafirun", priority: 0.7 }, // Frequently recited
    { number: 110, name: "An-Nasr", priority: 0.7 }, // Last revelation
    { number: 111, name: "Al-Masad", priority: 0.6 },
    { number: 112, name: "Al-Ikhlas", priority: 0.8 }, // Very popular
    { number: 113, name: "Al-Falaq", priority: 0.7 }, // Mu'awwidhatayn
    { number: 114, name: "An-Nas", priority: 0.7 } // Mu'awwidhatayn
];

function generateCompleteSitemap() {
    const baseUrl = 'https://quranwordbyword.onrender.com';
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">

  <!-- Main Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <mobile:mobile/>
    <image:image>
      <image:loc>${baseUrl}/favicon/android-chrome-512x512.png</image:loc>
      <image:title>Al-Quran Word by Word App Icon</image:title>
      <image:caption>Progressive Web App for reading the Holy Quran with word-by-word Bengali translations</image:caption>
    </image:image>
  </url>

`;

    // Add all 114 Surahs
    surahData.forEach(surah => {
        sitemap += `  <!-- Surah ${surah.number}: ${surah.name} -->
  <url>
    <loc>${baseUrl}/?surah=${surah.number}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${surah.priority}</priority>
    <mobile:mobile/>
  </url>

`;
    });

    sitemap += `</urlset>`;

    // Write to file
    const sitemapPath = path.join(__dirname, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    
    console.log('📊 Complete Sitemap Generated!');
    console.log(`✅ Created: ${sitemapPath}`);
    console.log(`📈 Total URLs: ${surahData.length + 1} (Homepage + ${surahData.length} Surahs)`);
    console.log(`🔗 Base URL: ${baseUrl}`);
    console.log(`📅 Last Modified: ${currentDate}`);
    
    // Generate statistics
    const priorityStats = surahData.reduce((acc, surah) => {
        const priority = surah.priority.toString();
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
    }, {});
    
    console.log('\n📊 Priority Distribution:');
    Object.keys(priorityStats).sort().reverse().forEach(priority => {
        console.log(`   Priority ${priority}: ${priorityStats[priority]} Surahs`);
    });
    
    return sitemapPath;
}

// Run if called directly
if (require.main === module) {
    try {
        generateCompleteSitemap();
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
}

module.exports = { generateCompleteSitemap, surahData };
