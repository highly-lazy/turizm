import { useEffect, useRef } from 'react';

/** Gorizontal ro‘yxatda faol elementni (.is-active, .is-current yoki bosilgan tugma) ko‘rinadigan joyga suradi. */
export function useScrollToActive(activeKey) {
  const ref = useRef(null);
  useEffect(() => {
    const list = ref.current;
    const item = list?.querySelector('.is-active, .is-current, [aria-pressed="true"]');
    if (!item || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: item.offsetLeft - list.offsetLeft - (list.clientWidth - item.clientWidth) / 2 });
  }, [activeKey]);
  return ref;
}
