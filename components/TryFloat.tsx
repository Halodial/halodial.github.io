'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

/** "Try it" pill, bottom left, that rises in once the hero has scrolled away and goes to the playground.
 *  Not on the Try page itself. Hidden from keyboard and screen readers while it's out of sight. */
export default function TryFloat() {
  const path = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const check = () => setShown(window.scrollY > window.innerHeight * 0.7);
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  if (path?.startsWith('/try')) return null;
  return (
    <a href="/try/" className={`try-float${shown ? ' on' : ''}`} aria-hidden={!shown} tabIndex={shown ? 0 : -1}>
      <span className="try-float-ring" aria-hidden="true" />
      <span className="try-float-play"><Icon name="play" size={12} stroke={2.2} /></span>
      <span className="try-float-text"><b>Try it</b><small>in your browser</small></span>
    </a>
  );
}
