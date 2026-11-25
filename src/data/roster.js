/**
 * TM-324 guruhi: familiya va ism. To‘liq ism-sharifli ro‘yxat kerak bo‘lsa, git’ga kirmaydigan
 * `roster.local.js` fayli ishlatiladi (bo‘lsa, shu ro‘yxat o‘rniga o‘qiladi).
 */
const PUBLIC_ROSTER = [
  'Abdullayeva Munisa',
  'Amonkulov Jafar',
  'Berdiqulova Muhabbat',
  'Fayzullayeva Zebo',
  'Hayitmurodov Sunnatillo',
  'Iskandarov Zikirillo',
  'Jahonqulov Jaloliddin',
  'Mamatqulov Shohrux',
  'Mavlonova Dilafro‘z',
  'Namozov Risqitillo',
  'Odilova Gavhar',
  'O‘rinova Dilbar',
  'Pirmatov Nursaidbek',
  'Ravshanova Go‘zal',
  'Raxmonov Ulugbek',
  'Raxmonova Gulsanam',
  'Razzokov Avazbek',
  'Safaraliyev Behzod',
  'Tursunov Lutfulla',
  'Umarov Xumoyun',
  'Uzokova Mehribon',
  'Xabibullayev Saydullo',
  'Xaqqulov Shukurullo',
  'Xushvaqtova Gulhayo',
  'Yovkochev Islomjon',
];

const local = import.meta.glob('./roster.local.js', { eager: true });

export const DEFAULT_ROSTER = Object.values(local)[0]?.DEFAULT_ROSTER ?? PUBLIC_ROSTER;
