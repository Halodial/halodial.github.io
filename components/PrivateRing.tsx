'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** A halo that closes round the privacy line as you scroll to it: the file stays inside the circle. */
export default function PrivateRing({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.ring-arc', { strokeDashoffset: 0.82 }, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'center 50%', scrub: 0.6 },
      });
    });
  }, { scope: root });
  return (
    <div className="ring" ref={root}>
      <svg viewBox="-100 -100 200 200" aria-hidden="true">
        <defs>
          <linearGradient id="ring-iris" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#C9B6FF" /><stop offset=".5" stopColor="#7FC8FF" /><stop offset="1" stopColor="#8FE3A2" />
          </linearGradient>
        </defs>
        <circle r="96" fill="none" stroke="rgba(246,243,238,.07)" strokeWidth=".6" />
        <circle className="ring-arc" r="96" fill="none" stroke="url(#ring-iris)" strokeWidth="1.2" strokeLinecap="round"
          pathLength={1} strokeDasharray="1 1" transform="rotate(-90)" />
      </svg>
      <div className="ring-copy">{children}</div>
    </div>
  );
}
