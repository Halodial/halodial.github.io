import Dial from './Dial';
import Icon from './Icon';
import { FEATURES } from '@/lib/content';

const byTitle = (t: string) => FEATURES.find(f => f[1] === t)!;
const FOUR = [{ label: 'File', icon: 'folder' }, { label: 'Convert', icon: 'repeat' }, { label: 'Edit', icon: 'sliders' }, { label: 'Share', icon: 'share' }];

/** Each feature with a small picture of it working. Three rows that line up: two wide, four small, two wide. */
const ART: Record<string, React.ReactNode> = {
  'Undo, every time': (
    <div className="art-undo">
      <span className="toast-mock faded">Saved photo (1920px).jpg</span>
      <span className="toast-mock"><Icon name="image" size={16} />Saved photo.webp<b>Undo</b></span>
    </div>
  ),
  'Recipes': (
    <div className="art-recipe">
      <span>Resize 1920px</span><i /><span>WebP</span><i /><span className="done">photo.webp</span>
    </div>
  ),
  'An editor when you need one': (
    <div className="art-crop">
      <span className="crop-photo"><img className="photo-img" src="/assets/ocean-thumb.webp" alt="" /></span>
      <span className="crop-frame"><i /><i /><i /><i /></span>
      <span className="crop-ratios"><b>1:1</b><span>4:5</span><span>16:9</span></span>
    </div>
  ),
  'Trim to the frame': (
    <div className="art-trim">
      <span className="trim-strip">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}<span className="trim-sel" /></span>
      <span className="trim-time">0:04 to 0:12</span>
    </div>
  ),
  'Quality you choose': (
    <div className="art-quality">
      <span className="q-row"><span>WebP quality</span><b>82</b></span>
      <span className="q-track"><span className="q-fill" /><span className="q-thumb" /></span>
      <span className="q-size">≈ <span data-count data-from="2400" data-to="410" data-unit="kb">410 KB</span>, from 2.4 MB</span>
    </div>
  ),
  'Your keys, your fingers': (
    <div className="art-keys">
      <span className="keys-row"><kbd>⌥</kbd><kbd>⌘</kbd><kbd className="wide">Space</kbd></span>
      <span className="taps"><i /><i /><i /><i /></span>
    </div>
  ),
  'Glass or Solid': (
    <div className="art-looks">
      <Dial className="look solid" slots={FOUR} lit={1} name="Solid" sub="photo.jpg" />
      <span className="glass-wall">
        <svg className="wall-art" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="wall-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A2350" /><stop offset=".55" stopColor="#6E5FB0" /><stop offset="1" stopColor="#E9B8C9" /></linearGradient>
            <radialGradient id="wall-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#FFF3DC" /><stop offset=".45" stopColor="#FFD9A8" stopOpacity=".9" /><stop offset="1" stopColor="#FFD9A8" stopOpacity="0" /></radialGradient>
          </defs>
          <rect width="200" height="200" fill="url(#wall-sky)" />
          <circle cx="132" cy="112" r="46" fill="url(#wall-sun)" />
          <path d="M0 138 C 30 118, 52 120, 78 132 S 128 112, 160 124 S 190 128, 200 122 V200 H0Z" fill="#5B4F98" opacity=".85" />
          <path d="M0 158 C 34 144, 66 150, 96 158 S 150 142, 200 152 V200 H0Z" fill="#3B6E8F" />
          <path d="M0 176 C 40 166, 84 172, 120 178 S 176 168, 200 172 V200 H0Z" fill="#2E5A4A" />
          <path d="M0 190 C 50 184, 110 188, 200 184 V200 H0Z" fill="#1E3B33" />
        </svg>
        <Dial className="look glass" slots={FOUR} lit={1} name="Glass" sub="photo.jpg" />
      </span>
      <span className="look-dots">{['#FFFFFF', '#FFD17D', '#C9B6FF', '#7FC8FF', '#8FE3A2', '#FF9ED8'].map(c => <i key={c} style={{ background: c }} />)}</span>
    </div>
  ),
  'Learns your habits': (
    <div className="art-habits">
      {[['WebP', 42, 'first'], ['PNG', 18, ''], ['AVIF', 7, ''], ['HEIC', 2, '']].map(([f, n, tag]) => (
        <span key={f as string} className="h-row">
          <b>{f}</b><span className="h-bar" style={{ width: `${(n as number) / 42 * 100}%` }} /><span className="h-n">{n}</span>{tag && <em>Moved to the front</em>}
        </span>
      ))}
    </div>
  ),
};

const ORDER: [title: string, wide: boolean][] = [
  ['Undo, every time', true], ['Recipes', true],
  ['An editor when you need one', false], ['Trim to the frame', false], ['Quality you choose', false], ['Your keys, your fingers', false],
  ['Glass or Solid', true], ['Learns your habits', true],
];

export default function Bento() {
  return (
    <ul className="bento" data-rise>
      {ORDER.map(([t, wide]) => {
        const [, title, text] = byTitle(t);
        return (
          <li key={t} className={wide ? 'wide' : ''}>
            <div className="bento-art" aria-hidden="true">{ART[t]}</div>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        );
      })}
    </ul>
  );
}
