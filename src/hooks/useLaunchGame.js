import { useNavigate } from 'react-router-dom';
import { GAMES, sectionPath } from '@/config/games';
import { useStore } from '@/store/useStore';
import { confirm } from '@/store/useUi';

/** O‘yinni boshlaydi (kerak bo‘lsa, eski natija o‘chishini tasdiqlatadi) yoki davom ettiradi. */
export function useLaunchGame() {
  const navigate = useNavigate();

  function start(key) {
    const s = useStore.getState();
    s.startSession();
    if (key === 'tf') s.startStatements();
    else if (key === 'words') s.startWords();
    else if (key !== 'board') s.startQuiz(key);
    navigate(sectionPath(key));
  }

  function launch(key) {
    const s = useStore.getState();
    const hasProgress = key !== 'board' && (Object.keys(s.results[key]).length > 0 || (s.games[key] && !s.games[key].done));
    if (!hasProgress) return start(key);
    confirm({
      title: `«${GAMES[key].title}» qayta boshlansinmi?`,
      body: 'Shu o‘yinning guruh va shaxsiy natijalari o‘chib, yangidan hisoblanadi.',
      confirmLabel: 'Yangidan boshlash',
      danger: true,
      onConfirm: () => start(key),
    });
  }

  return { launch, resume: (key) => navigate(sectionPath(key)) };
}
