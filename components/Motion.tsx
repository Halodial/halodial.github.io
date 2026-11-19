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

    // big buttons and a blob cursor, for a mouse or trackpad only. Near a big button the cursor turns into a blob
    // that follows the pointer (stretching as it moves) and the button leans a few pixels towards it. Over the button
    // the blob swells into the button's shape and melts onto it; leaving, it pulls back into a dot and shrinks away,
    // and the normal cursor returns.
    gsap.matchMedia().add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const REACH = 70, LEAN = 0.12, MAX = 8, DOT = 18;  // zone round a button (px), how far it leans, at most (px), blob size
      const root = document.documentElement;
      const blob = document.createElement('div');
      blob.className = 'blob';
      document.body.appendChild(blob);
      gsap.set(blob, { xPercent: -50, yPercent: -50, width: DOT, height: DOT, scale: 0, opacity: 0 });
      const toX = gsap.quickTo(blob, 'x', { duration: 0.28, ease: 'power3.out' });
      const toY = gsap.quickTo(blob, 'y', { duration: 0.28, ease: 'power3.out' });
      let near: HTMLElement | null = null, inside = false, last = { x: 0, y: 0, t: 0 };

      const leave = () => {
        if (near) gsap.to(near, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, .4)', overwrite: 'auto' });
        near = null; inside = false;
        root.classList.remove('cursor-is-blob');
        gsap.to(blob, { scale: 0, opacity: 0, width: DOT, height: DOT, borderRadius: DOT, duration: 0.35, ease: 'power3.in', overwrite: 'auto' });
      };
      const onMove = (e: PointerEvent) => {
        let hit: HTMLElement | null = null, rest = { x: 0, y: 0, w: 0, h: 0 };
        for (const b of document.querySelectorAll<HTMLElement>('.btn:not(.small)')) {
          const r = b.getBoundingClientRect(), bx = gsap.getProperty(b, 'x') as number, by = gsap.getProperty(b, 'y') as number;
          const cx = r.left + r.width / 2 - bx, cy = r.top + r.height / 2 - by;
          if (Math.abs(e.clientX - cx) < r.width / 2 + REACH && Math.abs(e.clientY - cy) < r.height / 2 + REACH) { hit = b; rest = { x: cx, y: cy, w: r.width, h: r.height }; break; }
        }
        if (!hit) { if (near) leave(); return; }
        if (near && near !== hit) leave();
        if (!near) { near = hit; root.classList.add('cursor-is-blob'); gsap.set(blob, { x: e.clientX, y: e.clientY }); }

        // the button leans a little towards the pointer
        const dx = e.clientX - rest.x, dy = e.clientY - rest.y;
        gsap.to(hit, { x: gsap.utils.clamp(-MAX, MAX, dx * LEAN), y: gsap.utils.clamp(-MAX, MAX, dy * LEAN), duration: 0.5, ease: 'power3.out', overwrite: 'auto' });

        const over = Math.abs(dx) < rest.w / 2 && Math.abs(dy) < rest.h / 2;
        if (over) {  // swell into the button and settle on it
          const r = hit.getBoundingClientRect();
          inside = true;
          toX(r.left + r.width / 2); toY(r.top + r.height / 2);
          gsap.to(blob, { width: r.width + 10, height: r.height + 10, borderRadius: r.height, scale: 1, opacity: 1, rotation: 0, scaleX: 1, scaleY: 1, duration: 0.45, ease: 'elastic.out(1, .6)', overwrite: 'auto' });
          return;
        }
        // outside it: a dot that follows the pointer, stretched along its movement
        const t = performance.now(), vx = e.clientX - last.x, vy = e.clientY - last.y, dt = Math.max(16, t - last.t);
        last = { x: e.clientX, y: e.clientY, t };
        const speed = Math.min(1, Math.hypot(vx, vy) / dt / 2.5);
        toX(e.clientX); toY(e.clientY);
        gsap.to(blob, {
          width: DOT, height: DOT, borderRadius: DOT, scale: 1, opacity: 1, rotation: Math.atan2(vy, vx) * 180 / Math.PI,
          scaleX: 1 + speed * 0.6, scaleY: 1 - speed * 0.3, duration: inside ? 0.4 : 0.25, ease: 'power3.out', overwrite: 'auto',
        });
        inside = false;
      };
      addEventListener('pointermove', onMove);
      document.addEventListener('pointerleave', leave);
      return () => { leave(); blob.remove(); removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', leave); };
    });
  });
  return null;
}
