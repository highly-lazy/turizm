import { ArrowLeft, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Level, Panel } from '@/components/ui';
import { GAMES } from '@/config/games';
import { practiceQuestions, statements, tasks, testQuestions, wordSets } from '@/data';
import { cx } from '@/lib/utils';

function QuestionItem({ question }) {
  return (
    <li className="bank-item">
      <p><b>{question.question}</b> <Level value={question.level} /></p>
      <ol type="A">
        {question.options.map((option, i) => (
          <li key={option} className={cx(i === 0 && 'is-correct')}>{option}</li>
        ))}
      </ol>
      <p className="muted">{question.note}</p>
    </li>
  );
}

export default function BankPage() {
  const navigate = useNavigate();
  return (
    <>
      <header className="game-head no-print">
        <Button icon={ArrowLeft} aria-label="Orqaga" onClick={() => navigate('/')} />
        <div className="game-head__title">
          <h1>Savollar banki</h1>
          <p className="muted">To‘g‘ri javob — birinchi va yashil; o‘yinda variantlar aralashtiriladi</p>
        </div>
        <Button icon={Printer} onClick={() => window.print()}>Chop etish</Button>
      </header>

      <Panel title={`${GAMES.test.title} · ${testQuestions.length} ta savol`}>
        <ol className="bank">
          {testQuestions.map((q) => <QuestionItem key={q.question} question={q} />)}
        </ol>
      </Panel>

      <Panel title={`${GAMES.tf.title} · ${statements.length} ta fikr`}>
        <ol className="bank">
          {statements.map((s) => (
            <li key={s.text} className="bank-item">
              <p><span className={cx('tag', s.answer ? 'tag--yes' : 'tag--no')}>{s.answer ? 'HA' : 'YO‘Q'}</span> {s.text} <Level value={s.level} /></p>
              <p className="muted">{s.note}</p>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title={`${GAMES.words.title} · ${wordSets.length} to‘plam`}>
        <div className="word-sets">
          {wordSets.map((set) => (
            <section key={set.title}>
              <h3>{set.title}</h3>
              <dl>
                {set.words.map(({ word, clue }) => (
                  <div key={word}>
                    <dt className="mono">{word}</dt>
                    <dd>{clue}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </Panel>

      <Panel title={`${GAMES.practice.title} · ${practiceQuestions.length} ta savol`}>
        {tasks.map((task) => (
          <section key={task.id}>
            <h3><span className="mono accent">{task.id}</span> {task.title}</h3>
            <ol className="bank">
              {practiceQuestions.filter((q) => q.taskId === task.id).map((q) => <QuestionItem key={q.question} question={q} />)}
            </ol>
          </section>
        ))}
      </Panel>
    </>
  );
}
