import { BookOpen, FlaskConical, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, NumberField, Panel, Switch } from '@/components/ui';
import { GAMES, PERSONAL_KEYS, QUESTIONS_PER_STUDENT, SECTION_KEYS } from '@/config/games';
import { meta, practiceQuestions, statements, tasks, testQuestions } from '@/data';
import { presentStudents } from '@/lib/groups';
import { estimateMinutes, maxRounds, questionsPerGroup, totalMinutes } from '@/lib/planner';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useUi';
import { MarketFigure } from './MarketFigure';

const SECONDS = [
  { key: 'test', label: 'Test savoli', min: 10, max: 180, step: 5 },
  { key: 'tf', label: 'Ha/Yo‘q fikri', min: 10, max: 120, step: 5 },
  { key: 'practice', label: 'Amaliy savol', min: 20, max: 300, step: 5 },
  { key: 'words', label: 'Atama maydoni', min: 30, max: 900, step: 10 },
];

const ROUND_LABELS = { test: 'Test savollari', tf: 'Ha/Yo‘q bosqichlari', practice: 'Amaliy savollar' };

function Hero() {
  const state = useStore();
  const stats = [
    [state.groups.length, 'guruh'],
    [`${presentStudents(state).length}/${state.roster.length}`, 'talaba darsda'],
    [testQuestions.length, 'test savoli'],
    [statements.length, 'fikr'],
    [practiceQuestions.length, 'amaliy savol'],
    [tasks.length, 'doska topshirig‘i'],
  ];
  return (
    <section className="hero">
      <div className="hero__text">
        <p className="hero__crumb">{meta.course} · {meta.topic} · {meta.code}-amaliy · {meta.group}</p>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
        <dl className="hero__stats">
          {stats.map(([value, label]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <MarketFigure />
    </section>
  );
}

function PlanBar() {
  const state = useStore();
  const active = SECTION_KEYS.filter((key) => estimateMinutes(state, key) > 0);
  const total = totalMinutes(state);
  const { duration } = state.settings;
  return (
    <>
      <div className="plan-bar" role="img" aria-label={`Dars rejasi: jami taxminan ${total} daqiqa`}>
        {active.map((key) => (
          <span key={key} style={{ flexGrow: estimateMinutes(state, key), '--c': GAMES[key].color }} />
        ))}
      </div>
      <ul className="plan-legend">
        {active.map((key) => (
          <li key={key}>
            <i className="dot" style={{ '--c': GAMES[key].color }} /> {GAMES[key].short} <b>{estimateMinutes(state, key)} daq</b>
          </li>
        ))}
        <li className={total > duration ? 'is-over' : undefined}>
          Jami <b>{total}</b> / {duration} daq{total > duration && ' — darsga sig‘maydi'}
        </li>
      </ul>
    </>
  );
}

export function SettingsPage() {
  const state = useStore();
  const navigate = useNavigate();
  const { settings } = state;

  const toggleSection = (key) => {
    if (!state.toggleSection(key)) toast('Kamida bitta bo‘lim rejada qolishi kerak');
  };

  return (
    <>
      <Hero />

      <Panel
        title="Dars rejasi"
        hint={
          settings.auto
            ? `Har talabaga ${QUESTIONS_PER_STUDENT} ta savol, guruhga ${questionsPerGroup(state)} ta. Qolgan vaqt doskaga beriladi.`
            : 'Savollar soni qo‘lda belgilangan.'
        }
      >
        <PlanBar />
        <div className="section-list">
          {SECTION_KEYS.map((key) => {
            const { icon: Icon, title, color } = GAMES[key];
            return (
              <div key={key} className="section-list__item" style={{ '--c': color }}>
                <span className="tile-icon"><Icon aria-hidden="true" /></span>
                <b>{title}</b>
                <Switch checked={settings.enabled[key]} label={`${title}: dars rejasida`} onChange={() => toggleSection(key)}>
                  {settings.enabled[key] ? 'Rejada' : 'Rejada emas'}
                </Switch>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="cols">
        <Panel title="Vaqt">
          <div className="fields">
            <NumberField label="Dars davomiyligi" unit="daq" value={settings.duration} min={1} max={180} step={5} onChange={state.setDuration} />
            {SECONDS.map(({ key, ...field }) => (
              <NumberField key={key} {...field} unit="s" value={settings.seconds[key]} onChange={(v) => state.setSeconds(key, v)} />
            ))}
          </div>
          <Button
            size="sm"
            icon={RotateCcw}
            onClick={() => {
              state.resetSession();
              toast('Dars taymeri qayta o‘rnatildi');
            }}
          >
            Dars taymerini qayta boshlash
          </Button>
        </Panel>

        <Panel title="Savollar soni" hint="Har bir guruhga beriladigan savollar">
          <div className="segmented" role="group" aria-label="Savollar sonini belgilash">
            <button type="button" aria-pressed={settings.auto} onClick={() => state.setAuto(true)}>Avtomatik</button>
            <button type="button" aria-pressed={!settings.auto} onClick={() => state.setAuto(false)}>Qo‘lda</button>
          </div>
          <div className="fields">
            {PERSONAL_KEYS.map((key) => (
              <NumberField
                key={key}
                label={`${ROUND_LABELS[key]} (ko‘pi ${maxRounds(state, key)})`}
                unit="ta"
                value={settings.rounds[key]}
                min={1}
                max={maxRounds(state, key)}
                onChange={(v) => state.setRounds(key, v)}
              />
            ))}
          </div>
          <p className="muted">Bitta o‘yinda savollar takrorlanmaydi; keyingi o‘yinlarda avval ishlatilmaganlari beriladi.</p>
        </Panel>
      </div>

      <Panel title="Mashg‘ulot maqsadi" hint="2 soat · 80 daqiqa">
        <p>{meta.goal}</p>
        <ol className="task-list">
          {tasks.map((task) => (
            <li key={task.id}><b className="mono">{task.id}</b> {task.title}</li>
          ))}
        </ol>
        <h3>Nazorat savollari</h3>
        <ol>
          {meta.controlQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </Panel>

      <Panel
        title="Darsdan oldin tekshirish"
        hint="Sinov rejimida o‘yinlarni o‘zingiz o‘ynab ko‘rasiz: natijalar alohida saqlanadi va sinov tugagach o‘chadi."
      >
        <div className="row">
          <Button variant={state.sandbox ? 'danger' : 'primary'} icon={FlaskConical} onClick={() => state.setSandbox(!state.sandbox)}>
            {state.sandbox ? 'Sinovni tugatish' : 'Sinov rejimini yoqish'}
          </Button>
          <Button icon={BookOpen} onClick={() => navigate('/savollar')}>Savollar banki</Button>
        </div>
      </Panel>
    </>
  );
}
