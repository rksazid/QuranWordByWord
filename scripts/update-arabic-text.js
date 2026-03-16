#!/usr/bin/env node

/**
 * Update Arabic Text with Uthmani Script (includes waqf/stop marks)
 * Fetches from Quran Foundation API and updates surah JSON files.
 * Run with: node scripts/update-arabic-text.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'surahs');
const API_BASE = 'https://api.quran.com/api/v4';

// 14 mandatory sajdah locations (surah:ayah)
const SAJDAH_VERSES = {
    '7:206': true, '13:15': true, '16:50': true, '17:109': true,
    '19:58': true, '22:18': true, '22:77': true, '25:60': true,
    '27:26': true, '32:15': true, '38:24': true, '41:38': true,
    '53:62': true, '84:21': true, '96:19': true
};

// Waqf mark descriptions for reference
const WAQF_MARKS = {
    '\u06D6': 'Mandatory stop (waqf lazim)',
    '\u06D7': 'Permissible stop (waqf jaiz)',
    '\u06D8': 'Preferred stop (waqf murakhkhas)',
    '\u06D9': 'Stop sign of mim (waqf mim)',
    '\u06DA': 'Start sign (sal)',
    '\u06DB': 'Small high three dots',
    '\u06DC': 'Small high seen',
    '\u06DD': 'End of ayah mark',
    '\u06DE': 'Start of rub el hizb',
    '\u06DF': 'Small high rounded zero',
    '\u06E0': 'Small high upright rectangle',
    '\u06E9': 'Place of sajdah'
};

async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (err) {
            if (i === retries - 1) throw err;
            console.log(`  Retry ${i + 1}/${retries}...`);
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
}

async function fetchUthmaniText(surahId) {
    const url = `${API_BASE}/quran/verses/uthmani?chapter_number=${surahId}`;
    const data = await fetchWithRetry(url);

    // API returns { verses: [{ id, verse_key, text_uthmani }, ...] }
    const verseMap = {};
    if (data.verses) {
        data.verses.forEach(v => {
            const ayahNum = v.verse_key.split(':')[1];
            verseMap[ayahNum] = v.text_uthmani;
        });
    }
    return verseMap;
}

async function updateSurahFile(surahId) {
    const paddedId = surahId.toString().padStart(3, '0');
    const filePath = path.join(DATA_DIR, `surah_${paddedId}.json`);

    if (!fs.existsSync(filePath)) {
        console.log(`  ⚠️ File not found: ${filePath}`);
        return false;
    }

    const surahData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const uthmaniVerses = await fetchUthmaniText(surahId);

    let updated = 0;
    for (const [verseNum, verseData] of Object.entries(surahData.verses)) {
        if (verseNum === '0') continue; // Skip bismillah

        if (uthmaniVerses[verseNum]) {
            verseData.arabic_text_uthmani = uthmaniVerses[verseNum];
            updated++;
        }

        // Add sajdah marker
        const key = `${surahId}:${verseNum}`;
        if (SAJDAH_VERSES[key]) {
            verseData.has_sajdah = true;
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(surahData, null, 2));
    return updated;
}

async function main() {
    console.log('📖 Updating Arabic text with Uthmani script...\n');

    let totalUpdated = 0;
    const errors = [];

    for (let i = 1; i <= 114; i++) {
        process.stdout.write(`  Surah ${i}/114...`);
        try {
            const count = await updateSurahFile(i);
            totalUpdated += count;
            console.log(` ✓ (${count} verses)`);
        } catch (err) {
            console.log(` ✗ Error: ${err.message}`);
            errors.push({ surah: i, error: err.message });
        }
        // Rate limiting: small delay between requests
        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\n✅ Done! Updated ${totalUpdated} verses across 114 surahs.`);
    if (errors.length > 0) {
        console.log(`⚠️ ${errors.length} errors:`);
        errors.forEach(e => console.log(`  Surah ${e.surah}: ${e.error}`));
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
