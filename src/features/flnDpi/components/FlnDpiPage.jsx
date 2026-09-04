import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    AudioLines, Blocks, FileText, ExternalLink, ShieldCheck, Send, Mail, Check, Clock,
    CheckCircle, Loader2, AlertCircle, ArrowRight,
} from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import Turnstile from './Turnstile';
import {
    PAGE_TITLE, CONTACT_EMAIL, HEADLINE, LEDE, TIME_NOTE, ABOUT,
    ENGAGEMENT, CONTRIBUTE_INTRO, AREAS, MODES, OTHER_LABEL, MODELS_INTRO, MODELS,
    WHITEPAPER, WHITEPAPER_INTRO, WHITEPAPER_QUESTIONS,
    NAME_MAX, EMAIL_MAX, ORG_MAX, OTHER_MAX, LONG_MAX,
} from '../data/content';

// Apps Script web-app URL (see docs/fln-dpi-feedback.md). Same pattern as the
// tender bid form: a plain string body so the browser sends a simple request
// and Apps Script answers with a CORS-open JSON redirect.
const SCRIPT_URL = import.meta.env.VITE_FLN_DPI_SCRIPT_URL;

// Cloudflare's public "always passes" key, used only in local dev so the widget
// renders without a real site key. Production must set VITE_TURNSTILE_SITE_KEY.
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || (import.meta.env.DEV ? TURNSTILE_TEST_SITE_KEY : '');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ENGAGEMENT_ICONS = { 'use-models': AudioLines, contribute: Blocks, whitepaper: FileText };

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay },
});

const EMPTY_FORM = {
    name: '',
    organisation: '',
    email: '',
    engagement: [],
    areas: [],
    areasOther: '',
    modes: [],
    modesOther: '',
    tellMore: '',
    models: [],
    useCase: '',
    wpQuestions: [],
    wpComments: '',
    website: '', // honeypot — stays empty for humans
};

const toggle = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

// ─── Small building blocks ────────────────────────────────────────────────────

const StepBadge = ({ n }) => (
    <span className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
        {n}
    </span>
);

const Section = ({ id, step, title, badge, hint, error, delay = 0, children }) => (
    <motion.section
        {...fadeUp(delay)}
        aria-labelledby={`${id}-title`}
        data-error={error ? 'true' : undefined}
        className={`bg-white rounded-2xl border shadow-sm p-5 md:p-7 transition-colors ${error ? 'border-red-200' : 'border-gray-100'}`}
    >
        <div className="flex items-start gap-3">
            {step && <StepBadge n={step} />}
            <div className="flex-1 min-w-0">
                <h2 id={`${id}-title`} className="text-base md:text-lg font-semibold text-[#1A1A1A] flex flex-wrap items-center gap-2 leading-snug">
                    {title}
                    {badge && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 border border-gray-200 rounded-full px-2 py-0.5">
                            {badge}
                        </span>
                    )}
                </h2>
                {hint && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{hint}</p>}
            </div>
        </div>
        <div className="mt-4">{children}</div>
        {error && (
            <p className="text-xs text-red-500 mt-3 flex items-center gap-1.5" role="alert">
                <AlertCircle size={13} /> {error}
            </p>
        )}
    </motion.section>
);

// A question inside a section: label, optional required mark, hint, error.
const Question = ({ id, label, required, optionalMark = true, hint, error, children }) => (
    <div className="mt-6 first:mt-0" data-error={error ? 'true' : undefined}>
        <p id={`${id}-label`} className="text-sm font-semibold text-[#1A1A1A]">
            {label}{' '}
            {required
                ? <span className="text-red-400">*</span>
                : optionalMark && <span className="text-gray-400 font-normal">(optional)</span>}
        </p>
        {hint && <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{hint}</p>}
        <div className="mt-3" role="group" aria-labelledby={`${id}-label`}>{children}</div>
        {error && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1.5" role="alert">
                <AlertCircle size={13} /> {error}
            </p>
        )}
    </div>
);

const CheckBox = ({ checked }) => (
    <span
        aria-hidden="true"
        className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${checked ? 'bg-[var(--text-orange-500)] border-[var(--text-orange-500)] text-white' : 'border-gray-300 bg-white'}`}
    >
        {checked && <Check size={13} strokeWidth={3} />}
    </span>
);

// A full-width checkbox row with label + hint, like the Google Form rows.
const CheckRow = ({ name, value, checked, onChange, disabled, label, hint }) => (
    <label
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 select-none transition-all
            has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange-300
            ${checked ? 'border-orange-200 bg-orange-50/60' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
        <input type="checkbox" name={name} value={value} checked={checked} onChange={() => onChange(value)} disabled={disabled} className="sr-only" />
        <CheckBox checked={checked} />
        <span className="min-w-0">
            <span className="block text-sm font-medium text-[#1A1A1A] leading-snug">{label}</span>
            {hint && <span className="block text-xs text-gray-500 mt-0.5 leading-relaxed">{hint}</span>}
        </span>
    </label>
);

// "Other:" row with an inline text field that appears once ticked.
const OtherRow = ({ name, checked, onToggle, text, onText, disabled, id }) => (
    <div className={`rounded-xl border px-4 py-3 transition-all ${checked ? 'border-orange-200 bg-orange-50/60' : 'border-gray-200 bg-white hover:border-gray-300'} ${disabled ? 'opacity-50' : ''}`}>
        <label className={`flex items-start gap-3 select-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <input type="checkbox" name={name} value={OTHER_LABEL} checked={checked} onChange={onToggle} disabled={disabled} className="sr-only" />
            <CheckBox checked={checked} />
            <span className="text-sm font-medium text-[#1A1A1A] leading-snug">{OTHER_LABEL}</span>
        </label>
        {checked && (
            <input
                id={id}
                type="text"
                value={text}
                onChange={(e) => onText(e.target.value)}
                maxLength={OTHER_MAX}
                disabled={disabled}
                placeholder="Please specify"
                aria-label="Other, please specify"
                className="mt-2.5 w-full text-sm px-3.5 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--text-orange-500)] bg-white outline-none transition-colors"
            />
        )}
    </div>
);

const TextInput = ({ id, label, type = 'text', value, onChange, placeholder, maxLength, error, disabled, autoComplete, required }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            autoComplete={autoComplete}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${id}-err` : undefined}
            className={`w-full text-sm px-4 py-2.5 rounded-[10px] border bg-white outline-none transition-colors
                ${error ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[var(--text-orange-500)]'}
                disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        {error && <p id={`${id}-err`} className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

const LongText = ({ id, value, onChange, placeholder, disabled, rows = 6 }) => (
    <div>
        <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={LONG_MAX}
            rows={rows}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full text-sm leading-relaxed px-4 py-3 rounded-[10px] border border-gray-200 focus:border-[var(--text-orange-500)] bg-white outline-none transition-colors resize-y disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex justify-end mt-1 text-xs text-gray-400 tabular-nums">
            {value.length.toLocaleString()} / {LONG_MAX.toLocaleString()}
        </div>
    </div>
);

// ─── Side column ──────────────────────────────────────────────────────────────

const AboutPanel = () => (
    <motion.aside {...fadeUp(0.1)} className="lg:sticky lg:top-40 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-7">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">About</h2>
            <div className="space-y-3.5 text-[15px] leading-relaxed text-gray-700">
                {ABOUT.map((para) => <p key={para.slice(0, 32)}>{para}</p>)}
            </div>
            <div className="border-t border-gray-100 mt-6 pt-5">
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Ways to engage</h3>
                <ul className="space-y-3">
                    {ENGAGEMENT.map((e) => {
                        const Icon = ENGAGEMENT_ICONS[e.id];
                        return (
                            <li key={e.id} className="flex items-start gap-3">
                                <span className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[var(--text-orange-500)] flex-shrink-0">
                                    <Icon size={15} />
                                </span>
                                <span>
                                    <span className="block text-sm font-medium text-[#1A1A1A]">{e.label}</span>
                                    <span className="block text-xs text-gray-500 leading-relaxed">{e.hint}</span>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[var(--text-orange-500)]">
                    <FileText size={17} />
                </div>
                <h3 className="text-sm font-semibold text-[#1A1A1A]">Read the whitepaper</h3>
            </div>
            <p className="text-sm font-medium text-[#1A1A1A] leading-snug">{WHITEPAPER.title}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{WHITEPAPER.subtitle}</p>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 mt-3">{WHITEPAPER.version}</p>
            {WHITEPAPER.url ? (
                <a
                    href={WHITEPAPER.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-orange-500)] hover:underline"
                >
                    Open the PDF <ExternalLink size={14} />
                </a>
            ) : (
                <p className="text-xs text-gray-500 mt-3">
                    Ask us for a copy at <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>.
                </p>
            )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[var(--text-orange-500)]">
                    <Mail size={17} />
                </div>
                <h3 className="text-sm font-semibold text-[#1A1A1A]">Prefer email?</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
                If you have documents to share or a longer proposal, write to us directly.
            </p>
            <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('FLN DPI / Bodhan open models')}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-orange-500)] hover:underline break-all"
            >
                {CONTACT_EMAIL} <ArrowRight size={14} />
            </a>
        </div>
    </motion.aside>
);

// ─── Success ──────────────────────────────────────────────────────────────────

const SuccessCard = ({ name, onAgain }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 text-center"
    >
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Thank you{name ? `, ${name}` : ''}.</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-8">
            Your interest has been recorded. We will follow up by email with next steps.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
                type="button"
                onClick={onAgain}
                className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-5 py-2.5 rounded-[10px] hover:bg-[#ff6207] transition-colors cursor-pointer"
            >
                Submit another response
            </button>
            <Link
                to="/"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1A1A1A] px-5 py-2.5 transition-colors"
            >
                Back to home <ArrowRight size={14} />
            </Link>
        </div>
    </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const FlnDpiPage = () => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const [errorMsg, setErrorMsg] = useState('');
    const [submittedName, setSubmittedName] = useState('');
    const [token, setToken] = useState('');
    const [captchaMsg, setCaptchaMsg] = useState('');
    const [captchaReset, setCaptchaReset] = useState(0);

    const isSending = status === 'sending';
    const configured = Boolean(SCRIPT_URL) && Boolean(SITE_KEY);

    const wantsModels = form.engagement.includes('use-models');
    const wantsContribute = form.engagement.includes('contribute');
    const areasOtherOn = form.areas.includes(OTHER_LABEL);
    const modesOtherOn = form.modes.includes(OTHER_LABEL);

    // Step numbers follow the sections that are actually visible.
    let stepCounter = 2;
    const contributeStep = wantsContribute ? ++stepCounter : null;
    const modelsStep = wantsModels ? ++stepCounter : null;
    const wantsWhitepaper = form.engagement.includes('whitepaper');
    const whitepaperStep = wantsWhitepaper ? ++stepCounter : null;

    useEffect(() => {
        window.scrollTo(0, 0);
        const previous = document.title;
        document.title = PAGE_TITLE;
        return () => { document.title = previous; };
    }, []);

    const set = (key) => (value) => {
        setForm((f) => ({ ...f, [key]: value }));
        // The two whitepaper fields share one section-level error.
        const errKey = key === 'wpQuestions' || key === 'wpComments' ? 'whitepaper' : key;
        setErrors((e) => (errKey in e ? { ...e, [errKey]: undefined } : e));
    };
    const toggleIn = (key) => (value) => set(key)(toggle(form[key], value));

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Required';
        if (!form.organisation.trim()) errs.organisation = 'Required';
        if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) errs.email = 'Valid email required';
        if (!form.engagement.length) errs.engagement = 'Please pick at least one.';
        if (wantsContribute) {
            if (!form.areas.length) errs.areas = 'Please pick at least one area.';
            else if (areasOtherOn && !form.areasOther.trim()) errs.areas = 'Please say what "Other" is.';
            if (!form.modes.length) errs.modes = 'Please pick at least one.';
            else if (modesOtherOn && !form.modesOther.trim()) errs.modes = 'Please say what "Other" is.';
        }
        if (wantsModels && !form.models.length) errs.models = 'Please pick at least one model.';
        if (wantsWhitepaper && !form.wpQuestions.length && !form.wpComments.trim()) {
            errs.whitepaper = 'Pick at least one open question or leave a comment.';
        }
        if (!token) errs.captcha = 'Please complete the human verification.';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.values(errs).some(Boolean)) {
            setErrors(errs);
            requestAnimationFrame(() => {
                const first = document.querySelector('[data-error="true"], [aria-invalid="true"]');
                first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
            return;
        }
        setErrors({});
        setStatus('sending');
        setErrorMsg('');
        try {
            const res = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({
                    source: 'fln-dpi',
                    name: form.name.trim(),
                    organisation: form.organisation.trim(),
                    email: form.email.trim(),
                    engagement: form.engagement,
                    areas: wantsContribute ? form.areas : [],
                    areasOther: wantsContribute && areasOtherOn ? form.areasOther.trim() : '',
                    modes: wantsContribute ? form.modes : [],
                    modesOther: wantsContribute && modesOtherOn ? form.modesOther.trim() : '',
                    tellMore: wantsContribute ? form.tellMore.trim() : '',
                    models: wantsModels ? form.models : [],
                    useCase: wantsModels ? form.useCase.trim() : '',
                    wpQuestions: wantsWhitepaper ? form.wpQuestions : [],
                    wpComments: wantsWhitepaper ? form.wpComments.trim() : '',
                    website: form.website,
                    turnstileToken: token,
                }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || 'Submission failed');
            setSubmittedName(form.name.trim().split(/\s+/)[0]);
            setStatus('success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
            // A Turnstile token is single-use: ask for a fresh one before a retry.
            setToken('');
            setCaptchaReset((n) => n + 1);
        }
    };

    const resetAll = () => {
        setForm(EMPTY_FORM);
        setErrors({});
        setStatus('idle');
        setErrorMsg('');
        setToken('');
        setCaptchaMsg('');
        setCaptchaReset((n) => n + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[var(--bg-cream-50)] flex flex-col">
            <Navbar />

            <main className="flex-1">
                {/* Header */}
                <div className="relative overflow-hidden">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full opacity-60 blur-3xl"
                        style={{ background: 'radial-gradient(closest-side, #FFDAC1 0%, rgba(255,218,193,0) 70%)' }}
                    />
                    <div className="relative max-w-6xl mx-auto px-5 md:px-6 pt-10 md:pt-16 pb-8 md:pb-12">
                        <motion.div {...fadeUp(0)} className="max-w-3xl">
                            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-orange-500)] bg-orange-50 border border-orange-100 rounded-full px-3 py-1 mb-4">
                                <Clock size={12} /> Interest form · about 3 minutes
                            </span>
                            <h1 className="text-3xl md:text-5xl font-semibold text-[#1A1A1A] leading-[1.15] mb-4">
                                <span className="text-[var(--text-orange-500)]">{HEADLINE}</span>
                            </h1>
                            <p className="text-gray-600 text-base md:text-lg leading-relaxed">{LEDE}</p>
                            <p className="text-gray-400 text-sm mt-3">{TIME_NOTE}</p>
                        </motion.div>
                    </div>
                </div>

                {/* Body */}
                <div className="max-w-6xl mx-auto px-5 md:px-6 pb-16 md:pb-24">
                    <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:gap-10 items-start">
                        <div className="order-2 lg:order-1">
                            <AboutPanel />
                        </div>

                        <div className="order-1 lg:order-2">
                            {status === 'success' ? (
                                <SuccessCard name={submittedName} onAgain={resetAll} />
                            ) : (
                                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                                    {!configured && (
                                        <motion.div {...fadeUp(0.05)} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
                                            <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-amber-800 leading-relaxed">
                                                This form is not accepting submissions right now. Please email us at{' '}
                                                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">{CONTACT_EMAIL}</a>.
                                                {import.meta.env.DEV && (
                                                    <span className="block mt-1 font-mono text-xs text-amber-700">
                                                        dev: set VITE_FLN_DPI_SCRIPT_URL (and optionally VITE_TURNSTILE_SITE_KEY) in .env.local
                                                    </span>
                                                )}
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* 1 · About you */}
                                    <Section id="you" step={1} title="About you" delay={0.1}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <TextInput id="name" label="Your name" required value={form.name} onChange={set('name')} maxLength={NAME_MAX} disabled={isSending} autoComplete="name" error={errors.name} />
                                            <TextInput id="organisation" label="Organization / company" required value={form.organisation} onChange={set('organisation')} maxLength={ORG_MAX} disabled={isSending} autoComplete="organization" error={errors.organisation} />
                                            <div className="sm:col-span-2">
                                                <TextInput id="email" label="Your email" type="email" required value={form.email} onChange={set('email')} maxLength={EMAIL_MAX} disabled={isSending} autoComplete="email" error={errors.email} placeholder="you@organisation.org" />
                                            </div>
                                        </div>
                                    </Section>

                                    {/* 2 · Engagement */}
                                    <Section id="engagement" step={2} title="How would you like to engage?" hint="Pick one or both. You will only see the sections relevant to you." error={errors.engagement} delay={0.15}>
                                        <fieldset disabled={isSending}>
                                            <legend className="sr-only">How would you like to engage?</legend>
                                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {ENGAGEMENT.map((opt) => {
                                                    const Icon = ENGAGEMENT_ICONS[opt.id];
                                                    const checked = form.engagement.includes(opt.id);
                                                    return (
                                                        <label
                                                            key={opt.id}
                                                            className={`relative flex flex-col gap-2 rounded-xl border p-4 select-none transition-all
                                                                has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange-300
                                                                ${checked
                                                                    ? 'border-[var(--text-orange-500)] bg-orange-50 shadow-[0_0_0_1px_var(--text-orange-500)]'
                                                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}
                                                                ${isSending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        >
                                                            <input type="checkbox" name="engagement" value={opt.id} checked={checked} onChange={() => toggleIn('engagement')(opt.id)} disabled={isSending} className="sr-only" />
                                                            <div className="flex items-center justify-between">
                                                                <span className={`w-9 h-9 rounded-xl flex items-center justify-center border ${checked ? 'bg-white border-orange-200 text-[var(--text-orange-500)]' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                                                                    <Icon size={17} />
                                                                </span>
                                                                <CheckBox checked={checked} />
                                                            </div>
                                                            <span className="text-sm font-semibold text-[#1A1A1A] leading-snug">{opt.label}</span>
                                                            <span className="text-xs text-gray-500 leading-relaxed">{opt.hint}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </fieldset>
                                    </Section>

                                    {/* Contributing to the FLN DPI */}
                                    {wantsContribute && (
                                        <Section id="contribute" step={contributeStep} title="Contributing to the FLN DPI" hint={CONTRIBUTE_INTRO} delay={0}>
                                            <Question id="areas" label="Which areas can you contribute to?" required error={errors.areas}>
                                                <div className="grid gap-2">
                                                    {AREAS.map((a) => (
                                                        <CheckRow key={a.label} name="areas" value={a.label} label={a.label} hint={a.hint} checked={form.areas.includes(a.label)} onChange={toggleIn('areas')} disabled={isSending} />
                                                    ))}
                                                    <OtherRow id="areas-other" name="areas" checked={areasOtherOn} onToggle={() => toggleIn('areas')(OTHER_LABEL)} text={form.areasOther} onText={set('areasOther')} disabled={isSending} />
                                                </div>
                                            </Question>

                                            <Question id="modes" label="How would you contribute?" required error={errors.modes}>
                                                <div className="grid sm:grid-cols-2 gap-2">
                                                    {MODES.map((m) => (
                                                        <CheckRow key={m.label} name="modes" value={m.label} label={m.label} checked={form.modes.includes(m.label)} onChange={toggleIn('modes')} disabled={isSending} />
                                                    ))}
                                                    <OtherRow id="modes-other" name="modes" checked={modesOtherOn} onToggle={() => toggleIn('modes')(OTHER_LABEL)} text={form.modesOther} onText={set('modesOther')} disabled={isSending} />
                                                </div>
                                            </Question>

                                            <Question id="tell-more" label="Tell us more" hint="Specific areas, prior or existing work, and what you would bring.">
                                                <LongText id="tell-more-text" value={form.tellMore} onChange={set('tellMore')} disabled={isSending} placeholder="Anything that helps us understand where you fit in." />
                                            </Question>
                                        </Section>
                                    )}

                                    {/* Using Bodhan open models */}
                                    {wantsModels && (
                                        <Section id="models" step={modelsStep} title="Using Bodhan open models" hint={MODELS_INTRO} delay={0}>
                                            <Question id="models-q" label="Which models are you interested in?" required error={errors.models}>
                                                <div className="grid sm:grid-cols-3 gap-2">
                                                    {MODELS.map((m) => (
                                                        <CheckRow key={m.label} name="models" value={m.label} label={m.label} hint={m.hint} checked={form.models.includes(m.label)} onChange={toggleIn('models')} disabled={isSending} />
                                                    ))}
                                                </div>
                                            </Question>
                                            <Question id="use-case" label="Tell us about your use case" hint="What you would build, which languages, and at what scale.">
                                                <LongText id="use-case-text" value={form.useCase} onChange={set('useCase')} disabled={isSending} rows={5} placeholder="e.g. reading-fluency assessment in Hindi and Marathi for 200 schools" />
                                            </Question>
                                        </Section>
                                    )}

                                    {/* Feedback on the whitepaper */}
                                    {wantsWhitepaper && (
                                        <Section id="whitepaper" step={whitepaperStep} title="Feedback on the whitepaper" hint={WHITEPAPER_INTRO} error={errors.whitepaper} delay={0}>
                                            <Question id="wp-questions" label="Which open questions do you want to respond to?" optionalMark={false} hint="From Section 21 of the whitepaper. Pick any that apply.">
                                                <div className="grid gap-2">
                                                    {WHITEPAPER_QUESTIONS.map((q) => (
                                                        <CheckRow key={q.label} name="wpQuestions" value={q.label} label={q.label} hint={q.hint} checked={form.wpQuestions.includes(q.label)} onChange={toggleIn('wpQuestions')} disabled={isSending} />
                                                    ))}
                                                </div>
                                            </Question>
                                            <Question id="wp-comments" label="Your comments" optionalMark={false} hint="Refer to section numbers where you can. Anything from a one-line objection to a full response is welcome.">
                                                <LongText id="wp-comments-text" value={form.wpComments} onChange={set('wpComments')} disabled={isSending} rows={8} placeholder="e.g. Section 9.1 — the consent artifact should also carry…" />
                                            </Question>
                                        </Section>
                                    )}

                                    {/* Human check */}
                                    <Section
                                        id="check"
                                        title={<span className="inline-flex items-center gap-2"><ShieldCheck size={18} className="text-[var(--text-orange-500)]" /> One last check</span>}
                                        hint="A quick verification that helps us screen out automated spam."
                                        error={errors.captcha || captchaMsg}
                                        delay={0.2}
                                    >
                                        {SITE_KEY ? (
                                            <Turnstile
                                                siteKey={SITE_KEY}
                                                action="fln-dpi-interest"
                                                resetKey={captchaReset}
                                                onToken={(t) => {
                                                    setToken(t);
                                                    if (t) {
                                                        setCaptchaMsg('');
                                                        setErrors((e) => (e.captcha ? { ...e, captcha: undefined } : e));
                                                    }
                                                }}
                                                onError={setCaptchaMsg}
                                                className="min-h-[65px]"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">Verification is unavailable right now.</p>
                                        )}

                                        {/* Honeypot: invisible to people, tempting to bots. */}
                                        <div aria-hidden="true" className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none">
                                            <label>
                                                Website
                                                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website')(e.target.value)} />
                                            </label>
                                        </div>
                                    </Section>

                                    {status === 'error' && (
                                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
                                            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-red-700">{errorMsg}</p>
                                        </motion.div>
                                    )}

                                    <motion.div {...fadeUp(0.25)}>
                                        <button
                                            type="submit"
                                            disabled={isSending || !configured}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-7 py-3.5 rounded-[10px] transition-all cursor-pointer hover:bg-[#ff6207] hover:scale-[1.015] hover:shadow-md active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#0a0a0a] disabled:hover:scale-100 disabled:hover:shadow-none"
                                        >
                                            {isSending ? (
                                                <><Loader2 size={15} className="animate-spin" /> Sending…</>
                                            ) : (
                                                <>Submit <Send size={15} /></>
                                            )}
                                        </button>
                                        <p className="text-xs text-gray-400 mt-3">
                                            We will only use your details to follow up about the FLN DPI and Bodhan open models.
                                        </p>
                                    </motion.div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FlnDpiPage;
