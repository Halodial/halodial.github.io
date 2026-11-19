'use client';
import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sound } from '@/lib/playground';
import Dial from './Dial';

gsap.registerPlugin(useGSAP);

const PAGES = [
  { label: 'Home', icon: 'layout', href: '/' },
  { label: 'Try it', icon: 'play', href: '/try/' },
  { label: 'Formats', icon: 'repeat', href: '/formats/' },
  { label: 'Recipes', icon: 'sparkles', href: '/recipes/' },
  { label: 'Help', icon: 'chat', href: '/help/' },
  { label: 'Download', icon: 'inbox', href: '/#download' },
];

/** The 404 dial: the halo draws in, the dial opens with 404 in the hub, and the rim marker circles, looking.
 *  Point at a slot and it settles there with the click; click to go. Arrow keys and Return work too. */
export default function LostDial() {
  const root = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<number | null>(null);
  const search = useRef<gsap.core.Tween | null>(null);
  const step = 360 / PAGES.length;

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    q('.tile').forEach(t => t.classList.remove('on'));  // nothing lit while the marker searches
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(q('.lost-halo'), { attr: { 'stroke-dashoffset': 1 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 1.6, ease: 'power2.inOut' });
      gsap.from(q('.dial-body'), { scale: 0.6, autoAlpha: 0, duration: 0.6, delay: 0.5, ease: 'back.out(1.6)', svgOrigin: '0 0' });
      gsap.from(q('.tile'), { scale: 0.5, autoAlpha: 0, duration: 0.3, stagger: 0.04, delay: 0.6, ease: 'back.out(2.5)', svgOrigin: '0 0' });
      search.current = gsap.to(q('.marker'), { rotation: '+=360', duration: 5, ease: 'none', repeat: -1, svgOrigin: '0 0', delay: 1.2 });
    });
  }, { scope: root });

  const pick = (i: number | null) => {
    if (i === sel) return;
    setSel(i);
    root.current?.querySelectorAll('.tile').forEach((t, j) => t.classList.toggle('on', j === i));
    const marker = root.current?.querySelector('.marker');
    if (i == null) { search.current?.resume(); return; }
    search.current?.pause();
    if (marker) gsap.to(marker, { rotation: i * step, duration: 0.35, ease: 'power3.out', svgOrigin: '0 0', overwrite: 'auto' });
    Sound.init(); Sound.play('click');
  };
  const slotAt = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect(), k = 420 / r.width;
    const dx = (e.clientX - r.left - r.width / 2) * k, dy = (e.clientY - r.top - r.height / 2) * k, d = Math.hypot(dx, dy);
    if (d < 62 || d > 150) return null;
    return Math.floor((((Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360) + step / 2) % 360 / step) % PAGES.length;
  };

  return (
    <div className="lost-dial" ref={root}>
      <svg className="lost-ring" viewBox="-210 -210 420 420" aria-hidden="true">
        <defs><linearGradient id="lost-iris" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#C9B6FF" /><stop offset=".5" stopColor="#7FC8FF" /><stop offset="1" stopColor="#8FE3A2" /></linearGradient></defs>
        <circle className="lost-halo" r="166" fill="none" stroke="url(#lost-iris)" strokeWidth="1.6" pathLength={1} strokeDasharray="1 1" transform="rotate(-90)" />
      </svg>
      <div className="lost-hit" role="menu" aria-label="Pages" tabIndex={0}
        onPointerMove={e => pick(slotAt(e))} onPointerLeave={() => pick(null)}
        onClick={e => { const i = slotAt(e as unknown as React.PointerEvent); if (i != null) location.href = PAGES[i].href; }}
        onKeyDown={e => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); pick(((sel ?? -1) + 1) % PAGES.length); }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pick(((sel ?? 0) - 1 + PAGES.length) % PAGES.length); }
          if (e.key === 'Enter' && sel != null) location.href = PAGES[sel].href;
        }}>
        <Dial slots={PAGES} lit={0} name={sel != null ? PAGES[sel].label : '404'} sub={sel != null ? 'Click to go' : 'This page isn’t here'} />
      </div>
      <p className="sr" aria-live="polite">{sel != null ? `${PAGES[sel].label}, press Return to go` : ''}</p>
    </div>
  );
}
