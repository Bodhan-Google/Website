import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import {
    Download, Link2, Check, ShieldCheck, ShieldAlert, KeyRound,
    Quote, Mail, Scale, FileText,
} from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import licenseMd from '../data/indic-open-model-license-v1.md?raw';

// The markdown file is the single source of truth for the legal text. This page
// only decides how it is laid out; it never rewrites a clause. To publish a new
// revision, replace the .md, bump VERSION_LABEL and point PDF_DRIVE_ID at the
// new file.
const VERSION_LABEL = 'Version 1.0';
const NOTICES_EMAIL = 'support@bodhan.ai';
// The PDF lives on Google Drive, like the tender documents: one link to
// download it directly, one shareable view link for "Copy link".
const PDF_DRIVE_ID = '1yLL3ZtIMKkBnzNlbk--ujXawRLXBxd-W';
const PDF_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${PDF_DRIVE_ID}`;
const PDF_SHARE_URL = `https://drive.google.com/file/d/${PDF_DRIVE_ID}/view?usp=sharing`;

// Non-binding orientation for readers, drawn from the Preamble and the sections
// it points to. Every line names the section that actually governs.
const AT_A_GLANCE = [
    {
        icon: ShieldCheck,
        tone: 'ok',
        title: 'You can',
        items: [
            'Use, copy, modify, fine-tune and self-host the models in your own products, commercially or not, at any scale, royalty-free. §1, §7',
            'Keep fine-tunes and other Derivatives private for Internal Use with no obligations. §7',
            'Share Derivatives, as long as they carry this same License. §5',
            'Credit the model: "Built with [Model Name] from Bodhan AI / AI4Bharat" wherever it is made available to others. §2',
        ],
    },
    {
        icon: KeyRound,
        tone: 'warn',
        title: 'Needs written approval',
        items: [
            'Hosting: giving a Third Party direct API or hosted access to run or fine-tune the model. §3',
            'Waived if you publicly release the hosted Derivative under this License within 90 days and keep it current. §4',
            'Not required for Internal Use or for Eligible Public-Interest Entities. §3.3, §13',
            'Your own product above 500M monthly active users or US$250M annual revenue needs a separate license. §14',
        ],
    },
    {
        icon: ShieldAlert,
        tone: 'no',
        title: 'Never',
        items: [
            'Child sexual abuse material, weapons development, mass surveillance or social scoring, disinformation. §10',
            'Non-consensual voice or likeness impersonation, robocalls and vishing, exclusive-relationship AI companions. §10',
            'Remove attribution, claim IP over the models, or circumvent safety and watermarking measures. §2.5, §8',
        ],
    },
];

const TONE = {
    ok: { ring: 'border-emerald-200', bg: 'bg-emerald-50', icon: 'text-emerald-600' },
    warn: { ring: 'border-amber-200', bg: 'bg-amber-50', icon: 'text-amber-600' },
    no: { ring: 'border-red-200', bg: 'bg-red-50', icon: 'text-red-600' },
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// "3. Third-Party Hosting" → { num: '3', title: 'Third-Party Hosting' }
const splitHeading = (text) => {
    const m = /^(\d+)\.\s+(.*)$/.exec(text);
    return m ? { num: m[1], title: m[2] } : { num: null, title: text };
};

const textOf = (node) => {
    if (!node) return '';
    if (node.type === 'text') return node.value;
    return (node.children || []).map(textOf).join('');
};

// The h1 is rendered by the page header, and the copyright line right after it
// becomes part of the header too.
const [, COPYRIGHT_LINE, BODY_MD] = (() => {
    const m = /^# (.+)\n\n([^\n]+)\n\n([\s\S]*)$/.exec(licenseMd.trim());
    return m ? [m[1], m[2], m[3]] : ['', '', licenseMd];
})();

const TOC = [...BODY_MD.matchAll(/^## (.+)$/gm)].map((m) => {
    const text = m[1].trim();
    return { id: slugify(text), text, ...splitHeading(text) };
});

// ─── Markdown → styled elements ───────────────────────────────────────────────

const components = {
    h2: ({ node }) => {
        const text = textOf(node).trim();
        const { num, title } = splitHeading(text);
        return (
            <h2 id={slugify(text)} className="scroll-mt-32 flex items-baseline gap-3 text-xl md:text-2xl font-semibold text-[#1A1A1A] mt-12 mb-5 pt-8 border-t border-gray-100 first:mt-0 first:pt-0 first:border-0">
                {num !== null && <span className="text-[var(--text-orange-500)] tabular-nums">{num}.</span>}
                <span>{title}</span>
            </h2>
        );
    },
    p: ({ node, children }) => {
        const first = node?.children?.[0];
        const text = textOf(node);
        const kids = Array.isArray(children) ? children : [children];

        // **3.1** Clause text…  → numbered clause row
        if (first?.type === 'strong' && /^\d+\.\d+$/.test(textOf(first).trim())) {
            return (
                <p className="flex gap-3 md:gap-4 text-[15px] leading-relaxed text-gray-700 mt-4">
                    <span className="flex-shrink-0 mt-[3px] h-6 min-w-[2.75rem] px-2 inline-flex items-center justify-center rounded-md bg-orange-50 border border-orange-100 text-xs font-semibold text-[var(--text-orange-500)] tabular-nums">
                        {textOf(first).trim()}
                    </span>
                    <span className="min-w-0">{kids.slice(1)}</span>
                </p>
            );
        }

        // **"Term"** means…  → definition row. The quotes stay in the source text
        // (and the download); on screen the bold term reads cleaner without them.
        if (first?.type === 'strong' && /^["“]/.test(textOf(first).trim())) {
            return (
                <p className="text-[15px] leading-relaxed text-gray-700 mt-4 pl-4 border-l-2 border-orange-200">
                    <strong className="font-semibold text-[#1A1A1A]">{textOf(first).replace(/["“”]/g, '')}</strong>
                    {kids.slice(1)}
                </p>
            );
        }

        // ALL-CAPS warranty / liability text → set apart, not shouted
        if (text.length > 120 && text === text.toUpperCase()) {
            return (
                <p className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-[12.5px] leading-relaxed tracking-wide text-gray-600 uppercase">
                    {kids}
                </p>
            );
        }

        return <p className="text-[15px] leading-relaxed text-gray-700 mt-4 first:mt-0">{kids}</p>;
    },
    strong: ({ children }) => <strong className="font-semibold text-[#1A1A1A]">{children}</strong>,
    em: ({ children }) => <em className="text-gray-500">{children}</em>,
    a: ({ href, children }) => (
        <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-[var(--text-orange-500)] underline underline-offset-2 hover:opacity-80 break-words">
            {children}
        </a>
    ),
    blockquote: ({ children }) => (
        <blockquote className="mt-4 flex gap-3 rounded-xl bg-orange-50 border border-orange-100 px-4 py-3 text-[15px] text-[#1A1A1A] [&_p]:mt-0 [&_p]:text-[#1A1A1A] [&_p]:font-medium">
            <Quote size={16} className="text-[var(--text-orange-500)] flex-shrink-0 mt-1" />
            <div className="min-w-0">{children}</div>
        </blockquote>
    ),
    ul: ({ children }) => <ul className="mt-3 space-y-2">{children}</ul>,
    li: ({ children }) => (
        <li className="flex gap-3 text-[15px] leading-relaxed text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-orange-500)] flex-shrink-0 mt-[0.65em]" />
            <span className="min-w-0 [&_p]:mt-0">{children}</span>
        </li>
    ),
    hr: () => <hr className="my-8 border-gray-100" />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const IndicOpenModelLicensePage = () => {
    const [active, setActive] = useState(TOC[0]?.id);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const previous = document.title;
        document.title = `Indic Open Model License ${VERSION_LABEL} | Bodhan.AI`;
        window.scrollTo(0, 0);
        return () => { document.title = previous; };
    }, []);

    // Scroll-spy for the table of contents. The active section is the last
    // heading that has scrolled above the reading line (just under the sticky
    // navbar). Computed on every scroll frame, so it never "sticks" inside a
    // long section or skips a heading on a fast scroll, which an
    // IntersectionObserver on a thin viewport band did.
    useEffect(() => {
        const READING_LINE = 160; // px from the top; headings use scroll-mt-32 (128px)
        let frame = 0;
        const update = () => {
            frame = 0;
            let current = TOC[0]?.id;
            for (const t of TOC) {
                const el = document.getElementById(t.id);
                if (!el) continue;
                if (el.getBoundingClientRect().top <= READING_LINE) current = t.id;
                else break;
            }
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
            if (atBottom && TOC.length) current = TOC[TOC.length - 1].id;
            setActive((prev) => (prev === current ? prev : current));
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        schedule();
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
        };
    }, []);

    // Scroll programmatically rather than via "#section" hrefs, so the URL stays
    // clean and the same code works under any router.
    const jumpTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(id);
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(PDF_SHARE_URL);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // Clipboard blocked (insecure context / permissions). The URL bar still works.
        }
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
                    <div className="relative max-w-6xl mx-auto px-5 md:px-6 pt-10 md:pt-16 pb-8 md:pb-10">
                        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-3xl">
                            <h1 className="text-3xl md:text-5xl font-semibold text-[#1A1A1A] leading-[1.15] mb-4">
                                Indic Open Model <span className="text-[var(--text-orange-500)]">License 1.0</span>
                            </h1>
                            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                                The terms under which Bodhan AI releases its open-weight models for Indian languages: speech recognition, OCR, text-to-speech, translation and transliteration. Broad, no-cost use for research, government, nonprofit and commercial work, with one main restriction on hosting the models for others.
                            </p>
                            {COPYRIGHT_LINE && <p className="text-sm text-gray-500 mt-4">{COPYRIGHT_LINE}</p>}

                            <div className="flex flex-wrap items-center gap-2 mt-6">
                                <a
                                    href={PDF_DOWNLOAD_URL}
                                    download
                                    className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-4 py-2.5 rounded-[10px] hover:bg-[#ff6207] transition-colors"
                                >
                                    <Download size={15} /> Download PDF
                                </a>
                                <button
                                    type="button"
                                    onClick={copyLink}
                                    className="inline-flex items-center gap-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 px-4 py-2.5 rounded-[10px] hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    {copied ? <><Check size={15} className="text-emerald-600" /> Copied</> : <><Link2 size={15} /> Copy link</>}
                                </button>
                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 ml-1">
                                    <Scale size={13} /> Governed by the laws of India · Arbitration seated in Chennai
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Body */}
                <div className="max-w-6xl mx-auto px-5 md:px-6 pb-16 md:pb-24">
                    <div className="grid lg:grid-cols-[240px_minmax(0,1fr)] gap-6 lg:gap-10 items-start">
                        {/* TOC */}
                        <motion.nav
                            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
                            aria-label="Sections"
                            className="lg:sticky lg:top-40 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto"
                        >
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 px-2 mb-2">Contents</p>
                            <ol className="space-y-0.5">
                                {TOC.map((t) => (
                                    <li key={t.id}>
                                        <button
                                            type="button"
                                            onClick={() => jumpTo(t.id)}
                                            aria-current={active === t.id ? 'true' : undefined}
                                            className={`w-full text-left cursor-pointer flex gap-2 rounded-lg px-2 py-1.5 text-[13px] leading-snug transition-colors ${active === t.id ? 'bg-orange-50 text-[#1A1A1A] font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-[#1A1A1A]'}`}
                                        >
                                            <span className={`w-6 flex-shrink-0 tabular-nums ${active === t.id ? 'text-[var(--text-orange-500)]' : 'text-gray-400'}`}>
                                                {t.num !== null ? `${t.num}.` : '§'}
                                            </span>
                                            <span>{t.title}</span>
                                        </button>
                                    </li>
                                ))}
                            </ol>
                            <div className="border-t border-gray-100 mt-3 pt-3 px-2">
                                <a href={`mailto:${NOTICES_EMAIL}`} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[var(--text-orange-500)] break-all">
                                    <Mail size={12} /> Notices: {NOTICES_EMAIL}
                                </a>
                            </div>
                        </motion.nav>

                        <div className="space-y-5 min-w-0">
                            {/* At a glance */}
                            <motion.section
                                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }}
                                aria-labelledby="glance-title"
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-7"
                            >
                                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                                    <h2 id="glance-title" className="text-base md:text-lg font-semibold text-[#1A1A1A]">At a glance</h2>
                                    <p className="text-xs text-gray-500">A convenience summary. It is not part of the License; the text below governs.</p>
                                </div>
                                <div className="grid md:grid-cols-3 gap-3">
                                    {AT_A_GLANCE.map(({ icon: Icon, tone, title, items }) => (
                                        <div key={title} className={`rounded-xl border ${TONE[tone].ring} ${TONE[tone].bg} p-4`}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Icon size={16} className={TONE[tone].icon} />
                                                <h3 className="text-sm font-semibold text-[#1A1A1A]">{title}</h3>
                                            </div>
                                            <ul className="space-y-2">
                                                {items.map((it) => (
                                                    <li key={it} className="text-[13px] leading-relaxed text-gray-700">{it}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* The License */}
                            <motion.article
                                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 }}
                                className="group/doc bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-10"
                            >
                                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-4">
                                    <FileText size={13} /> Full text · {VERSION_LABEL}
                                </div>
                                {/* Wrapper so the first heading is a real first-child and its spacing resets apply. */}
                                <div>
                                    <ReactMarkdown components={components}>{BODY_MD}</ReactMarkdown>
                                </div>
                            </motion.article>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default IndicOpenModelLicensePage;
