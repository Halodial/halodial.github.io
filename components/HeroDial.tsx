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

/** The hero. At rest a halo of light sits where the dial will be; it draws itself on load. Then the real flow
 *  on a loop: a photo is dragged in, ⌘ goes down and the halo becomes the dial (as in the app, no glow round it),
 *  the pointer slides to Convert and holds while the rim fills, the format tabs grow out, the photo drops on WebP,
 *  the rim fills again as it converts, the new file appears, the dial closes back into the halo.
 *  Not interactive (the Try it section is); plays only while on screen; reduced motion shows the dial open. */
export default function HeroDial() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const el = root.current!;
    const name: Element = q('.hub-name')[0], sub: Element = q('.hub-sub')[0];
    const tiles: Element[] = q('.tile'), tabs: Element[] = q('.tab');
    const px = (u: number) => () => (el.offsetWidth / 420) * u;  // dial units (420 across) to stage pixels
    const hub = (n: string, s: string, accent = false) => () => {
      name.textContent = n; sub.textContent = s; sub.classList.toggle('accent', accent);
    };
    const light = (list: Element[], i: number | null) => () => list.forEach((t, j) => t.classList.toggle('on', j === i));

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(q('.file, .result, .halo'), { autoAlpha: 0 });
      gsap.set(q('.marker'), { rotation: 90, svgOrigin: '0 0' });
      light(tiles, 1)();
      hub('Convert', 'Click or hold to open')();
    });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const [cx, cy] = at(102, 90), [wx, wy] = at(178, WEBP);
      const SLOT = 87 / 360;  // the marker's share of the rim (a 90° slot less its gap)

      // the halo loads: it draws itself round once when the page opens
      gsap.fromTo(q('.halo-line'), { attr: { 'stroke-dashoffset': 1 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 2, delay: 0.5, ease: 'power2.inOut' });
      gsap.fromTo(q('.halo-glow'), { opacity: 0 }, { opacity: 1, duration: 1.6, delay: 1.2, ease: 'power1.out' });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2, paused: true, defaults: { ease: 'power3.out' } });
      tl.set(q('.dial-body'), { scale: 0.55, autoAlpha: 0, svgOrigin: '0 0' })
        .set(q('.tile'), { scale: 0.5, autoAlpha: 0, svgOrigin: '0 0' })
        .set(q('.marker'), { rotation: 0, autoAlpha: 0, svgOrigin: '0 0' })
        .set(q('.tab'), { scale: 0.86, autoAlpha: 0, svgOrigin: '0 0' })
        .set(q('.progress'), { autoAlpha: 0, rotation: 45, svgOrigin: '0 0' })  // fills from Convert's start
        .set(q('.progress path'), { attr: { 'stroke-dashoffset': 1 } })
        .set(q('.file'), { x: px(-250), y: px(170), autoAlpha: 0, scale: 1, rotation: -8 })
        .set(q('.key'), { autoAlpha: 0, y: 12, scale: 1 })
        .set(q('.result'), { autoAlpha: 0, y: 14 })
        .call(light(tiles, null)).call(light(tabs, null)).call(hub('photo.heic', 'Hover, then click'))

        // drag the photo in towards the halo
        .to(q('.file'), { autoAlpha: 1, x: px(-14), y: px(-6), rotation: 0, duration: 1.3, ease: 'power2.inOut' }, 0.6)
        .to(q('.key'), { autoAlpha: 1, y: 0, duration: 0.3 }, '-=0.35')
        .to(q('.key'), { scale: 0.92, duration: 0.12, ease: 'power1.in' })

        // ⌘ down: the halo tightens and hands over to the dial, which pops open with its tiles one after another
        .addLabel('open')
        .to(q('.halo'), { scale: 0.94, autoAlpha: 0, duration: 0.35, ease: 'power2.in', svgOrigin: '0 0' }, 'open')
        .to(q('.dial-body'), { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.6)' }, 'open+=0.05')
        .to(q('.tile'), { scale: 1, autoAlpha: 1, duration: 0.24, stagger: 0.035, ease: 'back.out(2.7)' }, 'open+=0.1')
        .to(q('.marker'), { autoAlpha: 1, duration: 0.2 }, 'open+=0.3')
        .call(light(tiles, 0), [], 'open+=0.3')

        // slide to Convert: the rim marker follows the pointer
        .addLabel('convert', '+=0.45')
        .to(q('.file'), { x: px(cx - 10), y: px(cy - 6), duration: 0.6, ease: 'power2.inOut' }, 'convert')
        .to(q('.marker'), { rotation: 90, duration: 0.6, ease: 'power2.inOut' }, 'convert')
        .call(light(tiles, 1), [], 'convert+=0.3')
        .call(hub('Convert', 'Click or hold to open'), [], 'convert+=0.3')

        // hold: the marker grows round the rim as a timer, then the format tabs grow out one after another
        .addLabel('hold', '+=0.3')
        .call(hub('Convert', 'Keep holding'), [], 'hold')
        .set(q('.progress'), { autoAlpha: 1 }, 'hold')
        .fromTo(q('.progress path'), { attr: { 'stroke-dashoffset': 1 - SLOT } }, { attr: { 'stroke-dashoffset': 0 }, duration: 0.6, ease: 'none', immediateRender: false }, 'hold')
        .set(q('.progress'), { autoAlpha: 0 }, 'hold+=0.6')
        .addLabel('tabs', 'hold+=0.6')
        .to(q('.tab'), { scale: 1, autoAlpha: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.8)' }, 'tabs')
        .call(hub('Convert', 'Pick a format'), [], 'tabs')

        // onto WebP: the hub shows the size it will come out at
        .addLabel('webp', '+=0.3')
        .to(q('.file'), { x: px(wx - 8), y: px(wy - 4), duration: 0.55, ease: 'power2.inOut' }, 'webp')
        .call(light(tabs, 0), [], 'webp+=0.3')
        .call(hub('WebP', '≈ 410 KB, from 2.4 MB', true), [], 'webp+=0.3')

        // drop: the photo goes in, the tabs fold away, the rim fills as it converts, a check in the hub
        .addLabel('drop', '+=0.55')
        .to(q('.file'), { scale: 0.2, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, 'drop')
        .to(q('.tab'), { scale: 0.9, autoAlpha: 0, duration: 0.25, stagger: 0.03 }, 'drop+=0.15')
        .call(hub('WebP', 'Working…'), [], 'drop+=0.2')
        .set(q('.progress path'), { attr: { 'stroke-dashoffset': 1 } }, 'drop+=0.24')
        .set(q('.progress'), { autoAlpha: 1 }, 'drop+=0.25')
        .to(q('.progress path'), { attr: { 'stroke-dashoffset': 0 }, duration: 1, ease: 'power1.inOut' }, 'drop+=0.25')
        .call(hub('WebP', '✓ Done', true), [], '>')
        .to(q('.result'), { autoAlpha: 1, y: 0, duration: 0.45 }, '<')

        // let go: ⌘ comes up, the dial closes, and the halo draws itself back round
        .addLabel('close', '+=0.9')
        .to(q('.key'), { scale: 1, autoAlpha: 0, y: 8, duration: 0.3 }, 'close')
        .to(q('.dial-body'), { scale: 0.9, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 'close')
        .set(q('.halo'), { scale: 1, autoAlpha: 1 }, 'close+=0.3')
        .fromTo(q('.halo-line'), { attr: { 'stroke-dashoffset': 1 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 0.9, ease: 'power2.inOut', immediateRender: false }, 'close+=0.3')
        .to(q('.result'), { autoAlpha: 0, y: -8, duration: 0.4, ease: 'power2.in' }, 'close+=1.1');

      tl.progress(0.0001).pause();  // apply the starting state now, before the hero scrolls into view
      ScrollTrigger.create({ trigger: el, start: 'top 85%', end: 'bottom 10%', onToggle: s => (s.isActive ? tl.play() : tl.pause()) });
    });
  }, { scope: root });

  return (
    <div className="stage" ref={root}>
      <svg className="orbits" viewBox="-630 -630 1260 1260" aria-hidden="true">
        {[190, 240, 300, 370, 450, 540].map(r => <circle key={r} r={r} />)}
      </svg>
      <svg className="halo" viewBox="-210 -210 420 420" aria-hidden="true">
        <defs>
          <linearGradient id="halo-iris" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#C9B6FF" /><stop offset=".45" stopColor="#7FC8FF" />
            <stop offset=".8" stopColor="#8FE3A2" /><stop offset="1" stopColor="#F6F3EE" />
          </linearGradient>
          <filter id="halo-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
        </defs>
        <circle className="halo-glow" r="150" fill="none" stroke="url(#halo-iris)" strokeWidth="14" filter="url(#halo-blur)" />
        <circle className="halo-line" r="150" fill="none" stroke="url(#halo-iris)" strokeWidth="2.2" strokeLinecap="round"
          pathLength={1} strokeDasharray="1 1" transform="rotate(-90)" />
      </svg>
      <Dial slots={SLOTS} lit={0} name="photo.heic" sub="Hover, then click" tabs={TABS} tabsAt={TABS_AT} />

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
      <p className="sr">Animation: a photo is dragged in, holding Command opens the Halodial dial under it, the pointer moves to Convert and holds, format tabs grow out, and the photo is dropped on WebP. A new photo.webp appears next to the original.</p>
    </div>
  );
}
