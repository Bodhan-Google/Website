import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import TableOfContents from '../components/TableOfContents';
import EcosystemCard from '../components/EcosystemCard';

/**
 * The Indic-Speak announcement, mounted as its own page.
 *
 * The post is a single self-contained HTML page assembled by blog/src/build.py
 * (repo root), with its audio and logos beside it. It is served verbatim from
 * public/indic-speak-post/ and shown here in a same-origin frame sized to its
 * content, so the page scrolls as one document under the site's navbar and
 * footer. Its own chrome (progress bar, contents rail, footer, ecosystem band)
 * is hidden by the #site-overrides block in that HTML, because the site
 * provides each of those: the reading-progress bar is drawn here from the page
 * scroll, the rail is the site's TableOfContents pointed at the sections inside
 * the frame, and the ecosystem card is rendered under the frame in the article
 * column.
 *
 * To take a newer drop: copy blog/indic-speak.html to index.html plus the audio
 * and images it names, re-apply the palette swap and the #site-overrides block.
 */
const FRAME_SRC = `${import.meta.env.BASE_URL}indic-speak-post/index.html`;

// Where the model is available (the four links the page's own band carried).
const ECOSYSTEM = {
    title: "Available across India's AI ecosystem",
    description: 'Weights, voices and hosted endpoints.',
    platforms: [
        { name: 'Hugging Face', href: 'https://huggingface.co/bodhan-ai/indic-speak', mark: 'huggingface', note: 'Weights and model card' },
        { name: 'Bodhan', href: '/developers/indic-speak', mark: 'bodhan', note: 'Model page' },
        { name: 'Bhashini', href: 'https://bhashini.gov.in', mark: 'bhashini', note: 'National language-technology mission' },
        { name: 'AIKosh', href: 'https://aikosh.indiaai.gov.in/web/models/details/indic_speak_1.html', mark: 'aikosh', note: 'India AI model repository' },
    ],
};

// Rail labels: the page's headings are numbered sentences, so shorten them.
const RAIL_TITLES = {
    hear: 'Hear it',
    capabilities: 'What it reads',
    voices: 'Voices',
    'under-the-hood': 'Under the hood',
    evaluation: 'Evaluation',
    limitations: 'Limitations',
    outlook: "What's next",
};

const IndicSpeakPostPage = () => {
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
        document.title = 'Indic-Speak | Bodhan.AI';
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
                    title:
                        RAIL_TITLES[section.id]
                        ?? section.querySelector('h2').textContent.trim().replace(/^\d+\s+/, ''),
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
                title="Indic-Speak: text-to-speech for the way India actually writes"
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

export default IndicSpeakPostPage;
