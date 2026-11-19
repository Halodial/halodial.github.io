'use client';
import { useEffect, useRef, useState } from 'react';

/** A Mac keyboard that presses each Halodial shortcut in turn; pick one from the list to show it.
 *  Runs only while on screen; with reduced motion it stays on the one you pick. */
// right-hand modifiers carry a trailing space so they have their own keys; only the left ones light up
const ROWS: string[][] = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⇧ '],
  ['fn', '⌃', '⌥', '⌘', 'Space', '⌘ ', '⌥ '],
];
const SHORTCUTS: { keys: string[]; title: string; text: string }[] = [
  { keys: ['⌘'], title: 'Hold ⌘ while dragging', text: 'The file dial, under the file.' },
  { keys: ['⌥', '⌘', 'Space'], title: '⌥⌘Space', text: 'The launcher, from the keyboard.' },
  { keys: ['⌥', '⌘', 'C'], title: '⌥⌘C', text: 'The file dial for what’s selected in Finder.' },
  { keys: ['⌥', '⌘', 'S'], title: '⌥⌘S', text: 'A new, empty shelf.' },
];

export default function Keyboard() {
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const root = useRef<HTMLDivElement>(null), auto = useRef(true);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setHeld(true); return; }
    let visible = false, n = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(root.current!);
    const t = setInterval(() => {  // each beat: keys go down, stay, come up, the next shortcut
      if (!visible || !auto.current) return;
      n++;
      if (n % 3 === 1) setHeld(true);
      if (n % 3 === 0) { setHeld(false); setI(x => (x + 1) % SHORTCUTS.length); }
    }, 700);
    return () => { clearInterval(t); io.disconnect(); };
  }, []);

  const down = SHORTCUTS[i].keys;
  return (
    <div className="kb" ref={root}>
      <div className="kb-board" aria-hidden="true">
        {ROWS.map((row, r) => (
          <div key={r} className="kb-row">
            {row.map(k => <span key={k} className={`kb-key${k.trim() === 'Space' ? ' space' : ''}${held && k === k.trim() && down.includes(k) ? ' down' : ''}`}>{k.trim()}</span>)}
          </div>
        ))}
      </div>
      <ul className="kb-list">
        {SHORTCUTS.map((s, j) => (
          <li key={s.title}>
            <button type="button" aria-pressed={j === i} onClick={() => { auto.current = false; setI(j); setHeld(true); }}>
              <b>{s.title}</b><span>{s.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
