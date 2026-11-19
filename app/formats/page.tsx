import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import { FORMATS } from '@/lib/content';

export const metadata: Metadata = { title: 'Formats', description: 'Every format Halodial converts, and what it can edit for each kind of file.' };

const tags = (s: string, off = false) => s.split(' ').filter(Boolean).map(t => <span key={t} className={off ? 'off' : ''}>{t}</span>);

export default function Formats() {
  return (
    <>
      <PageHead title="Every format, on your Mac." lede="The common formats are on the dial from the start. Everything else is one switch away in Settings, so the dial stays short." />
      <section className="section tight">
        <div className="wrap">
          <div className="scroll">
            <table className="formats">
              <thead><tr><th scope="col">Files</th><th scope="col">Convert to</th><th scope="col">Edit</th></tr></thead>
              <tbody data-rise>
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
          <p className="note">Dimmed formats start switched off; turn them on in Settings and they join the dial.</p>

          <div className="cards" data-rise>
            <div className="card">
              <h2>New files sit next to the original</h2>
              <p>Halodial never overwrites anything. Converting photo.jpg to PNG gives you photo.png beside it; if that name is taken, photo 2.png.</p>
            </div>
            <div className="card">
              <h2>Office files use LibreOffice</h2>
              <p>Word, Excel, PowerPoint, Pages, Numbers and Keynote files are converted with LibreOffice, which is free and installs with one command. Halodial tells you when it&apos;s needed.</p>
            </div>
            <div className="card">
              <h2>Quality is yours to set</h2>
              <p>Choose JPEG, HEIC, AVIF and WebP quality, video size and quality, and audio bitrate per format in Settings. Hovering a picture format shows the size it will come out at.</p>
            </div>
            <div className="card">
              <h2>Chain them into recipes</h2>
              <p>Put steps together, like resize to 1920px then WebP, and they become one choice on the dial. Only the result stays; the steps in between are cleaned up.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
