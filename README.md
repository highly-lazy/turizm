# A3 · Turizm bozori va elektron marketing

«Turizmda elektron tijorat» fanining 3-mavzusi uchun interaktiv dars platformasi (React). O‘qituvchi kompyuteri va proyektorda ishlatishga mo‘ljallangan.

## Imkoniyatlar

- **6 qadamli dars:** sozlamalar → davomat → guruhlar → o‘yinlar → amaliy A3 → natijalar
- **Nazariya o‘yinlari:** test (50 savol), Ha/Yo‘q (40 fikr), atama qidirish (6 × 10 atama)
- **Amaliy A3:** 3-1 … 3-9 topshiriqlar doskasi va 42 savolli jamoaviy tekshiruv
- **100 ballik baholash:** guruh va individual, Excel uchun nusxa, chop etish
- **Sinov rejimi** va savollar banki, klaviatura yorliqlari, dars taymeri

Barcha holat brauzerning `localStorage` xotirasida saqlanadi; server kerak emas.

## Ishga tushirish

```bash
npm install
npm run dev      # ishlab chiqish
npm test         # kontent va mantiq testlari
npm run lint
npm run build    # dist/
```

## Talabalar ro‘yxati

Ro‘yxat shaxsiy ma’lumot bo‘lgani uchun repozitoriyda yo‘q. Ikki yo‘l bor:

- «Davomat» sahifasidagi maydonga ro‘yxatni joylash (har qatorga bitta ism), yoki
- `src/data/roster.local.js` faylini yaratish: `export const DEFAULT_ROSTER = ['Familiya Ism', ...];`

## Tuzilishi

```
src/
├── config/       o‘yinlar va dars qadamlari
├── data/         savollar, topshiriqlar, atamalar, talabalar ro‘yxati
├── lib/          sof mantiq: baholash, reja, navbatlar, atama maydoni
├── store/        Zustand holati (slices/) va interfeys holati
├── hooks/        klaviatura, taymer, o‘yinni boshlash
├── components/   ui/ va layout/
├── features/     sahifalar: settings, attendance, groups, games, practical, results, bank
└── styles/       dizayn tokenlari va uslublar
```

## Texnologiyalar

React 19 · Vite · React Router · Zustand + Immer · Vitest · ESLint
