import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, BookOpen, Scale } from 'lucide-react';
import ModelTitleIntro from './ModelTitleIntro';
import DevHeadline from '../DevHeadline';
import AccentAurora from '../AccentAurora';
import CountUp from '../CountUp';
import { ensureRevealed, gsap, useGsapAnimation } from '../../devMotion';

const isExternal = (href) => /^https?:\/\//.test(href ?? '');

/**
 * The hero carries the model's name, one line on what it does, the links out,
 * and the numbers band.
 *
 * It is above the fold, so the entrance plays on mount rather than on scroll:
 * each piece arrives just behind the title's own reveal. Everything is a
 * `fromTo` inside `useGsapAnimation`, which is what stops the whole hero from
 * sitting at opacity 0 when the tab is not being painted — this hero used to
 * do exactly that.
 */
const ModelHero = ({
    title,
    tagline,
    stats,
    accent,
    viz,
    primaryCta,
    secondaryCta,
    blogCta,
    note,
    intro,
    license,
}) => {
    const ref = useRef(null);

    useGsapAnimation((root) => {
        const pieces = root.querySelectorAll('[data-hero-rise]');
        const band = root.querySelector('.model-hero-band');
        const cells = root.querySelectorAll('.stat-band-item');
        if (!pieces.length && !band) return;

        const tl = gsap.timeline({ delay: 0.05, defaults: { ease: 'power3.out' } });

        if (pieces.length) {
            tl.fromTo(
                pieces,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.09, clearProps: 'opacity,transform' },
            );
        }

        // the band frame arrives, then its cells land left to right
        if (band) {
            tl.fromTo(
                band,
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: 0.55, clearProps: 'opacity,transform' },
                '-=0.15',
            ).fromTo(
                cells,
                { opacity: 0, y: 10, scale: 0.97 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.42,
                    stagger: 0.06,
                    clearProps: 'opacity,transform',
                },
                '-=0.3',
            );
        }

        return ensureRevealed(tl, root);
    }, ref, [title]);

    return (
        <header className="model-hero" style={{ '--model-accent': accent }} ref={ref}>
            {viz && <AccentAurora from={viz.from} to={viz.to} />}

            <Link to="/developers" className="model-back-link">
                <ArrowLeft size={14} aria-hidden="true" />
                All models
            </Link>

            {intro ? (
                <ModelTitleIntro variant={intro} text={title} className="model-title" />
            ) : (
                // no per-model intro: the plain word-by-word reveal, still guarded
                <DevHeadline className="model-title" words={title.split(' ')} delay={0.12} />
            )}

            <p className="model-tagline" data-hero-rise>
                {tagline}
            </p>

            <div className="model-cta-row" data-hero-rise>
                {primaryCta && (
                    <a
                        href={primaryCta.href}
                        target={isExternal(primaryCta.href) ? '_blank' : undefined}
                        rel={isExternal(primaryCta.href) ? 'noopener noreferrer' : undefined}
                        className="model-cta-primary"
                    >
                        <span>{primaryCta.label}</span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                )}
                {blogCta &&
                    (isExternal(blogCta.href) ? (
                        <a
                            href={blogCta.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="model-cta-secondary"
                        >
                            <BookOpen size={14} aria-hidden="true" />
                            {blogCta.label}
                            <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                    ) : (
                        <Link to={blogCta.href} className="model-cta-secondary">
                            <BookOpen size={14} aria-hidden="true" />
                            {blogCta.label}
                        </Link>
                    ))}
                {secondaryCta &&
                    (isExternal(secondaryCta.href) ? (
                        <a
                            href={secondaryCta.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="model-cta-secondary"
                        >
                            {secondaryCta.label}
                        </a>
                    ) : (
                        // in-app route: the site is hash-routed, so a bare href would miss
                        <Link to={secondaryCta.href} className="model-cta-secondary">
                            {secondaryCta.label}
                        </Link>
                    ))}
            </div>

            {license && (
                <p className="model-license" data-hero-rise>
                    <Scale size={13} aria-hidden="true" />
                    Released under the <b>{license}</b>
                </p>
            )}

            {note && (
                <p className="model-note" data-hero-rise>
                    {note}
                </p>
            )}

            {stats && (
                <div className="stat-band model-hero-band">
                    {stats.map((s) => (
                        <div key={s.label} className={`stat-band-item${s.isPrice ? ' is-price' : ''}`}>
                            <p className="stat-band-value">
                                <CountUp value={s.value} />
                            </p>
                            <p className="stat-band-label">{s.label}</p>
                        </div>
                    ))}
                </div>
            )}
        </header>
    );
};

export default ModelHero;
