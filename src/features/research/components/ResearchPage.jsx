import { useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap, useGsapAnimation } from '../../../utils/motion';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import { visiblePosts, formatDate, postPath } from '../data/posts';
import { cn } from '../../../utils/tailwindUtils';

const VIEW_CONFIG = {
    blog: {
        title: 'Blogs',
        subtitle: 'Technical posts, model releases, and research updates from Bodhan.',
        listTitle: 'Latest posts',
        emptyMessage: 'No blog posts yet.',
    },
    publications: {
        title: 'Publications',
        subtitle: 'Papers, formal releases, and research publications.',
        emptyMessage: 'No publications yet.',
        listTitle: 'All publications',
    },
};

// The research overview page was removed, so the two listings are all that is
// left under /research: anything that is not /publications is the blog.
const getViewFromPath = (pathname) =>
    pathname.endsWith('/publications') ? 'publications' : 'blog';

const ResearchPage = () => {
    const location = useLocation();
    const view = getViewFromPath(location.pathname);
    const config = VIEW_CONFIG[view];

    const pageRef = useRef(null);
    const postListRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Through the guarded hook, so a listing opened in a background tab is never
    // left sitting at opacity 0 with its posts underneath.
    useGsapAnimation(
        () => {
            const tl = gsap.timeline();

            tl.from('[data-research-title]', {
                y: 32,
                opacity: 0,
                duration: 0.85,
                ease: 'power3.out',
            });

            tl.from(
                '[data-research-subtitle]',
                {
                    y: 18,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power3.out',
                },
                '-=0.5'
            );

            tl.from(
                '[data-research-content]',
                {
                    y: 24,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                },
                '-=0.4'
            );
        },
        pageRef,
        [view]
    );

    useGsapAnimation(
        () => {
            gsap.fromTo(
                '[data-publication-row]',
                { y: 18, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.55,
                    stagger: 0.075,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity',
                }
            );
        },
        postListRef,
        [view]
    );

    const filteredPosts = useMemo(
        () =>
            // The two listings partition the posts: formal publications on one
            // side, releases and milestones (the blog) on the other.
            view === 'publications'
                ? visiblePosts.filter((post) => post.category === 'Publication')
                : visiblePosts.filter((post) => post.category !== 'Publication'),
        [view]
    );

    return (
        <div ref={pageRef} className="min-h-screen research-page">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6">
                <div className="pt-12 md:pt-16 pb-8 md:pb-12">
                    <p className="research-type-eyebrow text-[var(--text-orange-500)] mb-3">
                        Research
                        <span className="mx-2 text-[var(--color-14)]">·</span>
                        <span className="text-[var(--color-11)]">{config.title}</span>
                    </p>
                    <h1
                        data-research-title
                        className="text-4xl md:text-5xl font-semibold text-[var(--text-primary)] tracking-tight"
                    >
                        {config.title}
                    </h1>
                    {config.subtitle && (
                        <p
                            data-research-subtitle
                            className="mt-4 max-w-2xl text-[var(--color-10)] leading-relaxed font-serif text-[17px]"
                        >
                            {config.subtitle}
                        </p>
                    )}
                </div>

                <section className="py-12 md:pb-16" data-research-content>
                    {config.listTitle && (
                        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-8">
                            {config.listTitle}
                        </h2>
                    )}

                    <div ref={postListRef} className="divide-y divide-[var(--primary-100)]">
                        {filteredPosts.map((post) => {
                            // A disabled post is listed but not open yet: same row, inert and muted.
                            const Row = post.disabled ? 'div' : Link;
                            const rowProps = post.disabled
                                ? { 'aria-disabled': true }
                                : { to: postPath(post) };
                            return (
                            <Row
                                key={post.slug}
                                {...rowProps}
                                data-publication-row
                                className={cn(
                                    'grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-12 py-8 group -mx-4 px-4 rounded-lg transition-colors',
                                    post.disabled
                                        ? 'opacity-60 cursor-default select-none'
                                        : 'hover:bg-[var(--bg-cream-50)]/60'
                                )}
                            >
                                <div>
                                    <p className="text-sm text-[var(--color-10)]">
                                        {post.category}
                                        {post.disabled && (
                                            <span className="ml-2 inline-block rounded-full border border-[var(--primary-100)] px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-11)]">
                                                Coming soon
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-sm text-[var(--color-11)] mt-1">
                                        {post.dateLabel ?? formatDate(post.date)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className={cn('text-xl md:text-2xl font-semibold text-[var(--text-primary)] transition-colors mb-2 leading-snug', !post.disabled && 'group-hover:text-[var(--text-orange-500)]')}>
                                        {post.title}
                                    </h3>
                                    <p className="text-[var(--color-10)] leading-relaxed font-serif text-[17px]">
                                        {post.summary}
                                    </p>
                                </div>
                            </Row>
                            );
                        })}
                    </div>

                    {filteredPosts.length === 0 && (
                        <p className="text-[var(--color-11)] py-12 text-center">
                            {config.emptyMessage}
                        </p>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ResearchPage;
