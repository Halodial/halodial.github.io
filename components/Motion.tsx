'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);

/** Scroll motion for every page, by attribute, so pages stay plain markup:
 *  data-split  a heading whose lines rise out of a mask as it comes into view
 *  data-rise   a group whose children float up one after another
 *  data-draw   a group whose icons draw their strokes in
 *  data-count  a number that rolls from data-from to data-to (data-unit="kb" shows KB/MB) as it comes into view
 *  Also: big buttons lean towards the pointer, and the formats strip runs faster while the page scrolls.
 *  Everything plays once; with reduced motion nothing moves and everything is simply there. */
export default function Motion() {
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      document.querySelectorAll<HTMLElement>('[data-split]').forEach(el => {
        SplitText.create(el, {
          type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
          onSplit: s => gsap.from(s.lines, {
            yPercent: 110, duration: 1.1, stagger: 0.09, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }),
        });
      });
      document.querySelectorAll<HTMLElement>('[data-rise]').forEach(el =>
        gsap.from(el.children, {
          y: 34, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        }));
      document.querySelectorAll<HTMLElement>('[data-draw]').forEach(el =>
        gsap.from(el.querySelectorAll('svg path, svg circle, svg rect, svg line'), {
          drawSVG: 0, duration: 1.4, stagger: 0.05, ease: 'power2.inOut',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }));

      document.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
        const from = +(el.dataset.from ?? 0), to = +(el.dataset.to ?? 0), kb = el.dataset.unit === 'kb';
        const show = (v: number) => { el.textContent = kb ? (v >= 1000 ? `${(v / 1000).toFixed(1)} MB` : `${Math.round(v)} KB`) : String(Math.round(v)); };
        const o = { v: from };
        show(from);
        gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', onUpdate: () => show(o.v), scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });

      // the formats strip: faster while scrolling, easing back to its own pace
      const rows = gsap.utils.toArray<HTMLElement>('.strip-row');
      if (rows.length) {
        let boost = 0;
        ScrollTrigger.create({ onUpdate: self => { boost = Math.min(5, Math.abs(self.getVelocity()) / 400); } });
        const tick = () => {
          boost *= 0.92;
          rows.forEach(r => r.getAnimations().forEach(a => { a.playbackRate = 1 + boost; }));
        };
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
      }
    });

    // big buttons take the cursor in like an amoeba, for a mouse or trackpad only. Near a big button the cursor turns
    // into a drop of the button's own colour. A goo filter melts shapes of one colour together, so as the drop reaches
    // the edge the button bulges out to meet it, they join, and the drop is swallowed; leaving, the button stretches
    // after it until it pinches off, and the drop shrinks away and the cursor comes back. Colours never change and the
    // label stays sharp (only the layer behind it is filtered). The button itself leans a few pixels at most.
    gsap.matchMedia().add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const REACH = 70, PAD = 80, DOT = 22, LEAN = 0.08, MAX = 6;  // px: zone, layer overhang, drop size; lean share, max
      const root = document.documentElement;
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      defs.setAttribute('class', 'goo-defs');
      defs.innerHTML = '<filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="7" /><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -10" /></filter>';
      document.body.appendChild(defs);

      // each big button draws its body in a goo layer behind its label, with a drop that can join it
      const parts = new Map<HTMLElement, { dot: HTMLElement; x: (v: number) => void; y: (v: number) => void }>();
      document.querySelectorAll<HTMLElement>('.btn:not(.small)').forEach(b => {
        const colour = getComputedStyle(b).backgroundColor;
        const layer = document.createElement('span');
        layer.className = 'goo';
        layer.setAttribute('aria-hidden', 'true');
        layer.innerHTML = `<span class="goo-body" style="background:${colour}"></span><span class="goo-dot" style="background:${colour}"></span>`;
        b.prepend(layer);
        b.classList.add('gooey');
        const dot = layer.lastElementChild as HTMLElement;
        gsap.set(dot, { width: DOT, height: DOT, xPercent: -50, yPercent: -50, scale: 0 });
        parts.set(b, { dot, x: gsap.quickTo(dot, 'x', { duration: 0.18, ease: 'power2.out' }), y: gsap.quickTo(dot, 'y', { duration: 0.18, ease: 'power2.out' }) });
      });

      let near: HTMLElement | null = null;
      const leave = () => {
        if (!near) return;
        const p = parts.get(near)!;
        gsap.to(p.dot, { scale: 0, duration: 0.3, ease: 'power2.in', overwrite: 'auto' });
        gsap.to(near, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, .4)', overwrite: 'auto' });
        near = null;
        root.classList.remove('cursor-in-goo');
      };
      const onMove = (e: PointerEvent) => {
        let hit: HTMLElement | null = null, dx = 0, dy = 0;
        for (const b of parts.keys()) {
          const r = b.getBoundingClientRect();
          const cx = r.left + r.width / 2 - (gsap.getProperty(b, 'x') as number), cy = r.top + r.height / 2 - (gsap.getProperty(b, 'y') as number);
          if (Math.abs(e.clientX - cx) < r.width / 2 + REACH && Math.abs(e.clientY - cy) < r.height / 2 + REACH) { hit = b; dx = e.clientX - cx; dy = e.clientY - cy; break; }
        }
        if (hit !== near) leave();
        if (!hit) return;
        const p = parts.get(hit)!;
        if (!near) {  // a drop appears where the cursor was
          near = hit;
          root.classList.add('cursor-in-goo');
          const r = hit.getBoundingClientRect();
          gsap.set(p.dot, { x: e.clientX - r.left + PAD, y: e.clientY - r.top + PAD });
          gsap.to(p.dot, { scale: 1, duration: 0.35, ease: 'back.out(2)', overwrite: 'auto' });
        }
        gsap.to(hit, { x: gsap.utils.clamp(-MAX, MAX, dx * LEAN), y: gsap.utils.clamp(-MAX, MAX, dy * LEAN), duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        const r = hit.getBoundingClientRect();  // the drop lives in the button's layer, which moves with it
        p.x(e.clientX - r.left + PAD); p.y(e.clientY - r.top + PAD);
      };
      addEventListener('pointermove', onMove);
      document.addEventListener('pointerleave', leave);
      return () => {
        leave(); removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', leave);
        parts.forEach((_, b) => { b.querySelector('.goo')?.remove(); b.classList.remove('gooey'); });
        defs.remove();
      };
    });
  });
  return null;
}
