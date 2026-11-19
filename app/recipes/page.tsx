import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import FileIcon from '@/components/FileIcon';
import { RECIPES } from '@/lib/content';

export const metadata: Metadata = { title: 'Recipes', description: 'Recipes chain several Halodial steps into one choice on the dial. The two that come with it, and ideas to build.' };

export default function Recipes() {
  return (
    <>
      <PageHead title="Recipes." lede="A recipe chains steps into one choice on the dial. Only the result stays; the steps in between are cleaned up. Two come with Halodial; build the rest in Settings > Recipes, in a few clicks." />
      <section className="section tight">
        <div className="wrap">
          <ul className="recipes" data-rise>
            {RECIPES.map(r => (
              <li key={r.name} className="recipe">
                <div className="recipe-flow" aria-hidden="true">
                  <span className="rf-file"><FileIcon name={r.file} size={44} /><small>{r.file}</small></span>
                  <span className="rf-steps">{r.steps.map(s => <span key={s} className="rf-step">{s}</span>)}</span>
                  <span className="rf-file out"><FileIcon name={r.out} size={44} /><small>{r.out}</small></span>
                </div>
                <div className="recipe-meta">
                  <div><h2>{r.name}</h2><p>{r.text}</p></div>
                  <span className={`tag${r.builtIn ? '' : ' idea'}`}>{r.builtIn ? 'Comes with Halodial' : r.kind}</span>
                </div>
                <p className="sr">Steps: {r.steps.join(', then ')}. {r.file} becomes {r.out}.</p>
              </li>
            ))}
          </ul>
          <p className="note">Recipes run from the dial, or from Terminal: <code>halodial recipe &quot;Web image&quot; hero.jpg</code>.</p>
        </div>
      </section>
    </>
  );
}
