import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    MapPin,
    Briefcase,
    ChevronDown,
    ArrowUpRight,
    Search,
    X,
    Maximize2,
} from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import jobs from '../data/jobs.json';

const APPLY_URL = 'https://forms.gle/PZAZ9rVnYcZvUxx97';
const DEFAULT_LOCATION = 'Chennai (Hybrid)';
const CATEGORIES = [
    'Research',
    'Product Engineering',
    'Data Operations',
    'Partnership',
    'Pedagogy',
    'Business Operations',
];
const TABS = [
    { key: 'hiring', label: 'Hiring' },
    { key: 'closed', label: 'Closed' },
];
const STATUS_TO_TAB = { active: 'hiring', closed: 'closed' };

const visibleJobs = jobs.filter((job) => !job.hold);

const isPastClosingDate = (job) => {
    if (!job.closingDate) return false;
    return new Date(`${job.closingDate}T23:59:59`) < new Date();
};

const effectiveStatus = (job) =>
    job.status === 'active' && isPastClosingDate(job) ? 'closed' : job.status;

const collapsedGroups = () => Object.fromEntries(CATEGORIES.map((category) => [category, false]));
const expandedGroups = () => Object.fromEntries(CATEGORIES.map((category) => [category, true]));

const jobSearchText = new Map(
    visibleJobs.map((job) => [
        job.id,
        [
            job.title,
            job.category,
            job.experience,
            job.location || DEFAULT_LOCATION,
            job.about,
            ...job.responsibilities,
            ...job.required,
            ...job.preferred,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase(),
    ])
);

const matchesSearch = (job, tokens) => {
    if (tokens.length === 0) return true;
    const haystack = jobSearchText.get(job.id);
    return tokens.every((token) => haystack.includes(token));
};

const Highlight = ({ text, tokens }) => {
    if (!tokens?.length || !text) return text;

    const pattern = tokens
        .slice()
        .sort((a, b) => b.length - a.length)
        .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');
    const parts = String(text).split(new RegExp(`(${pattern})`, 'gi'));

    return (
        <>
            {parts.map((part, index) =>
                index % 2 === 1 ? (
                    <mark key={index} className="bg-orange-200 text-[#1A1A1A] rounded-sm px-0.5">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </>
    );
};

const JobCard = ({ job, index, tokens }) => {
    const [expanded, setExpanded] = useState(false);
    const isOpen = effectiveStatus(job) === 'active';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
            <div
                className="p-6 md:p-7 cursor-pointer flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
                onClick={() => setExpanded((current) => !current)}
            >
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-semibold text-[#1A1A1A] mb-2 leading-snug">
                        <Highlight text={job.title} tokens={tokens} />
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1">
                            <MapPin size={14} />
                            <Highlight text={job.location || DEFAULT_LOCATION} tokens={tokens} />
                        </span>
                        {job.experience && (
                            <span className="inline-flex items-center gap-1">
                                <Briefcase size={14} />
                                <Highlight text={job.experience} tokens={tokens} />
                            </span>
                        )}
                        {!isOpen && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                Closed
                            </span>
                        )}
                    </div>
                    <p className={`text-gray-600 text-sm mt-3 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
                        <Highlight text={job.about} tokens={tokens} />
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    {isOpen && (
                        <a
                            href={APPLY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#0a0a0a] text-white text-sm font-medium py-2.5 px-5 rounded-lg hover:bg-black transition-colors"
                            onClick={(event) => event.stopPropagation()}
                        >
                            Apply Now
                            <ArrowUpRight size={14} />
                        </a>
                    )}
                    <button
                        className={`p-2 rounded-full hover:bg-gray-100 transition-all ${expanded ? 'rotate-180' : ''}`}
                        aria-label={expanded ? `Hide details for ${job.title}` : `Show details for ${job.title}`}
                        aria-expanded={expanded}
                    >
                        <ChevronDown size={20} className="text-gray-400" />
                    </button>
                </div>
            </div>

            <motion.div
                initial={false}
                animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
                inert={!expanded ? true : undefined}
            >
                <div className="px-6 md:px-8 pb-8 pt-0 border-t border-gray-100">
                    <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {[
                            ['Key Responsibilities', job.responsibilities],
                            ['Required Qualifications', job.required],
                            ['Preferred Qualifications', job.preferred],
                        ].map(([heading, items]) => (
                            <div key={heading}>
                                <h4 className="text-sm font-semibold text-[var(--text-orange-500)] uppercase tracking-wide mb-3">
                                    {heading}
                                </h4>
                                <ul className="space-y-2">
                                    {items.map((item) => (
                                        <li key={item} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                                            <span className="text-[var(--text-orange-500)] mt-1 flex-shrink-0">•</span>
                                            <Highlight text={item} tokens={tokens} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {isOpen ? (
                        <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                            <a
                                href={APPLY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-[#0a0a0a] text-white text-sm font-medium py-2.5 px-6 rounded-lg hover:bg-black transition-colors"
                            >
                                Apply for {job.title}
                                <ArrowUpRight size={14} />
                            </a>
                        </div>
                    ) : (
                        <div className="mt-8 pt-6 border-t border-gray-50">
                            <p className="text-sm text-gray-400">This role is not accepting applications right now.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

const CategoryGroup = ({ category, jobs: groupJobs, isOpen, onToggle, tokens }) => (
    <div className="bg-white/60 rounded-2xl border border-gray-100 overflow-hidden">
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className="w-full flex items-center gap-3 px-5 md:px-6 py-4 text-left hover:bg-white transition-colors group"
        >
            <ChevronDown
                size={20}
                className={`text-[var(--text-orange-500)] flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-0' : '-rotate-90'
                }`}
            />
            <span className="text-base md:text-lg font-semibold text-[#1A1A1A] group-hover:text-[var(--text-orange-500)] transition-colors">
                <Highlight text={category} tokens={tokens} />
            </span>
            <span className="text-xs font-semibold rounded-full px-2 py-0.5 bg-orange-100 text-[var(--text-orange-500)]">
                {groupJobs.length}
            </span>
            <span className="ml-auto text-xs text-gray-400 hidden sm:block">{isOpen ? 'Collapse' : 'Expand'}</span>
        </button>
        <motion.div
            initial={false}
            animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
            inert={!isOpen ? true : undefined}
        >
            <div className="px-3 md:px-4 pb-4 space-y-3">
                {groupJobs.map((job, index) => (
                    <JobCard key={job.id} job={job} index={index} tokens={tokens} />
                ))}
            </div>
        </motion.div>
    </div>
);

const CareersPage = () => {
    const [tab, setTab] = useState('hiring');
    const [query, setQuery] = useState('');
    const [openGroups, setOpenGroups] = useState(collapsedGroups);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const tokens = useMemo(
        () => query.trim().toLowerCase().split(/\s+/).filter(Boolean),
        [query]
    );
    const searching = tokens.length > 0;

    const grouped = useMemo(() => {
        const filtered = visibleJobs.filter(
            (job) => STATUS_TO_TAB[effectiveStatus(job)] === tab && matchesSearch(job, tokens)
        );
        return CATEGORIES.map((category) => ({
            category,
            jobs: filtered.filter((job) => job.category === category),
        })).filter((group) => group.jobs.length > 0);
    }, [tab, tokens]);

    const visibleCount = grouped.reduce((sum, group) => sum + group.jobs.length, 0);

    const tabCounts = useMemo(() => {
        const counts = { hiring: 0, closed: 0 };
        visibleJobs.forEach((job) => {
            if (matchesSearch(job, tokens)) {
                counts[STATUS_TO_TAB[effectiveStatus(job)]] += 1;
            }
        });
        return counts;
    }, [tokens]);

    useEffect(() => {
        setOpenGroups(searching ? expandedGroups() : collapsedGroups());
    }, [searching]);

    const switchTab = (next) => {
        setTab(next);
        setOpenGroups(searching ? expandedGroups() : collapsedGroups());
    };

    const allExpanded = grouped.length > 0 && grouped.every((group) => openGroups[group.category]);

    return (
        <div className="min-h-screen bg-[var(--bg-cream-50)] flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col">
                <div className="pt-12 pb-6 px-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-semibold text-[#1A1A1A] mb-4"
                        >
                            Join <span className="text-[var(--text-orange-500)]">Bodhan AI</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="text-gray-500 text-lg max-w-2xl mx-auto mb-2"
                        >
                            Help us build AI that transforms how India learns, teaches, and grows.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="inline-flex items-center gap-1.5 text-sm text-gray-400 mt-2"
                        >
                            <MapPin size={14} />
                            Most positions are based in Chennai (Hybrid)
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-6 mb-5 w-full">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.28 }}
                        className="flex border-b border-gray-200"
                    >
                        {TABS.map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => switchTab(item.key)}
                                aria-selected={tab === item.key}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                                    tab === item.key
                                        ? 'border-[var(--text-orange-500)] text-[var(--text-orange-500)]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {item.label}
                                <span
                                    className={`text-xs font-semibold rounded-full px-1.5 py-0.5 ${
                                        tab === item.key
                                            ? 'bg-orange-100 text-[var(--text-orange-500)]'
                                            : 'bg-gray-100 text-gray-500'
                                    }`}
                                >
                                    {tabCounts[item.key]}
                                </span>
                            </button>
                        ))}
                    </motion.div>
                </div>

                <div className="max-w-5xl mx-auto px-6 mb-6 w-full">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder={`Search ${tab === 'hiring' ? 'open' : 'closed'} roles by title or description…`}
                                aria-label={`Search ${tab} roles`}
                                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[var(--text-orange-500)] focus:ring-2 focus:ring-orange-100 transition-colors [&::-webkit-search-cancel-button]:hidden"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                        {grouped.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setOpenGroups(allExpanded ? collapsedGroups() : expandedGroups())}
                                className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[var(--text-orange-500)] bg-white border border-gray-200 hover:border-orange-200 rounded-xl px-4 py-2.5 transition-colors flex-shrink-0"
                            >
                                <Maximize2 size={14} />
                                {allExpanded ? 'Collapse all' : 'Expand all'}
                            </button>
                        )}
                    </div>
                    {searching && (
                        <p className="text-xs text-gray-400 mt-2.5">
                            {visibleCount} {visibleCount === 1 ? 'role' : 'roles'} in{' '}
                            <span className="font-medium text-gray-500">{tab === 'hiring' ? 'Hiring' : 'Closed'}</span>{' '}
                            match “{query.trim()}”
                            {tabCounts[tab === 'hiring' ? 'closed' : 'hiring'] > 0 && (
                                <>
                                    {' '}
                                    ·{' '}
                                    <button
                                        type="button"
                                        onClick={() => switchTab(tab === 'hiring' ? 'closed' : 'hiring')}
                                        className="text-[var(--text-orange-500)] hover:underline font-medium"
                                    >
                                        {tabCounts[tab === 'hiring' ? 'closed' : 'hiring']} in{' '}
                                        {tab === 'hiring' ? 'Closed' : 'Hiring'}
                                    </button>
                                </>
                            )}
                        </p>
                    )}
                </div>

                <div className="max-w-5xl mx-auto px-6 pb-20 w-full">
                    <AnimatePresence mode="wait">
                        {grouped.length > 0 ? (
                            <motion.div
                                key={tab}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-3"
                            >
                                {grouped.map((group) => (
                                    <CategoryGroup
                                        key={group.category}
                                        category={group.category}
                                        jobs={group.jobs}
                                        tokens={tokens}
                                        isOpen={!!openGroups[group.category]}
                                        onToggle={() =>
                                            setOpenGroups((current) => ({
                                                ...current,
                                                [group.category]: !current[group.category],
                                            }))
                                        }
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`${tab}-empty`}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-20"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                    <Search size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">
                                    {searching
                                        ? `No ${tab === 'hiring' ? 'open' : 'closed'} roles match “${query.trim()}”.`
                                        : `No ${tab === 'hiring' ? 'open' : 'closed'} roles at the moment.`}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {searching
                                        ? 'Try a different keyword, or check the other tab.'
                                        : 'Check back soon for new opportunities.'}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CareersPage;
