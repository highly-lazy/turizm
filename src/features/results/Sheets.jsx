import { useEffect } from 'react';
import { Button, Dialog } from '@/components/ui';
import { GAMES, SECTION_KEYS } from '@/config/games';
import { celebrate } from '@/lib/celebrate';
import { absentStudents, groupIndex, groupOfStudent, presentStudents } from '@/lib/groups';
import { grade, individualReport, total } from '@/lib/scoring';
import { groupColor, shortName } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { Ranking } from './Ranking';

function Sheet({ title, hint, items, onClose }) {
  const hasScores = items.some((item) => item.score != null);
  useEffect(() => {
    if (hasScores) celebrate();
  }, [hasScores]);

  return (
    <Dialog onClose={onClose} className="dialog--lg">
      <h2>{title}</h2>
      <p className="muted">{hint}</p>
      {hasScores ? <Ranking items={items} showMark /> : <p className="empty">Hali birorta natija yo‘q. Avval o‘yin yoki doska topshirig‘ini bajaring.</p>}
      <div className="row row--end">
        <Button variant="primary" onClick={onClose}>Yopish</Button>
      </div>
    </Dialog>
  );
}

export function FinalSheet({ onClose }) {
  const state = useStore();
  const absent = absentStudents(state);
  const items = state.groups.map((group, i) => {
    const result = total(state, group.id);
    const grades = SECTION_KEYS.map((key) => [key, grade(state, key, group.id)]).filter(([, v]) => v != null);
    return {
      id: group.id,
      name: group.name,
      color: groupColor(i),
      score: result?.score ?? null,
      detail: [group.members.map(shortName).join(', '), grades.map(([key, v]) => `${GAMES[key].short} ${v}`).join(' · ')].filter(Boolean).join('\n') || 'o‘ynamagan',
    };
  });
  return (
    <Sheet
      title={`${state.sandbox ? 'Sinov · ' : ''}Yakuniy natija`}
      hint={`Jami — o‘ynalgan bo‘limlar baholarining o‘rtachasi. Davomat: ${presentStudents(state).length}/${state.roster.length}${absent.length ? `. Kelmaganlar: ${absent.map(shortName).join(', ')}` : ''}.`}
      items={items}
      onClose={onClose}
    />
  );
}

export function IndividualSheet({ onClose }) {
  const state = useStore();
  const items = presentStudents(state).map((name) => {
    const report = individualReport(state, name);
    const group = groupOfStudent(state, name);
    return {
      id: name,
      name,
      color: groupColor(group ? groupIndex(state, group.id) : -1),
      score: report.percent,
      detail: [group?.name, `${report.earned}/${report.max} ball`, report.words && `${report.words.found} atama`].filter(Boolean).join(' · '),
    };
  });
  return <Sheet title="Individual reyting" hint="Talaba o‘zi javob bergan savollar, doskadagi kataklar va guruhning atama natijasi bo‘yicha." items={items} onClose={onClose} />;
}
