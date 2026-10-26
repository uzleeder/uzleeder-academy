/* ==========================================================================
   ENG_BOOKS_EXTRA — o'quvchining o'z PDF kitoblari (2026-10)
   --------------------------------------------------------------------------
     ra — Pre-IELTS Reading Accelerator: 35 matn (167 bet PDF)
     s1 — IELTS Listening Section 1 to'plami (Cambridge testlaridan, 36 bet skaner)

   Kitoblar matni va savollari bu yerda YO'Q — ular mualliflik huquqi bilan
   himoyalangan. Faqat mundarija (sarlavha + bet raqami — fakt) va jadval.
   O'quvchi o'z PDF'ini shu brauzerga biriktiradi (IndexedDB, serverga
   chiqmaydi); platforma kerakli betni ochadi va natijani (x/y) yozadi.

   Jadval: 25-okt → 10-fev ichida. ra — har 3 kunda 1 matn (25-okt dan,
   35-matn 4-fevralda); s1 — har 6 kunda 1 to'plam (26-okt dan, 18-to'plam
   5-fevralda). Natija IELTS Mission "kitob ishi"ga ham yoziladi.
   ========================================================================== */
window.ENG_BOOKS_EXTRA = {
  ra: {
    id: 'ra', skill: 'reading', icon: 'doc',
    title: 'Pre-IELTS Reading Accelerator',
    tag: { uz: '35 matn · har 3 kunda 1', en: '35 texts · one every 3 days' },
    desc: { uz: "IELTS formatidagi qisqa matnlar va savollar (TRUE/FALSE/NOT GIVEN, moslashtirish, to'ldirish). Har matn ~20 daqiqa. Kitobda javoblar kaliti yo'q — javobni matndan dalil bilan tekshiring.", en: 'Short IELTS-format passages with questions (TRUE/FALSE/NOT GIVEN, matching, completion). About 20 minutes each. The book has no answer key — check each answer against evidence in the text.' },
    unitName: { uz: 'matn', en: 'text' },
    start: '2026-10-25', every: 3, defTotal: 10, min: 20,
    pdfOffset: 2,            // PDF beti = kitob beti + 2 (muqova va mundarija)
    units: [
      [1, 'An Early Brain Map', 1], [2, 'Brain Mapping Today', 5], [3, 'What Time Is It?', 10], [4, 'Time Zones', 14],
      [5, 'Harmful and Helpful Bacteria', 18], [6, 'Fighting Bacteria', 22], [7, 'Changing a Traditional Way of Life', 27], [8, 'Changing the Future', 31],
      [9, 'Skyscrapers', 35], [10, 'The Growth of Cities', 39], [11, 'Food Traditions', 43], [12, 'Preserving Foods', 47],
      [13, 'Bar Codes', 51], [14, '2-D Bar Codes', 55], [15, 'Museum Theft', 59], [16, 'A Bold Thief', 63],
      [17, 'Hydroponics', 67], [18, 'Farming in Many Places', 71], [19, 'Sun, Wind, and Water', 75], [20, 'Using Renewable Energy Sources', 79],
      [21, 'The History of the Pencil', 84], [22, 'The History of Tea', 89], [23, 'A Brief History of Humans and Food', 94], [24, 'The History of the Poster', 99],
      [25, 'The History of Glass', 105], [26, 'The History of the Picnic', 110], [27, 'The History of Bicycles', 115], [28, 'The History of the Guitar', 120],
      [29, 'The History of the Chicken', 125], [30, 'The History of Cakes at Weddings', 130], [31, "The Early History of Scott and Bowne's Cod Liver Oil", 135], [32, 'The History of the Globe Theatre', 140],
      [33, 'The History of Dolls', 145], [34, 'The History of Building Telegraph Lines', 150], [35, 'The History and Impact of the Potato', 155]
    ].map(function (x) { return { n: x[0], title: x[1], page: x[2] }; })
  },
  s1: {
    id: 's1', skill: 'listening', icon: 'headphones',
    title: 'IELTS Listening — Section 1',
    tag: { uz: "~18 to'plam · har 6 kunda 1", en: '~18 sets · one every 6 days' },
    desc: { uz: "Cambridge testlaridan yig'ilgan Section 1 topshiriqlari (forma, jadval, eslatma to'ldirish; 10 savol). Audio va javoblar kaliti PDF ichida yo'q — o'sha Cambridge kitobining audiosi va kaliti kerak.", en: 'Section 1 tasks collected from Cambridge tests (form, table, note completion; 10 questions). The PDF has no audio or answer key — you need the audio and key of the matching Cambridge book.' },
    unitName: { uz: "to'plam", en: 'set' },
    start: '2026-10-26', every: 6, defTotal: 10, min: 15,
    pdfOffset: 0,
    /* Skanerlangan fayl: taxminiy bo'linish — har to'plam 2 bet. Agar topshiriq
       boshqa betdan boshlansa, PDF'da shu betlar atrofidan toping. */
    units: Array.apply(null, Array(18)).map(function (_, i) { return { n: i + 1, title: 'Section 1 · PDF ' + (2 * i + 1) + '–' + (2 * i + 2), page: 2 * i + 1 }; })
  }
};
