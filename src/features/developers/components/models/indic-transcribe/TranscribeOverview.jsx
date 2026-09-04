import { PIPELINE } from './transcribeData';

/**
 * How the model gets from a noisy recording to three renderings of the same
 * sentence. The connector between the stages draws itself as you scroll past.
 */
const TranscribeOverview = () => (
    <section className="itx-section itx-overview" id="how">
        <div className="itx-container">
            <header className="itx-head itx-reveal">
                <p className="itx-eyebrow">How it works</p>
                <h2 className="itx-h2">
                    One pass, three <span className="itx-grad">renderings</span>.
                </h2>
                <p className="itx-lede">
                    Most speech recognition asks you to declare the language first and then flattens whatever it hears
                    into one script. Indic-Transcribe works out the language itself, and keeps every word in the script
                    it was actually spoken in.
                </p>
            </header>

            <ol className="itx-pipeline">
                <svg className="itx-pipeline-line" viewBox="0 0 1000 4" preserveAspectRatio="none" aria-hidden="true">
                    <line x1="0" y1="2" x2="1000" y2="2" />
                </svg>

                {PIPELINE.map((stage) => (
                    <li key={stage.id} className="itx-stage-card" data-tone={stage.tone}>
                        <span className="itx-stage-step">{stage.step}</span>
                        <h3>{stage.title}</h3>
                        <p>{stage.detail}</p>
                    </li>
                ))}
            </ol>
        </div>
    </section>
);

export default TranscribeOverview;
