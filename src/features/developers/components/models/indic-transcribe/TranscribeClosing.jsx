import { ArrowUpRight, Languages, Music, Radio, Shuffle, Type, Zap } from 'lucide-react';
import { CAPABILITIES } from './transcribeData';

const ICONS = {
    languages: Languages,
    shuffle: Shuffle,
    zap: Zap,
    type: Type,
    radio: Radio,
    music: Music,
};

const TranscribeClosing = () => (
    <section className="itx-section itx-closing" id="capabilities">
        <div className="itx-container">
            <header className="itx-head itx-reveal">
                <p className="itx-eyebrow">What it handles</p>
                <h2 className="itx-h2">
                    Built for how India <span className="itx-grad">actually talks</span>.
                </h2>
                <p className="itx-lede">
                    Two languages in one sentence, a fan overhead, a phone held at arm's length, a word borrowed from
                    English and bent into Gujarati grammar. That is the normal case, not the edge case.
                </p>
            </header>

            <div className="itx-cap-grid">
                {CAPABILITIES.map((cap) => {
                    const Icon = ICONS[cap.icon] ?? Languages;
                    return (
                        <article key={cap.id} className="itx-cap">
                            <span className="itx-cap-icon">
                                <Icon size={17} aria-hidden="true" />
                            </span>
                            <h3>{cap.title}</h3>
                            <p>{cap.detail}</p>
                        </article>
                    );
                })}
            </div>

            <div className="itx-cta itx-reveal">
                <div>
                    <h3>Run it on your own audio.</h3>
                    <p>
                        Weights and inference notes are on the Hub. Tell us what your recordings sound like — the
                        languages, the rooms, the mics — and we will tell you honestly where it holds.
                    </p>
                </div>
                <div className="itx-cta-actions">
                    <a
                        className="itx-btn itx-btn-primary"
                        href="https://huggingface.co/bodhan-ai/models"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Hugging Face
                        <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                    <a className="itx-btn itx-btn-ghost" href="/contact">
                        Talk to the team
                    </a>
                </div>
            </div>
        </div>
    </section>
);

export default TranscribeClosing;
