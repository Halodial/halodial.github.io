'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// A real photo, and real WebP files made from it with cwebp (the encoder Halodial uses) at each quality.
// Sizes in KB as Finder shows them (1 KB = 1000 bytes); remake with: cwebp -q <q> original.jpg -o q<q>.webp
const ORIGINAL_KB = 286;
const VERSIONS: Record<number, number> = { 40: 33, 82: 112, 100: 579 };
const fmt = (kb: number) => (kb >= 1000 ? `${(kb / 1000).toFixed(1)} MB` : `${Math.round(kb)} KB`);

/** Before and after: drag the line (or use the arrow keys) between the original JPEG and the WebP; pick a quality
 *  and the size rolls to its new value. */
export default function BeforeAfter() {
  const [x, setX] = useState(0.5);
  const [q, setQ] = useState(82);
  const box = useRef<HTMLDivElement>(null), size = useRef<HTMLElement>(null), shown = useRef(VERSIONS[82]);
  const drag = useRef(false);

  useEffect(() => {  // the size label rolls from the old value to the new one
    const o = { v: shown.current };
    const t = gsap.to(o, { v: VERSIONS[q], duration: 0.7, ease: 'power2.out', onUpdate: () => { shown.current = o.v; if (size.current) size.current.textContent = fmt(o.v); } });
    return () => { t.kill(); };
  }, [q]);

  const at = (e: React.PointerEvent) => { const r = box.current!.getBoundingClientRect(); setX(Math.min(0.97, Math.max(0.03, (e.clientX - r.left) / r.width))); };
  const pct = Math.round((VERSIONS[q] / ORIGINAL_KB) * 100);
  return (
    <div className="ba">
      <div className="ba-frame" ref={box} onPointerDown={e => { drag.current = true; try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ } at(e); }}
        onPointerMove={e => drag.current && at(e)} onPointerUp={() => (drag.current = false)}>
        <img src="/assets/compare/original.jpg" alt="Misty mountain ridges in black and white, the original JPEG" draggable={false} loading="lazy" decoding="async" />
        <div className="ba-after" style={{ clipPath: `inset(0 0 0 ${x * 100}%)` }}>
          {/* one image per quality; a hidden one only downloads once it's picked */}
          {[40, 82, 100].map(v => <img key={v} src={`/assets/compare/q${v}.webp`} alt="" draggable={false} hidden={v !== q} loading="lazy" decoding="async" />)}
        </div>
        <div className="ba-line" style={{ left: `${x * 100}%` }}><span className="ba-knob" /></div>
        <span className="ba-tag left">Original JPEG, {fmt(ORIGINAL_KB)}</span>
        <span className="ba-tag right">WebP {q}, <b ref={size}>{fmt(VERSIONS[82])}</b></span>
        <input className="ba-range" type="range" min={3} max={97} value={Math.round(x * 100)} onChange={e => setX(+e.target.value / 100)} aria-label="Compare the original JPEG and the WebP" />
      </div>
      <div className="ba-controls">
        <span>WebP quality</span>
        <div className="seg" role="group" aria-label="WebP quality">
          {[40, 82, 100].map(v => <button key={v} type="button" aria-pressed={q === v} onClick={() => setQ(v)}>{v}</button>)}
        </div>
        <span className="ba-note">{pct < 100 ? `${pct}% of the original's size.` : `${pct}% of the original: 100 is bigger than the JPEG it came from.`} Real files, made with the encoder Halodial uses.</span>
      </div>
    </div>
  );
}
