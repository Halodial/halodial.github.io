import Dial from './Dial';
import FileIcon from './FileIcon';
import Logo from './Logo';

const FOUR = [{ label: 'File', icon: 'folder' }, { label: 'Convert', icon: 'repeat' }, { label: 'Edit', icon: 'sliders' }, { label: 'Share', icon: 'share' }];

/** The home page's way into /try: the copy, and a tilted little desktop caught mid-gesture
 *  (a photo dragged onto Convert with ⌘ down, a shelf holding a stack, the result coming in). */
export default function TryCard() {
  return (
    <a className="try-card" href="/try/">
      <div className="try-card-copy">
        <h2 className="section-title" data-split>Try it <span className="soft">before you download.</span></h2>
        <p className="lede">A pretend Mac desktop in your browser. Drag a file, hold <kbd>⌘</kbd>, and the real dial opens under it, click sounds and all. Shake a file to get a shelf.</p>
        <ul className="try-points">
          <li>Every kind of file, with its own options</li>
          <li>Results land on the desktop, with Undo</li>
          <li>Works with a trackpad, a mouse or a finger</li>
        </ul>
        <span className="btn">Open the playground</span>
      </div>

      <div className="try-card-art" aria-hidden="true">
        <div className="mini-desk">
          <div className="menubar"><b>Finder</b><span>File</span><span>Edit</span><span>View</span><span className="menubar-end"><Logo size={11} /><span>9:41</span></span></div>
          <Dial slots={FOUR} lit={1} name="Convert" sub="Click or hold to open" />
          <span className="mini-drag"><span className="mini-photo"><img className="photo-img" src="/assets/ocean-thumb.webp" alt="" /></span>
            <svg className="cursor" viewBox="0 0 24 24"><path d="M5 3l14 8.5-6.2 1.4L10 19z" /></svg></span>
          <span className="mini-icons"><FileIcon name="report.pdf" size={34} /><FileIcon name="song.mp3" size={34} /><FileIcon name="budget.xlsx" size={34} /></span>
          <span className="mini-shelf"><span className="mini-shelf-stack"><FileIcon name="clip.mp4" size={30} /><FileIcon name="essay.docx" size={30} /></span><span>2 files</span></span>
          <span className="mini-toast"><b>Saved</b> photo.webp</span>
          <kbd className="mini-key">⌘</kbd>
        </div>
      </div>
    </a>
  );
}
