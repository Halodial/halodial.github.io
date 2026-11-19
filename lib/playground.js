// The Halodial dial, on the web: the same geometry, rim, hold-to-open, Back tile, sliders and sounds as the Mac app.
// Every option is the app's default for that kind of file. Nothing here touches real files.
// Ported from the old site's dial.js: an ES module now, with destroy() for React and the page's own font.
import { ICONS } from './icons';



// ---------- what each wheel holds (the app's defaults) ----------
const job = (label, icon, out) => ({ label, icon, run: 'job', out });
const toast = (label, icon, text, extra = {}) => ({ label, icon, run: 'toast', text, ...extra });
const group = (label, icon, children) => ({ label, icon, children });
const kb = n => n >= 1000 ? `${(n / 1000).toFixed(1)} MB` : `${n} KB`;

const fileRing = (name, convert, edit) => {
  const base = name.replace(/\.[^.]+$/, ''), ext = name.split('.').pop();
  const ring = [
    group('File', 'folder', [
      toast('Shelf', 'inbox', `Added ${name} to a shelf`),
      toast('Copy', 'copy', `Copied ${name}`),
      { label: 'Move', icon: 'folder-open', run: 'job', out: `Desktop/${name}`, verb: 'Moved', quick: true },
      toast('Path', 'link', 'Copied the path'),
      toast('Terminal', 'terminal', 'Terminal opens in this folder'),
      job('ZIP', 'archive', `${base}.zip`),
    ]),
    group('Convert', 'repeat', convert.map(c => typeof c === 'string'
      ? { label: c, run: 'job', out: `${base}.${c.toLowerCase().replace('jpeg', 'jpg').replace('.', '')}` } : c)),
  ];
  if (edit) ring.push(group('Edit', 'sliders', edit(base, ext)));
  ring.push(group('Share', 'share', [
    toast('AirDrop', 'wifi', 'AirDrop opens with nearby devices'),
    toast('Messages', 'chat', 'A new message opens with the file'),
    toast('Mail', 'mail', 'A new email opens with the file attached'),
  ]));
  return ring;
};
const sizes = (base, ext, label, icon, list) => group(label, icon, list.map(s => job(s, icon, `${base} (${s.toLowerCase()}).${ext}`)));

const imageEst = { PNG: 4800, HEIC: 620, TIFF: 11600, AVIF: 410, GIF: 2100, BMP: 11500, PDF: 1900 };
const KINDS = {
  image: { chip: 'Image', file: 'photo.jpg', ring: () => fileRing('photo.jpg',
    ['PNG', 'HEIC', 'TIFF', 'AVIF', 'GIF', 'BMP', 'PDF'].map(f => ({ label: f, run: 'job', out: `photo.${f.toLowerCase()}`, estimate: `≈ ${kb(imageEst[f])}` })),
    (b, e) => [
      toast('Edit…', 'sliders', 'The editor opens: crop, adjust, markup, rotate, size, background'),
      sizes(b, e, 'Crop', 'crop', ['Square', '4:5', '16:9', '9:16']),
      sizes(b, e, 'Compress', 'minimize', ['200 KB', '500 KB', '1 MB', '2 MB']),
      group('Rotate', 'rotate-ccw', [job('Left', 'rotate-ccw', `${b} (rotated).${e}`), job('Right', 'redo', `${b} (rotated).${e}`)]),
      sizes(b, e, 'Resize', 'maximize', ['640px', '1080px', '1920px', '3840px']),
      job('No metadata', 'tag', `${b} (no metadata).${e}`),
      job('Make PDF', 'file-text', `${b}.pdf`),
    ]) },
  video: { chip: 'Video', file: 'clip.mp4', ring: () => fileRing('clip.mp4', ['MOV', 'GIF', 'MP3', 'WAV'], (b, e) => [
    toast('Trim…', 'film', 'The trimmer opens: drag the handles, Space plays the cut'),
    job('Compress', 'minimize', `${b} (compressed).mp4`), job('Audio only', 'music', `${b}.mp3`), job('Mute', 'volume-off', `${b} (muted).mp4`),
  ]) },
  audio: { chip: 'Audio', file: 'song.mp3', ring: () => fileRing('song.mp3', ['M4A', 'CAF', 'ALAC', 'FLAC', 'AIFF'], (b, e) => [
    toast('Trim…', 'film', 'The trimmer opens: drag the handles, Space plays the cut'),
    job('Compress', 'minimize', `${b} (compressed).mp3`), job('Mono', 'speaker', `${b} (mono).mp3`),
  ]) },
  pdf: { chip: 'PDF', file: 'report.pdf', ring: () => fileRing('report.pdf', ['DOCX', 'PNG', 'JPEG', 'TXT', 'MD', 'HTML'], (b, e) => [
    toast('Edit…', 'sliders', 'Opens in Preview for pages, markup and signing'),
    job('Split', 'scissors', `${b} split`), job('Compress', 'minimize', `${b} (compressed).pdf`),
    job('No metadata', 'tag', `${b} (no metadata).pdf`),
    group('Rotate', 'rotate-ccw', [job('Left', 'rotate-ccw', `${b} (rotated).pdf`), job('Right', 'redo', `${b} (rotated).pdf`)]),
  ]) },
  document: { chip: 'Document', file: 'essay.docx', ring: () => fileRing('essay.docx',
    ['PDF', 'RTF', 'TXT', 'MD', 'HTML', group('More', 'more-horizontal', [job('ODT', null, 'essay.odt'), job('DOC', null, 'essay.doc')])]) },
  sheet: { chip: 'Spreadsheet', file: 'budget.xlsx', ring: () => fileRing('budget.xlsx', ['CSV', 'TSV', 'JSON', 'PDF']) },
  slides: { chip: 'Slides', file: 'deck.pptx', ring: () => fileRing('deck.pptx', ['PDF', 'ODP', 'PNG', 'JPEG']) },
  archive: { chip: 'Archive', file: 'photos.zip', ring: () => fileRing('photos.zip', ['TAR', 'TAR.GZ'], b => [
    { label: 'Extract', icon: 'folder-open', run: 'job', out: `${b}`, verb: 'Extracted' },
  ]) },
  launcher: { chip: 'Launcher', file: 'Halodial', launcher: true, ring: () => {
    const toggle = (label, icon, on) => ({ label, icon, run: 'toggle', on });
    return [
      { label: 'Volume', icon: 'volume', slider: { title: 'Volume', value: 0.45 } },
      { label: 'Music', icon: 'music', info: ['Midnight City', 'M83'], children: [
        { label: 'Previous', icon: 'skip-back', run: 'media' }, { label: 'Play', icon: 'play', run: 'media' },
        { label: 'Pause', icon: 'pause', run: 'media' }, { label: 'Next', icon: 'skip-forward', run: 'media' }] },
      group('System', 'laptop', [
        toast('Mission Control', 'app-window', 'Mission Control opens'), toast('Desktop', 'layout', 'Windows slide away to show the desktop'),
        toast('Screenshot', 'camera', 'The Screenshot toolbar opens'), toast('Display Off', 'monitor', 'The display sleeps'),
        toast('Lock', 'lock', 'The Mac locks'), toast('Spotlight', 'search', 'Spotlight opens'),
        group('Sound Output', 'speaker', [
          { label: 'MacBook Speakers', icon: 'laptop', run: 'output', on: true },
          { label: 'AirPods Pro', icon: 'headphones', run: 'output', on: false }]),
      ]),
      group('Display', 'monitor', [
        { label: 'Brightness', icon: 'sun', slider: { title: 'Brightness', value: 0.7 } }, toggle('Night Shift', 'sunset', false),
        { label: 'Keyboard', icon: 'keyboard', slider: { title: 'Keyboard', value: 0.3 } }, toggle('Dark Mode', 'moon', true)]),
      toast('Safari', 'compass', 'Safari opens'),
    ];
  } },
};

// ---------- sound: the app's click and detent, synthesized the same way ----------
const Sound = {
  on: true, ctx: null, bufs: {},
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    const synth = (secs, f) => {
      const b = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * secs), this.ctx.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = f(i / this.ctx.sampleRate);
      return b;
    };
    const rnd = () => Math.random() * 2 - 1;
    this.bufs.click = synth(0.04, t => (rnd() * Math.exp(-t * 900) * 0.5 + Math.sin(2 * Math.PI * 1900 * t) * Math.exp(-t * 320) * 0.25
      + Math.sin(2 * Math.PI * 170 * t) * Math.exp(-t * 110) * 0.35) * 0.6);
    this.bufs.detent = synth(0.012, t => (Math.sin(2 * Math.PI * 3600 * t) * 0.5 + rnd() * 0.2) * Math.exp(-t * 1400) * 0.45);
    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0.35;
    this.gain.connect(this.ctx.destination);
  },
  play(name) {
    if (!this.on || !this.ctx || !this.bufs[name]) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const s = this.ctx.createBufferSource();
    s.buffer = this.bufs[name];
    s.connect(this.gain);
    s.start();
  },
};

// ---------- icons as images, tinted ----------
const iconCache = {};
function iconImg(name, color) {
  const key = name + color;
  if (iconCache[key]) return iconCache[key];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
  const img = new Image();
  img.onload = () => dials.forEach(d => d.dirty = true);
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  return (iconCache[key] = img);
}

const dials = [];
const rad = d => d * Math.PI / 180;
const easeOutBack = x => x >= 1 ? 1 : 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);

// ---------- the dial ----------
class Dial {
  constructor(canvas, opts) {
    this.cv = canvas;
    FONT = getComputedStyle(canvas).fontFamily || FONT;
    this.alive = true;
    this.ctx = canvas.getContext('2d');
    this.opts = opts;
    this.style = 'solid';
    this.accent = '#FFFFFF';
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.spin = 0; this.spinTarget = 0;
    this.setKind('image');
    this.revealAt = -1e9;  // the first ring is drawn complete: the page reads right before anything animates
    this.bind();
    dials.push(this);
    this.frame();
    this.ro = new ResizeObserver(() => { this.dirty = true; this.frame(); });
    this.ro.observe(canvas);
    const loop = () => { if (!this.alive) return; this.frame(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  destroy() { this.alive = false; this.ro.disconnect(); dials.splice(dials.indexOf(this), 1); }

  // geometry in dial units (the app's points); scaled to the canvas
  get k() { return this.size / 380; }
  get c() { return this.size / 2; }

  setKind(key) {
    const kd = KINDS[key];
    this.kind = key;
    this.title = kd.launcher ? 'Halodial' : kd.file;
    this.hint = kd.launcher ? 'Click to open' : 'Hover, then click';
    this.slots = kd.ring();
    this.path = []; this.backs = [];
    this.slider = null; this.job = null; this.selected = null;
    this.ringChanged();
    this.opts.onKind?.(key);
  }

  get level() { return this.path.reduce((l, i) => l[i].children, this.slots); }
  get parent() { return this.path.length ? this.path.slice(0, -1).reduce((l, i) => l[i].children, this.slots)[this.path[this.path.length - 1]] : null; }
  get ring() {
    const items = this.level.slice();
    if (this.backs.length) {
      const up = this.path.length > 1 ? this.path.slice(0, -2).reduce((l, i) => l[i].children, this.slots)[this.path[this.path.length - 2]].label : this.title;
      items.splice(this.backs[this.backs.length - 1], 0, { label: 'Back', icon: 'corner-up-left', back: true, status: '‹ ' + up });
    }
    return items;
  }
  get step() { return 360 / Math.max(this.ring.length, 1); }

  ringChanged() {
    this.revealAt = performance.now();
    this.selected = null; this.holdStart = null;
    this.blockNext = true;  // a new ring never auto-opens the slot already under the pointer
    this.dirty = true;
    this.announce(`${this.parent ? this.parent.label : this.title}: ${this.ring.map(s => s.label).join(', ')}`);
  }

  enter(i) {
    const came = i * this.step, b = this.backs.length ? this.backs[this.backs.length - 1] : null;
    const real = b == null ? i : (i > b ? i - 1 : i);
    this.path.push(real);
    const n = this.level.length + 1;
    this.backs.push(Math.round(came / (360 / n)) % n);
    Sound.play('detent');
    this.holdBlocked = null;
    this.ringChanged();
  }
  back() {
    if (!this.path.length) return;
    this.path.pop(); this.backs.pop();
    Sound.play('detent');
    this.ringChanged();
  }

  select(i) {
    if (i === this.selected) return;
    if (i != null && this.blockNext) { this.holdBlocked = i; this.blockNext = false; }
    else if (i !== this.holdBlocked) this.holdBlocked = null;
    if (i != null) {
      Sound.play('click');
      let t = i * this.step;
      while (t - this.spinTarget > 180) t -= 360;
      while (t - this.spinTarget < -180) t += 360;
      this.spinTarget = t;
      if (this.selected == null) this.spin = t;
      const s = this.ring[i];
      this.announce(s.label + (s.children ? ', has options' : ''));
    }
    this.selected = i;
    const s = i == null ? null : this.ring[i];
    // resting on a slot with options (or Back) grows the rim into a timer, as in the app
    this.holdStart = s && (s.children || s.back) && i !== this.holdBlocked && !this.job && !this.slider ? performance.now() : null;
    this.dirty = true;
  }

  activate(i) {
    const s = this.ring[i];
    if (!s || this.job) return;
    if (s.back) return this.back();
    if (s.children) return this.enter(i);
    if (s.slider) { this.slider = s; this.lastBearing = null; Sound.play('detent'); this.dirty = true; return; }
    if (s.run === 'toggle') { s.on = !s.on; Sound.play('detent'); this.toast(`${s.label} ${s.on ? 'on' : 'off'}`); return this.dirty = true; }
    if (s.run === 'media') {
      Sound.play('detent');
      if (s.label === 'Play' || s.label === 'Pause') this.playing = s.label === 'Play';
      if (s.label === 'Next' || s.label === 'Previous') this.toast(s.label === 'Next' ? 'Next track' : 'Previous track');
      return this.dirty = true;
    }
    if (s.run === 'output') { this.level.forEach(o => o.on = o === s); Sound.play('detent'); this.toast(`Sound now plays on ${s.label}`); return this.dirty = true; }
    if (s.run === 'toast') { Sound.play('detent'); this.toast(s.text); return; }
    if (s.run === 'job') {
      // the rim fills as the job runs, a check in the hub, then the wheel starts over, like the app
      this.job = { slot: i, start: performance.now(), dur: s.quick ? 350 : 900 + Math.random() * 500, out: s.out, verb: s.verb || 'Saved' };
      this.holdStart = null;
      this.dirty = true;
    }
  }

  toast(text, undo) { this.opts.onToast?.(text, undo); }
  announce(text) { if (this.opts.live) this.opts.live.textContent = text; }

  // ---------- input ----------
  bind() {
    const cv = this.cv;
    const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * this.size / r.width, (e.clientY - r.top) * this.size / r.height]; };
    cv.addEventListener('pointermove', e => { this.track(...pos(e)); });
    cv.addEventListener('pointerleave', () => { if (!this.slider) this.select(null); });
    cv.addEventListener('pointerdown', e => {
      Sound.init();
      const [x, y] = pos(e), d = Math.hypot(x - this.c, y - this.c) / this.k;
      if (this.slider) { if (d < 60) { this.slider = null; this.dirty = true; } return; }
      if (d < 60) return this.back();
      this.track(x, y);
      if (this.selected != null) this.activate(this.selected);
    });
    cv.addEventListener('keydown', e => {
      Sound.init();
      const n = this.ring.length;
      if (this.slider) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { this.setSlider(this.slider.slider.value + 0.05); e.preventDefault(); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { this.setSlider(this.slider.slider.value - 0.05); e.preventDefault(); }
        else if (e.key === 'Escape' || e.key === 'Enter' || e.key === 'Backspace') { this.slider = null; this.dirty = true; e.preventDefault(); }
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { this.select(((this.selected ?? -1) + 1) % n); e.preventDefault(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { this.select(((this.selected ?? 0) - 1 + n) % n); e.preventDefault(); }
      else if ((e.key === 'Enter' || e.key === ' ') && this.selected != null) { this.activate(this.selected); e.preventDefault(); }
      else if (e.key === 'Escape' || e.key === 'Backspace') { this.back(); e.preventDefault(); }
    });
  }

  track(x, y) {
    const dx = x - this.c, dy = y - this.c, d = Math.hypot(dx, dy) / this.k;
    const b = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
    if (this.slider) {
      if (d < 36) return this.lastBearing = null;
      if (this.lastBearing != null) {
        let delta = b - this.lastBearing;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        this.setSlider(this.slider.slider.value + delta / 360);
      }
      this.lastBearing = b;
      return;
    }
    if (this.job) return;
    if (d < 60 || d > 190) return this.select(null);
    this.select(Math.floor(((b + this.step / 2) % 360) / this.step) % this.ring.length);
  }

  setSlider(v) {
    const s = this.slider.slider, nv = Math.min(1, Math.max(0, v));
    if (Math.floor(nv * 20) !== Math.floor(s.value * 20)) Sound.play('detent');
    s.value = nv;
    this.dirty = true;
  }

  // ---------- drawing ----------
  frame() {
    const r = this.cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    const want = Math.round(r.width * dpr);
    if (this.cv.width !== want) { this.cv.width = this.cv.height = want; this.dirty = true; }
    this.size = want;
    const now = performance.now();
    const animating = now - this.revealAt < 600 || Math.abs(this.spin - this.spinTarget) > 0.1 || this.holdStart || this.job;
    if (!this.dirty && !animating) return;
    this.dirty = false;
    this.spin += (this.spinTarget - this.spin) * (this.reduce ? 1 : 0.28);

    if (this.holdStart && now - this.holdStart >= 600) {
      const i = this.selected;
      this.holdStart = null;
      if (this.ring[i]?.back) this.back(); else { this.enter(i); }
    }
    if (this.job && now - this.job.start > this.job.dur && !this.job.done) {
      this.job.done = now;
      Sound.play('detent');
      const out = this.job.out;
      this.toast(`${this.job.verb} ${out}`, this.job.verb === 'Moved' ? `Moved ${out.split('/').pop()} back` : `Moved ${out} to the Trash`);
    }
    if (this.job?.done && now - this.job.done > 900) {
      this.job = null;
      this.path = []; this.backs = [];
      this.ringChanged();
    }
    this.draw(now);
  }

  draw(now) {
    const ctx = this.ctx, k = this.k, c = this.c, glassy = this.style === 'glass';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.size, this.size);
    ctx.save();
    ctx.translate(c, c);
    ctx.scale(k, k);
    const ring = this.ring, step = this.step;

    // disc
    ctx.beginPath(); ctx.arc(0, 0, 150, 0, Math.PI * 2);
    if (glassy) {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 18 * k; ctx.shadowOffsetY = 6 * k;
      ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.fill();
      ctx.restore();
      const g = ctx.createLinearGradient(-106, -106, 106, 106);
      g.addColorStop(0, 'rgba(255,255,255,.75)'); g.addColorStop(0.55, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(255,255,255,.35)');
      ctx.strokeStyle = g; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(0, 0, 149.2, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, 144, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 30 * k; ctx.shadowOffsetY = 10 * k;
      ctx.fillStyle = '#141415'; ctx.fill();
      ctx.restore();
    }
    // rim track
    ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 143, 0, Math.PI * 2); ctx.stroke();

    // tiles
    ring.forEach((s, i) => {
      const p = this.reduce ? 1 : easeOutBack(Math.max(0, (now - this.revealAt - i * 35) / 220));
      const fade = Math.min(1, Math.max(0, p)), on = i === this.selected, back = !!s.back;
      const mid = i * step - 90, a0 = mid - step / 2, a1 = mid + step / 2;
      const path = sector(67, 135, rad(a0), rad(a1), 12, ring.length > 1 ? 6 : 0);  // the app's tile: inner+7 to outer
      ctx.globalAlpha = fade;
      let fill, edge = null;
      if (back) { fill = hexA(this.accent, on ? 0.34 : 0.17); edge = hexA(this.accent, on ? 0.7 : 0.4); }
      else if (glassy) { fill = on ? 'rgba(70,70,76,.92)' : 'rgba(0,0,0,.85)'; edge = `rgba(255,255,255,${on ? 0.7 : 0.24})`; }
      else { fill = on ? '#3A3A3C' : '#222224'; edge = on ? 'rgba(255,255,255,.1)' : null; }
      ctx.fillStyle = fill; ctx.fill(path);
      if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = 1; ctx.stroke(path); }

      // icon + label, scaled in as the tile reveals
      const rr = 102, x = Math.cos(rad(mid)) * rr, y = Math.sin(rad(mid)) * rr;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(Math.max(0.01, 0.5 + 0.5 * p), Math.max(0.01, 0.5 + 0.5 * p));
      const color = back ? mix(this.accent, '#FFFFFF', 0.75) : (on || glassy ? '#FFFFFF' : 'rgba(255,255,255,.62)');
      if (glassy) { ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 3 * k; ctx.shadowOffsetY = 0.5 * k; }
      let top = 6;
      if (s.icon && ICONS[s.icon]) { const img = iconImg(s.icon, back ? color : (on || glassy ? '#FFFFFF' : '#9E9E9E')); if (img.complete) ctx.drawImage(img, -10.5, -19, 21, 21); }
      else top = -4;
      const room = Math.min(2 * rr * Math.sin(rad(step / 2)) - 22, 104);
      const label = s.children ? s.label + ' ›' : s.label;
      let size = !s.icon ? (s.label.length > 5 ? 12 : 15) : 10.5;
      const font = pt => `${on ? 600 : 500} ${pt}px ${FONT}`;
      const words = label.split(' ');
      ctx.font = font(size);
      while (size > 8 && words.some(w => ctx.measureText(w).width > room)) { size -= 0.5; ctx.font = font(size); }
      const lines = wrap(ctx, words, room).slice(0, 2);
      ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      lines.forEach((l, j) => ctx.fillText(l, 0, top + j * (size + 2)));
      ctx.restore();
    });
    ctx.globalAlpha = 1;

    // rim: the marker over the lit slot, the hold timer, a job's progress, or a slider's level
    const rimFrom = deg => rad(deg - 90);
    ctx.save();
    ctx.shadowColor = this.accent; ctx.shadowBlur = 6 * k;
    ctx.strokeStyle = mix(this.accent, '#FFFFFF', 0.75); ctx.lineWidth = 3; ctx.lineCap = 'round';
    if (this.slider) {
      const si = ring.indexOf(this.slider), start = (si < 0 ? 0 : si) * step - step / 2, v = this.slider.slider.value;
      if (v > 0.003) { ctx.beginPath(); ctx.arc(0, 0, 143, rimFrom(start), rimFrom(start + v * 359.9)); ctx.stroke(); }
    } else if (this.job) {
      const start = this.job.slot * step - step / 2;
      const f = this.job.done ? 1 : Math.min(0.97, (now - this.job.start) / this.job.dur);
      ctx.beginPath(); ctx.arc(0, 0, 143, rimFrom(start), rimFrom(start + f * 359.9)); ctx.stroke();
    } else if (this.selected != null) {
      const start = this.spin - step / 2 + 1.5;
      const hold = this.holdStart ? Math.min(1, (now - this.holdStart) / 600) : 0;
      const len = (step - 3) + hold * (359.9 - (step - 3));
      ctx.beginPath(); ctx.arc(0, 0, 143, rimFrom(start), rimFrom(start + len)); ctx.stroke();
    }
    ctx.restore();

    // hub
    ctx.beginPath(); ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.fillStyle = glassy ? 'rgba(0,0,0,.22)' : '#0C0C0D'; ctx.fill();
    ctx.strokeStyle = glassy ? 'rgba(255,255,255,.24)' : 'rgba(255,255,255,.06)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.textAlign = 'center';
    if (this.slider) {
      ctx.fillStyle = '#FFFFFF'; ctx.font = `700 24px ${FONT}`; ctx.textBaseline = 'alphabetic';
      ctx.fillText(`${Math.round(this.slider.slider.value * 100)}%`, 0, 2);
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = `500 9.5px ${FONT}`;
      ctx.fillText(`${this.slider.slider.title} · circle to change`, 0, 18);
      ctx.fillText('click the centre when done', 0, 30);
    } else {
      const s = this.selected != null ? ring[this.selected] : null;
      let name = this.parent ? this.parent.label : this.title, sub = this.path.length ? 'Pick an option' : this.hint, subColor = 'rgba(255,255,255,.55)';
      if (this.parent?.info) { [name, sub] = this.parent.info; if (!this.playing) sub += ' · Paused'; }
      if (s) {
        name = s.label;
        if (s.estimate) { sub = s.estimate; subColor = this.accent; }
        else if (this.holdStart && !s.back) sub = 'Keep holding';
        else if (s.back) sub = s.status;
        else if (s.run === 'toggle') sub = s.on ? 'On' : 'Off';
        else if (s.run === 'output') sub = s.on ? 'In use' : 'Switch to this';
        else if (s.run === 'media' && (s.label === 'Play' || s.label === 'Pause')) sub = (s.label === 'Play') === !!this.playing ? (this.playing ? 'Playing' : 'Paused') : sub;
        else if (s.children) sub = 'Click or hold to open';
        else if (s.slider) sub = 'Click to change';
      }
      if (this.job) { name = ring[this.job.slot]?.label || name; sub = this.job.done ? '✓ Done' : 'Working…'; subColor = this.job.done ? this.accent : 'rgba(255,255,255,.55)'; }
      ctx.fillStyle = '#FFFFFF'; ctx.font = `600 14px ${FONT}`; ctx.textBaseline = 'alphabetic';
      ctx.fillText(ellipsize(ctx, name, 104), 0, -2);
      ctx.fillStyle = subColor; ctx.font = `500 10px ${FONT}`;
      ctx.fillText(ellipsize(ctx, sub, 102), 0, 14);
    }
    ctx.restore();
  }
}

let FONT = '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif';

// a ring tile: an annular sector, a gap on each side, rounded corners (like the app's roundedSector)
function sector(r0, r1, a0, a1, k, gap) {
  const pt = (r, a) => [Math.cos(a) * r, Math.sin(a) * r];
  const g = r => Math.min((gap / 2) / r, (a1 - a0) * 0.45);
  const A = pt(r1, a0 + g(r1)), B = pt(r1, a1 - g(r1)), C = pt(r0, a1 - g(r0)), D = pt(r0, a0 + g(r0));
  const toward = (p, q, d) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); return [p[0] + dx / l * d, p[1] + dy / l * d]; };
  const kk = Math.min(k, Math.hypot(B[0] - C[0], B[1] - C[1]) / 2.2);
  const p = new Path2D();
  p.moveTo(...pt(r1, a0 + g(r1) + kk / r1));
  p.arc(0, 0, r1, a0 + g(r1) + kk / r1, a1 - g(r1) - kk / r1);
  p.quadraticCurveTo(...B, ...toward(B, C, kk));
  p.lineTo(...toward(C, B, kk));
  p.quadraticCurveTo(...C, ...pt(r0, a1 - g(r0) - kk / r0));
  p.arc(0, 0, r0, a1 - g(r0) - kk / r0, a0 + g(r0) + kk / r0, true);
  p.quadraticCurveTo(...D, ...toward(D, A, kk));
  p.lineTo(...toward(A, D, kk));
  p.quadraticCurveTo(...A, ...pt(r1, a0 + g(r1) + kk / r1));
  p.closePath();
  return p;
}
function wrap(ctx, words, room) {
  const lines = []; let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > room && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}
function ellipsize(ctx, s, w) {
  if (ctx.measureText(s).width <= w) return s;
  while (s.length > 1 && ctx.measureText(s + '…').width > w) s = s.slice(0, -1);
  return s + '…';
}
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
function mix(hex, to, f) {
  const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16);
  const ch = s => Math.round(((a >> s) & 255) * (1 - f) + ((b >> s) & 255) * f);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

export { Dial, Sound, KINDS };
