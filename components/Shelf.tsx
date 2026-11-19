import Icon from './Icon';

/** The shelf as the app draws it: a card with a grab handle, close and more buttons, a fanned photo stack and the items pill. */
export default function Shelf({ title }: { title: string }) {
  return (
    <div className="shelf" aria-hidden="true">
      <div className="shelf-top">
        <span className="shelf-btn"><Icon name="more-horizontal" size={14} /></span>
        <span className="shelf-title">{title}</span>
        <span className="shelf-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg></span>
      </div>
      <div className="shelf-stack">
        <span className="print p1"><img className="photo-img" src="/assets/landscape-1-thumb.webp" alt="" /></span><span className="print p2"><img className="photo-img" src="/assets/landscape-2-thumb.webp" alt="" /></span><span className="print p3"><img className="photo-img" src="/assets/ocean-thumb.webp" alt="" /></span>
      </div>
      <span className="shelf-pill">3 Images</span>
    </div>
  );
}
