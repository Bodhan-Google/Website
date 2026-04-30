import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, ExternalLink, ChevronDown, Download, Eye, X, ArrowRight, AlertTriangle, Award } from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import { tenders } from '../data/tenders';

const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};
const formatDateShort = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getPreviewUrl = (url) =>
    `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

const PdfPreviewModal = ({ doc, onClose }) => (
    <AnimatePresence>
        {doc && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                onClick={onClose}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 12 }}
                    transition={{ duration: 0.25 }}
                    className="relative bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-4xl"
                    style={{ height: '85vh' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex-shrink-0">
                                <FileText size={14} className="text-[var(--text-orange-500)]" />
                            </span>
                            <span className="font-semibold text-[#1A1A1A] truncate">{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                                <Download size={12} /> Download
                            </a>
                            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                    <iframe src={doc.previewUrl || getPreviewUrl(doc.url)} className="flex-1 w-full rounded-b-2xl" title={doc.name} allow="fullscreen" />
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const StatusBadge = ({ status }) =>
    status === 'active' ? (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Closed
        </span>
    );

const TenderCard = ({ tender, index, onPreview }) => {
    const [expanded, setExpanded] = useState(false);
    const isActive = tender.status === 'active';
    const isLongDesc = tender.description.length > 150;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * index }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
        >
            {/* Top: accent strip + content */}
            <div className="flex flex-1">
                <div className={`w-1.5 flex-shrink-0 ${isActive ? 'bg-[var(--text-orange-500)]' : 'bg-gray-200'}`} />

                <div className="flex-1 p-6 md:p-7 min-w-0">
                    {/* Main row: info + deadline box */}
                    <div className="flex flex-col md:flex-row gap-5">
                        {/* Left: tender info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2.5">
                                <StatusBadge status={tender.status} />
                                {tender.bidAward && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                                        <Award size={11} /> Awarded
                                    </span>
                                )}
                                <span className="text-xs text-gray-400 font-mono">{tender.id}</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold text-[#1A1A1A] mb-2 leading-snug">
                                {tender.title}
                            </h3>
                            <p className={`text-sm text-gray-500 leading-relaxed transition-all duration-300 ${!expanded && isLongDesc ? 'line-clamp-2' : ''}`}>
                                {tender.description}
                            </p>
                        </div>

                        {/* Right: deadline box */}
                        <div className="md:flex-shrink-0 md:w-44">
                            <div className={`rounded-xl p-4 text-center ${isActive ? 'bg-orange-50 border border-orange-100' : 'bg-gray-50 border border-gray-100'}`}>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1.5">Closing</p>
                                <p className={`text-sm font-bold leading-tight ${isActive ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                                    {formatDateShort(tender.closingDate)}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{tender.closingTime}</p>
                                {isActive && (
                                    <Link
                                        to={`/tenders/apply/${tender.id}`}
                                        className="mt-3 inline-flex items-center justify-center gap-1.5 w-full bg-[#0a0a0a] text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-black transition-colors"
                                    >
                                        Apply Now <ArrowRight size={11} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Expandable: documents */}
                    <motion.div
                        initial={false}
                        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-5 pt-4 border-t border-gray-100">
                            {tender.bidAward && (
                                <div className="mb-5">
                                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <Award size={12} /> Bid Award
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-emerald-50/60 border border-emerald-100 rounded-xl px-3 py-2.5">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <span className="flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-white border border-emerald-100 flex-shrink-0 gap-0.5 shadow-sm">
                                                <FileText size={11} className="text-emerald-600" />
                                                <span className="text-[8px] font-bold text-emerald-600 uppercase leading-none">PDF</span>
                                            </span>
                                            <span className="text-sm font-medium text-gray-700 break-words min-w-0">{tender.bidAward.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                                            <button
                                                onClick={() => onPreview(tender.bidAward)}
                                                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Eye size={11} /> Preview
                                            </button>
                                            <a
                                                href={tender.bidAward.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#0a0a0a] bg-white hover:bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Download size={11} /> Download
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Documents</p>
                            <ul className="space-y-2">
                                {tender.documents.map((doc, i) => (
                                    <li key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <span className="flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-white border border-orange-100 flex-shrink-0 gap-0.5 shadow-sm">
                                                <FileText size={11} className="text-[var(--text-orange-500)]" />
                                                <span className="text-[8px] font-bold text-[var(--text-orange-500)] uppercase leading-none">PDF</span>
                                            </span>
                                            <span className="text-sm font-medium text-gray-700 break-words min-w-0">{doc.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                                            <button
                                                onClick={() => onPreview(doc)}
                                                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[var(--text-orange-500)] bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 px-2.5 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Eye size={11} /> Preview
                                            </button>
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#0a0a0a] bg-white hover:bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Download size={11} /> Download
                                            </a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer toggle bar */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full border-t border-gray-100 px-6 py-2.5 flex items-center justify-between bg-gray-50/60 hover:bg-gray-50 transition-colors group"
            >
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <FileText size={11} />
                    {tender.documents.length} document{tender.documents.length !== 1 ? 's' : ''}
                    {tender.bidAward && (
                        <span className="flex items-center gap-1 text-emerald-700 ml-2">
                            <Award size={11} /> Bid award
                        </span>
                    )}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-[var(--text-orange-500)] transition-colors">
                    {expanded ? 'Hide details' : 'View details'}
                    <ChevronDown size={12} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                </span>
            </button>
        </motion.div>
    );
};

const TendersPage = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [previewDoc, setPreviewDoc] = useState(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);
    useEffect(() => {
        document.body.style.overflow = previewDoc ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [previewDoc]);

    const filtered = tenders.filter((t) => t.status === activeTab);
    const activeCnt = tenders.filter((t) => t.status === 'active').length;
    const closedCnt = tenders.filter((t) => t.status === 'closed').length;
    const nextDeadline = tenders
        .filter((t) => t.status === 'active')
        .sort((a, b) => new Date(a.closingDate) - new Date(b.closingDate))[0];

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
                            className="text-4xl md:text-5xl font-semibold text-[#1A1A1A] mb-3"
                        >
                            Tenders &amp;{' '}
                            <span className="text-[var(--text-orange-500)]">Procurement</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.12 }}
                            className="text-gray-500 text-base max-w-2xl mx-auto mb-5"
                        >
                            Official tender notices and procurement opportunities from Bodhan AI.
                        </motion.p>

                        {/* Stat chips */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.22 }}
                            className="flex flex-wrap gap-2 justify-center"
                        >
                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active: {activeCnt}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-3 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Closed: {closedCnt}
                            </span>
                            {nextDeadline && (
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                                    <Calendar size={12} /> Next closing: {formatDateShort(nextDeadline.closingDate)}
                                </span>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Bid submission callout */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.32 }}
                    className="max-w-5xl mx-auto px-6 mb-6 w-full"
                >
                    <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
                        <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800 leading-relaxed">
                            <span className="font-semibold">Important: </span>
                            Technical and Commercial bids must be submitted as separate documents.
                            Including any commercial details within the Technical bid, or combining both into a single document,
                            will result in <span className="font-semibold">disqualification of the bid</span>.
                        </p>
                    </div>
                </motion.div>

                {/* Underline tabs */}
                <div className="max-w-5xl mx-auto px-6 mb-6 w-full">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.28 }}
                        className="flex border-b border-gray-200"
                    >
                        {[
                            { key: 'active', label: 'Active Tenders', count: activeCnt },
                            { key: 'closed', label: 'Closed Tenders', count: closedCnt },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                                    activeTab === tab.key
                                        ? 'border-[var(--text-orange-500)] text-[var(--text-orange-500)]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.label}
                                <span className={`text-xs font-semibold rounded-full px-1.5 py-0.5 ${
                                    activeTab === tab.key ? 'bg-orange-100 text-[var(--text-orange-500)]' : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Listings */}
                <div className="max-w-5xl mx-auto px-6 pb-20 w-full">
                    <AnimatePresence mode="wait">
                        {filtered.length > 0 ? (
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                {filtered.map((tender, index) => (
                                    <TenderCard key={tender.id} tender={tender} index={index} onPreview={setPreviewDoc} />
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
                                    <FileText size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">No {activeTab} tenders at the moment.</p>
                                <p className="text-gray-400 text-sm mt-1">Check back soon for new opportunities.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Footer />
            <PdfPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
        </div>
    );
};

export default TendersPage;
