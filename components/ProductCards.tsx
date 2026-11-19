import Dial from './Dial';
import Shelf from './Shelf';
import FileIcon from './FileIcon';

const FOUR = [{ label: 'File', icon: 'folder' }, { label: 'Convert', icon: 'repeat' }, { label: 'Edit', icon: 'sliders' }, { label: 'Share', icon: 'share' }];
const LAUNCHER = [{ label: 'Volume', icon: 'volume' }, { label: 'Music', icon: 'music' }, { label: 'System', icon: 'laptop' }, { label: 'Display', icon: 'monitor' }, { label: 'Safari', icon: 'compass' }];

/** The three ways in as big product shots, Craftwork style: a stage per way, the name and how to open it underneath. */
export default function ProductCards() {
  return (
    <div className="products">
      <article className="product wide">
        <div className="product-stage stage-dial" aria-hidden="true">
          <Dial slots={FOUR} lit={1} name="Convert" sub="Click or hold to open" />
          <span className="pc-drag"><FileIcon name="photo.heic" size={58} /><svg className="cursor" viewBox="0 0 24 24"><path d="M5 3l14 8.5-6.2 1.4L10 19z" /></svg></span>
          <kbd className="pc-key">⌘</kbd>
        </div>
        <div className="product-meta">
          <div><h3>The file dial</h3><p>File, Convert, Edit and Share, under the file you&apos;re dragging. Press the key before or after you start; record any keys you like.</p></div>
          <span className="how">Hold <kbd>⌘</kbd> while dragging</span>
        </div>
      </article>

      <article className="product">
        <div className="product-stage stage-shelf" aria-hidden="true">
          <span className="pc-shake"><FileIcon name="report.pdf" size={52} /></span>
          <Shelf title="Trip photos" />
        </div>
        <div className="product-meta">
          <div><h3>The shelf</h3><p>Somewhere to put things down. Collect files from anywhere, drag them all out together, pin a shelf to the screen edge, or let it watch Downloads.</p></div>
          <span className="how">Shake a file</span>
        </div>
      </article>

      <article className="product">
        <div className="product-stage stage-launch" aria-hidden="true">
          <Dial slots={LAUNCHER} lit={0} name="Volume" sub="64%" level={0.64} />
          <span className="fingers"><i /><i /><i /><i /></span>
        </div>
        <div className="product-meta">
          <div><h3>The launcher</h3><p>Volume, music, display and system controls, your apps and folders. Three fingers if you prefer.</p></div>
          <span className="how">Tap with four fingers, or <kbd>⌥⌘Space</kbd></span>
        </div>
      </article>
    </div>
  );
}
