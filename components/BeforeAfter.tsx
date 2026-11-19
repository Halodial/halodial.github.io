'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const kbOf = (q: number) => Math.round(2400 * (0.04 + 0.33 * (q / 100) ** 4));  // a believable WebP size curve
const fmt = (kb: number) => (kb >= 1000 ? `${(kb / 1000).toFixed(1)} MB` : `${Math.round(kb)} KB`);
const QUALITIES = [40, 82, 100];

/** The scene, drawn once and shown twice. `rough` posterises it, the way heavy compression bands a sky. */
function Scene({ rough }: { rough: boolean }) {
  return (
    <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ba-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1B1F4B" /><stop offset=".55" stopColor="#E06C8A" /><stop offset="1" stopColor="#FFC58A" /></linearGradient>
        <linearGradient id="ba-lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2A07B" /><stop offset="1" stopColor="#2A2350" /></linearGradient>
        <filter id="ba-rough"><feGaussianBlur stdDeviation="2.2" /><feComponentTransfer><feFuncR type="discrete" tableValues="0 0.042 0.083 0.125 0.167 0.208 0.25 0.292 0.333 0.375 0.417 0.458 0.5 0.542 0.583 0.625 0.667 0.708 0.75 0.792 0.833 0.875 0.917 0.958 1" /><feFuncG type="discrete" tableValues="0 0.042 0.083 0.125 0.167 0.208 0.25 0.292 0.333 0.375 0.417 0.458 0.5 0.542 0.583 0.625 0.667 0.708 0.75 0.792 0.833 0.875 0.917 0.958 1" /><feFuncB type="discrete" tableValues="0 0.042 0.083 0.125 0.167 0.208 0.25 0.292 0.333 0.375 0.417 0.458 0.5 0.542 0.583 0.625 0.667 0.708 0.75 0.792 0.833 0.875 0.917 0.958 1" /></feComponentTransfer></filter>
      </defs>
      <g filter={rough ? 'url(#ba-rough)' : undefined}>
        <rect width="800" height="450" fill="url(#ba-sky)" />
        <circle cx="560" cy="250" r="54" fill="#FFE2B0" />
        <path d="M0 300 L120 210 L210 270 L330 170 L470 290 L560 240 L680 300 L800 220 V450 H0z" fill="#3A2C5E" />
        <path d="M0 330 L160 260 L300 320 L420 250 L560 330 L700 280 L800 320 V450 H0z" fill="#241C42" />
        <rect y="340" width="800" height="110" fill="url(#ba-lake)" opacity=".85" />
        <path d="M520 360h80M500 380h120M530 400h60" stroke="#FFE2B0" strokeWidth="3" strokeLinecap="round" opacity=".6" />
      </g>
    </svg>
  );
}

/** Before and after: drag the line (or use the arrow keys) between the original and the WebP; pick a quality
 *  and the size rolls to its new value. An illustration, not a real photo. */
export default function BeforeAfter() {
  const [x, setX] = useState(0.5);
  const [q, setQ] = useState(82);
  const box = useRef<HTMLDivElement>(null), size = useRef<HTMLElement>(null), shown = useRef(kbOf(82));
  const drag = useRef(false);

  useEffect(() => {  // the size label rolls from the old value to the new one
    const o = { v: shown.current };
    const t = gsap.to(o, { v: kbOf(q), duration: 0.7, ease: 'power2.out', onUpdate: () => { shown.current = o.v; if (size.current) size.current.textContent = fmt(o.v); } });
    return () => { t.kill(); };
  }, [q]);

  const at = (e: React.PointerEvent) => { const r = box.current!.getBoundingClientRect(); setX(Math.min(0.97, Math.max(0.03, (e.clientX - r.left) / r.width))); };
  return (
    <div className="ba">
      <div className="ba-frame" ref={box} onPointerDown={e => { drag.current = true; try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ } at(e); }}
        onPointerMove={e => drag.current && at(e)} onPointerUp={() => (drag.current = false)}>
        <Scene rough={false} />
        <div className="ba-after" style={{ clipPath: `inset(0 0 0 ${x * 100}%)` }}><Scene rough={q < 60} /></div>
        <div className="ba-line" style={{ left: `${x * 100}%` }}><span className="ba-knob" /></div>
        <span className="ba-tag left">Original HEIC, 2.4 MB</span>
        <span className="ba-tag right">WebP {q}, <b ref={size}>{fmt(kbOf(82))}</b></span>
        <input className="ba-range" type="range" min={3} max={97} value={Math.round(x * 100)} onChange={e => setX(+e.target.value / 100)} aria-label="Compare original and WebP" />
      </div>
      <div className="ba-controls">
        <span>WebP quality</span>
        <div className="seg" role="group" aria-label="WebP quality">
          {QUALITIES.map(v => <button key={v} type="button" aria-pressed={q === v} onClick={() => setQ(v)}>{v}</button>)}
        </div>
        <span className="ba-note">An illustration. Try 40 to see what too far looks like.</span>
      </div>
    </div>
  );
}
