import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import SpeakDeliveries from './SpeakDeliveries';
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
                tagline="One speech system for the way India actually writes and speaks: multiple scripts, English embedded mid-sentence, numbers and technical notation, 45 voices across 14 delivery styles, and long-form narration."
                accent={model.accent}
                viz={model.viz}
                stats={STATS}
                primaryCta={model.docs}
                blogCta={model.blog}
                thirdCta={{ label: 'Hugging Face', href: model.hf }}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
                license={LICENSE}
            />

            <DevReveal as="section" className="model-section">
                <h2 className="model-section-title">Fourteen deliveries</h2>
                <p className="model-section-dek">
                    A voice can be pointed at a register. Eight name a context the speech is going
                    into, six name an emotion. Matching is literal, capitals and
                    apostrophe included, so send each string exactly as it appears.
                </p>
                <SpeakDeliveries />
            </DevReveal>
        </main>
        <Footer />
    </div>
);

export default IndicSpeakPage;
