'use client';
import { useRef, useState } from 'react';
import { Sound } from '@/lib/playground';
import Dial from './Dial';
import FileIcon from './FileIcon';
import Icon from './Icon';

/** Little things Halodial does, each one live: a gapless grid of tiles, Craftwork's components grid in our terms. */

const tick = () => { Sound.init(); Sound.play('detent'); };
const click = () => { Sound.init(); Sound.play('click'); };
const FOUR = [{ label: 'File', icon: 'folder' }, { label: 'Convert', icon: 'repeat' }, { label: 'Edit', icon: 'sliders' }, { label: 'Share', icon: 'share' }];
const LAUNCHER = [{ label: 'Volume', icon: 'volume' }, { label: 'Music', icon: 'music' }, { label: 'System', icon: 'laptop' }, { label: 'Display', icon: 'monitor' }, { label: 'Safari', icon: 'compass' }];

function Rim() {  // a slider that runs round the rim: drag in a circle
  const [v, setV] = useState(0.45);
  const box = useRef<HTMLDivElement>(null), last = useRef<number | null>(null);
  const bearing = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    return (Math.atan2(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2)) * 180 / Math.PI + 360) % 360;
  };
  const move = (e: React.PointerEvent) => {
    if (last.current == null) return;
    const b = bearing(e); let d = b - last.current;
    if (d > 180) d -= 360; if (d < -180) d += 360;
    last.current = b;
    setV(old => { const n = Math.min(1, Math.max(0, old + d / 360)); if (Math.floor(n * 20) !== Math.floor(old * 20)) tick(); return n; });
  };
  return (
    <div className="demo-rim" ref={box} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); Sound.init(); last.current = bearing(e); }}
      onPointerMove={move} onPointerUp={() => (last.current = null)} role="slider" aria-label="Volume" aria-valuenow={Math.round(v * 100)} aria-valuemin={0} aria-valuemax={100} tabIndex={0}
      onKeyDown={e => { if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { setV(x => Math.min(1, x + 0.05)); tick(); } if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { setV(x => Math.max(0, x - 0.05)); tick(); } }}>
      <Dial slots={LAUNCHER} lit={0} name={`${Math.round(v * 100)}%`} sub="Volume" level={Math.max(0.001, v)} />
    </div>
  );
}

function Trim() {  // two handles on a strip of frames
  const [a, setA] = useState(0.22), [b, setB] = useState(0.68);
  const strip = useRef<HTMLDivElement>(null), which = useRef<'a' | 'b' | null>(null);
  const at = (e: React.PointerEvent) => { const r = strip.current!.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); };
  const t = (x: number) => `0:${String(Math.round(x * 20)).padStart(2, '0')}`;
  return (
    <div className="demo-trim">
      <div className="trim-strip big" ref={strip}
        onPointerDown={e => { const x = at(e); which.current = Math.abs(x - a) < Math.abs(x - b) ? 'a' : 'b'; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={e => { if (!which.current) return; const x = at(e); if (which.current === 'a') setA(Math.min(x, b - 0.1)); else setB(Math.max(x, a + 0.1)); }}
        onPointerUp={() => { which.current = null; tick(); }}>
        {Array.from({ length: 10 }, (_, i) => <i key={i} />)}
        <span className="trim-sel" style={{ left: `${a * 100}%`, right: `${(1 - b) * 100}%` }} />
      </div>
      <span className="trim-time">{t(a)} to {t(b)}, {Math.round((b - a) * 20)} s</span>
    </div>
  );
}

function Quality() {  // a format's quality, and the size it comes out at
  const [q, setQ] = useState(82);
  const kb = Math.round(2400 * (0.04 + 0.33 * (q / 100) ** 4));
  return (
    <div className="demo-quality">
      <label className="q-row"><span>WebP quality</span><b>{q}</b>
        <input type="range" min={10} max={100} value={q} onChange={e => { setQ(+e.target.value); if (+e.target.value % 5 === 0) tick(); }} aria-label="WebP quality" />
      </label>
      <span className="q-size">≈ {kb >= 1000 ? `${(kb / 1000).toFixed(1)} MB` : `${kb} KB`}, from 2.4 MB</span>
    </div>
  );
}

function Undo() {  // every result comes with Undo
  const [state, setState] = useState<'idle' | 'work' | 'done' | 'undone'>('idle');
  const run = () => { click(); setState('work'); setTimeout(() => { setState('done'); tick(); }, 900); };
  return (
    <div className="demo-undo">
      {state === 'idle' || state === 'undone'
        ? <button type="button" className="btn small" onClick={run}>Convert photo.heic to WebP</button>
        : <span className={`toast-mock${state === 'work' ? ' working' : ''}`}><Icon name="image" size={16} />{state === 'work' ? 'Converting…' : 'Saved photo.webp'}{state === 'done' && <button type="button" onClick={() => { click(); setState('undone'); }}>Undo</button>}</span>}
      <span className="demo-note" aria-live="polite">{state === 'undone' ? 'Moved photo.webp to the Trash' : ' '}</span>
    </div>
  );
}

const ACCENTS = ['#FFFFFF', '#FFD17D', '#C9B6FF', '#7FC8FF', '#8FE3A2', '#FF9ED8'];
function Looks() {  // Glass or Solid, in any highlight colour
  const [glass, setGlass] = useState(false), [accent, setAccent] = useState(ACCENTS[0]);
  return (
    <div className="demo-looks" style={{ '--accent': accent } as React.CSSProperties}>
      <button type="button" className={`look-btn${glass ? ' glass' : ''}`} onClick={() => { click(); setGlass(g => !g); }} aria-label={`Dial style: ${glass ? 'Glass' : 'Solid'}. Switch`}>
        <Dial className={`look ${glass ? 'glass' : 'solid'}`} slots={FOUR} lit={1} name={glass ? 'Glass' : 'Solid'} sub="Click to switch" />
      </button>
      <span className="look-dots">{ACCENTS.map(c => <button key={c} type="button" style={{ background: c }} aria-label={`Highlight ${c}`} aria-pressed={accent === c} onClick={() => { tick(); setAccent(c); }} />)}</span>
    </div>
  );
}

function Fingers() {  // tap with four fingers: the launcher
  const [n, setN] = useState(0);
  return (
    <button type="button" className="demo-pad" onClick={() => { click(); setN(x => x + 1); }} aria-label="Tap the trackpad with four fingers">
      <span className="pad-hint">Tap the trackpad</span>
      {n > 0 && <span key={n} className="pad-tap"><i /><i /><i /><i /></span>}
      {n > 0 && <span key={`l${n}`} className="pad-launch"><Dial slots={LAUNCHER} lit={0} name="Halodial" sub="Launcher" /></span>}
    </button>
  );
}

const FILES = ['photo.jpg', 'report.pdf', 'song.mp3'];
function ShelfDemo() {  // drop files on a shelf, take them out together
  const [on, setOn] = useState<string[]>([]);
  return (
    <div className="demo-shelf">
      <div className="demo-files">{FILES.map(f => (
        <button key={f} type="button" className={on.includes(f) ? 'on' : ''} onClick={() => { click(); setOn(o => (o.includes(f) ? o.filter(x => x !== f) : [...o, f])); }} aria-pressed={on.includes(f)} aria-label={`Put ${f} on the shelf`}>
          <FileIcon name={f} size={40} />
        </button>
      ))}</div>
      <div className="shelf mini">
        <div className="demo-stack">{on.length ? on.map((f, i) => <span key={f} style={{ rotate: `${(i - (on.length - 1) / 2) * 12}deg`, translate: `${(i - (on.length - 1) / 2) * 18}px 0` }}><FileIcon name={f} size={38} /></span>) : <span className="desk-empty">Tap files</span>}</div>
        <span className="shelf-pill">{on.length ? `${on.length} file${on.length > 1 ? 's' : ''}` : 'Empty'}</span>
      </div>
    </div>
  );
}

const STEPS = ['Resize 1920px', 'WebP'];
function Recipe() {  // several steps, one choice
  const [step, setStep] = useState(-1);
  const run = () => { click(); setStep(0); setTimeout(() => { tick(); setStep(1); }, 600); setTimeout(() => { tick(); setStep(2); }, 1200); };
  return (
    <div className="demo-recipe">
      <div className="art-recipe">
        {STEPS.map((s, i) => <span key={s} className={step > i ? 'did' : step === i ? 'doing' : ''}>{s}</span>)}
        <span className={step === 2 ? 'done' : 'ghost'}>photo.webp</span>
      </div>
      <button type="button" className="btn small" onClick={run} disabled={step >= 0 && step < 2}>{step === 2 ? 'Run again' : 'Run “Web image”'}</button>
    </div>
  );
}

const TILES: [demo: React.ReactNode, title: string, text: string][] = [
  [<Rim key="r" />, 'Sliders on the rim', 'Volume, brightness and the rest: drag in a circle, with a soft detent every step.'],
  [<Trim key="t" />, 'Trim to the frame', 'Two handles on a strip of frames. Space plays the cut.'],
  [<Quality key="q" />, 'Quality you choose', 'Per format. The dial shows the size before you convert.'],
  [<Undo key="u" />, 'Undo, every time', 'New files go to the Trash, moved files go back.'],
  [<Looks key="l" />, 'Glass or Solid', 'Two looks, in any highlight colour.'],
  [<Fingers key="f" />, 'Four fingers', 'A tap opens the launcher anywhere. Three fingers if you prefer.'],
  [<ShelfDemo key="s" />, 'The shelf', 'Collect files from anywhere, take them out together.'],
  [<Recipe key="c" />, 'Recipes', 'Chain steps into one choice on the dial.'],
];

export default function DemoGrid() {
  return (
    <div className="demos">
      {TILES.map(([demo, title, text]) => (
        <div key={title} className="demo">
          <div className="demo-stage">{demo}</div>
          <div className="demo-cap"><h3>{title}</h3><p>{text}</p></div>
        </div>
      ))}
    </div>
  );
}
