import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import ModelIcon from './ModelIcon';
import ModelGlyph from './ModelGlyph';
import AccentAurora from './AccentAurora';
import DevReveal from './DevReveal';
import DevHeadline from './DevHeadline';
import { models } from '../data/models';
import '../developers.css';

// Totals for the header strip — read off the model data so they cannot drift
// away from the cards underneath them.
const HEADLINE = [
    { value: `${models.length}`, label: 'Open models' },
    { value: '27', label: 'Languages covered' },
    { value: '22', label: 'Eighth Schedule languages' },
    { value: '1', label: 'API to reach them' },
];

/**
 * One model card.
 *
 * The card is a div rather than a Link, because the models that ship in more
 * than one checkpoint carry a row of buttons — and a button inside an anchor is
 * invalid markup that browsers render unpredictably. Instead the heading holds
 * the link and stretches over the whole card with a pseudo-element, so the card
 * is still clickable end to end, and the tabs sit above that layer.
 */
const ModelCard = ({ model }) => {
    const variants = model.variants ?? [];
    const pickable = variants.filter((v) => !v.soon);
    const [variantId, setVariantId] = useState(pickable[0]?.id);

    const variant = pickable.find((v) => v.id === variantId) ?? pickable[0];
    const summary = variant?.summary ?? model.summary;
    const specs = variant?.specs ?? model.specs;

    return (
        <div
            className="dev-card"
            style={{ '--model-accent': model.accent, '--model-gradient': model.gradient }}
        >
            <span className="dev-card-viz">
                <ModelGlyph kind={model.glyph} from={model.viz.from} to={model.viz.to} />
            </span>

            <div className="dev-card-body">
                <div className="dev-card-top">
                    <span className="dev-card-icon">
                        <ModelIcon name={model.icon} size={17} />
                    </span>
                    <Link to={model.href} className="dev-card-heading dev-card-link">
                        <span className="dev-card-name">{model.name}</span>
                        <span className="dev-card-codename">{model.codename}</span>
                    </Link>
                    <ArrowUpRight size={17} className="dev-card-arrow" aria-hidden="true" />
                </div>

                {variants.length > 0 && (
                    <div className="dev-card-tabs" role="tablist" aria-label={`${model.name} checkpoints`}>
                        {variants.map((v) =>
                            v.soon ? (
                                <span key={v.id} className="dev-card-tab is-soon" title={v.summary}>
                                    {v.label}
                                    <em>Soon</em>
                                </span>
                            ) : (
                                <button
                                    key={v.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={variant?.id === v.id}
                                    className={`dev-card-tab${variant?.id === v.id ? ' is-active' : ''}`}
                                    onClick={() => setVariantId(v.id)}
                                >
                                    {v.label}
                                </button>
                            ),
                        )}
                    </div>
                )}

                <p className="dev-card-summary">{summary}</p>

                <div className="dev-card-specs">
                    {specs.map((spec) => (
                        <span key={spec.label} className="dev-card-spec">
                            <b>{spec.value}</b>
                            <span>{spec.label}</span>
                        </span>
                    ))}
                </div>

                <div className="dev-card-foot">
                    <span className="dev-card-go">
                        Explore
                        <ArrowUpRight size={13} aria-hidden="true" />
                    </span>
                </div>
            </div>
        </div>
    );
};

const DevelopersPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen research-page">
            <Navbar />

            <main className="model-page-main models-page-main">
                <AccentAurora from="#E2691F" to="#C2410C" />

                <header className="dx-hero">
                    <DevHeadline
                        className="dx-title"
                        words={['Models', 'built', 'for', { content: 'Indian languages', className: 'dh-break dx-grad' }]}
                    />

                    <p className="dx-lede">
                        Speech, documents and translation — trained on Indian languages rather than
                        adapted to them. Each one runs on its own, and they compose into one pipeline.
                    </p>

                    <div className="dx-meta">
                        {HEADLINE.map((item) => (
                            <div key={item.label} className="dx-meta-item">
                                <span className="dx-meta-value">{item.value}</span>
                                <span className="dx-meta-label">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </header>

                <DevReveal className="dev-grid" stagger=".dev-card">
                    {models.map((model) => (
                        <ModelCard key={model.id} model={model} />
                    ))}
                </DevReveal>
            </main>

            <Footer />
        </div>
    );
};

export default DevelopersPage;
