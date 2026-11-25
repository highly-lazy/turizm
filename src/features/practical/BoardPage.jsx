import { ArrowLeft, ArrowRight, BarChart3, CheckCheck, Eye, EyeOff, Play, Printer } from 'lucide-react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Button, Panel, RichText } from '@/components/ui';
import { boardTasks, findTask, meta, TASK_IDS, tasks } from '@/data';
import { useLaunchGame } from '@/hooks/useLaunchGame';
import { useScrollToActive } from '@/hooks/useScrollToActive';
import { checkedRows, sumRows } from '@/lib/board';
import { cx, groupColor, shortName } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useUi';
import { BoardTable } from './BoardTable';

function ActorBar() {
  const state = useStore();
  const actor = state.boardActor;
  const group = state.groups.find((g) => g.id === actor?.groupId);
  const rows = checkedRows(state);
  const groupsRef = useScrollToActive(actor?.groupId);
  const studentsRef = useScrollToActive(actor?.student);

  return (
    <div className="actor no-print">
      <div ref={groupsRef} className="actor__row" role="group" aria-label="Doskadagi guruh">
        <b>Doskada</b>
        {state.groups.map((g, i) => (
          <button key={g.id} type="button" className="pill" style={{ '--c': groupColor(i) }} aria-pressed={g.id === actor?.groupId} onClick={() => state.setBoardActor(g.id)}>
            {g.name}
          </button>
        ))}
      </div>
      {group?.members.length > 0 && (
        <div ref={studentsRef} className="actor__row" role="group" aria-label="Doskadagi talaba">
          <b>Talaba</b>
          {group.members.map((name) => (
            <button
              key={name}
              type="button"
              className="pill"
              style={{ '--c': groupColor(state.groups.indexOf(group)) }}
              aria-pressed={name === actor.student}
              onClick={() => state.setBoardActor(group.id, name)}
            >
              {shortName(name)} <small>{rows.filter((r) => r.student === name).length}</small>
            </button>
          ))}
        </div>
      )}
      {!group && <p className="muted">Guruh va talabani tanlang → qatorni to‘ldiring → «Tekshirish». Ball shu talabaga va guruhiga yoziladi.</p>}
    </div>
  );
}

function Concepts() {
  return (
    <details className="details concepts">
      <summary>Tayanch tushunchalar va formulalar</summary>
      <dl>
        {meta.concepts.map(([term, definition]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{definition}</dd>
          </div>
        ))}
      </dl>
      <ul className="formula-list">
        {meta.formulas.map((formula) => (
          <li key={formula} className="mono">{formula}</li>
        ))}
      </ul>
    </details>
  );
}

function GroupScores({ taskId }) {
  const state = useStore();
  const rows = checkedRows(state).filter((r) => r.taskId === taskId);
  return state.groups.map((group, i) => {
    const { earned, max } = sumRows(rows.filter((r) => r.groupId === group.id));
    return max > 0 && <span key={group.id} className="chip" style={{ '--c': groupColor(i) }}>{group.name}: {earned}/{max}</span>;
  });
}

export function BoardPage() {
  const { taskId = TASK_IDS[0] } = useParams();
  const state = useStore();
  const navigate = useNavigate();
  const { launch, resume } = useLaunchGame();
  const tabsRef = useScrollToActive(taskId);
  const task = findTask(taskId);
  if (!task) return <Navigate to="/doska" replace />;

  const index = TASK_IDS.indexOf(taskId);
  const next = TASK_IDS[index + 1];
  const keyShown = state.sandbox || state.shownKeys[taskId];
  const practiceActive = state.games.practice && !state.games.practice.done;

  return (
    <>
      <header className="game-head no-print">
        <Button icon={ArrowLeft} aria-label="Orqaga" onClick={() => navigate('/amaliy')} />
        <div className="game-head__title">
          <h1>Doska: {meta.code}-amaliy</h1>
          <p className="muted">Ball doskadagi talabaga va guruhiga yoziladi</p>
        </div>
        <Button icon={Play} className="btn--collapse" onClick={() => (practiceActive ? resume('practice') : launch('practice'))}>Jamoaviy tekshiruv</Button>
        <Button icon={Printer} aria-label="Chop etish" onClick={() => window.print()} />
      </header>

      <nav ref={tabsRef} className="task-tabs no-print" aria-label="Topshiriqlar">
        {tasks.map(({ id, title }) => (
          <Link key={id} to={`/doska/${id}`} title={title} className={cx('mono', id === taskId && 'is-active')} aria-current={id === taskId ? 'page' : undefined}>
            {id}
          </Link>
        ))}
      </nav>

      <Concepts />
      <ActorBar />

      <Panel title={<><span className="mono accent">{task.id}</span> {task.title}</>} hint={boardTasks[taskId].intro}>
        <RichText html={task.context} className="task-context" />
        <BoardTable key={taskId} taskId={taskId} />
        <div className="row no-print">
          <Button variant="primary" icon={CheckCheck} onClick={() => toast(state.checkRemaining(taskId))}>Qolgan qatorlarni tekshirish</Button>
          {!state.sandbox && (
            <Button icon={keyShown ? EyeOff : Eye} onClick={() => state.toggleKey(taskId)}>{keyShown ? 'Kalitni yashirish' : 'Yechim kaliti'}</Button>
          )}
          <GroupScores taskId={taskId} />
        </div>
        {keyShown && (
          <div className="answer-key">
            <h3>Yechim kaliti</h3>
            <RichText html={task.key} />
          </div>
        )}
      </Panel>

      <footer className="page__nav no-print">
        {index > 0 ? <Button icon={ArrowLeft} onClick={() => navigate(`/doska/${TASK_IDS[index - 1]}`)}>{TASK_IDS[index - 1]}</Button> : <span />}
        {next ? (
          <Button variant="primary" iconEnd={ArrowRight} onClick={() => navigate(`/doska/${next}`)}>{next} topshiriq</Button>
        ) : (
          <Button variant="primary" icon={BarChart3} onClick={() => navigate('/natijalar')}>Natijalarga o‘tish</Button>
        )}
      </footer>
    </>
  );
}
