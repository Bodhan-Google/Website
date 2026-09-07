import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * The announcement strip, rendered as the navbar's own bottom edge.
 *
 * Inside the sticky bar rather than above it, so the two read as one header and
 * the message stays with the reader instead of scrolling away on the first
 * flick. Closing it takes the strip out of the header entirely.
 *
 * DISMISSAL is remembered per announcement, not per site. The key carries the
 * announcement's id, so closing this one does not silently close the next one —
 * change `ANNOUNCEMENT` and every reader sees the new message once, including
 * those who dismissed the last.
 *
 * Set `ANNOUNCEMENT` to null to take the strip down.
 */
const ANNOUNCEMENT = {
    // A new id, so everyone sees this one — including the readers who dismissed
    // the "coming soon" strip it replaces.
    id: 'releases-2026-09-live',
    label: 'Live',
    message: 'Four open Indic models released',
    cta: { label: 'Check them out', to: '/research/blogs' },
};

const storageKey = (id) => `bodhan-announcement-dismissed:${id}`;

const AnnouncementBar = () => {
    // Read at first render, not in an effect: an effect would paint the strip and
    // then take it away again, which a returning reader sees as a flash of a bar
    // they already closed.
    const [shown, setShown] = useState(() => {
        if (!ANNOUNCEMENT) return false;
        try {
            return window.localStorage.getItem(storageKey(ANNOUNCEMENT.id)) !== '1';
        } catch {
            // Private mode, or storage blocked: show it, and accept that the
            // dismissal will not survive the visit.
            return true;
        }
    });

    const dismiss = () => {
        setShown(false);
        try {
            window.localStorage.setItem(storageKey(ANNOUNCEMENT.id), '1');
        } catch {
            // Nothing to do: it is closed for this page either way.
        }
    };

    if (!ANNOUNCEMENT || !shown) return null;

    return (
        <div
            role="region"
            aria-label="Announcement"
            className="relative z-0 w-full text-white"
            // The gradient is written here rather than as Tailwind gradient-stop
            // classes: `from-[var(--…)]` / `to-[var(--…)]` do not compile in this
            // project's Tailwind, so the strip shipped with `background-image:
            // linear-gradient(var(--tw-gradient-stops))` and no stops — white text
            // on the cream navbar, invisible but still taking a row.
            style={{
                background: 'linear-gradient(90deg, var(--primary-500), var(--text-orange-500))',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            }}
        >
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:gap-x-6 px-11 sm:px-14 py-3 text-center">
                <span className="hidden sm:inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.09em] text-white/90">
                    {/* A live dot: the ring pulses, the dot itself stays solid, and
                        neither moves for a reader who asked for less motion. */}
                    <span className="relative grid h-2.5 w-2.5 place-items-center" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-70 motion-safe:animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                    </span>
                    {ANNOUNCEMENT.label}
                </span>
                <span className="text-[15px] sm:text-base font-semibold leading-snug">
                    {ANNOUNCEMENT.message}
                </span>
                {ANNOUNCEMENT.cta && (
                    <Link
                        to={ANNOUNCEMENT.cta.to}
                        className="inline-flex items-center gap-1 text-[15px] sm:text-base font-semibold underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white"
                    >
                        {ANNOUNCEMENT.cta.label}
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                )}
            </div>
            <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss announcement"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 grid place-items-center h-8 w-8 rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                <X size={17} aria-hidden="true" />
            </button>
        </div>
    );
};

export default AnnouncementBar;
