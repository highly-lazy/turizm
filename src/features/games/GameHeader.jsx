import { ArrowLeft, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { GAMES, sectionHome } from '@/config/games';
import { useStore } from '@/store/useStore';

export function GameHeader({ gameKey, active }) {
  const navigate = useNavigate();
  const finishGame = useStore((s) => s.finishGame);
  const { title, subtitle, icon: Icon, color } = GAMES[gameKey];

  return (
    <header className="game-head" style={{ '--c': color }}>
      <Button icon={ArrowLeft} aria-label="Orqaga" onClick={() => navigate(sectionHome(gameKey))} />
      <span className="tile-icon"><Icon aria-hidden="true" /></span>
      <div className="game-head__title">
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
      </div>
      {active && (
        <Button variant="danger-soft" icon={Square} title="Bajarilgan savollar bo‘yicha baho hisoblanadi" onClick={() => finishGame(gameKey)}>
          To‘xtatib hisoblash
        </Button>
      )}
    </header>
  );
}
