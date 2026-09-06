import { ArrowRight, ScanLine } from 'lucide-react';
import { HERO_STATS } from './docParserData';

// A drift of glyphs from the scripts the model reads. Positions are fixed so
// the field looks composed rather than scattered; GSAP gives them their float.
const GLYPHS = [
    { char: 'अ', left: '6%', top: '18%', size: '3.4rem', tone: 'saffron' },
    { char: 'ক', left: '15%', top: '62%', size: '2.6rem', tone: 'teal' },
    { char: 'ਗ', left: '25%', top: '12%', size: '2.2rem', tone: 'violet' },
    { char: 'അ', left: '10%', top: '84%', size: '2.9rem', tone: 'magenta' },
    { char: 'ଓ', left: '32%', top: '78%', size: '2.3rem', tone: 'amber' },
    { char: 'ஶ', right: '8%', top: '22%', size: '3.2rem', tone: 'sky' },
    { char: 'ಕ', right: '18%', top: '68%', size: '2.7rem', tone: 'green' },
    { char: 'త', right: '27%', top: '14%', size: '2.4rem', tone: 'saffron' },
    { char: 'ગ', right: '12%', top: '86%', size: '2.5rem', tone: 'violet' },
    { char: 'ᱛ', right: '33%', top: '80%', size: '2.1rem', tone: 'teal' },
    { char: '∫', left: '42%', top: '8%', size: '2.6rem', tone: 'magenta' },
    { char: 'اُردُو', right: '4%', top: '48%', size: '1.9rem', tone: 'amber' },
];

const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const DocParserHero = () => (
    <section className="idp-hero" id="model">
        <div className="idp-glyphs" aria-hidden="true">
            {GLYPHS.map((glyph) => (
                <span
                    key={glyph.char + glyph.top}
                    className="idp-glyph"
                    data-tone={glyph.tone}
                    style={{ left: glyph.left, right: glyph.right, top: glyph.top, fontSize: glyph.size }}
                >
                    {glyph.char}
                </span>
            ))}
            {/* Empty detection boxes drifting behind the type: the page's own
                subject matter, used as ornament. */}
            <span className="idp-ghost-box" style={{ left: '8%', top: '30%', width: '13%', height: '9%' }} />
            <span className="idp-ghost-box" style={{ right: '9%', top: '34%', width: '15%', height: '7%' }} />
            <span className="idp-ghost-box" style={{ left: '18%', top: '70%', width: '10%', height: '11%' }} />
            <span className="idp-ghost-box" style={{ right: '20%', top: '76%', width: '12%', height: '8%' }} />
        </div>

        <div className="idp-container idp-hero-inner">
            <p className="idp-eyebrow idp-hero-reveal">Developers · Document digitisation</p>

            <h1 className="idp-hero-title idp-hero-reveal">
                Indic<span className="idp-grad">DocParser</span>
            </h1>

            <p className="idp-hero-tagline idp-hero-reveal">A page goes in. A document comes out.</p>

            <p className="idp-hero-copy idp-hero-reveal">
                Layout detection with reading order, then block-level recognition — for printed and handwritten pages
                in 22 Indian languages and English. Prose returns as Markdown, mathematics as LaTeX, tables as HTML,
                every block carrying the box it came from.
            </p>

            <div className="idp-hero-actions idp-hero-reveal">
                <button type="button" className="idp-btn idp-btn-primary" onClick={() => scrollTo('#demo')}>
                    <ScanLine size={15} aria-hidden="true" />
                    Parse a page
                </button>
                <button type="button" className="idp-btn idp-btn-ghost" onClick={() => scrollTo('#examples')}>
                    See real predictions
                    <ArrowRight size={15} aria-hidden="true" />
                </button>
            </div>

            <dl className="idp-stats idp-hero-reveal">
                {HERO_STATS.map((stat) => (
                    <div key={stat.label} className="idp-stat">
                        <dt>
                            <span className="idp-count" data-target={stat.value}>
                                {stat.value}
                            </span>
                            <span className="idp-count-suffix">{stat.suffix}</span>
                        </dt>
                        <dd>{stat.label}</dd>
                    </div>
                ))}
            </dl>
        </div>
    </section>
);

export default DocParserHero;
