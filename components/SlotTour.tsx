'use client';
import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Dial from './Dial';
import Icon from './Icon';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// the file dial's four slots and what each holds (the app's defaults)
const SLOTS = [
  { label: 'File', icon: 'folder', sub: 'Put it somewhere', text: 'Park it on a shelf, copy it, move it, copy its path, open Terminal in its folder, or zip it.', items: ['Shelf', 'Copy', 'Move', 'Path', 'Terminal', 'ZIP'] },
  { label: 'Convert', icon: 'repeat', sub: 'Make it something else', text: 'The formats that make sense for this file, the ones you use most first, and your recipes.', items: ['WebP', 'PNG', 'HEIC', 'AVIF', 'PDF', 'Recipes'] },
  { label: 'Edit', icon: 'sliders', sub: 'Change it a little', text: 'Crop, compress, resize, rotate, clean the metadata, or open the editor. Video and audio get the trimmer.', items: ['Crop', 'Compress', 'Resize', 'Rotate', 'No metadata', 'Editor'] },
  { label: 'Share', icon: 'share', sub: 'Send it on', text: 'AirDrop, Mail, Messages and Notes, with the file already attached.', items: ['AirDrop', 'Mail', 'Messages', 'Notes'] },
];

/** One dial, four slots: on wide screens the section holds still while scrolling turns the dial slot by slot,
 *  and the slot's options come up beside it. On narrow screens or with reduced motion, it's a plain list. */
export default function SlotTour() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    gsap.matchMedia().add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.set(q('.marker'), { rotation: 0, svgOrigin: '0 0' });
      ScrollTrigger.create({
        trigger: root.current, start: 'center center', end: '+=2200', pin: true, scrub: 0.5,
        snap: { snapTo: 1 / 3, duration: 0.4, ease: 'power2.inOut' },
        onUpdate: self => {
          gsap.set(q('.marker'), { rotation: self.progress * 270 });
          setActive(Math.round(self.progress * 3));
        },
      });
    });
  }, { scope: root });

  const s = SLOTS[active];
  return (
    <div className="tour" ref={root}>
      <div className="tour-dial" aria-hidden="true">
        <Dial slots={SLOTS} lit={active} name={s.label} sub={s.sub} />
      </div>
      <ol className="tour-list">
        {SLOTS.map((x, i) => (
          <li key={x.label} className={i === active ? 'on' : ''}>
            <h3><span className="tour-n"><Icon name={x.icon} size={18} /></span>{x.label}</h3>
            <p>{x.text}</p>
            <div className="tour-chips">{x.items.map(t => <span key={t}>{t}</span>)}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
