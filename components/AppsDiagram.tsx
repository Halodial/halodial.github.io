import Icon from './Icon';
import Logo from './Logo';

/** Files in on the left, Halodial in the middle, the places it hands them on the right; light runs along the lines.
 *  Positions share one 1000 x 500 frame, so the nodes (placed in %) and the lines (an SVG stretched over the frame) meet. */
const IN: [string, string, string][] = [['Pictures', 'image', '#E5539A'], ['Video', 'film', '#8E6CEF'], ['Audio', 'music', '#F07B3F'], ['PDFs', 'file-text', '#E5484D'], ['Documents', 'layers', '#3E7BFA']];
const OUT: [string, string, string][] = [['Finder', 'folder', '#3A8EF0'], ['AirDrop', 'wifi', '#2EA4F0'], ['Mail', 'mail', '#4C8DF6'], ['Messages', 'chat', '#2EA44F'], ['Notes', 'file-text', '#E8B931'], ['Terminal', 'terminal', '#5B5B5B']];
const ys = (n: number) => Array.from({ length: n }, (_, i) => 50 + (400 / (n - 1)) * i);
const C: [number, number] = [500, 250];
const curve = (x: number, y: number, toRight: boolean) => {
  const [cx, cy] = C, sx = toRight ? cx + 60 : x, ex = toRight ? x : cx - 60;
  const [y1, y2] = toRight ? [cy, y] : [y, cy];
  return `M${sx} ${y1} C${(sx + ex) / 2} ${y1}, ${(sx + ex) / 2} ${y2}, ${ex} ${y2}`;
};

export default function AppsDiagram() {
  const inY = ys(IN.length), outY = ys(OUT.length);
  return (
    <div className="apps">
      <div className="apps-copy">
        <p className="apps-kicker">Works with your Mac</p>
        <h2 className="section-title" data-split>From any file <span className="soft">to wherever it goes next.</span></h2>
        <p className="lede">Halodial hands files to the apps you already use: Finder, AirDrop, Mail, Messages, Notes and Terminal. And every conversion runs from the <code>halodial</code> command too.</p>
        <div className="cta"><a className="btn" href="/try/">Try it</a><a className="btn ghost" href="/formats/">Every format</a></div>
      </div>
      <div className="apps-map" aria-hidden="true">
        <svg viewBox="0 0 1000 500" preserveAspectRatio="none">
          {inY.map((y, i) => <g key={`i${i}`}><path className="line" d={curve(170, y, false)} /><path className="flow" style={{ animationDelay: `${i * 0.35}s` }} d={curve(170, y, false)} /></g>)}
          {outY.map((y, i) => <g key={`o${i}`}><path className="line" d={curve(830, y, true)} /><path className="flow out" style={{ animationDelay: `${0.9 + i * 0.3}s` }} d={curve(830, y, true)} /></g>)}
        </svg>
        {IN.map(([n, ic, c], i) => <span key={n} className="node" style={{ left: '17%', top: `${inY[i] / 5}%` }}><b style={{ background: c }}><Icon name={ic} size={20} /></b>{n}</span>)}
        {OUT.map(([n, ic, c], i) => <span key={n} className="node right" style={{ left: '83%', top: `${outY[i] / 5}%` }}><b style={{ background: c }}><Icon name={ic} size={20} /></b>{n}</span>)}
        <span className="hub-node"><Logo size={44} /></span>
      </div>
    </div>
  );
}
