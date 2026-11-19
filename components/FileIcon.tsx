/** A Finder-style file icon by extension: a photo thumbnail for pictures, a folded page with a coloured badge for the rest. */
const BADGE: Record<string, string> = {
  pdf: '#E5484D', docx: '#3E7BFA', xlsx: '#2EA44F', pptx: '#F07B3F', mp4: '#8E6CEF', mov: '#8E6CEF',
  mp3: '#E5539A', m4a: '#E5539A', zip: '#8B8D98', txt: '#8B8D98', md: '#8B8D98', html: '#F07B3F', csv: '#2EA44F',
};
const PICTURE = ['jpg', 'jpeg', 'png', 'heic', 'tiff', 'avif', 'gif', 'bmp', 'webp'];

export const extOf = (name: string) => (name.includes('.') ? name.split('.').pop()!.toLowerCase() : '');

export default function FileIcon({ name, size = 64 }: { name: string; size?: number }) {
  const ext = extOf(name);
  if (PICTURE.includes(ext)) {
    return <span className="ficon pic" style={{ width: size, height: size * 0.82 }}><span className="sun" /><span className="hill" /></span>;
  }
  if (!ext) {  // a folder (a job's output, like a ZIP extracted or a PDF split)
    return (
      <svg className="ficon" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <path d="M6 16a5 5 0 0 1 5-5h13l5 5h24a5 5 0 0 1 5 5v28a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="#3A8EF0" />
        <path d="M6 22a4 4 0 0 1 4-4h44a4 4 0 0 1 4 4v27a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="#62AAF7" />
      </svg>
    );
  }
  const badge = BADGE[ext] ?? '#8B8D98';
  return (
    <svg className="ficon" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M14 4h26l12 12v42a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill="#F4F4F6" />
      <path d="M40 4v9a3 3 0 0 0 3 3h9z" fill="#D2D3DA" />
      <path d="M18 24h28M18 30h28M18 36h20" stroke="#C9CAD2" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="8" y="42" width="40" height="13" rx="3.5" fill={badge} />
      <text x="28" y="51.5" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#fff" fontFamily="var(--body)">{ext.toUpperCase()}</text>
    </svg>
  );
}
