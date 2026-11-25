import { Dices, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, PageHeader, Panel } from '@/components/ui';
import { total } from '@/lib/scoring';
import { groupColor } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { confirm, toast } from '@/store/useUi';

function GroupCard({ group, index }) {
  const state = useStore();
  const others = state.groups.filter((g) => g.id !== group.id);

  function requestRemove() {
    if (state.sandbox) return toast('Avval sinov rejimini tugating');
    if (!others.length) return toast('Kamida bitta guruh bo‘lishi kerak');
    confirm({
      title: `«${group.name}» o‘chirilsinmi?`,
      body: 'Guruh natijalari o‘chadi va davom etayotgan o‘yinlar to‘xtaydi. A’zolari ro‘yxatda qoladi.',
      confirmLabel: 'O‘chirish',
      danger: true,
      onConfirm: () => state.removeGroup(group.id),
    });
  }

  return (
    <article className="group-card" style={{ '--c': groupColor(index) }}>
      <header>
        <input
          key={group.name}
          aria-label="Guruh nomi"
          defaultValue={group.name}
          maxLength={28}
          onBlur={(e) => state.renameGroup(group.id, e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
        />
        <Button variant="on-color" size="sm" icon={Trash2} aria-label={`${group.name}: o‘chirish`} onClick={requestRemove} />
      </header>
      {group.members.length ? (
        <ul>
          {group.members.map((name) => (
            <li key={name}>
              <span>{name}</span>
              {others.length > 0 && (
                <select
                  aria-label={`${name}: boshqa guruhga o‘tkazish`}
                  value=""
                  onChange={(e) => state.moveStudent(name, Number(e.target.value))}
                >
                  <option value="">O‘tkazish</option>
                  {others.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">Talabalar hali bo‘linmagan</p>
      )}
      <footer>
        <span><b>{group.members.length}</b> talaba</span>
        <span><b>{total(state, group.id)?.score ?? 0}</b> ball</span>
      </footer>
    </article>
  );
}

export function GroupsPage() {
  const groups = useStore((s) => s.groups);
  const addGroup = useStore((s) => s.addGroup);
  const navigate = useNavigate();
  const empty = groups.every((g) => !g.members.length);

  return (
    <>
      <PageHeader title="Guruhlar" actions={<Button icon={Plus} onClick={addGroup}>Guruh qo‘shish</Button>}>
        Nomini kartaning o‘zida o‘zgartiring. Har savolga guruhdan bitta talaba shaxsan javob beradi.
      </PageHeader>
      {empty && (
        <Panel className="notice">
          <p>Talabalar hali guruhlarga bo‘linmagan.</p>
          <Button variant="primary" icon={Dices} onClick={() => navigate('/davomat')}>Davomatda bo‘lish</Button>
        </Panel>
      )}
      <div className="group-grid">
        {groups.map((group, i) => (
          <GroupCard key={group.id} group={group} index={i} />
        ))}
      </div>
    </>
  );
}
