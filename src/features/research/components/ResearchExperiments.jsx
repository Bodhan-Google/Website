import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import EditorialCard, { InnerPanel } from './EditorialCard';

const WINDOW_MS = 10000;
const MAX_VISIBLE_CHUNKS = 6;

const ControlSlider = ({
    id,
    label,
    value,
    min,
    max,
    step = 1,
    suffix = '',
    onChange,
    description,
}) => (
    <div className="editorial-control">
        <label htmlFor={id} className="editorial-control-label">
            <span>{label}</span>
            <strong>
                {value}
                {suffix}
            </strong>
        </label>
        {description && (
            <p id={`${id}-hint`} className="editorial-control-hint">
                {description}
            </p>
        )}
        <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-valuetext={`${value}${suffix}`}
            aria-describedby={description ? `${id}-hint` : undefined}
            onChange={(event) => onChange(Number(event.target.value))}
        />
    </div>
);

const percent = (ms) => `${(ms / WINDOW_MS) * 100}%`;

export const StreamingTimelineLab = () => {
    const [chunkMs, setChunkMs] = useState(640);
    const [overlap, setOverlap] = useState(20);
    const [activeIndex, setActiveIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [tooltip, setTooltip] = useState(null);
    const trackRef = useRef(null);
    const statusId = useId();

    const model = useMemo(() => {
        const stepMs = chunkMs * (1 - overlap / 100);
        const totalChunks = Math.max(1, Math.ceil((WINDOW_MS - chunkMs) / stepMs) + 1);
        const visibleCount = Math.min(MAX_VISIBLE_CHUNKS, totalChunks);

        const chunks = Array.from({ length: visibleCount }, (_, index) => {
            const startMs = index * stepMs;
            const endMs = startMs + chunkMs;
            const prevEndMs = index === 0 ? startMs : (index - 1) * stepMs + chunkMs;
            const overlapStartMs = startMs;
            const overlapEndMs = Math.max(startMs, Math.min(prevEndMs, endMs));
            const overlapMs = index === 0 ? 0 : Math.max(0, overlapEndMs - overlapStartMs);
            const clippedEnd = Math.min(endMs, WINDOW_MS);
            const clippedStart = Math.min(startMs, WINDOW_MS);
            const availableAtMs = Math.min(endMs, WINDOW_MS);

            return {
                index,
                label: `Chunk ${index + 1}`,
                startMs,
                endMs,
                clippedStart,
                clippedEnd,
                overlapMs,
                newMs: Math.max(0, chunkMs - overlapMs),
                availableAtMs,
                isLastVisible: index === visibleCount - 1 && totalChunks > visibleCount,
            };
        });

        return {
            stepMs,
            totalChunks,
            chunks,
        };
    }, [chunkMs, overlap]);

    useEffect(() => {
        setActiveIndex(0);
        setPlaying(false);
    }, [chunkMs, overlap]);

    useEffect(() => {
        if (!playing) return undefined;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
            setActiveIndex(model.chunks.length - 1);
            setPlaying(false);
            return undefined;
        }

        let index = 0;
        setActiveIndex(0);
        const timer = window.setInterval(() => {
            index += 1;
            if (index >= model.chunks.length) {
                setPlaying(false);
                window.clearInterval(timer);
                return;
            }
            setActiveIndex(index);
        }, 800);

        return () => window.clearInterval(timer);
    }, [playing, model.chunks.length]);

    const activeChunk = model.chunks[activeIndex] ?? model.chunks[0];

    const showTooltip = (chunk, event) => {
        const bounds = trackRef.current?.getBoundingClientRect();
        if (!bounds) return;
        const x = event.currentTarget.getBoundingClientRect().left - bounds.left;
        setTooltip({ chunk, x: Math.min(Math.max(8, x), bounds.width - 180) });
    };

    return (
        <EditorialCard
            eyebrow="Interactive experiment"
            title="How streaming audio is processed"
            description="Adjust chunk size and overlap to see how incoming speech is split, reused, processed, and turned into successive transcript updates. The diagram is a conceptual timeline, not a latency measurement."
            metrics={
                <dl className="editorial-summary">
                    <div>
                        <dt>Chunk size</dt>
                        <dd>{chunkMs} ms</dd>
                    </div>
                    <div>
                        <dt>Update interval</dt>
                        <dd>{Math.round(model.stepMs)} ms</dd>
                    </div>
                    <div>
                        <dt>Chunks in 10 s</dt>
                        <dd>{model.totalChunks}</dd>
                    </div>
                </dl>
            }
            footer="Conceptual timeline only; it does not claim measured Bodhan model latency."
        >
            <InnerPanel>
                <div className="editorial-controls editorial-controls-two">
                    <ControlSlider
                        id="chunk-size"
                        label="Chunk size"
                        value={chunkMs}
                        min={160}
                        max={1280}
                        step={160}
                        suffix=" ms"
                        description="Length of each audio window sent to the model."
                        onChange={setChunkMs}
                    />
                    <ControlSlider
                        id="chunk-overlap"
                        label="Overlap"
                        value={overlap}
                        min={0}
                        max={50}
                        step={5}
                        suffix="%"
                        description="How much of the previous chunk is reused in the next one."
                        onChange={setOverlap}
                    />
                </div>

                <div className="stream-toolbar">
                    <button
                        type="button"
                        className="stream-play"
                        onClick={() => setPlaying((current) => !current)}
                        aria-pressed={playing}
                    >
                        {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
                        {playing ? 'Pause sequence' : 'Play sequence'}
                    </button>
                    <p id={statusId} className="stream-status" aria-live="polite">
                        {activeChunk.label} available at {(activeChunk.availableAtMs / 1000).toFixed(2)}s
                        {activeChunk.index === model.chunks.length - 1 ? ' · final transcript' : ' · partial output'}
                        {model.totalChunks > model.chunks.length
                            ? ` · showing first ${model.chunks.length} of ${model.totalChunks} chunks`
                            : ''}
                    </p>
                </div>

                <div
                    className="stream-board"
                    role="img"
                    aria-label={`Streaming execution over 10 seconds. ${model.chunks.length} representative chunks of ${chunkMs} milliseconds with ${overlap} percent overlap. New audio arrives every ${Math.round(model.stepMs)} milliseconds.`}
                >
                    <div className="stream-lane">
                        <p className="stream-lane-label">Audio</p>
                        <div className="stream-lane-track stream-audio-track" aria-hidden="true">
                            <span className="stream-audio-fill" />
                            {Array.from({ length: 40 }, (_, index) => (
                                <i
                                    key={index}
                                    className="stream-wave-bar"
                                    style={{ height: `${28 + ((index * 17) % 48)}%` }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="stream-lane">
                        <p className="stream-lane-label">Chunks</p>
                        <div className="stream-lane-track" ref={trackRef}>
                            {model.chunks.map((chunk) => {
                                const widthMs = Math.max(0, chunk.clippedEnd - chunk.clippedStart);
                                const overlapRatio = chunk.overlapMs / chunkMs;
                                return (
                                    <button
                                        key={chunk.label}
                                        type="button"
                                        className={`stream-chunk${activeIndex === chunk.index ? ' is-active' : ''}`}
                                        style={{
                                            left: percent(chunk.clippedStart),
                                            width: percent(widthMs),
                                            zIndex: chunk.index + 1,
                                        }}
                                        aria-pressed={activeIndex === chunk.index}
                                        aria-label={`${chunk.label}: ${ (chunk.startMs / 1000).toFixed(2)}s to ${(chunk.endMs / 1000).toFixed(2)}s. Overlap ${(chunk.overlapMs / 1000).toFixed(2)}s. Update at ${(chunk.availableAtMs / 1000).toFixed(2)}s.`}
                                        onClick={() => {
                                            setPlaying(false);
                                            setActiveIndex(chunk.index);
                                        }}
                                        onFocus={(event) => {
                                            setActiveIndex(chunk.index);
                                            showTooltip(chunk, event);
                                        }}
                                        onBlur={() => setTooltip(null)}
                                        onMouseEnter={(event) => showTooltip(chunk, event)}
                                        onMouseLeave={() => setTooltip(null)}
                                    >
                                        <span
                                            className="stream-chunk-overlap"
                                            style={{ width: `${overlapRatio * 100}%` }}
                                        />
                                        <span className="stream-chunk-new" />
                                        <span className="stream-chunk-label">{chunk.index + 1}</span>
                                    </button>
                                );
                            })}
                            {tooltip && (
                                <div className="stream-tooltip" style={{ left: tooltip.x }} role="status">
                                    <p>{tooltip.chunk.label}</p>
                                    <span>Start {(tooltip.chunk.startMs / 1000).toFixed(2)}s</span>
                                    <span>End {(tooltip.chunk.endMs / 1000).toFixed(2)}s</span>
                                    <span>Overlap {(tooltip.chunk.overlapMs / 1000).toFixed(2)}s</span>
                                    <span>Update at {(tooltip.chunk.availableAtMs / 1000).toFixed(2)}s</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="stream-lane">
                        <p className="stream-lane-label">Processing</p>
                        <div className="stream-lane-track" aria-hidden="true">
                            {model.chunks.map((chunk) => (
                                <span
                                    key={`proc-${chunk.label}`}
                                    className={`stream-process${activeIndex === chunk.index ? ' is-active' : ''}`}
                                    style={{
                                        left: percent(Math.min(chunk.availableAtMs, WINDOW_MS - model.stepMs * 0.25)),
                                        width: percent(Math.min(model.stepMs * 0.55, 480)),
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="stream-lane">
                        <p className="stream-lane-label">Output</p>
                        <div className="stream-lane-track stream-output-track">
                            {model.chunks.map((chunk) => {
                                const isFinal = chunk.index === model.chunks.length - 1;
                                const isActive = activeIndex === chunk.index;
                                return (
                                    <span
                                        key={`out-${chunk.label}`}
                                        className={`stream-output${isActive ? ' is-active' : ''}${isFinal ? ' is-final' : ''}`}
                                        style={{ left: percent(Math.min(chunk.availableAtMs, WINDOW_MS - 40)) }}
                                    >
                                        {isActive ? (isFinal ? 'Final' : `Partial ${chunk.index + 1}`) : ''}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <div className="stream-lane stream-axis-lane">
                        <p className="stream-lane-label">Time</p>
                        <div className="stream-lane-track stream-axis" aria-hidden="true">
                            {[0, 2, 4, 6, 8, 10].map((second) => (
                                <span key={second} style={{ left: `${(second / 10) * 100}%` }}>
                                    {second}s
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <ul className="stream-legend" aria-label="Timeline legend">
                    <li><i className="stream-swatch stream-swatch-new" /> New audio</li>
                    <li><i className="stream-swatch stream-swatch-overlap" /> Reused overlap</li>
                    <li><i className="stream-swatch stream-swatch-process" /> Processing</li>
                    <li><i className="stream-swatch stream-swatch-output" /> Transcript update</li>
                </ul>
            </InnerPanel>
        </EditorialCard>
    );
};

const TOKEN_META = {
    C: { label: 'Correct', abbr: 'C' },
    S: { label: 'Substitution', abbr: 'S' },
    D: { label: 'Deletion', abbr: 'D' },
    I: { label: 'Insertion', abbr: 'I' },
};

export const WerPlayground = () => {
    const [referenceWords, setReferenceWords] = useState(20);
    const [substitutions, setSubstitutions] = useState(2);
    const [deletions, setDeletions] = useState(1);
    const [insertions, setInsertions] = useState(1);

    const maxSubstitutions = referenceWords;
    const maxDeletions = Math.max(0, referenceWords - Math.min(substitutions, maxSubstitutions));
    const safeSubstitutions = Math.min(substitutions, maxSubstitutions);
    const safeDeletions = Math.min(deletions, maxDeletions);
    const correct = Math.max(0, referenceWords - safeSubstitutions - safeDeletions);
    const errors = safeSubstitutions + safeDeletions + insertions;
    const wer = (errors / referenceWords) * 100;
    const werLabel = Number.isInteger(wer) ? `${wer}` : wer.toFixed(1);

    const tokens = [
        ...Array.from({ length: correct }, () => 'C'),
        ...Array.from({ length: safeSubstitutions }, () => 'S'),
        ...Array.from({ length: safeDeletions }, () => 'D'),
        ...Array.from({ length: insertions }, () => 'I'),
    ];

    const segments = [
        { key: 'C', count: correct, pattern: 'solid' },
        { key: 'S', count: safeSubstitutions, pattern: 'striped' },
        { key: 'D', count: safeDeletions, pattern: 'dashed' },
        { key: 'I', count: insertions, pattern: 'dotted' },
    ].filter((segment) => segment.count > 0);

    const totalTokens = Math.max(1, tokens.length);

    return (
        <EditorialCard
            eyebrow="Interactive experiment"
            title="Build a Word Error Rate"
            description="Change the reference length and error types. The strip, counts, and formula update together so you can see how substitutions, deletions, and insertions become WER."
            metric={
                <output className="editorial-metric" aria-live="polite" aria-label={`Word error rate: ${werLabel} percent`}>
                    <span className="editorial-metric-value">{wer.toFixed(1)}%</span>
                    <span className="editorial-metric-label">WER</span>
                </output>
            }
        >
            <InnerPanel>
                <div className="wer-layout">
                    <fieldset className="wer-inputs">
                        <legend>Inputs</legend>
                        <div className="editorial-controls editorial-controls-wer">
                            <ControlSlider
                                id="reference-words"
                                label="Reference words"
                                value={referenceWords}
                                min={5}
                                max={50}
                                description="Number of words in the reference transcript."
                                onChange={setReferenceWords}
                            />
                            <ControlSlider
                                id="substitutions"
                                label="Substitutions"
                                value={safeSubstitutions}
                                min={0}
                                max={maxSubstitutions}
                                description="Reference words replaced by a different word."
                                onChange={setSubstitutions}
                            />
                            <ControlSlider
                                id="deletions"
                                label="Deletions"
                                value={safeDeletions}
                                min={0}
                                max={maxDeletions}
                                description="Reference words missing from the hypothesis."
                                onChange={setDeletions}
                            />
                            <ControlSlider
                                id="insertions"
                                label="Insertions"
                                value={insertions}
                                min={0}
                                max={10}
                                description="Extra words that do not appear in the reference."
                                onChange={setInsertions}
                            />
                        </div>
                    </fieldset>

                    <div className="wer-visual">
                        <p className="wer-visual-label">Word-level alignment</p>
                        <div
                            className="wer-bar"
                            role="img"
                            aria-label={`Alignment of ${referenceWords} reference words plus ${insertions} insertions: ${correct} correct, ${safeSubstitutions} substitutions, ${safeDeletions} deletions, ${insertions} insertions.`}
                        >
                            {segments.map((segment) => (
                                <span
                                    key={segment.key}
                                    className={`wer-bar-slice wer-token-${segment.key.toLowerCase()} wer-pattern-${segment.pattern}`}
                                    style={{ flexGrow: segment.count, flexBasis: 0 }}
                                >
                                    <span>
                                        {TOKEN_META[segment.key].abbr} {segment.count}
                                    </span>
                                </span>
                            ))}
                        </div>

                        <ul className="wer-tokens" aria-hidden="true">
                            {tokens.slice(0, 36).map((type, index) => (
                                <li key={`${type}-${index}`} className={`wer-token wer-token-${type.toLowerCase()}`}>
                                    {TOKEN_META[type].abbr}
                                </li>
                            ))}
                            {tokens.length > 36 && (
                                <li className="wer-token wer-token-more">+{tokens.length - 36}</li>
                            )}
                        </ul>

                        <ul className="stream-legend wer-legend" aria-label="Error categories">
                            {Object.entries(TOKEN_META).map(([key, meta]) => (
                                <li key={key}>
                                    <i className={`stream-swatch wer-token-${key.toLowerCase()}`} />
                                    {meta.label} ({meta.abbr})
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="wer-formula">
                        <p className="wer-visual-label">Calculation</p>
                        <div className="wer-formula-steps">
                            <p>
                                Errors = S + D + I
                                <br />
                                Errors = {safeSubstitutions} + {safeDeletions} + {insertions} = <strong>{errors}</strong>
                            </p>
                            <p>
                                WER = Errors ÷ Reference words
                                <br />
                                WER = {errors} ÷ {referenceWords} = <strong>{wer.toFixed(1)}%</strong>
                            </p>
                        </div>
                        <p className="wer-result" aria-hidden="true">
                            {errors} errors in {referenceWords} reference words
                            {totalTokens !== referenceWords ? ` · ${insertions} extra inserted` : ''}
                        </p>
                    </div>
                </div>
            </InnerPanel>
        </EditorialCard>
    );
};

const ResearchExperiment = ({ type }) => {
    if (type === 'wer-playground') return <WerPlayground />;
    if (type === 'streaming-timeline') return <StreamingTimelineLab />;
    return null;
};

export default ResearchExperiment;
