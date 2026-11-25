import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout, FocusLayout, ScrollToTop } from '@/components/layout/AppLayout';
import { Overlays, SessionWatcher } from '@/components/layout/Overlays';
import { AttendancePage } from '@/features/attendance/AttendancePage';
import { GamePage } from '@/features/games/GamePage';
import { GamesPage } from '@/features/games/GamesPage';
import { GroupsPage } from '@/features/groups/GroupsPage';
import { BoardPage } from '@/features/practical/BoardPage';
import { PracticalPage } from '@/features/practical/PracticalPage';
import { ResultsPage } from '@/features/results/ResultsPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { useBlurOnPointerClick } from '@/hooks/useHotkeys';

const BankPage = lazy(() => import('@/features/bank/BankPage'));

export function App() {
  useBlurOnPointerClick();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <SessionWatcher />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<SettingsPage />} />
          <Route path="davomat" element={<AttendancePage />} />
          <Route path="guruhlar" element={<GroupsPage />} />
          <Route path="oyinlar" element={<GamesPage />} />
          <Route path="amaliy" element={<PracticalPage />} />
          <Route path="natijalar" element={<ResultsPage />} />
        </Route>
        <Route element={<FocusLayout />}>
          <Route path="oyin/:gameKey" element={<GamePage />} />
          <Route path="doska/:taskId?" element={<BoardPage />} />
          <Route path="savollar" element={<BankPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Overlays />
    </BrowserRouter>
  );
}
