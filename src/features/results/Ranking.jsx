import { MarkBadge } from '@/components/ui';
import { cx, formatNumber } from '@/lib/utils';

/** Reyting ro‘yxati; bir xil ball — bir xil o‘rin. items: {id, name, color, score, detail} */
export function Ranking({ items, showMark }) {
  const sorted = items.slice().sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  return (
    <ol className="ranking">
      {sorted.map((item) => {
        const place = item.score == null ? null : sorted.findIndex((x) => x.score === item.score) + 1;
        return (
          <li key={item.id} className={cx('rank', place && place <= 3 && `rank--${place}`)} style={{ '--c': item.color }}>
            <span className="rank__place">{place ?? '—'}</span>
            <span className="rank__name">
              <b>{item.name}</b>
              <small>{item.detail}</small>
            </span>
            <span className="rank__bar" aria-hidden="true"><i style={{ width: `${item.score ?? 0}%` }} /></span>
            <span className="rank__score">
              {item.score == null ? '—' : formatNumber(item.score)}
              {showMark && <MarkBadge score={item.score} />}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
