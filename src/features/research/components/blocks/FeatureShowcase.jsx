import { useState } from 'react';
import { getTheme } from '../../../developers/data/cultureThemes';
import { formatBlogText } from '../../utils/formatBlogText';
import SampleAudio from './SampleAudio';

/**
 * Section 4 — one card per capability, each following the same arc:
 * claim → concrete example → result → why it matters.
 *
 * The variant tabs are what keep a feature honest. "Handles accents" is a
 * claim; four accents you can actually switch between and hear is evidence.
 */
const FeatureCard = ({ feature, index }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const variants = feature.variants ?? [];
    const active = variants[Math.min(activeIndex, variants.length - 1)];
    const accent = active?.themeKey ? getTheme(active.themeKey).accent : undefined;

    return (
        <article className="bt-card bt-feature" style={accent ? { '--bt-accent': accent } : undefined}>
            <p className="bt-feature-index">{String(index + 1).padStart(2, '0')}</p>
            <h3 className="bt-feature-title">{feature.title}</h3>

            {feature.description && (
                <p className="bt-feature-desc">{formatBlogText(feature.description)}</p>
            )}

            {variants.length > 1 && (
                <div className="bt-variants" role="tablist" aria-label={`${feature.title} examples`}>
                    {variants.map((variant, i) => (
                        <button
                            key={variant.label}
                            type="button"
                            role="tab"
                            aria-selected={i === activeIndex}
                            className="bt-variant"
                            onClick={() => setActiveIndex(i)}
                        >
                            {variant.label}
                        </button>
                    ))}
                </div>
            )}

            {active && (
                <div className="bt-io" style={variants.length > 1 ? undefined : { marginTop: '0.9rem' }}>
                    <div className="bt-io-row">
                        <span className="bt-io-label">Audio</span>
                        <SampleAudio
                            src={active.audio}
                            accent={accent}
                            caption={active.audioCaption ?? active.label}
                            label={`Play ${active.label} sample`}
                        />
                    </div>

                    {active.input && (
                        <div className="bt-io-row">
                            <span className="bt-io-label">Spoken</span>
                            <span className="bt-io-value" data-muted="true">
                                {active.input}
                            </span>
                        </div>
                    )}

                    <div className="bt-io-row">
                        <span className="bt-io-label">Output</span>
                        <span
                            className="bt-io-value"
                            data-script={active.script === 'native' ? 'native' : undefined}
                            lang={active.langCode}
                        >
                            {active.output ?? '—'}
                        </span>
                    </div>
                </div>
            )}

            {feature.matters && (
                <div className="bt-matters">
                    <span className="bt-matters-label">Why it matters</span>
                    <span className="bt-matters-text">{formatBlogText(feature.matters)}</span>
                </div>
            )}
        </article>
    );
};

const FeatureShowcase = ({ features = [] }) => {
    if (!features.length) return null;

    return (
        <div className="bt-features">
            {features.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
        </div>
    );
};

export default FeatureShowcase;
