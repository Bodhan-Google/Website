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
        { name: 'AIKosh', mark: 'aikosh', note: 'India AI model repository' },
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
    const [height, setHeight] = useState(1400);
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
        cleanupRef.current = () => {
            observer?.disconnect();
            win.removeEventListener('load', measure);
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
            <div className="relative pb-16 md:pb-24">
                <div className="research-article-column mx-auto px-5">
                    <EcosystemCard {...ECOSYSTEM} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default IndicTranscribePostPage;
