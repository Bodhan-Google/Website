import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGsapAnimation } from '../../../utils/motion';
import BlogChart from './charts/BlogChart';
import ResearchExperiment from './ResearchExperiments';
import OutputModesDemo from './OutputModesDemo';
import ArchitectureDiagram from './ArchitectureDiagram';
import BenchmarkTable from './BenchmarkTable';
import { resolveChart } from '../data/charts';
import LanguageShowcase from './blocks/LanguageShowcase';
import FeatureShowcase from './blocks/FeatureShowcase';
import EcosystemBanner from './blocks/EcosystemBanner';
import SectionSlot from './blocks/SectionSlot';
import CiteThisWork from './blocks/CiteThisWork';
import LanguageConstellation from './indic-translate/LanguageConstellation';
import TryItBlock from './indic-translate/TryItBlock';
import SpecimenSheet from './indic-translate/SpecimenSheet';
import ResultsTiles from './indic-translate/ResultsTiles';
import VoiceForge from './indic-speak/VoiceForge';
import VoiceLibrary from './indic-speak/VoiceLibrary';
import SpeakCapabilities from './indic-speak/SpeakCapabilities';
import { formatBlogText } from '../utils/formatBlogText';
import { cn } from '../../../utils/tailwindUtils';
import './blocks/blogTemplate.css';
import './indic-translate/indicTranslate.css';
import './indic-speak/indicSpeak.css';

const isCompactBulletList = (items) =>
    items.length <= 8 && items.every((item) => item.length < 55);

const BulletList = ({ items, compact: compactProp, className = '' }) => {
    const compact = compactProp ?? isCompactBulletList(items);

    return (
        <div className={cn('research-bullet-block', compact && 'research-bullet-block--compact', className)}>
            <ul className={cn('research-bullet-list', compact && 'research-bullet-list--compact')}>
                {items.map((item, index) => (
                    <li key={index} className="research-bullet-item">
                        <span className="research-bullet-marker" aria-hidden="true">
                            {compact ? null : String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="research-bullet-text">{formatBlogText(item)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

/*
 * Sections that own their own layout name a widget with `component: '...'`.
 *
 * Dispatching on an explicit key beats matching a heading string — the older
 * `sub.title === 'Three Output Modes'` branch below silently couples the layout to
 * the copy, so rewording a heading loses the widget under it.
 *
 * A widget owns everything between the section's intro paragraphs and its closing
 * links, so the generic renderers are skipped for it.
 */
const SECTION_WIDGETS = {
    coverage: LanguageConstellation,
    tryIt: TryItBlock,
    specimens: SpecimenSheet,
    results: ResultsTiles,
    hearIt: VoiceForge,
    voiceLibrary: VoiceLibrary,
    speakCapabilities: SpeakCapabilities,
};

const Reveal = ({ children, className = '', delay = 0 }) => {
    const ref = useRef(null);

    // Guarded: this is the wrapper every section, chart and embedded demo sits
    // inside, so if its tween cannot run the article has nothing on screen.
    useGsapAnimation(
        (element) => {
            gsap.fromTo(
                element,
                { y: 28, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.72,
                    delay: delay / 1000,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: element, start: 'top 88%', once: true },
                }
            );
        },
        ref,
        [delay]
    );

    return (
        <div
            ref={ref}
            className={`research-gsap-reveal ${className}`}
        >
            {children}
        </div>
    );
};

const renderSlots = (slots) =>
    slots?.map((slot, index) => (
        <Reveal key={`${slot.kind}-${slot.label ?? index}`}>
            <SectionSlot {...slot} />
        </Reveal>
    ));

const renderCharts = (chartRefs) => {
    if (!chartRefs?.length) return null;
    return chartRefs.map((ref) => {
        const chart = resolveChart(ref);
        if (!chart) return null;
        return (
            <Reveal key={chart.id ?? ref}>
                <BlogChart chart={chart} />
            </Reveal>
        );
    });
};

const BlogContent = ({ sections }) => {
    const proseRef = useRef(null);

    /*
     * Section headings arrive as one gesture: the rule draws out from the left,
     * the number fades up under it, and the title follows.
     *
     * This is separate from Reveal, which moves the whole section as a block —
     * that block motion is what carries the section onto the page, and this is
     * what gives its heading a beat of its own once it is there.
     */
    useGsapAnimation(
        () => {
            gsap.utils.toArray('.research-section-header').forEach((header) => {
                gsap.timeline({
                    scrollTrigger: { trigger: header, start: 'top 88%', once: true },
                })
                    .from(header.querySelector('.research-section-rule'), {
                        scaleX: 0,
                        transformOrigin: 'left center',
                        duration: 0.55,
                        ease: 'power3.out',
                    })
                    .from(
                        header.querySelectorAll('.section-num, .research-type-h2'),
                        { y: 12, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
                        '-=0.3'
                    );
            });
        },
        proseRef,
        [sections]
    );

    const renderLink = ({ label, href, external }) => {
        // A same-origin static file (e.g. /docs/x.pdf) starts with '/' but must not
        // go through the router; the post marks it `external: true`.
        const isInternal = href.startsWith('/') && !external;
        const className =
            'research-inline-link inline-flex items-center text-[13px] font-medium text-[var(--text-primary)] border border-[var(--primary-100)] rounded-full px-3.5 py-1.5 hover:bg-[var(--primary-100)] hover:border-[var(--text-orange-500)] hover:-translate-y-0.5 transition-all duration-200';

        if (isInternal) {
            return (
                <Link key={label} to={href} className={className}>
                    {label}
                </Link>
            );
        }

        const opensNewTab = external || href.startsWith('http');
        return (
            <a key={label} href={href} className={className} target={opensNewTab ? '_blank' : undefined} rel={opensNewTab ? 'noopener noreferrer' : undefined}>
                {label}
            </a>
        );
    };

    // Headed sections are numbered in reading order. A section that hides its
    // heading (the opener) takes no number, so the count follows what is on screen.
    const headed = sections.filter((section) => !section.hideHeading);

    return (
        <div className="research-prose" ref={proseRef}>
            {sections.map((section) => {
                const Widget = section.component ? SECTION_WIDGETS[section.component] : null;
                const number = section.hideHeading
                    ? null
                    : String(headed.indexOf(section) + 1).padStart(2, '0');

                return (
                <Reveal key={section.id}>
                    <section id={section.id} className="research-article-section scroll-mt-28">
                        {/* The motivation section opens the story directly, with no
                            heading standing between the reader and the problem. */}
                        {!section.hideHeading && (
                            <header className="research-section-header">
                                <div className="research-section-rule" aria-hidden="true" />
                                <h2 className="research-type-h2">
                                    <span className="section-num">{number}</span>
                                    {section.title}
                                </h2>
                            </header>
                        )}

                        {section.draftNote && (
                            <p className="temp-copy">
                                <span className="temp-badge">temporary copy</span>
                                {section.draftNote}
                            </p>
                        )}

                        {section.content?.map((paragraph, i) => (
                            <p
                                key={i}
                                className={
                                    i === 0
                                        ? 'research-type-lead mb-5 last:mb-0'
                                        : 'research-type-body mb-4 last:mb-0'
                                }
                            >
                                {formatBlogText(paragraph)}
                            </p>
                        ))}

                        {/* A widget owns the body of its section, so the generic
                            renderers below are skipped for it. */}
                        {Widget ? (
                            <Reveal>
                                <Widget section={section} />
                            </Reveal>
                        ) : (
                        <>
                        {section.languages && (
                            <LanguageShowcase
                                entries={section.languages}
                                caption={section.languagesCaption}
                            />
                        )}

                        {section.features && <FeatureShowcase features={section.features} />}

                        {section.bullets && <BulletList items={section.bullets} />}

                        {section.stats && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
                                {section.stats.map(({ label, value }, i) => (
                                    <Reveal key={label} delay={i * 80}>
                                        <div className="research-surface-soft research-stat-card rounded-xl p-4">
                                            <p className="research-type-eyebrow text-[var(--color-11)] mb-1.5">
                                                {label}
                                            </p>
                                            <p className="research-type-stat-value">{value}</p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        )}

                        {renderCharts(section.charts)}

                        {section.experiment && (
                            <Reveal>
                                <ResearchExperiment type={section.experiment} />
                            </Reveal>
                        )}

                        {section.demo && (
                            <div className="my-8 research-surface research-demo-frame rounded-xl overflow-hidden">
                                <div className="px-4 py-3 border-b border-[var(--primary-100)] bg-gradient-to-r from-[var(--bg-cream-100)] to-white">
                                    <p className="research-type-h4 mb-1">{section.demo.title}</p>
                                    {section.demo.description && (
                                        <p className="research-type-body-small mt-1">
                                            {formatBlogText(section.demo.description)}
                                        </p>
                                    )}
                                </div>
                                <iframe
                                    src={section.demo.url}
                                    title={section.demo.title}
                                    className="w-full border-0 bg-[var(--bg-cream-50)]"
                                    style={{ height: section.demo.height ?? 640 }}
                                    loading="lazy"
                                    allow="autoplay; fullscreen"
                                />
                                <div className="px-4 py-3 border-t border-[var(--primary-100)] bg-[var(--bg-cream-50)]">
                                    <a
                                        href={section.demo.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="research-type-body-small text-[var(--text-orange-500)] hover:text-[var(--text-hover)] transition-colors"
                                    >
                                        Open demo in a new tab →
                                    </a>
                                </div>
                            </div>
                        )}

                        {section.table && (
                            section.tableVariant === 'architecture' || section.id === 'model-card' ? (
                                <ArchitectureDiagram />
                            ) : (
                                <BenchmarkTable
                                    headers={section.table.headers}
                                    rows={section.table.rows}
                                    caption={section.tableProps?.caption ?? 'Public speech-recognition benchmarks used in this evaluation.'}
                                    {...(section.tableProps?.eyebrow && { eyebrow: section.tableProps.eyebrow })}
                                    {...(section.tableProps?.title && { title: section.tableProps.title })}
                                    {...(section.tableProps?.description && { description: section.tableProps.description })}
                                />
                            )
                        )}

                        {section.subsections &&
                            (section.subsectionLayout === 'cards' ? (
                                <div className="research-feature-grid">
                                    {section.subsections.map((sub, i) => (
                                        <Reveal key={sub.title} delay={i * 90}>
                                            <article className="research-feature-card h-full">
                                                <p className="research-feature-index">
                                                    {String(i + 1).padStart(2, '0')}
                                                </p>
                                                <h3 className="research-feature-title">{sub.title}</h3>
                                                {sub.content && (
                                                    <p className="research-feature-body">{formatBlogText(sub.content)}</p>
                                                )}
                                                {sub.bullets && (
                                                    <BulletList items={sub.bullets} compact className="research-bullet-block--card mt-3" />
                                                )}
                                            </article>
                                        </Reveal>
                                    ))}
                                </div>
                            ) : (
                                section.subsections.map((sub, i) => (
                                    <div key={i} className="research-subsection">
                                        {sub.title === 'Three Output Modes' ? (
                                            <OutputModesDemo />
                                        ) : (
                                            <>
                                        <h3 className="research-type-h3 mb-2">{sub.title}</h3>
                                        {sub.content && (
                                            <p className="research-type-body mb-4">{formatBlogText(sub.content)}</p>
                                        )}
                                        {sub.paragraphs?.map((paragraph, index) => (
                                            <p key={index} className="research-type-body mb-4">
                                                {formatBlogText(paragraph)}
                                            </p>
                                        ))}
                                        {sub.examples && (
                                            <div className="grid gap-2.5 my-4">
                                                {sub.examples.map(({ label, text }) => (
                                                    <div
                                                        key={label}
                                                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 research-surface research-example-row rounded-xl p-4"
                                                    >
                                                        <span className="research-type-h4 w-24 shrink-0">
                                                            {label}
                                                        </span>
                                                        <span className="research-type-example-text !leading-snug">
                                                            {text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {sub.bullets && <BulletList items={sub.bullets} compact={isCompactBulletList(sub.bullets)} />}
                                        {renderCharts(sub.charts)}
                                        {sub.experiment && (
                                            <Reveal>
                                                <ResearchExperiment type={sub.experiment} />
                                            </Reveal>
                                        )}
                                        {renderSlots(sub.slots)}
                                            </>
                                        )}
                                    </div>
                                ))
                            ))}

                        {renderSlots(section.slots)}
                        </>
                        )}

                        {section.code && (
                            <div className="my-6 space-y-2">
                                {section.code.map((line, i) => (
                                    <pre
                                        key={i}
                                        className="bg-[var(--text-primary)] text-[var(--bg-cream-50)] rounded-xl px-4 py-3 text-[13px] font-mono overflow-x-auto shadow-sm"
                                    >
                                        {line}
                                    </pre>
                                ))}
                            </div>
                        )}

                        {section.citation && (
                            <Reveal>
                                <CiteThisWork {...section.citation} />
                            </Reveal>
                        )}

                        {section.ecosystem && <EcosystemBanner {...section.ecosystem} />}

                        {section.links && (
                            <div className="flex flex-wrap gap-2.5 mt-6">
                                {section.links.map(renderLink)}
                            </div>
                        )}
                    </section>
                </Reveal>
                );
            })}
        </div>
    );
};

export default BlogContent;
