import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

/**
 * The announcement strip above the navbar.
 *
 * It scrolls away with the page rather than sticking: the navbar below it is the
 * thing that has to stay reachable, and a permanent bar would eat a line of
 * every screen for the whole visit.
 *
 * DISMISSAL is remembered per announcement, not per site. The key carries the
 * announcement's id, so closing this one does not silently close the next one —
 * change `ANNOUNCEMENT` and every reader sees the new message once, including
 * those who dismissed the last.
 *
 * Set `ANNOUNCEMENT` to null to take the strip down.
 */
const ANNOUNCEMENT = {
    id: 'releases-2026-09',
    label: 'Coming soon',
    message: 'Four open Indic models releasing soon',
};

const storageKey = (id) => `bodhan-announcement-dismissed:${id}`;

const AnnouncementBar = () => {
    // Starts hidden and appears once we know it was not dismissed: the other way
    // round, a returning reader sees a flash of a bar they already closed.
    const [shown, setShown] = useState(false);

    useEffect(() => {
        if (!ANNOUNCEMENT) return;
        try {
            setShown(window.localStorage.getItem(storageKey(ANNOUNCEMENT.id)) !== '1');
        } catch {
            // Private mode, or storage blocked: show it, and accept that the
            // dismissal will not survive the visit.
            setShown(true);
        }
    }, []);

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
            className="relative w-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--text-orange-500)] text-white"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 px-10 sm:px-12 py-2.5 text-center">
                <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-[0.09em] text-white/90">
                    {ANNOUNCEMENT.label}
                </span>
                <span className="text-[13px] sm:text-sm font-semibold leading-snug">
                    {ANNOUNCEMENT.message}
                </span>
            </div>
            <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss announcement"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 grid place-items-center h-7 w-7 rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                <X size={15} aria-hidden="true" />
            </button>
        </div>
    );
};

export default AnnouncementBar;
