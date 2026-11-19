'use client';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Logo from './Logo';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINKS: [string, string][] = [['/#ways', 'How it works'], ['/try/', 'Try it'], ['/formats/', 'Formats'], ['/help/', 'Help']];

/** The floating nav. The logo's bright arc turns once round the dial as you scroll the page. */
export default function Nav() {
  const current = usePathname();
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(root.current, { y: -24, autoAlpha: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 });
      gsap.to('.logo-arc', { rotation: 360, svgOrigin: '50 50', ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.4 } });
    });
  }, { scope: root });
  return (
    <header className="nav" ref={root}>
      <a className="brand" href="/" aria-label="Halodial home"><Logo />halodial</a>
      <nav aria-label="Site">
        {LINKS.map(([href, label]) => (
          <a key={href} href={href} aria-current={current !== '/' && href.startsWith(current) ? 'page' : undefined}>{label}</a>
        ))}
      </nav>
      <a className="btn small" href="/#download">Download</a>
    </header>
  );
}
