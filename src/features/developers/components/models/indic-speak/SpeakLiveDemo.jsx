import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ACCENTS, DEMO_PRESETS, SPEAK_API_URL } from './speakData';
import { useClipPlayer } from './useSpeakAudio';
import { WordLine } from './Karaoke';
import SegmentedRail from './SegmentedRail';
import VoiceOrb from './VoiceOrb';
import WaveStrip from './WaveStrip';
import { PlayButton, RestartButton, TimeReadout } from './Transport';

// The live demo.
//
// With VITE_SPEAK_API_URL configured this posts the script to the model and
// plays whatever comes back. Without it, it plays the clip that was generated
// from the sample script — real output, labelled as pre-generated — and, if the
// script has been edited, says plainly that new text needs an endpoint rather
// than playing the old audio under a new caption.
//
// Endpoint contract: POST { text, language, voice } →
// { audio: "<url or data: URI>", normalized?: "<what the harness will read>" }

const RAIL_ITEMS = DEMO_PRESETS.map((preset) => ({ id: preset.id, label: preset.label }));

const requestSpeech = async (preset, text) => {
    const response = await fetch(SPEAK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: preset.lang, voice: preset.voice }),
    });
    if (!response.ok) throw new Error(`The endpoint answered ${response.status}`);

    const data = await response.json();
    const audio = data.audio || (data.audio_base64 ? `data:audio/wav;base64,${data.audio_base64}` : '');
    if (!audio) throw new Error('The endpoint returned no audio');

    return { audio, spoken: data.normalized || null, source: 'api' };
};

const SpeakLiveDemo = () => {
    const [presetId, setPresetId] = useState(DEMO_PRESETS[0].id);
    const preset = DEMO_PRESETS.find((item) => item.id === presetId) ?? DEMO_PRESETS[0];

    const [script, setScript] = useState(preset.written);
    const [result, setResult] = useState(null);
    const [status, setStatus] = useState('');
    const [busy, setBusy] = useState(false);
    const wantsPlay = useRef(false);

    const { audioRef, playing, toggle, restart, seek } = useClipPlayer(result?.audio ?? '');

    const selectPreset = (id) => {
        const next = DEMO_PRESETS.find((item) => item.id === id);
        if (!next) return;
        setPresetId(id);
        setScript(next.written);
        setResult(null);
        setStatus('');
    };

    const edited = script.trim() !== preset.written.trim();

    const speak = async () => {
        if (playing) {
            toggle();
            return;
        }

        if (SPEAK_API_URL) {
            setBusy(true);
            setStatus('Sending the script to the model…');
            try {
                const next = await requestSpeech(preset, script);
                wantsPlay.current = true;
                setResult(next);
                setStatus('');
            } catch (error) {
                setStatus(`${error.message}. Showing the pre-generated sample instead.`);
                wantsPlay.current = true;
                setResult({ audio: preset.audio, spoken: preset.spoken, source: 'preset' });
            } finally {
                setBusy(false);
            }
            return;
        }

        if (edited) {
            setStatus(
                'This page has no synthesis endpoint, so an edited script cannot be generated here. Restore the sample to hear real output, or set VITE_SPEAK_API_URL.'
            );
            return;
        }

        setStatus('');
        wantsPlay.current = true;
        setResult({ audio: preset.audio, spoken: preset.spoken, source: 'preset' });
    };

    // The <audio> element only exists once there is a result, so playback waits
    // for the element to mount.
    useEffect(() => {
        if (!result || !wantsPlay.current) return;
        wantsPlay.current = false;
        restart();
    }, [result, restart]);

    const accent = ACCENTS[preset.tone];
    const spokenText = result?.spoken ?? preset.spoken;
    const caption = spokenText ?? script;
    const normalised = Boolean(spokenText);

    return (
        <section className="isp-demo isp-tinted" id="demo" style={{ '--isp-accent': accent }}>
            <div className="isp-container">
                <div className="isp-head-center">
                    <p className="isp-eyebrow isp-fade">Try it</p>
                    <h2 className="isp-title isp-fade">Hand it a script. Hear it read.</h2>
                    <p className="isp-blurb isp-fade">
                        Six scripts that have been through the model. Pick one and listen — the
                        waveform is the clip&apos;s own, and the read-head is paced from its clock.
                    </p>
                </div>

                <div className="isp-panel isp-demo-panel">
                    <div className="isp-panel-bar">
                        <span className="isp-panel-title">
                            <i className="isp-dot" data-live={playing || undefined} />
                            {SPEAK_API_URL ? 'Endpoint connected' : 'Pre-generated samples'}
                        </span>
                        <SegmentedRail
                            items={RAIL_ITEMS}
                            active={presetId}
                            onSelect={selectPreset}
                            label="Sample script"
                            role="group"
                        />
                    </div>

                    <div className="isp-demo-body">
                        <div className="isp-demo-in">
                            <p className="isp-field-label">
                                <span>Script</span>
                                <span>{preset.language}</span>
                            </p>
                            <textarea
                                className="isp-script"
                                value={script}
                                lang={preset.lang}
                                spellCheck="false"
                                onChange={(event) => setScript(event.target.value)}
                                aria-label="Script to read"
                            />
                            <p className="isp-script-meta">
                                <span>
                                    <b>{script.trim().length}</b> characters
                                </span>
                                <span>
                                    Voice <b>{preset.voice}</b>
                                </span>
                                {edited && <span>Edited</span>}
                            </p>

                            <div className="isp-demo-actions">
                                <button
                                    type="button"
                                    className="isp-btn isp-btn-primary"
                                    onClick={speak}
                                    disabled={busy || !script.trim()}
                                >
                                    <Sparkles size={15} aria-hidden="true" />
                                    {busy ? 'Generating…' : playing ? 'Pause' : 'Speak this'}
                                </button>
                                {edited && (
                                    <button
                                        type="button"
                                        className="isp-btn isp-btn-ghost"
                                        onClick={() => selectPreset(preset.id)}
                                    >
                                        Restore sample
                                    </button>
                                )}
                            </div>

                            <div className="isp-harness isp-harness-step">
                                <span className="isp-harness-pill">Text normaliser</span>
                                <p>
                                    {normalised
                                        ? 'Numbers, IDs and symbols are rewritten into words before a single sample is generated. The highlighted spans are what changed.'
                                        : preset.note ??
                                          'Nothing in this script needs rewriting — it is read as written.'}
                                </p>
                            </div>

                            <p className="isp-note" data-alert={status ? true : undefined}>
                                {status ||
                                    (SPEAK_API_URL
                                        ? 'Scripts are sent to the configured endpoint.'
                                        : 'Every clip here was generated by Indic-Speak from the script shown.')}
                            </p>
                        </div>

                        <div className="isp-demo-out">
                            <div className="isp-out-head">
                                <VoiceOrb
                                    audioRef={audioRef}
                                    playing={playing}
                                    accent={accent}
                                    size={72}
                                    label="Voice waveform"
                                />
                                <div className="isp-out-voice">
                                    <p>{normalised ? 'Read as' : 'Reading'}</p>
                                    <b>{preset.voice}</b>
                                </div>
                                <span className="isp-stage-meta">{preset.language}</span>
                            </div>

                            <div className="isp-out-spoken">
                                <WordLine
                                    key={`${preset.id}-${caption.length}-${normalised}`}
                                    text={caption}
                                    start={0}
                                    end={preset.duration}
                                    focus={normalised ? preset.focus : undefined}
                                    audioRef={audioRef}
                                    playing={playing}
                                    lang={preset.lang}
                                />
                            </div>

                            {result ? (
                                <>
                                    <div className="isp-transport">
                                        <PlayButton playing={playing} onToggle={toggle} />
                                        <RestartButton onRestart={restart} />
                                        <TimeReadout
                                            audioRef={audioRef}
                                            playing={playing}
                                            duration={preset.duration}
                                        />
                                    </div>
                                    <div className="isp-strip-wrap">
                                        <WaveStrip
                                            src={result.audio}
                                            audioRef={audioRef}
                                            playing={playing}
                                            accent={accent}
                                            onSeek={(fraction) => seek(fraction * preset.duration)}
                                        />
                                    </div>
                                    <audio ref={audioRef} src={result.audio} preload="auto" />
                                </>
                            ) : (
                                <p className="isp-note isp-out-idle">
                                    Press <b>Speak this</b> to hear it.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpeakLiveDemo;
