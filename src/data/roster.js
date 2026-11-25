/**
 * Talabalar ro‘yxati shaxsiy ma’lumot, shuning uchun git’ga kirmaydi: `roster.local.js` faylida turadi.
 * Fayl bo‘lmasa ro‘yxat bo‘sh boshlanadi va «Davomat» sahifasiga joylanadi.
 */
const local = import.meta.glob('./roster.local.js', { eager: true });

export const DEFAULT_ROSTER = Object.values(local)[0]?.DEFAULT_ROSTER ?? [];
