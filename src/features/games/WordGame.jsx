import { useCallback, useEffect, useState } from 'react';
import { Panel, TimerRing } from '@/components/ui';
import { useGameTimer } from '@/hooks/useGameTimer';
import { useHotkeys } from '@/hooks/useHotkeys';
import { celebrate } from '@/lib/celebrate';
import { colorOfGroup, groupById } from '@/lib/groups';
import { cx } from '@/lib/utils';
import { WORDS_PER_SET } from '@/lib/wordsearch';
import { wordsOf } from '@/store/slices/words';
import { useStore } from '@/store/useStore';
import { GameControls, Scoreboard } from './parts';
import { WordGrid } from './WordGrid';

function Clues({ board, phase, sandbox }) {
  const done = phase === 'revealed';
  return (
    <ol className="clues">
      {wordsOf(board).map(({ word, clue }) => {
        const found = board.found.includes(word);
        return (
          <li key={word} className={cx(found && 'is-found', done && !found && 'is-missed')}>
            {(found || done || sandbox) && <b className="mono">{word}</b>}
            <span>{clue}</span>
            <small>{word.length} harf · {word[0]}…</small>
          </li>
        );
      })}
    </ol>
  );
}

function statusText(game, group, found, missed) {
  if (game.phase === 'locked') return `Navbat: ${group.name}. Boshlangach maydon ochiladi va ${game.seconds} soniya vaqt ketadi.`;
  if (game.phase === 'revealed')
    return found >= WORDS_PER_SET
      ? 'Barcha 10 ta atama vaqtidan oldin topildi: 100 ball!'
      : `Vaqt tugadi. ${WORDS_PER_SET} ta atamadan ${found} tasi topildi: ${found * 10} ball.`;
  if (missed) return 'Bu ro‘yxatdagi atama emas, yana urinib ko‘ring.';
  return found ? `Topildi: ${found}/${WORDS_PER_SET}. Davom eting!` : 'Ta’riflar bo‘yicha iloji boricha ko‘p atama toping.';
}

export function WordGame() {
  const state = useStore();
  const game = state.games.words;
  const groupId = game.groupIds[game.turn];
  const group = groupById(state, groupId);
  const board = game.boards[groupId];
  const found = board.found.length;
  const next = game.groupIds[game.turn + 1];
  const [missed, setMissed] = useState(false);
  const { phase } = game;

  useGameTimer('words', useCallback(() => useStore.getState().endWords(), []));

  const complete = phase === 'revealed' && found >= WORDS_PER_SET;
  useEffect(() => {
    if (complete) celebrate();
  }, [complete, groupId]);

  const submit = (cells) => {
    const ok = state.submitLine(cells);
    setMissed(ok === false);
    return ok;
  };

  const act = () => {
    setMissed(false);
    if (phase === 'locked') state.openWords();
    else if (phase === 'revealed') state.nextWords();
  };
  useHotkeys({ space: act, enter: act, p: () => state.togglePause('words') });

  const actionLabel = {
    locked: `${group.name}: boshlash · ${game.seconds} s`,
    running: 'Qidirilmoqda…',
    revealed: next ? `Keyingi guruh: ${groupById(state, next).name}` : 'Natijani ko‘rish',
  }[phase];

  return (
    <>
      <Scoreboard gameKey="words" currentId={groupId} />
      <div className="words" style={{ '--c': colorOfGroup(state, groupId) }}>
        <Panel className="words__board">
          <WordGrid
            key={groupId}
            board={board}
            hidden={phase === 'locked'}
            active={phase === 'running' && !game.paused}
            showMissing={phase === 'revealed' || state.sandbox}
            onSubmit={submit}
          />
          <p className="hint">So‘zni boshidan oxirigacha suring yoki avval boshini, keyin oxirini bosing. Faqat →, ↓ yoki ↘.</p>
        </Panel>
        <Panel>
          <div className="question-head">
            <span className="chip chip--lg">{group.name}</span>
            <span className="muted">{game.turn + 1}/{game.groupIds.length}-guruh</span>
            <b>{found}/{WORDS_PER_SET} · {found * 10} ball</b>
            <TimerRing left={game.left} total={game.seconds} running={phase === 'running'} paused={game.paused} />
          </div>
          <p className={cx('words__status', missed && phase === 'running' && 'is-missed')} role="status">
            {statusText(game, group, found, missed)}
          </p>
          <GameControls gameKey="words" phase={phase} paused={game.paused} onAction={act} actionLabel={actionLabel} actionDisabled={phase === 'running'} />
          <Clues board={board} phase={phase} sandbox={state.sandbox} />
        </Panel>
      </div>
    </>
  );
}
