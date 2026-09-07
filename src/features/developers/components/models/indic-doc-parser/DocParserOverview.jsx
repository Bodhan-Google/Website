import { PIPELINE } from './docParserData';

/**
 * The short version of how the model works, before the demo shows it happening.
 * The connector between the four stages is an SVG line the page draws as you
 * scroll past it, so the pipeline reads left to right in time as well as space.
 */
const DocParserOverview = () => (
    <section className="idp-section idp-overview" id="how">
        <div className="idp-container">
            <header className="idp-head idp-reveal">
                <p className="idp-eyebrow">How it works</p>
                <h2 className="idp-h2">
                    Two models, in <span className="idp-grad">sequence</span>.
                </h2>
                <p className="idp-lede">
                    Most OCR flattens a page into a stream of characters and loses the argument the layout was making.
                    IndicDocParser keeps the structure first and reads second — so a footnote stays a footnote and a
                    derivation stays in order.
                </p>
            </header>

            <ol className="idp-pipeline">
                <svg className="idp-pipeline-line" viewBox="0 0 1000 4" preserveAspectRatio="none" aria-hidden="true">
                    <line x1="0" y1="2" x2="1000" y2="2" />
                </svg>

                {PIPELINE.map((stage) => (
                    <li key={stage.id} className="idp-stage-card" data-tone={stage.tone}>
                        <span className="idp-stage-step">{stage.step}</span>
                        <h3>{stage.title}</h3>
                        <p>{stage.detail}</p>
                    </li>
                ))}
            </ol>
        </div>
    </section>
);

export default DocParserOverview;
