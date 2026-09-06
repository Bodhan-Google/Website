import { useEffect, useState } from 'react';
import { cn } from '../../../utils/tailwindUtils';

/**
 * Section rail (desktop) and "On this page" pills (smaller screens), shared by
 * every publication and blog post.
 *
 * The active section is the last one whose top has passed the reading line,
 * measured on every scroll from the page's own viewport. That holds for
 * headings inside a same-origin frame too: `getElement` resolves an id to its
 * element (default: this document), and positions are corrected by the frame's
 * offset. `railOnly` drops the inline pill list for the posts whose frame
 * already carries its own hero.
 */
const NAV_OFFSET = 96; // fixed navbar plus breathing room

const viewportTop = (element) => {
    let top = element.getBoundingClientRect().top;
    const doc = element.ownerDocument;
    if (doc !== document) {
        const frame = doc.defaultView?.frameElement;
        if (frame) top += frame.getBoundingClientRect().top;
    }
    return top;
};

const TableOfContents = ({ sections, className, getElement, railOnly = false }) => {
    const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const resolve = getElement ?? ((id) => document.getElementById(id));
        let raf = 0;
        const spy = () => {
            raf = 0;
            if (!sections.length) return;
            const line = Math.max(NAV_OFFSET + 24, window.innerHeight * 0.3);
            let current = sections[0].id;
            sections.forEach(({ id }) => {
                const element = resolve(id);
                if (element && viewportTop(element) <= line) current = id;
            });
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
            if (atBottom) current = sections[sections.length - 1].id;
            setActiveId((previous) => (previous === current ? previous : current));
        };
        const schedule = () => {
            if (!raf) raf = window.requestAnimationFrame(spy);
        };
        schedule();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        return () => {
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            if (raf) window.cancelAnimationFrame(raf);
        };
    }, [sections, getElement]);

    const handleClick = (id) => {
        const resolve = getElement ?? ((key) => document.getElementById(key));
        const element = resolve(id);
        if (!element) return;
        window.scrollTo({ top: window.scrollY + viewportTop(element) - NAV_OFFSET, behavior: 'smooth' });
        setActiveId(id);
    };

    return (
        <>
            {/* Labels appear on hover of the rail itself. An invisible catch-strip
                along the window edge used to open them, which fired whenever the
                pointer happened to rest there while scrolling. */}
            <nav
                aria-label="Table of contents"
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
                className={cn('research-toc hidden xl:block fixed z-50 left-5', className)}
                style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
                <ul className="space-y-3">
                    {sections.map(({ id, title }) => {
                        const isActive = activeId === id;
                        return (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => handleClick(id)}
                                    className={cn(
                                        'group flex items-start w-full text-left transition-colors duration-250',
                                        isActive
                                            ? 'text-[var(--text-orange-500)]'
                                            : 'text-[var(--color-11)] hover:text-[var(--text-primary)]'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'mt-[0.5rem] h-px shrink-0 transition-all duration-300 ease-out',
                                            isActive
                                                ? 'w-6 bg-gradient-to-r from-[var(--text-orange-500)] to-[var(--text-orange-400)]'
                                                : 'w-3 bg-[var(--color-14)] group-hover:w-5 group-hover:bg-[var(--color-11)]'
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            'text-[12.5px] leading-snug whitespace-nowrap overflow-hidden transition-all duration-300 ease-out',
                                            isActive && 'font-medium',
                                            expanded
                                                ? 'max-w-[12rem] opacity-100 ml-2.5'
                                                : 'max-w-0 opacity-0 ml-0'
                                        )}
                                    >
                                        {title}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {!railOnly && (
                <nav
                    aria-label="Table of contents"
                    className={cn('research-toc xl:hidden mb-10 pb-6 border-b research-divider', className)}
                >
                    <p className="research-type-eyebrow text-[var(--color-11)] mb-3">On this page</p>
                    <ul className="flex flex-wrap gap-x-1 gap-y-2">
                        {sections.map(({ id, title }) => (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => handleClick(id)}
                                    className={cn(
                                        'text-[12.5px] px-2.5 py-1 rounded-full transition-all duration-200',
                                        activeId === id
                                            ? 'text-[var(--text-orange-500)] bg-[var(--primary-100)] font-medium'
                                            : 'text-[var(--color-11)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-cream-100)]'
                                    )}
                                >
                                    {title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </>
    );
};

export default TableOfContents;
