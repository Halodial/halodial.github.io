// The dial's geometry, ported from the app: a tile is a ring sector with rounded corners and a gap between neighbours.
// Angles are in degrees, 0 at the top, clockwise (like the app's rim).

type Pt = [number, number];
const rad = (d: number) => ((d - 90) * Math.PI) / 180;
const pt = (r: number, a: number): Pt => [Math.cos(a) * r, Math.sin(a) * r];
const f = (p: Pt) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;

/** SVG path for a tile from radius r0 to r1 between angles from..to, corner radius k, gap between tiles. */
export function sector(r0: number, r1: number, from: number, to: number, k = 12, gap = 6): string {
  const a0 = rad(from), a1 = rad(to);
  const g = (r: number) => Math.min(gap / 2 / r, (a1 - a0) * 0.45);
  const A = pt(r1, a0 + g(r1)), B = pt(r1, a1 - g(r1)), C = pt(r0, a1 - g(r0)), D = pt(r0, a0 + g(r0));
  const toward = (p: Pt, q: Pt, d: number): Pt => {
    const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy);
    return [p[0] + (dx / l) * d, p[1] + (dy / l) * d];
  };
  const kk = Math.min(k, Math.hypot(B[0] - C[0], B[1] - C[1]) / 2.2);
  const big = (a: number, b: number) => (Math.abs(b - a) > Math.PI ? 1 : 0);
  const s1 = a0 + g(r1) + kk / r1, e1 = a1 - g(r1) - kk / r1, s0 = a1 - g(r0) - kk / r0, e0 = a0 + g(r0) + kk / r0;
  return [
    `M${f(pt(r1, s1))}`,
    `A${r1} ${r1} 0 ${big(s1, e1)} 1 ${f(pt(r1, e1))}`,
    `Q${f(B)} ${f(toward(B, C, kk))}`,
    `L${f(toward(C, B, kk))}`,
    `Q${f(C)} ${f(pt(r0, s0))}`,
    `A${r0} ${r0} 0 ${big(s0, e0)} 0 ${f(pt(r0, e0))}`,
    `Q${f(D)} ${f(toward(D, A, kk))}`,
    `L${f(toward(A, D, kk))}`,
    `Q${f(A)} ${f(pt(r1, s1))}Z`,
  ].join('');
}

/** SVG path for an arc on radius r from..to (degrees, clockwise). */
export function arc(r: number, from: number, to: number): string {
  const a = rad(from), b = rad(to);
  return `M${f(pt(r, a))}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${f(pt(r, b))}`;
}

/** Where a slot's icon and label sit: radius r at angle a. */
export const at = (r: number, a: number): Pt => pt(r, rad(a));
