#!/usr/bin/env node

/**
 * Generate Hifz Mode Data — Juz and Page Mappings
 * Fetches page boundary data from Quran Foundation API
 * Run with: node scripts/generate-hifz-data.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const API_BASE = 'https://api.quran.com/api/v4';

// Juz (Para) data — 30 juz with their boundaries
// Source: Standard Mushaf (Madinah edition) page boundaries
const JUZ_DATA = [
    { juz: 1, name_ar: "آلم", name_en: "Alif Lam Mim", start: "1:1", end: "2:141", start_page: 1, end_page: 21 },
    { juz: 2, name_ar: "سَيَقُولُ", name_en: "Sayaqul", start: "2:142", end: "2:252", start_page: 22, end_page: 41 },
    { juz: 3, name_ar: "تِلْكَ الرُّسُلُ", name_en: "Tilkar Rusul", start: "2:253", end: "3:92", start_page: 42, end_page: 61 },
    { juz: 4, name_ar: "لَنْ تَنَالُوا", name_en: "Lan Tanaalu", start: "3:93", end: "4:23", start_page: 62, end_page: 81 },
    { juz: 5, name_ar: "وَالْمُحْصَنَاتُ", name_en: "Wal Muhsanat", start: "4:24", end: "4:147", start_page: 82, end_page: 101 },
    { juz: 6, name_ar: "لَا يُحِبُّ اللَّهُ", name_en: "La Yuhibbullah", start: "4:148", end: "5:81", start_page: 102, end_page: 121 },
    { juz: 7, name_ar: "وَإِذَا سَمِعُوا", name_en: "Wa Idha Sami'u", start: "5:82", end: "6:110", start_page: 122, end_page: 141 },
    { juz: 8, name_ar: "وَلَوْ أَنَّنَا", name_en: "Wa Lau Annana", start: "6:111", end: "7:87", start_page: 142, end_page: 161 },
    { juz: 9, name_ar: "قَالَ الْمَلَأُ", name_en: "Qalal Mala'u", start: "7:88", end: "8:40", start_page: 162, end_page: 181 },
    { juz: 10, name_ar: "وَاعْلَمُوا", name_en: "Wa'lamu", start: "8:41", end: "9:92", start_page: 182, end_page: 201 },
    { juz: 11, name_ar: "يَعْتَذِرُونَ", name_en: "Ya'tadhirun", start: "9:93", end: "11:5", start_page: 202, end_page: 221 },
    { juz: 12, name_ar: "وَمَا مِنْ دَابَّةٍ", name_en: "Wa Ma Min Dabbah", start: "11:6", end: "12:52", start_page: 222, end_page: 241 },
    { juz: 13, name_ar: "وَمَا أُبَرِّئُ", name_en: "Wa Ma Ubarri'u", start: "12:53", end: "14:52", start_page: 242, end_page: 261 },
    { juz: 14, name_ar: "رُبَمَا", name_en: "Rubama", start: "15:1", end: "16:128", start_page: 262, end_page: 281 },
    { juz: 15, name_ar: "سُبْحَانَ الَّذِي", name_en: "Subhanal Ladhi", start: "17:1", end: "18:74", start_page: 282, end_page: 301 },
    { juz: 16, name_ar: "قَالَ أَلَمْ", name_en: "Qala Alam", start: "18:75", end: "20:135", start_page: 302, end_page: 321 },
    { juz: 17, name_ar: "اقْتَرَبَ", name_en: "Iqtarab", start: "21:1", end: "22:78", start_page: 322, end_page: 341 },
    { juz: 18, name_ar: "قَدْ أَفْلَحَ", name_en: "Qad Aflaha", start: "23:1", end: "25:20", start_page: 342, end_page: 361 },
    { juz: 19, name_ar: "وَقَالَ الَّذِينَ", name_en: "Wa Qalal Ladhina", start: "25:21", end: "27:55", start_page: 362, end_page: 381 },
    { juz: 20, name_ar: "أَمَّنْ خَلَقَ", name_en: "Amman Khalaq", start: "27:56", end: "29:45", start_page: 382, end_page: 401 },
    { juz: 21, name_ar: "اتْلُ مَا أُوحِيَ", name_en: "Utlu Ma Uhiya", start: "29:46", end: "33:30", start_page: 402, end_page: 421 },
    { juz: 22, name_ar: "وَمَنْ يَقْنُتْ", name_en: "Wa Man Yaqnut", start: "33:31", end: "36:27", start_page: 422, end_page: 441 },
    { juz: 23, name_ar: "وَمَا لِيَ", name_en: "Wa Mali", start: "36:28", end: "39:31", start_page: 442, end_page: 461 },
    { juz: 24, name_ar: "فَمَنْ أَظْلَمُ", name_en: "Faman Adhlam", start: "39:32", end: "41:46", start_page: 462, end_page: 481 },
    { juz: 25, name_ar: "إِلَيْهِ يُرَدُّ", name_en: "Ilaihi Yurad", start: "41:47", end: "45:37", start_page: 482, end_page: 501 },
    { juz: 26, name_ar: "حم", name_en: "Ha Mim", start: "46:1", end: "51:30", start_page: 502, end_page: 521 },
    { juz: 27, name_ar: "قَالَ فَمَا خَطْبُكُمْ", name_en: "Qala Fama Khatbukum", start: "51:31", end: "57:29", start_page: 522, end_page: 541 },
    { juz: 28, name_ar: "قَدْ سَمِعَ اللَّهُ", name_en: "Qad Sami'Allahu", start: "58:1", end: "66:12", start_page: 542, end_page: 561 },
    { juz: 29, name_ar: "تَبَارَكَ", name_en: "Tabaarak", start: "67:1", end: "77:50", start_page: 562, end_page: 581 },
    { juz: 30, name_ar: "عَمَّ", name_en: "Amma", start: "78:1", end: "114:6", start_page: 582, end_page: 604 }
];

async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
}

async function fetchPageData(pageNum) {
    const url = `${API_BASE}/verses/by_page/${pageNum}?language=en&words=false&fields=verse_key`;
    const data = await fetchWithRetry(url);

    if (!data.verses || data.verses.length === 0) return null;

    const verses = data.verses;
    const first = verses[0].verse_key.split(':');
    const last = verses[verses.length - 1].verse_key.split(':');

    return {
        start_surah: parseInt(first[0]),
        start_ayah: parseInt(first[1]),
        end_surah: parseInt(last[0]),
        end_ayah: parseInt(last[1]),
        verse_count: verses.length
    };
}

async function generatePageData() {
    console.log('📄 Generating page data (604 pages)...\n');
    const pages = {};
    const errors = [];

    for (let p = 1; p <= 604; p++) {
        process.stdout.write(`  Page ${p}/604...`);
        try {
            const data = await fetchPageData(p);
            if (data) {
                pages[p] = data;
                console.log(` ✓ (${data.start_surah}:${data.start_ayah} → ${data.end_surah}:${data.end_ayah})`);
            } else {
                console.log(' ✗ No data');
                errors.push({ page: p, error: 'No data returned' });
            }
        } catch (err) {
            console.log(` ✗ ${err.message}`);
            errors.push({ page: p, error: err.message });
        }
        // Rate limiting
        await new Promise(r => setTimeout(r, 150));
    }

    return { pages, errors };
}

async function main() {
    console.log('📖 Generating Hifz Mode data...\n');

    // 1. Write juz data (static, from hardcoded data)
    const juzPath = path.join(DATA_DIR, 'juz_data.json');
    const juzOutput = {};
    JUZ_DATA.forEach(j => {
        const [startSurah, startAyah] = j.start.split(':').map(Number);
        const [endSurah, endAyah] = j.end.split(':').map(Number);
        juzOutput[j.juz] = {
            name_ar: j.name_ar,
            name_en: j.name_en,
            start_surah: startSurah,
            start_ayah: startAyah,
            end_surah: endSurah,
            end_ayah: endAyah,
            start_page: j.start_page,
            end_page: j.end_page
        };
    });
    fs.writeFileSync(juzPath, JSON.stringify(juzOutput, null, 2));
    console.log(`✅ Juz data saved: ${juzPath}\n`);

    // 2. Fetch page data from API
    const { pages, errors } = await generatePageData();

    const pagesPath = path.join(DATA_DIR, 'quran_pages.json');
    fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2));
    console.log(`\n✅ Page data saved: ${pagesPath} (${Object.keys(pages).length} pages)`);

    if (errors.length > 0) {
        console.log(`⚠️ ${errors.length} errors encountered`);
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
