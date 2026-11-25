import { Play, RotateCcw } from 'lucide-react';
import { Button, PageHeader, Switch } from '@/components/ui';
import { GAMES, THEORY_GAMES } from '@/config/games';
import { useLaunchGame } from '@/hooks/useLaunchGame';
import { estimateMinutes } from '@/lib/planner';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useUi';

const perGroup = (key, settings) => {
  if (key === 'words') return `har guruhga ${settings.seconds.words} s`;
  return `har guruhga ${settings.rounds[key]} ta ${key === 'tf' ? 'bosqich' : 'savol'}`;
};

function GameCard({ gameKey, index }) {
  const state = useStore();
  const { launch, resume } = useLaunchGame();
  const { title, description, rules, icon: Icon, color } = GAMES[gameKey];
  const game = state.games[gameKey];
  const inProgress = game && !game.done;
  const played = Object.keys(state.results[gameKey]).length > 0;
  const enabled = state.settings.enabled[gameKey];

  const toggle = () => {
    if (!state.toggleSection(gameKey)) toast('Kamida bitta bo‘lim rejada qolishi kerak');
  };

  return (
    <article className="game-card" style={{ '--c': color }} data-off={!enabled || undefined}>
      <header>
        <span className="tile-icon tile-icon--lg"><Icon aria-hidden="true" /></span>
        <span className="game-card__order">{index + 1} / {THEORY_GAMES.length}</span>
      </header>
      <h2>{title}</h2>
      <p className="muted">{description}</p>
      <ul className="rules">
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
      <p className="game-card__meta">
        {enabled ? `~${estimateMinutes(state, gameKey)} daqiqa · ${perGroup(gameKey, state.settings)}` : 'Bugungi rejada emas'}
        {(inProgress || played) && <b>{inProgress ? 'Davom etmoqda' : 'Natija bor'}</b>}
      </p>
      <Switch checked={enabled} onChange={toggle}>Dars rejasida</Switch>
      <div className="row">
        {inProgress ? (
          <>
            <Button variant="primary" icon={Play} onClick={() => resume(gameKey)}>Davom ettirish</Button>
            <Button icon={RotateCcw} onClick={() => launch(gameKey)}>Yangidan</Button>
          </>
        ) : (
          <Button variant="primary" icon={played ? RotateCcw : Play} onClick={() => launch(gameKey)}>
            {played ? 'Qayta o‘ynash' : 'Boshlash'}
          </Button>
        )}
      </div>
    </article>
  );
}

export function GamesPage() {
  return (
    <>
      <PageHeader title="O‘yinlar">
        3-mavzu nazariyasi: har biri alohida 100 ballik. Tavsiya etilgan tartib 1 → 2 → 3, tugagach keyingi o‘yin taklif qilinadi.
      </PageHeader>
      <div className="game-grid">
        {THEORY_GAMES.map((key, i) => (
          <GameCard key={key} gameKey={key} index={i} />
        ))}
      </div>
    </>
  );
}
