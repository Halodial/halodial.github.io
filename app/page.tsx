import HeroDial from '@/components/HeroDial';
import WaysIn from '@/components/WaysIn';
import Playground from '@/components/Playground';
import Shelf from '@/components/Shelf';
import PrivateRing from '@/components/PrivateRing';
import CopyCommand from '@/components/CopyCommand';
import Icon, { DownloadIcon } from '@/components/Icon';
import { DMG, RELEASES } from '@/components/Footer';
import { ALL_FORMATS, FEATURES } from '@/lib/content';

export default function Home() {
  const half = Math.ceil(ALL_FORMATS.length / 2);
  return (
    <>
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="hero-kicker">A dial for your Mac</p>
          <h1>Everything you do with a file, one flick away.</h1>
          <p className="lede">Halodial opens under your pointer. Drag a file, hold <kbd>⌘</kbd>, and convert, edit, share or file it without opening another app.</p>
          <div className="cta">
            <a className="btn" href={DMG}><DownloadIcon />Download for Mac</a>
            <a className="btn ghost" href="#try">Try the dial</a>
          </div>
          <p className="meta">Free during early access. Apple silicon, macOS 14 or later.</p>
        </div>
        <HeroDial />
      </section>

      <section id="ways" className="section">
        <div className="wrap">
          <h2 className="section-title" data-split>Three ways in. No windows to open.</h2>
          <p className="lede">Halodial lives in your menu bar and waits. It appears where your pointer already is, and goes away the moment you&apos;ve chosen.</p>
          <WaysIn />
        </div>
      </section>

      <section id="try" className="section try">
        <div className="wrap">
          <div className="try-head">
            <h2 className="section-title" data-split>Try the dial.</h2>
            <p className="lede">This is the real dial, with the options Halodial gives each kind of file, and the same soft click as you move round it. Pick a file and have a go.</p>
          </div>
          <Playground />
        </div>
      </section>

      <section id="features" className="section">
        <div className="wrap features">
          <div className="features-head">
            <h2 className="section-title" data-split>Small tools, kept where your hands are.</h2>
          </div>
          <ul className="ledger" data-rise data-draw>
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
            <h2 className="section-title" data-split>Somewhere to put things down.</h2>
            <p className="lede">Moving files between folders, apps and Spaces usually means juggling windows. Shake the file instead, and come back for it when you&apos;re ready.</p>
            <ul className="points" data-rise>
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

      <section id="formats" className="section formats-teaser">
        <div className="wrap">
          <h2 className="section-title" data-split>The formats you actually use.</h2>
          <p className="lede">Pictures, video, audio, PDFs, documents, spreadsheets, slides and archives. The common ones are on the dial from the start; everything else is one switch away.</p>
        </div>
        <div className="strip" aria-hidden="true">
          {[ALL_FORMATS.slice(0, half), ALL_FORMATS.slice(half)].map((row, i) => (
            <div key={i} className={`strip-row${i ? ' reverse' : ''}`}>
              {[...row, ...row].map((f, j) => <span key={j}>{f}</span>)}
            </div>
          ))}
        </div>
        <div className="wrap"><a className="btn ghost" href="/formats/">See every format</a></div>
      </section>

      <section className="section private">
        <div className="wrap">
          <PrivateRing>
            <h2>Your files never leave your Mac.</h2>
            <p className="lede">Every conversion runs on your Mac, using the encoders built into macOS and into Halodial. There&apos;s nothing to sign in to and nothing that watches what you do.</p>
            <ul className="facts"><li>No account</li><li>No uploads</li><li>No tracking</li><li>Works offline</li></ul>
            <a className="text-link" href="/privacy/">Read the privacy page</a>
          </PrivateRing>
        </div>
      </section>

      <section className="section download" id="download">
        <div className="wrap split">
          <div>
            <div className="app-mark" aria-hidden="true">
              <span className="app-orbit" />
              <img className="app-icon" src="/assets/icon-256.png" alt="" width={96} height={96} />
            </div>
            <h2 className="section-title" data-split>Free during early access.</h2>
            <p className="lede">For Macs with Apple silicon running macOS 14 Sonoma or later. Halodial keeps itself up to date. The one-line install skips the macOS approval step.</p>
            <div className="cta">
              <a className="btn" href={DMG}><DownloadIcon />Download .dmg</a>
              <a className="btn ghost" href={RELEASES}>All versions</a>
            </div>
          </div>
          <div className="install" data-rise>
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
            <p className="after">Whichever way you choose, a short welcome shows the three ways in. Halodial then waits in the menu bar (and in the Dock, if you turn that on), and updates arrive by themselves. Stuck? See <a href="/help/">Help</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
