import { ArrowUpRight } from 'lucide-react';
import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import TranscribeFeatures from './TranscribeFeatures';
import DevReveal from '../DevReveal';
import { LICENSE, getModelById } from '../../data/models';
import { DESCRIPTION, STATS } from './indic-transcribe/transcribeModelContent';
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
                docsCta={model.docs}
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
                    Real recordings, from the release post. Pick what you want to hear it handle,
                    press play, and read what the model wrote down.
                </p>
                <TranscribeFeatures />
            </DevReveal>
        </main>
        <Footer />
    </div>
);

export default IndicTranscribePage;
