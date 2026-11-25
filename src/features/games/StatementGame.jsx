import { Check, KeyRound, X } from 'lucide-react';
import { useCallback } from 'react';
import { Level, Panel, TimerRing } from '@/components/ui';
import { statements } from '@/data';
import { useGameTimer } from '@/hooks/useGameTimer';
import { useHotkeys } from '@/hooks/useHotkeys';
import { colorOfGroup, groupById } from '@/lib/groups';
import { cx } from '@/lib/utils';
import { currentGroupId } from '@/store/slices/quiz';
import { currentStage, stagePoints } from '@/store/slices/statements';
import { useStore } from '@/store/useStore';
import { GameControls, PointsSplit, Respondent, Scoreboard } from './parts';

function Ladder({ game, stage }) {
  const stageDone = game.phase === 'revealed' && game.turn % game.groupIds.length === game.groupIds.length - 1;
  return (
    <ol className="ladder">
      {Array.from({ length: game.rounds }, (_, i) => (
        <li key={i} className={cx((i < stage || (i === stage && stageDone)) && 'is-done', i === stage && 'is-current')}>
          {i + 1}-bosqich <b>{stagePoints(i)}</b>
        </li>
      ))}
    </ol>
  );
}

function Verdict({ game, statement, groupName }) {
  const { entry, personal, respondent } = game.last;
  return (
    <div className="outcome outcome--center" data-ok={entry.correct} role="status">
      <p className={cx('verdict', statement.answer ? 'verdict--yes' : 'verdict--no')}>{statement.answer ? 'HA, TO‘G‘RI' : 'YO‘Q, XATO'}</p>
      <h3>
        {game.pick == null
          ? 'Javob berilmadi · 0 ball'
          : entry.correct
            ? `To‘g‘ri javob! +${entry.earned} ball`
            : `Noto‘g‘ri · 0 ball (javob: ${game.pick ? 'HA' : 'YO‘Q'})`}
      </h3>
      <PointsSplit respondent={respondent} personal={personal.earned} groupName={groupName} earned={entry.earned} />
      <p>{statement.note}</p>
    </div>
  );
}

export function StatementGame() {
  const state = useStore();
  const game = state.games.tf;
  const groupId = currentGroupId(game);
  const group = groupById(state, groupId);
  const stage = currentStage(game);
  const statement = statements[game.question];
  const { phase } = game;
  const disabled = phase !== 'running' || game.paused;

  useGameTimer('tf', useCallback(() => useStore.getState().revealStatement(), []));

  const act = () => {
    if (phase === 'locked') state.openStatement();
    else if (phase === 'running') state.revealStatement();
    else state.nextStatement();
  };
  const yes = () => state.revealStatement(true);
  const no = () => state.revealStatement(false);

  useHotkeys({
    space: act,
    enter: act,
    p: () => state.togglePause('tf'),
    backspace: state.undoStatement,
    h: yes,
    1: yes,
    y: no,
    2: no,
  });

  const actionLabel = {
    locked: `Javob tugmalarini ochish · ${game.seconds} s`,
    running: 'Javob yo‘q — ochish (0 ball)',
    revealed: game.turn + 1 >= game.total ? 'Natijani ko‘rish' : 'Keyingi guruh',
  }[phase];

  return (
    <>
      <Scoreboard gameKey="tf" currentId={groupId} />
      <Ladder game={game} stage={stage} />
      <Panel className="stage__main" style={{ '--c': colorOfGroup(state, groupId) }}>
        <div className="question-head">
          <span className="chip chip--lg">{group.name}</span>
          <span className="muted">{stage + 1}-bosqich · {stagePoints(stage)} ball · savol {game.turn + 1}/{game.total}</span>
          <Level value={statement.level} />
          <TimerRing left={game.left} total={game.seconds} running={phase === 'running'} paused={game.paused} />
        </div>
        <Respondent gameKey="tf" groupId={groupId} />
        <p className="question question--center">{statement.text}</p>
        {state.sandbox && phase !== 'revealed' && (
          <p className="sandbox-key"><KeyRound aria-hidden="true" /> {statement.answer ? 'HA' : 'YO‘Q'}</p>
        )}
        {phase === 'revealed' ? (
          <Verdict game={game} statement={statement} groupName={group.name} />
        ) : (
          <div className="yes-no">
            <button type="button" className="yes-no__yes" disabled={disabled} onClick={yes}><Check aria-hidden="true" /> HA</button>
            <button type="button" className="yes-no__no" disabled={disabled} onClick={no}><X aria-hidden="true" /> YO‘Q</button>
          </div>
        )}
        <GameControls gameKey="tf" phase={phase} paused={game.paused} onUndo={state.undoStatement} onAction={act} actionLabel={actionLabel} />
        <p className="hint">Space — keyingi qadam · H yoki 1 — HA · Y yoki 2 — YO‘Q · P — pauza · Backspace — bekor qilish</p>
      </Panel>
    </>
  );
}
