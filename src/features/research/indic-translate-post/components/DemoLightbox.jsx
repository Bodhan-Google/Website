import { useEffect, useRef } from 'react';

/**
 * The demo video, played in a lightbox over the page.
 *
 * The same treatment the Indic-Speak, Indic-Transcribe and IndicOCR posts use, so
 * all four announcements behave alike. Those three are served inside a
 * content-sized frame and have to place the modal from script; this post is the
 * page, so `position: fixed` resolves against the reader's viewport on its own.
 *
 * The src is dropped on close rather than the element hidden, because a hidden
 * YouTube iframe keeps playing.
 */
const DemoLightbox = ({ src, title, onClose }) => {
    const closeRef = useRef(null);

    useEffect(() => {
        if (!src) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        const previous = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        closeRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', onKey);
            document.documentElement.style.overflow = previous;
        };
    }, [src, onClose]);

    if (!src) return null;

    return (
        <div className="video-modal" role="dialog" aria-modal="true" aria-label={title}>
            <div className="video-backdrop" onClick={onClose} />
            <div className="video-box">
                <button
                    ref={closeRef}
                    type="button"
                    className="video-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <iframe
                    title={title}
                    src={`${src}${src.includes('?') ? '&' : '?'}autoplay=1&playsinline=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            </div>
        </div>
    );
};

export default DemoLightbox;
