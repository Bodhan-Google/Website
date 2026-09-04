import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import TranscribeExamples from './TranscribeExamples';
import DevReveal from '../DevReveal';
import { LICENSE, getModelById } from '../../data/models';
import '../../developers.css';

const model = getModelById('indic-transcribe');

const STATS = [
    { value: '27', label: 'Languages' },
    { value: '1.2B', label: 'Parameters' },
    { value: '1.35M', label: 'Hours of audio' },
    { value: '3', label: 'Output modes' },
];

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
                tagline="Speech in 27 Indian languages, their dialects and accents — out in native script, mixed script, or romanized."
                accent={model.accent}
                viz={model.viz}
                stats={STATS}
                primaryCta={{
                    label: 'Hugging Face',
                    href: 'https://huggingface.co/bodhan-ai/indic-transcribe-flex',
                }}
                blogCta={model.blog}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
                license={LICENSE}
            />

            {/* the same checkpoints the card on /developers offers, read off the
                same data so the two cannot drift apart */}
            <DevReveal as="div" className="model-variants">
                <span className="model-variants-label">Checkpoints</span>
                {model.variants.map((v) => (
                    <span key={v.id} className={`model-variant${v.soon ? ' is-soon' : ''}`} title={v.summary}>
                        {v.label}
                        {v.soon && <em>Soon</em>}
                    </span>
                ))}
            </DevReveal>

            <DevReveal as="section" className="model-section">
                <h2 className="model-section-title">See it transcribe</h2>
                <p className="model-section-dek">
                    Press play — the transcript is written as the audio runs, and the same recording
                    can come back in any of the three output modes.
                </p>
                <TranscribeExamples />
            </DevReveal>
        </main>
        <Footer />
    </div>
);

export default IndicTranscribePage;
