'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

// the area that gets captured, in the scene's coordinates
const SEL = { x: 230, y: 118, w: 340, h: 214 };
const STEPS = ['Select', 'Card', 'Mark up', 'Backdrop'];
// toolbar icons on a 24 grid (drawn at 18 px), in the app's order
const ACTIONS = [
  'M8 8V5.5A1.5 1.5 0 0 1 9.5 4h9A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H16M5.5 8h9A1.5 1.5 0 0 1 16 9.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 18.5v-9A1.5 1.5 0 0 1 5.5 8Z', // copy
  'M12 4v10m0 0-4-4m4 4 4-4M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15',                                          // save
  'M14.5 4.5 19.5 9.5M15 5l-5 4.5-3 .5 7 7 .5-3L19 9M10.5 13.5 5 19',                                                           // pin
];
const TOOLS = [
  'M6 4.5 18 11l-5.2 1.6L10.5 18Z',                                    // select
  'M6 18 18 6M10 6h8v8',                                                // arrow
  'M6 6.5h12M12 6.5V18M9.5 18h5',                                       // text
  'M3.5 9.5h17v6h-17ZM7.5 9.5v3M11.5 9.5v4M15.5 9.5v3',                 // ruler
  'M5.5 6.5h13a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z', // rectangle
  'M12 4.5c-3.2 4-5 6.4-5 8.9a5 5 0 0 0 10 0c0-2.5-1.8-4.9-5-8.9Z',     // blur
  'M10.5 4.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12ZM15 15l4.5 4.5M10.5 8v5M8 10.5h5', // magnifier
];

/** Capture, played out: the screen freezes, a crosshair drags out an area with the magnifier beside it, the
 *  capture card pops in, Edit opens the editor, and an arrow, a ruler, a blur and a magnifier go on before the
 *  backdrop slides in behind. Loops only while on screen; Reduce Motion shows the finished picture. */
export default function CaptureShow() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const one = (s: string) => q(s)[0] as unknown as SVGElement;
    const dim = one('.cap-dim'), sel = one('.cap-sel'), size = one('.cap-size'), sizeText = one('.cap-size text');
    const cursor = one('.cap-cursor'), loupe = one('.cap-loupe'), hex = one('.cap-loupe text');
    const steps = q('.cap-steps li');
    const step = (i: number) => steps.forEach((s, j) => s.classList.toggle('on', i === j));
    const setSel = (w: number, h: number) => {
      sel.setAttribute('width', String(w)); sel.setAttribute('height', String(h));
      // the whole stage, with the selection cut out
      dim.setAttribute('d', `M-600 -300H1560V770H-600Z M${SEL.x} ${SEL.y}h${w}v${h}h${-w}Z`);
      sizeText.textContent = `${Math.round(w)} × ${Math.round(h)} pt`;
    };

    const finished = () => {  // the last frame: what Reduce Motion shows, and where the loop ends
      gsap.set(['.cap-dim', '.cap-sel', '.cap-size', '.cap-cursor', '.cap-loupe', '.cap-card', '.cap-flash'], { autoAlpha: 0 });
      gsap.set('.cap-shot', { attr: { 'clip-path': 'url(#cap-clip)' } });
      gsap.set('.cap-stage', { x: 80, y: 18, scale: 1.18, svgOrigin: '400 225' });
      gsap.set(['.cap-backdrop', '.cap-tools', '.cap-mark'], { autoAlpha: 1, scale: 1 });
      gsap.set('.cap-draw', { drawSVG: '100%' });
      step(3);
    };

    gsap.matchMedia().add('(prefers-reduced-motion: reduce)', finished);
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      const reset = () => {
        gsap.set(['.cap-dim', '.cap-sel', '.cap-size', '.cap-loupe', '.cap-card', '.cap-flash', '.cap-backdrop', '.cap-tools', '.cap-mark'], { autoAlpha: 0 });
        gsap.set('.cap-shot', { attr: { 'clip-path': '' } });
        gsap.set('.cap-stage', { x: 0, y: 0, scale: 1, svgOrigin: '400 225' });
        gsap.set('.cap-draw', { drawSVG: '0%' });
        gsap.set('.cap-card', { x: 40, scale: 0.92, transformOrigin: '50% 100%' });
        gsap.set('.cap-backdrop', { scale: 0.86, transformOrigin: '50% 50%' });
        gsap.set(cursor, { autoAlpha: 1, x: 690, y: 330 });
        gsap.set(loupe, { x: 690 + 22, y: 330 + 22 });
        gsap.set(q('.cap-btn'), { attr: { fill: 'rgba(255,255,255,.07)' } });
        q('.cap-tool').forEach(t => t.classList.remove('on'));
        setSel(0, 0);
        step(0);
      };
      const tool = (i: number) => q('.cap-tool').forEach((t, j) => t.classList.toggle('on', i === j));
      const pt = { x: 690, y: 330 };
      const follow = () => { gsap.set(cursor, { x: pt.x, y: pt.y }); gsap.set(loupe, { x: pt.x + 22, y: pt.y + 22 }); };
      const drag = { w: 0, h: 0 };
      const colours = ['#7FC8FF', '#1E1E1E', '#C9B6FF', '#F6F3EE', '#8FE3A2'];

      const tl = gsap.timeline({ repeat: -1, paused: true, onRepeat: reset, defaults: { ease: 'power3.out' } });
      tl.call(reset)
        // 1. the screen freezes and dims; the crosshair finds the corner
        .to('.cap-dim', { autoAlpha: 1, duration: 0.4 }, 0.3)
        .to(loupe, { autoAlpha: 1, duration: 0.3 }, 0.4)
        .to(pt, { x: SEL.x, y: SEL.y, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { follow(); hex.textContent = colours[Math.floor(pt.x / 90) % colours.length]; } }, 0.5)
        // 2. drag out the area: the hole opens, the size counts up
        .call(() => { gsap.set([sel, size], { autoAlpha: 1 }); }, [], 1.65)
        .to(drag, { w: SEL.w, h: SEL.h, duration: 1.2, ease: 'power2.inOut', onUpdate: () => {
          setSel(drag.w, drag.h); pt.x = SEL.x + drag.w; pt.y = SEL.y + drag.h; follow();
          gsap.set(size, { x: SEL.x + drag.w / 2, y: SEL.y + drag.h + 22 });
        } }, 1.7)
        // 3. snap: a flash, the overlay goes, the card pops in
        .to('.cap-flash', { autoAlpha: 0.5, duration: 0.08, ease: 'none' }, 3.05)
        .to('.cap-flash', { autoAlpha: 0, duration: 0.4 }, 3.13)
        .to(['.cap-dim', sel, size, loupe, cursor], { autoAlpha: 0, duration: 0.25 }, 3.1)
        .call(() => step(1), [], 3.2)
        .to('.cap-card', { autoAlpha: 1, x: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, 3.25)
        .to(q('.cap-btn')[2], { attr: { fill: 'rgba(255,255,255,.22)' }, duration: 0.2, yoyo: true, repeat: 1 }, 4.4)
        // 4. Edit: the card goes, the capture becomes the canvas
        .to('.cap-card', { autoAlpha: 0, scale: 0.9, x: 20, duration: 0.35, ease: 'power2.in' }, 4.85)
        .set('.cap-shot', { attr: { 'clip-path': 'url(#cap-clip)' } }, 5.05)
        .to('.cap-stage', { x: 80, y: 18, scale: 1.18, duration: 0.8, ease: 'expo.inOut' }, 5.05)
        .fromTo('.cap-tools', { y: -8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 5.5)
        .call(() => { step(2); tool(0); }, [], 5.6)
        // 5. the marks, one tool at a time
        .call(() => tool(1), [], 5.9)
        .to('.cap-arrow', { autoAlpha: 1, duration: 0.01 }, 5.9)
        .fromTo('.cap-arrow .cap-draw', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' }, 5.95)
        .from('.cap-arrow .cap-head', { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(3)' }, 6.45)
        .call(() => tool(3), [], 6.9)
        .to('.cap-ruler', { autoAlpha: 1, duration: 0.01 }, 6.9)
        .fromTo('.cap-ruler .cap-draw', { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 0.55, ease: 'power2.out' }, 6.95)
        .from('.cap-ruler .cap-label', { autoAlpha: 0, y: 4, duration: 0.3 }, 7.3)
        .call(() => tool(5), [], 7.8)
        .to('.cap-blur', { autoAlpha: 1, duration: 0.01 }, 7.8)
        .from('.cap-blur rect', { scale: 0, transformOrigin: '50% 50%', duration: 0.3, stagger: { each: 0.02, from: 'random' }, ease: 'back.out(2)' }, 7.85)
        .call(() => tool(6), [], 8.6)
        .to('.cap-mag', { autoAlpha: 1, duration: 0.01 }, 8.6)
        .from('.cap-mag .cap-spot', { scale: 0, transformOrigin: '50% 50%', duration: 0.3 }, 8.65)
        .fromTo('.cap-mag .cap-draw', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4 }, 8.85)
        .from('.cap-mag .cap-lens', { scale: 0.2, autoAlpha: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(1.8)' }, 9.05)
        // 6. the backdrop slides in behind it all
        .call(() => { tool(-1); step(3); }, [], 9.9)
        .to('.cap-stage', { scale: 1.02, x: 80, y: 18, duration: 0.7, ease: 'expo.inOut' }, 9.9)
        .to('.cap-backdrop', { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'expo.out' }, 10.0)
        .to({}, { duration: 1.8 })
        .to(['.cap-stage'], { autoAlpha: 0, duration: 0.45, ease: 'power2.in' })
        .set('.cap-stage', { autoAlpha: 1 });

      let inView = false;
      ScrollTrigger.create({ trigger: root.current, start: 'top 85%', end: 'bottom 15%', onToggle: s => { inView = s.isActive; inView ? tl.play() : tl.pause(); } });
      return () => tl.kill();
    });
  }, { scope: root });

  return (
    <article className="product wide capture" ref={root}>
      <div className="product-stage stage-capture">
        <svg className="cap-scene" viewBox="0 0 960 470" role="img" aria-label="A screen capture being selected, then marked up with an arrow, a ruler, a blur and a magnifier, then given a backdrop">
          <defs>
            <linearGradient id="cap-bd" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#C9B6FF" /><stop offset=".5" stopColor="#7FC8FF" /><stop offset="1" stopColor="#8FE3A2" />
            </linearGradient>
            <clipPath id="cap-clip"><rect x={SEL.x} y={SEL.y} width={SEL.w} height={SEL.h} rx="6" /></clipPath>
            <linearGradient id="d-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C9B6FF" stopOpacity=".32" /><stop offset="1" stopColor="#C9B6FF" stopOpacity="0" /></linearGradient>
            <linearGradient id="d-spark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7FC8FF" stopOpacity=".3" /><stop offset="1" stopColor="#7FC8FF" stopOpacity="0" /></linearGradient>
            <clipPath id="cap-thumb-clip"><rect x="14" y="14" width="222" height="138" rx="10" /></clipPath>
            <clipPath id="cap-lens-clip"><circle cx="512" cy="292" r="44" /></clipPath>
            <filter id="cap-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="16" floodOpacity=".5" /></filter>
          </defs>

          <g className="cap-stage">
            <rect className="cap-backdrop" x={SEL.x - 34} y={SEL.y - 26} width={SEL.w + 68} height={SEL.h + 52} rx="18" fill="url(#cap-bd)" />
            {/* the "screen": a real-looking dashboard in a browser window (a made-up app, Orbit) */}
            <g className="cap-shot" filter="url(#cap-shadow)"><g id="cap-dash">
              <rect x="150" y="54" width="480" height="340" rx="14" fill="#141416" stroke="rgba(255,255,255,.09)" />
              <path d="M150 82V68a14 14 0 0 1 14-14h452a14 14 0 0 1 14 14v14Z" fill="#1B1B1E" />
              <circle cx="166" cy="68" r="4.5" fill="#FF5F57" /><circle cx="180" cy="68" r="4.5" fill="#FEBC2E" /><circle cx="194" cy="68" r="4.5" fill="#28C840" />
              <path className="d-ic" d="M214 63h12v10h-12ZM218 63v10M240 64l-4 4 4 4M250 64l4 4-4 4" />
              <rect x="300" y="61" width="250" height="14" rx="7" fill="#232327" />
              <path className="d-ic" d="M392 66.5h4v5h-4ZM393 66.5v-1.2a1 1 0 0 1 2 0v1.2" />
              <text x="400" y="71.3" className="d-t d-url">orbit.app/overview</text>
              <rect x="150" y="82" width="480" height="1" fill="rgba(255,255,255,.06)" />
              {/* sidebar */}
              <rect x="150" y="83" width="88" height="311" fill="#18181B" />
              <rect x="160" y="94" width="16" height="16" rx="5" fill="url(#cap-bd)" />
              <circle cx="168" cy="102" r="4" fill="none" stroke="#141416" strokeWidth="1.6" />
              <text x="181" y="106" className="d-t d-brand">Orbit</text>
              <rect x="158" y="120" width="72" height="16" rx="5" fill="#222226" stroke="rgba(255,255,255,.06)" />
              <circle cx="166" cy="128" r="2.6" className="d-ic" /><path className="d-ic" d="M168 130l1.6 1.6" />
              <text x="173" y="130.8" className="d-t d-dim">Search…</text>
              <rect x="219" y="123" width="8" height="10" rx="2" fill="#2E2E33" /><text x="223" y="130.6" className="d-t d-key" textAnchor="middle">/</text>
              {[['Overview', 'M0 0h3v3H0ZM5 0h3v3H5ZM0 5h3v3H0ZM5 5h3v3H5Z'], ['Files', 'M0 1.5h3l1 1h4v5H0Z'], ['Shelves', 'M0 2h8M0 5h8M0 8h8'], ['Reports', 'M1 8V4M4 8V1M7 8V5']].map(([t, d], i) => (
                <g key={t} transform={`translate(158 ${146 + i * 20})`}>
                  {i === 0 && <><rect width="72" height="16" rx="5" fill="#26262B" /><rect x="0" y="3" width="2" height="10" rx="1" fill="#C9B6FF" /></>}
                  <path d={d} transform="translate(7 4)" className={i === 0 ? 'd-ic on' : 'd-ic'} />
                  <text x="20" y="11" className={i === 0 ? 'd-t d-nav on' : 'd-t d-nav'}>{t}</text>
                </g>
              ))}
              {/* header */}
              <text x="250" y="105" className="d-t d-h">Overview</text>
              <rect x="560" y="94" width="58" height="15" rx="5" fill="#222226" stroke="rgba(255,255,255,.06)" />
              <text x="567" y="104.6" className="d-t d-dim">30 days</text><path className="d-ic" d="M606 100l2.5 2.5 2.5-2.5" />
              {/* card: files converted, a segmented meter */}
              <rect x="248" y="118" width="178" height="80" rx="10" fill="#1B1B1F" stroke="rgba(255,255,255,.06)" />
              <text x="258" y="133" className="d-t d-label">Files converted</text>
              <text x="258" y="156" className="d-t d-num">1,284</text>
              {Array.from({ length: 30 }, (_, i) => <rect key={i} x={258 + i * 5.3} y="163" width="3.2" height="12" rx="1.6" fill={i < 19 ? '#8FE3A2' : i < 25 ? '#7FC8FF' : '#33333A'} opacity={i < 19 ? 0.55 + i / 45 : 1} />)}
              <text x="258" y="189" className="d-t d-dim">Shared with</text>
              <text x="296" y="189" className="d-t d-mail">ana@orbit.app</text>
              {/* card: time saved, a sparkline */}
              <rect x="438" y="118" width="180" height="80" rx="10" fill="#1B1B1F" stroke="rgba(255,255,255,.06)" />
              <text x="448" y="133" className="d-t d-label">Time saved</text>
              <text x="448" y="156" className="d-t d-num">24 hr 32 min</text>
              <path d="M448 186 L466 180 L480 182 L494 176 L510 178 L524 171 L540 174 L556 169 L572 172 L590 164 L606 167 V190 H448Z" fill="url(#d-spark)" />
              <path d="M448 186 L466 180 L480 182 L494 176 L510 178 L524 171 L540 174 L556 169 L572 172 L590 164 L606 167" fill="none" stroke="#7FC8FF" strokeWidth="1.4" strokeLinejoin="round" />
              {/* card: conversions over the year, with a tooltip */}
              <rect x="248" y="206" width="370" height="180" rx="10" fill="#1B1B1F" stroke="rgba(255,255,255,.06)" />
              <text x="258" y="222" className="d-t d-label">Conversions</text>
              <rect x="580" y="212" width="30" height="14" rx="4.5" fill="#222226" stroke="rgba(255,255,255,.06)" /><text x="586" y="222" className="d-t d-dim">2026</text>
              {[248, 278, 308].map(y => <rect key={y} x="272" y={y} width="336" height="0.8" fill="rgba(255,255,255,.05)" />)}
              <path d="M272 330 L290 322 L308 326 L326 304 L344 292 L362 296 L380 278 L398 284 L416 266 L434 272 L452 258 L470 262 L488 274 L506 268 L524 286 L542 278 L560 290 L578 284 L596 300 L608 296 V338 H272Z" fill="url(#d-area)" />
              <path className="d-line" d="M272 330 L290 322 L308 326 L326 304 L344 292 L362 296 L380 278 L398 284 L416 266 L434 272 L452 258 L470 262 L488 274 L506 268 L524 286 L542 278 L560 290 L578 284 L596 300 L608 296" />
              <rect x="452" y="248" width="0.8" height="90" fill="rgba(255,255,255,.2)" />
              <circle cx="452" cy="258" r="4" fill="#C9B6FF" stroke="#1B1B1F" strokeWidth="2" />
              <g transform="translate(460 232)">
                <rect width="58" height="28" rx="6" fill="#26262B" stroke="rgba(255,255,255,.1)" />
                <text x="7" y="11" className="d-t d-dim">May 2026</text>
                <circle cx="10" cy="20" r="2.6" fill="#C9B6FF" /><text x="16" y="22.6" className="d-t d-tip">412 files</text>
              </g>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, i) => <text key={m} x={276 + i * 54} y="352" className="d-t d-axis">{m}</text>)}
              <text x="258" y="372" className="d-t d-dim">Most used: WebP · PNG · HEIC</text>
            </g></g>

            {/* marks, drawn in the editor (they may reach past the capture, like the app's growing canvas) */}
            <g className="cap-mark cap-arrow">
              <path className="cap-draw" d="M 548 170 C 540 205, 520 222, 492 236" stroke="#FF453A" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path className="cap-head" d="M 478 243 L 494 226 L 500 244 Z" fill="#FF453A" />
            </g>
            <g className="cap-mark cap-ruler">
              <path className="cap-draw" d="M 426 140 H 438 M 426 134 V 146 M 438 134 V 146" stroke="#FF453A" strokeWidth="1.8" fill="none" />
              <g className="cap-label"><rect x="414" y="104" width="36" height="15" rx="4" fill="#FF453A" /><text x="432" y="115" textAnchor="middle" className="cap-t">12 pt</text></g>
            </g>
            <g className="cap-mark cap-blur">
              {Array.from({ length: 22 }, (_, i) => <rect key={i} x={295 + (i % 11) * 5.4} y={182 + Math.floor(i / 11) * 5} width="5.4" height="5" fill={['#5A5A62', '#7A7A84', '#46464E', '#8A8A94'][(i * 7) % 4]} />)}
            </g>
            <g className="cap-mark cap-mag">
              <circle className="cap-spot" cx="452" cy="258" r="11" fill="none" stroke="#FF453A" strokeWidth="1.8" />
              <path className="cap-draw" d="M 446 268 L 508 312 M 462 260 L 542 270" stroke="#FF453A" strokeWidth="1.4" fill="none" />
              <g className="cap-lens">
                <g clipPath="url(#cap-lens-clip)">
                  <rect x="468" y="248" width="88" height="88" fill="#1B1B1F" />
                  <path d="M470 330 L496 298 L512 304 L534 284 L560 296" fill="none" stroke="#C9B6FF" strokeWidth="5" strokeLinejoin="round" />
                  <rect x="512" y="250" width="2.4" height="90" fill="rgba(255,255,255,.25)" />
                  <circle cx="513" cy="300" r="9" fill="#C9B6FF" stroke="#1B1B1F" strokeWidth="4" />
                </g>
                <circle cx="512" cy="292" r="44" fill="none" stroke="#FF453A" strokeWidth="2.5" />
              </g>
            </g>
          </g>

          {/* capture overlay: the dim with a hole, the selection, its size, the crosshair and the magnifier */}
          <path className="cap-dim" d="M-600 -300H1560V770H-600Z" fill="rgba(0,0,0,.55)" fillRule="evenodd" />
          <rect className="cap-sel" x={SEL.x} y={SEL.y} width="0" height="0" fill="none" stroke="#fff" strokeWidth="1.2" />
          <g className="cap-size"><rect x="-46" y="-11" width="92" height="22" rx="11" fill="rgba(0,0,0,.75)" /><text y="4" textAnchor="middle" className="cap-t">0 × 0 pt</text></g>
          <rect className="cap-flash" x="-600" y="-300" width="2160" height="1070" fill="#fff" />
          <g className="cap-loupe">
            <rect width="64" height="64" rx="10" fill="#0E0E0E" stroke="rgba(255,255,255,.3)" />
            <path d="M8 0V64M16 0V64M24 0V64M32 0V64M40 0V64M48 0V64M56 0V64M0 8H64M0 16H64M0 24H64M0 32H64M0 40H64M0 48H64M0 56H64" stroke="rgba(255,255,255,.06)" />
            <rect x="28" y="28" width="8" height="8" fill="none" stroke="#fff" />
            <rect x="-2" y="70" width="68" height="18" rx="9" fill="rgba(0,0,0,.75)" />
            <text x="32" y="83" textAnchor="middle" className="cap-t">#7FC8FF</text>
          </g>
          <g className="cap-cursor"><path d="M-11 0H-3M3 0H11M0 -11V-3M0 3V11" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></g>

          {/* the capture card */}
          <g transform="translate(664 168)"><g className="cap-card">
            <rect width="250" height="240" rx="18" fill="rgba(30,30,30,.92)" stroke="rgba(255,255,255,.1)" />
            <rect x="14" y="14" width="222" height="138" rx="10" fill="#161616" />
            {/* the captured area itself, scaled into the preview */}
            <g clipPath="url(#cap-thumb-clip)">
              <use href="#cap-dash" transform={`translate(${14 - SEL.x * 0.653} ${14 + (138 - SEL.h * 0.653) / 2 - SEL.y * 0.653}) scale(.653)`} />
            </g>
            <rect x="14" y="14" width="222" height="138" rx="10" fill="none" stroke="rgba(255,255,255,.1)" />
            <text x="16" y="174" className="cap-t dim">340 × 214 pt · Orbit</text>
            {['Copy', 'Save', 'Edit', 'Text', 'Pin'].map((t, i) => (
              <g key={t} transform={`translate(${14 + i * 45} 186)`}>
                <rect className="cap-btn" width="41" height="40" rx="9" fill="rgba(255,255,255,.07)" />
                <text x="20.5" y="25" textAnchor="middle" className="cap-t">{t}</text>
              </g>
            ))}
          </g></g>

          {/* the editor's toolbar, as in the app: actions | tools | colour */}
          <g transform="translate(277 10)"><g className="cap-tools">
            <rect width="406" height="44" rx="14" fill="rgba(28,28,30,.94)" stroke="rgba(255,255,255,.1)" />
            <rect x="1" y="1" width="404" height="21" rx="13" fill="rgba(255,255,255,.035)" />
            {ACTIONS.map((d, i) => (
              <g key={i} className="cap-act" transform={`translate(${8 + i * 32} 7)`}>
                <path d={d} transform="translate(6 6) scale(.75)" />
              </g>
            ))}
            <rect x="110" y="13" width="1" height="18" fill="rgba(255,255,255,.12)" />
            {TOOLS.map((d, i) => (
              <g key={i} className="cap-tool" transform={`translate(${120 + i * 33} 7)`}>
                <rect width="30" height="30" rx="8" />
                <path d={d} transform="translate(6 6) scale(.75)" />
              </g>
            ))}
            <rect x="358" y="13" width="1" height="18" fill="rgba(255,255,255,.12)" />
            <circle cx="381" cy="22" r="8" fill="#FF453A" stroke="rgba(255,255,255,.85)" strokeWidth="1.5" />
          </g></g>
        </svg>
      </div>
      <div className="product-meta">
        <div>
          <h3>Capture</h3>
          <p>Press <kbd>⇧</kbd><kbd>⌘</kbd><kbd>2</kbd>, drag an area or click a window. Copy it, save it, pin it above everything, or read the text in it. In the editor: arrows, text, a ruler that snaps to edges, boxes, blur, a magnifier, numbered steps and a backdrop. It all stays on your Mac.</p>
          <ol className="cap-steps" aria-hidden="true">{STEPS.map(s => <li key={s}>{s}</li>)}</ol>
        </div>
        <span className="how">Press <kbd>⇧</kbd><kbd>⌘</kbd><kbd>2</kbd></span>
      </div>
    </article>
  );
}
