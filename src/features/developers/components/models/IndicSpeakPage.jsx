import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import SpeakExamples from './SpeakExamples';
import DevReveal from '../DevReveal';
import { LICENSE, getModelById } from '../../data/models';
import '../../developers.css';

const model = getModelById('indic-speak');

const STATS = [
    { value: '45', label: 'Voices' },
    { value: '22', label: 'Languages / scripts' },
    { value: '14', label: 'Delivery styles' },
    { value: '~200 ms', label: 'Response time' },
];

const IndicSpeakPage = () => (
    <div className="min-h-screen research-page">
        <Navbar />
        <main
            className="model-page-main"
            style={{ '--model-accent': model.accent, '--model-gradient': model.gradient }}
        >
            <ModelHero
                title={model.name}
                intro="speak"
                tagline="One speech system for the way India actually writes and speaks — multiple scripts, English embedded mid-sentence, numbers and technical notation, 45 voices across 14 delivery styles, and long-form narration."
                accent={model.accent}
                viz={model.viz}
                stats={STATS}
                primaryCta={{ label: 'Hugging Face', href: '#' }}
                blogCta={model.blog}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
                license={LICENSE}
                note="Early checkpoint — shared for integration testing, not final voice quality."
            />

            <DevReveal as="section" className="model-section">
                <h2 className="model-section-title">Hear it work</h2>
                <p className="model-section-dek">
                    Code-mixed sentences, a voice cast across languages, and five and a half minutes
                    of narration. The full range — numbers and formulae, all 45 voices, all 14
                    delivery styles — is in the blog.
                </p>
                <SpeakExamples />
            </DevReveal>
        </main>
        <Footer />
    </div>
);

export default IndicSpeakPage;
