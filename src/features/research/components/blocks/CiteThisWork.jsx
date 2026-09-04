import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * The BibTeX block that closes a publication.
 *
 * Copying is the only thing anyone does with a citation, so the button is the
 * primary affordance and the entry is selectable text underneath it rather than
 * an image of one.
 */
const CiteThisWork = ({ heading = 'Cite this work', bibtex }) => {
    const [copied, setCopied] = useState(false);

    if (!bibtex) return null;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(bibtex);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard access can be refused; the text is selectable either way.
            setCopied(false);
        }
    };

    return (
        <section className="cite-block" aria-label={heading}>
            <div className="cite-head">
                <h3 className="cite-title">{heading}</h3>
                <button type="button" className="cite-copy" onClick={copy}>
                    {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                    {copied ? 'Copied' : 'Copy BibTeX'}
                </button>
            </div>
            <pre className="cite-bibtex">
                <code>{bibtex}</code>
            </pre>
        </section>
    );
};

export default CiteThisWork;
