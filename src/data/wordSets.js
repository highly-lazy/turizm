// Har to‘plam 10 ta atama. Atama: 3–10 harf, faqat A–Z (10×10 maydonga sig‘ishi uchun).
const RAW = [
  {
    title: 'Turizm bozori',
    words: {
      BOZOR: 'Sotuvchi va xaridorlar uchrashadigan iqtisodiy munosabatlar maydoni',
      TALAB: 'Xaridorlarning ma’lum narxda sotib olishga tayyorligi',
      TAKLIF: 'Korxonalar bozorga chiqargan xizmatlar jami',
      ULUSH: 'Korxona tushumining butun bozordagi qismi, foizda',
      MAVSUM: 'Yil davomida talab keskin oshadigan yoki tushadigan davr',
      RAQOBAT: 'Korxonalarning bir mijoz uchun kurashi',
      SWOT: 'Kuchli, zaif tomonlar, imkoniyat va xavflar tahlili',
      TREND: 'Bozor o‘zgarishining barqaror yo‘nalishi',
      NARX: 'Xizmat qiymatining puldagi ifodasi',
      HAJM: 'Bozorning pul yoki mijozlar sonidagi kattaligi',
    },
  },
  {
    title: 'Segmentatsiya',
    words: {
      SEGMENT: 'Ehtiyoji o‘xshash xaridorlar guruhi',
      MEZON: 'Bozorni guruhlarga ajratish belgisi',
      HUDUD: 'Geografik segmentatsiyada turist kelgan joy',
      YOSH: 'Demografik mezon: mijoz necha yilda tug‘ilgani bilan bog‘liq',
      DAROMAD: 'To‘lov qobiliyatini belgilaydigan demografik mezon',
      OILA: 'Bolali sayyohlar segmenti shu birlikka asoslanadi',
      MOTIV: 'Safarga undovchi ichki sabab',
      ODAT: 'Xulq-atvor mezoni: doim takrorlanadigan xarid usuli',
      SODIQLIK: 'Mijozning bir brendga qayta-qayta qaytishi',
      NISHA: 'Tor va maxsus ehtiyojli bozor bo‘lagi',
    },
  },
  {
    title: 'Maqsadli guruh va pozitsiyalash',
    words: {
      PERSONA: 'Maqsadli mijozning umumlashgan portreti',
      TARGETING: 'STP modelida maqsadli segmentni tanlash bosqichi',
      PROFIL: 'Segmentning asosiy tavsiflari to‘plami',
      EHTIYOJ: 'Mijoz qondirmoqchi bo‘lgan yetishmovchilik',
      QIYMAT: 'Mijoz xizmatdan oladigan foyda',
      BREND: 'Korxonani tanitadigan nom, belgi va obro‘',
      SHIOR: 'Brend g‘oyasini ifodalovchi qisqa jumla',
      OBRAZ: 'Brendning mijoz ongidagi ko‘rinishi (imij)',
      BYUDJET: 'Marketingga ajratilgan mablag‘ rejasi',
      AFZALLIK: 'Raqobatchidan ustun tomon',
    },
  },
  {
    title: 'Elektron marketing vositalari',
    words: {
      SEO: 'Saytni organik qidiruvda yuqoriga chiqarish',
      SMM: 'Ijtimoiy tarmoqlar marketingi qisqartmasi',
      EMAIL: 'Elektron pochta orqali xat yuborish kanali',
      BANNER: 'Saytdagi grafik reklama bloki',
      BLOG: 'Foydali maqolalar chiqadigan sayt bo‘limi',
      CHATBOT: 'Savollarga avtomatik javob beradigan dastur',
      VIDEO: 'Reels va YouTube’dagi kontent shakli',
      POST: 'Ijtimoiy tarmoqdagi bitta yozuv',
      KUPON: 'Chegirma beradigan kod yoki talon',
      INFLUENCER: 'Auditoriyasi ishonadigan bloger',
    },
  },
  {
    title: 'Samaradorlik ko‘rsatkichlari',
    words: {
      CTR: 'Kliklar : ko‘rsatishlar × 100%',
      CPC: 'Bitta klik narxi',
      CPA: 'Bitta maqsadli harakat (bron) narxi',
      ROI: 'Foyda va xarajat nisbatidan qaytim, foizda',
      ROAS: 'Tushum : reklama xarajati',
      CAC: 'Bitta yangi mijozni jalb qilish narxi',
      LTV: 'Mijozning umr davomidagi qiymati',
      KPI: 'Asosiy samaradorlik ko‘rsatkichi',
      KLIK: 'Reklama yoki havolani bosish',
      KONVERSIYA: 'Tashrifning bronga aylanish ulushi',
    },
  },
  {
    title: 'Sayt, auditoriya va tahlil',
    words: {
      LANDING: 'Bitta maqsadli harakatga qaratilgan sahifa',
      COOKIE: 'Brauzerda saqlanadigan kichik ma’lumot fayli',
      ANALITIKA: 'Tashrif va xulq ma’lumotlarini o‘rganish',
      TRAFIK: 'Saytga tashriflar oqimi',
      LID: 'Kontaktini qoldirgan potensial mijoz',
      AUDIT: 'Marketing holatini tizimli tekshirish',
      SPAM: 'Roziliksiz ommaviy xat',
      OBUNA: 'Xat va yangiliklarni olishga rozilik',
      QAMROV: 'Kontentni ko‘rgan odamlar soni',
      SHARH: 'Mijozning xizmat haqidagi onlayn fikri',
    },
  },
];

const LEVELS = [4, 4, 4.5, 4.5, 5];

export const wordSets = RAW.map(({ title, words }) => ({
  title,
  words: Object.entries(words).map(([word, clue]) => ({
    word,
    clue,
    level: LEVELS[Math.min(LEVELS.length - 1, Math.floor(word.length / 2) - 1)],
  })),
}));
