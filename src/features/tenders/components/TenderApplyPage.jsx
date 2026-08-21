import { useState, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    ArrowLeft, AlertTriangle, Upload, FileText, X,
    CheckCircle, Loader2, AlertCircle, Calendar,
} from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import { tenders, isTenderClosed } from '../data/tenders';

const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;
const MAX_MB = 10;

const ALLOWED_TYPES = {
    'application/pdf': 'PDF',
    // 'application/msword': 'DOC',
    // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    // 'application/vnd.ms-excel': 'XLS',
    // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    // 'text/csv': 'CSV',
};
// const ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.csv';
const ACCEPT = '.pdf';

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
    });

const fmtSize = (bytes) =>
    bytes < 1024 * 1024
        ? `${(bytes / 1024).toFixed(0)} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const formatDateShort = (dateStr) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
    });

// ─── Upload Zone ──────────────────────────────────────────────────────────────
const UploadZone = ({ accentColor, file, onFile, onClear, disabled, error }) => {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const validate = (f) => {
        if (!f) return;
        if (!ALLOWED_TYPES[f.type]) return alert('Accepted formats: PDF');
        if (f.size > MAX_MB * 1024 * 1024) return alert(`File must be under ${MAX_MB} MB.`);
        onFile(f);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        validate(e.dataTransfer.files[0]);
    };

    return (
        <div className={`rounded-2xl border-2 transition-colors ${error ? 'border-red-300 bg-red-50/40' : file ? 'border-gray-200 bg-white' : dragging ? 'border-[var(--text-orange-500)] bg-orange-50/30' : 'border-dashed border-gray-200 bg-white hover:border-gray-300'}`}>
            {file ? (
                /* ── Selected state ── */
                <div className="flex items-center gap-3 px-5 py-4">
                    <span className={`flex flex-col items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 gap-0.5 ${accentColor === 'blue' ? 'bg-blue-50 border border-blue-100' : 'bg-orange-50 border border-orange-100'}`}>
                        <FileText size={13} className={accentColor === 'blue' ? 'text-blue-500' : 'text-[var(--text-orange-500)]'} />
                        <span className={`text-[7px] font-bold uppercase leading-none ${accentColor === 'blue' ? 'text-blue-500' : 'text-[var(--text-orange-500)]'}`}>{ALLOWED_TYPES[file.type] ?? 'FILE'}</span>
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A1A] truncate">{file.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{fmtSize(file.size)}</p>
                    </div>
                    {!disabled && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>
            ) : (
                /* ── Empty / drag state ── */
                <div
                    role="button"
                    tabIndex={0}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => !disabled && inputRef.current?.click()}
                    onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 px-6 py-8 cursor-pointer select-none"
                >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dragging ? 'bg-orange-100' : 'bg-gray-100'}`}>
                        <Upload size={18} className={dragging ? 'text-[var(--text-orange-500)]' : 'text-gray-400'} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">
                            <span className="text-[var(--text-orange-500)]">Click to upload</span> or drag & drop
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">PDF · Max {MAX_MB} MB</p>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept={ACCEPT}
                        className="hidden"
                        onChange={(e) => validate(e.target.files[0])}
                        disabled={disabled}
                    />
                </div>
            )}
        </div>
    );
};

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ tender, orgName }) => (
    <div className="min-h-screen bg-[var(--bg-cream-50)] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-5 py-16">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center"
            >
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={28} className="text-emerald-500" />
                </div>
                <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Bid submitted successfully</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-1">
                    Your Technical and Commercial bids for
                </p>
                <p className="text-sm font-semibold text-[#1A1A1A] mb-1">"{tender.title}"</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    have been received under the name <span className="font-medium text-[#1A1A1A]">{orgName}</span>. You will be contacted if shortlisted.
                </p>
                <Link
                    to="/tenders"
                    className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-5 py-2.5 rounded-[10px] hover:bg-black transition-colors"
                >
                    <ArrowLeft size={14} /> Back to Tenders
                </Link>
            </motion.div>
        </div>
        <Footer />
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const TenderApplyPage = () => {
    const { tenderId } = useParams();
    const tender = tenders.find((t) => t.id === tenderId);

    const [form, setForm] = useState({ orgName: '', contactName: '', email: '', phone: '' });
    const [techFile, setTechFile] = useState(null);
    const [commFile, setCommFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | uploading | success | error
    const [errorMsg, setErrorMsg] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    if (!tender) return <Navigate to="/tenders" replace />;
    if (isTenderClosed(tender)) return <Navigate to="/tenders" replace />;

    const isUploading = status === 'uploading';

    const validate = () => {
        const errs = {};
        if (!form.orgName.trim()) errs.orgName = 'Required';
        if (!form.contactName.trim()) errs.contactName = 'Required';
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errs.email = 'Valid email required';
        if (!techFile) errs.techFile = 'Required';
        if (!commFile) errs.commFile = 'Required';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setFieldErrors(errs); return; }
        setFieldErrors({});
        setStatus('uploading');
        setErrorMsg('');
        try {
            const [techData, commData] = await Promise.all([toBase64(techFile), toBase64(commFile)]);
            const res = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({
                    tenderId: tender.id,
                    tenderTitle: tender.title,
                    orgName: form.orgName,
                    contactName: form.contactName,
                    email: form.email,
                    phone: form.phone,
                    technicalFile: { name: techFile.name, mimeType: techFile.type, data: techData },
                    commercialFile: { name: commFile.name, mimeType: commFile.type, data: commData },
                }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || 'Upload failed');
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return <SuccessScreen tender={tender} orgName={form.orgName} />;
    }

    const field = (id, label, type = 'text', placeholder = '') => (
        <div>
            <label htmlFor={id} className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                {label} <span className="text-red-400">*</span>
            </label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={form[id]}
                onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                disabled={isUploading}
                className={`w-full text-sm px-4 py-2.5 rounded-[10px] border bg-white outline-none transition-colors
                    ${fieldErrors[id] ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[var(--text-orange-500)]'}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {fieldErrors[id] && <p className="text-xs text-red-500 mt-1">{fieldErrors[id]}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-cream-50)] flex flex-col">
            <Navbar />

            <div className="flex-1">
                <div className="max-w-2xl mx-auto px-5 py-10">

                    {/* Back + breadcrumb */}
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <Link
                            to="/tenders"
                            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1A1A1A] transition-colors mb-6"
                        >
                            <ArrowLeft size={14} /> Back to Tenders
                        </Link>
                    </motion.div>

                    {/* Page header */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="mb-6">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-gray-400">{tender.id}</span>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] leading-snug mb-2">
                            {tender.title}
                        </h1>
                        <p className="text-sm text-gray-500 flex items-center gap-1.5">
                            <Calendar size={13} />
                            Closing: {formatDateShort(tender.closingDate)} · {tender.closingTime}
                        </p>
                    </motion.div>

                    {/* Warning callout */}
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="mb-8">
                        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
                            <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800 leading-relaxed">
                                <span className="font-semibold">Important: </span>
                                Technical and Commercial bids must be uploaded as separate files below.
                                Including commercial details in the Technical bid or merging both into one document
                                will result in <span className="font-semibold">disqualification</span>.
                            </p>
                        </div>
                    </motion.div>

                    <form onSubmit={handleSubmit} noValidate>

                        {/* Bidder details */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
                            <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4">Bidder Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {field('orgName', 'Organization Name', 'text', 'e.g. Acme Technologies Pvt. Ltd.')}
                                {field('contactName', 'Contact Person', 'text', 'Full name')}
                                {field('email', 'Email Address', 'email', 'contact@example.com')}
                                <div>
                                    <label htmlFor="phone" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                        Phone <span className="text-gray-400 font-normal normal-case">(optional)</span>
                                    </label>
                                    <input
                                        id="phone"
                                        type="text"
                                        placeholder="+91 98765 43210"
                                        value={form.phone}
                                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/[^\d+\s()-]/g, '') }))}
                                        disabled={isUploading}
                                        className="w-full text-sm px-4 py-2.5 rounded-[10px] border border-gray-200 focus:border-[var(--text-orange-500)] bg-white outline-none transition-colors disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Document uploads */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                            <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4">Upload Bid Documents</h2>
                            <div className="space-y-4">
                                {/* Technical Bid */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Technical Bid</span>
                                        <span className="text-red-400 text-xs">*</span>
                                    </div>
                                    <UploadZone
                                        label="Technical Bid"
                                        accentColor="blue"
                                        file={techFile}
                                        onFile={(f) => { setTechFile(f); setFieldErrors((e) => ({ ...e, techFile: undefined })); }}
                                        onClear={() => setTechFile(null)}
                                        disabled={isUploading}
                                        error={fieldErrors.techFile}
                                    />
                                    {fieldErrors.techFile && <p className="text-xs text-red-500 mt-1">Technical Bid is required</p>}
                                </div>

                                <div className="border-t border-gray-100" />

                                {/* Commercial Bid */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-semibold text-[var(--text-orange-500)] uppercase tracking-wide">Commercial Bid</span>
                                        <span className="text-red-400 text-xs">*</span>
                                    </div>
                                    <UploadZone
                                        label="Commercial Bid"
                                        accentColor="orange"
                                        file={commFile}
                                        onFile={(f) => { setCommFile(f); setFieldErrors((e) => ({ ...e, commFile: undefined })); }}
                                        onClear={() => setCommFile(null)}
                                        disabled={isUploading}
                                        error={fieldErrors.commFile}
                                    />
                                    {fieldErrors.commFile && <p className="text-xs text-red-500 mt-1">Commercial Bid is required</p>}
                                </div>
                            </div>
                        </motion.div>

                        {/* Error banner */}
                        {status === 'error' && (
                            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
                                <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{errorMsg}</p>
                            </motion.div>
                        )}

                        {/* Submit */}
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.25 }}>
                            <button
                                type="submit"
                                disabled={isUploading}
                                className="w-full flex items-center justify-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium py-3 rounded-[10px] transition-all cursor-pointer hover:bg-[#ff6207] hover:scale-[1.015] hover:shadow-md active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#0a0a0a] disabled:hover:scale-100 disabled:hover:shadow-none"
                            >
                                {isUploading ? (
                                    <><Loader2 size={15} className="animate-spin" /> Uploading bids…</>
                                ) : (
                                    'Submit Bid'
                                )}
                            </button>
                        </motion.div>

                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TenderApplyPage;
