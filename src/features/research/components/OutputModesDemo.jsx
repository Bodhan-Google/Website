import { useEffect, useId, useRef, useState } from 'react';
import { Check, Copy, Pause, Play, RotateCcw } from 'lucide-react';
import EditorialCard, { InnerPanel } from './EditorialCard';

const SAMPLE = {
    spoken: 'कल meeting hai at 5 PM',
    language: 'Hindi–English sample',
    durationSec: 4,
    modes: [
        {
            id: 'native',
            name: 'Native',
            script: 'Devanagari',
            description: 'Transcript in the appropriate native script.',
            text: 'कल मीटिंग है एट 5 पीएम',
        },
        {
            id: 'code-mixed',
            name: 'Code-mixed',
            script: 'Mixed script',
            description: 'Natural mixed-language representation.',
            text: 'कल meeting hai at 5 PM',
        },
        {
            id: 'romanized',
            name: 'Romanized',
            script: 'Latin script',
            description: 'Pronunciation represented in Latin characters.',
            text: 'Kal meeting hai at 5 PM',
        },
    ],
};

const WAVEFORM = [18, 32, 54, 28, 72, 44, 86, 60, 34, 68, 92, 48, 78, 36, 58, 24, 40, 70, 50, 84, 38, 62, 46, 76, 30, 66, 88, 42, 56, 26, 74, 52, 80, 34, 64, 44, 90, 48, 58, 22];

const formatTime = (seconds) => {
    const whole = Math.max(0, Math.min(SAMPLE.durationSec, Math.floor(seconds)));
    return `00:0${whole}`;
};

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const speakSample = ({ onStart, onEnd, onError }) => {
    if (!('speechSynthesis' in window)) {
        onError();
        return () => {};
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(SAMPLE.spoken);
    const voices = window.speechSynthesis.getVoices();
    const indianVoice =
        voices.find((voice) => voice.lang === 'hi-IN') ?? voices.find((voice) => voice.lang === 'en-IN');

    if (indianVoice) utterance.voice = indianVoice;
    utterance.lang = indianVoice?.lang ?? 'hi-IN';
    utterance.rate = 0.82;
    utterance.pitch = 1;
    utterance.onstart = onStart;
    utterance.onend = onEnd;
    utterance.onerror = (event) => {
        if (event.error !== 'interrupted' && event.error !== 'canceled') onError();
    };

    window.speechSynthesis.speak(utterance);

    return () => {
        utterance.onstart = null;
        utterance.onend = null;
        utterance.onerror = null;
        window.speechSynthesis.cancel();
    };
};

const AudioDemoPlayer = ({
    state,
    progress,
    elapsed,
    paused,
    onPlay,
    onPause,
    onResume,
}) => {
    const labelId = useId();
    const isActive = state === 'playing';
    const isComplete = state === 'complete';
    const actionLabel = isActive && !paused ? 'Pause sample' : isComplete || paused ? 'Replay audio' : 'Play and transcribe';

    const handleClick = () => {
        if (isActive && !paused) onPause();
        else if (paused) onResume();
        else onPlay();
    };

    return (
        <div className="asr-player">
            <div className="asr-player-top">
                <button
                    type="button"
                    className={`asr-play${isActive && !paused ? ' is-active' : ''}`}
                    onClick={handleClick}
                    aria-labelledby={labelId}
                    aria-label={`${actionLabel}. ${SAMPLE.language}, ${formatTime(SAMPLE.durationSec)} duration.`}
                >
                    {isActive && !paused ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
                </button>
                <div>
                    <p id={labelId} className="asr-player-title">
                        {isActive && !paused ? 'Playing sample' : isComplete || paused ? 'Replay audio' : 'Play and transcribe'}
                    </p>
                    <p className="asr-player-meta">
                        {SAMPLE.language} · {formatTime(SAMPLE.durationSec)}
                    </p>
                </div>
            </div>

            <div className="asr-wave" aria-hidden="true">
                {WAVEFORM.map((height, index) => {
                    const played = index / WAVEFORM.length <= progress;
                    return (
                        <span
                            key={`${height}-${index}`}
                            className={`asr-wave-bar${played ? ' is-played' : ''}`}
                            style={{ height: `${Math.max(18, height)}%` }}
                        />
                    );
                })}
                <span className="asr-playhead" style={{ left: `${progress * 100}%` }} />
            </div>

            <div className="asr-times">
                <span>{formatTime(elapsed)}</span>
                <span>{formatTime(SAMPLE.durationSec)}</span>
            </div>
        </div>
    );
};

const ProcessingStatus = ({ state, progress }) => {
    const step =
        state === 'idle'
            ? 'Ready to transcribe'
            : state === 'error'
              ? 'Playback failed'
              : state === 'complete'
                ? 'Three output formats ready'
                : progress < 0.2
                  ? 'Audio received'
                  : progress < 0.85
                    ? 'Transcribing speech'
                    : 'Preparing output formats';

    return (
        <div className="asr-status" aria-live="polite" aria-atomic="true">
            <span className={`asr-status-dot asr-status-dot-${state}`} />
            <span>
                {state === 'playing' && 'Playing sample audio. '}
                {step}.
            </span>
        </div>
    );
};

const ExecutionBridge = ({ state }) => {
    const active = state === 'playing';
    const done = state === 'complete';

    return (
        <div className="asr-bridge" aria-hidden="true">
            <span className={`asr-bridge-line${active || done ? ' is-on' : ''}${done ? ' is-done' : ''}`} />
            <span className={`asr-bridge-node${active ? ' is-active' : ''}${done ? ' is-done' : ''}`}>
                Multilingual ASR
            </span>
            <span className={`asr-bridge-fork${done ? ' is-open' : ''}`}>
                <span />
                <span />
                <span />
            </span>
            <ul className={`asr-bridge-modes${done ? ' is-open' : ''}`}>
                <li>Native</li>
                <li>Code-mixed</li>
                <li>Romanized</li>
            </ul>
        </div>
    );
};

const TranscriptPanel = ({ mode, reduced }) => {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(mode.text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setCopied(false);
        }
    };

    return (
        <article className="asr-output">
            <header className="asr-output-head">
                <div>
                    <h4>{mode.name}</h4>
                    <p>{mode.description}</p>
                </div>
                <button type="button" className="asr-copy" onClick={copy} aria-label={`Copy ${mode.name} transcript`}>
                    {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </header>
            <p className={`asr-output-text${reduced ? '' : ' asr-output-reveal'}`} lang={mode.id === 'romanized' ? 'en' : 'hi'}>
                {mode.text}
            </p>
            <p className="asr-output-script">{mode.script}</p>
        </article>
    );
};

const OutputModeComparison = ({ reduced }) => {
    const [tab, setTab] = useState(SAMPLE.modes[0].id);
    const tablistId = useId();

    const onTabKeyDown = (event) => {
        const ids = SAMPLE.modes.map((mode) => mode.id);
        const index = ids.indexOf(tab);
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            const next = event.key === 'ArrowRight' ? (index + 1) % ids.length : (index - 1 + ids.length) % ids.length;
            setTab(ids[next]);
        }
    };

    return (
        <div className="asr-comparison">
            <div className="asr-mode-tabs" role="tablist" aria-label="Output modes" id={tablistId} onKeyDown={onTabKeyDown}>
                {SAMPLE.modes.map((mode) => (
                    <button
                        key={mode.id}
                        type="button"
                        role="tab"
                        aria-selected={tab === mode.id}
                        id={`${tablistId}-${mode.id}`}
                        className={tab === mode.id ? 'is-active' : undefined}
                        onClick={() => setTab(mode.id)}
                    >
                        {mode.name}
                    </button>
                ))}
            </div>
            <div className="asr-outputs">
                {SAMPLE.modes.map((mode) => (
                    <div
                        key={mode.id}
                        className={`asr-output-col${tab === mode.id ? ' is-active' : ''}`}
                        role="tabpanel"
                        aria-labelledby={`${tablistId}-${mode.id}`}
                    >
                        <TranscriptPanel mode={mode} reduced={reduced} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const OutputModesDemo = () => {
    const [state, setState] = useState('idle');
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [reduced, setReduced] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);
    const startedAt = useRef(0);
    const elapsedBeforePause = useRef(0);
    const frame = useRef(0);
    const stopSpeech = useRef(() => {});
    const runId = useRef(0);

    useEffect(() => {
        setReduced(prefersReducedMotion());
        return () => {
            stopSpeech.current();
            window.cancelAnimationFrame(frame.current);
        };
    }, []);

    const tick = () => {
        const next = elapsedBeforePause.current + (performance.now() - startedAt.current) / 1000;
        const ratio = Math.min(1, next / SAMPLE.durationSec);
        setElapsed(next);
        setProgress(ratio);
        if (ratio < 1) frame.current = window.requestAnimationFrame(tick);
    };

    const startPlayback = () => {
        const id = ++runId.current;
        stopSpeech.current();
        window.cancelAnimationFrame(frame.current);
        setPaused(false);
        setProgress(0);
        setElapsed(0);
        elapsedBeforePause.current = 0;
        setState('playing');

        const fallback = window.setTimeout(() => {
            if (runId.current === id) finish();
        }, SAMPLE.durationSec * 1000 + 2500);

        stopSpeech.current = speakSample({
            onStart: () => {
                if (runId.current !== id) return;
                startedAt.current = performance.now();
                if (!prefersReducedMotion()) frame.current = window.requestAnimationFrame(tick);
            },
            onEnd: () => {
                window.clearTimeout(fallback);
                if (runId.current === id) finish();
            },
            onError: () => {
                window.clearTimeout(fallback);
                if (runId.current !== id) return;
                window.cancelAnimationFrame(frame.current);
                stopSpeech.current();
                setState('error');
                setPaused(false);
            },
        });
    };

    const finish = () => {
        window.cancelAnimationFrame(frame.current);
        setProgress(1);
        setElapsed(SAMPLE.durationSec);
        setPaused(false);
        setState('complete');
        setHasCompleted(true);
    };

    const pause = () => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.pause();
        window.cancelAnimationFrame(frame.current);
        elapsedBeforePause.current = elapsed;
        setPaused(true);
    };

    const resume = () => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.resume();
        startedAt.current = performance.now();
        setPaused(false);
        if (!prefersReducedMotion()) frame.current = window.requestAnimationFrame(tick);
    };

    const reset = () => {
        stopSpeech.current();
        window.cancelAnimationFrame(frame.current);
        runId.current += 1;
        setState('idle');
        setPaused(false);
        setProgress(0);
        setElapsed(0);
        elapsedBeforePause.current = 0;
        setHasCompleted(false);
    };

    return (
        <EditorialCard
            className="asr-demo"
            eyebrow="See it in action"
            title="One voice, three ways to read it"
            description="Play one spoken sentence. Bodhan ASR returns the same utterance as Native, Code-mixed, and Romanized text — parallel formats, not sequential steps."
            footer="Conceptual demonstration using the sample utterance from this article. It is not a live API transcription."
        >
            <InnerPanel>
                <AudioDemoPlayer
                    state={state}
                    progress={progress}
                    elapsed={elapsed}
                    paused={paused}
                    onPlay={startPlayback}
                    onPause={pause}
                    onResume={state === 'playing' ? resume : startPlayback}
                />

                <ProcessingStatus state={state} progress={progress} />
                <ExecutionBridge state={hasCompleted && state !== 'playing' ? 'complete' : state} />

                {state === 'error' && (
                    <div className="asr-error" role="alert">
                        <p>The sample could not be played. You can retry, or reset the demonstration.</p>
                        <div className="asr-error-actions">
                            <button type="button" className="asr-text-btn" onClick={startPlayback}>
                                Try again
                            </button>
                            <button type="button" className="asr-text-btn" onClick={reset}>
                                Reset
                            </button>
                        </div>
                    </div>
                )}

                {hasCompleted && <OutputModeComparison reduced={reduced} />}

                {hasCompleted && (
                    <div className="asr-actions">
                        <button type="button" className="asr-text-btn" onClick={reset}>
                            <RotateCcw size={14} aria-hidden="true" />
                            Reset demonstration
                        </button>
                    </div>
                )}
            </InnerPanel>
        </EditorialCard>
    );
};

export default OutputModesDemo;
