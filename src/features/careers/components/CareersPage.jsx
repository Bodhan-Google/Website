import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Briefcase, ChevronDown, ExternalLink, Search, X, Layers } from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import { jobPostings, CATEGORY_ORDER, TAB_FOR_STATUS, DEFAULT_LOCATION } from '../data/jobs';

const APPLY_URL = 'https://forms.gle/PZAZ9rVnYcZvUxx97';

/* Roles parked with `hold: true` are hidden from both tabs and from search. */
const liveJobs = jobPostings.filter((job) => !job.hold);

/* An open role with a past closingDate counts as closed without anyone editing the
   data — it drops out of Hiring, loses its Apply button, and appears under Closed.
   The role stays open through the whole of its closing date, and the cutoff is the
   visitor's local midnight (same convention as TendersPage). Evaluated per render,
   so a tab left open across midnight updates on the next interaction or reload. */
const isExpired = (job) =>
    !!job.closingDate && new Date(`${job.closingDate}T23:59:59`) < new Date();

const effectiveStatus = (job) => (job.status === 'active' && isExpired(job) ? 'closed' : job.status);

const TABS = [
    { key: 'hiring', label: 'Hiring' },
    { key: 'closed', label: 'Closed' },
];

/* Full searchable text per role: title + the whole JD. Built once. */
const searchIndex = new Map(
    liveJobs.map((job) => [
        job.id,
        [
            job.title,
            job.category,
            job.experience,
            job.location || DEFAULT_LOCATION, // index what the card actually shows
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

const matchesQuery = (job, tokens) => {
    if (tokens.length === 0) return true;
    const haystack = searchIndex.get(job.id);
    return tokens.every((token) => haystack.includes(token));
};

const allOpen = () => Object.fromEntries(CATEGORY_ORDER.map((c) => [c, true]));
const allClosed = () => Object.fromEntries(CATEGORY_ORDER.map((c) => [c, false]));

/* Wraps every occurrence of the active search tokens in <mark>. Tokens are regex-
   escaped — role copy contains "C++" and "(Backend Engineer)" — and matched
   longest-first so a longer token wins over a shorter one that prefixes it. */
const Highlight = ({ text, tokens }) => {
    if (!tokens.length || !text) return text;
    const pattern = tokens
        .slice()
        .sort((a, b) => b.length - a.length)
        .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');
    const parts = String(text).split(new RegExp(`(${pattern})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                i % 2 === 1 ? (
                    <mark key={i} className="bg-orange-200 text-[#1A1A1A] rounded-sm px-0.5">
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
    const isOpenRole = effectiveStatus(job) === 'active';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
            {/* Card Header — always visible */}
            <div
                className="p-6 md:p-7 cursor-pointer flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
                onClick={() => setExpanded(!expanded)}
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
                        {!isOpenRole && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Closed
                            </span>
                        )}
                    </div>
                    <p className={`text-gray-600 text-sm mt-3 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
                        <Highlight text={job.about} tokens={tokens} />
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    {isOpenRole && (
                        <a
                            href={APPLY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#0a0a0a] text-white text-sm font-medium py-2.5 px-5 rounded-lg hover:bg-black transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Apply Now
                            <ExternalLink size={14} />
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

            {/* Expandable Details */}
            <motion.div
                initial={false}
                animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
                inert={!expanded}
            >
                <div className="px-6 md:px-8 pb-8 pt-0 border-t border-gray-100">
                    <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Key Responsibilities */}
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--text-orange-500)] uppercase tracking-wide mb-3">
                                Key Responsibilities
                            </h4>
                            <ul className="space-y-2">
                                {job.responsibilities.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                                        <span className="text-[var(--text-orange-500)] mt-1 flex-shrink-0">&#8226;</span>
                                        <Highlight text={item} tokens={tokens} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Required Qualifications */}
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--text-orange-500)] uppercase tracking-wide mb-3">
                                Required Qualifications
                            </h4>
                            <ul className="space-y-2">
                                {job.required.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                                        <span className="text-[var(--text-orange-500)] mt-1 flex-shrink-0">&#8226;</span>
                                        <Highlight text={item} tokens={tokens} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Preferred Qualifications */}
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--text-orange-500)] uppercase tracking-wide mb-3">
                                Preferred Qualifications
                            </h4>
                            <ul className="space-y-2">
                                {job.preferred.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                                        <span className="text-[var(--text-orange-500)] mt-1 flex-shrink-0">&#8226;</span>
                                        <Highlight text={item} tokens={tokens} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Apply Button */}
                    {isOpenRole ? (
                        <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                            <a
                                href={APPLY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-[#0a0a0a] text-white text-sm font-medium py-2.5 px-6 rounded-lg hover:bg-black transition-colors"
                            >
                                Apply for {job.title}
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    ) : (
                        <div className="mt-8 pt-6 border-t border-gray-50">
                            <p className="text-sm text-gray-400">
                                This role is not accepting applications right now.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

const CategoryGroup = ({ category, jobs, isOpen, onToggle, tokens }) => (
    <div className="bg-white/60 rounded-2xl border border-gray-100 overflow-hidden">
        {/* Group header — clickable */}
        <button
            onClick={onToggle}
            aria-expanded={isOpen}
            className="w-full flex items-center gap-3 px-5 md:px-6 py-4 text-left hover:bg-white transition-colors group"
        >
            <ChevronDown
                size={20}
                className={`text-[var(--text-orange-500)] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
            />
            <span className="text-base md:text-lg font-semibold text-[#1A1A1A] group-hover:text-[var(--text-orange-500)] transition-colors">
                <Highlight text={category} tokens={tokens} />
            </span>
            <span className="text-xs font-semibold rounded-full px-2 py-0.5 bg-orange-100 text-[var(--text-orange-500)]">
                {jobs.length}
            </span>
            <span className="ml-auto text-xs text-gray-400 hidden sm:block">
                {isOpen ? 'Collapse' : 'Expand'}
            </span>
        </button>

        {/* Group body */}
        <motion.div
            initial={false}
            animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
            inert={!isOpen}
        >
            <div className="px-3 md:px-4 pb-4 space-y-3">
                {jobs.map((job, index) => (
                    <JobCard key={job.id} job={job} index={index} tokens={tokens} />
                ))}
            </div>
        </motion.div>
    </div>
);

const CareersPage = () => {
    const [activeTab, setActiveTab] = useState('hiring');
    const [query, setQuery] = useState('');
    const [openGroups, setOpenGroups] = useState(allClosed);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const tokens = useMemo(
        () => query.trim().toLowerCase().split(/\s+/).filter(Boolean),
        [query]
    );
    const isSearching = tokens.length > 0;

    /* Roles in the active tab that match the current query, grouped by category. */
    const groups = useMemo(() => {
        const visible = liveJobs.filter(
            (job) => TAB_FOR_STATUS[effectiveStatus(job)] === activeTab && matchesQuery(job, tokens)
        );
        return CATEGORY_ORDER.map((category) => ({
            category,
            jobs: visible.filter((job) => job.category === category),
        })).filter((group) => group.jobs.length > 0);
    }, [activeTab, tokens]);

    const matchCount = groups.reduce((sum, group) => sum + group.jobs.length, 0);
    const tabCounts = useMemo(() => {
        const counts = { hiring: 0, closed: 0 };
        liveJobs.forEach((job) => {
            if (matchesQuery(job, tokens)) counts[TAB_FOR_STATUS[effectiveStatus(job)]] += 1;
        });
        return counts;
    }, [tokens]);

    /* Every group starts collapsed, on both tabs. A running search force-expands
       them so matches are never hidden behind a fold; clearing it re-collapses. */
    useEffect(() => {
        setOpenGroups(isSearching ? allOpen() : allClosed());
    }, [isSearching]);

    /* Switching tabs returns groups to collapsed — unless a search is running, in
       which case the new tab's matches should be visible straight away. */
    const selectTab = (key) => {
        setActiveTab(key);
        setOpenGroups(isSearching ? allOpen() : allClosed());
    };

    const everyGroupOpen = groups.length > 0 && groups.every((g) => openGroups[g.category]);

    return (
        <div className="min-h-screen bg-[var(--bg-cream-50)] flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="pt-12 pb-6 px-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-semibold text-[#1A1A1A] mb-4"
                        >
                            Join{' '}
                            <span className="text-[var(--text-orange-500)]">Bodhan AI</span>
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

                {/* Tabs */}
                <div className="max-w-5xl mx-auto px-6 mb-5 w-full">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.28 }}
                        className="flex border-b border-gray-200"
                    >
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => selectTab(tab.key)}
                                aria-selected={activeTab === tab.key}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                                    activeTab === tab.key
                                        ? 'border-[var(--text-orange-500)] text-[var(--text-orange-500)]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.label}
                                <span
                                    className={`text-xs font-semibold rounded-full px-1.5 py-0.5 ${
                                        activeTab === tab.key
                                            ? 'bg-orange-100 text-[var(--text-orange-500)]'
                                            : 'bg-gray-100 text-gray-500'
                                    }`}
                                >
                                    {tabCounts[tab.key]}
                                </span>
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Search + expand/collapse — scoped to the active tab */}
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
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={`Search ${activeTab === 'hiring' ? 'open' : 'closed'} roles by title or description…`}
                                aria-label={`Search ${activeTab} roles`}
                                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[var(--text-orange-500)] focus:ring-2 focus:ring-orange-100 transition-colors [&::-webkit-search-cancel-button]:hidden"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                        {groups.length > 0 && (
                            <button
                                onClick={() => setOpenGroups(everyGroupOpen ? allClosed() : allOpen())}
                                className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[var(--text-orange-500)] bg-white border border-gray-200 hover:border-orange-200 rounded-xl px-4 py-2.5 transition-colors flex-shrink-0"
                            >
                                <Layers size={14} />
                                {everyGroupOpen ? 'Collapse all' : 'Expand all'}
                            </button>
                        )}
                    </div>
                    {isSearching && (
                        <p className="text-xs text-gray-400 mt-2.5">
                            {matchCount} {matchCount === 1 ? 'role' : 'roles'} in{' '}
                            <span className="font-medium text-gray-500">
                                {activeTab === 'hiring' ? 'Hiring' : 'Closed'}
                            </span>{' '}
                            match &ldquo;{query.trim()}&rdquo;
                            {tabCounts[activeTab === 'hiring' ? 'closed' : 'hiring'] > 0 && (
                                <>
                                    {' '}&middot;{' '}
                                    <button
                                        onClick={() => selectTab(activeTab === 'hiring' ? 'closed' : 'hiring')}
                                        className="text-[var(--text-orange-500)] hover:underline font-medium"
                                    >
                                        {tabCounts[activeTab === 'hiring' ? 'closed' : 'hiring']} in{' '}
                                        {activeTab === 'hiring' ? 'Closed' : 'Hiring'}
                                    </button>
                                </>
                            )}
                        </p>
                    )}
                </div>

                {/* Grouped listings */}
                <div className="max-w-5xl mx-auto px-6 pb-20 w-full">
                    <AnimatePresence mode="wait">
                        {groups.length > 0 ? (
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-3"
                            >
                                {groups.map((group) => (
                                    <CategoryGroup
                                        key={group.category}
                                        category={group.category}
                                        jobs={group.jobs}
                                        tokens={tokens}
                                        isOpen={!!openGroups[group.category]}
                                        onToggle={() =>
                                            setOpenGroups((prev) => ({
                                                ...prev,
                                                [group.category]: !prev[group.category],
                                            }))
                                        }
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key={activeTab + '-empty'}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-20"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                    <Search size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">
                                    {isSearching
                                        ? `No ${activeTab === 'hiring' ? 'open' : 'closed'} roles match “${query.trim()}”.`
                                        : `No ${activeTab === 'hiring' ? 'open' : 'closed'} roles at the moment.`}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {isSearching
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
