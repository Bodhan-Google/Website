/**
 * Chart configs for the IndicOCR post.
 *
 * Same convention as the rest of the research charts: plain objects referenced
 * by id from the post, resolved through resolveChart() and rendered by
 * <BlogChart>. Every number is read out of evals.js -- nothing is retyped here.
 *
 * Types in use:
 *   rankedBar   one leaderboard, single metric, ours highlighted
 *   heatmap     a full value matrix, sortable by column
 *   bar         grouped bars (used single-series for the throughput curve)
 *
 * OmniDocBench's per-metric table is deliberately *not* a heatmap: two of its
 * six columns are edit distances where lower is better, and one colour ramp
 * across mixed directions would read the wrong way round. It stays a table.
 */
import {
    HW,
    HW_OVERALL,
    HW_SYSTEMS,
    OLMOCR,
    OLMOCR_COLUMNS,
    OMNIDOC,
    PRINTED,
    PRINTED_OVERALL,
    PRINTED_SYSTEMS,
    THROUGHPUT,
} from './evals';

const SIZE_NOTE =
    'Parameter counts, where the system publishes one: PaddleOCRVL-1.6 1B, Chandra OCR 2 4B, '
    + 'IndicOCR 0.8B, Surya OCR 2 0.7B, Sarvam Vision 3B, Gemma-4-31B 31B, Nemotron Parse 2 '
    + '0.9B. GPT-5.6-sol and Gemini 3.1 Pro do not.';

/** `{ system, ours, values }` rows into ranked-bar shape, on one column. */
const rankedOn = (rows, column) =>
    rows
        .map((row) => ({
            name: row.system,
            key: row.ours ? 'ours' : row.system,
            score: row.values[column],
            highlight: !!row.ours,
        }))
        .sort((a, b) => b.score - a.score);

/** `{ key, label, ours }` systems plus a `{ key: value }` row into ranked-bar shape. */
const rankedFrom = (systems, overall) =>
    systems
        .map((s) => ({ name: s.label, key: s.key, score: overall[s.key], highlight: !!s.ours }))
        .sort((a, b) => b.score - a.score);

const headColumns = (systems) =>
    systems.map((s) => ({ label: s.label, isOurs: !!s.ours }));

// ── Public benchmarks ───────────────────────────────────────────────────────
export const omnidocOverall = {
    type: 'rankedBar',
    id: 'ocr-omnidoc-overall',
    title: 'OmniDocBench v1.6, overall',
    subtitle: 'English-only subset, 610 pages. Out of 100, higher is better.',
    description:
        'Ranked bars of the overall OmniDocBench score for nine systems. IndicOCR is third at '
        + '92.76, behind PaddleOCRVL-1.6 and Chandra OCR 2 and ahead of GPT-5.6-sol.',
    note: SIZE_NOTE,
    valueHeader: 'Overall (0–100)',
    digits: 2,
    highlightKey: 'ours',
    data: rankedOn(OMNIDOC, 0),
};

export const olmocrOverall = {
    type: 'rankedBar',
    id: 'ocr-olmocr-overall',
    title: 'olmOCR-Bench, overall',
    subtitle: 'English subset, 1,258 document images. Pass rate on binary unit tests.',
    description:
        'Ranked bars of the overall olmOCR-Bench pass rate for nine systems. IndicOCR is fourth '
        + 'at 82.2, within four points of the leader.',
    note: SIZE_NOTE,
    valueHeader: 'Overall pass rate',
    digits: 1,
    highlightKey: 'ours',
    data: rankedOn(OLMOCR, 0),
};

export const olmocrByCategory = {
    type: 'heatmap',
    id: 'ocr-olmocr-categories',
    title: 'olmOCR-Bench by test category',
    subtitle:
        'Pass rate per category, nine systems. Click a column header to sort the categories by '
        + 'that system.',
    description:
        'Matrix of olmOCR-Bench pass rates for nine test categories against nine systems. '
        + 'IndicOCR is second of nine on table tests and eighth on multi-column pages.',
    note:
        'Every column here runs in the same direction, which is what makes a single colour ramp '
        + 'honest. Old scans are the hardest category for every system on the board.',
    rowHeader: 'Test category',
    domainMax: 100,
    digits: 1,
    rowLabels: OLMOCR_COLUMNS,
    colLabels: headColumns(
        OLMOCR.map((row) => ({ label: row.system, ours: row.ours }))
    ),
    // Transposed: categories down the side, systems across the top, so the
    // column that is ours can carry the highlight rule.
    matrix: OLMOCR_COLUMNS.map((_, ci) => OLMOCR.map((row) => row.values[ci])),
};

// ── IndicOCR-PRINTED ────────────────────────────────────────────────────────
export const printedOverall = {
    type: 'rankedBar',
    id: 'ocr-printed-overall',
    title: 'IndicOCR-PRINTED, overall',
    subtitle:
        '22,043 block-level images across 22 Indian languages and English. Word-level accuracy, '
        + '100 × (1 − WER). Higher is better.',
    description:
        'Ranked bars of overall word-level accuracy on the printed benchmark. Sarvam Vision leads '
        + 'at 86.6 with IndicOCR second at 86.2, and both are far ahead of the rest.',
    note:
        'The averages hide the interesting part. Gemini, Surya, Gemma and Chandra all score near '
        + 'zero on Manipuri and Santali, so their overall figures are held up by the scripts they '
        + 'do read.',
    valueHeader: 'Word accuracy',
    digits: 1,
    highlightKey: 'ours',
    data: rankedFrom(PRINTED_SYSTEMS, PRINTED_OVERALL),
};

export const printedByLanguage = {
    type: 'heatmap',
    id: 'ocr-printed-languages',
    title: 'IndicOCR-PRINTED by language',
    subtitle:
        'Word-level accuracy, 23 languages × 6 systems. Click a column header to sort by it.',
    description:
        'Matrix of word-level accuracy per language and system on printed pages. IndicOCR leads '
        + 'on Konkani, Kashmiri, Manipuri and Santali; Gemini 3.1 Pro leads on most high-resource '
        + 'scripts.',
    domainMax: 100,
    digits: 1,
    rowLabels: PRINTED.map((row) => row.lang),
    colLabels: headColumns(PRINTED_SYSTEMS),
    matrix: PRINTED.map((row) => PRINTED_SYSTEMS.map((s) => row[s.key])),
};

// ── IndicOCR-HW ─────────────────────────────────────────────────────────────
export const hwOverall = {
    type: 'rankedBar',
    id: 'ocr-hw-overall',
    title: 'IndicOCR-HW, overall',
    subtitle:
        '10,544 handwritten block-level images across 12 Indian languages and English. Word-level '
        + 'accuracy. Higher is better.',
    description:
        'Ranked bars of overall word-level accuracy on handwriting. Gemini 3.1 Pro leads at 72.0 '
        + 'and IndicOCR is second at 66.7, ahead of Sarvam Vision at 55.4.',
    note:
        'The gap behind is the number worth reading here: Sarvam Vision at 55.4, then Gemma-4-31B '
        + 'at 33.9 — a 31B model scoring barely half what a 0.8B one does.',
    valueHeader: 'Word accuracy',
    digits: 1,
    highlightKey: 'ours',
    data: rankedFrom(HW_SYSTEMS, HW_OVERALL),
};

export const hwByLanguage = {
    type: 'heatmap',
    id: 'ocr-hw-languages',
    title: 'IndicOCR-HW by language',
    subtitle:
        'Word-level accuracy on handwriting, 13 languages × 6 systems. Click a column header to '
        + 'sort by it.',
    description:
        'Matrix of handwriting accuracy per language and system. IndicOCR leads on Odia and is '
        + 'within a few points of Gemini on most others; Telugu and Urdu are the weakest rows.',
    domainMax: 100,
    digits: 1,
    rowLabels: HW.map((row) => row.lang),
    colLabels: headColumns(HW_SYSTEMS),
    matrix: HW.map((row) => HW_SYSTEMS.map((s) => row[s.key])),
};

// ── Throughput ──────────────────────────────────────────────────────────────
export const throughputCurve = {
    type: 'bar',
    id: 'ocr-throughput',
    title: 'Pages per second by concurrency',
    subtitle: 'vLLM on one NVIDIA H100 80GB, OmniDocBench v1.6 English subset.',
    description:
        'Bars of end-to-end pages per second at five concurrency levels. Throughput rises to 6.26 '
        + 'at 64 concurrent requests and is flat above that.',
    note:
        'Throughput saturates at 64 concurrent requests. Pushing to 128 or 256 buys nothing and '
        + 'costs latency — the p95 page goes from 34 seconds to 81.',
    categoryHeader: 'Concurrent requests',
    yLabel: 'Pages / second',
    maxValue: 7,
    digits: 2,
    series: [{ key: 'pages', label: 'Pages / second', role: 'primary' }],
    data: THROUGHPUT.map((row) => ({
        category: String(row.concurrency),
        pages: row.pagesPerSecond,
    })),
};

export const indicOcrCharts = [
    omnidocOverall,
    olmocrOverall,
    olmocrByCategory,
    printedOverall,
    printedByLanguage,
    hwOverall,
    hwByLanguage,
    throughputCurve,
];

export const indicOcrChartRegistry = Object.fromEntries(
    indicOcrCharts.map((chart) => [chart.id, chart])
);
