import { useRef, useState } from 'react';
import DELIVERIES from '../../data/speakDeliveries.json';
import { assetUrl } from '../../data/assetUrl';

/**
 * "Thirteen deliveries", as the Indic-Speak announcement builds it.
 *
 * The post's own explorer, markup and all: a scrolling rail of the registers on
 * the left, grouped into the seven contexts and the six emotions, and one panel
 * on the right carrying the kind, the exact strings you send, what the register
 * is, and the post's recording of it. The class names are the post's, so the
 * two are styled from one description of the same thing (`.sx-*` / `.style-*`
 * in developers.css).
 *
 * The values ARE the contract — matching upstream is literal, capitals and
 * apostrophe included — which is why they are set as code.
 *
 * Icons, labels, notes and clips all come from the post
 * (src/features/developers/data/speakDeliveries.json, generated from its own
 * style data); the audio is referenced from public/indic-speak-post/ rather
 * than copied.
 */
const ITEMS = DELIVERIES.items;

const GROUPS = [
    { kind: 'context', label: 'Context' },
    { kind: 'emotion', label: 'Emotion' },
];

const time = (seconds) => {
    const s = Math.max(0, Math.round(seconds || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const Step = ({ label, dir, onClick }) => (
    <button type="button" className="style-step" aria-label={label} onClick={onClick}>
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d={dir < 0 ? 'M10 3.5 5.5 8l4.5 4.5' : 'M6 3.5 10.5 8 6 12.5'}
            />
        </svg>
    </button>
);

const SpeakDeliveries = () => {
    const [at, setAt] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const audioRef = useRef(null);

    const row = ITEMS[at];

    const go = (next) => {
        setAt((next + ITEMS.length) % ITEMS.length);
        setPlaying(false);
        setElapsed(0);
        audioRef.current?.pause();
    };

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
            audio.pause();
            setPlaying(false);
        }
    };

    const seek = (event) => {
        const audio = audioRef.current;
        if (!audio || !row.dur) return;
        const box = event.currentTarget.getBoundingClientRect();
        audio.currentTime = ((event.clientX - box.left) / box.width) * row.dur;
    };

    return (
        <div className="sx-explorer">
            <div className="sx-rail" role="tablist" aria-label="Deliveries">
                {GROUPS.map((group) => (
                    <div key={group.kind} className="sx-rail-group" role="presentation">
                        <p className="sx-group">{group.label}</p>
                        {ITEMS.map((item, i) => (item.kind === group.kind ? (
                            <button
                                key={item.values.join('/')}
                                type="button"
                                role="tab"
                                aria-selected={i === at}
                                className={`sx-tab style-pick${i === at ? ' is-active' : ''}`}
                                onClick={() => go(i)}
                            >
                                <svg
                                    className="sx-ico"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                    dangerouslySetInnerHTML={{ __html: item.icon }}
                                />
                                <span className="sx-tab-t">{item.label}</span>
                                {/* A card can carry more than one sendable value — AIR and TV share
                                    this one — so the tab counts them rather than implying one. */}
                                {item.values.length > 1 && <i className="sx-tab-x">+{item.values.length - 1}</i>}
                            </button>
                        ) : null))}
                    </div>
                ))}
            </div>

            <div className="sx-panel">
                <div className="sx-body">
                    <div className="sx-head">
                        <p className="style-kind">{row.kind}</p>
                        <p className="style-values">
                            {row.values.map((v) => <code key={v}>{v}</code>)}
                        </p>
                        {row.note && <p className="style-note">{row.note}</p>}
                    </div>

                    <div className="sx-example">
                        <p className="style-scene">{row.title || 'listen'}</p>

                        <div className="style-player">
                            <button
                                type="button"
                                className="sp-play"
                                onClick={toggle}
                                aria-label={playing ? 'Pause' : 'Play'}
                            >
                                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                                    {playing ? (
                                        <path fill="currentColor" d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" />
                                    ) : (
                                        <path fill="currentColor" d="M5 3.2 12.4 8 5 12.8z" />
                                    )}
                                </svg>
                            </button>
                            <span className="sp-track" onClick={seek} role="presentation">
                                <span
                                    className="sp-fill"
                                    style={{ width: `${row.dur ? Math.min(100, (elapsed / row.dur) * 100) : 0}%` }}
                                />
                            </span>
                            <span className="sp-time">{time(elapsed)} / {time(row.dur)}</span>
                            <audio
                                ref={audioRef}
                                src={assetUrl(row.file)}
                                preload="none"
                                onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
                                onEnded={() => { setPlaying(false); setElapsed(0); }}
                            />
                        </div>

                        {row.text && (
                            <div className="style-lines">
                                <p className={`style-line${row.lang === 'en' ? '' : ' indic'}`} lang={row.lang || undefined}>
                                    {row.text}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="sx-pager">
                        <Step label="Previous delivery" dir={-1} onClick={() => go(at - 1)} />
                        <span className="n">{at + 1} / {ITEMS.length}</span>
                        <Step label="Next delivery" dir={1} onClick={() => go(at + 1)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpeakDeliveries;
