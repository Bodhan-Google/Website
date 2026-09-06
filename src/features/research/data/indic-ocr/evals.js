/**
 * Evaluation numbers for the IndicOCR post.
 *
 * Transcribed from the announcement page the OCR team publishes from
 * (`final.md`), so the tables here are the tables that were signed off there.
 * Nothing on this page recomputes a score — charts.js only reshapes these
 * arrays into chart configs.
 *
 * Column direction matters and is not uniform: Overall, FormulaCDM and the two
 * TableTEDS columns are higher-is-better; TextEdit and ReadOrderEdit are edit
 * distances, so lower is better. That mix is why OmniDocBench stays a plain
 * table rather than becoming a single-ramp heatmap.
 */

/** Model sizes, where the system publishes one. Used to label the sub-1B claim. */
export const SYSTEM_SIZES = {
    'PaddleOCRVL-1.6': '1B',
    'Chandra OCR 2': '4B',
    'IndicOCR (ours)': '0.8B',
    'Surya OCR 2': '0.7B',
    'Sarvam Vision': '3B',
    'Gemma-4-31B': '31B',
    'Nemotron Parse 2': '0.9B',
};

// ── OmniDocBench v1.6, official English-only subset (610 pages) ─────────────
export const OMNIDOC_COLUMNS = [
    'Overall ↑',
    'TextEdit ↓',
    'FormulaCDM ↑',
    'TableTEDS ↑',
    'TableTEDS-S ↑',
    'ReadOrderEdit ↓',
];

export const OMNIDOC = [
    { system: 'PaddleOCRVL-1.6', values: [96.36, 0.03, 98.55, 93.37, 96.33, 0.09] },
    { system: 'Chandra OCR 2', values: [93.11, 0.04, 96.93, 86.07, 90.34, 0.09] },
    { system: 'IndicOCR (ours)', ours: true, values: [92.76, 0.04, 97.53, 85.1, 90.58, 0.11] },
    { system: 'GPT-5.6-sol', values: [92.46, 0.04, 95.42, 85.87, 90.98, 0.1] },
    { system: 'Gemini 3.1 Pro', values: [91.15, 0.06, 95.53, 83.46, 88.77, 0.13] },
    { system: 'Surya OCR 2', values: [91.13, 0.04, 95.67, 81.61, 86.37, 0.1] },
    { system: 'Sarvam Vision', values: [90.08, 0.04, 97.62, 76.82, 82.01, 0.1] },
    { system: 'Gemma-4-31B', values: [86.71, 0.09, 89.48, 79.79, 85.19, 0.19] },
    { system: 'Nemotron Parse 2', values: [79.12, 0.159, 78.94, 74.32, 81.09, 0.29] },
];

// ── olmOCR-Bench, English subset (1,258 document images) ───────────────────
// Every column is a pass rate on binary unit tests, so the whole matrix reads
// in one direction and can carry a single colour ramp.
export const OLMOCR_COLUMNS = [
    'Overall',
    'arxiv_math',
    'baseline',
    'headers_footers',
    'long_tiny_text',
    'multi_column',
    'old_scans',
    'old_scans_math',
    'table_tests',
];

export const OLMOCR = [
    { system: 'Chandra OCR 2', values: [85.9, 86.7, 99.8, 91.5, 93.7, 84.7, 51.0, 88.2, 92.2] },
    { system: 'Sarvam Vision', values: [84.3, 86.5, 99.6, 96.3, 91.0, 82.2, 49.8, 81.0, 88.3] },
    { system: 'Gemini 3.1 Pro', values: [82.6, 90.5, 99.0, 82.9, 88.5, 81.6, 47.0, 84.3, 87.3] },
    { system: 'IndicOCR (ours)', ours: true, values: [82.2, 83.2, 99.4, 92.9, 89.8, 76.0, 48.3, 77.7, 90.0] },
    { system: 'Surya OCR 2', values: [81.4, 82.5, 99.8, 92.9, 79.9, 85.1, 42.8, 84.3, 84.2] },
    { system: 'Gemma-4-31B', values: [80.4, 79.0, 99.4, 92.9, 89.8, 80.5, 45.8, 73.8, 82.2] },
    { system: 'PaddleOCRVL-1.6', values: [78.7, 85.1, 98.4, 96.2, 75.3, 83.9, 39.0, 68.3, 83.0] },
    { system: 'GPT-5.6-sol', values: [78.0, 79.3, 93.9, 95.4, 87.8, 77.4, 43.7, 64.6, 82.2] },
    { system: 'Nemotron Parse 2', values: [68.2, 64.0, 96.7, 90.0, 79.6, 72.8, 31.9, 28.6, 81.8] },
];

// ── IndicOCR-PRINTED, 22,043 block-level images ────────────────────────────
// Word-level accuracy, 100 x (1 - WER). Higher is better.
// Ours is listed first here; the source table ordered by the leader.
export const PRINTED_SYSTEMS = [
    { key: 'ours', label: 'IndicOCR (ours)', ours: true },
    { key: 'sarvam', label: 'Sarvam Vision' },
    { key: 'gemini', label: 'Gemini 3.1 Pro' },
    { key: 'surya', label: 'Surya OCR 2' },
    { key: 'gemma', label: 'Gemma-4-31B' },
    { key: 'chandra', label: 'Chandra OCR 2' },
];

export const PRINTED_OVERALL = {
    ours: 86.2, sarvam: 86.6, gemini: 80.4, surya: 67.9, gemma: 66.3, chandra: 64.2,
};

export const PRINTED = [
    { lang: 'Assamese', ours: 90.2, sarvam: 89.5, gemini: 90.7, surya: 86.4, gemma: 70.6, chandra: 73.5 },
    { lang: 'Bodo', ours: 86.5, sarvam: 91.0, gemini: 91.0, surya: 55.6, gemma: 68.1, chandra: 46.6 },
    { lang: 'Bengali', ours: 91.4, sarvam: 91.6, gemini: 92.5, surya: 81.1, gemma: 83.9, chandra: 79.2 },
    { lang: 'Dogri', ours: 81.7, sarvam: 85.8, gemini: 83.7, surya: 60.5, gemma: 64.4, chandra: 55.8 },
    { lang: 'English', ours: 97.0, sarvam: 96.6, gemini: 97.7, surya: 93.8, gemma: 97.2, chandra: 91.3 },
    { lang: 'Gujarati', ours: 91.7, sarvam: 91.6, gemini: 92.8, surya: 79.6, gemma: 81.6, chandra: 73.0 },
    { lang: 'Hindi', ours: 96.0, sarvam: 95.7, gemini: 96.3, surya: 90.3, gemma: 93.7, chandra: 89.3 },
    { lang: 'Konkani', ours: 93.7, sarvam: 93.6, gemini: 93.5, surya: 90.5, gemma: 76.9, chandra: 85.5 },
    { lang: 'Kannada', ours: 88.0, sarvam: 88.8, gemini: 89.8, surya: 75.7, gemma: 68.3, chandra: 69.6 },
    { lang: 'Kashmiri', ours: 52.2, sarvam: 43.3, gemini: 38.1, surya: 23.4, gemma: 19.9, chandra: 17.6 },
    { lang: 'Malayalam', ours: 89.9, sarvam: 90.6, gemini: 90.6, surya: 76.5, gemma: 72.0, chandra: 68.3 },
    { lang: 'Manipuri', ours: 83.8, sarvam: 81.9, gemini: 0.8, surya: 0.1, gemma: 0.1, chandra: 0.0 },
    { lang: 'Marathi', ours: 93.5, sarvam: 93.9, gemini: 94.5, surya: 84.3, gemma: 89.1, chandra: 83.1 },
    { lang: 'Maithili', ours: 83.0, sarvam: 86.7, gemini: 86.7, surya: 67.6, gemma: 76.3, chandra: 66.1 },
    { lang: 'Nepali', ours: 91.5, sarvam: 92.5, gemini: 93.7, surya: 87.6, gemma: 87.2, chandra: 82.1 },
    { lang: 'Odia', ours: 75.7, sarvam: 77.5, gemini: 84.8, surya: 64.5, gemma: 38.7, chandra: 62.6 },
    { lang: 'Punjabi', ours: 93.2, sarvam: 92.2, gemini: 93.5, surya: 86.3, gemma: 75.1, chandra: 84.1 },
    { lang: 'Sanskrit', ours: 76.2, sarvam: 82.0, gemini: 83.7, surya: 57.8, gemma: 60.8, chandra: 55.8 },
    { lang: 'Sindhi', ours: 87.1, sarvam: 89.2, gemini: 86.3, surya: 80.5, gemma: 74.5, chandra: 71.4 },
    { lang: 'Santali', ours: 74.7, sarvam: 71.9, gemini: 0.2, surya: 0.1, gemma: 0.2, chandra: 0.0 },
    { lang: 'Tamil', ours: 91.3, sarvam: 94.2, gemini: 94.4, surya: 79.9, gemma: 83.3, chandra: 79.0 },
    { lang: 'Telugu', ours: 82.3, sarvam: 84.3, gemini: 85.5, surya: 63.1, gemma: 66.6, chandra: 59.6 },
    { lang: 'Urdu', ours: 85.9, sarvam: 87.1, gemini: 88.0, surya: 76.4, gemma: 76.6, chandra: 74.4 },
];

// ── IndicOCR-HW, 10,544 handwritten block-level images ─────────────────────
export const HW_SYSTEMS = [
    { key: 'ours', label: 'IndicOCR (ours)', ours: true },
    { key: 'gemini', label: 'Gemini 3.1 Pro' },
    { key: 'sarvam', label: 'Sarvam Vision' },
    { key: 'gemma', label: 'Gemma-4-31B' },
    { key: 'chandra', label: 'Chandra OCR 2' },
    { key: 'surya', label: 'Surya OCR 2' },
];

export const HW_OVERALL = {
    ours: 66.7, gemini: 72.0, sarvam: 55.4, gemma: 33.9, chandra: 24.7, surya: 23.0,
};

export const HW = [
    { lang: 'Assamese', ours: 66.1, gemini: 71.6, sarvam: 47.8, gemma: 24.1, chandra: 8.9, surya: 17.8 },
    { lang: 'Bengali', ours: 71.3, gemini: 74.8, sarvam: 58.3, gemma: 35.1, chandra: 6.6, surya: 10.0 },
    { lang: 'English', ours: 80.7, gemini: 84.4, sarvam: 77.7, gemma: 78.5, chandra: 78.2, surya: 72.7 },
    { lang: 'Gujarati', ours: 55.9, gemini: 60.0, sarvam: 39.2, gemma: 23.7, chandra: 11.8, surya: 11.5 },
    { lang: 'Hindi', ours: 77.6, gemini: 83.1, sarvam: 72.3, gemma: 70.7, chandra: 54.6, surya: 42.7 },
    { lang: 'Kannada', ours: 69.6, gemini: 73.8, sarvam: 57.7, gemma: 17.2, chandra: 11.5, surya: 13.2 },
    { lang: 'Malayalam', ours: 60.5, gemini: 63.9, sarvam: 45.6, gemma: 16.0, chandra: 15.7, surya: 11.8 },
    { lang: 'Marathi', ours: 70.2, gemini: 79.0, sarvam: 61.8, gemma: 56.5, chandra: 35.4, surya: 28.8 },
    { lang: 'Odia', ours: 68.2, gemini: 66.7, sarvam: 40.6, gemma: 15.5, chandra: 19.4, surya: 19.9 },
    { lang: 'Punjabi', ours: 69.4, gemini: 70.1, sarvam: 54.8, gemma: 11.7, chandra: 11.5, surya: 15.7 },
    { lang: 'Tamil', ours: 76.8, gemini: 80.5, sarvam: 60.5, gemma: 33.4, chandra: 18.8, surya: 16.8 },
    { lang: 'Telugu', ours: 53.5, gemini: 72.0, sarvam: 59.1, gemma: 32.0, chandra: 20.8, surya: 14.6 },
    { lang: 'Urdu', ours: 46.4, gemini: 54.4, sarvam: 44.4, gemma: 25.6, chandra: 27.6, surya: 22.6 },
];

// ── Throughput: vLLM, one NVIDIA H100 80GB, OmniDocBench v1.6 English subset ─
export const THROUGHPUT = [
    { concurrency: 8, pagesPerSecond: 3.19, outputTokensPerSecond: 4444, medianMs: 1344, p95Ms: 7598 },
    { concurrency: 32, pagesPerSecond: 5.13, outputTokensPerSecond: 6594, medianMs: 3295, p95Ms: 19243 },
    { concurrency: 64, pagesPerSecond: 6.26, outputTokensPerSecond: 7935, medianMs: 4813, p95Ms: 34196 },
    { concurrency: 128, pagesPerSecond: 6.34, outputTokensPerSecond: 7736, medianMs: 9337, p95Ms: 72970 },
    { concurrency: 256, pagesPerSecond: 6.27, outputTokensPerSecond: 7700, medianMs: 28188, p95Ms: 81229 },
];

/** The 37 layout labels IndicDocLayout predicts, in the order published. */
export const LAYOUT_TAXONOMY = [
    'Advertisement', 'Answer', 'Author', 'Chapter-end-section', 'Chapter-title', 'Chart',
    'Code', 'Contact-info', 'Dateline', 'Diagram', 'Equation', 'Expression', 'Flag', 'Folio',
    'Footer', 'Footnote', 'Header', 'Image', 'Image-caption', 'Index', 'Infobox', 'List',
    'MCQ', 'Page-number', 'Paragraph', 'Placeholder-text', 'Question', 'Reference',
    'Section-title', 'Solved-example', 'Sub-section-title', 'Sub-sub-section-title', 'Table',
    'Table-caption', 'Table-of-contents', 'Title', 'Website-link',
];
