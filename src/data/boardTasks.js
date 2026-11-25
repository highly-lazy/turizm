/** Doskadagi interaktiv jadvallar: katak turlari — select, number, text (o‘qituvchi baholaydi), fixed, blank. */

// Variantlar ekranda qat’iy, lekin to‘g‘ri javob birinchi turmaydigan tartibda (FNV xesh asosida)
function stableShuffle(list, key) {
  let hash = 2166136261;
  for (const ch of key) hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619) >>> 0;
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    hash = Math.imul(hash ^ i, 2654435761) >>> 0;
    const j = hash % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const list = (value) => (Array.isArray(value) ? value : [value]);
const select = (id, options, answer) => ({
  id,
  type: 'select',
  options: stableShuffle(options, `${id}|${list(answer).join('|')}`),
  answers: list(answer),
});
/** Birinchi variant to‘g‘ri bo‘lgan tanlov. */
const choose = (id, ...options) => select(id, options, options[0]);
/** Tartibi o‘zgarmaydigan tanlov (A, B, C kabi). */
const pick = (id, options, answer) => ({ id, type: 'select', options, answers: list(answer) });
const number = (id, answer, unit = '', tolerance = 0.001) => ({ id, type: 'number', answer, unit, tolerance });
const text = (id, placeholder) => ({ id, type: 'text', placeholder });
const fixed = (value) => ({ type: 'fixed', value });
const blank = () => ({ type: 'blank' });

/** Moslashtirish jadvali: birinchi qator — namuna. */
function matching(labels, ...columns) {
  return labels.map((label, i) => ({
    id: `m${i + 1}`,
    label,
    sample: i === 0,
    cells: columns.map((options, c) =>
      i === 0 ? fixed(options[0]) : select('xyz'[c], options.slice(1), options[i]),
    ),
  }));
}

const CRITERIA = ['Geografik', 'Demografik', 'Psixografik', 'Xulq-atvor', 'Safar maqsadi', 'Texnologik'];
const CRITERIA_SEGMENTS = [
  'Germaniyadan kelgan sayyohlar',
  '25–34 yoshli, bolali oilalar',
  'Ekologiyani qadrlovchi, faol hayot tarafdorlari',
  'Yiliga 3 marta bron qiladigan doimiy mijozlar',
  'Konferensiya uchun kelganlar',
  'Faqat smartfondan bron qiladiganlar',
];
const CRITERIA_SOURCES = [
  'Sayt tashriflarining mamlakatlari hisoboti',
  'Bron anketasidagi yosh va oila tarkibi',
  'Qadriyat va qiziqishlar so‘rovnomasi',
  'CRM dagi xaridlar tarixi (RFM)',
  '«Safaringiz sababi» savoliga javoblar',
  'Analitikadagi qurilma turi hisoboti',
];

const AUDIENCES = [
  'Yevropalik madaniyat ixlosmandlari',
  'Bolali oilalar',
  'Talaba-yoshlar',
  'Ziyorat turistlari',
  'MICE mijozlari',
  'Keksa sog‘lomlashtirish sayyohlari',
];
const NEEDS = [
  'Tarix va chuqur ma’lumot',
  'Xavfsizlik va bolalar uchun qulaylik',
  'Arzon narx va yorqin taassurot',
  'Diniy amallar uchun sharoit',
  'Zal, texnika va aniq jadval',
  'Davolanish va sokin ritm',
];
const MESSAGES = [
  '«San’atshunos gid bilan Registon siri»',
  '«Bolalarga bepul, oilaviy xona tayyor»',
  '«Hostel + fototur: guruhga 20% chegirma»',
  '«Ziyoratgohlar, halol taom, namozxona»',
  '«200 o‘rinli zal va transfer — bitta shartnoma»',
  '«Sanatoriy: 10 kun shifokor nazoratida»',
];

const TOOLS = ['SEO', 'Kontekst reklama', 'SMM (organik)', 'Email-marketing', 'Influencer', 'Chatbot'];
const STRENGTHS = [
  'Har klikka to‘lovsiz barqaror oqim',
  'Tayyor talabga tez chiqish',
  'Obunachilar bilan muloqot va jamoa',
  'Mavjud bazani qayta xaridga undash',
  'Bloger ishonchidan foydalanish',
  '24/7 tezkor javob',
];
const METRICS = [
  'Organik tashriflar soni',
  'Pullik klikning narxi (CPC) va CPA',
  'Faollik darajasi (like, izoh, saqlash)',
  'Ochilish darajasi va CTOR',
  'Shaxsiy promokod orqali bronlar',
  'Avtomatik yopilgan so‘rovlar ulushi',
];

const CHANNELS = ['Instagram', 'Google qidiruv'];
const SEGMENTS = ['A segment', 'B segment', 'C segment'];
const CASE_CAUSES = [
  'Maqsadli segment aniqlanmagan',
  'Sayt tili asosiy mijozlarga mos emas',
  'Natija «layk» bilan o‘lchanadi, CPA hisoblanmaydi',
  'Google’dan kelgan bronlar soni juda ko‘p',
  'Reklama bir nechta kanalda joylashgan',
  'Mijozlar madaniy turizmga qiziqadi',
];

const CALC = ['Ko‘rsatkich yoki savol', 'Javob', 'Javob 2'];

export const boardTasks = {
  '3-1': {
    intro: 'Sonlarni so‘mda yoki mlrd so‘mda (birligi katakda ko‘rsatilgan) yozing. Oxirgi qatordagi taklifni o‘qituvchi ✔/✘ bilan baholaydi.',
    columns: CALC,
    rows: [
      { id: 'a1', label: 'TAM, mlrd so‘m', cells: [number('x', 800, 'mlrd so‘m'), blank()] },
      { id: 'a2', label: 'SAM: turistlar soni · hajmi', cells: [number('x', 120000, 'turist'), number('y', 240, 'mlrd so‘m')] },
      { id: 'a3', label: 'SOM: turistlar soni · hajmi', cells: [number('x', 6000, 'turist'), number('y', 12, 'mlrd so‘m')] },
      { id: 'a4', label: 'Bozor (turistlar soni) o‘sishi · agentlikning SAM dagi hozirgi ulushi', cells: [number('x', 25, '%'), number('y', 3, '%')] },
      { id: 'a5', label: 'SOM ga yetish uchun yetishmayotgan tushum', cells: [number('x', 4.8, 'mlrd so‘m'), blank()] },
      { id: 'a6', label: 'Agentlik tushumi 10% o‘ssa, bozor 25% o‘sgan holatda ulush nima bo‘ladi? · sababi', cells: [choose('x', 'Kamayadi', 'Oshadi', 'O‘zgarmaydi'), choose('y', 'Agentlik bozordan sekin o‘sdi', 'Agentlik bozordan tez o‘sdi', 'Bozor hajmi qisqardi')] },
      { id: 'a7', label: 'Ulushni oshirish bo‘yicha bitta taklif', cells: [text('x', 'Taklifingiz'), blank()] },
    ],
  },
  '3-2': {
    intro: 'Har mezonga segment misoli va ma’lumot manbasini tanlang. Birinchi qator — namuna.',
    columns: ['Mezon', 'Segment misoli', 'Ma’lumot manbasi'],
    rows: [
      ...matching(CRITERIA, CRITERIA_SEGMENTS, CRITERIA_SOURCES),
      { id: 'b7', label: '«Daromad» qaysi mezon? · «Hayot tarzi» qaysi mezon?', cells: [pick('x', CRITERIA, 'Demografik'), pick('y', CRITERIA, 'Psixografik')] },
      { id: 'b8', label: 'Xabarni eng shaxsiy moslashga imkon beruvchi mezon · asoslang', cells: [pick('x', CRITERIA, 'Xulq-atvor'), text('y', 'Asos')] },
    ],
  },
  '3-3': {
    intro: 'Tortilgan ballni hisoblang (verguldan keyin 2 xona, masalan 4,05), g‘olibni tanlang, so‘ng yangi og‘irliklar bilan qayta hisoblang.',
    columns: ['Ko‘rsatkich', 'A segment', 'B segment', 'C segment'],
    rows: [
      { id: 'c1', label: 'Tortilgan ball', cells: [number('x', 3.55), number('y', 3.4), number('z', 3.95)] },
      { id: 'c2', label: 'G‘olib segment', cells: [pick('x', SEGMENTS, 'C segment'), blank(), blank()] },
      { id: 'c3', label: 'Yangi og‘irliklar bilan ball', cells: [number('x', 3.85), number('y', 3), number('z', 3.65)] },
      { id: 'c4', label: 'Yangi g‘olib', cells: [pick('x', SEGMENTS, 'A segment'), blank(), blank()] },
      { id: 'c5', label: 'A ga dastlab eng katta hissa bergan mezon va hissasi', cells: [choose('x', 'To‘lov qobiliyati', 'Hajm', 'O‘sish sur’ati', 'Yetib borish imkoni'), number('y', 1.25), blank()] },
      { id: 'c6', label: 'G‘olib nega o‘zgardi? (qisqa izoh)', cells: [text('x', 'Sababi'), blank(), blank()] },
    ],
  },
  '3-4': {
    intro: 'Har guruhga asosiy ehtiyoj va taklif xabarini tanlang. Birinchi qator — namuna. Oxirgi qatordagi USP ni o‘qituvchi baholaydi.',
    columns: ['Turistlar guruhi', 'Asosiy ehtiyoj', 'Taklif xabari'],
    rows: [
      ...matching(AUDIENCES, NEEDS, MESSAGES),
      { id: 'd7', label: 'Bitta guruhni tanlab, o‘z USP ingizni yozing', cells: [text('x', 'Guruh nomi'), text('y', 'USP')] },
    ],
  },
  '3-5': {
    intro: 'Har kanal ko‘rsatkichlarini hisoblang. Foizlarni % belgisisiz, summalarni so‘mda yozing.',
    columns: ['Ko‘rsatkich', 'Instagram', 'Google qidiruv'],
    rows: [
      { id: 'e1', label: 'CTR', cells: [number('x', 2, '%'), number('y', 5, '%')] },
      { id: 'e2', label: 'CPC', cells: [number('x', 2000, 'so‘m'), number('y', 6000, 'so‘m')] },
      { id: 'e3', label: 'Konversiya (CR)', cells: [number('x', 2, '%'), number('y', 4, '%')] },
      { id: 'e4', label: 'CPA', cells: [number('x', 100000, 'so‘m'), number('y', 150000, 'so‘m')] },
      { id: 'e5', label: 'Tushum', cells: [number('x', 96000000, 'so‘m'), number('y', 120000000, 'so‘m')] },
      { id: 'e6', label: 'ROAS', cells: [number('x', 12), number('y', 8)] },
      { id: 'e7', label: 'Bitta bron arzonroq kanal · klik bronga ko‘proq aylanadigan kanal', cells: [pick('x', CHANNELS, 'Instagram'), pick('y', CHANNELS, 'Google qidiruv')] },
      { id: 'e8', label: 'Google konversiyasi yuqori bo‘lishining sababi · bitta taklif', cells: [choose('x', 'Odam tayyor niyat bilan qidiradi', 'Ko‘rsatishlar soni ko‘proq', 'Bitta klik narxi arzonroq'), text('y', 'Taklif')] },
    ],
  },
  '3-6': {
    intro: 'Email voronkasini hisoblang. Foizlarni % belgisisiz yozing.',
    columns: CALC,
    rows: [
      { id: 'f1', label: 'Yetkazish darajasi · ochilish darajasi', cells: [number('x', 80, '%'), number('y', 25, '%')] },
      { id: 'f2', label: 'CTOR · klikning bronga aylanishi', cells: [number('x', 20, '%'), number('y', 10, '%')] },
      { id: 'f3', label: 'Tushum · foyda (marja 20%)', cells: [number('x', 18000000, 'so‘m'), number('y', 3600000, 'so‘m')] },
      { id: 'f4', label: 'ROI', cells: [number('x', 260, '%'), blank()] },
      { id: 'f5', label: 'B variant: bronlar soni · qo‘shimcha bronlar', cells: [number('x', 24, 'ta'), number('y', 4, 'ta')] },
      { id: 'f6', label: 'Yetkazish darajasini oshirish chorasi · ochilishni eng ko‘p belgilovchi omil', cells: [choose('x', 'Eskirgan manzillarni tozalash', 'Xatlarni tez-tez yuborish', 'Rasmlar sonini ko‘paytirish'), choose('y', 'Mavzu satri va yuboruvchi nomi', 'Xat ichidagi tugma rangi', 'Saytdagi to‘lov usullari')] },
      { id: 'f7', label: 'Ziyorat turi uchun xat mavzusini yozing', cells: [text('x', 'Mavzu satri'), blank()] },
    ],
  },
  '3-7': {
    intro: 'Summalarni so‘mda yozing; nisbatni verguldan keyin 2 xona aniqlikda (masalan 2,25).',
    columns: CALC,
    rows: [
      { id: 'g1', label: 'CAC', cells: [number('x', 400000, 'so‘m'), blank()] },
      { id: 'g2', label: 'Bitta bron foydasi', cells: [number('x', 300000, 'so‘m'), blank()] },
      { id: 'g3', label: 'LTV · LTV : CAC', cells: [number('x', 1200000, 'so‘m'), number('y', 3)] },
      { id: 'g4', label: 'Birinchi bron CAC ni qoplaydimi? · farqi', cells: [pick('x', ['Ha', 'Yo‘q'], 'Yo‘q'), number('y', 100000, 'so‘m')] },
      { id: 'g5', label: 'Marketing xarajati uchun zararsizlik', cells: [number('x', 200, 'bron'), blank()] },
      { id: 'g6', label: 'Yangi holat: LTV · LTV : CAC', cells: [number('x', 1500000, 'so‘m'), number('y', 3.75)] },
      { id: 'g7', label: 'LTV ni oshiruvchi vosita · bitta taklif', cells: [choose('x', 'Sodiqlik dasturi', 'Banner ko‘rsatishlari', 'Yangi shahar reklamasi'), text('y', 'Taklif')] },
    ],
  },
  '3-8': {
    intro: 'Har vositaga kuchli tomon va asosiy ko‘rsatkichni tanlang. Birinchi qator — namuna.',
    columns: ['Vosita', 'Kuchli tomoni', 'Asosiy ko‘rsatkich'],
    rows: [
      ...matching(TOOLS, STRENGTHS, METRICS),
      { id: 'h7', label: '2 haftada bron kerak: qaysi vosita? · uzoq muddatli bepul oqim: qaysi vosita?', cells: [pick('x', TOOLS, 'Kontekst reklama'), pick('y', TOOLS, 'SEO')] },
      { id: 'h8', label: 'Kichik agentlik uchun 2 ta vositani tanlang va asoslang', cells: [text('x', 'Vositalar'), text('y', 'Asos')] },
    ],
  },
  '3-9': {
    intro: 'Keysni o‘qing: sonlar va tanlovlar avtomatik tekshiriladi, ikkita sabab har xil bo‘lishi kerak. 5 ta taklifni o‘qituvchi baholaydi.',
    columns: CALC,
    rows: [
      { id: 'k1', label: 'CPA: Facebook · Google', cells: [number('x', 400000, 'so‘m'), number('y', 200000, 'so‘m')] },
      { id: 'k2', label: 'O‘rtacha CPA (barcha kanal)', cells: [number('x', 300000, 'so‘m'), blank()] },
      { id: 'k3', label: 'Yangi reja: jami bronlar · qo‘shimcha bronlar', cells: [number('x', 95, 'ta'), number('y', 15, 'ta')] },
      { id: 'k4', label: 'Samarasizlikning ikkita (har xil) sababi', unique: true, cells: [select('x', CASE_CAUSES, CASE_CAUSES.slice(0, 3)), select('y', CASE_CAUSES, CASE_CAUSES.slice(0, 3))] },
      { id: 'k5', label: 'Saytga birinchi navbatda qo‘shiladigan tillar · kuzatiladigan asosiy ko‘rsatkich', cells: [choose('x', 'Nemis va fransuz', 'Xitoy va yapon', 'Faqat o‘zbek'), choose('y', 'CPA va ROAS', 'Layklar soni', 'Postlar soni')] },
      { id: 'k6', label: 'Agentlik uchun 5 ta taklif', cells: [text('x', '5 ta taklif'), blank()] },
    ],
  },
};
