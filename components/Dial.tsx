import { ICONS } from '@/lib/icons';
import { arc, at, sector } from '@/lib/dial';

export type Slot = { label: string; icon?: string };

type Props = {
  slots: Slot[];
  /** The slot the rim marker sits over. */
  lit?: number;
  name: string;
  sub: string;
  /** Child tabs that grow out past the rim, centred on `tabsAt` (degrees). */
  tabs?: string[];
  tabsAt?: number;
  /** Fill the rim from the lit slot's start, 0..1 (a slider level or a job's progress). */
  level?: number;
  className?: string;
};

const TAB = 23;  // degrees per child tab

/** The Halodial dial, drawn like the app: disc, rim, tiles with icon + label, hub with name and status.
 *  Pure markup; the hero animates its parts by class name. */
export default function Dial({ slots, lit, name, sub, tabs = [], tabsAt = 0, level, className }: Props) {
  const step = 360 / slots.length;
  const tabStart = tabsAt - (TAB * (tabs.length - 1)) / 2;
  return (
    <svg className={`dial ${className ?? ''}`} viewBox="-210 -210 420 420" aria-hidden="true">
      <defs>
        <linearGradient id="dial-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".7" />
          <stop offset=".55" stopColor="#fff" stopOpacity=".08" />
          <stop offset="1" stopColor="#fff" stopOpacity=".3" />
        </linearGradient>
      </defs>
      <g className="dial-body">
        <circle className="dial-disc" r="150" />
        <circle r="149.2" fill="none" stroke="url(#dial-rim)" strokeWidth="1.4" />
        <circle r="143" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="3" />

        {slots.map((s, i) => {
          const [x, y] = at(102, i * step);
          return (
            <g key={s.label} className={`tile${i === lit ? ' on' : ''}`} data-i={i}>
              <path d={sector(67, 135, i * step - step / 2, i * step + step / 2)} />
              <g transform={`translate(${x} ${y})`}>
                {s.icon && (
                  <g transform="translate(-10.5 -19) scale(.875)" fill="none" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ICONS[s.icon] ?? '' }} />
                )}
                <text y="15" textAnchor="middle">{s.label}</text>
              </g>
            </g>
          );
        })}

        {tabs.length > 0 && (
          <g className="tabs">
            {tabs.map((t, i) => {
              const a = tabStart + i * TAB, [x, y] = at(178, a);
              return (
                <g key={t} className="tab" data-i={i}>
                  <path d={sector(158, 200, a - TAB / 2, a + TAB / 2, 9, 4)} />
                  <text x={x} y={y + 4} textAnchor="middle">{t}</text>
                </g>
              );
            })}
          </g>
        )}

        {lit != null && (
          <g className="marker" transform={`rotate(${lit * step})`}>
            <path d={arc(143, -step / 2 + 1.5, step / 2 - 1.5)} />
          </g>
        )}
        <g className="progress" transform={`rotate(${(lit ?? 0) * step - step / 2})`} opacity={level ? 1 : 0}>
          <path d={arc(143, 0, 359.9)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - (level ?? 0)} />
        </g>

        <circle className="hub" r="60" />
        <text className="hub-name" y="-2" textAnchor="middle">{name}</text>
        <text className="hub-sub" y="16" textAnchor="middle">{sub}</text>
      </g>
    </svg>
  );
}
