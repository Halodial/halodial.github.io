'use client';
import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Dial from './Dial';
import Shelf from './Shelf';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WAYS = [
  {
    title: <>Hold <kbd>⌘</kbd> while dragging a file</>,
    text: 'The dial opens under the file with File, Convert, Edit and Share. Press the key before or after you start dragging. You can record any keys you like.',
  },
  {
    title: <>Shake a file to park it</>,
    text: 'A shelf opens beside it. Collect files from different places, then drag them all out together, or act on the whole stack at once.',
  },
  {
    title: <>Tap with four fingers</>,
    text: <>The launcher: volume, music, display and system controls, your apps and folders. Three fingers if you prefer, or <kbd>⌥⌘Space</kbd>.</>,
  },
];

/** Three ways in: the copy scrolls, the picture beside it stays put and changes scene with the step in view. */
export default function WaysIn() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>('.way', root.current).forEach((el, i) =>
      ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: s => s.isActive && setActive(i) }));
  }, { scope: root });

  return (
    <div className="ways" ref={root}>
      <div className="ways-stage" aria-hidden="true">
        <div className="ways-frame">
          <div className={`scene scene-drag${active === 0 ? ' on' : ''}`}>
            <Dial slots={[{ label: 'File', icon: 'folder' }, { label: 'Convert', icon: 'repeat' }, { label: 'Edit', icon: 'sliders' }, { label: 'Share', icon: 'share' }]}
              lit={3} name="Share" sub="Hold to open" />
            <span className="scene-file"><span className="file-thumb doc" /></span>
            <kbd className="scene-key">⌘</kbd>
          </div>
          <div className={`scene scene-shake${active === 1 ? ' on' : ''}`}>
            <span className="scene-file shaking"><span className="file-thumb"><span className="sun" /><span className="hill" /></span></span>
            <Shelf title="Trip photos" />
          </div>
          <div className={`scene scene-tap${active === 2 ? ' on' : ''}`}>
            <Dial slots={[{ label: 'Volume', icon: 'volume' }, { label: 'Music', icon: 'music' }, { label: 'System', icon: 'laptop' }, { label: 'Display', icon: 'sun' }, { label: 'Safari', icon: 'compass' }]}
              lit={0} name="Volume" sub="64%" level={0.64} />
            <span className="fingers"><i /><i /><i /><i /></span>
          </div>
        </div>
        <div className="ways-dots">{WAYS.map((_, i) => <span key={i} className={i === active ? 'on' : ''} />)}</div>
      </div>

      <ol className="ways-steps">
        {WAYS.map((w, i) => (
          <li key={i} className={`way${i === active ? ' on' : ''}`}>
            <h3>{w.title}</h3>
            <p>{w.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
