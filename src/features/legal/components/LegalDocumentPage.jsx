import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Download, Link2, Check, Quote, Mail, FileText } from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import { slugify, splitHeading, textOf, numLabel, buildToc } from '../utils/legalMarkdown';

/**
 * Shared layout for long legal documents authored in markdown (the Indic Open
 * Model License, the API Terms of Use). The markdown is the single source of
 * truth; this file only decides how it is laid out and never rewrites a clause.
 *
 * Understands: `## 3. Title` and `### 6.1 Title` headings, `**3.1** clause`
 * and plain `3.1 clause` paragraphs, `**"Term"** means…` definitions,
 * blockquotes, bullet lists, and ALL-CAPS warranty text.
 */

// ─── Markdown → styled elements ───────────────────────────────────────────────

const CLAUSE_RE = /^(\d+\.\d+)\s+/;

const components = {
    h2: ({ node }) => {
        const text = textOf(node).trim();
        const { num, title } = splitHeading(text);
        return (
            <h2 id={slugify(text)} className="scroll-mt-32 flex items-baseline gap-3 text-xl md:text-2xl font-semibold text-[#1A1A1A] mt-12 mb-5 pt-8 border-t border-gray-100 first:mt-0 first:pt-0 first:border-0">
                {num !== null && <span className="text-[var(--text-orange-500)] tabular-nums">{numLabel(num)}</span>}
                <span>{title}</span>
            </h2>
        );
    },
    h3: ({ node }) => {
        const text = textOf(node).trim();
        const { num, title } = splitHeading(text);
        return (
            <h3 id={slugify(text)} className="scroll-mt-32 flex items-baseline gap-2.5 text-base md:text-lg font-semibold text-[#1A1A1A] mt-8 mb-3">
                {num !== null && <span className="text-[var(--text-orange-500)] tabular-nums text-sm">{numLabel(num)}</span>}
                <span>{title}</span>
            </h3>
        );
    },
    p: ({ node, children }) => {
        const first = node?.children?.[0];
        const text = textOf(node);
        const kids = Array.isArray(children) ? children : [children];

        const clause = (num, rest) => (
            <p className="flex gap-3 md:gap-4 text-[15px] leading-relaxed text-gray-700 mt-4">
                <span className="flex-shrink-0 mt-[3px] h-6 min-w-[2.75rem] px-2 inline-flex items-center justify-center rounded-md bg-orange-50 border border-orange-100 text-xs font-semibold text-[var(--text-orange-500)] tabular-nums">
                    {num}
                </span>
                <span className="min-w-0">{rest}</span>
            </p>
        );

        // **3.1** Clause text…
        if (first?.type === 'strong' && /^\d+\.\d+$/.test(textOf(first).trim())) {
            return clause(textOf(first).trim(), kids.slice(1));
        }
        // 3.1 Clause text… (plain)
        if (first?.type === 'text' && CLAUSE_RE.test(first.value) && typeof kids[0] === 'string') {
            const num = CLAUSE_RE.exec(first.value)[1];
            return clause(num, [kids[0].replace(CLAUSE_RE, ''), ...kids.slice(1)]);
        }

        // **"Term"** means…  → definition row. The quotes stay in the source
        // (and any download); on screen the bold term reads cleaner without them.
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
    ol: ({ children }) => <ol className="mt-3 space-y-2 list-decimal pl-6 text-[15px] leading-relaxed text-gray-700 marker:text-[var(--text-orange-500)] marker:font-semibold">{children}</ol>,
    // Bullets get an orange dot; inside an <ol> the dot is hidden and the
    // browser's decimal marker (styled on the <ol>) takes over.
    li: ({ children }) => (
        <li className="flex gap-3 text-[15px] leading-relaxed text-gray-700 [ol>&]:block">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-orange-500)] flex-shrink-0 mt-[0.65em] [ol>li>&]:hidden" />
            <span className="min-w-0 [&_p]:mt-0">{children}</span>
        </li>
    ),
    hr: () => <hr className="my-8 border-gray-100" />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * @param {object} props
 * @param {string} props.documentTitle   <title> for the tab
 * @param {import('react').ReactNode} props.heading   the h1 contents
 * @param {string} props.lede            one-paragraph plain-language intro
 * @param {string} [props.metaLine]      copyright / last-updated line under the lede
 * @param {string} props.articleLabel    small label above the full text, e.g. "Full text · Version 1.0"
 * @param {string} props.bodyMd          markdown body (after the h1 + meta line)
 * @param {{href: string, label: string}} [props.download]   primary button; omitted when absent
 * @param {string} [props.copyText]      what "Copy link" copies; defaults to the page URL
 * @param {boolean} [props.showCopyLink] hide the "Copy link" button when false
 * @param {import('react').ReactNode} [props.footnote]  small note beside the buttons
 * @param {string} [props.noticesEmail]  shown under the table of contents
 * @param {string} [props.noticesLabel]  label for that email, default "Notices"
 * @param {import('react').ReactNode} [props.panel]   optional card above the full text (e.g. "At a glance")
 */
const LegalDocumentPage = ({ documentTitle, heading, lede, metaLine, articleLabel, bodyMd, download, copyText, showCopyLink = true, footnote, noticesEmail, noticesLabel = 'Notices', panel }) => {
    const toc = buildToc(bodyMd);
    const [active, setActive] = useState(toc[0]?.id);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const previous = document.title;
        document.title = documentTitle;
        window.scrollTo(0, 0);
        return () => { document.title = previous; };
    }, [documentTitle]);

    // Scroll-spy: the active section is the last heading that has scrolled above
    // the reading line under the sticky navbar, recomputed on every scroll frame.
    useEffect(() => {
        const READING_LINE = 160; // px; headings use scroll-mt-32 (128px)
        let frame = 0;
        const update = () => {
            frame = 0;
            let current = toc[0]?.id;
            for (const t of toc) {
                const el = document.getElementById(t.id);
                if (!el) continue;
                if (el.getBoundingClientRect().top <= READING_LINE) current = t.id;
                else break;
            }
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
            if (atBottom && toc.length) current = toc[toc.length - 1].id;
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
        // toc is derived from bodyMd, which is a module constant per page
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bodyMd]);

    const jumpTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(id);
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(copyText || window.location.href);
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
                            <h1 className="text-3xl md:text-5xl font-semibold text-[#1A1A1A] leading-[1.15] mb-4">{heading}</h1>
                            <p className="text-gray-600 text-base md:text-lg leading-relaxed">{lede}</p>
                            {metaLine && <p className="text-sm text-gray-500 mt-4">{metaLine}</p>}

                            {(download || showCopyLink || footnote) && (
                            <div className="flex flex-wrap items-center gap-2 mt-6">
                                {download && (
                                    <a
                                        href={download.href}
                                        download
                                        className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-4 py-2.5 rounded-[10px] hover:bg-[#ff6207] transition-colors"
                                    >
                                        <Download size={15} /> {download.label}
                                    </a>
                                )}
                                {showCopyLink && (
                                <button
                                    type="button"
                                    onClick={copyLink}
                                    className="inline-flex items-center gap-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 px-4 py-2.5 rounded-[10px] hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    {copied ? <><Check size={15} className="text-emerald-600" /> Copied</> : <><Link2 size={15} /> Copy link</>}
                                </button>
                                )}
                                {footnote && <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 ml-1">{footnote}</span>}
                            </div>
                            )}
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
                                {toc.map((t) => (
                                    <li key={t.id}>
                                        <button
                                            type="button"
                                            onClick={() => jumpTo(t.id)}
                                            aria-current={active === t.id ? 'true' : undefined}
                                            className={`w-full text-left cursor-pointer flex gap-2 rounded-lg px-2 py-1.5 text-[13px] leading-snug transition-colors ${active === t.id ? 'bg-orange-50 text-[#1A1A1A] font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-[#1A1A1A]'}`}
                                        >
                                            <span className={`w-6 flex-shrink-0 tabular-nums ${active === t.id ? 'text-[var(--text-orange-500)]' : 'text-gray-400'}`}>
                                                {t.num !== null ? numLabel(t.num) : '§'}
                                            </span>
                                            <span>{t.title}</span>
                                        </button>
                                    </li>
                                ))}
                            </ol>
                            {noticesEmail && (
                                <div className="border-t border-gray-100 mt-3 pt-3 px-2">
                                    <a href={`mailto:${noticesEmail}`} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[var(--text-orange-500)] break-all">
                                        <Mail size={12} /> {noticesLabel}: {noticesEmail}
                                    </a>
                                </div>
                            )}
                        </motion.nav>

                        <div className="space-y-5 min-w-0">
                            {panel}

                            <motion.article
                                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-10"
                            >
                                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-4">
                                    <FileText size={13} /> {articleLabel}
                                </div>
                                {/* Wrapper so the first heading is a real first-child and its spacing resets apply. */}
                                <div>
                                    <ReactMarkdown components={components}>{bodyMd}</ReactMarkdown>
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

export default LegalDocumentPage;
