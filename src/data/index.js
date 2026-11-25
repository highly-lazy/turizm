import { practiceQuestions } from './practiceQuestions';
import { testQuestions } from './testQuestions';

export { boardTasks } from './boardTasks';
export { meta } from './meta';
export { DEFAULT_ROSTER } from './roster';
export { statements } from './statements';
export { findTask, TASK_IDS, tasks } from './tasks';
export { wordSets } from './wordSets';
export { practiceQuestions, testQuestions };

export const questionsOf = (key) => (key === 'test' ? testQuestions : practiceQuestions);
