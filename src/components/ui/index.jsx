import { Minus, Pause, Plus, Star, StarHalf } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { mark } from '@/lib/scoring';
import { clamp, cx } from '@/lib/utils';

export function Button({ variant = 'secondary', size, icon: Icon, iconEnd: IconEnd, className, children, ...props }) {
  return (
    <button type="button" className={cx('btn', `btn--${variant}`, size && `btn--${size}`, !children && 'btn--icon', className)} {...props}>
      {Icon && <Icon aria-hidden="true" />}
      {children && <span>{children}</span>}
      {IconEnd && <IconEnd aria-hidden="true" />}
    </button>
  );
}

export function Panel({ title, hint, actions, className, children, ...props }) {
  return (
    <section className={cx('panel', className)} {...props}>
      {(title || actions) && (
        <header className="panel__head">
          <div>
            {title && <h2>{title}</h2>}
            {hint && <p className="muted">{hint}</p>}
          </div>
          {actions && <div className="row no-print">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, children, actions }) {
  return (
    <header className="page-head">
      <div>
        <h1>{title}</h1>
        {children && <p className="muted">{children}</p>}
      </div>
      {actions && <div className="row no-print">{actions}</div>}
    </header>
  );
}

/** Son maydoni: yozilayotganda erkin, Enter yoki fokus ketganda chegaraga moslanadi. */
export function NumberField({ label, unit, value, min, max, step = 1, onChange }) {
  const [draft, setDraft] = useState(null);

  function commit() {
    const number = parseInt(draft, 10);
    setDraft(null);
    if (!Number.isNaN(number)) onChange(clamp(number, min, max));
  }
  const nudge = (delta) => onChange(clamp(value + delta, min, max));

  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <span className="stepper">
        <button type="button" onClick={() => nudge(-step)} disabled={value <= min} aria-label={`${label}: kamaytirish`}>
          <Minus aria-hidden="true" />
        </button>
        <input
          inputMode="numeric"
          value={draft ?? value}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={(e) => e.target.select()}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
        />
        {unit && <span className="stepper__unit">{unit}</span>}
        <button type="button" onClick={() => nudge(step)} disabled={value >= max} aria-label={`${label}: oshirish`}>
          <Plus aria-hidden="true" />
        </button>
      </span>
    </label>
  );
}

export function Switch({ checked, onChange, label, children }) {
  return (
    <label className="switch">
      <input type="checkbox" role="switch" aria-label={label} checked={checked} onChange={onChange} />
      <span className="switch__track" aria-hidden="true" />
      <span className="switch__text">{children}</span>
    </label>
  );
}

export function MarkBadge({ score }) {
  const { label, tone } = mark(score);
  return <span className={`mark mark--${tone}`}>{label}</span>;
}

export function GroupDot({ color }) {
  return <i className="dot" style={{ '--c': color }} aria-hidden="true" />;
}

export function Level({ value }) {
  const full = Math.floor(value);
  return (
    <span className="level" role="img" aria-label={`Qiyinlik ${value} / 5`}>
      {Array.from({ length: full }, (_, i) => (
        <Star key={i} aria-hidden="true" />
      ))}
      {value > full && <StarHalf aria-hidden="true" />}
      <span>{String(value).replace('.', ',')}</span>
    </span>
  );
}

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerRing({ left, total, running, paused }) {
  return (
    <div className={cx('timer', running && left <= 5 && 'timer--low')} role="timer" aria-label={`${left} soniya qoldi`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="timer__track" cx="50" cy="50" r={RADIUS} />
        <circle
          className="timer__value"
          cx="50"
          cy="50"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - left / total)}
        />
      </svg>
      <b>{paused ? <Pause aria-label="Pauza" /> : left}</b>
    </div>
  );
}

export function Dialog({ onClose, className, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={cx('dialog', className)}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="dialog__body">{children}</div>
    </dialog>
  );
}

// «2 000 000» qator oxirida bo‘linmasin
const keepNumbers = (html) => html.replace(/(\d) (?=\d{3})/g, '$1\u00a0').replace(/(\d) (so‘m|mln|mlrd)/g, '$1\u00a0$2');

/** Loyiha ma’lumotlaridagi ishonchli HTML (topshiriq sharti va kaliti). */
export function RichText({ html, className }) {
  return <div className={cx('rich', className)} dangerouslySetInnerHTML={{ __html: keepNumbers(html) }} />;
}

export function Logo() {
  return (
    <svg className="logo" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="15" stroke="#2fb5a5" strokeWidth="5" strokeDasharray="62 32.2" transform="rotate(30 20 20)" />
      <path d="M20 20L33 12.5" stroke="#ffb627" strokeWidth="5" strokeLinecap="round" />
      <circle cx="20" cy="20" r="5" fill="#ff6b4a" />
    </svg>
  );
}
