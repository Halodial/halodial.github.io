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
 *  Everything plays once; with reduced motion nothing moves and everything is simply there. */
export default function Motion() {
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      document.querySelectorAll<HTMLElement>('[data-split]').forEach(el => {
        SplitText.create(el, {
          type: 'lines', mask: 'lines', autoSplit: true,
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
    });
  });
  return null;
}
