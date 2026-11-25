import { ClipboardCopy, Medal, Printer, Trash2, Trophy } from 'lucide-react';
import { Button, GroupDot, MarkBadge, PageHeader, Panel } from '@/components/ui';
import { GAMES, QUESTIONS_PER_STUDENT, SECTION_KEYS } from '@/config/games';
import { meta } from '@/data';
import { absentStudents, groupIndex, groupOfStudent, presentStudents } from '@/lib/groups';
import { grade, individualReport, mark, studentAnswers, total } from '@/lib/scoring';
import { cx, formatNumber, groupColor, today } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { confirm, toast, useUi } from '@/store/useUi';

const ratio = (tally) => (tally ? `${tally.correct}/${tally.answered}` : '');

function copyForExcel(state) {
  const header = ['№', 'Talaba', 'Guruh', 'Test', 'Ha/Yo‘q', 'Amaliy A3', 'Doska', 'Atama', 'Ball /100', 'Baho'];
  const rows = state.roster.map(({ name, present }, i) => {
    const r = individualReport(state, name);
    return [
      i + 1,
      name + (present ? '' : ' (kelmadi)'),
      groupOfStudent(state, name)?.name ?? '',
      ratio(r.test),
      ratio(r.tf),
      ratio(r.practice),
      r.board ? `${r.board.earned}/${r.board.max}` : '',
      r.words ? `${r.words.found}/10` : '',
      r.percent ?? '',
      r.percent == null ? '' : mark(r.percent).label,
    ];
  });
  const text = [header, ...rows].map((row) => row.join('\t')).join('\n');
  navigator.clipboard.writeText(text).then(
    () => toast('Jadval nusxalandi: Excel’ga Ctrl+V bilan joylang'),
    () => toast('Brauzer nusxalashga ruxsat bermadi'),
  );
}

function GroupTable() {
  const state = useStore();
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Guruh</th>
            {SECTION_KEYS.map((key) => (
              <th key={key} className="num">{GAMES[key].short}</th>
            ))}
            <th className="num">Jami /100</th>
            <th>Baho</th>
          </tr>
        </thead>
        <tbody>
          {state.groups.map((group, i) => {
            const result = total(state, group.id);
            return (
              <tr key={group.id}>
                <th scope="row"><GroupDot color={groupColor(i)} /> {group.name} <small className="muted">{group.members.length} talaba</small></th>
                {SECTION_KEYS.map((key) => (
                  <td key={key} className="num">{grade(state, key, group.id) ?? '—'}</td>
                ))}
                <td className="num num--total">{result ? formatNumber(result.score) : '—'}</td>
                <td><MarkBadge score={result?.score ?? null} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StudentTable() {
  const state = useStore();
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th className="num">№</th>
            <th>Talaba</th>
            <th>Guruh</th>
            <th className="num">Test</th>
            <th className="num">Ha/Yo‘q</th>
            <th className="num">Amaliy A3</th>
            <th className="num">Doska</th>
            <th className="num">Atama</th>
            <th className="num">Savollar</th>
            <th className="num">Ball /100</th>
            <th>Baho</th>
          </tr>
        </thead>
        <tbody>
          {state.roster.map(({ name, present }, i) => {
            const r = individualReport(state, name);
            const group = groupOfStudent(state, name);
            return (
              <tr key={name} className={cx(!present && 'is-absent')}>
                <td className="num">{i + 1}</td>
                <th scope="row">{name}{!present && <small className="muted"> kelmadi</small>}</th>
                <td className="nowrap">{group ? <><GroupDot color={groupColor(groupIndex(state, group.id))} /> {group.name}</> : '—'}</td>
                <td className="num">{ratio(r.test) || '—'}</td>
                <td className="num">{ratio(r.tf) || '—'}</td>
                <td className="num">{ratio(r.practice) || '—'}</td>
                <td className="num">{r.board ? `${r.board.earned}/${r.board.max}` : '—'}</td>
                <td className="num">{r.words ? `${r.words.found}/10` : '—'}</td>
                <td className="num">{studentAnswers(state, name)}/{QUESTIONS_PER_STUDENT}</td>
                <td className="num num--total">{r.percent ?? '—'}</td>
                <td><MarkBadge score={r.percent} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ResultsPage() {
  const state = useStore();
  const openSheet = useUi((s) => s.openSheet);
  const absent = absentStudents(state);

  const requestReset = () =>
    confirm({
      title: 'Barcha natijalar tozalansinmi?',
      body: 'O‘yin, doska va individual natijalar hamda dars taymeri o‘chadi. Ro‘yxat va guruhlar qoladi.',
      confirmLabel: 'Tozalash',
      danger: true,
      onConfirm: () => {
        state.resetProgress();
        toast('Natijalar tozalandi');
      },
    });

  return (
    <>
      <PageHeader
        title="Natijalar"
        actions={
          <>
            <Button variant="primary" icon={Trophy} onClick={() => openSheet('final')}>E’lon qilish</Button>
            <Button icon={Printer} onClick={() => window.print()}>Chop etish</Button>
            <Button icon={ClipboardCopy} onClick={() => copyForExcel(state)}>Excel uchun nusxa</Button>
            <Button variant="danger-soft" icon={Trash2} onClick={requestReset}>Tozalash</Button>
          </>
        }
      >
        {meta.group} · {meta.topic} · {meta.code} · {today()} · keldi {presentStudents(state).length}/{state.roster.length}
      </PageHeader>

      <Panel title="Guruhlar hisoboti">
        <GroupTable />
        {absent.length > 0 && <p className="muted">Kelmaganlar: {absent.join(', ')}</p>}
        <details className="details">
          <summary>Qanday hisoblanadi?</summary>
          <p>
            Har bo‘limda baho faqat bajarilgan savollar bo‘yicha: (olingan ball ÷ maksimal ball) × 100; atama qidirishda topilgan atamalar × 10;
            doskada tekshirilgan kataklar bo‘yicha. Jami — o‘ynalgan bo‘limlar o‘rtachasi. Baho: 86–100 a’lo, 71–85 yaxshi, 55–70 qoniqarli,
            55 dan past qoniqarsiz.
          </p>
        </details>
      </Panel>

      <Panel title="Individual natijalar" actions={<Button icon={Medal} onClick={() => openSheet('individual')}>Reytingni e’lon qilish</Button>}>
        <StudentTable />
        <details className="details">
          <summary>Individual ball qanday chiqadi?</summary>
          <p>
            Talaba o‘zi javob bergan test, Ha/Yo‘q va amaliy savollar hamda doskada bajargan kataklar bo‘yicha: (olingan ÷ maksimal) × 100.
            Har savol va katak 10 ball. Atama qidirishda guruh natijasi har bir a’zoga yoziladi (maksimal 100).
          </p>
        </details>
      </Panel>
    </>
  );
}
