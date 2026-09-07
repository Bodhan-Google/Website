import { useRef, useState } from 'react';
import { gsap, useGsapAnimation } from '../../../../utils/motion';
import TranslateLiveDemo from '../../../developers/components/models/indic-translate/TranslateLiveDemo';
import '../../../developers/components/models/indic-translate/translate.css';
import { formatBlogText } from '../../utils/formatBlogText';

/**
 * The capabilities section: state each capability as a card, then let the reader
 * run it.
 *
 * The try-it surface is the same component the Indic-Translate model page ships —
 * imported rather than reimplemented, so the recorded output, the six stage
 * animations and the language picker stay in one place. Its styles are scoped
 * under `.itr-page`, so the wrapper carries that class; `.itb-embed` next to it
 * strips the page-level chrome (full-height ground, section padding, the demo's
 * own hero header) that only makes sense on a standalone page.
 *
 * Picking a card selects that capability in the demo below it, which is the whole
 * point of stating the capabilities first.
 */
const TryItBlock = ({ section }) => {
    const [mode, setMode] = useState('sentence');
    const rootRef = useRef(null);
    const demoRef = useRef(null);

    const cards = section.subsections ?? [];

    useGsapAnimation(
        () => {
            gsap.from('.cap-card', {
                y: 26,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out',
                stagger: 0.07,
                scrollTrigger: { trigger: '.research-feature-grid', start: 'top 86%', once: true },
            });

            // The model page animates its own `.itr-reveal` surfaces from a
            // page-level hook that does not run here, so the demo card gets its
            // entrance from the block that embeds it.
            gsap.from('.itb-embed .itr-demo', {
                y: 34,
                opacity: 0,
                duration: 0.75,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.itb-embed', start: 'top 88%', once: true },
            });
        },
        rootRef,
        []
    );

    const pick = (nextMode) => {
        setMode(nextMode);
        // Scroll the demo into view rather than jumping — the card the reader just
        // clicked should stay on screen above it where possible.
        demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    return (
        <div className="tryit-block" ref={rootRef}>
            <div className="research-feature-grid">
                {cards.map((card) => (
                    <button
                        key={card.title}
                        type="button"
                        className={`research-feature-card cap-card${
                            mode === card.mode ? ' is-active' : ''
                        }`}
                        aria-pressed={mode === card.mode}
                        onClick={() => pick(card.mode)}
                    >
                        <span className="research-feature-index">{card.tag}</span>
                        <span className="research-feature-title">{card.title}</span>
                        <span className="research-feature-body">{formatBlogText(card.content)}</span>
                        <span className="cap-card-cue" aria-hidden="true">
                            Run it ↓
                        </span>
                    </button>
                ))}
            </div>

            <div className="itr-page itb-embed" ref={demoRef}>
                <TranslateLiveDemo mode={mode} onModeChange={setMode} />
            </div>
        </div>
    );
};

export default TryItBlock;
