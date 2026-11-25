import { useRef, useState } from 'react';
import { cx } from '@/lib/utils';
import { cellKey, lineBetween } from '@/lib/wordsearch';

const SHAKE_MS = 350;

function cellAt(event, container) {
  const element = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-cell]');
  return element && container.contains(element) ? element.dataset.cell.split(',').map(Number) : null;
}

const same = (a, b) => a[0] === b[0] && a[1] === b[1];

/** 10×10 maydon. Surish yoki ikki marta bosish (boshi va oxiri) bilan belgilanadi. */
export function WordGrid({ board, hidden, active, showMissing, onSubmit }) {
  const [line, setLine] = useState([]);
  const [wrong, setWrong] = useState([]);
  const drag = useRef(null); // { start, moved }
  const anchor = useRef(null); // bosib tanlangan bosh katak

  const found = new Set(board.foundCells);
  const selected = new Set(active ? line.map(cellKey) : []);
  const shaking = new Set(wrong.map(cellKey));
  const missing = new Set(
    showMissing
      ? Object.entries(board.positions).filter(([word]) => !board.found.includes(word)).flatMap(([, cells]) => cells.map(cellKey))
      : [],
  );

  function submit(cells) {
    setLine([]);
    anchor.current = null;
    if (cells.length < 2) return;
    if (onSubmit(cells) === false) {
      setWrong(cells);
      setTimeout(() => setWrong([]), SHAKE_MS);
    }
  }

  function onPointerDown(event) {
    if (!active) return;
    const cell = cellAt(event, event.currentTarget);
    if (!cell) return;
    event.preventDefault();
    if (anchor.current) return submit(lineBetween(anchor.current, cell));
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { start: cell, moved: false, last: cell };
    setLine([cell]);
  }

  function onPointerMove(event) {
    if (!drag.current) return;
    const cell = cellAt(event, event.currentTarget);
    if (!cell || same(cell, drag.current.last)) return;
    drag.current.last = cell;
    if (!same(cell, drag.current.start)) drag.current.moved = true;
    setLine(lineBetween(drag.current.start, cell));
  }

  function onPointerUp() {
    const current = drag.current;
    drag.current = null;
    if (!current) return;
    if (current.moved) return submit(lineBetween(current.start, current.last));
    anchor.current = current.start;
    setLine([current.start]);
  }

  function onPointerCancel() {
    drag.current = null;
    setLine([]);
  }

  return (
    <div
      className="grid"
      data-inactive={!active || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {board.grid.flatMap((row, r) =>
        row.map((letter, c) => {
          const key = `${r},${c}`;
          return (
            <div
              key={key}
              data-cell={key}
              className={cx(
                'cell',
                found.has(key) && 'is-found',
                selected.has(key) && 'is-selected',
                missing.has(key) && !hidden && 'is-missing',
                shaking.has(key) && 'is-shaking',
              )}
            >
              {hidden ? '·' : letter}
            </div>
          );
        }),
      )}
    </div>
  );
}
