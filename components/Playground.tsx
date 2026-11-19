'use client';
import { useEffect, useRef, useState } from 'react';
import { Dial, Sound, KINDS } from '@/lib/playground';

type Kind = { chip: string; file: string };
type DialApi = { setKind(k: string): void; style: string; accent: string; dirty: boolean; destroy(): void };

const KIND_LIST = Object.entries(KINDS as Record<string, Kind>);
// the app's highlight presets
const COLOURS: [string, string][] = [['White', '#FFFFFF'], ['Gold', '#FFD17D'], ['Lilac', '#C9B6FF'], ['Sky', '#7FC8FF'], ['Mint', '#8FE3A2'], ['Pink', '#FF9ED8'], ['Coral', '#FF8A6B']];

/** Try it: the real dial with each kind of file's default options, the click and detent sounds, Glass or Solid,
 *  and the highlight colours. Nothing touches real files; results come back as toasts with Undo, like the app. */
export default function Playground() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef<HTMLParagraphElement>(null);
  const dial = useRef<DialApi | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [kind, setKind] = useState('launcher');
  const [style, setStyle] = useState('solid');
  const [accent, setAccent] = useState('#FFFFFF');
  const [sound, setSound] = useState(true);
  const [toast, setToast] = useState<{ text: string; undo?: string; n: number } | null>(null);

  useEffect(() => {
    const show = (text: string, undo?: string) => {
      setToast(t => ({ text, undo, n: (t?.n ?? 0) + 1 }));
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setToast(null), undo ? 4200 : 2400);
    };
    const d: DialApi = new Dial(canvas.current, { onToast: show, live: live.current, onKind: setKind });
    dial.current = d;
    // browsers only allow sound after a click or key press; the first one anywhere on the page unlocks it
    const wake = () => Sound.init();
    addEventListener('pointerdown', wake, { once: true });
    addEventListener('keydown', wake, { once: true });
    return () => {
      clearTimeout(hideTimer.current); d.destroy();
      removeEventListener('pointerdown', wake); removeEventListener('keydown', wake);
    };
  }, []);

  const pick = (k: string) => { Sound.init(); dial.current?.setKind(k); };
  const look = (s: string) => { setStyle(s); if (dial.current) { dial.current.style = s; dial.current.dirty = true; } };
  const tint = (hex: string) => { setAccent(hex); if (dial.current) { dial.current.accent = hex; dial.current.dirty = true; } };
  const toggleSound = () => {
    Sound.init();
    Sound.on = !Sound.on;
    setSound(Sound.on);
    if (Sound.on) Sound.play('click');
  };

  return (
    <div className={`play ${style}`}>
      <div className="play-kinds" role="group" aria-label="Kind of file">
        {KIND_LIST.map(([k, v]) => (
          <button key={k} type="button" className="chip" aria-pressed={kind === k} onClick={() => pick(k)}>{v.chip}</button>
        ))}
      </div>

      <div className="play-desk">
        <svg className="play-orbits" viewBox="-600 -600 1200 1200" aria-hidden="true">{[200, 250, 310, 380, 460, 550].map(r => <circle key={r} r={r} />)}</svg>
        <canvas ref={canvas} tabIndex={0} role="application" aria-describedby="play-help"
          aria-label="Halodial dial. Use the arrow keys to move round it, Return to choose, Escape to go back." />
        <div className={`play-toast${toast ? ' show' : ''}${toast?.undo ? ' undo' : ''}`} role="status" aria-live="polite">
          <span>{toast?.text}</span>
          {toast?.undo && <button type="button" onClick={() => toast.undo && setToast({ text: toast.undo, n: toast.n + 1 })}>Undo</button>}
        </div>
      </div>

      <div className="play-tools">
        <div className="seg" role="group" aria-label="Dial style">
          {['solid', 'glass'].map(s => (
            <button key={s} type="button" aria-pressed={style === s} onClick={() => look(s)}>{s === 'solid' ? 'Solid' : 'Glass'}</button>
          ))}
        </div>
        <div className="dots" role="group" aria-label="Highlight colour">
          {COLOURS.map(([n, h]) => (
            <button key={h} type="button" className="dot" style={{ background: h }} aria-label={n} title={n} aria-pressed={accent === h} onClick={() => tint(h)} />
          ))}
        </div>
        <button className="sound" type="button" aria-pressed={sound} onClick={toggleSound}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />{sound && <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />}
          </svg>
          {sound ? 'Sound on' : 'Sound off'}
        </button>
      </div>
      <p className="play-help" id="play-help">Hover a slot to hear the click, click to choose, or rest on one with options to open it. Click the centre to go back. Nothing here touches your files.</p>
      <p className="sr" aria-live="polite" ref={live} />
    </div>
  );
}
