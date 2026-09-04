import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    BookOpen, Network, Layers, ShieldCheck, Send, Mail,
    CheckCircle, Loader2, AlertCircle, ArrowRight, EyeOff,
} from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import Turnstile from './Turnstile';
import {
    PAGE_TITLE, CONTACT_EMAIL, INTRO, PROMPTS, ROLES, TOPICS,
    FEEDBACK_MIN, FEEDBACK_MAX, NAME_MAX, EMAIL_MAX, ORG_MAX,
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

const TOPIC_ICONS = { fln: BookOpen, dpi: Network, both: Layers };

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay },
});

const EMPTY_FORM = {
    role: '',
    topic: '',
    feedback: '',
    name: '',
    email: '',
    organisation: '',
    website: '', // honeypot — stays empty for humans
};

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

const Chip = ({ name, value, checked, onChange, disabled, icon: Icon, children }) => (
    <label
        className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm select-none transition-all
            has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange-300
            ${checked
                ? 'border-[var(--text-orange-500)] bg-orange-50 text-[#1A1A1A] shadow-[0_0_0_1px_var(--text-orange-500)]'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={() => onChange(value)}
            disabled={disabled}
            className="sr-only"
        />
        <span
            aria-hidden="true"
            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'border-[var(--text-orange-500)]' : 'border-gray-300'}`}
        >
            {checked && <span className="w-2 h-2 rounded-full bg-[var(--text-orange-500)]" />}
        </span>
        {Icon && <Icon size={15} className={checked ? 'text-[var(--text-orange-500)]' : 'text-gray-400'} />}
        {children}
    </label>
);

const TextInput = ({ id, label, type = 'text', value, onChange, placeholder, maxLength, error, disabled, autoComplete }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            {label}
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

// ─── Side column ──────────────────────────────────────────────────────────────

const AboutPanel = () => (
    <motion.aside {...fadeUp(0.1)} className="lg:sticky lg:top-40 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-7">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">About this consultation</h2>
            <div className="space-y-3.5 text-[15px] leading-relaxed text-gray-700">
                {INTRO.map((para) => <p key={para.slice(0, 32)}>{para}</p>)}
            </div>

            <div className="border-t border-gray-100 mt-6 pt-5">
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">What we would love to hear about</h3>
                <ul className="space-y-2.5">
                    {PROMPTS.map((p) => (
                        <li key={p} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-orange-500)] flex-shrink-0 mt-2" />
                            {p}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[var(--text-orange-500)]">
                    <Mail size={17} />
                </div>
                <h3 className="text-sm font-semibold text-[#1A1A1A]">Have a detailed submission?</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
                If you have longer feedback or documents to attach, email it to us instead.
            </p>
            <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('FLN / DPI feedback')}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-orange-500)] hover:underline break-all"
            >
                {CONTACT_EMAIL} <ArrowRight size={14} />
            </a>
        </div>
    </motion.aside>
);

// ─── Success ──────────────────────────────────────────────────────────────────

const SuccessCard = ({ onAgain }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 text-center"
    >
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Thank you. Your feedback has been received.</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto mb-8">
            Nothing you sent will be published. If you left an email address, we will only use it if we need to follow up.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
                type="button"
                onClick={onAgain}
                className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-5 py-2.5 rounded-[10px] hover:bg-[#ff6207] transition-colors cursor-pointer"
            >
                Share another response
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
    const [token, setToken] = useState('');
    const [captchaMsg, setCaptchaMsg] = useState('');
    const [captchaReset, setCaptchaReset] = useState(0);

    const isSending = status === 'sending';
    const configured = Boolean(SCRIPT_URL) && Boolean(SITE_KEY);

    useEffect(() => {
        window.scrollTo(0, 0);
        const previous = document.title;
        document.title = PAGE_TITLE;
        return () => { document.title = previous; };
    }, []);

    const set = (key) => (value) => {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => (key in e ? { ...e, [key]: undefined } : e));
    };

    const validate = () => {
        const errs = {};
        if (!form.role) errs.role = 'Please choose what describes you best.';
        if (!form.topic) errs.topic = 'Please choose a topic.';
        const fb = form.feedback.trim();
        if (!fb) errs.feedback = 'Please share your ideas or feedback.';
        else if (fb.length < FEEDBACK_MIN) errs.feedback = `A little more detail would help — at least ${FEEDBACK_MIN} characters.`;
        if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) errs.email = 'That does not look like an email address.';
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
                    role: form.role,
                    topic: form.topic,
                    feedback: form.feedback.trim(),
                    name: form.name.trim(),
                    email: form.email.trim(),
                    organisation: form.organisation.trim(),
                    website: form.website,
                    turnstileToken: token,
                }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || 'Submission failed');
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

    const feedbackLen = form.feedback.length;
    const nearLimit = FEEDBACK_MAX - feedbackLen <= 200;

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
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-orange-500)] animate-pulse" />
                                Public consultation · Open
                            </span>
                            <h1 className="text-3xl md:text-5xl font-semibold text-[#1A1A1A] leading-[1.15] mb-4">
                                Share your ideas on <span className="text-[var(--text-orange-500)]">Foundational Literacy &amp; Numeracy</span> and <span className="text-[var(--text-orange-500)]">Digital Public Infrastructure</span>
                            </h1>
                            <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                                Inviting ideas and feedback from everyone who teaches, learns, builds or cares about the foundations of education in India. Nothing you send is published, and you may stay anonymous.
                            </p>
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
                                <SuccessCard onAgain={resetAll} />
                            ) : (
                                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                                    <motion.div {...fadeUp(0.05)} className="flex items-center gap-2 text-sm text-gray-500 px-1">
                                        <EyeOff size={15} className="text-gray-400" />
                                        Nothing you send is published. Leave your details blank to stay anonymous.
                                    </motion.div>

                                    {!configured && (
                                        <motion.div {...fadeUp(0.05)} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
                                            <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-amber-800 leading-relaxed">
                                                This form is not accepting submissions right now. Please email your feedback to{' '}
                                                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">{CONTACT_EMAIL}</a>.
                                                {import.meta.env.DEV && (
                                                    <span className="block mt-1 font-mono text-xs text-amber-700">
                                                        dev: set VITE_FLN_DPI_SCRIPT_URL (and optionally VITE_TURNSTILE_SITE_KEY) in .env.local
                                                    </span>
                                                )}
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* 1 · Role */}
                                    <Section id="role" step={1} title="What describes you best?" error={errors.role} delay={0.1}>
                                        <fieldset disabled={isSending}>
                                            <legend className="sr-only">What describes you best?</legend>
                                            <div className="flex flex-wrap gap-2">
                                                {ROLES.map((r) => (
                                                    <Chip key={r} name="role" value={r} checked={form.role === r} onChange={set('role')} disabled={isSending}>
                                                        {r}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </fieldset>
                                    </Section>

                                    {/* 2 · Topic */}
                                    <Section id="topic" step={2} title="What is your feedback about?" error={errors.topic} delay={0.15}>
                                        <fieldset disabled={isSending}>
                                            <legend className="sr-only">Topic</legend>
                                            <div className="grid sm:grid-cols-3 gap-2.5">
                                                {TOPICS.map((t) => {
                                                    const Icon = TOPIC_ICONS[t.id];
                                                    const checked = form.topic === t.id;
                                                    return (
                                                        <label
                                                            key={t.id}
                                                            className={`relative flex flex-col gap-2 rounded-xl border p-4 select-none transition-all
                                                                has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange-300
                                                                ${checked
                                                                    ? 'border-[var(--text-orange-500)] bg-orange-50 shadow-[0_0_0_1px_var(--text-orange-500)]'
                                                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}
                                                                ${isSending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="topic"
                                                                value={t.id}
                                                                checked={checked}
                                                                onChange={() => set('topic')(t.id)}
                                                                disabled={isSending}
                                                                className="sr-only"
                                                            />
                                                            <div className="flex items-center justify-between">
                                                                <span className={`w-9 h-9 rounded-xl flex items-center justify-center border ${checked ? 'bg-white border-orange-200 text-[var(--text-orange-500)]' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                                                                    <Icon size={17} />
                                                                </span>
                                                                <span
                                                                    aria-hidden="true"
                                                                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${checked ? 'border-[var(--text-orange-500)]' : 'border-gray-300'}`}
                                                                >
                                                                    {checked && <span className="w-2 h-2 rounded-full bg-[var(--text-orange-500)]" />}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm font-semibold text-[#1A1A1A] leading-snug">{t.label}</span>
                                                            <span className="text-xs text-gray-500 leading-relaxed">{t.hint}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </fieldset>
                                    </Section>

                                    {/* 3 · Feedback */}
                                    <Section id="feedback" step={3} title="Give your ideas / feedback" error={errors.feedback} delay={0.2}>
                                        <label htmlFor="feedback-text" className="sr-only">Your ideas or feedback</label>
                                        <textarea
                                            id="feedback-text"
                                            value={form.feedback}
                                            onChange={(e) => set('feedback')(e.target.value)}
                                            maxLength={FEEDBACK_MAX}
                                            rows={9}
                                            disabled={isSending}
                                            placeholder="Tell us what you have seen, what you think should change, and why. Specific examples help."
                                            aria-invalid={errors.feedback ? 'true' : undefined}
                                            className={`w-full text-sm leading-relaxed px-4 py-3 rounded-[10px] border bg-white outline-none transition-colors resize-y min-h-[180px]
                                                ${errors.feedback ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[var(--text-orange-500)]'}
                                                disabled:opacity-50 disabled:cursor-not-allowed`}
                                        />
                                        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                                            <span>Any language is welcome.</span>
                                            <span className={`tabular-nums ${nearLimit ? 'text-amber-600 font-medium' : ''}`}>
                                                {feedbackLen.toLocaleString()} / {FEEDBACK_MAX.toLocaleString()}
                                            </span>
                                        </div>
                                    </Section>

                                    {/* Optional details */}
                                    <Section
                                        id="details"
                                        title="Your details"
                                        badge="Optional"
                                        hint="Leave these blank to stay anonymous. We only use them if we need to follow up."
                                        error={errors.email}
                                        delay={0.25}
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <TextInput id="name" label="Name" value={form.name} onChange={set('name')} maxLength={NAME_MAX} disabled={isSending} autoComplete="name" />
                                            <TextInput id="email" label="Email" type="email" value={form.email} onChange={set('email')} maxLength={EMAIL_MAX} disabled={isSending} autoComplete="email" error={errors.email} />
                                            <div className="sm:col-span-2">
                                                <TextInput id="organisation" label="Organisation / State" value={form.organisation} onChange={set('organisation')} maxLength={ORG_MAX} disabled={isSending} autoComplete="organization" placeholder="e.g. a school, district, NGO or company" />
                                            </div>
                                        </div>
                                    </Section>

                                    {/* Human check */}
                                    <Section
                                        id="check"
                                        title={<span className="inline-flex items-center gap-2"><ShieldCheck size={18} className="text-[var(--text-orange-500)]" /> One last check</span>}
                                        hint="A quick verification that helps us screen out automated spam."
                                        error={errors.captcha || captchaMsg}
                                        delay={0.3}
                                    >
                                        {SITE_KEY ? (
                                            <Turnstile
                                                siteKey={SITE_KEY}
                                                action="fln-dpi-feedback"
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
                                                <input
                                                    type="text"
                                                    name="website"
                                                    tabIndex={-1}
                                                    autoComplete="off"
                                                    value={form.website}
                                                    onChange={(e) => set('website')(e.target.value)}
                                                />
                                            </label>
                                        </div>
                                    </Section>

                                    {status === 'error' && (
                                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
                                            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-red-700">{errorMsg}</p>
                                        </motion.div>
                                    )}

                                    <motion.div {...fadeUp(0.35)}>
                                        <button
                                            type="submit"
                                            disabled={isSending || !configured}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-7 py-3.5 rounded-[10px] transition-all cursor-pointer hover:bg-[#ff6207] hover:scale-[1.015] hover:shadow-md active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#0a0a0a] disabled:hover:scale-100 disabled:hover:shadow-none"
                                        >
                                            {isSending ? (
                                                <><Loader2 size={15} className="animate-spin" /> Sending…</>
                                            ) : (
                                                <>Submit feedback <Send size={15} /></>
                                            )}
                                        </button>
                                        <p className="text-xs text-gray-400 mt-3">
                                            By submitting you confirm the information is your own.
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
