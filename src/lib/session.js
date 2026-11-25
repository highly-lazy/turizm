/** Dars tugashiga qolgan soniyalar; taymer boshlanmagan bo‘lsa null. */
export function secondsLeft({ session, settings }, now = Date.now()) {
  if (!session) return null;
  const elapsed = ((session.pausedAt ?? now) - session.startedAt) / 1000 - session.pausedSeconds;
  return Math.max(0, Math.round(settings.duration * 60 + session.adjust - elapsed));
}
