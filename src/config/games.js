import { Calculator, ClipboardCheck, Crosshair, MousePointerClick, Search } from 'lucide-react';

/** Baholanadigan bo‘limlar, hisobotdagi ustunlar tartibida. */
export const SECTION_KEYS = ['test', 'tf', 'words', 'practice', 'board'];

/** Nazariy o‘yinlar (4-qadam). */
export const THEORY_GAMES = ['test', 'tf', 'words'];

/** Har savolga bitta talaba shaxsan javob beradigan bo‘limlar. */
export const PERSONAL_KEYS = ['test', 'tf', 'practice'];

/** Dars rejasida har bir talabaga mo‘ljallangan savollar soni. */
export const QUESTIONS_PER_STUDENT = 2;

export const GAMES = {
  test: {
    title: 'Nishonni top: test',
    short: 'Test',
    subtitle: 'Navbat bilan · bir xil qiyinlik · +10 ball',
    icon: Crosshair,
    color: '#0b7a75',
    description:
      'Har davrada barcha guruhlarga bir xil qiyinlikdagi savol tushadi. Savol avval o‘qiladi, variantlar ochilishi bilan vaqt ketadi.',
    rules: ['To‘g‘ri javob: +10 ball', 'Noto‘g‘ri yoki javobsiz: 0 ball', 'Javob beradigan talaba ekranda ko‘rinadi'],
  },
  tf: {
    title: 'Klik: Ha yoki Yo‘q',
    short: 'Ha/Yo‘q',
    subtitle: 'Fikr to‘g‘rimi? Ball bosqich sayin oshadi',
    icon: MousePointerClick,
    color: '#b93a1c',
    description:
      'Ekranda mavzu bo‘yicha fikr chiqadi: HA (to‘g‘ri) yoki YO‘Q (xato)? Atama, formula yoki bosqich ataylab almashtirilgan bo‘lishi mumkin.',
    rules: ['Ball bosqich sayin oshadi: 10, 20, 30…', 'Har bosqichda hamma guruhga teng ball', 'Shaxsiy hisobda har savol 10 ball'],
  },
  words: {
    title: 'Atama qidirish',
    short: 'Atama',
    subtitle: 'Guruhlar ketma-ket · 10×10 maydon · 10 ta atama',
    icon: Search,
    color: '#5a3ec8',
    description:
      'Har guruhga bozor va marketing mavzusidan alohida 10 ta atamali maydon. Guruh belgilangan vaqt ichida ta’riflar bo‘yicha atamalarni topadi.',
    rules: ['Topilgan har atama: 10 ball', 'Atamalar faqat →, ↓ yoki ↘ yozilgan', 'Natija guruhning har a’zosiga yoziladi'],
  },
  practice: {
    title: 'Marketing laboratoriyasi: A3',
    short: 'Amaliy A3',
    subtitle: 'Tahlil, hisob-kitob va keys · +10 ball',
    icon: Calculator,
    color: '#8a5300',
    description:
      'A3-amaliy mashg‘ulot topshiriqlari bo‘yicha jamoaviy tekshiruv: ekranda topshiriq ma’lumotlari va savol. Guruh hisoblaydi, so‘ng variantni tanlaydi.',
    rules: ['To‘g‘ri javob: +10 ball', 'Topshiriqlar 3-1 → 3-9 tartibida', 'Ma’lumotlar savol yonida ko‘rinadi'],
  },
  board: {
    title: 'Doska: A3-amaliy topshiriqlar',
    short: 'Doska',
    subtitle: 'Interaktiv jadval · talaba nomi bilan',
    icon: ClipboardCheck,
    color: '#0d2b33',
    description: 'Topshiriqlar doskada bajariladi, ball doskadagi talabaga va guruhiga yoziladi.',
    rules: [],
  },
};

/** Berilgan bo‘limdan keyingi, dars rejasiga kiritilgan bo‘lim. */
export function nextSection(key, enabled) {
  return SECTION_KEYS.slice(SECTION_KEYS.indexOf(key) + 1).find((k) => enabled[k]) ?? null;
}

export const sectionPath = (key) => (key === 'board' ? '/doska' : `/oyin/${key}`);
export const sectionHome = (key) => (THEORY_GAMES.includes(key) ? '/oyinlar' : '/amaliy');
