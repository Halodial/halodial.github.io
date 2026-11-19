/** A section's header, Craftwork style: the title on the left, a quiet link on the right, a hairline under both. */
export default function SectionHead({ title, soft, href, link }: { title: string; soft?: string; href?: string; link?: string }) {
  return (
    <div className="section-head">
      <h2 className="section-title" data-split>{title}{soft && <> <span className="soft">{soft}</span></>}</h2>
      {href && <a className="see-all" href={href}>{link}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg></a>}
    </div>
  );
}
