import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import TableOfContents from '../components/TableOfContents';
import EcosystemCard from '../components/EcosystemCard';

/**
 * The IndicOCR announcement, mounted as its own page.
 *
 * The post arrived as a compiled static site (repo root: indicocr-post/, a
 * prebuilt React bundle plus ~14 MB of pre-rendered book pages) with no source
 * to integrate, so it is served verbatim from public/indic-ocr-post/ and shown
 * here in a same-origin frame under the site's navbar and footer. The frame is
 * sized to its content, so the whole page scrolls as one document, like every
 * other page on the site. Lazy images and visibility observers inside a
 * same-origin frame measure against the real window, so nothing loads early.
 *
 * Because the frame is content-sized, nothing inside it can be `position:
 * fixed` to the reader's viewport, so those parts are handled from here:
 *   - the bundle's reading-progress bar is hidden and this page draws the
 *     site's own from the page scroll;
 *   - the bundle's contents rail is hidden and the site's own TableOfContents
 *     is used instead, pointed at the headings inside the frame: the original
 *     tracks its own window's scroll, which never moves in a content-sized
 *     frame, so it could neither stay fixed nor highlight the section in view;
 *   - the bundle's ecosystem band is hidden and the site's EcosystemCard is
 *     rendered under the frame, in the article column;
 *   - the animated pipeline diagram (135 frames, decoded continuously while
 *     visible) is swapped for its still while off screen;
 *   - the bundle's own footer (a div.footer) is hidden; the site's follows.
 *
 * public/indic-ocr-post/index.html carries the rest: the load splash is
 * disabled, IntersectionObserver is stubbed so framer-motion's scroll-in
 * reveals show at rest (the real one is kept at __RealIntersectionObserver),
 * and every image gets a shimmer skeleton until it has loaded.
 *
 * To take a newer drop: copy the folder over public/indic-ocr-post/, redo the
 * asset-path and bundle rewrites, and re-apply the index.html patches (see the
 * commits that added this file).
 */
const FRAME_SRC = `${import.meta.env.BASE_URL}indic-ocr-post/index.html`;

// Where the model is available (from the bundle's own list; Bodhan's link is
// the site's model page).
const ECOSYSTEM = {
    title: "Available across India's AI ecosystem",
    description: 'Weights, and deployment targets.',
    platforms: [
        { name: 'Hugging Face', href: 'https://huggingface.co/bodhan-ai/indic-doc-parser', mark: 'huggingface', note: 'Weights and model card' },
        { name: 'Bhashini', mark: 'bhashini' },
        { name: 'AIKosh', mark: 'aikosh' },
        { name: 'GitHub', mark: 'github' },
        { name: 'Bodhan', href: '/developers/indic-ocr', mark: 'bodhan', note: 'Model page' },
    ],
};

// Rail labels: the bundle's long headings, shortened the way the publications'
// tocTitle does.
const RAIL_TITLES = {
    'What was our model trained on?': 'Training data',
    "Stay tuned for what's next": "What's next",
    'Help us get better at OCR!': 'Help us improve',
};

const IndicOcrPostPage = () => {
    const frameRef = useRef(null);
    const progressRef = useRef(null);
    const cleanupRef = useRef(null);
    const docRef = useRef(null);
    const [height, setHeight] = useState(1400);
    const [sections, setSections] = useState([]);

    const getElement = useCallback((id) => docRef.current?.getElementById(id) ?? null, []);

    useEffect(() => {
        const previous = document.title;
        document.title = 'IndicOCR | Bodhan.AI';
        window.scrollTo(0, 0);
        return () => { document.title = previous; };
    }, []);

    // The site's reading-progress bar, driven by the page scroll.
    useEffect(() => {
        const onScroll = () => {
            const el = progressRef.current;
            if (!el) return;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    useEffect(() => () => cleanupRef.current?.(), []);

    const onLoad = () => {
        const frame = frameRef.current;
        const doc = frame?.contentDocument;
        const win = frame?.contentWindow;
        if (!doc || !win) return;
        docRef.current = doc;

        // Hide what the site provides itself.
        const style = doc.createElement('style');
        style.textContent = [
            'footer, .footer, .progress, .rail, .ecosystem { display: none !important; }',
            // The frame never scrolls itself and ends where the article ends; the site adds the rest.
            'html, body { overflow: hidden !important; }',
            // Same column geometry as the publications: 56rem/64rem columns with the
            // 1.25rem gutter inside them, not page padding around them.
            '.page { padding: 0 !important; }',
            '.column { max-width: min(56rem, calc(100vw - 2rem)) !important; padding: 0 1.25rem; box-sizing: border-box; }',
            '.wide { max-width: min(64rem, calc(100vw - 2rem)) !important; padding: 0 1.25rem; box-sizing: border-box; }',
        ].join('\n');
        doc.head.appendChild(style);

        // Size the frame to its document and keep it sized as images load.
        const measure = () => {
            const next = Math.max(600, doc.documentElement.scrollHeight);
            setHeight((current) => (Math.abs(current - next) > 2 ? next : current));
        };
        measure();
        let observer = null;
        if (win.ResizeObserver && doc.body) {
            observer = new win.ResizeObserver(measure);
            observer.observe(doc.body);
            observer.observe(doc.documentElement);
        }
        win.addEventListener('load', measure);

        // The bundle renders its contents rail and figures only after it has
        // fetched final.md, so nothing below can be looked up once at load time:
        // the rail is re-queried on every placement and the pipeline figure is
        // attached to as soon as a DOM change makes it appear.

        // Contents rail: the article's level-2 headings (the bundle gives each a
        // header.section-header wrapper with the id it scrolls to). Re-collected as
        // the DOM changes, because the bundle renders the article after fetching
        // final.md.
        const collect = () => {
            const heads = [...doc.querySelectorAll('header.section-header[id]')]
                .filter((h) => !h.closest('.hero'))
                .map((h) => {
                    const text = h.textContent.trim();
                    return { id: h.id, title: RAIL_TITLES[text] ?? text };
                });
            setSections((current) =>
                current.length === heads.length && current.every((c, i) => c.id === heads[i].id) ? current : heads,
            );
        };
        collect();

        // Pause the animated pipeline diagram while it is off screen. The frame's
        // IntersectionObserver is the always-in-view stub from index.html, so use
        // the real one it kept aside; with no root it measures against the window.
        let pictureObserver = null;
        const RealObserver = win.__RealIntersectionObserver || window.IntersectionObserver;
        const attachPipeline = () => {
            if (pictureObserver || !RealObserver) return;
            const source = doc.querySelector('source[srcset*="pipeline.webp"]');
            const picture = source?.closest('picture');
            if (!source || !picture) return;
            const animated = source.getAttribute('srcset');
            pictureObserver = new RealObserver(([entry]) => {
                if (entry.isIntersecting) {
                    if (!source.getAttribute('srcset')) source.setAttribute('srcset', animated);
                } else if (source.getAttribute('srcset')) {
                    source.removeAttribute('srcset');
                }
            }, { rootMargin: '200px 0px' });
            pictureObserver.observe(picture);
        };
        attachPipeline();

        let domObserver = null;
        if (win.MutationObserver && doc.body) {
            domObserver = new win.MutationObserver(() => {
                collect();
                attachPipeline();
            });
            domObserver.observe(doc.body, { childList: true, subtree: true });
        }

        cleanupRef.current = () => {
            observer?.disconnect();
            domObserver?.disconnect();
            win.removeEventListener('load', measure);
            pictureObserver?.disconnect();
        };
    };

    return (
        <div className="min-h-screen research-page">
            <div ref={progressRef} className="research-reading-progress" aria-hidden="true" />
            <Navbar />
            {sections.length > 0 && (
                <TableOfContents sections={sections} getElement={getElement} railOnly />
            )}
            <iframe
                ref={frameRef}
                title="IndicOCR: document parsing for English and 22 Indian languages"
                src={FRAME_SRC}
                onLoad={onLoad}
                scrolling="no"
                style={{ display: 'block', width: '100%', height: `${height}px`, border: 0, background: '#fffaf3', overflow: 'hidden' }}
            />
            <div className="relative pb-16 md:pb-24">
                <div className="research-article-column mx-auto px-5">
                    <EcosystemCard {...ECOSYSTEM} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default IndicOcrPostPage;
