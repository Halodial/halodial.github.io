import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import { RELEASES } from '@/components/Footer';

export const metadata: Metadata = { title: "What's new", description: 'Every Halodial release and what changed.' };

// Newest first. Matches the release notes on GitHub (Halodial/releases).
const RELEASE_LIST: [version: string, date: string, items: string[]][] = [
  ['1.2.0', '20 November 2026', [
    'Capture: press ⇧⌘2, then drag an area, click a window or press Space for the whole screen. A magnifier shows the pixels and colour under the pointer; Tab copies the colour.',
    'The capture card: Copy, Save, Edit, Text (reads the words in the capture on your Mac) and Pin (floats it above everything). Drag it into any app.',
    'The editor: arrows, text, a ruler that snaps to edges, boxes, ovals, lines, pen, highlighter, numbered steps, blur, spotlight, a magnifier, and a backdrop with your own picture.',
    'Settings > Capture: save folder, sorting by month or app, PNG or JPEG, what happens after a capture, and the editor\'s first tool and colour.',
    'Capture meets the dial: hold ⌘ on the capture card to convert, compress or share it with the file dial. The launcher\'s Capture ring has Area, Screen, In 3 Seconds, Text Only and Last Capture. Hold ⌥ and tap with three fingers to capture.',
    'If another app already uses a Halodial shortcut, Halodial now says so and offers a free one.',
  ]],
  ['1.1.0', '20 November 2026', [
    'Trackpad edges: hold Control and slide one finger up or down the right edge of the trackpad for volume, the left edge for brightness. The dial opens under your pointer and follows your finger.',
    'Turn it on in Settings > Trackpad edges. Pick another key, or none, and which side is volume.',
  ]],
  ['1.0.3', '20 November 2026', [
    'Fixed: the dial click sound going quiet when you connect earbuds, headphones or AirPlay, or switch the sound output.',
    'New icons across the dial: Mission Control, Desktop, Display Off, Night Shift, keyboard light, Dark Mode, Screenshot, AirDrop, earbuds and more.',
    'Music: Play and Pause are one button that shows what it will do.',
    'Clearer names in the Edit ring: Open editor for images, Open in Preview for PDFs.',
  ]],
  ['1.0.2', '19 November 2026', ['Fixed: the dial click sound stopping after the Mac sleeps or the sound output changes.']],
  ['1.0.1', '19 November 2026', ['Show Halodial in the Dock too, if you like (Settings > General). Clicking the Dock icon opens Settings.']],
  ['1.0.0', '18 November 2026', [
    'File dial: hold ⌘ while dragging to convert, edit, share or file.',
    'Shelf: shake a file while dragging to park it.',
    'Launcher: tap with four fingers for volume, music, display and system controls.',
    'Image editor and video and audio trimmer.',
    'Quality settings per format, Undo on every result, automatic updates.',
  ]],
];

export default function Changelog() {
  return (
    <>
      <PageHead title="What's new." lede={<>Halodial updates itself, so you&apos;re usually on the newest version already. Choose Check for Updates in the menu bar to make sure.</>} />
      <section className="section tight">
        <div className="wrap">
          <ol className="timeline" data-rise>
            {RELEASE_LIST.map(([v, date, items], i) => (
              <li key={v} className={i === 0 ? 'latest' : ''}>
                <div className="tl-meta"><span className="tl-version">{v}</span><time>{date}</time>{i === 0 && <span className="tag">Latest</span>}</div>
                <ul>{items.map(t => <li key={t}>{t}</li>)}</ul>
              </li>
            ))}
          </ol>
          <a className="btn ghost" href={RELEASES}>Downloads for every version</a>
        </div>
      </section>
    </>
  );
}
