'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Dial from './Dial';
import Icon from './Icon';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LAUNCHER = [{ label: 'Volume', icon: 'volume' }, { label: 'Music', icon: 'music' }, { label: 'System', icon: 'laptop' }, { label: 'Display', icon: 'monitor' }, { label: 'Safari', icon: 'compass' }];
const SPAN = 0.75;  // as the app: three quarters of the pad's height is the whole range
type Side = 'volume' | 'brightness';

/** Trackpad edges: a trackpad you can slide on (or arrow-key on) and the dial following the finger, as in the app.
 *  On its own it plays the two slides on a loop, only while on screen, and stops for a while once you take over.
 *  Reduced motion: no loop, the dial sits on Volume; dragging and keys still work. */
export default function EdgeSlide() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP((_, contextSafe) => {
    const q = gsap.utils.selector(root);
    const el = root.current!, pad = q('.pad')[0] as HTMLElement, finger = q('.pad-finger')[0] as HTMLElement;
    const dial = q('.dial')[0], fill = q('.progress')[0], path = q('.progress path')[0];
    const name = q('.hub-name')[0], sub = q('.hub-sub')[0], keycap = q('.edge-key')[0];
    const band = { volume: q('.band.right')[0] as HTMLElement, brightness: q('.band.left')[0] as HTMLElement };
    const level = { volume: 0.64, brightness: 0.5 };

    const show = (side: Side, v: number) => {
      v = level[side] = gsap.utils.clamp(0, 1, v);
      name.textContent = side === 'volume' ? 'Volume' : 'Brightness';
      sub.textContent = `${Math.round(v * 100)}%`;
      path.setAttribute('stroke-dashoffset', String(1 - v));
      fill.setAttribute('opacity', v > 0.003 ? '1' : '0');
      band[side].setAttribute('aria-valuenow', String(Math.round(v * 100)));
      band.volume.classList.toggle('on', side === 'volume');
      band.brightness.classList.toggle('on', side === 'brightness');
      keycap.classList.add('on');
    };
    const place = (x: number, y: number) => gsap.set(finger, { left: `${x * 100}%`, top: `${(1 - y) * 100}%` });
    const open = () => gsap.to(dial, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(1.6)', overwrite: 'auto' });
    const rest = (delay = 0.8) => {  // the app fades the dial 0.8 s after the lift; here it dims instead of vanishing
      gsap.to(finger, { autoAlpha: 0, scale: 1.4, duration: 0.3, overwrite: 'auto' });
      gsap.to(dial, { autoAlpha: 0.3, scale: 0.94, duration: 0.4, delay, overwrite: 'auto' });
      band.volume.classList.remove('on'); band.brightness.classList.remove('on'); keycap.classList.remove('on');
    };

    // the loop: up the right edge (volume), then down the left (brightness); the level moves exactly as the finger does
    let loop: gsap.core.Timeline | null = null, inView = false, idleAt = 0;
    const maybePlay = () => { if (loop) inView && Date.now() >= idleAt ? loop.play() : loop.pause(); };
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      loop = gsap.timeline({ repeat: -1, paused: true });
      const slide = (side: Side, x: number, y0: number, y1: number, v0: number) => {
        const o = { y: y0 };
        loop!.call(() => { show(side, v0); place(x, y0); })
          .fromTo(finger, { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' })
          .to(dial, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(1.6)' }, '<')
          .to(o, { y: y1, duration: 1.5, ease: 'power2.inOut', onUpdate: () => { place(x, o.y); show(side, v0 + (o.y - y0) / SPAN); } }, '+=0.15')
          .to(finger, { autoAlpha: 0, scale: 1.4, duration: 0.3 }, '+=0.2')
          .call(() => { band[side].classList.remove('on'); keycap.classList.remove('on'); })
          .to(dial, { autoAlpha: 0.3, scale: 0.94, duration: 0.4 }, '+=0.5')
          .to({}, { duration: 0.6 });
      };
      slide('volume', 0.91, 0.18, 0.62, 0.3);
      slide('brightness', 0.09, 0.78, 0.42, 0.8);
      gsap.set(dial, { autoAlpha: 0.3, scale: 0.94 });
      ScrollTrigger.create({ trigger: el, start: 'top 85%', end: 'bottom 15%', onToggle: s => { inView = s.isActive; maybePlay(); } });
      return () => { loop?.kill(); loop = null; };
    });
    gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => { show('volume', level.volume); place(0.91, 0.55); gsap.set(finger, { autoAlpha: 1 }); });

    // taking over: drag up/down an edge band, or focus one and use the arrow keys
    const takeOver = () => { idleAt = Date.now() + 4000; loop?.pause(); setTimeout(maybePlay, 4100); };
    let drag: { side: Side; y: number; v: number; id: number } | null = null;
    const down = contextSafe!((e: PointerEvent) => {
      const b = e.currentTarget as HTMLElement, side = b.dataset.side as Side, r = pad.getBoundingClientRect();
      takeOver();
      b.setPointerCapture(e.pointerId);
      drag = { side, y: e.clientY, v: level[side], id: e.pointerId };
      place((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
      gsap.to(finger, { autoAlpha: 1, scale: 1, duration: 0.2, overwrite: 'auto' });
      show(side, drag.v);
      open();
    });
    const move = contextSafe!((e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const r = pad.getBoundingClientRect();
      place(gsap.utils.clamp(0, 1, (e.clientX - r.left) / r.width), gsap.utils.clamp(0, 1, 1 - (e.clientY - r.top) / r.height));
      show(drag.side, drag.v + (drag.y - e.clientY) / (r.height * SPAN));
      takeOver();
    });
    const up = contextSafe!(() => { if (drag) { drag = null; rest(); } });
    const key = contextSafe!((e: KeyboardEvent) => {
      const side = (e.currentTarget as HTMLElement).dataset.side as Side;
      const d = { ArrowUp: 0.05, ArrowRight: 0.05, ArrowDown: -0.05, ArrowLeft: -0.05, PageUp: 0.2, PageDown: -0.2 }[e.key];
      const to = e.key === 'Home' ? 0 : e.key === 'End' ? 1 : d != null ? level[side] + d : null;
      if (to == null) return;
      e.preventDefault();
      takeOver();
      show(side, to);
      open();
    });
    const blur = contextSafe!(() => { if (!drag) rest(0.4); });
    const bands = Object.values(band);
    bands.forEach(b => {
      b.addEventListener('pointerdown', down); b.addEventListener('pointermove', move);
      b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
      b.addEventListener('keydown', key); b.addEventListener('blur', blur);
    });
    return () => bands.forEach(b => {
      b.removeEventListener('pointerdown', down); b.removeEventListener('pointermove', move);
      b.removeEventListener('pointerup', up); b.removeEventListener('pointercancel', up);
      b.removeEventListener('keydown', key); b.removeEventListener('blur', blur);
    });
  }, { scope: root });

  return (
    <article className="product wide edges" ref={root}>
      <div className="product-stage stage-edges">
        <div className="pad-col">
        <div className="pad">
          <div className="band left" data-side="brightness" role="slider" tabIndex={0} aria-label="Brightness, left edge"
            aria-valuemin={0} aria-valuemax={100} aria-valuenow={50}>
            <span className="band-label"><Icon name="sun" size={16} />Brightness</span>
          </div>
          <div className="band right" data-side="volume" role="slider" tabIndex={0} aria-label="Volume, right edge"
            aria-valuemin={0} aria-valuemax={100} aria-valuenow={64}>
            <span className="band-label"><Icon name="volume" size={16} />Volume</span>
          </div>
          <span className="pad-finger" aria-hidden="true" />
        </div>
        <kbd className="edge-key" aria-hidden="true">⌃ control</kbd>
        </div>
        <Dial slots={LAUNCHER} name="Volume" sub="64%" level={0.64} />
      </div>
      <div className="product-meta">
        <div><h3>Trackpad edges</h3><p>Hold Control and slide one finger up the right edge for volume, the left edge for brightness. The dial opens under your pointer and follows your finger; lift it and the dial goes. Control keeps ordinary pointer moves from changing anything; pick another key, or none, in Settings.</p></div>
        <span className="how">Hold <kbd>⌃</kbd> and slide, or drag an edge here</span>
      </div>
    </article>
  );
}
