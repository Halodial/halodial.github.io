'use client';
import { useEffect, useRef, useState } from 'react';
import { Dial, Sound } from '@/lib/playground';
import FileIcon, { extOf } from './FileIcon';
import Logo from './Logo';

/** A pretend Mac desktop for trying Halodial with real gestures:
 *  drag a file and hold ⌘ (or the on-screen ⌘ on touch screens) and the real dial opens under the pointer;
 *  let go on a slot to run it, or rest on a slot with options to open it. Results land on the desktop, with Undo.
 *  Shake a file while dragging and a shelf opens; drop files on it, drag the stack out, or drop it on Projects.
 *  Nothing touches real files. */

type DeskFile = { id: number; name: string; x: number; y: number; shelf?: boolean };  // x, y: % of the desktop
type DialApi = {
  setKind(k: string): void; title: string; dirty: boolean; selected: number | null; path: number[];
  ring: { children?: unknown; back?: boolean }[]; track(x: number, y: number): void; activate(i: number): void;
  size: number; destroy(): void;
};
type Drag = { kind: 'file' | 'stack'; id: number; from: [number, number]; dx: number; dy: number; dir: number; turnX: number; turns: number[] };

const KIND: Record<string, string> = {
  jpg: 'image', jpeg: 'image', png: 'image', heic: 'image', tiff: 'image', avif: 'image', gif: 'image', bmp: 'image', webp: 'image',
  mp4: 'video', mov: 'video', mp3: 'audio', m4a: 'audio', caf: 'audio', flac: 'audio', aiff: 'audio', wav: 'audio',
  pdf: 'pdf', docx: 'document', rtf: 'document', txt: 'document', md: 'document', html: 'document', odt: 'document', doc: 'document',
  xlsx: 'sheet', csv: 'sheet', tsv: 'sheet', json: 'sheet', pptx: 'slides', zip: 'archive',
};
const START: DeskFile[] = [
  { id: 1, name: 'photo.jpg', x: 88, y: 17 },
  { id: 2, name: 'report.pdf', x: 88, y: 39 },
  { id: 3, name: 'clip.mp4', x: 88, y: 61 },
  { id: 4, name: 'song.mp3', x: 76, y: 61 },
  { id: 5, name: 'essay.docx', x: 76, y: 39 },
  { id: 6, name: 'budget.xlsx', x: 88, y: 83 },
];
// on a phone the desktop is narrow: three columns instead of two at the right
const START_NARROW: DeskFile[] = START.map((f, i) => ({ ...f, x: [20, 50, 80][i % 3], y: [44, 66][Math.floor(i / 3)] }));

/** The first empty place on the desktop grid, filling columns from the right as Finder does. */
function freeSpot(fs: DeskFile[], folder: [number, number]) {
  const taken = [...fs.filter(f => !f.shelf).map(f => [f.x, f.y]), folder];
  for (const x of [64, 52, 40, 28, 16]) for (const y of [17, 39, 61, 83]) {
    if (!taken.some(([tx, ty]) => Math.abs(tx - x) < 7 && Math.abs(ty - y) < 14)) return { x, y };
  }
  return { x: 50, y: 50 };
}

export default function Desktop() {
  const desk = useRef<HTMLDivElement>(null);
  const shelfEl = useRef<HTMLDivElement>(null);
  const folderEl = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const dial = useRef<DialApi | null>(null);
  const drag = useRef<Drag | null>(null);
  const cmdKey = useRef(false);
  const nextId = useRef(100);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [files, setFiles] = useState<DeskFile[]>(START);
  const [narrow, setNarrow] = useState(false);
  const projects: [number, number] = narrow ? [20, 18] : [76, 17];  // the folder
  useEffect(() => {
    if (desk.current && desk.current.offsetWidth < 640) { setNarrow(true); setFiles(START_NARROW); }
  }, []);
  const [dragging, setDragging] = useState<number | null>(null);
  const [stackAt, setStackAt] = useState<[number, number] | null>(null);
  const [shelf, setShelf] = useState<[number, number] | null>(null);
  const [hover, setHover] = useState<'shelf' | 'folder' | null>(null);
  const [dialAt, setDialAt] = useState<{ x: number; y: number; id: number; name: string; mode: 'drag' | 'click' } | null>(null);
  const [latch, setLatch] = useState(false);  // the on-screen ⌘, for touch screens
  const [toast, setToast] = useState<{ text: string; undo?: () => void; n: number } | null>(null);

  const show = (text: string, undo?: () => void) => {
    setToast(t => ({ text, undo, n: (t?.n ?? 0) + 1 }));
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), undo ? 4200 : 2600);
  };
  const closeDial = () => { clearTimeout(closeTimer.current); setDialAt(null); };

  // pointer position as % of the desktop, and in px from its corner
  const where = (e: { clientX: number; clientY: number }) => {
    const r = desk.current!.getBoundingClientRect();
    return { px: e.clientX - r.left, py: e.clientY - r.top, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, w: r.width, h: r.height };
  };
  const over = (el: HTMLElement | null, e: { clientX: number; clientY: number }) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  };

  // the dial: created when it opens, for the dragged file's kind; results become files on the desktop
  useEffect(() => {
    if (!dialAt || !canvas.current) return;
    const source = files.find(f => f.id === dialAt.id);
    const onToast = (text: string, undoText?: string) => {
      let undo: (() => void) | undefined;
      const saved = text.match(/^Saved (.+)$/);
      if (saved && !saved[1].includes('/') && source) {
        const id = nextId.current++;
        setFiles(fs => [...fs, { id, name: saved[1], ...freeSpot(fs, projects) }]);
        undo = () => { setFiles(fs => fs.filter(f => f.id !== id)); show(undoText ?? 'Undone'); };
      }
      show(text, undo);
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => setDialAt(null), 800);
    };
    const d = new Dial(canvas.current, { onToast }) as unknown as DialApi;  // the JS dial, typed by what this page uses
    d.setKind(KIND[extOf(dialAt.name)] ?? 'document');
    d.title = dialAt.name;
    d.dirty = true;
    dial.current = d;
    return () => { d.destroy(); dial.current = null; };
    // a new dial only when one opens for a file; moving between drag and click mode keeps it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialAt?.id, dialAt === null]);

  // ⌘ while dragging opens the dial; Esc closes it
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Meta') { cmdKey.current = true; if (drag.current?.kind === 'file' && last.current) openDial(last.current); }
      if (e.key === 'Escape') closeDial();
    };
    const up = (e: KeyboardEvent) => { if (e.key === 'Meta') cmdKey.current = false; };
    addEventListener('keydown', down); addEventListener('keyup', up);
    return () => { removeEventListener('keydown', down); removeEventListener('keyup', up); };
  });
  useEffect(() => () => { clearTimeout(closeTimer.current); clearTimeout(toastTimer.current); }, []);
  const last = useRef<{ clientX: number; clientY: number } | null>(null);

  function openDial(e: { clientX: number; clientY: number }) {
    const g = drag.current;
    if (!g || g.kind !== 'file' || dialAt) return;
    const f = files.find(x => x.id === g.id);
    if (!f) return;
    const p = where(e);
    const s = Math.min(320, Math.max(240, p.w * 0.36)) / 2;
    setDialAt({ x: Math.min(p.w - s, Math.max(s, p.px)), y: Math.min(p.h - s, Math.max(s + 28, p.py)), id: f.id, name: f.name, mode: 'drag' });
  }

  function start(e: React.PointerEvent, kind: Drag['kind'], id: number, from: [number, number]) {
    if (e.button !== 0) return;
    Sound.init();
    if (dialAt) closeDial();  // picking up something new puts the open dial away
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* a synthetic or already-released pointer */ }
    const p = where(e);
    drag.current = { kind, id, from, dx: p.x - from[0], dy: p.y - from[1], dir: 0, turnX: e.clientX, turns: [] };
    last.current = e;
    if (kind === 'file') setDragging(id); else setStackAt([p.x, p.y]);
  }

  function move(e: React.PointerEvent) {
    const g = drag.current;
    if (!g) return;
    last.current = { clientX: e.clientX, clientY: e.clientY };
    const p = where(e);
    if (g.kind === 'stack') setStackAt([p.x, p.y]);
    else if (!dialAt) setFiles(fs => fs.map(f => (f.id === g.id ? { ...f, x: p.x - g.dx, y: p.y - g.dy } : f)));

    // the dial, under the pointer, follows it
    if (g.kind === 'file' && (cmdKey.current || latch || e.metaKey) && !dialAt) openDial(e);
    if (dialAt && dial.current && canvas.current) {
      const r = canvas.current.getBoundingClientRect(), k = dial.current.size / r.width;
      dial.current.track((e.clientX - r.left) * k, (e.clientY - r.top) * k);
      return;
    }

    // a shake: four quick changes of direction, each 25px or more, within 0.6 s (as in the app)
    // turnX is the furthest point in the current direction; going back 25px from it is a change of direction
    const dx = e.clientX - g.turnX, dir = Math.sign(dx);
    if (dir !== 0 && dir === g.dir) g.turnX = e.clientX;
    else if (dir !== 0 && Math.abs(dx) > 25) {
      const now = performance.now();
      g.turns = [...g.turns.filter(t => now - t < 600), now];
      g.dir = dir;
      g.turnX = e.clientX;
      if (g.turns.length >= 4 && g.kind === 'file' && !shelf) {
        setShelf([Math.min(70, Math.max(18, p.x + 18)), Math.min(64, Math.max(30, p.y - 8))]);
        Sound.play('detent');
      }
    }
    setHover(over(shelfEl.current, e) ? 'shelf' : over(folderEl.current, e) ? 'folder' : null);
  }

  function end(e: React.PointerEvent) {
    const g = drag.current;
    drag.current = null;
    setDragging(null); setStackAt(null); setHover(null);
    if (!g) return;
    const back = () => setFiles(fs => fs.map(f => (f.id === g.id ? { ...f, x: g.from[0], y: g.from[1] } : f)));

    // let go over the dial: run the slot, or open it and keep the dial up
    if (g.kind === 'file' && dialAt && dial.current) {
      const d = dial.current, i = d.selected;
      back();
      if (i == null) return closeDial();
      const slot = d.ring[i];
      d.activate(i);
      if (slot.children || slot.back) setDialAt(a => (a ? { ...a, mode: 'click' } : a));
      return;
    }
    const onShelf = files.filter(f => f.shelf);
    if (g.kind === 'stack') {
      if (over(folderEl.current, e)) {
        const ids = onShelf.map(f => f.id), names = onShelf.length === 1 ? onShelf[0].name : `${onShelf.length} files`;
        setFiles(fs => fs.filter(f => !ids.includes(f.id)));
        show(`Moved ${names} to Projects`, () => { setFiles(fs => [...fs, ...onShelf]); show(`Moved ${names} back to the shelf`); });
      } else if (!over(shelfEl.current, e)) {
        const p = where(e);
        setFiles(fs => {
          let n = 0;
          return fs.map(f => (f.shelf ? { ...f, shelf: false, x: Math.min(92, p.x + (n % 3) * 9), y: Math.min(88, p.y + Math.floor(n++ / 3) * 18) } : f));
        });
      }
      return;
    }
    const f = files.find(x => x.id === g.id)!;
    if (shelf && over(shelfEl.current, e)) {
      setFiles(fs => fs.map(x => (x.id === g.id ? { ...x, shelf: true, x: g.from[0], y: g.from[1] } : x)));
      Sound.play('click');
    } else if (over(folderEl.current, e)) {
      setFiles(fs => fs.filter(x => x.id !== g.id));
      show(`Moved ${f.name} to Projects`, () => { setFiles(fs => [...fs, { ...f, x: g.from[0], y: g.from[1] }]); show(`Moved ${f.name} back`); });
    }
  }

  function closeShelf() {
    setFiles(fs => fs.map(f => ({ ...f, shelf: false })));
    setShelf(null);
  }
  function reset() { closeDial(); setShelf(null); setFiles(narrow ? START_NARROW : START); setToast(null); }

  const shelved = files.filter(f => f.shelf);
  const S = dialAt ? Math.min(320, Math.max(240, (desk.current?.offsetWidth ?? 800) * 0.36)) : 0;
  const dragged = stackAt ? null : files.find(f => f.id === dragging);

  return (
    <div className="desktop-wrap">
      <div className="desk-tips">
        <span>Drag a file and hold <kbd>⌘</kbd></span>
        <span>Shake a file while dragging</span>
        <span>Drop on <b>Projects</b> to move it</span>
        <button type="button" className="chip" aria-pressed={latch} onClick={() => setLatch(l => !l)}>{latch ? '⌘ held' : 'Hold ⌘ (touch screens)'}</button>
        <button type="button" className="chip" onClick={reset}>Reset</button>
      </div>

      <div className={`desk${dragging || stackAt ? ' is-dragging' : ''}`} ref={desk} role="application"
        aria-label="A pretend Mac desktop. Drag a file and hold Command to open the Halodial dial, or shake a file to open a shelf. Nothing touches your files."
        onPointerDown={e => { if (dialAt?.mode === 'click' && e.target === e.currentTarget) closeDial(); }}>
        <div className="menubar" aria-hidden="true">
          <b>Finder</b><span>File</span><span>Edit</span><span>View</span><span>Go</span><span>Window</span>
          <span className="menubar-end"><Logo size={15} /><span>Thu 9:41</span></span>
        </div>

        <div ref={folderEl} className={`desk-item folder${hover === 'folder' ? ' target' : ''}`} style={{ left: `${projects[0]}%`, top: `${projects[1]}%` }}>
          <FileIcon name="Projects" size={60} /><span className="desk-label">Projects</span>
        </div>

        {files.filter(f => !f.shelf).map(f => (
          <div key={f.id} className={`desk-item${dragging === f.id ? ' lifted' : ''}${dragging === f.id && dialAt ? ' held' : ''}`}
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            onPointerDown={e => start(e, 'file', f.id, [f.x, f.y])} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
            <FileIcon name={f.name} size={58} /><span className="desk-label">{f.name}</span>
          </div>
        ))}

        {shelf && (
          <div ref={shelfEl} className={`shelf desk-shelf${hover === 'shelf' ? ' target' : ''}`} style={{ left: `${shelf[0]}%`, top: `${shelf[1]}%` }}>
            <div className="shelf-top">
              <span className="shelf-btn" aria-hidden="true">•••</span>
              <span className="shelf-title">Shelf</span>
              <button type="button" className="shelf-btn" aria-label="Close the shelf" onClick={closeShelf}>✕</button>
            </div>
            <div className="desk-stack" onPointerDown={e => shelved.length && start(e, 'stack', 0, [0, 0])} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
              {shelved.length === 0 ? <span className="desk-empty">Drop files here</span>
                : shelved.slice(-3).map((f, i, a) => (
                  <span key={f.id} className="desk-print" style={{ rotate: `${(i - (a.length - 1) / 2) * 12}deg`, translate: `${(i - (a.length - 1) / 2) * 22}px 0`, zIndex: i }}><FileIcon name={f.name} size={54} /></span>
                ))}
            </div>
            <span className="shelf-pill">{shelved.length === 0 ? 'Empty' : shelved.length === 1 ? shelved[0].name : `${shelved.length} files`}</span>
          </div>
        )}

        {stackAt && (
          <div className="desk-ghost" style={{ left: `${stackAt[0]}%`, top: `${stackAt[1]}%` }} aria-hidden="true">
            {shelved.slice(-3).map((f, i) => <span key={f.id} style={{ rotate: `${(i - 1) * 8}deg` }}><FileIcon name={f.name} size={46} /></span>)}
            <b>{shelved.length}</b>
          </div>
        )}

        {dialAt && (
          <div className="desk-dial" style={{ left: dialAt.x - S / 2, top: dialAt.y - S / 2, width: S, height: S }}
            onPointerDown={e => {  // the centre of the first ring closes the dial (deeper rings: it goes back)
              const r = e.currentTarget.getBoundingClientRect();
              const d = Math.hypot(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2) * (380 / r.width);
              if (d < 60 && !dial.current?.path.length) closeDial();
            }}>
            <canvas ref={canvas} tabIndex={-1} />
          </div>
        )}
        {dragged && dialAt && <span className="desk-cmd" aria-hidden="true">⌘</span>}

        <div className={`play-toast${toast ? ' show' : ''}${toast?.undo ? ' undo' : ''}`} role="status" aria-live="polite">
          <span>{toast?.text}</span>
          {toast?.undo && <button type="button" onClick={() => toast.undo?.()}>Undo</button>}
        </div>
      </div>
    </div>
  );
}
