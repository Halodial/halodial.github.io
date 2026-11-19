import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';

export const metadata: Metadata = { title: 'Privacy', description: 'What Halodial and this website do, and do not do, with your data.' };

export default function Privacy() {
  return (
    <>
      <PageHead title="Your files stay on your Mac." lede="Halodial has no account, no servers of its own and no analytics. Here is everything it connects to, and why." />
      <section className="section tight">
        <div className="wrap"><div className="prose" data-rise>
          <h2>The app</h2>
          <p>Every conversion, edit and shelf happens on your Mac, using the encoders built into macOS and into Halodial. Your files are never uploaded, and nothing records what you do with them.</p>
          <p>Once a day Halodial checks GitHub for a new version, by downloading a small update feed from the Halodial releases page. Updates are signed, and Halodial checks the signature before installing one. You can turn the daily check off in Settings and use Check for Updates in the menu bar instead.</p>
          <p>Your settings stay in Halodial&apos;s preferences on your Mac. Halodial keeps a short log of its own errors in your Library&apos;s Logs folder, which never leaves your Mac.</p>

          <h2>Permissions</h2>
          <p>The dial, the shelf and the launcher need no permissions. macOS asks once if you use the shortcut that opens the dial for the files selected in Finder (so Halodial can read the selection), or the Dark Mode switch in the launcher.</p>

          <h2>This website</h2>
          <p>This site has no analytics, no cookies and no trackers, and its fonts are served from the site itself. It is hosted on GitHub Pages, and downloads come from GitHub, which keeps its own server logs under GitHub&apos;s privacy statement.</p>

          <h2>Questions</h2>
          <p>Open an issue on <a href="https://github.com/Halodial/releases/issues">GitHub</a>.</p>
          <p className="note">Last updated 19 November 2026.</p>
        </div></div>
      </section>
    </>
  );
}
