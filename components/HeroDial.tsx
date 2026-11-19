'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Dial from './Dial';
import Icon from './Icon';
import { at } from '@/lib/dial';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SLOTS = [
  { label: 'File', icon: 'folder' },
  { label: 'Convert', icon: 'repeat' },
  { label: 'Edit', icon: 'sliders' },
  { label: 'Share', icon: 'share' },
];
const TABS = ['WebP', 'PNG', 'JPEG', 'HEIC', 'AVIF'];
const TABS_AT = 90;        // Convert's slot, to the right
const WEBP = TABS_AT - 46; // the first tab's angle

/** The hero: the real flow on a loop. A photo is dragged in, ⌘ opens the dial under it, the pointer slides to
 *  Convert, the format tabs grow out, the photo drops on WebP, the rim fills, and the new file appears.
 *  Not interactive; plays only while on screen; reduced motion shows the dial open on Convert. */
export default function HeroDial() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const el = root.current!;
    const name: Element = q('.hub-name')[0], sub: Element = q('.hub-sub')[0];
    const tiles: Element[] = q('.tile'), tabs: Element[] = q('.tab');
    // dial units (420 across) to stage pixels
    const px = (u: number) => () => (el.offsetWidth / 420) * u;
    const hub = (n: string, s: string, accent = false) => () => {
      name.textContent = n; sub.textContent = s; sub.classList.toggle('accent', accent);
    };
    const light = (list: Element[], i: number | null) => () => list.forEach((t, j) => t.classList.toggle('on', j === i));

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(q('.file, .result'), { autoAlpha: 0 });
      gsap.set(q('.marker'), { rotation: 90, svgOrigin: '0 0' });
      light(tiles, 1)();
      hub('Convert', 'Hold to open')();
    });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const [cx, cy] = at(102, 90), [wx, wy] = at(178, WEBP);
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true, defaults: { ease: 'power3.out' } });

      tl.set(q('.dial-body'), { scale: 0.55, autoAlpha: 0, svgOrigin: '0 0' })
        .set(q('.tile'), { scale: 0.7, autoAlpha: 0, svgOrigin: '0 0' })
        .set(q('.marker'), { rotation: 0, autoAlpha: 0, svgOrigin: '0 0' })
        .set(q('.tab'), { scale: 0.86, autoAlpha: 0, svgOrigin: '0 0' })
        .set(q('.progress'), { autoAlpha: 0, rotation: 45, svgOrigin: '0 0' })  // fills from Convert's start
        .set(q('.progress path'), { strokeDashoffset: 1 })
        .set(q('.file'), { x: px(-250), y: px(170), autoAlpha: 0, scale: 1, rotation: -8 })
        .set(q('.key'), { autoAlpha: 0, y: 12 })
        .set(q('.result'), { autoAlpha: 0, y: 14 })
        .call(light(tiles, null)).call(light(tabs, null)).call(hub('photo.heic', 'Pick an option'))

        // drag the photo in
        .to(q('.file'), { autoAlpha: 1, x: px(-14), y: px(-6), rotation: 0, duration: 1.3, ease: 'power2.inOut' })
        // hold ⌘: the key goes down, the dial opens under the pointer
        .to(q('.key'), { autoAlpha: 1, y: 0, duration: 0.3 }, '-=0.35')
        .to(q('.key'), { scale: 0.92, duration: 0.12, ease: 'power1.in' })
        .addLabel('open')
        .to(q('.corona-glow'), { opacity: 1, scale: 1.04, duration: 0.6 }, 'open')
        .to(q('.dial-body'), { scale: 1, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.5)' }, 'open')
        .to(q('.tile'), { scale: 1, autoAlpha: 1, duration: 0.45, stagger: 0.05, ease: 'back.out(2)' }, 'open+=0.08')
        .to(q('.marker'), { autoAlpha: 1, duration: 0.2 }, 'open+=0.3')
        .call(light(tiles, 0), [], 'open+=0.3')

        // slide to Convert: the rim marker follows the pointer
        .addLabel('convert', '+=0.45')
        .to(q('.file'), { x: px(cx - 10), y: px(cy - 6), duration: 0.6, ease: 'power2.inOut' }, 'convert')
        .to(q('.marker'), { rotation: 90, duration: 0.6, ease: 'power2.inOut' }, 'convert')
        .call(light(tiles, 1), [], 'convert+=0.3')
        .call(hub('Convert', 'Hold to open'), [], 'convert+=0.3')

        // the format tabs grow out past the rim, one after another
        .addLabel('tabs', '+=0.25')
        .to(q('.tab'), { scale: 1, autoAlpha: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.8)' }, 'tabs')
        .call(hub('Convert', 'Pick a format'), [], 'tabs')

        // onto WebP: the hub shows the estimate
        .addLabel('webp', '+=0.3')
        .to(q('.file'), { x: px(wx - 8), y: px(wy - 4), duration: 0.55, ease: 'power2.inOut' }, 'webp')
        .call(light(tabs, 0), [], 'webp+=0.3')
        .call(hub('WebP', '≈ 410 KB, from 2.4 MB', true), [], 'webp+=0.3')

        // drop: the photo goes in, the tabs fold away, the rim fills as it converts
        .addLabel('drop', '+=0.55')
        .to(q('.file'), { scale: 0.2, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, 'drop')
        .to(q('.tab'), { scale: 0.9, autoAlpha: 0, duration: 0.25, stagger: 0.03 }, 'drop+=0.15')
        .call(hub('WebP', 'Working…'), [], 'drop+=0.2')
        .set(q('.progress'), { autoAlpha: 1 }, 'drop+=0.25')
        .to(q('.progress path'), { strokeDashoffset: 0, duration: 1, ease: 'power1.inOut' }, 'drop+=0.25')
        .call(hub('WebP', '✓ Done', true), [], '>')
        .to(q('.result'), { autoAlpha: 1, y: 0, duration: 0.45 }, '<')

        // let go: ⌘ comes up, the dial closes, the result lingers
        .addLabel('close', '+=0.9')
        .to(q('.key'), { scale: 1, autoAlpha: 0, y: 8, duration: 0.3 }, 'close')
        .to(q('.dial-body'), { scale: 0.86, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 'close')
        .to(q('.corona-glow'), { opacity: 0.55, scale: 1, duration: 0.6 }, 'close')
        .to(q('.result'), { autoAlpha: 0, y: -8, duration: 0.4, ease: 'power2.in' }, 'close+=1.1');

      tl.progress(0.0001).pause();  // apply the starting state now, before the hero scrolls into view
      ScrollTrigger.create({ trigger: el, start: 'top 85%', end: 'bottom 10%', onToggle: s => (s.isActive ? tl.play() : tl.pause()) });
    });
  }, { scope: root });

  return (
    <div className="stage" ref={root}>
      <div className="corona" aria-hidden="true"><div className="corona-glow" /><div className="corona-line" /></div>
      <Dial slots={SLOTS} lit={0} name="photo.heic" sub="Pick an option" tabs={TABS} tabsAt={TABS_AT} />

      <div className="file" aria-hidden="true">
        <div className="file-thumb"><span className="sun" /><span className="hill" /></div>
        <span className="file-name">photo.heic</span>
        <svg className="cursor" viewBox="0 0 24 24"><path d="M5 3l14 8.5-6.2 1.4L10 19z" /></svg>
      </div>
      <kbd className="key" aria-hidden="true">⌘</kbd>
      <div className="result" aria-hidden="true">
        <span className="result-icon"><Icon name="image" size={18} /></span>
        <span><b>photo.webp</b> 410 KB, next to the original</span>
        <span className="undo">Undo</span>
      </div>
      <p className="sr">Animation: a photo is dragged in, holding Command opens the Halodial dial under it, the pointer moves to Convert, format tabs grow out, and the photo is dropped on WebP. A new photo.webp appears next to the original.</p>
    </div>
  );
}
