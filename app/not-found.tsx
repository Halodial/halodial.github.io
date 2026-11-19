import type { Metadata } from 'next';
import LostDial from '@/components/LostDial';

export const metadata: Metadata = { title: 'Not found', robots: { index: false } };

/** 404: nothing at this address. The dial offers the pages that are. */
export default function NotFound() {
  return (
    <section className="lost">
      <div className="wrap lost-wrap">
        <div className="lost-copy">
          <h1>Nothing at <span className="soft">this address.</span></h1>
          <p className="lede">The page may have moved, or the link has a typo. Pick a page on the dial, or press <kbd>⌘K</kbd> to search.</p>
          <ul className="lost-links">
            <li><a href="/">Home</a></li><li><a href="/try/">Try it</a></li><li><a href="/formats/">Formats</a></li>
            <li><a href="/recipes/">Recipes</a></li><li><a href="/help/">Help</a></li><li><a href="/#download">Download</a></li>
          </ul>
        </div>
        <LostDial />
      </div>
    </section>
  );
}
