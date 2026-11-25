import { BarChart3, ClipboardList, Gamepad2, GraduationCap, Settings2, Users } from 'lucide-react';

export const STEPS = [
  { path: '/', title: 'Sozlamalar', short: 'Sozlash', hint: 'Vaqt va dars rejasi', icon: Settings2 },
  { path: '/davomat', title: 'Davomat', short: 'Davomat', hint: 'Kim darsda', icon: GraduationCap },
  { path: '/guruhlar', title: 'Guruhlar', short: 'Guruhlar', hint: 'Jamoalar tarkibi', icon: Users },
  { path: '/oyinlar', title: 'O‘yinlar', short: 'O‘yinlar', hint: 'Nazariya: 3 bo‘lim', icon: Gamepad2 },
  { path: '/amaliy', title: 'Amaliy A3', short: 'Amaliy', hint: 'Topshiriqlar 3-1 … 3-9', icon: ClipboardList },
  { path: '/natijalar', title: 'Natijalar', short: 'Natijalar', hint: '100 ballik hisobot', icon: BarChart3 },
];
