import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, ChevronDown, CircleDollarSign, Menu, X } from 'lucide-react';
import gsap from 'gsap';

import Icon from '../../../assets/Icon.png';
import MoELogo from '../../../assets/Ministry_of_Education_India.png';
import Wordmark from '../../../components/Wordmark';
import ModelIcon from '../../developers/components/ModelIcon';
import { models } from '../../developers/data/models';
import { CONSOLE_URL } from '../../../config/links';

const researchDropdown = [
    {
        label: 'Research Problems',
        to: '/research/problems',
        description: 'Open problems in AI for education',
    },
    { label: 'Blog', to: '/research/blogs', description: 'Technical posts and releases' },
    { label: 'Publications', to: '/research/publications', description: 'Papers and formal publications' },
];

const developersApis = models.map((model) => ({
    label: model.name,
    to: model.href,
    description: model.codename,
    icon: model.icon,
    accent: model.accent,
}));

const RESOURCE_ICONS = {
    docs: BookOpen,
    pricing: CircleDollarSign,
};

// One accent for the whole list: the entries used to carry a colour each —
// emerald, blue, orange, grey — which read as four unrelated things rather than
// one list. They all take the site's primary orange now.
const developersResources = [
    { label: 'Documentation', to: '#', description: 'Guides and API reference', resourceIcon: 'docs', accent: 'var(--text-orange-500)' },
    { label: 'API Pricing', to: '#', description: 'Usage-based pricing', resourceIcon: 'pricing', accent: 'var(--text-orange-500)' },
];

const developersDropdown = [...developersApis, { label: 'All models', to: '/developers', description: 'Browse every Bodhan model' }];

const productsDropdown = [
    { label: 'Student Tutor Bot', to: 'https://students.bodhan.ai', description: 'AI-powered study companion for students' },
    { label: 'Teacher Assistant Bot', to: 'https://teachers.bodhan.ai/', description: 'Smart teaching assistant for educators' },
];

const navLinks = [
    { label: 'Research', to: '/research', children: researchDropdown, match: '/research' },
    {
        label: 'Developers',
        to: '/developers',
        children: developersDropdown,
        mega: { apis: developersApis, resources: developersResources },
        match: '/developers',
    },
    { label: 'Products', to: '#', children: productsDropdown, match: '/products' },
    { label: 'Team', to: '/', scrollTo: 'team' },
    { label: 'Careers', to: '/careers' },
];

const isExternalLink = (to) => typeof to === 'string' && to.startsWith('http');

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [mobileMenu, setMobileMenu] = useState(null);
    const menuWrapRefs = useRef({});
    // Hover intent: leaving the trigger starts a short timer instead of closing at
    // once, so the pointer can cross the gap to the panel (or drift briefly off
    // the edge) without the menu vanishing. Re-entering cancels it.
    const closeTimer = useRef(null);
    const CLOSE_DELAY_MS = 220;
    const openMenuNow = (label) => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
        setOpenMenu(label);
    };
    const scheduleClose = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => {
            closeTimer.current = null;
            setOpenMenu(null);
        }, CLOSE_DELAY_MS);
    };
    useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
    const dropdownRefs = useRef({});
    const mobileRefs = useRef({});
    const location = useLocation();

    const isCreamPage =
        location.pathname.startsWith('/research') || location.pathname.startsWith('/developers');

    useEffect(() => {
        setIsOpen(false);
        setOpenMenu(null);
        setMobileMenu(null);
    }, [location.pathname]);

    useLayoutEffect(() => {
        const entries = Object.entries(dropdownRefs.current).filter(([, el]) => el);
        if (entries.length === 0) return undefined;

        const ctx = gsap.context(() => {
            entries.forEach(([label, el]) => {
                if (label === openMenu) {
                    gsap.fromTo(
                        el,
                        { autoAlpha: 0, y: -6, scale: 0.98, transformOrigin: 'top center' },
                        { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, ease: 'power3.out' }
                    );
                    gsap.fromTo(
                        el.querySelectorAll('[data-dropdown-item]'),
                        { y: 10, autoAlpha: 0 },
                        {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.38,
                            stagger: 0.045,
                            delay: 0.03,
                            ease: 'power3.out',
                        }
                    );
                } else {
                    gsap.to(el, { autoAlpha: 0, y: -6, scale: 0.98, duration: 0.2, ease: 'power2.in' });
                }
            });
        });

        return () => ctx.revert();
    }, [openMenu]);

    useLayoutEffect(() => {
        const entries = Object.entries(mobileRefs.current).filter(([, el]) => el);
        if (entries.length === 0) return undefined;

        const ctx = gsap.context(() => {
            entries.forEach(([label, el]) => {
                if (label === mobileMenu) {
                    gsap.fromTo(
                        el,
                        { height: 0, opacity: 0 },
                        {
                            height: 'auto',
                            opacity: 1,
                            duration: 0.32,
                            ease: 'power3.out',
                            onComplete: () => gsap.set(el, { clearProps: 'height' }),
                        }
                    );
                    gsap.fromTo(
                        el.querySelectorAll('[data-mobile-item]'),
                        { x: -8, autoAlpha: 0 },
                        { x: 0, autoAlpha: 1, duration: 0.3, stagger: 0.04, delay: 0.06, ease: 'power2.out' }
                    );
                } else {
                    gsap.to(el, { height: 0, opacity: 0, duration: 0.24, ease: 'power2.in' });
                }
            });
        });

        return () => ctx.revert();
    }, [mobileMenu]);

    useEffect(() => {
        if (!openMenu) return undefined;

        const onPointerDown = (event) => {
            if (!menuWrapRefs.current[openMenu]?.contains(event.target)) {
                setOpenMenu(null);
            }
        };

        const onKeyDown = (event) => {
            if (event.key === 'Escape') setOpenMenu(null);
        };

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [openMenu]);

    const handleNavClick = (link) => {
        setIsOpen(false);
        setOpenMenu(null);
        setMobileMenu(null);
        if (!link.scrollTo) {
            window.scrollTo(0, 0);
        }
    };

    const linkClass = 'nav-top-link';
    // Plain links light up on their own section; Team scrolls on the home page
    // and never reads as "current".
    const isTopActive = (link) =>
        !link.scrollTo && link.to !== '/' && location.pathname.startsWith(link.to);

    const renderLink = (link, className) => {
        if (link.children) {
            return null;
        }

        if (link.scrollTo) {
            return (
                <Link
                    to={link.to}
                    state={{ scrollTo: link.scrollTo }}
                    className={className}
                    onClick={() => handleNavClick(link)}
                >
                    {link.label}
                </Link>
            );
        }

        return (
            <Link to={link.to} className={className} onClick={() => handleNavClick(link)}>
                {link.label}
            </Link>
        );
    };

    const isChildActive = (to) => {
        if (to === '/research' || to === '/developers') return location.pathname === to;
        return location.pathname === to || location.pathname.startsWith(`${to}/`);
    };

    const renderNavItem = (child, { active, dataAttr, hideArrow = false }) => {
        const className = `nav-research-item group ${active ? 'is-active' : ''}`;
        const style = child.accent ? { '--model-accent': child.accent } : undefined;
        const onClick = () => handleNavClick(child);

        const ResourceIcon = child.resourceIcon ? RESOURCE_ICONS[child.resourceIcon] : null;

        const body = (
            <>
                {child.icon ? (
                    <span className="nav-model-icon" aria-hidden="true">
                        <ModelIcon name={child.icon} size={16} />
                    </span>
                ) : ResourceIcon ? (
                    <span className="nav-model-icon" aria-hidden="true">
                        <ResourceIcon size={16} />
                    </span>
                ) : (
                    <span className="nav-research-item-indicator" aria-hidden="true" />
                )}
                <span className="min-w-0 flex-1">
                    <span className="nav-research-item-label">{child.label}</span>
                    {child.description && (
                        <span className="nav-research-item-desc">{child.description}</span>
                    )}
                </span>
                {!hideArrow && (
                    <ArrowRight size={14} className="nav-research-item-arrow" aria-hidden="true" />
                )}
            </>
        );

        if (isExternalLink(child.to)) {
            return (
                <a
                    key={child.label}
                    href={child.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...(dataAttr ? { [dataAttr]: true } : {})}
                    className={className}
                    style={style}
                    onClick={onClick}
                >
                    {body}
                </a>
            );
        }

        return (
            <Link
                key={child.label}
                to={child.to}
                {...(dataAttr ? { [dataAttr]: true } : {})}
                className={className}
                style={style}
                onClick={onClick}
            >
                {body}
            </Link>
        );
    };

    return (
        <nav
            className={`sticky top-0 z-50 w-full backdrop-blur-sm border-b ${
                isCreamPage
                    ? 'bg-[var(--bg-cream-50)]/95 border-[var(--primary-100)]'
                    : 'bg-[var(--navbar-bg)]/95 border-[var(--primary-100)]'
            }`}
        >
            <div className="max-w-6xl lg:max-w-[88rem] mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
                    <Link
                        to="/"
                        onClick={() => window.scrollTo(0, 0)}
                        className="flex items-center gap-1.5 shrink-0"
                    >
                        <img src={Icon} alt="Bodhan" className="h-8 md:h-9 w-auto object-contain" />
                        <Wordmark className="hidden sm:inline text-[1.35rem] md:text-2xl leading-none whitespace-nowrap" />
                        <div className="w-px h-9 bg-[var(--primary-100)] mx-2.5" />
                        <img
                            src={MoELogo}
                            alt="Ministry of Education"
                            className="h-9 md:h-11 w-auto object-contain"
                        />
                    </Link>

                    <div className="hidden lg:flex items-center gap-1 ml-8">
                        {navLinks.map((link) => {
                            if (link.children) {
                                const menuActive = link.match && location.pathname.startsWith(link.match);
                                const isThisOpen = openMenu === link.label;
                                return (
                                    <div
                                        key={link.label}
                                        ref={(el) => {
                                            menuWrapRefs.current[link.label] = el;
                                        }}
                                        className="relative"
                                        onMouseEnter={() => openMenuNow(link.label)}
                                        onMouseLeave={scheduleClose}
                                    >
                                        <button
                                            type="button"
                                            className={`${linkClass} ${menuActive ? 'is-active' : ''} ${
                                                isThisOpen ? 'is-open' : ''
                                            }`}
                                            aria-expanded={isThisOpen}
                                            aria-haspopup="true"
                                            onClick={() => setOpenMenu((current) => (current === link.label ? null : link.label))}
                                        >
                                            {link.label}
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-300 ${
                                                    isThisOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>

                                        {/* The outer div only positions (centred under the trigger); GSAP
                                            animates the inner one, so its transform never fights the centring. */}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 pointer-events-none">
                                        <div
                                            ref={(el) => {
                                                dropdownRefs.current[link.label] = el;
                                            }}
                                            className="invisible opacity-0 pointer-events-auto"
                                        >
                                            {link.mega ? (
                                                <div className="nav-research-dropdown nav-mega-dropdown rounded-2xl overflow-hidden">
                                                    <div className="nav-research-dropdown-glow" aria-hidden="true" />
                                                    {/* Two columns: the model APIs on the left, Resources
                                                        beside them rather than stacked underneath. */}
                                                    <div className="nav-mega-grid relative">
                                                        <div className="nav-mega-col">
                                                            <p className="nav-mega-col-title">APIs</p>
                                                            {link.mega.apis.map((child) =>
                                                                renderNavItem(child, {
                                                                    active: isChildActive(child.to),
                                                                    dataAttr: 'data-dropdown-item',
                                                                    hideArrow: true,
                                                                })
                                                            )}
                                                            <Link
                                                                to="/developers"
                                                                data-dropdown-item
                                                                onClick={() => handleNavClick({})}
                                                                className="nav-mega-viewall"
                                                            >
                                                                View all models
                                                            </Link>
                                                        </div>
                                                        <div className="nav-mega-col nav-mega-col-resources">
                                                            <p className="nav-mega-col-title">Resources</p>
                                                            {link.mega.resources.map((child) =>
                                                                renderNavItem(child, {
                                                                    active: false,
                                                                    dataAttr: 'data-dropdown-item',
                                                                    hideArrow: true,
                                                                })
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`nav-research-dropdown rounded-2xl overflow-hidden ${
                                                        link.children.some((child) => child.icon) ? 'w-80' : 'w-72'
                                                    }`}
                                                >
                                                    <div className="nav-research-dropdown-glow" aria-hidden="true" />
                                                    <div className="relative p-2">
                                                        {link.children.map((child) =>
                                                            renderNavItem(child, {
                                                                active: isChildActive(child.to),
                                                                dataAttr: 'data-dropdown-item',
                                                            })
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <span key={link.label}>
                                    {renderLink(link, `${linkClass} ${isTopActive(link) ? 'is-active' : ''}`)}
                                </span>
                            );
                        })}

                        <a href={CONSOLE_URL} className="nav-dashboard-btn ml-3">
                            Go to API Console
                            <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden text-[var(--text-primary)] hover:text-[var(--text-orange-500)] transition-colors p-2 -mr-2"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div
                    className={`lg:hidden border-t border-[var(--primary-100)] ${
                        isCreamPage ? 'bg-[var(--bg-cream-50)]' : 'bg-[var(--navbar-bg)]'
                    }`}
                >
                    <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
                        <Link
                            to="/"
                            className="text-base text-[var(--color-10)] hover:text-[var(--text-orange-500)] py-2.5 transition-colors"
                            onClick={() => {
                                setIsOpen(false);
                                window.scrollTo(0, 0);
                            }}
                        >
                            Home
                        </Link>
                        {navLinks.map((link) => {
                            if (link.children) {
                                const menuActive = link.match && location.pathname.startsWith(link.match);
                                const isThisOpen = mobileMenu === link.label;
                                return (
                                    <div key={link.label} className="py-1">
                                        <button
                                            type="button"
                                            className={`w-full flex items-center justify-between text-base py-2.5 transition-colors ${
                                                menuActive
                                                    ? 'text-[var(--text-orange-500)] font-medium'
                                                    : 'text-[var(--color-10)]'
                                            }`}
                                            onClick={() => setMobileMenu((current) => (current === link.label ? null : link.label))}
                                            aria-expanded={isThisOpen}
                                        >
                                            {link.label}
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform duration-300 ${
                                                    isThisOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        <div
                                            ref={(el) => {
                                                mobileRefs.current[link.label] = el;
                                            }}
                                            className="overflow-hidden"
                                            style={{ height: 0, opacity: 0 }}
                                        >
                                            <div className="ml-3 pl-3 border-l border-[var(--primary-100)] flex flex-col gap-0.5 pb-2">
                                                {link.mega ? (
                                                    <>
                                                        <p className="pt-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-14)]">
                                                            APIs
                                                        </p>
                                                        {link.mega.apis.map((child) => {
                                                            const className = `py-2 text-sm transition-colors ${
                                                                isChildActive(child.to)
                                                                    ? 'text-[var(--text-orange-500)] font-medium'
                                                                    : 'text-[var(--color-10)] hover:text-[var(--text-orange-500)]'
                                                            }`;
                                                            return isExternalLink(child.to) ? (
                                                                <a
                                                                    key={child.label}
                                                                    href={child.to}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    data-mobile-item
                                                                    onClick={() => handleNavClick(child)}
                                                                    className={className}
                                                                >
                                                                    {child.label}
                                                                </a>
                                                            ) : (
                                                                <Link
                                                                    key={child.label}
                                                                    to={child.to}
                                                                    data-mobile-item
                                                                    onClick={() => handleNavClick(child)}
                                                                    className={className}
                                                                >
                                                                    {child.label}
                                                                </Link>
                                                            );
                                                        })}
                                                        <Link
                                                            to="/developers"
                                                            data-mobile-item
                                                            onClick={() => handleNavClick({})}
                                                            className="py-2 text-sm text-[var(--color-11)] hover:text-[var(--text-orange-500)]"
                                                        >
                                                            View all models
                                                        </Link>
                                                        <p className="pt-2 text-[11px] font-bold uppercase tracking-wider text-[var(--color-14)]">
                                                            Resources
                                                        </p>
                                                        {link.mega.resources.map((child) =>
                                                            isExternalLink(child.to) ? (
                                                                <a
                                                                    key={child.label}
                                                                    href={child.to}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    data-mobile-item
                                                                    onClick={() => handleNavClick(child)}
                                                                    className="py-2 text-sm text-[var(--color-10)] hover:text-[var(--text-orange-500)]"
                                                                >
                                                                    {child.label}
                                                                </a>
                                                            ) : (
                                                                <Link
                                                                    key={child.label}
                                                                    to={child.to}
                                                                    data-mobile-item
                                                                    onClick={() => handleNavClick(child)}
                                                                    className="py-2 text-sm text-[var(--color-10)] hover:text-[var(--text-orange-500)]"
                                                                >
                                                                    {child.label}
                                                                </Link>
                                                            )
                                                        )}
                                                    </>
                                                ) : (
                                                    link.children.map((child) =>
                                                        isExternalLink(child.to) ? (
                                                            <a
                                                                key={child.label}
                                                                href={child.to}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                data-mobile-item
                                                                onClick={() => handleNavClick(child)}
                                                                className={`py-2 text-sm transition-colors ${
                                                                    isChildActive(child.to)
                                                                        ? 'text-[var(--text-orange-500)] font-medium'
                                                                        : 'text-[var(--color-10)] hover:text-[var(--text-orange-500)]'
                                                                }`}
                                                            >
                                                                {child.label}
                                                            </a>
                                                        ) : (
                                                            <Link
                                                                key={child.label}
                                                                to={child.to}
                                                                data-mobile-item
                                                                onClick={() => handleNavClick(child)}
                                                                className={`py-2 text-sm transition-colors ${
                                                                    isChildActive(child.to)
                                                                        ? 'text-[var(--text-orange-500)] font-medium'
                                                                        : 'text-[var(--color-10)] hover:text-[var(--text-orange-500)]'
                                                                }`}
                                                            >
                                                                {child.label}
                                                            </Link>
                                                        )
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <span key={link.label}>
                                    {renderLink(
                                        link,
                                        'block text-base text-[var(--color-10)] hover:text-[var(--text-orange-500)] py-2.5 transition-colors'
                                    )}
                                </span>
                            );
                        })}

                        <a href={CONSOLE_URL} className="nav-dashboard-btn nav-dashboard-btn-mobile">
                            Go to API Console
                            <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
