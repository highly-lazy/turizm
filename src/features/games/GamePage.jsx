import { Play } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import { Button, Panel } from '@/components/ui';
import { GAMES } from '@/config/games';
import { useLaunchGame } from '@/hooks/useLaunchGame';
import { useStore } from '@/store/useStore';
import { GameHeader } from './GameHeader';
import { GameResult } from './GameResult';
import { QuizGame } from './QuizGame';
import { StatementGame } from './StatementGame';
import { WordGame } from './WordGame';

const VIEWS = { test: QuizGame, practice: QuizGame, tf: StatementGame, words: WordGame };

function Intro({ gameKey }) {
  const { launch } = useLaunchGame();
  const { description, rules } = GAMES[gameKey];
  return (
    <Panel className="intro">
      <p>{description}</p>
      <ul className="rules">
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
      <Button variant="primary" size="lg" icon={Play} onClick={() => launch(gameKey)}>O‘yinni boshlash</Button>
    </Panel>
  );
}

export function GamePage() {
  const { gameKey } = useParams();
  const game = useStore((s) => s.games[gameKey]);
  const View = VIEWS[gameKey];
  if (!View) return <Navigate to="/oyinlar" replace />;

  return (
    <>
      <GameHeader gameKey={gameKey} active={Boolean(game) && !game.done} />
      {!game ? <Intro gameKey={gameKey} /> : game.done ? <GameResult gameKey={gameKey} /> : <View key={gameKey} gameKey={gameKey} />}
    </>
  );
}
