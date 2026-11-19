'use client';
import { useEffect, useRef, useState } from 'react';
import { Sound } from '@/lib/playground';
import Dial from './Dial';

/** Hold ⌘ anywhere on the site and a dial opens under the pointer, like the app: move to a slot, let go of ⌘
 *  (or click) to go there. It keeps out of the way: another key within the delay (⌘C, ⌘K…) cancels it, and it
 *  never opens while a mouse button is down, while typing, or over the Try page's desktop (which has its own). */
const SLOTS = [
  { label: 'Home', icon: 'layout', href: '/' },
  { label: 'Try it', icon: 'play', href: '/try/' },
  { label: 'Formats', icon: 'repeat', href: '/formats/' },
  { label: 'Recipes', icon: 'sparkles', href: '/recipes/' },
  { label: 'Help', icon: 'chat', href: '/help/' },
  { label: 'Download', icon: 'inbox', href: '/#download' },
];
const SIZE = 300, HOLD = 380;

export default function SiteDial() {
  const [at, setAt] = useState<[number, number] | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const pointer = useRef<[number, number]>([innerWidthSafe() / 2, 300]);
  const down = useRef(false), timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const open = useRef(false), selRef = useRef<number | null>(null);

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return;
    const close = () => { clearTimeout(timer.current); open.current = false; selRef.current = null; setAt(null); setSel(null); };
    const go = (i: number) => { close(); location.href = SLOTS[i].href; };
    const busy = () => {
      const a = document.activeElement;
      return down.current || (a instanceof HTMLElement && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) ||
        !!document.elementFromPoint(...pointer.current)?.closest('.desk, .play, .search');
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Meta') {
        if (e.repeat || open.current || busy()) return;
        timer.current = setTimeout(() => {
          const [x, y] = pointer.current, h = SIZE / 2;
          open.current = true;
          setAt([Math.min(innerWidth - h - 8, Math.max(h + 8, x)), Math.min(innerHeight - h - 8, Math.max(h + 8, y))]);
          Sound.init(); Sound.play('detent');
        }, HOLD);
      } else {
        clearTimeout(timer.current);  // ⌘ plus a key is a shortcut, not the dial
        if (open.current) { if (e.key === 'Escape') e.preventDefault(); close(); }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== 'Meta') return;
      clearTimeout(timer.current);
      if (open.current && selRef.current != null) go(selRef.current); else if (open.current) close();
    };
    const onMove = (e: PointerEvent) => { pointer.current = [e.clientX, e.clientY]; };
    const onDown = () => { down.current = true; clearTimeout(timer.current); };
    const onUp = () => { down.current = false; };
    const onBlur = () => close();
    addEventListener('keydown', onKeyDown); addEventListener('keyup', onKeyUp);
    addEventListener('pointermove', onMove); addEventListener('pointerdown', onDown, true); addEventListener('pointerup', onUp, true);
    addEventListener('blur', onBlur);
    return () => {
      clearTimeout(timer.current);
      removeEventListener('keydown', onKeyDown); removeEventListener('keyup', onKeyUp);
      removeEventListener('pointermove', onMove); removeEventListener('pointerdown', onDown, true); removeEventListener('pointerup', onUp, true);
      removeEventListener('blur', onBlur);
    };
  }, []);

  // while open, the slot under the pointer lights (with the click), as in the app
  useEffect(() => {
    if (!at) return;
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - at[0], dy = e.clientY - at[1], d = Math.hypot(dx, dy) * (420 / SIZE);
      const step = 360 / SLOTS.length, b = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
      const i = d < 60 || d > 220 ? null : Math.floor(((b + step / 2) % 360) / step) % SLOTS.length;
      if (i !== selRef.current) { selRef.current = i; setSel(i); if (i != null) Sound.play('click'); }
    };
    addEventListener('pointermove', onMove);
    return () => removeEventListener('pointermove', onMove);
  }, [at]);

  if (!at) return null;
  return (
    <div className="site-dial" style={{ left: at[0] - SIZE / 2, top: at[1] - SIZE / 2, width: SIZE, height: SIZE }}
      onClick={() => { if (selRef.current != null) location.href = SLOTS[selRef.current].href; }} role="menu" aria-label="Site dial">
      <Dial slots={SLOTS} lit={sel ?? undefined} name={sel != null ? SLOTS[sel].label : 'Halodial'} sub={sel != null ? 'Let go of ⌘ to go' : 'Move to a slot'} />
    </div>
  );
}

function innerWidthSafe() { return typeof window === 'undefined' ? 800 : window.innerWidth; }
