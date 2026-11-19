import { ICONS } from '@/lib/icons';
import { arc, at, sector } from '@/lib/dial';

export type Slot = { label: string; icon?: string; back?: boolean };

type Props = {
  slots: Slot[];
  /** The slot the rim marker sits over. */
  lit?: number;
  name: string;
  sub: string;
  /** Fill the rim from the lit slot's start, 0..1 (a slider level or a job's progress). */
  level?: number;
  className?: string;
};

/** The Halodial dial, drawn like the app: disc, rim, tiles with icon + label, hub with name and status.
 *  A slot with options opens a new ring in its place, with a Back tile where you came from.
 *  Pure markup; the hero animates its parts by class name. */
export default function Dial({ slots, lit, name, sub, level, className }: Props) {
  const step = 360 / slots.length;
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
            <g key={s.label} className={`tile${i === lit ? ' on' : ''}${s.back ? ' back' : ''}`} data-i={i}>
              <path d={sector(67, 135, i * step - step / 2, i * step + step / 2)} />
              <g transform={`translate(${x} ${y})`}>
                {s.icon && (
                  <g transform="translate(-10.5 -19) scale(.875)" fill="none" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ICONS[s.icon] ?? '' }} />
                )}
                <text y={s.icon ? 15 : 5} className={s.icon ? undefined : 'big'} textAnchor="middle">{s.label}</text>
              </g>
            </g>
          );
        })}

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
