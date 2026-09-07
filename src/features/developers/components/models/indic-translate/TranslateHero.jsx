import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ArrowRight, Play } from 'lucide-react';
import { HERO_COPY, HERO_STATS, LANGUAGES } from './translateData';
import { prefersReducedMotion } from './translateUtils';

gsap.registerPlugin(ScrambleTextPlugin);

// A drift of the twenty-two initials, one per language in its own script.
// Positions are fixed so the field reads as composed rather than scattered.
const FIELD = [
    { i: 0, left: '4%', top: '16%', size: '3.1rem', tone: 'saffron' },
    { i: 1, left: '13%', top: '58%', size: '2.4rem', tone: 'teal' },
    { i: 4, left: '23%', top: '10%', size: '2.1rem', tone: 'violet' },
    { i: 10, left: '8%', top: '82%', size: '2.7rem', tone: 'magenta' },
    { i: 14, left: '30%', top: '76%', size: '2.2rem', tone: 'amber' },
    { i: 19, right: '7%', top: '19%', size: '3rem', tone: 'sky' },
    { i: 6, right: '17%', top: '64%', size: '2.5rem', tone: 'green' },
    { i: 20, right: '26%', top: '12%', size: '2.3rem', tone: 'saffron' },
    { i: 15, right: '10%', top: '84%', size: '2.4rem', tone: 'violet' },
    { i: 17, right: '32%', top: '78%', size: '2rem', tone: 'teal' },
    { i: 11, left: '40%', top: '6%', size: '2.2rem', tone: 'magenta' },
    { i: 21, right: '3%', top: '45%', size: '1.9rem', tone: 'amber' },
];

const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/**
 * The introduction. The one moving part that carries meaning is the language
 * name in the standing line: it churns through each language's own glyphs and
 * settles on that language's own spelling of its name, twenty-two times over.
 * It is the coverage claim, made without a list.
 */
const TranslateHero = () => {
    const nameRef = useRef(null);
    const [active, setActive] = useState(5); // Hindi, so the first frame is legible

    useEffect(() => {
        const el = nameRef.current;
        if (!el) return undefined;

        if (prefersReducedMotion()) {
            // No churn, but the claim still needs making — step through the
            // names slowly and plainly instead.
            const timer = window.setInterval(() => setActive((i) => (i + 1) % LANGUAGES.length), 2600);
            return () => window.clearInterval(timer);
        }

        let index = 5;
        let tween = null;
        const step = () => {
            index = (index + 1) % LANGUAGES.length;
            const next = LANGUAGES[index];
            // The churn alphabet is the target's own script, so Tamil resolves
            // out of Tamil and Ol Chiki out of Ol Chiki.
            const chars = Array.from(new Set(next.native.replace(/\s/g, ''))).join('') || 'अआइई';
            setActive(index);
            tween = gsap.to(el, {
                duration: 0.85,
                ease: 'none',
                scrambleText: { text: next.native, chars, speed: 0.45, tweenLength: false },
            });
        };

        const timer = window.setInterval(step, 2000);
        return () => {
            window.clearInterval(timer);
            tween?.kill();
        };
    }, []);

    const current = LANGUAGES[active];

    return (
        <section className="itr-hero" id="model">
            <div className="itr-field" aria-hidden="true">
                {FIELD.map((spot) => (
                    <span
                        key={`${spot.i}-${spot.top}`}
                        className="itr-field-glyph"
                        data-tone={spot.tone}
                        style={{ left: spot.left, right: spot.right, top: spot.top, fontSize: spot.size }}
                    >
                        {LANGUAGES[spot.i].glyph}
                    </span>
                ))}
                <span className="itr-field-arc" />
                <span className="itr-field-arc is-two" />
            </div>

            <div className="itr-container itr-hero-inner">
                <p className="itr-eyebrow itr-hero-reveal">{HERO_COPY.eyebrow}</p>

                <h1 className="itr-hero-title itr-hero-reveal">
                    Indic<span className="itr-grad">-Translate</span>
                </h1>

                <p className="itr-hero-tagline itr-hero-reveal">{HERO_COPY.tagline}</p>

                <p className="itr-standing itr-hero-reveal">
                    <span className="itr-standing-en">English</span>
                    <span className="itr-standing-swap" aria-hidden="true">
                        ⇄
                    </span>
                    <span className="itr-standing-target">
                        <span className="itr-standing-abbr">{current.abbr}</span>
                        <span className="itr-standing-name" lang={current.code} ref={nameRef}>
                            {current.native}
                        </span>
                    </span>
                    <span className="itr-sr-only">
                        and all twenty-two Eighth Schedule languages, in both directions.
                    </span>
                </p>

                <p className="itr-hero-copy itr-hero-reveal">{HERO_COPY.body}</p>

                <div className="itr-hero-actions itr-hero-reveal">
                    <button type="button" className="itr-btn itr-btn-primary" onClick={() => scrollTo('#demo')}>
                        <Play size={14} aria-hidden="true" />
                        Watch it translate
                    </button>
                    <button type="button" className="itr-btn itr-btn-ghost" onClick={() => scrollTo('#examples')}>
                        Browse real output
                        <ArrowRight size={14} aria-hidden="true" />
                    </button>
                </div>

                <dl className="itr-stats itr-hero-reveal">
                    {HERO_STATS.map((stat) => (
                        <div key={stat.label} className="itr-stat">
                            <dt>
                                <span className="itr-count" data-target={stat.value}>
                                    {stat.value}
                                </span>
                                <span className="itr-count-suffix">{stat.suffix}</span>
                            </dt>
                            <dd>{stat.label}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
};

export default TranslateHero;
