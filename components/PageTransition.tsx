'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Logo from './Logo';

/** Moving between pages: a dark circle grows out from where you clicked, with the mark in the middle; the next page
 *  opens out of it as the circle closes. The incoming cover is set before first paint by ARRIVE_SCRIPT (in <head>),
 *  so nothing flashes. Same-page anchors, new tabs, downloads and other sites are left alone. Off with reduced motion. */
export const ARRIVE_SCRIPT = `try{var t=sessionStorage.getItem('halo-nav');if(t){document.documentElement.classList.add('arriving');document.documentElement.style.setProperty('--veil-at',t)}}catch(e){}`;

export default function PageTransition() {
  const veil = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = veil.current!, root = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const at = getComputedStyle(root).getPropertyValue('--veil-at').trim() || '50% 50%';

    // arriving: open the page out of the circle
    if (root.classList.contains('arriving')) {
      try { sessionStorage.removeItem('halo-nav'); } catch { /* storage blocked */ }
      gsap.fromTo(el, { clipPath: `circle(150% at ${at})` }, {
        clipPath: `circle(0% at ${at})`, duration: reduce ? 0 : 0.7, ease: 'power3.inOut', delay: 0.05,
        onComplete: () => root.classList.remove('arriving'),
      });
    }

    const onClick = (e: MouseEvent) => {
      if (reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest('a');
      if (!a || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || /\.(dmg|sh|png|svg)$/.test(url.pathname)) return;
      e.preventDefault();
      const spot = `${e.clientX}px ${e.clientY}px`;
      try { sessionStorage.setItem('halo-nav', spot); } catch { /* storage blocked: just no arrival sweep */ }
      root.classList.add('leaving');
      gsap.fromTo(el, { clipPath: `circle(0% at ${spot})` }, {
        clipPath: `circle(150% at ${spot})`, duration: 0.55, ease: 'power3.in', onComplete: () => { location.href = url.href; },
      });
    };
    // coming back with the Back button can restore this page from cache mid-sweep: clear it
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) { root.classList.remove('leaving', 'arriving'); gsap.set(el, { clipPath: 'circle(0% at 50% 50%)' }); } };
    document.addEventListener('click', onClick);
    addEventListener('pageshow', onShow);
    return () => { document.removeEventListener('click', onClick); removeEventListener('pageshow', onShow); };
  }, []);

  return <div className="veil" ref={veil} aria-hidden="true"><Logo size={56} /></div>;
}
