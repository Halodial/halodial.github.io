'use client';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Logo from './Logo';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINKS: [string, string][] = [['/try/', 'Try it'], ['/formats/', 'Formats'], ['/recipes/', 'Recipes'], ['/help/', 'Help']];

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
      <button type="button" className="nav-search" onClick={() => dispatchEvent(new Event('open-search'))} aria-label="Search (⌘K)">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg><kbd>⌘K</kbd>
      </button>
      <a className="btn small" href="/#download">Download</a>
    </header>
  );
}
