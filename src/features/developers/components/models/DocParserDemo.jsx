import { useEffect, useMemo, useState } from 'react';
import { Play, Pause, RotateCcw, ScanSearch } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const LABEL_STYLE = {
    Title: 'title',
    'Chapter-title': 'title',
    Paragraph: 'paragraph',
    Equation: 'equation',
    Question: 'question',
    Answer: 'answer',
    'Page-number': 'page-number',
};

const styleFor = (label) => LABEL_STYLE[label] ?? 'paragraph';

const SAMPLES = [
    {
        id: 'english-math',
        name: 'English',
        tag: 'Printed · dense mathematics',
        blocks: [
            { order: 1, label: 'Title', bbox: { left: 8, top: 4, width: 84, height: 8 }, markdown: '## Continued Fractions of √5' },
            {
                order: 2,
                label: 'Paragraph',
                bbox: { left: 8, top: 15, width: 84, height: 13 },
                markdown: 'We examine the continued fraction expansion associated with the golden ratio.',
            },
            {
                order: 3,
                label: 'Equation',
                bbox: { left: 20, top: 31, width: 60, height: 15 },
                markdown: '$$\n\\cfrac{1}{1+\\cfrac{1}{1+\\cfrac{1}{1+\\cdots}}} = \\frac{\\sqrt{5}-1}{2}\n$$',
            },
            {
                order: 4,
                label: 'Paragraph',
                bbox: { left: 8, top: 49, width: 84, height: 13 },
                markdown: 'Truncating at successive depths yields 1, 1/2, 2/3, 3/5, 5/8 — Fibonacci ratios.',
            },
            { order: 5, label: 'Page-number', bbox: { left: 88, top: 92, width: 8, height: 5 }, markdown: '184' },
        ],
    },
    {
        id: 'telugu-printed',
        name: 'Telugu',
        tag: 'Printed · novel',
        blocks: [
            { order: 1, label: 'Chapter-title', bbox: { left: 25, top: 4, width: 50, height: 7 }, markdown: '### రెండవ అధ్యాయము' },
            {
                order: 2,
                label: 'Paragraph',
                bbox: { left: 8, top: 13, width: 84, height: 20 },
                markdown: 'ఆ ఊరి చివర ఒక చిన్న గుడిసె ఉండేది. అందులో వెంకయ్య అనే వృద్ధుడు ఒంటరిగా జీవించేవాడు.',
            },
            {
                order: 3,
                label: 'Paragraph',
                bbox: { left: 8, top: 35, width: 84, height: 20 },
                markdown: 'ప్రతి రోజూ సూర్యోదయానికి ముందే అతను పొలం వైపు నడిచేవాడు.',
            },
            { order: 4, label: 'Page-number', bbox: { left: 46, top: 92, width: 8, height: 5 }, markdown: '47' },
        ],
    },
    {
        id: 'hindi-handwritten',
        name: 'Hindi',
        tag: 'Handwritten · worksheet',
        blocks: [
            { order: 1, label: 'Title', bbox: { left: 8, top: 4, width: 84, height: 7 }, markdown: '## प्रश्नावली 3.2' },
            { order: 2, label: 'Question', bbox: { left: 8, top: 13, width: 84, height: 9 }, markdown: '**प्रश्न 1.** हल कीजिए: 2x + 5 = 15' },
            { order: 3, label: 'Equation', bbox: { left: 16, top: 24, width: 70, height: 9 }, markdown: '$$\n2x = 15 - 5 = 10 \\implies x = 5\n$$' },
            { order: 4, label: 'Answer', bbox: { left: 8, top: 35, width: 84, height: 6 }, markdown: '**उत्तर:** x = 5' },
            { order: 5, label: 'Question', bbox: { left: 8, top: 44, width: 84, height: 9 }, markdown: '**प्रश्न 2.** 3y − 7 = 11 है, तो y ज्ञात कीजिए।' },
            { order: 6, label: 'Equation', bbox: { left: 16, top: 55, width: 70, height: 9 }, markdown: '$$\n3y = 18 \\implies y = 6\n$$' },
            { order: 7, label: 'Answer', bbox: { left: 8, top: 66, width: 84, height: 6 }, markdown: '**उत्तर:** y = 6' },
        ],
    },
];

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DocParserDemo = () => {
    const [sampleId, setSampleId] = useState(SAMPLES[0].id);
    const [layoutRevealed, setLayoutRevealed] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [playing, setPlaying] = useState(false);

    const sample = SAMPLES.find((s) => s.id === sampleId) ?? SAMPLES[0];

    const selectSample = (id) => {
        setSampleId(id);
        setLayoutRevealed(false);
        setActiveIndex(-1);
        setPlaying(false);
    };

    useEffect(() => {
        if (!playing) return undefined;
        const timer = window.setInterval(() => {
            setActiveIndex((current) => {
                const next = current + 1;
                if (next >= sample.blocks.length - 1) {
                    window.clearInterval(timer);
                    setPlaying(false);
                    return sample.blocks.length - 1;
                }
                return next;
            });
        }, 700);
        return () => window.clearInterval(timer);
    }, [playing, sample]);

    const startParsing = () => {
        setLayoutRevealed(true);
        if (prefersReducedMotion()) {
            setActiveIndex(sample.blocks.length - 1);
            return;
        }
        if (activeIndex >= sample.blocks.length - 1) setActiveIndex(-1);
        setPlaying(true);
    };

    const reset = () => {
        setLayoutRevealed(false);
        setActiveIndex(-1);
        setPlaying(false);
    };

    const revealedBlocks = useMemo(
        () => sample.blocks.filter((b) => b.order - 1 <= activeIndex),
        [sample, activeIndex]
    );

    return (
        <div className="model-panel dp-panel">
            <div className="dp-sample-tabs" role="tablist" aria-label="Sample document">
                {SAMPLES.map((s) => (
                    <button
                        key={s.id}
                        type="button"
                        role="tab"
                        aria-selected={sampleId === s.id}
                        className={sampleId === s.id ? 'is-active' : undefined}
                        onClick={() => selectSample(s.id)}
                    >
                        {s.name}
                    </button>
                ))}
                <span className="dp-sample-meta">{sample.tag}</span>
            </div>

            <div className="dp-shell">
                <div className="dp-page" role="img" aria-label={`Mock page with ${sample.blocks.length} detected blocks in reading order`}>
                    {sample.blocks.map((block) => {
                        const isActive = block.order - 1 === activeIndex;
                        const isDone = block.order - 1 < activeIndex;
                        return (
                            <span
                                key={block.order}
                                className={`dp-block dp-block-${styleFor(block.label)}${layoutRevealed ? ' is-revealed' : ''}${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}
                                style={{
                                    left: `${block.bbox.left}%`,
                                    top: `${block.bbox.top}%`,
                                    width: `${block.bbox.width}%`,
                                    height: `${block.bbox.height}%`,
                                    transitionDelay: layoutRevealed ? `${(block.order - 1) * 60}ms` : '0ms',
                                }}
                            >
                                <i className="dp-block-badge">{block.order}</i>
                            </span>
                        );
                    })}
                </div>

                <div className="dp-output">
                    {revealedBlocks.length === 0 ? (
                        <p className="dp-output-empty">Parsed Markdown appears here.</p>
                    ) : (
                        <div className="dp-markdown">
                            {revealedBlocks.map((b) => (
                                <div key={b.order} className={`dp-markdown-block${b.order - 1 === activeIndex ? ' is-active' : ''}`}>
                                    {styleFor(b.label) === 'equation' ? (
                                        <pre className="dp-markdown-latex">{b.markdown}</pre>
                                    ) : (
                                        <ReactMarkdown>{b.markdown}</ReactMarkdown>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="dp-toolbar">
                <button type="button" className="model-cta-primary model-cta-small" onClick={playing ? () => setPlaying(false) : startParsing}>
                    {playing ? <Pause size={13} aria-hidden="true" /> : layoutRevealed ? <Play size={13} aria-hidden="true" /> : <ScanSearch size={13} aria-hidden="true" />}
                    {playing ? 'Pause' : layoutRevealed && activeIndex >= sample.blocks.length - 1 ? 'Replay' : 'Detect & parse'}
                </button>
                <button type="button" className="dp-text-btn" onClick={reset}>
                    <RotateCcw size={12} aria-hidden="true" />
                    Reset
                </button>
            </div>
        </div>
    );
};

export default DocParserDemo;
