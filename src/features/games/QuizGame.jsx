import { KeyRound, Lock } from 'lucide-react';
import { useCallback } from 'react';
import { Level, Panel, RichText, TimerRing } from '@/components/ui';
import { findTask, questionsOf } from '@/data';
import { useGameTimer } from '@/hooks/useGameTimer';
import { useHotkeys } from '@/hooks/useHotkeys';
import { colorOfGroup, groupById } from '@/lib/groups';
import { cx } from '@/lib/utils';
import { currentGroupId } from '@/store/slices/quiz';
import { useStore } from '@/store/useStore';
import { GameControls, PointsSplit, ProgressTrack, Respondent, Scoreboard } from './parts';

const LETTERS = ['A', 'B', 'C', 'D'];

function Options({ game, question, sandbox, onPick }) {
  const revealed = game.phase === 'revealed';
  return (
    <div className="options">
      {game.order.map((optionIndex, i) => {
        const correct = optionIndex === 0;
        return (
          <button
            key={optionIndex}
            type="button"
            className={cx('option', revealed && (correct ? 'is-correct' : i === game.pick ? 'is-wrong' : 'is-dim'))}
            disabled={revealed || game.paused}
            onClick={() => onPick(i)}
          >
            <kbd>{LETTERS[i]}</kbd>
            <span>{question.options[optionIndex]}</span>
            {sandbox && correct && !revealed && <KeyRound className="option__key" aria-label="To‘g‘ri javob" />}
          </button>
        );
      })}
    </div>
  );
}

function AnswerWall({ game }) {
  const state = useStore();
  const perGroup = Math.ceil(game.total / game.groupIds.length);
  return (
    <div className="wall">
      <h3>Javoblar taxtasi</h3>
      {game.groupIds.map((id) => {
        const history = game.history[id] ?? [];
        return (
          <div key={id} className="wall__row" style={{ '--c': colorOfGroup(state, id) }}>
            <span>{groupById(state, id).name}</span>
            <span className="wall__cells">
              {Array.from({ length: perGroup }, (_, i) => (
                <i key={i} className={cx(i < history.length && (history[i] ? 'is-correct' : 'is-wrong'))} />
              ))}
            </span>
          </div>
        );
      })}
      <p className="muted">Baho = olingan ball ÷ (10 × savollar) × 100. Manfiy ball yo‘q.</p>
    </div>
  );
}

function Outcome({ game, question, groupName }) {
  const { entry, respondent } = game.last;
  return (
    <div className="outcome" data-ok={entry.correct} role="status">
      <h3>{game.pick == null ? 'Javob berilmadi · 0 ball' : entry.correct ? 'To‘g‘ri! +10 ball' : 'Noto‘g‘ri · 0 ball'}</h3>
      <PointsSplit respondent={respondent} personal={entry.earned} groupName={groupName} earned={entry.earned} />
      <p><b>To‘g‘ri javob: {question.options[0]}.</b> {question.note}</p>
    </div>
  );
}

export function QuizGame({ gameKey }) {
  const state = useStore();
  const game = state.games[gameKey];
  const groupId = currentGroupId(game);
  const group = groupById(state, groupId);
  const question = questionsOf(gameKey)[game.question];
  const round = Math.floor(game.turn / game.groupIds.length) + 1;
  const { phase } = game;
  const revealed = phase === 'revealed';
  const task = gameKey === 'practice' ? findTask(question.taskId) : null;

  useGameTimer(gameKey, useCallback(() => useStore.getState().revealQuiz(gameKey), [gameKey]));

  const pick = (i) => state.revealQuiz(gameKey, i);
  const act = () => {
    if (phase === 'locked') state.openOptions(gameKey);
    else if (phase === 'running') state.revealQuiz(gameKey);
    else state.nextQuiz(gameKey);
  };

  useHotkeys({
    space: act,
    enter: act,
    p: () => state.togglePause(gameKey),
    backspace: () => state.undoQuiz(gameKey),
    ...Object.fromEntries(
      LETTERS.flatMap((letter, i) => [[letter.toLowerCase(), () => pick(i)], [String(i + 1), () => pick(i)]]),
    ),
  });

  const actionLabel = {
    locked: `Variantlarni ochish · ${game.seconds} s`,
    running: 'Javob yo‘q — ochish (0 ball)',
    revealed: game.turn + 1 >= game.total ? 'Natijani ko‘rish' : 'Keyingi guruh',
  }[phase];

  return (
    <>
      <Scoreboard gameKey={gameKey} currentId={groupId} />
      <ProgressTrack total={game.total} done={game.turn + (revealed ? 1 : 0)} current={game.turn} />
      <div className={cx('stage', task && 'stage--wide')} style={{ '--c': colorOfGroup(state, groupId) }}>
        <Panel className="stage__side">
          {task && (
            <>
              <h3><span className="mono">{task.id}</span> {task.title}</h3>
              <RichText html={task.context} />
            </>
          )}
          <AnswerWall game={game} />
        </Panel>
        <Panel className="stage__main">
          <div className="question-head">
            <span className="chip chip--lg">{group.name}</span>
            <span className="muted">{round}-davra · savol {game.turn + 1}/{game.total}</span>
            <Level value={question.level} />
            <TimerRing left={game.left} total={game.seconds} running={phase === 'running'} paused={game.paused} />
          </div>
          <Respondent gameKey={gameKey} groupId={groupId} />
          <p className="question">{question.question}</p>
          {phase === 'locked' ? (
            <div className="locked">
              <Lock aria-hidden="true" />
              <p>Savolni o‘qing{task ? ', hisoblang' : ' va o‘ylang'}. Variantlar ochilishi bilan vaqt ketadi.</p>
            </div>
          ) : (
            <Options game={game} question={question} sandbox={state.sandbox} onPick={pick} />
          )}
          {revealed && <Outcome game={game} question={question} groupName={group.name} />}
          <GameControls
            gameKey={gameKey}
            phase={phase}
            paused={game.paused}
            onUndo={() => state.undoQuiz(gameKey)}
            onAction={act}
            actionLabel={actionLabel}
          />
          <p className="hint">Space — keyingi qadam · A–D — variant · P — pauza · Backspace — bekor qilish</p>
        </Panel>
      </div>
    </>
  );
}
