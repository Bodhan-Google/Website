import { useState } from 'react';
import Reveal from './Reveal';

/**
 * The licence line and the BibTeX entry, in the shape the IndicOCR post uses:
 * "Cite this work" as the heading, the licence under it, then the BibTeX inside a
 * code card whose head carries the language tag and the copy button. There is no
 * outer bordered block -- the card is the only boxed thing on the section.
 *
 * `navigator.clipboard` is unavailable on insecure origins and can be refused, so the
 * button reports what actually happened rather than assuming success.
 */
const CiteThisWork = ({ bibtex, license, heading = 'Cite this work' }) => {
  const [state, setState] = useState('idle');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bibtex);
      setState('copied');
    } catch {
      setState('failed');
    }
    setTimeout(() => setState('idle'), 2200);
  };

  return (
    <Reveal>
      <section className="cite-block" aria-labelledby="cite-heading">
        <h2 id="cite-heading" className="research-type-h3 cite-heading">
          {heading}
        </h2>
        {license && (
          <p className="cite-license">
            {license.text}{' '}
            <a href={license.href} target="_blank" rel="noopener noreferrer">
              {license.name}
            </a>
            .
          </p>
        )}
        <div className="cite-card">
          <div className="cite-card-head">
            <span className="cite-lang">bibtex</span>
            <button type="button" className="cite-copy" onClick={copy}>
              {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy BibTeX'}
            </button>
          </div>
          <pre className="cite-bibtex">{bibtex}</pre>
        </div>
        <p aria-live="polite" className="sr-only">
          {state === 'copied' ? 'BibTeX copied to clipboard' : ''}
          {state === 'failed' ? 'Could not copy; select the text instead' : ''}
        </p>
      </section>
    </Reveal>
  );
};

export default CiteThisWork;
