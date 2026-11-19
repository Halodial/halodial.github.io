'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** A halo that grows round the privacy line when it comes into view: a bright head travels round and the ring
 *  closes behind it, the glow swells, then the words inside settle in. The file stays inside the circle. */
export default function PrivateRing({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const q = gsap.utils.selector(root);
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(q('.ring-arc, .ring-glow'), { attr: { 'stroke-dashoffset': 1 } });
      gsap.set(q('.ring-head'), { rotation: 0, svgOrigin: '0 0', autoAlpha: 0 });
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } })
        .from(q('.ring-svg'), { scale: 0.86, duration: 2.6, ease: 'expo.out', svgOrigin: '0 0' }, 0)
        .to(q('.ring-head'), { autoAlpha: 1, duration: 0.2 }, 0)
        .to(q('.ring-arc, .ring-glow'), { attr: { 'stroke-dashoffset': 0 }, duration: 2.2, ease: 'power2.inOut' }, 0)
        .to(q('.ring-head'), { rotation: 360, duration: 2.2, ease: 'power2.inOut' }, 0)
        .to(q('.ring-head'), { autoAlpha: 0, duration: 0.4 }, 2)
        .fromTo(q('.ring-glow'), { opacity: 0.2 }, { opacity: 1, duration: 1.2, ease: 'power1.out' }, 1.4)
        .from(q('.ring-copy > *'), { y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, 0.5);
    });
  }, { scope: root });
  return (
    <div className="ring" ref={root}>
      <svg className="ring-svg" viewBox="-100 -100 200 200" aria-hidden="true">
        <defs>
          <linearGradient id="ring-iris" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#C9B6FF" /><stop offset=".5" stopColor="#7FC8FF" /><stop offset="1" stopColor="#8FE3A2" />
          </linearGradient>
          <filter id="ring-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
        <circle r="96" fill="none" stroke="rgba(246,243,238,.07)" strokeWidth=".6" />
        <circle className="ring-glow" r="96" fill="none" stroke="url(#ring-iris)" strokeWidth="4" filter="url(#ring-blur)"
          pathLength={1} strokeDasharray="1 1" transform="rotate(-90)" />
        <circle className="ring-arc" r="96" fill="none" stroke="url(#ring-iris)" strokeWidth="1.2" strokeLinecap="round"
          pathLength={1} strokeDasharray="1 1" transform="rotate(-90)" />
        <g className="ring-head"><circle cy="-96" r="2.6" fill="#fff" /><circle cy="-96" r="7" fill="#7FC8FF" opacity=".35" filter="url(#ring-blur)" /></g>
      </svg>
      <div className="ring-copy">{children}</div>
    </div>
  );
}
