import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Music4 } from 'lucide-react';
import { SONGS } from './transcribeData';

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Song is a real capability claim, so it gets a section — but none of these
 * recordings ship with the site yet, so there is no transport here to press.
 * The lyrics are labelled as sample output. Add an `audio` path to a song in
 * transcribeData.js and a player belongs here instead.
 */
const TranscribeSongs = () => {
    const [activeId, setActiveId] = useState(SONGS[0].id);
    const linesRef = useRef(null);

    const song = SONGS.find((item) => item.id === activeId) ?? SONGS[0];

    useLayoutEffect(() => {
        const host = linesRef.current;
        if (!host || prefersReducedMotion()) return undefined;
        const tween = gsap.fromTo(
            host.querySelectorAll('.itx-lyric'),
            { opacity: 0, y: 18, filter: 'blur(6px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.09, ease: 'power3.out' }
        );
        return () => tween.kill();
    }, [activeId]);

    return (
        <section className="itx-section itx-songs" id="songs">
            <div className="itx-container">
                <header className="itx-head itx-reveal">
                    <p className="itx-eyebrow">Beyond speech</p>
                    <h2 className="itx-h2">
                        It also listens to <span className="itx-grad">music</span>.
                    </h2>
                    <p className="itx-lede">
                        Bhajans, film songs and recited stotram are handled by the same checkpoint as conversation —
                        sung vowels, held notes, instrumentation behind the voice and all.
                    </p>
                </header>

                <div className="itx-song-rail itx-reveal" role="tablist" aria-label="Song">
                    {SONGS.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={activeId === item.id}
                            className="itx-song-tile"
                            data-active={activeId === item.id || undefined}
                            onClick={() => setActiveId(item.id)}
                        >
                            <span className="itx-song-art" style={{ '--art': item.gradient }}>
                                <em>{item.monogram}</em>
                            </span>
                            <strong>{item.title}</strong>
                            <span className="itx-song-type">{item.type}</span>
                        </button>
                    ))}
                </div>

                <article className="itx-lyric-card itx-reveal">
                    <header className="itx-lyric-head">
                        <span className="itx-lyric-mark" style={{ '--art': song.gradient }}>
                            <Music4 size={16} aria-hidden="true" />
                        </span>
                        <div>
                            <h3>{song.title}</h3>
                            <p>{song.type}</p>
                        </div>
                        <span className="itx-lyric-tag">Sample output</span>
                    </header>

                    <div className="itx-lyrics" ref={linesRef} lang={song.lang}>
                        {song.lines.map((line, index) => (
                            <p key={index} className="itx-lyric">
                                {line}
                            </p>
                        ))}
                    </div>

                    <p className="itx-lyric-foot">
                        Transcribed lyrics shown as sample output — the recordings themselves are not published on this
                        page.
                    </p>
                </article>
            </div>
        </section>
    );
};

export default TranscribeSongs;
