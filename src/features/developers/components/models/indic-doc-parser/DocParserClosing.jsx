import { ArrowUpRight, Crosshair, Languages, ListOrdered, PenLine, Sigma, Table2 } from 'lucide-react';
import { CAPABILITIES } from './docParserData';

const ICONS = {
    languages: Languages,
    pen: PenLine,
    sigma: Sigma,
    table: Table2,
    order: ListOrdered,
    target: Crosshair,
};

const DocParserClosing = () => (
    <section className="idp-section idp-closing" id="capabilities">
        <div className="idp-container">
            <header className="idp-head idp-reveal">
                <p className="idp-eyebrow">What it handles</p>
                <h2 className="idp-h2">
                    Built for the pages India <span className="idp-grad">actually has</span>.
                </h2>
                <p className="idp-lede">
                    Library scans with foxed margins, exam scripts in ballpoint, government forms photographed on a
                    phone at an angle — the awkward majority, not the clean minority.
                </p>
            </header>

            <div className="idp-cap-grid">
                {CAPABILITIES.map((cap) => {
                    const Icon = ICONS[cap.icon] ?? Crosshair;
                    return (
                        <article key={cap.id} className="idp-cap">
                            <span className="idp-cap-icon">
                                <Icon size={17} aria-hidden="true" />
                            </span>
                            <h3>{cap.title}</h3>
                            <p>{cap.detail}</p>
                        </article>
                    );
                })}
            </div>

            <div className="idp-cta idp-reveal">
                <div>
                    <h3>Put it against your own archive.</h3>
                    <p>Weights and inference notes are on the Hub. Tell us what your pages look like and we will tell you honestly whether it will hold.</p>
                </div>
                <div className="idp-cta-actions">
                    <a
                        className="idp-btn idp-btn-primary"
                        href="https://huggingface.co/bodhan-ai/models"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Hugging Face
                        <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                    <a className="idp-btn idp-btn-ghost" href="/contact">
                        Talk to the team
                    </a>
                </div>
            </div>
        </div>
    </section>
);

export default DocParserClosing;
