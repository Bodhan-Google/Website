import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../../utils/tailwindUtils';

/**
 * "Available across India's AI ecosystem": where a model can actually be used.
 *
 * One card, one data shape, for every post on the site, including the ones
 * mounted from prebuilt bundles (their own bands are hidden and this renders
 * in their place). It sits inside the article column, so it reads as part of
 * the post rather than as a second footer.
 *
 * Text on the left, platform chips on the right in a column capped at 26rem so
 * a longer list wraps to a second row instead of squeezing the text.
 *
 * platforms: [{ name, href?, note?, mark? }]. Without a usable href the
 * platform is still listed, muted, with a "soon" tag, so a pending deployment
 * can be shown without inventing a URL. `mark` names a logo below.
 */
const GITHUB_PATH =
    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';

// Logo files live in public/images (the AIKosh one is its 32px favicon, the
// best its site serves); GitHub's mark is the single-path simple-icons glyph.
const image = (file) => `${import.meta.env.BASE_URL}images/${file}`;
const MARKS = {
    bodhan: image('bodhan_mark.svg'),
    huggingface: image('huggingface_mark.png'),
    bhashini: image('bhashini_mark.png'),
    aikosh: image('aikosh_mark.png'),
    ai4bharat: image('logo_ai4bharat.png'),
};

const Mark = ({ mark }) => {
    if (mark === 'github') {
        return (
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden="true">
                <path d={GITHUB_PATH} />
            </svg>
        );
    }
    const src = MARKS[mark];
    if (!src) return null;
    return <img src={src} alt="" className="h-[18px] w-[18px] shrink-0 object-contain" loading="lazy" />;
};

const isLive = (platform) => Boolean(platform.href && platform.href !== '#');

const EcosystemCard = ({
    title = "Available across India's AI ecosystem",
    description,
    platforms = [],
    className,
}) => {
    if (!platforms.length) return null;

    // "Available across X" reads as eyebrow + heading; any other title is the heading.
    const heading = title.replace(/^Available across\s+/i, '');
    const eyebrow = heading !== title ? 'Available across' : null;

    return (
        <aside
            aria-label={title}
            className={cn(
                'mt-12 grid grid-cols-1 items-center gap-x-8 gap-y-5 rounded-2xl border border-[var(--primary-100)] bg-white px-6 py-6 shadow-[0_1px_2px_rgba(46,50,56,0.04)] md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:px-7',
                className
            )}
        >
            <div className="min-w-0">
                {eyebrow && (
                    <p className="m-0 mb-1.5 text-[11px] font-bold uppercase leading-none tracking-[0.12em] text-[var(--text-orange-500)]">
                        {eyebrow}
                    </p>
                )}
                <p role="heading" aria-level="3" className="m-0 font-manrope text-lg font-bold leading-snug tracking-tight text-[var(--text-primary)]">{heading}</p>
                {description && (
                    <p className="m-0 mt-1.5 max-w-[44ch] text-sm leading-relaxed text-[var(--color-11)]">{description}</p>
                )}
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
                {platforms.map((platform) => {
                    const live = isLive(platform);
                    const external = live && /^https?:/.test(platform.href);
                    const chip =
                        'inline-flex items-center gap-2 rounded-xl border px-3 py-2 font-manrope text-sm font-semibold transition-colors duration-200';
                    return (
                        <div key={platform.name}>
                            {live ? (
                                <a
                                    href={platform.href}
                                    target={external ? '_blank' : undefined}
                                    rel={external ? 'noopener noreferrer' : undefined}
                                    title={platform.note}
                                    className={cn(
                                        chip,
                                        'no-ext-arrow border-[#F1E4D3] bg-white text-[var(--text-primary)] hover:border-[var(--primary-100)] hover:bg-[var(--navbar-bg)]'
                                    )}
                                >
                                    <Mark mark={platform.mark} />
                                    <span>{platform.name}</span>
                                    {external && (
                                        <ArrowUpRight size={13} className="text-[var(--text-orange-500)]" aria-hidden="true" />
                                    )}
                                </a>
                            ) : (
                                <span
                                    title={platform.note}
                                    className={cn(chip, 'border-dashed border-[#F1E4D3] bg-[var(--bg-cream-50)] text-[var(--color-11)]')}
                                >
                                    <Mark mark={platform.mark} />
                                    <span>{platform.name}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-14)]">soon</span>
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default EcosystemCard;
