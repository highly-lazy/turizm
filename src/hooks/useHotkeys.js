import { useEffect, useRef } from 'react';

/**
 * Klaviatura yorliqlari: {tugma: funksiya}, tugmalar kichik harfda («space», «enter», «a», «arrowleft»…).
 * Matn kiritilayotganda va oyna ochiq bo‘lganda ishlamaydi.
 */
export function useHotkeys(bindings) {
  const ref = useRef(bindings);
  useEffect(() => {
    ref.current = bindings;
  });

  useEffect(() => {
    function onKeyDown(event) {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
      const { target } = event;
      if (target.closest?.('input, textarea, select, dialog') || document.querySelector('dialog[open]')) return;
      const key = event.key === ' ' ? 'space' : event.key.toLowerCase();
      // Tab bilan tanlangan tugmani Space/Enter odatdagidek bosadi
      if ((key === 'space' || key === 'enter') && target.closest?.('button, a')) return;
      const action = ref.current[key];
      if (!action) return;
      event.preventDefault();
      action();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}

/** Sichqoncha bilan bosilgan tugma fokusda qolmasin — aks holda Space uni qayta bosadi. */
export function useBlurOnPointerClick() {
  useEffect(() => {
    function onClick(event) {
      if (event.detail > 0) event.target.closest?.('button')?.blur();
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}
