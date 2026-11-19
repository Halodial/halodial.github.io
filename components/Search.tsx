'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SEARCH } from '@/lib/content';

/** ⌘K: one box that finds any page, format, shortcut, recipe or help answer. The nav's search button opens it too
 *  (it sends an 'open-search' event). Arrow keys move, Return goes, Escape closes. */
export default function Search() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(o => !o); }
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpen = () => setOpen(true);
    addEventListener('keydown', onKey); addEventListener('open-search', onOpen);
    return () => { removeEventListener('keydown', onKey); removeEventListener('open-search', onOpen); };
  }, []);
  useEffect(() => { if (open) { setQ(''); setI(0); setTimeout(() => input.current?.focus(), 0); } }, [open]);

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return SEARCH.filter(f => f.hint === 'Page' || f.hint === 'Install');
    return SEARCH.filter(f => { const hay = `${f.title} ${f.hint} ${f.words ?? ''}`.toLowerCase(); return words.every(w => hay.includes(w)); }).slice(0, 9);
  }, [q]);

  if (!open) return null;
  return (
    <div className="search" role="dialog" aria-modal="true" aria-label="Search the site" onPointerDown={e => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="search-box">
        <div className="search-field">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input ref={input} value={q} placeholder="Search formats, shortcuts, help…" aria-label="Search" aria-controls="search-results"
            aria-activedescendant={results[i] ? `sr-${i}` : undefined}
            onChange={e => { setQ(e.target.value); setI(0); }}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setI(x => Math.min(results.length - 1, x + 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setI(x => Math.max(0, x - 1)); }
              if (e.key === 'Enter' && results[i]) { location.href = results[i].href; setOpen(false); }
            }} />
          <kbd>esc</kbd>
        </div>
        <ul id="search-results" role="listbox">
          {results.length === 0 && <li className="search-empty">Nothing matches “{q}”. Try a format like HEIC, or a word like shelf.</li>}
          {results.map((r, j) => (
            <li key={`${r.title}${j}`} id={`sr-${j}`} role="option" aria-selected={j === i}>
              <a href={r.href} onPointerEnter={() => setI(j)} onClick={() => setOpen(false)}><span>{r.title}</span><em>{r.hint}</em></a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
