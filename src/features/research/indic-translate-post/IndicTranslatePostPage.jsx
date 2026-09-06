import { useEffect, useMemo, useRef } from 'react';
import 'katex/dist/katex.min.css';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import Hero from './components/Hero';
import SectionBlocks from './components/SectionBlocks';
import TableOfContents from './components/TableOfContents';
import CiteThisWork from '../components/blocks/CiteThisWork';
import EcosystemCard from '../components/EcosystemCard';
import { citation, ecosystem, post } from './data/post';
import './post.css';

/**
 * The Indic-Translate announcement, mounted as its own page.
 *
 * The page was designed and iterated as a standalone Vite app (repo root:
 * mt-blog/). Its components, data and stylesheet are copied here verbatim, with
 * the stylesheet scoped under `.mt-post`, and the site's Navbar and Footer wrap
 * it. To take a newer drop of the standalone app, re-copy src/{components,data,
 * lib} and re-scope styles.css (scripts/sync-indic-translate-post.py); only
 * this file mirrors App.jsx by hand.
 */
const IndicTranslatePostPage = () => {
    const progressRef = useRef(null);

    useEffect(() => {
        const previous = document.title;
        document.title = 'Indic-Translate | Bodhan.AI';
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

    const tocSections = useMemo(
        () => post.sections.filter(({ title }) => title).map(({ id, title }) => ({ id, title })),
        []
    );

    return (
        <div className="min-h-screen research-page">
            <Navbar />
            <div className="mt-post">
                <div ref={progressRef} className="research-reading-progress" aria-hidden="true" />

                <Hero post={post} />

                <div style={{ paddingBottom: '4rem' }}>
                    <div className="research-article-column">
                        {post.heroSummary && (
                            <p
                                className="research-type-dek"
                                style={{ margin: '2.5rem 0', borderLeft: '2px solid rgba(255, 98, 7, 0.4)', paddingLeft: '1.25rem' }}
                            >
                                {post.heroSummary}
                            </p>
                        )}

                        <TableOfContents sections={tocSections} />

                        <article>
                            <SectionBlocks sections={post.sections} />
                        </article>

                        <CiteThisWork bibtex={citation.bibtex} license={citation.license} />
                        <EcosystemCard
                            title={ecosystem.heading}
                            platforms={ecosystem.links.map(({ label, href, icon, soon }) => ({
                                name: label,
                                href: soon ? undefined : href,
                                mark: icon,
                            }))}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default IndicTranslatePostPage;
