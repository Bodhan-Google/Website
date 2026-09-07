import { useMemo, useState } from 'react';
import SpeakPlayer from './SpeakPlayer';
import {
    BENCHMARKED,
    CODEMIX_CLIPS,
    LANG_NAME,
    NORM_CASES,
    NORM_GROUPS,
    NORM_HINDI,
    STYLE_TAGS,
} from '../../data/indic-speak/speakEvals';

/*
 * Section 03 — what the model does, each claim carrying the clip that shows it.
 *
 * The four cards state the capabilities; everything under them is real output.
 * The normaliser sheet at the bottom is the least glamorous part of the stack and
 * the one most likely to decide whether a lesson sounds like a lesson, so it gets
 * the same weight as the audio rather than a footnote.
 */

const CAPABILITIES = [
    {
        eyebrow: 'Code-mixing',
        title: 'No language flag, no frontend',
        body:
            'Native script and embedded English in one sentence, read straight through. The language '
            + 'is inferred from the text; there is nothing to tag and no phoneme dictionary to maintain.',
    },
    {
        eyebrow: 'Delivery',
        title: 'Fourteen styles',
        body:
            'One tag moves the delivery, from an All India Radio bulletin to a children’s story. With '
            + 'no tag the model uses its conversational register, which is the right choice for most '
            + 'plain reading.',
    },
    {
        eyebrow: 'Length',
        title: 'Chapter-scale narration',
        body:
            'About 30 seconds of speech per request. Longer passages are split by the caller at '
            + 'sentence and clause punctuation and joined, which is how the five-minute chapter above '
            + 'was made.',
    },
    {
        eyebrow: 'Prosody',
        title: 'Punctuation is the control surface',
        body:
            'A comma is a breath, a danda ends a sentence, an exclamation lifts the segment. Numbers '
            + 'and currency are expanded by the text normaliser before synthesis.',
    },
];

const CodeMixed = () => {
    const [lang, setLang] = useState(BENCHMARKED[0]);
    const clips = useMemo(() => CODEMIX_CLIPS.filter((clip) => clip.lang === lang), [lang]);

    return (
        <div className="isb-figure">
            <p className="isb-figure-title">Code-mixed speech, in ten languages</p>
            <p className="isb-figure-sub">
                One female and one male native voice per language, reading a benchmark sentence with
                English terms embedded. Each clip carries the judge’s top content score, and the text
                is shown exactly as it was sent.
            </p>

            <div className="isb-tabs" role="group" aria-label="Language">
                {BENCHMARKED.map((code) => (
                    <button
                        key={code}
                        type="button"
                        className="isb-tab"
                        aria-pressed={lang === code}
                        onClick={() => setLang(code)}
                    >
                        {LANG_NAME[code]}
                    </button>
                ))}
            </div>

            {clips.map((clip) => (
                <div key={clip.file} className="isb-pair-card" style={{ marginTop: '0.8rem' }}>
                    <div className="isb-pair-head">
                        <span className="isb-pair-voice">{clip.voice}</span>
                        <span className="isb-judge">judge {clip.judge} / 5</span>
                    </div>
                    <p className="isb-pair-role">
                        {clip.gender} · {LANG_NAME[clip.lang]} native
                    </p>
                    <SpeakPlayer src={clip.file} meta={clip.voice} />
                    <p className="isb-sentence" lang={clip.lang}>
                        {clip.text}
                    </p>
                </div>
            ))}
        </div>
    );
};

const StyleTags = () => (
    <div className="isb-figure">
        <p className="isb-figure-title">The fourteen style tags</p>
        <p className="isb-figure-sub">
            These are the fourteen the API accepts, spelled exactly as it expects them. Anything else
            is rejected outright with a 422 rather than quietly approximated, so case and apostrophes
            matter.
        </p>
        <div className="isb-tags">
            {STYLE_TAGS.map(({ tag, note, emotion }) => (
                <div key={tag} className="isb-tag" data-emotion={emotion}>
                    <code>{tag}</code>
                    <span>{note}</span>
                </div>
            ))}
        </div>
    </div>
);

const Normaliser = () => {
    const [group, setGroup] = useState(NORM_GROUPS[0]);
    const cases = useMemo(() => NORM_CASES.filter((item) => item.group === group), [group]);

    return (
        <>
            <div className="isb-band">
                <p className="isb-band-title">Writing for the ear</p>
                <p className="isb-band-body">
                    A model that reads text as written has to be handed text a person would actually
                    say out loud. Nobody says “one two three comma four five six point seven eight
                    rupees”, and nobody says “backslash int”. The normaliser in front of the model turns
                    written notation into spoken words first, and it is the part of the stack that does
                    the least glamorous and most necessary work.
                </p>
            </div>

            <div className="isb-figure">
                <p className="isb-figure-title">Written, then spoken</p>
                <p className="isb-figure-sub">
                    Every line below is the normaliser’s real output. A textbook integral, a PAN number,
                    a room number and a bus route each need a different reading, and getting them wrong
                    is the difference between a lesson and a noise.
                </p>

                <div className="isb-tabs" role="group" aria-label="Kind of notation">
                    {NORM_GROUPS.map((name) => (
                        <button
                            key={name}
                            type="button"
                            className="isb-tab"
                            aria-pressed={group === name}
                            onClick={() => setGroup(name)}
                        >
                            {name}
                        </button>
                    ))}
                </div>

                {cases.map((item) => (
                    <div key={item.written} className="isb-norm-case">
                        <p className="isb-norm-note">{item.note}</p>
                        <div className="isb-io">
                            <div className="isb-io-row">
                                <span className="isb-io-label">Written</span>
                                <span className="isb-io-value" data-mono="true">
                                    {item.written}
                                </span>
                            </div>
                            <div className="isb-io-row" data-emphasis="true">
                                <span className="isb-io-label">Spoken</span>
                                <span className="isb-io-value">{item.spoken}</span>
                            </div>
                        </div>
                    </div>
                ))}

                <p className="isb-figure-note">
                    Captured by the normaliser’s own <code className="research-inline-code">src/normgen.py</code>,
                    so these move when it does.
                </p>
            </div>

            <div className="isb-figure">
                <p className="isb-figure-title">Which language the numbers are spoken in</p>
                <p className="isb-figure-sub">
                    That is a choice, and it belongs to the caller. The same Hindi sentence, at the
                    default and with the number language pinned:
                </p>
                <div className="isb-io">
                    <div className="isb-io-row">
                        <span className="isb-io-label">As written</span>
                        <span className="isb-io-value" lang="hi">
                            {NORM_HINDI.text}
                        </span>
                    </div>
                    <div className="isb-io-row">
                        <span className="isb-io-label">Default</span>
                        <span className="isb-io-value" lang="hi">
                            {NORM_HINDI.default}
                        </span>
                    </div>
                    <div className="isb-io-row" data-emphasis="true">
                        <span className="isb-io-label">number_lang=hi</span>
                        <span className="isb-io-value" lang="hi">
                            {NORM_HINDI.forced}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

const SpeakCapabilities = () => (
    <div className="isb-capabilities">
        <div className="isb-cards">
            {CAPABILITIES.map((card) => (
                <article key={card.title} className="isb-card">
                    <p className="isb-eyebrow">{card.eyebrow}</p>
                    <h3 className="isb-card-title">{card.title}</h3>
                    <p className="isb-card-body">{card.body}</p>
                </article>
            ))}
        </div>

        <CodeMixed />
        <StyleTags />
        <Normaliser />
    </div>
);

export default SpeakCapabilities;
