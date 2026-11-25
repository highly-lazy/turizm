import { FlaskConical, Music, Pause, Play, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Logo } from '@/components/ui';
import { meta } from '@/data';
import { answeredCount } from '@/lib/scoring';
import { secondsLeft } from '@/lib/session';
import { cx, formatClock } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { toast, useUi } from '@/store/useUi';

function SessionTimer() {
  const session = useStore((s) => s.session);
  const settings = useStore((s) => s.settings);
  const sandbox = useStore((s) => s.sandbox);
  const toggleSession = useStore((s) => s.toggleSession);
  const adjustSession = useStore((s) => s.adjustSession);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!session || session.pausedAt) return;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [session]);

  const left = secondsLeft({ session, settings }, Math.max(now, session?.startedAt ?? 0));
  const running = session && !session.pausedAt;

  function toggle() {
    if (sandbox) return toast('Sinov rejimida dars taymeri ishlamaydi');
    toggleSession();
  }

  return (
    <div className={cx('session', left != null && left <= 300 && 'session--low')} aria-label="Dars taymeri">
      <button type="button" onClick={() => adjustSession(-1)} aria-label="1 daqiqa kamaytirish">−</button>
      <span className="session__time">{formatClock(left ?? settings.duration * 60)}</span>
      <button type="button" onClick={() => adjustSession(1)} aria-label="1 daqiqa qo‘shish">+</button>
      <button type="button" className="session__play" onClick={toggle} aria-label={running ? 'Dars taymerini to‘xtatish' : 'Dars taymerini boshlash'}>
        {running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>
    </div>
  );
}

export function TopBar() {
  const sandbox = useStore((s) => s.sandbox);
  const setSandbox = useStore((s) => s.setSandbox);
  const answered = useStore(answeredCount);
  const music = useUi((s) => s.music);
  const toggleMusic = useUi((s) => s.toggleMusic);

  return (
    <header className="topbar no-print">
      {sandbox && (
        <div className="sandbox">
          <FlaskConical aria-hidden="true" />
          <span><b>Sinov rejimi.</b> Natijalar hisobotga yozilmaydi, to‘g‘ri javob belgilab ko‘rsatiladi.</span>
          <Button size="sm" onClick={() => setSandbox(false)}>Sinovni tugatish</Button>
        </div>
      )}
      <div className="topbar__row">
        <Link to="/" className="brand">
          <Logo />
          <span>
            <b>{meta.topic} · {meta.group}</b>
            <small>{meta.course}</small>
          </span>
        </Link>
        <p className="topbar__title">{meta.title}</p>
        <span className="topbar__count" title="Javob berilgan savollar va doska qatorlari">
          <b>{answered}</b> javob
        </span>
        <SessionTimer />
        <button type="button" className="topbar__btn" onClick={toggleMusic} aria-pressed={music} aria-label="Musiqa">
          {music ? <Music aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
