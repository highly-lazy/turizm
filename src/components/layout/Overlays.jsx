import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Dialog } from '@/components/ui';
import { FinalSheet, IndividualSheet } from '@/features/results/Sheets';
import { playEffect } from '@/lib/audio';
import { secondsLeft } from '@/lib/session';
import { useStore } from '@/store/useStore';
import { toast, useUi } from '@/store/useUi';

const WARNING_SECONDS = 300;

/** Dars vaqti tugashini kuzatadi: 5 daqiqa qolganda ogohlantiradi, tugaganda natijani chiqaradi. */
export function SessionWatcher() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      const state = useStore.getState();
      const { session } = state;
      const left = secondsLeft(state);
      if (left == null || session.pausedAt) return;
      if (left > 0 && left <= WARNING_SECONDS && !session.warned) {
        state.markSessionWarned();
        toast('Darsning tugashiga 5 daqiqa qoldi');
      }
      if (left === 0 && !session.finished) {
        state.finishSession(pathname.startsWith('/oyin/') ? pathname.split('/')[2] : null);
        playEffect('fanfare');
        toast('Dars vaqti tugadi: natija bajarilganlar bo‘yicha hisoblandi');
        navigate('/natijalar');
        useUi.getState().openSheet('final');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate, pathname]);

  return null;
}

function ConfirmDialog({ title, body, confirmLabel, danger, onConfirm }) {
  const close = useUi((s) => s.closeConfirm);
  return (
    <Dialog onClose={close} className="dialog--sm">
      <h2>{title}</h2>
      {body && <p className="muted">{body}</p>}
      <div className="row row--end">
        <Button onClick={close}>Bekor qilish</Button>
        <Button
          variant={danger ? 'danger' : 'primary'}
          onClick={() => {
            close();
            onConfirm();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}

export function Overlays() {
  const { toasts, confirmation, sheet, closeSheet } = useUi();
  return (
    <>
      {confirmation && <ConfirmDialog {...confirmation} />}
      {sheet === 'final' && <FinalSheet onClose={closeSheet} />}
      {sheet === 'individual' && <IndividualSheet onClose={closeSheet} />}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">{t.message}</div>
        ))}
      </div>
    </>
  );
}
