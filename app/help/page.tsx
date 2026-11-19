import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import Keyboard from '@/components/Keyboard';

export const metadata: Metadata = { title: 'Help', description: 'Shortcuts, installing, permissions, updates and removing Halodial.' };

const KEYS: [keys: React.ReactNode, does: string][] = [
  [<>Hold <kbd>⌘</kbd> while dragging a file</>, 'Opens the file dial under the pointer: File, Convert, Edit, Share.'],
  [<>Shake a file while dragging</>, 'Opens a new shelf beside it.'],
  [<>Tap with four fingers</>, 'Opens the launcher. Switch to three fingers in Settings.'],
  [<><kbd>⌥⌘Space</kbd></>, 'Opens the launcher from the keyboard.'],
  [<><kbd>⌥⌘C</kbd></>, 'Opens the file dial for the files selected in Finder.'],
  [<><kbd>⌥⌘S</kbd></>, 'Opens a new, empty shelf.'],
];

const FAQ: [q: string, a: React.ReactNode][] = [
  ['What do I need to run Halodial?', 'A Mac with Apple silicon running macOS 14 Sonoma or later.'],
  ['macOS says Apple could not verify Halodial.', <>Halodial isn&apos;t notarized by Apple yet. Click Done, then open System Settings, go to Privacy &amp; Security, scroll down and click Open Anyway next to Halodial. You only do this once. The one-line install and Homebrew skip this step.</>],
  ['Does Halodial need any permissions?', <>Not for the dial, the shelf or the launcher. macOS asks once if you use <kbd>⌥⌘C</kbd> (so Halodial can read Finder&apos;s selection) or the Dark Mode switch in the launcher.</>],
  ['The four-finger tap stopped working.', <>Taps are read through a part of macOS without a public interface, so a macOS update can break them. <kbd>⌥⌘Space</kbd> always opens the launcher, and an update to Halodial will follow.</>],
  ["I can't hear the click.", 'Check that Click sound is on in Settings > General and that your Mac isn\'t muted. If the sound stopped after your Mac slept or you connected earbuds or headphones, update to 1.0.3 or later.'],
  ['How do I update?', <>Halodial checks once a day and installs new versions when you quit it. To check now, choose Check for Updates in the menu bar. With Homebrew, run <code>brew upgrade halodial</code>.</>],
  ['Can I convert from Terminal?', <>Yes. The <code>halodial</code> command inside the app runs any conversion or recipe: <code>halodial list photo.png</code> shows what can be done to a file, <code>halodial run image.to.webp *.png</code> runs one.</>],
  ['How do I remove Halodial?', <>Quit it from the menu bar and drag it from Applications to the Trash. To remove its settings too, delete <code>~/Library/Preferences/com.sarthak102.halodial.plist</code> and <code>~/Library/Logs/Halodial.log</code>. With Homebrew, <code>brew uninstall --zap --cask halodial</code> does all of it.</>],
];

export default function Help() {
  return (
    <>
      <PageHead title="Help." lede="Shortcuts, installing, permissions, updates, and removing Halodial if you need to." />
      <section className="section tight">
        <div className="wrap">
          <h2 className="sub-title" data-split>Shortcuts</h2>
          <Keyboard />
          <dl className="keys" data-rise>
            {KEYS.map(([k, d], i) => <div key={i}><dt>{k}</dt><dd>{d}</dd></div>)}
          </dl>
          <p className="note">Every key can be changed in Settings.</p>

          <h2 className="sub-title" data-split>Questions</h2>
          <div className="faq" data-rise>
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}<span className="faq-plus" aria-hidden="true" /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
          <p className="note">Something else? Open an issue on <a href="https://github.com/Halodial/releases/issues">GitHub</a>.</p>
        </div>
      </section>
    </>
  );
}
