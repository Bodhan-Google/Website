import { useMemo, useState } from 'react';
import SpeakPlayer from './SpeakPlayer';
import {
    AB_PAIRS,
    BENCHMARKED,
    LANG_NAME,
    OVERALL,
    RECOMMENDED,
    TOP_CROSS,
    VOICES,
    VOICE_CLIPS,
} from '../../data/indic-speak/speakEvals';

/*
 * Section 02 — which of the 45 voices to pick, in three passes.
 *
 * The field places every voice by the two properties a reader can act on before
 * hearing it: register and pace, both measured from that voice's own generations.
 * The A/B pair then does the thing a number cannot, which is let the accent be
 * heard travelling. The table is the reference the first two send you to.
 */

// Fixed domains rather than the data's own extremes, so a voice's position means
// the same thing here as it does on the model page and in the recommendation table.
const HZ = { min: 100, max: 300 };
const CPS = { min: 9, max: 15 };

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const atHz = (hz) => 100 - clamp01((hz - HZ.min) / (HZ.max - HZ.min)) * 100;
const atCps = (cps) => clamp01((cps - CPS.min) / (CPS.max - CPS.min)) * 100;

const CLIP_BY_VOICE = Object.fromEntries(VOICE_CLIPS.map((clip) => [clip.voice, clip]));
const NAMES = Object.keys(VOICES);

const VoiceField = () => {
    const [picked, setPicked] = useState(null);
    const voice = picked ? VOICES[picked] : null;
    const clip = picked ? CLIP_BY_VOICE[picked] : null;

    return (
        <div className="isb-figure">
            <p className="isb-figure-title">The voice library</p>
            <p className="isb-figure-sub">
                All {NAMES.length} voices by register and pace, both measured from that voice’s own
                generations at the default sampling settings. Click any voice to hear it.
            </p>

            <p className="isb-legend">
                <span style={{ color: 'var(--isb-female)' }}>
                    <i /> female
                </span>
                <span style={{ color: 'var(--isb-male)' }}>
                    <i /> male
                </span>
                <span style={{ color: 'var(--color-14)' }}>click to play</span>
            </p>

            <div className="isb-field">
                {[300, 250, 200, 150].map((hz) => (
                    <span key={hz} className="isb-field-axis" data-side="y" style={{ top: `${atHz(hz)}%` }}>
                        {hz} Hz
                    </span>
                ))}
                {[10, 11, 12, 13, 14].map((cps) => (
                    <span key={cps} className="isb-field-axis" data-side="x" style={{ left: `${atCps(cps)}%` }}>
                        {cps}
                    </span>
                ))}

                {NAMES.map((name) => {
                    const entry = VOICES[name];
                    return (
                        <button
                            key={name}
                            type="button"
                            className="isb-field-dot"
                            data-active={picked === name}
                            style={{
                                left: `${atCps(entry.cps)}%`,
                                top: `${atHz(entry.hz)}%`,
                                '--isb-dot':
                                    entry.gender === 'female' ? 'var(--isb-female)' : 'var(--isb-male)',
                            }}
                            onClick={() => setPicked(name)}
                            aria-label={`${name}, ${entry.gender} ${LANG_NAME[entry.lang]} voice, ${entry.hz} hertz, ${entry.cps} characters a second`}
                        >
                            <span className="isb-field-name">{name}</span>
                        </button>
                    );
                })}
            </div>

            <p className="isb-field-caption">
                <span>register, median pitch ↑</span>
                <span>pace, characters per second →</span>
            </p>

            {voice && (
                <div className="isb-voice-card">
                    <p className="isb-voice-name">
                        {picked}
                        <span className="isb-voice-stats">
                            {voice.gender} · {LANG_NAME[voice.lang]} · ~{voice.hz} Hz · {voice.cps} chars/s
                        </span>
                    </p>
                    <p className="isb-voice-desc">
                        {voice.desc}. <span className="isb-voice-best">Best for:</span> {voice.bestFor}.
                    </p>
                    {/* A voice's library clip is whatever benchmark sentence it drew, which
                        is usually not its own language — so the label says so. */}
                    {clip && (
                        <SpeakPlayer
                            src={clip.file}
                            meta={
                                clip.native
                                    ? `${picked} · ${LANG_NAME[clip.lang]}`
                                    : `${picked} · reading ${LANG_NAME[clip.lang]}`
                            }
                        />
                    )}
                </div>
            )}

            <p className="isb-figure-note">
                Register is median pitch and pace is characters per second. Pace matters for scripting:
                plan about 12 characters per second of audio for most voices. On a narrow screen the
                names are dropped for legibility; tap a voice to hear it and read its card.
            </p>
        </div>
    );
};

const AccentTravel = () => {
    const [lang, setLang] = useState(BENCHMARKED[0]);
    const pair = useMemo(() => AB_PAIRS.filter((entry) => entry.lang === lang), [lang]);
    const native = pair.find((entry) => entry.native);
    const travelled = pair.find((entry) => !entry.native);

    if (!native || !travelled) return null;

    return (
        <div className="isb-figure">
            <p className="isb-figure-title">Hear the accent travel</p>
            <p className="isb-figure-sub">
                The same sentence, twice: once in a voice native to the language, once in a voice from
                somewhere else. Same words, same model, same settings. Both readings carry the judge’s
                top content score, so the words came through in each. The difference you hear is the voice.
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

            <p className="isb-sentence" lang={lang}>
                {native.text}
            </p>

            <div className="isb-pair">
                {[native, travelled].map((entry) => (
                    <div key={entry.voice} className="isb-pair-card">
                        <div className="isb-pair-head">
                            <span className="isb-pair-voice">{entry.voice}</span>
                            <span className="isb-judge">judge {entry.judge} / 5</span>
                        </div>
                        <p className="isb-pair-role">
                            {entry.native
                                ? `native ${LANG_NAME[entry.lang]} voice`
                                : `${LANG_NAME[entry.voiceLang]} voice reading ${LANG_NAME[entry.lang]}`}
                        </p>
                        <SpeakPlayer src={entry.file} meta={entry.voice} />
                    </div>
                ))}
            </div>

            <p className="isb-figure-note">
                Ten languages, twenty readings, chosen by rule from the benchmark: for each language,
                the sentence whose transcripts matched most closely among those a native and a
                non-native voice both placed in the judge’s top fidelity band. The judge scores
                content, not accent or naturalness — which is exactly why this one is worth your ears
                rather than a number.
            </p>
        </div>
    );
};

const VoiceCell = ({ name }) => {
    const voice = VOICES[name];
    if (!voice) return null;

    return (
        <>
            <span className="isb-table-voice">{name}</span>
            <span className="isb-table-meta">
                ~{voice.hz} Hz · {voice.cps} chars/s · {voice.desc}
            </span>
        </>
    );
};

const RecommendedTable = () => {
    const scored = RECOMMENDED.filter((lang) => lang.benchmarked);
    const rest = RECOMMENDED.filter((lang) => !lang.benchmarked);

    const rows = (group) =>
        group.map((lang) => (
            <tr key={lang.code}>
                <th scope="row" className="isb-table-lang">
                    {lang.name}
                    <span className="isb-table-script">{lang.script}</span>
                </th>
                <td>
                    {lang.female.map((name) => (
                        <p key={name} style={{ margin: '0 0 0.4rem' }}>
                            <VoiceCell name={name} />
                        </p>
                    ))}
                </td>
                <td>
                    {lang.male.map((name) => (
                        <p key={name} style={{ margin: '0 0 0.4rem' }}>
                            <VoiceCell name={name} />
                        </p>
                    ))}
                </td>
                <td className="isb-table-judge">{lang.judge ? lang.judge.toFixed(2) : '—'}</td>
            </tr>
        ));

    return (
        <div className="isb-figure">
            <p className="isb-figure-title">Recommended voice per language</p>
            <p className="isb-figure-sub">
                All 22 languages. The judge column is the mean content-fidelity score for these voices
                reading their own language in the benchmark; languages outside the benchmark set are
                marked with a dash.
            </p>

            <div className="isb-table-wrap">
                <table className="isb-table">
                    <thead>
                        <tr>
                            <th scope="col">Language</th>
                            <th scope="col">Female</th>
                            <th scope="col">Male</th>
                            <th scope="col">Judge, native text</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="isb-table-group">
                            <td colSpan={4}>Scored in the benchmark · {scored.length} languages</td>
                        </tr>
                        {rows(scored)}
                        <tr className="isb-table-group">
                            <td colSpan={4}>Supported, not yet scored · {rest.length} languages</td>
                        </tr>
                        {rows(rest)}
                    </tbody>
                </table>
            </div>

            <p className="isb-figure-note">
                Pace matters for scripting: plan about 12 characters per second of audio for most voices.
            </p>
        </div>
    );
};

const VoiceLibrary = () => (
    <div className="isb-voices">
        <VoiceField />
        <AccentTravel />

        <div className="isb-band">
            <p className="isb-band-title">Every voice speaks every language</p>
            <p className="isb-band-body">
                Conditioning is fully cross-lingual, and there is no separate model per language to
                switch between. Across the benchmark, native casting scored {OVERALL.native.toFixed(2)}{' '}
                and cross-lingual casting {OVERALL.cross.toFixed(2)} out of 5: the accent stays, the
                words survive. The five most portable voices by measured cross-lingual score are{' '}
                {TOP_CROSS.map(([name]) => `${name} (${LANG_NAME[VOICES[name].lang]})`).join(', ')}.
            </p>
        </div>

        <RecommendedTable />
    </div>
);

export default VoiceLibrary;
