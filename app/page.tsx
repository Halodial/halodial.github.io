import HeroDial from '@/components/HeroDial';
import WaysIn from '@/components/WaysIn';
import Shelf from '@/components/Shelf';
import PrivateRing from '@/components/PrivateRing';
import CopyCommand from '@/components/CopyCommand';
import Icon from '@/components/Icon';

const DMG = 'https://github.com/Halodial/releases/releases/latest/download/Halodial.dmg';
const RELEASES = 'https://github.com/Halodial/releases/releases';

const FEATURES: [string, string, string][] = [
  ['corner-up-left', 'Undo, every time', 'Each result comes with Undo. New files go to the Trash, moved files go back where they were.'],
  ['sliders', 'An editor when you need one', 'Crop to a shape, adjust light and colour, add arrows and notes, rotate, resize, add a background, clean the metadata.'],
  ['film', 'Trim to the frame', 'Drag two handles on a strip of frames, press Space to play the cut, save. Video and audio.'],
  ['maximize', 'Quality you choose', 'Set JPEG, HEIC, AVIF and WebP quality, video size and quality, and audio bitrate per format.'],
  ['sparkles', 'Recipes', 'Chain steps into one choice, like resize then WebP, and run it from the dial or the halodial command.'],
  ['grid', 'Your keys, your fingers', 'Record your own shortcuts and wheel keys, and open the launcher with three or four fingers.'],
  ['palette', 'Glass or Solid', 'Two looks for the dial and the shelf, in any highlight colour.'],
  ['repeat', 'Learns your habits', 'The options you pick most for each kind of file move to the front of the dial.'],
];

// [kind, on the dial from the start, switched on in Settings, edit]
const FORMATS: [string, string, string, string][] = [
  ['Pictures', 'AVIF HEIC PNG BMP GIF TIFF PDF', 'JPEG WebP', 'Crop, compress, rotate, resize, remove metadata, make a PDF, collage, the editor'],
  ['Video', 'MP4 MOV GIF MP3 WAV', 'M4V M4A MKV WebM AVI WMV', 'Trim to the frame, compress, audio only, mute, merge'],
  ['Audio', 'M4A CAF ALAC FLAC AIFF MP3', 'WAV OGG Opus WMA', 'Trim, compress, mono, merge'],
  ['PDF', 'DOCX PNG JPEG TXT MD HTML', 'RTF', 'Split, merge, compress, rotate, remove metadata, open in Preview'],
  ['Documents', 'PDF RTF TXT MD HTML ODT DOC', 'EPUB', 'Nothing to edit, so no Edit slot'],
  ['Spreadsheets', 'XLSX CSV TSV JSON PDF', 'ODS', 'Nothing to edit, so no Edit slot'],
  ['Slides', 'PDF PPTX ODP PNG JPEG', '', 'Nothing to edit, so no Edit slot'],
  ['Archives', 'ZIP TAR TAR.GZ', '', 'Extract; anything can be zipped from File'],
];

const tags = (s: string, off = false) => s.split(' ').filter(Boolean).map(t => <span key={t} className={off ? 'off' : ''}>{t}</span>);

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="nav">
        <a className="brand" href="#top" aria-label="Halodial home"><img src="/assets/logo.svg" alt="" width={24} height={24} />halodial</a>
        <nav aria-label="Sections">
          <a href="#ways">How it works</a>
          <a href="#features">Features</a>
          <a href="#formats">Formats</a>
        </nav>
        <a className="btn small" href="#download">Download</a>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="orbits" aria-hidden="true" />
          <div className="hero-copy">
            <p className="hero-kicker">A dial for your Mac</p>
            <h1>Everything you do with a file, one flick away.</h1>
            <p className="lede">Halodial opens under your pointer. Drag a file, hold <kbd>⌘</kbd>, and convert, edit, share or file it without opening another app.</p>
            <div className="cta">
              <a className="btn" href={DMG}><DownloadIcon />Download for Mac</a>
              <a className="btn ghost" href="#ways">See how it works</a>
            </div>
            <p className="meta">Free during early access. Apple silicon, macOS 14 or later.</p>
          </div>
          <HeroDial />
        </section>

        <section id="ways" className="section">
          <div className="wrap">
            <h2 className="section-title">Three ways in.<br />No windows to open.</h2>
            <p className="lede">Halodial lives in your menu bar and waits. It appears where your pointer already is, and goes away the moment you&apos;ve chosen.</p>
            <WaysIn />
          </div>
        </section>

        <section id="features" className="section">
          <div className="wrap features">
            <div className="features-head">
              <h2 className="section-title">Small tools, kept where your hands are.</h2>
            </div>
            <ul className="ledger">
              {FEATURES.map(([icon, title, text]) => (
                <li key={title}>
                  <span className="ledger-icon"><Icon name={icon} /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="shelf" className="section">
          <div className="wrap split">
            <div>
              <h2 className="section-title">Somewhere to put things down.</h2>
              <p className="lede">Moving files between folders, apps and Spaces usually means juggling windows. Shake the file instead, and come back for it when you&apos;re ready.</p>
              <ul className="points">
                <li>Drop files, links, text and images on it; drag them out one at a time or all together.</li>
                <li>Name and colour each shelf, keep several open, reopen your last ten.</li>
                <li>Pin a shelf to the edge of the screen, where it waits as a slim tab.</li>
                <li>Watch a folder like Downloads, and new files land on a shelf by themselves.</li>
              </ul>
            </div>
            <div className="shelf-art">
              <Shelf title="Trip photos" />
              <span className="edge-tab" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section id="formats" className="section">
          <div className="wrap">
            <h2 className="section-title">The formats you actually use.</h2>
            <p className="lede">The common ones are on the dial from the start. Everything else is one switch away in Settings, so the dial stays short.</p>
            <div className="scroll">
              <table className="formats">
                <thead><tr><th scope="col">Files</th><th scope="col">Convert to</th><th scope="col">Edit</th></tr></thead>
                <tbody>
                  {FORMATS.map(([kind, on, off, edit]) => (
                    <tr key={kind}>
                      <th scope="row">{kind}</th>
                      <td className="tags">{tags(on)}{tags(off, true)}</td>
                      <td>{edit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="note">Dimmed formats start switched off. Word, Excel, PowerPoint, Pages, Numbers and Keynote files use LibreOffice, which is free and installs with one command; Halodial tells you when it&apos;s needed.</p>
          </div>
        </section>

        <section className="section private">
          <div className="wrap">
            <PrivateRing>
              <h2>Your files never leave your Mac.</h2>
              <p className="lede">Every conversion runs on your Mac, using the encoders built into macOS and into Halodial. There&apos;s nothing to sign in to and nothing that watches what you do.</p>
              <ul className="facts"><li>No account</li><li>No uploads</li><li>No tracking</li><li>Works offline</li></ul>
            </PrivateRing>
          </div>
        </section>

        <section className="section download" id="download">
          <div className="wrap split">
            <div>
              <img className="app-icon" src="/assets/icon-256.png" alt="Halodial app icon" width={96} height={96} />
              <h2 className="section-title">Free during early access.</h2>
              <p className="lede">For Macs with Apple silicon running macOS 14 Sonoma or later. Halodial keeps itself up to date. The one-line install skips the macOS approval step.</p>
              <div className="cta">
                <a className="btn" href={DMG}><DownloadIcon />Download .dmg</a>
                <a className="btn ghost" href={RELEASES}>All versions</a>
              </div>
            </div>
            <div className="install">
              <div className="opt">
                <div className="opt-head"><h3>Install with one line</h3><span className="tag">No prompts</span></div>
                <p>Paste this into Terminal. It downloads Halodial, checks its signature, puts it in Applications and opens it, with nothing to approve.</p>
                <CopyCommand command="curl -fsSL https://halodial.github.io/install.sh | sh" />
              </div>
              <div className="opt">
                <div className="opt-head"><h3>Or with Homebrew</h3><span className="tag">No prompts</span></div>
                <CopyCommand command="brew tap halodial/tap && brew trust halodial/tap && brew install --cask halodial" />
              </div>
              <details className="opt">
                <summary><h3>Or download the disk image</h3><span className="more">One approval in System Settings</span></summary>
                <ol className="steps">
                  <li><b>Drag Halodial to Applications</b><span>Open Halodial.dmg and drag the Halodial icon onto the Applications folder.</span></li>
                  <li><b>Open it once</b><span>macOS says Apple could not verify Halodial, because Halodial isn&apos;t notarized by Apple yet. Click Done.</span></li>
                  <li><b>Choose Open Anyway</b><span>In System Settings, open Privacy &amp; Security, scroll down and click Open Anyway next to Halodial, then confirm. You only do this once.</span></li>
                </ol>
              </details>
              <p className="after">Whichever way you choose, a short welcome shows the three ways in. Halodial then waits in the menu bar (and in the Dock, if you turn that on), and updates arrive by themselves.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <a className="brand" href="#top"><img src="/assets/logo.svg" alt="" width={22} height={22} />halodial</a>
          <span>© 2026 Sarthak Kamble. All rights reserved.</span>
          <div className="links"><a href="#download">Download</a><a href={RELEASES}>Release notes</a></div>
        </div>
      </footer>
    </>
  );
}
