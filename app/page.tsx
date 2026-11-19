import HeroDial from '@/components/HeroDial';
import TryCard from '@/components/TryCard';
import SectionHead from '@/components/SectionHead';
import ProductCards from '@/components/ProductCards';
import Bento from '@/components/Bento';
import AppsDiagram from '@/components/AppsDiagram';
import FileIcon from '@/components/FileIcon';
import PrivateRing from '@/components/PrivateRing';
import CopyCommand from '@/components/CopyCommand';
import { DownloadIcon } from '@/components/Icon';
import { DMG, RELEASES } from '@/components/Footer';
import { ALL_FORMATS, RECIPES } from '@/lib/content';

export default function Home() {
  const half = Math.ceil(ALL_FORMATS.length / 2);
  return (
    <>
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="hero-kicker">A dial for your Mac</p>
          <h1>Everything you do with a file, <span className="soft">one flick away.</span></h1>
          <p className="lede">Halodial opens under your pointer. Drag a file, hold <kbd>⌘</kbd>, and convert, edit, share or file it without opening another app.</p>
          <div className="cta">
            <a className="btn" href={DMG}><DownloadIcon />Download for Mac</a>
            <a className="btn ghost" href="/try/">Try it in your browser</a>
          </div>
          <p className="meta">Free during early access. Apple silicon, macOS 14 or later.</p>
        </div>
        <HeroDial />
      </section>

      <section id="ways" className="section">
        <div className="wrap">
          <SectionHead title="Three ways in." soft="No windows to open." href="/try/" link="Try them" />
          <ProductCards />
        </div>
      </section>

      <section id="try" className="section">
        <div className="wrap">
          <TryCard />
        </div>
      </section>

      <section id="features" className="section">
        <div className="wrap">
          <SectionHead title="Small tools," soft="kept where your hands are." href="/try/" link="Full playground" />
          <Bento />
        </div>
      </section>

      <section id="apps" className="section">
        <div className="wrap">
          <AppsDiagram />
        </div>
      </section>

      <section id="recipes" className="section">
        <div className="wrap">
          <SectionHead title="Recipes." soft="Several steps, one choice." href="/recipes/" link="All recipes" />
          <ul className="recipes three" data-rise>
            {RECIPES.slice(0, 3).map(r => (
              <li key={r.name} className="recipe">
                <div className="recipe-flow" aria-hidden="true">
                  <span className="rf-file"><FileIcon name={r.file} size={40} /></span>
                  <span className="rf-steps">{r.steps.map(st => <span key={st} className="rf-step">{st}</span>)}</span>
                  <span className="rf-file out"><FileIcon name={r.out} size={40} /></span>
                </div>
                <div className="recipe-meta"><div><h3>{r.name}</h3><p>{r.text}</p></div></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="formats" className="section formats-teaser">
        <div className="wrap">
          <SectionHead title="The formats" soft="you actually use." href="/formats/" link="Every format" />
          <p className="lede">Pictures, video, audio, PDFs, documents, spreadsheets, slides and archives. The common ones are on the dial from the start; everything else is one switch away.</p>
        </div>
        <div className="strip" aria-hidden="true">
          {[ALL_FORMATS.slice(0, half), ALL_FORMATS.slice(half)].map((row, i) => (
            <div key={i} className={`strip-row${i ? ' reverse' : ''}`}>
              {[...row, ...row].map((f, j) => <span key={j}>{f}</span>)}
            </div>
          ))}
        </div>
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
            <img className="app-icon" src="/assets/icon-256.png" alt="" width={96} height={96} />
            <h2 className="section-title" data-split>Free during <span className="soft">early access.</span></h2>
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
