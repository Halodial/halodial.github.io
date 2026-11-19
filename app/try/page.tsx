import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import Desktop from '@/components/Desktop';
import Playground from '@/components/Playground';
import { DownloadIcon } from '@/components/Icon';
import { DMG } from '@/components/Footer';

export const metadata: Metadata = { title: 'Try it', description: 'Try Halodial in your browser: drag files on a pretend Mac desktop, open the dial, shake a file onto a shelf.' };

export default function Try() {
  return (
    <>
      <PageHead title="Try it here." lede="Everything below works like the app, with the same click as you move round the dial. Nothing here touches your files." />

      <section className="section tight" id="desktop">
        <div className="wrap">
          <h2 className="sub-title" data-split>On a desktop. <span className="soft">Drag, hold, shake.</span></h2>
          <p className="lede">Drag a file and hold <kbd>⌘</kbd>: the dial opens under it. Let go on a slot, or rest on one with options to open it. Shake a file while dragging and a shelf appears; drop files on it and take them out together.</p>
          <Desktop />
        </div>
      </section>

      <section className="section tight" id="dial">
        <div className="wrap">
          <h2 className="sub-title" data-split>Every dial. <span className="soft">Every kind of file.</span></h2>
          <p className="lede">The launcher and each kind of file&apos;s own options, as Halodial ships them. Move round with the pointer or the arrow keys.</p>
          <Playground />
        </div>
      </section>

      <section className="section tight try-end">
        <div className="wrap">
          <h2 className="section-title" data-split>Now on your Mac. <span className="soft">Free during early access.</span></h2>
          <div className="cta"><a className="btn" href={DMG}><DownloadIcon />Download for Mac</a><a className="btn ghost" href="/#download">Other ways to install</a></div>
        </div>
      </section>
    </>
  );
}
