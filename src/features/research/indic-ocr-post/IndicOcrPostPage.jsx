import { useEffect, useRef, useState } from 'react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';

/**
 * The IndicOCR announcement, mounted as its own page.
 *
 * The post arrived as a compiled static site (repo root: indicocr-post/, a
 * prebuilt React bundle plus ~14 MB of pre-rendered book pages) with no source
 * to integrate, so it is served verbatim from public/indic-ocr-post/ and shown
 * here in a same-origin frame under the site's navbar and footer. The frame is
 * sized to its content, so the page scrolls as one document; the bundle's own
 * footer is hidden because the site's follows. Asset paths inside the bundle
 * were rewritten from root-absolute to relative so it works under any base path.
 *
 * To take a newer drop: copy the folder over public/indic-ocr-post/ and re-run
 * the path rewrite (see the commit that added this file).
 */
const FRAME_SRC = `${import.meta.env.BASE_URL}indic-ocr-post/index.html`;

const IndicOcrPostPage = () => {
    const frameRef = useRef(null);
    const [height, setHeight] = useState(1400);

    useEffect(() => {
        const previous = document.title;
        document.title = 'IndicOCR | Bodhan.AI';
        window.scrollTo(0, 0);
        return () => { document.title = previous; };
    }, []);

    // Size the frame to the document inside it, and keep it sized as images and
    // lazy sections load. The observer is created from the frame's own window so
    // it can watch that document's body.
    const onLoad = () => {
        const frame = frameRef.current;
        const doc = frame?.contentDocument;
        const win = frame?.contentWindow;
        if (!doc || !win) return;

        const style = doc.createElement('style');
        style.textContent = 'footer { display: none !important; }';
        doc.head.appendChild(style);

        const measure = () => {
            const next = Math.max(600, doc.documentElement.scrollHeight);
            setHeight((current) => (Math.abs(current - next) > 2 ? next : current));
        };
        measure();
        if (win.ResizeObserver && doc.body) {
            const observer = new win.ResizeObserver(measure);
            observer.observe(doc.body);
            observer.observe(doc.documentElement);
        }
        win.addEventListener('load', measure);
    };

    return (
        <div className="min-h-screen research-page">
            <Navbar />
            <iframe
                ref={frameRef}
                title="IndicOCR: document parsing for English and 22 Indian languages"
                src={FRAME_SRC}
                onLoad={onLoad}
                scrolling="no"
                style={{ display: 'block', width: '100%', height: `${height}px`, border: 0, background: '#fffaf3' }}
            />
            <Footer />
        </div>
    );
};

export default IndicOcrPostPage;
