import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import DocParserExamples from './DocParserExamples';
import DevReveal from '../DevReveal';
import { LICENSE, getModelById } from '../../data/models';
import '../../developers.css';

const model = getModelById('indic-ocr');

const STATS = [
    { value: '22', label: 'Languages + English' },
    { value: '37', label: 'Layout labels' },
    { value: '33M', label: 'Layout model' },
    { value: '0.8B', label: 'OCR model' },
];

const IndicOcrPage = () => (
    <div className="min-h-screen research-page">
        <Navbar />
        <main
            className="model-page-main"
            style={{ '--model-accent': model.accent, '--model-gradient': model.gradient }}
        >
            <ModelHero
                title={model.name}
                intro="scan"
                tagline="Layout detection with reading order, then block-level OCR — printed or handwritten, with math as LaTeX and tables as HTML."
                accent={model.accent}
                viz={model.viz}
                stats={STATS}
                primaryCta={{ label: 'Hugging Face', href: model.hf }}
                blogCta={model.blog}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
                license={LICENSE}
            />

            <DevReveal as="section" className="model-section">
                <h2 className="model-section-title">Watch it read a page</h2>
                <p className="model-section-dek">
                    The scan on the left, the model's reconstruction on the right — built one block
                    at a time, in the reading order the layout model chose, with each region
                    outlined on the page as it is read.
                </p>
                <DocParserExamples />
            </DevReveal>
        </main>
        <Footer />
    </div>
);

export default IndicOcrPage;
