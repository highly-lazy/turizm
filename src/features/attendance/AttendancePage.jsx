import { Check, Dices, RotateCcw, Trash2, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, NumberField, PageHeader, Panel } from '@/components/ui';
import { groupIndex, groupOfStudent, presentStudents } from '@/lib/groups';
import { playEffect } from '@/lib/audio';
import { cx, groupColor } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { confirm, toast } from '@/store/useUi';

function StudentRow({ student, index, group, color }) {
  const setPresent = useStore((s) => s.setPresent);
  const removeStudent = useStore((s) => s.removeStudent);
  const { name, present } = student;

  function markPresent() {
    const joined = setPresent(name, true);
    if (joined) toast(`${name} «${joined}»ga qo‘shildi`);
  }

  return (
    <li className={cx('student', !present && 'student--absent')}>
      <span className="student__no">{index + 1}</span>
      <span className="student__name" title={name}>{name}</span>
      {group && <span className="chip" style={{ '--c': color }}>{group.name}</span>}
      <span className="presence" role="group" aria-label={`${name}: davomat`}>
        <button type="button" aria-pressed={present} onClick={markPresent}><Check aria-hidden="true" /> Keldi</button>
        <button type="button" className="presence__no" aria-pressed={!present} onClick={() => setPresent(name, false)}>
          <X aria-hidden="true" /> Yo‘q
        </button>
      </span>
      <Button
        variant="ghost"
        size="sm"
        icon={Trash2}
        aria-label={`${name}: ro‘yxatdan o‘chirish`}
        onClick={() =>
          confirm({
            title: 'Ro‘yxatdan o‘chirilsinmi?',
            body: name,
            confirmLabel: 'O‘chirish',
            danger: true,
            onConfirm: () => removeStudent(name),
          })
        }
      />
    </li>
  );
}

function AddStudents() {
  const addStudents = useStore((s) => s.addStudents);
  const [text, setText] = useState('');

  function submit(event) {
    event.preventDefault();
    const added = addStudents(text.split('\n'));
    if (added) setText('');
    toast(added ? `${added} ta talaba qo‘shildi` : 'Yangi ism topilmadi yoki u ro‘yxatda bor');
  }

  return (
    <form className="add-students" onSubmit={submit}>
      <label className="field">
        <span className="field__label">Talaba qo‘shish — har qatorga bitta ism, ro‘yxatni joylash ham mumkin</span>
        <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Familiya Ism Otasining ismi" />
      </label>
      <Button type="submit" icon={UserPlus} disabled={!text.trim()}>Qo‘shish</Button>
    </form>
  );
}

export function AttendancePage() {
  const state = useStore();
  const navigate = useNavigate();
  const present = presentStudents(state).length;

  function split() {
    state.splitIntoGroups();
    playEffect('fanfare');
    toast(`Kelgan ${present} talaba ${useStore.getState().groups.length} ta guruhga bo‘lindi`);
    navigate('/guruhlar');
  }

  function requestSplit() {
    if (state.sandbox) return toast('Avval sinov rejimini tugating');
    if (!present) return toast('Kelgan talabalar yo‘q');
    const hasResults =
      Object.values(state.results).some((r) => Object.keys(r).length) || Object.values(state.boardRecords).some((r) => Object.keys(r).length);
    if (!hasResults) return split();
    confirm({
      title: 'Guruhlar yangidan tuzilsinmi?',
      body: 'Barcha o‘yin va doska natijalari tozalanadi.',
      confirmLabel: 'Bo‘lish va tozalash',
      danger: true,
      onConfirm: split,
    });
  }

  return (
    <>
      <PageHeader title="Davomat" actions={<Button icon={RotateCcw} onClick={state.markAllPresent}>Hammasi keldi</Button>}>
        {state.attendanceDate} · faqat kelganlar guruhlarga bo‘linadi
      </PageHeader>

      <Panel className="split-panel">
        <div className="tally">
          <div className="tally__item tally__item--ok"><b>{present}</b> keldi</div>
          <div className="tally__item tally__item--no"><b>{state.roster.length - present}</b> kelmadi</div>
          <div className="tally__item"><b>{state.roster.length}</b> jami</div>
        </div>
        <div className="row">
          <NumberField label="Guruhlar soni" value={state.groupCount} min={1} max={50} onChange={state.setGroupCount} />
          <Button variant="primary" size="lg" icon={Dices} onClick={requestSplit}>Guruhlarga bo‘lish</Button>
        </div>
      </Panel>

      <Panel title="Talabalar" hint="Guruhlar tuzilgandan keyin kech kelgan talaba eng kichik guruhga qo‘shiladi, natijalar saqlanadi.">
        <ul className="students">
          {state.roster.map((student, i) => {
            const group = groupOfStudent(state, student.name);
            return (
              <StudentRow key={student.name} student={student} index={i} group={group} color={group && groupColor(groupIndex(state, group.id))} />
            );
          })}
        </ul>
        <AddStudents />
      </Panel>
    </>
  );
}
