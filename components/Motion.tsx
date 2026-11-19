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

    // magnetic buttons, for a mouse or trackpad only
    gsap.matchMedia().add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const off: (() => void)[] = [];
      document.querySelectorAll<HTMLElement>('.btn:not(.small)').forEach(b => {
        const move = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4, ease: 'power3.out' });
        };
        const leave = () => gsap.to(b, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, .4)' });
        b.addEventListener('pointermove', move); b.addEventListener('pointerleave', leave);
        off.push(() => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave); });
      });
      return () => off.forEach(f => f());
    });
  });
  return null;
}
