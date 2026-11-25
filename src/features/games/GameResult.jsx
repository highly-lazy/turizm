import { BarChart3, Play, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Panel } from '@/components/ui';
import { GAMES, nextSection } from '@/config/games';
import { Ranking } from '@/features/results/Ranking';
import { useLaunchGame } from '@/hooks/useLaunchGame';
import { celebrate } from '@/lib/celebrate';
import { colorOfGroup, groupById } from '@/lib/groups';
import { grade } from '@/lib/scoring';
import { useStore } from '@/store/useStore';

const detail = (key, result) => {
  if (!result) return 'o‘ynamagan';
  if (key === 'words') return `${result.found}/10 atama`;
  return `${result.correct}/${result.answered} to‘g‘ri · ${result.earned}/${result.max} ball`;
};

export function GameResult({ gameKey }) {
  const state = useStore();
  const navigate = useNavigate();
  const { launch, resume } = useLaunchGame();
  const next = nextSection(gameKey, state.settings.enabled);
  const played = Object.keys(state.results[gameKey]).length > 0;

  useEffect(() => {
    if (played) celebrate();
    // Faqat natija ekrani ochilganda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = state.games[gameKey].groupIds.map((id) => ({
    id,
    name: groupById(state, id).name,
    color: colorOfGroup(state, id),
    score: grade(state, gameKey, id),
    detail: detail(gameKey, state.results[gameKey][id]),
  }));

  const nextInProgress = next && next !== 'board' && state.games[next] && !state.games[next].done;

  return (
    <Panel title="O‘yin natijasi" hint="Baho faqat bajarilgan savollar bo‘yicha 100 ballik tizimda hisoblandi.">
      <Ranking items={items} />
      <div className="row">
        {next && (
          <Button variant="primary" size="lg" icon={Play} onClick={() => (nextInProgress ? resume(next) : launch(next))}>
            Keyingi: {GAMES[next].title}
          </Button>
        )}
        <Button size="lg" variant={next ? 'secondary' : 'primary'} icon={BarChart3} onClick={() => navigate('/natijalar')}>Umumiy natijalar</Button>
        <Button size="lg" icon={RotateCcw} onClick={() => launch(gameKey)}>Qayta o‘ynash</Button>
      </div>
    </Panel>
  );
}
