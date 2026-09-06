'use client';
import { useEffect, useState } from 'react';
import { chapters } from '@/lib/profile';
import { activeChapter, revealProgress } from '@/lib/scroll-state.mjs';

export function useProfileScroll() {
  const [state, setState] = useState({ progress: 0, active: 0 });
  useEffect(() => {
    let frame = 0;
    let mounted = true;
    let positions: number[] = [];
    const measure = () => {
      positions = chapters.map(({ id }) => document.getElementById(id)?.offsetTop ?? 0);
    };
    const update = () => {
      frame = 0;
      const top = window.scrollY;
      setState({ progress: revealProgress(top, positions.at(-1) ?? 0), active: activeChapter(top, positions, window.innerHeight) });
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const resize = () => { if (mounted) { measure(); schedule(); } };
    measure();
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    const observer = new ResizeObserver(resize);
    observer.observe(document.body);
    void document.fonts.ready.then(resize);
    return () => {
      mounted = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);
  return state;
}
