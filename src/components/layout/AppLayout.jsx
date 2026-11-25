import { ArrowLeft, ArrowRight, Trophy } from 'lucide-react';
import { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { STEPS } from '@/config/steps';
import { useHotkeys } from '@/hooks/useHotkeys';
import { cx } from '@/lib/utils';
import { useUi } from '@/store/useUi';
import { TopBar } from './TopBar';

/** Dars qadamlari qobig‘i: chapda qadamlar, o‘ngda sahifa. */
export function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const openSheet = useUi((s) => s.openSheet);
  const current = STEPS.findIndex((step) => step.path === pathname);
  const previous = STEPS[current - 1];
  const next = STEPS[current + 1];

  useHotkeys({
    arrowleft: () => previous && navigate(previous.path),
    arrowright: () => next && navigate(next.path),
  });

  return (
    <>
      <TopBar />
      <div className="shell">
        <nav className="rail no-print" aria-label="Dars qadamlari">
          <ol>
            {STEPS.map(({ path, title, hint, icon: Icon }, i) => (
              <li key={path}>
                <NavLink to={path} end className={({ isActive }) => cx('rail__item', isActive && 'is-active', i < current && 'is-past')}>
                  <span className="rail__icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="rail__text">
                    <b>{title}</b>
                    <small>{hint}</small>
                  </span>
                </NavLink>
              </li>
            ))}
          </ol>
        </nav>
        <main className="page">
          <Outlet />
          <footer className="page__nav no-print">
            {previous ? (
              <Button icon={ArrowLeft} onClick={() => navigate(previous.path)}>{previous.title}</Button>
            ) : (
              <span />
            )}
            <span className="muted">Klaviaturada ← → bilan ham o‘tiladi</span>
            {next ? (
              <Button variant="primary" iconEnd={ArrowRight} onClick={() => navigate(next.path)}>{next.title}</Button>
            ) : (
              <Button variant="primary" icon={Trophy} onClick={() => openSheet('final')}>Yakuniy natija</Button>
            )}
          </footer>
        </main>
      </div>
    </>
  );
}

/** O‘yin va doska: to‘liq kenglikdagi ish maydoni. */
export function FocusLayout() {
  return (
    <>
      <TopBar />
      <main className="focus">
        <Outlet />
      </main>
    </>
  );
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Qiymat qaytarilmaydi: yangi brauzerlarda scrollTo Promise qaytaradi
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
