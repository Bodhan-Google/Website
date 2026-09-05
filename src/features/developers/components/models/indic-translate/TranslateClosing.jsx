import { ArrowUpRight } from 'lucide-react';
import { CLOSING } from './translateData';

/**
 * The close. The known-limits list is here on purpose: the examples above are
 * each a language's best recorded output, and a page that shows only that owes
 * the reader the other half.
 */
const TranslateClosing = () => (
    <section className="itr-section itr-closing" id="get">
        <div className="itr-container itr-closing-grid">
            <div className="itr-reveal">
                <p className="itr-eyebrow">Get the model</p>
                <h2 className="itr-h2">{CLOSING.heading}</h2>
                <p className="itr-lede itr-lede-left">{CLOSING.body}</p>

                <div className="itr-hero-actions">
                    {CLOSING.links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className={`itr-btn ${link.primary ? 'itr-btn-primary' : 'itr-btn-ghost'}`}
                            {...(link.href.startsWith('http')
                                ? { target: '_blank', rel: 'noreferrer noopener' }
                                : {})}
                        >
                            {link.label}
                            <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                    ))}
                </div>

                <p className="itr-eco">
                    <span>Available across</span>
                    {CLOSING.ecosystem.map((name) => (
                        <em key={name}>{name}</em>
                    ))}
                </p>
            </div>

            <aside className="itr-limits itr-reveal">
                <h3 className="itr-h3">Known limits, today</h3>
                <ul>
                    {CLOSING.known.map((line) => (
                        <li key={line}>{line}</li>
                    ))}
                </ul>
            </aside>
        </div>
    </section>
);

export default TranslateClosing;
