import { ArrowUpRight } from 'lucide-react';
import { CAPABILITIES, LANGUAGES, SCRIPTS, SPEC_STRIP } from './translateData';

/**
 * The short version, before the demo shows it happening: what the model is,
 * what the one prompt shape covers, and how far the coverage reaches.
 *
 * The capability cards are the demo's table of contents — each one jumps
 * straight to its own mode with its own animation waiting.
 */
const TranslateOverview = ({ onPickCapability }) => (
    <section className="itr-section itr-overview" id="how">
        <div className="itr-container">
            <header className="itr-head itr-reveal">
                <p className="itr-eyebrow">The model</p>
                <h2 className="itr-h2">
                    One model, one <span className="itr-grad">prompt shape</span>.
                </h2>
                <p className="itr-lede">
                    Indic-Translate is a translation-specialised fine-tune of Gemma 4 E4B IT, trained on a single
                    task: given an instruction and a piece of source text, produce the translation and nothing else.
                    Five capabilities come out of that one task — and the whole thing runs at 4B effective
                    parameters.
                </p>
            </header>

            <dl className="itr-spec-strip itr-reveal">
                {SPEC_STRIP.map((spec) => (
                    <div key={spec.label} className="itr-spec">
                        <dt>{spec.label}</dt>
                        <dd>
                            {spec.value}
                            {spec.note ? <span className="itr-spec-note">{spec.note}</span> : null}
                        </dd>
                    </div>
                ))}
            </dl>

            <ul className="itr-cap-grid">
                {CAPABILITIES.map((cap) => (
                    <li key={cap.id} className="itr-cap" data-tone={cap.tone}>
                        <button type="button" className="itr-cap-btn" onClick={() => onPickCapability?.(cap.demo)}>
                            <span className="itr-cap-tag">{cap.tag}</span>
                            <span className="itr-cap-title">
                                {cap.title}
                                <ArrowUpRight size={14} aria-hidden="true" />
                            </span>
                            <span className="itr-cap-detail">{cap.detail}</span>
                            <span className="itr-cap-cue">Watch it →</span>
                        </button>
                    </li>
                ))}
            </ul>

            <div className="itr-coverage itr-reveal">
                <div className="itr-coverage-head">
                    <h3 className="itr-h3">Every language in the Eighth Schedule, in its own script</h3>
                    <p>
                        Twenty-two languages across twelve scripts. Nine of them share Devanagari, which is why the
                        markers below carry initials rather than script names.
                    </p>
                </div>

                <ul className="itr-lang-grid" aria-label="Supported languages">
                    {LANGUAGES.map((lang) => (
                        <li key={lang.name} className="itr-lang-chip">
                            <span className="itr-lang-glyph" lang={lang.code}>
                                {lang.glyph}
                            </span>
                            <span className="itr-lang-text">
                                <b>{lang.name}</b>
                                <i lang={lang.code}>{lang.native}</i>
                            </span>
                        </li>
                    ))}
                </ul>

                <p className="itr-script-list">
                    <span>Scripts</span>
                    {SCRIPTS.map((script) => (
                        <em key={script}>{script}</em>
                    ))}
                </p>
            </div>
        </div>
    </section>
);

export default TranslateOverview;
