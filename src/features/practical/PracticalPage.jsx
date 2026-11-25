import { ClipboardCheck, Play, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, PageHeader, Panel, Switch } from '@/components/ui';
import { GAMES } from '@/config/games';
import { boardTasks, practiceQuestions, tasks } from '@/data';
import { useLaunchGame } from '@/hooks/useLaunchGame';
import { estimateMinutes } from '@/lib/planner';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useUi';

const KEEP_ONE = 'Kamida bittasi tanlangan bo‘lishi kerak';

export function PracticalPage() {
  const state = useStore();
  const navigate = useNavigate();
  const { launch, resume } = useLaunchGame();
  const { settings, games, boardRecords } = state;
  const inProgress = games.practice && !games.practice.done;
  const played = Object.keys(state.results.practice).length > 0;
  const toggleSection = (key) => state.toggleSection(key) || toast(KEEP_ONE);

  return (
    <>
      <PageHeader title="Amaliy A3">
        Segmentatsiya, maqsadli guruh, elektron marketing vositalari va keys. Avval doskada bajariladi, so‘ng jamoaviy tekshiruv o‘ynaladi.
      </PageHeader>

      <div className="cols">
        <Panel className="feature-panel" title={GAMES.board.title} hint="Sonli va tanlov kataklari avtomatik tekshiriladi, qisqa javoblarni o‘qituvchi baholaydi.">
          <Switch checked={settings.enabled.board} onChange={() => toggleSection('board')}>Dars rejasida · ~{estimateMinutes(state, 'board')} daqiqa</Switch>
          <Button variant="primary" size="lg" icon={ClipboardCheck} onClick={() => navigate('/doska')}>Doskani ochish</Button>
        </Panel>
        <Panel
          title={GAMES.practice.title}
          hint={`Har guruhga ${settings.rounds.practice} ta savol, javob vaqti ${settings.seconds.practice} s. Savollar pastda tanlangan topshiriqlardan.`}
        >
          <Switch checked={settings.enabled.practice} onChange={() => toggleSection('practice')}>Dars rejasida · ~{estimateMinutes(state, 'practice')} daqiqa</Switch>
          <div className="row">
            {inProgress && <Button variant="primary" size="lg" icon={Play} onClick={() => resume('practice')}>Davom ettirish</Button>}
            <Button
              variant={inProgress ? 'secondary' : 'primary'}
              size="lg"
              icon={inProgress || played ? RotateCcw : Play}
              onClick={() => launch('practice')}
            >
              {inProgress ? 'Yangidan' : played ? 'Qayta o‘ynash' : 'Jamoaviy tekshiruv'}
            </Button>
          </div>
        </Panel>
      </div>

      <Panel title="Topshiriqlar" hint="Belgilangan topshiriqlar jamoaviy tekshiruvga kiradi.">
        <ul className="tasks">
          {tasks.map((task) => {
            const rows = boardTasks[task.id].rows.filter((row) => !row.sample).length;
            const done = Object.keys(boardRecords[task.id] ?? {}).length;
            return (
              <li key={task.id}>
                <input
                  type="checkbox"
                  id={`task-${task.id}`}
                  checked={settings.tasks.includes(task.id)}
                  onChange={() => state.toggleTask(task.id) || toast(KEEP_ONE)}
                />
                <label htmlFor={`task-${task.id}`}>
                  <b className="mono">{task.id}</b> {task.title}
                  <small>{practiceQuestions.filter((q) => q.taskId === task.id).length} savol · doskada {done}/{rows} qator</small>
                </label>
                <Link to={`/doska/${task.id}`}>Doskada ochish</Link>
              </li>
            );
          })}
        </ul>
      </Panel>
    </>
  );
}
