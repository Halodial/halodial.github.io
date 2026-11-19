/** The top of an inner page: a quarter of the halo rising behind the title. */
export default function PageHead({ title, lede }: { title: string; lede: React.ReactNode }) {
  return (
    <header className="page-head">
      <span className="page-halo" aria-hidden="true" />
      <div className="wrap">
        <h1 className="page-title" data-split>{title}</h1>
        <p className="lede">{lede}</p>
      </div>
    </header>
  );
}
