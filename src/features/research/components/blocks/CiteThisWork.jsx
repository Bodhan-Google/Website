import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * The section that closes every post: the licence the model is released under,
 * then the BibTeX entry.
 *
 * Both belong together and both belong in one place, so a reader always finds
 * them in the same spot at the end of an announcement. The licence names the
 * site's own page rather than a copy of the text in a model repository.
 *
 * Copying is the only thing anyone does with a citation, so the button is the
 * primary affordance and the entry is selectable text underneath it rather than
 * an image of one.
 */
const LICENSE = { name: 'Indic Open Model License v1.0', to: '/indic-open-model-license/v1' };

const CiteThisWork = ({ heading = 'License and citation', bibtex, license = LICENSE }) => {
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
            </div>
            {license && (
                <p className="cite-license">
                    Released under the <Link to={license.to}>{license.name}</Link>.
                </p>
            )}
            <h4 className="cite-subheading">Cite this work</h4>
            {/* The button sits on the block it copies, not in the section header
                a screen above it. */}
            <div className="cite-code">
                <button type="button" className="cite-copy" onClick={copy}>
                    {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                    {copied ? 'Copied' : 'Copy BibTeX'}
                </button>
                <pre className="cite-bibtex">
                    <code>{bibtex}</code>
                </pre>
            </div>
        </section>
    );
};

export default CiteThisWork;
