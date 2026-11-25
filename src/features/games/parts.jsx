import { Mic, Pause, Play, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { QUESTIONS_PER_STUDENT } from '@/config/games';
import { useScrollToActive } from '@/hooks/useScrollToActive';
import { colorOfGroup, groupById } from '@/lib/groups';
import { grade, studentAnswers } from '@/lib/scoring';
import { cx, shortName } from '@/lib/utils';
import { useStore } from '@/store/useStore';

const detail = (key, result) => {
  if (!result) return key === 'words' ? 'hali o‘ynamagan' : '0 savol';
  return key === 'words' ? `${result.found}/10 atama` : `${result.correct}/${result.answered} to‘g‘ri`;
};

/** Guruhlar hisob taxtasi. */
export function Scoreboard({ gameKey, currentId }) {
  const state = useStore();
  const ref = useScrollToActive(currentId);
  return (
    <ul ref={ref} className="scoreboard">
      {state.games[gameKey].groupIds.map((id) => {
        const score = grade(state, gameKey, id);
        return (
          <li key={id} className={cx('score', id === currentId && 'is-current')} style={{ '--c': colorOfGroup(state, id) }}>
            <span className="score__name">{groupById(state, id).name}</span>
            <span className="score__value">{score ?? '—'}<small>/100</small></span>
            <span className="score__detail">{detail(gameKey, state.results[gameKey][id])}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Savollar yo‘li: bajarilgan, joriy va qolgan. */
export function ProgressTrack({ total, done, current }) {
  return (
    <div className="track" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} aria-label="Savollar">
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={cx(i < done && 'is-done', i === current && i >= done && 'is-current')} />
      ))}
    </div>
  );
}

/** Javob beruvchi talaba; savol ochilguncha almashtirish mumkin. */
export function Respondent({ gameKey, groupId }) {
  const state = useStore();
  const game = state.games[gameKey];
  const group = groupById(state, groupId);
  if (!game.respondent) return null;

  const revealed = game.phase === 'revealed';
  const locked = game.phase !== 'locked';
  const answered = studentAnswers(state, game.respondent);

  return (
    <div className="respondent" style={{ '--c': colorOfGroup(state, groupId) }}>
      <Mic aria-hidden="true" />
      <div>
        <small>
          {revealed ? 'Javob berdi' : 'Javob beradi'} · {revealed ? answered : answered + 1}-savoli (reja: {QUESTIONS_PER_STUDENT} ta)
        </small>
        <b>{game.respondent}</b>
      </div>
      {group.members.length > 1 && !locked && (
        <label className="respondent__swap">
          <span className="sr-only">Boshqa talabani tanlash</span>
          <select value={game.respondent} onChange={(e) => state.setRespondent(gameKey, e.target.value)}>
            {group.members.map((name) => (
              <option key={name} value={name}>{shortName(name)} ({studentAnswers(state, name)})</option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}

export function GameControls({ gameKey, phase, paused, onUndo, actionLabel, onAction, actionDisabled }) {
  const togglePause = useStore((s) => s.togglePause);
  return (
    <div className="controls">
      {phase === 'revealed' && onUndo && (
        <Button icon={Undo2} onClick={onUndo} title="Backspace">Bekor qilish</Button>
      )}
      {phase === 'running' && (
        <Button icon={paused ? Play : Pause} onClick={() => togglePause(gameKey)} title="P">{paused ? 'Davom' : 'Pauza'}</Button>
      )}
      <Button variant="primary" size="xl" onClick={onAction} disabled={actionDisabled}>{actionLabel}</Button>
    </div>
  );
}

/** Javobdan keyin: shaxsiy va guruh ballari. */
export function PointsSplit({ respondent, personal, groupName, earned }) {
  return (
    <p className="points">
      {respondent && <span><b>{shortName(respondent)}</b> +{personal} shaxsiy</span>}
      <span><b>{groupName}</b> +{earned} guruh bali</span>
    </p>
  );
}
