/** A Finder document icon: a light page with a folded corner, a glyph for the kind of file, the extension
 *  underneath in grey (squeezed to fit, so long ones like TAR.GZ never spill). Folders are the blue folder. */

export const extOf = (name: string) => (name.includes('.') ? name.split('.').pop()!.toLowerCase() : '');

const KIND: Record<string, string> = {
  jpg: 'image', jpeg: 'image', png: 'image', heic: 'image', tiff: 'image', avif: 'image', gif: 'image', bmp: 'image', webp: 'image',
  mp4: 'film', mov: 'film', m4v: 'film', mp3: 'music', m4a: 'music', wav: 'music', flac: 'music', aiff: 'music', caf: 'music', alac: 'music',
  xlsx: 'table', csv: 'table', tsv: 'table', json: 'table', ods: 'table', pptx: 'slides', odp: 'slides', zip: 'archive', tar: 'archive', gz: 'archive',
};

// glyphs drawn in the page's middle (the page is 64 units square, the glyph sits around y 32)
const GLYPH: Record<string, React.ReactNode> = {
  image: <><rect x="20" y="22" width="24" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2.6" /><circle cx="27" cy="28" r="2.4" /><path d="M21.5 39l6-6 3.5 3.5 5.5-6 6 7.5z" /></>,
  film: <><rect x="20" y="22" width="24" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2.6" /><path d="M29 26.5v9l7.5-4.5z" /></>,
  music: <><path d="M37 21.5v14.2a4 4 0 1 1-2.6-3.7V25.4l-8 1.8v10.5a4 4 0 1 1-2.6-3.7V24.9z" /></>,
  table: <><rect x="20" y="22" width="24" height="18" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M20 28.5h24M20 34h24M28.5 22v18" stroke="currentColor" strokeWidth="2" /></>,
  slides: <><rect x="19" y="22" width="26" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.6" /><path d="M32 38v4M27 42h10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></>,
  archive: <><rect x="22" y="20" width="20" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="2.6" /><path d="M32 20v4h-2v3h2v3h-2v3h2" stroke="currentColor" strokeWidth="2" fill="none" /></>,
  text: <path d="M22 23h20M22 28.5h20M22 34h20M22 39.5h13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />,
};

export default function FileIcon({ name, size = 64 }: { name: string; size?: number }) {
  const ext = extOf(name);
  if (!ext) {  // a folder (Projects, or a job's output like a ZIP extracted)
    return (
      <svg className="ficon" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <path d="M6 16a5 5 0 0 1 5-5h13l5 5h24a5 5 0 0 1 5 5v28a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="#3A8EF0" />
        <path d="M6 22a4 4 0 0 1 4-4h44a4 4 0 0 1 4 4v27a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="#62AAF7" />
      </svg>
    );
  }
  const label = ext.toUpperCase();
  const fit = label.length > 4 ? { textLength: 30, lengthAdjust: 'spacingAndGlyphs' as const } : {};
  return (
    <svg className="ficon doc" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="fi-page" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FBFBFC" /><stop offset="1" stopColor="#ECECEF" /></linearGradient>
      </defs>
      <path d="M15 3.5h22.5l14 14V56a4.5 4.5 0 0 1-4.5 4.5H15a4.5 4.5 0 0 1-4.5-4.5V8A4.5 4.5 0 0 1 15 3.5z" fill="url(#fi-page)" stroke="rgba(0,0,0,.08)" />
      <path d="M37.5 3.5v9.5a4.5 4.5 0 0 0 4.5 4.5h9.5z" fill="#fff" stroke="rgba(0,0,0,.06)" />
      <path d="M37.5 13a4.5 4.5 0 0 0 4.5 4.5h9.5l-2 2H42a6 6 0 0 1-6-6z" fill="rgba(0,0,0,.06)" />
      <g color="#B5B6BC" fill="#B5B6BC">{GLYPH[KIND[ext] ?? 'text']}</g>
      <text x="31" y="54" textAnchor="middle" fontSize={label.length > 3 ? 8.6 : 10} fontWeight="700" fill="#A7A8AE" fontFamily="var(--body)" {...fit}>{label}</text>
    </svg>
  );
}
