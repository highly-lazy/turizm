import { BarChart3, ClipboardList, Gamepad2, GraduationCap, Settings2, Users } from 'lucide-react';

export const STEPS = [
  { path: '/', title: 'Sozlamalar', hint: 'Vaqt va dars rejasi', icon: Settings2 },
  { path: '/davomat', title: 'Davomat', hint: 'Kim darsda', icon: GraduationCap },
  { path: '/guruhlar', title: 'Guruhlar', hint: 'Jamoalar tarkibi', icon: Users },
  { path: '/oyinlar', title: 'O‘yinlar', hint: 'Nazariya: 3 bo‘lim', icon: Gamepad2 },
  { path: '/amaliy', title: 'Amaliy A3', hint: 'Topshiriqlar 3-1 … 3-9', icon: ClipboardList },
  { path: '/natijalar', title: 'Natijalar', hint: '100 ballik hisobot', icon: BarChart3 },
];
