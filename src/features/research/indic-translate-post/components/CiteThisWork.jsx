import { useState } from 'react';
import Reveal from './Reveal';

/**
 * The BibTeX entry, with a copy button.
 *
 * `navigator.clipboard` is unavailable on insecure origins and can be refused, so the
 * button reports what actually happened rather than assuming success.
 */
const CiteThisWork = ({ heading, bibtex, temporary }) => {
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
        <div className="cite-head">
          <h2 id="cite-heading" className="research-type-h3">
            {heading}
          </h2>
          <button type="button" className="cite-copy" onClick={copy}>
            {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy BibTeX'}
          </button>
        </div>
        {temporary && (
          <p className="temp-copy">
            <span className="temp-badge">placeholder</span>
            Title, URL and key are not final.
          </p>
        )}
        <pre className="cite-bibtex">{bibtex}</pre>
        <p aria-live="polite" className="sr-only">
          {state === 'copied' ? 'BibTeX copied to clipboard' : ''}
          {state === 'failed' ? 'Could not copy; select the text instead' : ''}
        </p>
      </section>
    </Reveal>
  );
};

export default CiteThisWork;
