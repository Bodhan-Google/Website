import { useEffect, useState } from 'react';
import { cn } from '../../../utils/tailwindUtils';

const TableOfContents = ({ sections, className }) => {
    const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const observers = [];

        sections.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (!element) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveId(id);
                    }
                },
                { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
            );

            observer.observe(element);
            observers.push(observer);
        });

        return () => observers.forEach((observer) => observer.disconnect());
    }, [sections]);

    const handleClick = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveId(id);
        }
    };

    return (
        <>
            <div
                className="hidden xl:block fixed left-0 top-0 bottom-0 w-14 z-40"
                onMouseEnter={() => setExpanded(true)}
                aria-hidden="true"
            />

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

            <nav
                aria-label="Table of contents"
                className={cn(
                    'research-toc xl:hidden mb-10 pb-6 border-b research-divider',
                    className
                )}
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
        </>
    );
};

export default TableOfContents;
