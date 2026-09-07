import { ArrowUpRight } from 'lucide-react';
import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import TranscribeExamples from './TranscribeExamples';
import DevReveal from '../DevReveal';
import { LICENSE, getModelById } from '../../data/models';
import {
    COVERAGE,
    DESCRIPTION,
    LIMITS,
    MODES,
    SPEC,
    STATS,
} from './indic-transcribe/transcribeModelContent';
import '../../developers.css';

const model = getModelById('indic-transcribe');

const IndicTranscribePage = () => (
    <div className="min-h-screen research-page">
        <Navbar />
        <main
            className="model-page-main"
            style={{ '--model-accent': model.accent, '--model-gradient': model.gradient }}
        >
            <ModelHero
                title={model.name}
                intro="wave"
                tagline={DESCRIPTION}
                accent={model.accent}
                viz={model.viz}
                stats={STATS}
                primaryCta={{ label: 'Hugging Face', href: model.hf }}
                blogCta={model.blog}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
                license={LICENSE}
            />

            {/* The same checkpoints the card on /developers offers, read off the
                same data so the two cannot drift apart. Each one has its own
                Hugging Face repo, so each chip is the link to it. */}
            <DevReveal as="div" className="model-variants">
                <span className="model-variants-label">Checkpoints</span>
                {model.variants.map((v) =>
                    v.hf ? (
                        <a
                            key={v.id}
                            href={v.hf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="model-variant is-link"
                            title={v.summary}
                        >
                            {v.label}
                            <ArrowUpRight size={12} aria-hidden="true" />
                        </a>
                    ) : (
                        <span
                            key={v.id}
                            className={`model-variant${v.soon ? ' is-soon' : ''}`}
                            title={v.summary}
                        >
                            {v.label}
                            {v.soon && <em>Soon</em>}
                        </span>
                    ),
                )}
            </DevReveal>

            <DevReveal as="section" className="model-section">
                <h2 className="model-section-title">See it transcribe</h2>
                <p className="model-section-dek">
                    Press play — the transcript is written as the audio runs, and the same recording
                    can come back in any of the three output modes.
                </p>
                <TranscribeExamples />
            </DevReveal>

            {/* One sentence, three ways. The mode is two tokens in the prompt, so
                all three cost the same decode — which is why they are shown
                together rather than sold as separate features. */}
            <DevReveal as="section" className="model-section">
                <h2 className="model-section-title">Three ways to write the same sentence</h2>
                <p className="model-section-dek">{MODES.spoken}, transcribed by Flex.</p>
                <div className="tsc-modes">
                    {MODES.out.map((mode) => (
                        <article key={mode.id} className="tsc-mode">
                            <span className="tsc-mode-label">{mode.label}</span>
                            <p className="tsc-mode-text" lang="hi">{mode.text}</p>
                            <p className="tsc-mode-desc">{mode.desc}</p>
                        </article>
                    ))}
                </div>
            </DevReveal>

            <DevReveal as="section" className="model-section">
                <h2 className="model-section-title">What it covers</h2>
                <p className="model-section-dek">
                    Twenty-seven in all, each transcribed in the script it is actually written in.
                </p>
                <div className="tsc-coverage">
                    {COVERAGE.map((row) => (
                        <div key={row.label} className="tsc-coverage-cell">
                            <span className="tsc-coverage-count">{row.count}</span>
                            <span className="tsc-coverage-label">{row.label}</span>
                            <span className="tsc-coverage-note">{row.note}</span>
                        </div>
                    ))}
                </div>
            </DevReveal>

            <DevReveal as="section" className="model-section">
                <h2 className="model-section-title">Under the hood</h2>
                <dl className="tsc-spec">
                    {SPEC.map((row) => (
                        <div key={row.k} className="tsc-spec-row">
                            <dt>{row.k}</dt>
                            <dd>
                                {row.v}
                                {row.note && <em className="tsc-spec-note">{row.note}</em>}
                            </dd>
                        </div>
                    ))}
                </dl>
            </DevReveal>

            {/* The edges, in the announcement's own words. A page that lists only
                what a model does is the one people build against and then find
                the limits in production. */}
            <DevReveal as="section" className="model-section">
                <h2 className="model-section-title">Know the edges before you ship</h2>
                <div className="tsc-limits">
                    {LIMITS.map((limit) => (
                        <article key={limit.h} className="tsc-limit">
                            <h3>{limit.h}</h3>
                            <p>{limit.p}</p>
                        </article>
                    ))}
                </div>
            </DevReveal>
        </main>
        <Footer />
    </div>
);

export default IndicTranscribePage;
