import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Check, Copy, Mic, Pause, Play, Square, Trash2 } from 'lucide-react';
import { SAMPLE_CLIPS, SCRIPT_MODES, TRANSCRIBE_API_URL } from './transcribeData';
import useAudioAnalyser from './useAudioAnalyser';
import useSpectrum from './useSpectrum';

const TINT = ['#0C8C82', '#5B44D4', '#CC1E74'];

const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
};

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The transcript surface. Words are revealed against playback position, the
 * word currently being spoken carries the accent treatment, and a change of
 * script re-typesets the whole line with a staggered entrance.
 */
const Transcript = ({ words, spoken, lang, live }) => {
    const hostRef = useRef(null);

    useLayoutEffect(() => {
        const host = hostRef.current;
        if (!host || prefersReducedMotion()) return undefined;
        const targets = host.querySelectorAll('.itx-word-in');
        if (!targets.length) return undefined;

        const tween = gsap.fromTo(
            targets,
            { opacity: 0, y: 14, filter: 'blur(6px)' },
            {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.5,
                ease: 'power3.out',
                stagger: Math.min(0.03, 0.9 / targets.length),
            }
        );
        return () => tween.kill();
        // Re-runs when the rendered script changes, which is exactly when the
        // line should re-typeset.
    }, [words]);

    if (!words.length) return null;

    return (
        <p className="itx-transcript" lang={lang} ref={hostRef}>
            {words.map((word, index) => (
                <Fragment key={`${index}-${word}`}>
                    <span
                        className="itx-word"
                        data-state={
                            index < spoken - 1 ? 'said' : index === spoken - 1 ? 'saying' : 'ahead'
                        }
                    >
                        <em className="itx-word-in">{word}</em>
                    </span>{' '}
                </Fragment>
            ))}
            {live && <i className="itx-caret" aria-hidden="true" />}
        </p>
    );
};

const TranscribeLiveDemo = () => {
    const [source, setSource] = useState(SAMPLE_CLIPS[0].id);
    const [script, setScript] = useState('native');
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [recording, setRecording] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [notice, setNotice] = useState('');
    const [micTranscripts, setMicTranscripts] = useState(null);
    const [copied, setCopied] = useState(false);

    const audioRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const canvasRef = useRef(null);

    const { analyserRef, connectElement, connectStream, detach, ensure } = useAudioAnalyser();

    const isMic = source === 'mic';
    const clip = SAMPLE_CLIPS.find((item) => item.id === source) ?? null;

    useSpectrum(canvasRef, analyserRef, { active: playing || recording, tint: TINT });

    const transcripts = isMic ? micTranscripts : clip?.transcripts;
    const text = transcripts?.[script] ?? '';
    const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

    // No word-level timings ship with these clips, so the transcript is spread
    // evenly across the runtime: the first and last words line up exactly and
    // the middle is close enough to read as live transcription.
    const spoken = isMic
        ? words.length
        : Math.min(words.length, Math.round(progress * words.length) + (playing ? 1 : 0));

    // ---- clip playback ---------------------------------------------------

    const stopEverything = useCallback(() => {
        audioRef.current?.pause();
        window.clearInterval(timerRef.current);
        timerRef.current = null;
        if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    }, []);

    const selectSource = useCallback(
        (next) => {
            stopEverything();
            setSource(next);
            setProgress(0);
            setDuration(0);
            setPlaying(false);
            setElapsed(0);
            setNotice('');
        },
        [stopEverything]
    );

    const togglePlay = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio || !clip) return;
        if (audio.paused) {
            ensure();
            connectElement(audio);
            try {
                await audio.play();
            } catch {
                setNotice('playback');
            }
        } else {
            audio.pause();
        }
    }, [clip, connectElement, ensure]);

    // ---- microphone ------------------------------------------------------

    const sendToModel = useCallback(async (blob) => {
        if (!TRANSCRIBE_API_URL) {
            setNotice('endpoint');
            return;
        }
        setNotice('sending');
        const body = new FormData();
        body.append('audio', blob, 'recording.webm');
        try {
            const response = await fetch(TRANSCRIBE_API_URL, { method: 'POST', body });
            if (!response.ok) throw new Error(String(response.status));
            const data = await response.json();
            setMicTranscripts({
                native: data.native ?? '',
                mixed: data.mixed ?? '',
                romanized: data.romanized ?? '',
            });
            setNotice('');
        } catch {
            setNotice('failed');
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            ensure();
            connectStream(stream);

            const recorder = new MediaRecorder(stream);
            recorderRef.current = recorder;
            chunksRef.current = [];

            recorder.addEventListener('dataavailable', (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            });
            recorder.addEventListener('stop', async () => {
                const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
                stream.getTracks().forEach((track) => track.stop());
                detach();
                await sendToModel(blob);
            });

            recorder.start();
            setRecording(true);
            setElapsed(0);
            setNotice('');
            setMicTranscripts(null);
            timerRef.current = window.setInterval(() => setElapsed((s) => s + 1), 1000);
        } catch {
            setNotice('permission');
        }
    }, [connectStream, detach, ensure, sendToModel]);

    const stopRecording = useCallback(() => {
        if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
        window.clearInterval(timerRef.current);
        timerRef.current = null;
        setRecording(false);
    }, []);

    useEffect(
        () => () => {
            window.clearInterval(timerRef.current);
            if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
        },
        []
    );

    const copyText = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1300);
        } catch {
            setCopied(false);
        }
    };

    const monolingual =
        !isMic && clip && clip.transcripts.native === clip.transcripts.mixed && script === 'mixed';

    const noticeText = {
        endpoint:
            'Recording captured. No inference endpoint is configured on this build, so nothing was transcribed — set VITE_TRANSCRIBE_API_URL to run it through the model. The sample clips below are real recordings with real transcripts.',
        permission: 'Microphone permission is needed to record. Nothing is captured until you allow it.',
        failed: 'The endpoint did not answer. Nothing has been transcribed.',
        sending: 'Sending the recording to the model…',
        playback: 'The browser blocked playback. Press play again.',
    }[notice];

    return (
        <section className="itx-section itx-demo" id="demo">
            <div className="itx-container">
                <header className="itx-head itx-reveal">
                    <p className="itx-eyebrow">Live demo</p>
                    <h2 className="itx-h2">
                        Speak, or press play — and <span className="itx-grad">watch it land</span>.
                    </h2>
                    <p className="itx-lede">
                        The meter is real: it is driven by whatever is making sound right now, your voice or the clip.
                        Words arrive against playback, and the three tabs are the three ways the model can write the
                        same sentence.
                    </p>
                </header>

                <div className="itx-console itx-reveal">
                    <div className="itx-console-bar">
                        <div className="itx-sources" role="tablist" aria-label="Audio source">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={isMic}
                                data-active={isMic || undefined}
                                className="itx-source itx-source-mic"
                                onClick={() => selectSource('mic')}
                            >
                                <Mic size={13} aria-hidden="true" />
                                Your voice
                            </button>
                            {SAMPLE_CLIPS.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={source === item.id}
                                    data-active={source === item.id || undefined}
                                    className="itx-source"
                                    onClick={() => selectSource(item.id)}
                                >
                                    <span
                                        className="itx-source-thumb"
                                        style={{ backgroundImage: `url(${item.poster})` }}
                                        aria-hidden="true"
                                    />
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <div className="itx-segmented" role="group" aria-label="Output script">
                            {SCRIPT_MODES.map((mode) => (
                                <button
                                    key={mode.id}
                                    type="button"
                                    aria-pressed={script === mode.id}
                                    data-active={script === mode.id || undefined}
                                    onClick={() => setScript(mode.id)}
                                >
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="itx-scope">
                        <canvas ref={canvasRef} className="itx-scope-canvas" aria-hidden="true" />
                        <div className="itx-scope-meta">
                            <span className="itx-state" data-on={playing || recording || undefined}>
                                <i aria-hidden="true" />
                                {recording ? 'Recording' : playing ? 'Playing' : 'Ready'}
                            </span>
                            <span className="itx-clock">
                                {isMic
                                    ? formatTime(elapsed)
                                    : `${formatTime(progress * duration)} / ${formatTime(duration)}`}
                            </span>
                        </div>
                    </div>

                    <div className="itx-stageline">
                        {!isMic && (
                            <div
                                className="itx-seek"
                                role="presentation"
                                onClick={(event) => {
                                    const audio = audioRef.current;
                                    if (!audio?.duration) return;
                                    const bounds = event.currentTarget.getBoundingClientRect();
                                    audio.currentTime =
                                        ((event.clientX - bounds.left) / bounds.width) * audio.duration;
                                }}
                            >
                                <span style={{ transform: `scaleX(${progress})` }} />
                            </div>
                        )}
                    </div>

                    <div className="itx-surface">
                        {noticeText ? (
                            <p className="itx-notice" data-kind={notice}>
                                {noticeText}
                            </p>
                        ) : words.length ? (
                            <>
                                <Transcript
                                    key={`${source}-${script}`}
                                    words={words}
                                    spoken={spoken}
                                    lang={isMic ? undefined : clip?.lang}
                                    live={playing}
                                />
                                {monolingual && (
                                    <p className="itx-surface-foot">
                                        No Latin words are spoken in this clip, so the mixed rendering agrees with the
                                        native one — the two only diverge when a speaker actually switches script.
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="itx-surface-empty">
                                {isMic
                                    ? 'Record a few seconds and the transcription appears here.'
                                    : 'Press play and the transcription lands word by word.'}
                            </p>
                        )}
                    </div>

                    <div className="itx-console-foot">
                        {isMic ? (
                            <button
                                type="button"
                                className="itx-btn itx-btn-primary"
                                onClick={recording ? stopRecording : startRecording}
                            >
                                {recording ? <Square size={13} aria-hidden="true" /> : <Mic size={14} aria-hidden="true" />}
                                {recording ? 'Stop' : 'Record'}
                            </button>
                        ) : (
                            <button type="button" className="itx-btn itx-btn-primary" onClick={togglePlay}>
                                {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
                                {playing ? 'Pause' : 'Play'}
                            </button>
                        )}

                        <button
                            type="button"
                            className="itx-btn"
                            onClick={() => {
                                stopEverything();
                                setMicTranscripts(null);
                                setProgress(0);
                                setElapsed(0);
                                setNotice('');
                            }}
                        >
                            <Trash2 size={13} aria-hidden="true" />
                            Clear
                        </button>

                        <button type="button" className="itx-btn" onClick={copyText} disabled={!text}>
                            {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>

                        <p className="itx-console-note">
                            {isMic
                                ? 'Audio stays in your browser unless an endpoint is configured.'
                                : clip?.meta}
                        </p>
                    </div>

                    <audio
                        ref={audioRef}
                        src={clip?.audio}
                        preload="metadata"
                        onPlay={() => setPlaying(true)}
                        onPause={() => setPlaying(false)}
                        onEnded={() => {
                            setPlaying(false);
                            setProgress(1);
                        }}
                        onTimeUpdate={(event) => {
                            const el = event.currentTarget;
                            if (el.duration) setProgress(el.currentTime / el.duration);
                        }}
                        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                    >
                        <track kind="captions" />
                    </audio>
                </div>
            </div>
        </section>
    );
};

export default TranscribeLiveDemo;
