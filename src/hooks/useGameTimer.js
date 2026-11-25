import { useEffect } from 'react';
import { playEffect } from '@/lib/audio';
import { useStore } from '@/store/useStore';

/** O‘yin savoli vaqtini sanaydi va tugaganda onExpire ni chaqiradi. */
export function useGameTimer(key, onExpire) {
  const running = useStore((s) => s.games[key]?.phase === 'running' && !s.games[key].paused && !s.games[key].done);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      useStore.getState().tickGame(key);
      const left = useStore.getState().games[key]?.left;
      if (left === 0) onExpire();
      else if (left <= 5) playEffect('tick');
    }, 1000);
    return () => clearInterval(timer);
  }, [running, key, onExpire]);
}
