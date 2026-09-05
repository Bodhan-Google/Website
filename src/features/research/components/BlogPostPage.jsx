import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gsap, useGsapAnimation } from '../../../utils/motion';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import TableOfContents from './TableOfContents';
import BlogContent from './BlogContent';
import ShareButton from './ShareButton';
import MosaicCanvas from './MosaicCanvas';
import SpecBubbles from './blocks/SpecBubbles';
import { getPostBySlug, formatDate } from '../data/posts';
import './blocks/blogTemplate.css';

const BlogPostPage = () => {
    const { slug } = useParams();
    const post = getPostBySlug(slug);
    const pageRef = useRef(null);
    const progressRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // The reading-progress bar is decoration on an element that carries no content,
    // so it is set up unconditionally; everything below it moves the article's own
    // words and goes through the guarded hook.
    useLayoutEffect(() => {
        if (!post || !progressRef.current) return undefined;

        const tween = gsap.fromTo(
            progressRef.current,
            { scaleX: 0 },
            {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: pageRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.2,
                },
            }
        );

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, [post, slug]);

    useGsapAnimation(
        () => {
            const intro = gsap.timeline();

            intro.from('[data-article-intro]', {
                y: 22,
                opacity: 0,
                duration: 0.72,
                stagger: 0.09,
                ease: 'power3.out',
            });

            // The spec bubbles are the last thing to land, popping in one by
            // one under the title rather than arriving as one grey bar.
            intro.from(
                '.bt-spec',
                {
                    y: 14,
                    scale: 0.94,
                    opacity: 0,
                    duration: 0.45,
                    stagger: 0.05,
                    ease: 'back.out(1.7)',
                },
                '-=0.35'
            );

            // A shallow parallax on the hero mosaic, so the title separates
            // from its backdrop as the reader starts scrolling.
            gsap.to('.research-mosaic-layer', {
                yPercent: 12,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.research-hero-mosaic',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.4,
                },
            });
        },
        pageRef,
        [post, slug]
    );

    if (!post) {
        return (
            <div className="min-h-screen research-page">
                <Navbar />
                <div className="research-article-column mx-auto px-5 py-32 text-center">
                    <h1 className="text-xl font-medium text-[var(--text-primary)] mb-4">
                        Publication not found
                    </h1>
                    <Link
                        to="/research/blog"
                        className="text-[var(--text-orange-500)] hover:text-[var(--text-hover)] underline text-sm"
                    >
                        Back to Research
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // A section may hide its heading in the article (the motivation opener does)
    // while still needing a label to navigate to.
    const tocSections = post.sections.map(({ id, title, tocTitle }) => ({
        id,
        title: tocTitle ?? title,
    }));

    return (
        <div ref={pageRef} className="min-h-screen research-page">
            <div
                ref={progressRef}
                className="research-reading-progress"
                aria-hidden="true"
            />

            <Navbar />

            <header className="research-hero-atmosphere pt-10 md:pt-14 pb-8 md:pb-10">
                <div className="research-article-column mx-auto px-5 relative">
                    <p
                        data-article-intro
                        className="research-type-eyebrow text-[var(--text-orange-500)] mb-4 text-center"
                    >
                        {post.category}
                        <span className="mx-2 text-[var(--color-14)]">·</span>
                        <span className="text-[var(--color-11)]">{formatDate(post.date)}</span>
                    </p>

                    <div className="research-hero-mosaic">
                        <MosaicCanvas className="research-mosaic-layer" />
                        <div className="research-hero-mosaic-scrim" aria-hidden="true" />

                        <div className="research-hero-mosaic-content">
                            <div className="absolute top-4 right-4 md:top-5 md:right-5 z-10">
                                <ShareButton title={post.title} />
                            </div>

                            <h1
                                data-article-intro
                                className="research-type-title research-hero-mosaic-title text-[var(--text-primary)] mx-auto max-w-[38rem]"
                            >
                                {post.title}
                            </h1>

                            {post.tagline && (
                                <p
                                    data-article-intro
                                    className="bt-hero-tagline mt-3 mx-auto max-w-[34rem] text-center"
                                >
                                    {post.tagline}
                                </p>
                            )}

                            {post.heroLinks?.length > 0 && (
                                <nav
                                    aria-label="Publication links"
                                    data-article-intro
                                    className="flex flex-wrap items-center justify-center gap-2 mt-6"
                                >
                                    {post.heroLinks.map((link) => (
                                        <span key={link.label} className="inline-flex items-center">
                                            {link.href.startsWith('/') ? (
                                                <Link
                                                    to={link.href}
                                                    className="research-link-chip research-link-chip-on-mosaic inline-flex items-center gap-0.5"
                                                >
                                                    {link.label}
                                                </Link>
                                            ) : (
                                                <a
                                                    href={link.href}
                                                    target={link.href.startsWith('http') ? '_blank' : undefined}
                                                    {link.arrow && <span aria-hidden="true">{'\u00A0'}→</span>}
                                                    rel={
                                                        link.href.startsWith('http')
                                                            ? 'noopener noreferrer'
                                                            : undefined
                                                    }
                                                    className="research-link-chip research-link-chip-on-mosaic inline-flex items-center"
                                                >
                                                    {link.label}
                                                </a>
                                            )}
                                        </span>
                                    ))}
                                </nav>
                                                    {link.arrow && <span aria-hidden="true">{'\u00A0'}→</span>}
                            )}
                        </div>
                    </div>

                    {post.specs?.length > 0 && (
                        <SpecBubbles specs={post.specs} className="mt-5" />
                    )}
                </div>
            </header>

            <div className="relative pb-16 md:pb-24">
                <div className="research-article-column mx-auto px-5">
                    {post.heroSummary && (
                        <p data-article-intro className="research-type-dek mb-10 border-l-2 border-[var(--text-orange-500)]/40 pl-4 md:pl-5">
                            {post.heroSummary}
                        </p>
                    )}

                    <TableOfContents sections={tocSections} />

                    <article>
                        <BlogContent sections={post.sections} />
                    </article>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BlogPostPage;
