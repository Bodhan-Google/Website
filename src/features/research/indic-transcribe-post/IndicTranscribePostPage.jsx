import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import TableOfContents from '../components/TableOfContents';
import EcosystemCard from '../components/EcosystemCard';

/**
 * The Indic-Transcribe (Bodhan ASR) announcement, mounted as its own page.
 *
 * The post is a single self-contained HTML page assembled by
 * bodhan-asr-blog/src/build.py (repo root), with its audio, images and the
 * vendored GSAP beside it. It is served verbatim from
 * public/indic-transcribe-post/ (bodhan-asr.html as index.html) and shown here
 * in a same-origin frame sized to its content, so the page scrolls as one
 * document under the site's navbar and footer. Its asset paths are already
 * relative, so nothing in it needed rewriting; the entry HTML carries a small
 * site-patch that hides its progress bar, back-to-top button, footer and
 * ecosystem band, which the site provides itself: the reading-progress bar
 * is drawn here from the page scroll, the section rail is the site's
 * TableOfContents pointed at the sections inside the frame (a rail inside a
 * content-sized frame could neither stay fixed nor track the page scroll),
 * and the ecosystem card is rendered under the frame in the article column.
 *
 * To take a newer drop: copy bodhan-asr.html to index.html plus images/,
 * audio/, video/, vendor/ and in.svg, and re-apply the site-patch in <head>.
 */
const FRAME_SRC = `${import.meta.env.BASE_URL}indic-transcribe-post/index.html`;

// Where the model is available (from the page's own list; Bodhan's link is the
// site's model page).
const ECOSYSTEM = {
    title: "Available across India's AI ecosystem",
    description: 'Weights, an ONNX build, and deployment targets.',
    platforms: [
        { name: 'Hugging Face · Core', href: 'https://huggingface.co/bodhan-ai/indic-transcribe-core', mark: 'huggingface', note: 'Core weights, ONNX build, inference' },
        { name: 'Hugging Face · Flex', href: 'https://huggingface.co/bodhan-ai/indic-transcribe-flex', mark: 'huggingface', note: 'Flex weights, ONNX build, inference' },
        { name: 'Bodhan', href: '/developers/indic-transcribe', mark: 'bodhan', note: 'API and model page' },
        { name: 'Bhashini', mark: 'bhashini', note: 'National language-technology mission' },
        { name: 'AIKosh · Core', href: 'https://aikosh.indiaai.gov.in/web/models/details/indic_transcribe_core.html', mark: 'aikosh', note: 'Core on AIKosh, the India AI model repository' },
        { name: 'AIKosh · Flex', href: 'https://aikosh.indiaai.gov.in/web/models/details/indic_transcribe_flex.html', mark: 'aikosh', note: 'Flex on AIKosh, the India AI model repository' },
    ],
};

// Rail labels for the page's sections (its own headings are sentence-long).
const RAIL_TITLES = {
    coverage: 'Coverage',
    family: 'Model family',
    features: 'Key features',
    tech: 'Under the hood',
    evaluation: 'Evaluation',
    outlook: "What's next",
    invitation: 'An invitation',
};

const IndicTranscribePostPage = () => {
    const frameRef = useRef(null);
    const progressRef = useRef(null);
    const cleanupRef = useRef(null);
    // Tall enough that nothing the site renders under the frame starts on the
    // first screen: the card used to appear at the top and drop away once the
    // article was measured.
    const [height, setHeight] = useState(() => Math.max(1400, window.innerHeight * 3));
    const [measured, setMeasured] = useState(false);
    const docRef = useRef(null);
    const [sections, setSections] = useState([]);

    const getElement = useCallback((id) => docRef.current?.getElementById(id) ?? null, []);

    useEffect(() => {
        const previous = document.title;
        document.title = 'Indic-Transcribe | Bodhan.AI';
        window.scrollTo(0, 0);
        return () => { document.title = previous; };
    }, []);

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

        // The rail's sections: every titled section of the article, in order.
        setSections(
            [...doc.querySelectorAll('article section[id]')]
                .filter((section) => section.querySelector('h2'))
                .map((section) => ({
                    id: section.id,
                    title: RAIL_TITLES[section.id] ?? section.querySelector('h2').textContent.trim(),
                })),
        );

        // Measure the body's laid-out height, not documentElement.scrollHeight:
        // inside a frame the latter can never report less than the frame's own
        // height, so it ratchets upward and leaves a gap when content collapses.
        const measure = () => {
            const body = doc.body;
            if (!body) return;
            const next = Math.max(600, Math.ceil(body.getBoundingClientRect().height));
            setHeight((current) => (Math.abs(current - next) > 2 ? next : current));
            setMeasured(true);
        };
        measure();
        let observer = null;
        if (win.ResizeObserver && doc.body) {
            observer = new win.ResizeObserver(measure);
            observer.observe(doc.body);
            observer.observe(doc.documentElement);
        }
        win.addEventListener('load', measure);
        // Late layout — a web font landing, an image decoding, a script that
        // builds a section — moves the height after load. The observer catches
        // most of it; this catches the rest for the first few seconds, so a
        // reader who scrolls immediately is not scrolling a stale page.
        let settle = 0;
        const settleUntil = Date.now() + 4000;
        const keepMeasuring = () => {
            measure();
            settle = Date.now() < settleUntil ? win.requestAnimationFrame(keepMeasuring) : 0;
        };
        keepMeasuring();
        cleanupRef.current = () => {
            observer?.disconnect();
            win.removeEventListener('load', measure);
            if (settle) win.cancelAnimationFrame(settle);
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
                title="Indic-Transcribe: speech recognition for 25 Indian languages"
                src={FRAME_SRC}
                onLoad={onLoad}
                scrolling="no"
                style={{ display: 'block', width: '100%', height: `${height}px`, border: 0, background: '#fffaf3', overflow: 'hidden' }}
            />
            <div className="relative pb-16 md:pb-24" style={{ visibility: measured ? 'visible' : 'hidden' }}>
                <div className="research-article-column mx-auto px-5">
                    <EcosystemCard {...ECOSYSTEM} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default IndicTranscribePostPage;
