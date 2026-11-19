import Logo from './Logo';

export const RELEASES = 'https://github.com/Halodial/releases/releases';
export const DMG = `${RELEASES}/latest/download/Halodial.dmg`;

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-brand">
          <a className="brand" href="/"><Logo size={22} />halodial</a>
          <p>A dial for your Mac that opens under your pointer.</p>
        </div>
        <nav className="footer-cols" aria-label="Footer">
          <div><h2>Product</h2><a href="/#ways">How it works</a><a href="/#try">Try the dial</a><a href="/formats/">Formats</a><a href="/#download">Download</a></div>
          <div><h2>Support</h2><a href="/help/">Help</a><a href="/changelog/">What&apos;s new</a><a href={RELEASES}>All versions</a></div>
          <div><h2>About</h2><a href="/privacy/">Privacy</a><a href="https://github.com/Halodial">GitHub</a></div>
        </nav>
        <p className="footer-legal">© 2026 Sarthak Kamble. All rights reserved.</p>
      </div>
    </footer>
  );
}
