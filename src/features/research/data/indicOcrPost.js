/**
 * The IndicOCR post.
 *
 * Copy and numbers come from the announcement page the OCR team publishes from
 * (`final.md`), carried over unchanged in substance and reshaped into the
 * eight-section structure documented in postTemplate.js.
 *
 * Two things from that source are deliberately *not* carried over:
 *
 *   - the Capabilities section, which upstream is still a list of internal
 *     notes about which sample pages to pick, plus two `[TODO]` image blocks.
 *     Notes are not copy, so the section here states what the model does and
 *     books dashed slots for the sample pages instead of inventing them.
 *   - the hero pipeline diagram (`assets/diagram.png`), which is not in this
 *     repo. Also a slot.
 *
 * The tables live in indic-ocr/evals.js and reach the page as charts through
 * indic-ocr/charts.js; only the OmniDocBench metric grid is rendered as a table,
 * because its six columns do not all run in the same direction.
 */
import { OMNIDOC, OMNIDOC_COLUMNS, LAYOUT_TAXONOMY, THROUGHPUT } from './indic-ocr/evals';

// Edit distances want more precision than the 0–100 scores do, and mixing
// `0.03` with `96.36` in one column of a table reads as a typo.
const EDIT_COLUMNS = new Set([1, 5]);
const omnidocCell = (value, column) =>
    EDIT_COLUMNS.has(column) ? value.toFixed(3) : value.toFixed(2);

export const indicOcrPost = {
    // ── 1. Hero ──────────────────────────────────────────────────────────
    slug: 'indic-ocr',
    title: 'IndicOCR: Document Parsing for English and 22 Indian Languages',
    category: 'Release',
    date: '2026-09-05',
    summary:
        'A two-stage document parser — a 33M layout detector and a 0.8B reader — that reads '
        + 'printed and handwritten pages across 13 scripts. 92.76 on OmniDocBench v1.6, and the '
        + 'clear leader on Kashmiri, Manipuri and Santali.',
    featured: true,
    posterMotif: 'script',
    tagline:
        'Printed or handwritten, 13 scripts, maths and tables — a 0.8B reader behind a 33M layout detector.',
    heroSummary:
        'IndicOCR is a document parsing system for English and all 22 constitutionally recognised '
        + 'Indian languages, built jointly by Bodhan.AI and AI4Bharat. It reads printed and '
        + 'handwritten pages, including tables and complex mathematics, returns them in reading '
        + 'order, and does it at a sub-1B recognition footprint.',
    heroLinks: [
        { label: '🤗 Hugging Face', href: 'https://huggingface.co/bodhan-ai/indic-doc-parser' },
        { label: '▶ Try the model', href: '/developers/indic-doc-parser' },
        { label: '◉ GitHub', href: '#' },
        { label: '📖 Documentation', href: '#' },
    ],
    specs: [
        { label: 'Languages', value: '22 + English' },
        { label: 'Scripts', value: '13' },
        { label: 'Parameters', value: '33M + 0.8B' },
        { label: 'Training', value: '15M+ pages' },
        { label: 'Layout labels', value: '37' },
        { label: 'Throughput', value: '6.3 pages/s' },
        { label: 'Licence', value: 'Bodhan Open 1.0' },
    ],

    sections: [
        // ── 2. Motivation, opened without a heading ──────────────────────
        {
            id: 'motivation',
            title: 'Introduction',
            tocTitle: 'Introduction',
            hideHeading: true,
            content: [
                'At AI4Bharat, we have been working on Indian language AI for a long time now. We '
                + 'have put out translation, speech recognition and speech generation models with '
                + 'competitive performance across all 22 languages, and have open-sourced them for '
                + 'the research community to improve and build upon. **Document digitisation was the '
                + 'missing piece.** Given India’s rich written heritage and the complexity of Indic '
                + 'scripts, there was a dire need to build models specifically for it.',
                'The document models that exist today, open weights and closed alike, were built '
                + 'largely for English, and a multitude of issues follow from that: accuracy on '
                + 'high-resource Indian languages well below what the same systems manage in English, '
                + 'and weak to no support for the low-resource ones. Handwriting compounds all of it. '
                + 'Real handwritten pages are messy, and they vary by age and writing style, from a '
                + 'child’s careful developmental handwriting to an adult’s hurried scribble, across '
                + 'every one of these languages. This was the exact gap we wanted to fill.',
                'Today, as a joint effort between **Bodhan.AI** and **AI4Bharat**, we are introducing '
                + '**IndicOCR**, a document parsing system for English and all 22 constitutionally '
                + 'recognised Indian languages. We built it to read printed and handwritten text '
                + 'across India’s languages, including tables and complex maths, while keeping a lean '
                + 'memory footprint.',
            ],
            bullets: [
                'Supports 22 Indic languages and English across 13 unique scripts.',
                'Handwriting recognition across English plus Hindi, Marathi, Bengali, Tamil, Telugu, Malayalam, Kannada, Gujarati, Punjabi, Assamese, Odia and Urdu.',
                'Scores 92.76 on OmniDocBench v1.6 and 82.20 on olmOCR-Bench.',
                'Throughput of 6.3 pages per second on a single H100 at 64 concurrent requests.',
                'Released under the Bodhan Open License 1.0.',
            ],
            slots: [
                {
                    kind: 'image',
                    label: 'Pipeline diagram',
                    hint: 'The hero figure from the source page (`assets/diagram.png`): page image → layout detection with reading order → block-level OCR → Markdown. Drop it into public/examples/ocr/ and replace this slot.',
                },
            ],
        },

        // ── 3. Languages and scripts ─────────────────────────────────────
        {
            id: 'languages-and-scripts',
            title: 'Languages and Scripts',
            tocTitle: 'Languages',
            content: [
                'Coverage is counted in scripts, not just languages. Twenty-two Eighth Schedule '
                + 'languages and English share **thirteen** writing systems between them, and a model '
                + 'that has never seen a script reads none of the languages written in it — which is '
                + 'why Manipuri and Santali come back as noise from most systems rather than as bad '
                + 'transcriptions.',
                'Handwriting is a narrower set for now: English plus twelve Indian languages, listed '
                + 'in the handwriting benchmark further down.',
            ],
            stats: [
                { label: 'Languages read', value: '22 + English' },
                { label: 'Scripts covered', value: '13' },
                { label: 'With handwriting', value: '12 + English' },
            ],
            bullets: [
                'Devanagari — Hindi, Marathi, Nepali, Konkani, Sanskrit, Maithili, Dogri, Bodo',
                'Bengali–Assamese — Bengali, Assamese',
                'Perso-Arabic — Urdu, Kashmiri, Sindhi',
                'Latin — English',
                'Gujarati — Gujarati',
                'Gurmukhi — Punjabi',
                'Odia — Odia',
                'Tamil — Tamil',
                'Telugu — Telugu',
                'Kannada — Kannada',
                'Malayalam — Malayalam',
                'Meitei Mayek — Manipuri',
                'Ol Chiki — Santali',
            ],
        },

        // ── 4. What it reads ─────────────────────────────────────────────
        {
            id: 'capabilities',
            title: 'What It Reads',
            tocTitle: 'Capabilities',
            content: [
                'A page is not a wall of text. The parser is built around that: every region is '
                + 'labelled before it is read, and each kind of region comes back in the format that '
                + 'preserves its meaning rather than being flattened into prose.',
            ],
            subsectionLayout: 'cards',
            subsections: [
                {
                    title: 'Printed pages, 13 scripts',
                    content:
                        'Textbooks, novels, magazines, government forms, newspapers and research '
                        + 'papers — including two scripts, Meitei Mayek and Ol Chiki, that four of '
                        + 'the five systems we measure against score near zero on.',
                },
                {
                    title: 'Handwriting, not just print',
                    content:
                        'Real handwritten pages rather than rendered fonts: a child’s developmental '
                        + 'hand, a student’s notebook, an archival manuscript. Same model, no separate '
                        + 'checkpoint.',
                },
                {
                    title: 'Mathematics as LaTeX',
                    content:
                        'Fractions, integrals, matrices and multi-line derivations come back as '
                        + 'compilable TeX, inline with the prose around them.',
                },
                {
                    title: 'Tables as HTML',
                    content:
                        'Cell structure is recovered rather than approximated, including dense '
                        + 'numeric tables of the kind found in financial filings.',
                },
                {
                    title: 'Reading order, resolved',
                    content:
                        'Columns, insets, folios and footnotes are threaded into the sequence a human '
                        + 'reader would follow, so the output of a multi-column page is a document '
                        + 'rather than a pile of blocks.',
                },
                {
                    title: 'An education-domain taxonomy',
                    content:
                        'Questions, answers, MCQs and solved examples are distinct labels rather than '
                        + 'generic text, which is what makes a worksheet machine-readable as a '
                        + 'worksheet.',
                },
            ],
            slots: [
                {
                    kind: 'image',
                    label: 'Sample pages — detection beside transcription',
                    hint: 'Still open upstream. The source page reserves this for printed and handwritten samples shown as scan-vs-output pairs, plus two named additions: handwritten Indic mathematics emitted as LaTeX (in a script other than Devanagari), and a hand-ruled table recovered as HTML. Until those exist, the live demo below is the honest substitute.',
                },
            ],
            links: [
                { label: '▶ Run a page through the model', href: '/developers/indic-doc-parser' },
            ],
        },

        // ── 5. Under the hood + training data ────────────────────────────
        {
            id: 'under-the-hood',
            title: 'Under the Hood',
            content: [
                'IndicOCR reads a document page and returns its text in reading order. It is a '
                + 'modular, **two-stage** parser: one model finds and orders the blocks, a second '
                + 'reads them. The two stages exchange JSON, so either can be swapped out without '
                + 'touching the other.',
            ],
            bullets: [
                'IndicDocLayout (33M) detects the blocks on the page and orders them',
                'IndicBlockOCR (0.8B) transcribes the textual blocks',
            ],
            subsections: [
                {
                    title: 'IndicDocLayout · 33M',
                    content:
                        '**IndicDocLayout** is a finetuned version of PP-DocLayoutV3/RT-DocLayout, '
                        + 'which is built on top of RT-DETR to predict bounding boxes and reading '
                        + 'order at the same time. It is trained with a 37-class taxonomy designed for '
                        + 'education-domain documents, and predicts a labelled bounding box for each '
                        + 'element on the page.',
                    paragraphs: [
                        `The 37 labels: ${LAYOUT_TAXONOMY.join(', ')}.`,
                        'The granularity is the point. A system that returns *text* where this one '
                        + 'returns *MCQ*, *Solved-example* or *Table-caption* has thrown away the '
                        + 'structure a downstream pipeline needs.',
                    ],
                },
                {
                    title: 'IndicBlockOCR · 0.8B',
                    content:
                        '**IndicBlockOCR** is based on Qwen3.5-0.8B, chosen for OCR performance at a '
                        + 'sub-1B scale. It is trained with the **Sarvam-30B tokenizer**, whose '
                        + 'vocabulary covers high-resource as well as low-resource Indic languages — '
                        + 'which is what lets one sub-1B model hold 22 scheduled languages and English '
                        + 'at once instead of degrading into byte-level fallback on the rarer scripts.',
                },
                {
                    title: 'Training data',
                    content:
                        'IndicOCR’s performance comes from a curated data mixture spanning diverse '
                        + 'domains, chosen so the model generalises across languages, layouts and '
                        + 'document types. In total it was trained on **more than 15 million pages.**',
                    bullets: [
                        'Real-world document collection across government documents, novels, textbooks, magazines and research papers.',
                        'Public datasets, including [IndicDLP](https://huggingface.co/datasets/ai4bharat/indicdlp) and the [Library of Congress transcripts](https://huggingface.co/datasets/allenai/olmOCR-mix-1025/viewer/02_loc_transcripts).',
                        'An internal handwriting collection drive, with participants submitting pages across a range of domains, scripts and demographics.',
                        'A synthetic document generator covering all 13 scripts, producing annotated image–text pairs with precise bounding boxes and paragraph-level transcriptions.',
                        'A separate pipeline for complex, long tables with dense numeric content in English and Indic languages, modelled on the financial tables found in SEC filings.',
                    ],
                    slots: [
                        {
                            kind: 'chart',
                            label: 'Corpus composition',
                            hint: 'The 15M+ pages have not been published as a per-source split. Add the breakdown to indic-ocr/evals.js and reference a composition chart here once it is signed off.',
                        },
                    ],
                },
            ],
        },

        // ── 6. Public benchmarks ─────────────────────────────────────────
        {
            id: 'public-benchmarks',
            title: 'Public Benchmarks',
            tocTitle: 'Public benchmarks',
            content: [
                '**OmniDocBench** is a widely-used benchmark for testing the layout parsing and OCR '
                + 'capabilities of VLMs, featuring documents from various domains — financial '
                + 'reports, academic papers, handwritten notes, newspapers. Since the full set '
                + 'contains Chinese documents, we evaluate on the official English-only subset of '
                + '610 pages.',
                'IndicOCR places third overall at **92.76**, behind PaddleOCRVL-1.6 and Chandra OCR '
                + '2 and ahead of GPT-5.6-sol and Gemini 3.1 Pro. Chandra is a 4B model and Gemma-4 '
                + 'is 31B; this is a 0.8B reader, and its formula score of 97.53 is beaten only by '
                + 'PaddleOCRVL-1.6 and Sarvam Vision.',
            ],
            charts: ['ocr-omnidoc-overall'],
            table: {
                headers: ['System', ...OMNIDOC_COLUMNS],
                rows: OMNIDOC.map(({ system, values }) => [
                    system,
                    ...values.map(omnidocCell),
                ]),
            },
            tableProps: {
                eyebrow: 'Public benchmark',
                title: 'OmniDocBench v1.6, all metrics',
                description:
                    'The English-only subset, 610 pages. Overall, FormulaCDM and the two TableTEDS '
                    + 'columns are higher-is-better; TextEdit and ReadOrderEdit are edit distances, '
                    + 'so lower is better.',
                caption:
                    'OmniDocBench v1.6, official English-only subset. Rows ordered by overall score.',
            },
            subsections: [
                {
                    title: 'olmOCR-Bench',
                    content:
                        '**olmOCR-Bench** evaluates document-level OCR by running binary unit tests '
                        + 'over the output, which makes the evaluation deterministic rather than a '
                        + 'similarity judgement. We report on the English subset of 1,258 document '
                        + 'images.',
                    paragraphs: [
                        'IndicOCR scores **82.2** overall, fourth of nine and within four points of '
                        + 'the leader. The per-category matrix is where it gets interesting: second '
                        + 'of nine on table tests, third on old scans and on long tiny text, and '
                        + 'eighth on multi-column pages — the same weakness the limitations section '
                        + 'owns up to below.',
                    ],
                    charts: ['ocr-olmocr-overall', 'ocr-olmocr-categories'],
                },
            ],
        },

        // ── 7. Benchmarks for Indian languages ───────────────────────────
        {
            id: 'indic-benchmarks',
            title: 'Benchmarks for Indian Languages',
            tocTitle: 'Indic benchmarks',
            content: [
                'The primary hurdle in developing OCR models for Indic languages is the dearth of '
                + 'high-quality, diverse benchmarks across all 22 Indian languages and English. '
                + 'There is a second problem underneath it: layout complexity and text recognition '
                + 'get entangled in OCR evaluation, so a model can be penalised for reading text '
                + 'correctly in the wrong order.',
                'We built two internal benchmarks that separate the two, evaluating recognition at '
                + 'the **block level**. *IndicOCR-PRINTED* covers 22,043 images balanced across '
                + 'languages; *IndicOCR-HW* is its handwritten equivalent, 10,544 images across '
                + 'twelve Indic languages and English. Every image has passed through a '
                + 'maker–checker workflow with the native-language expert teams at AI4Bharat and '
                + 'Bodhan AI. We report word-level accuracy, computed as 100 × (1 − WER).',
            ],
            charts: ['ocr-printed-overall'],
            subsections: [
                {
                    title: 'Printed pages, language by language',
                    content:
                        'On the overall average IndicOCR sits second, four-tenths of a point behind '
                        + 'Sarvam Vision. The average is the least interesting number in the table.',
                    paragraphs: [
                        'Read down the Manipuri and Santali rows instead. Gemini 3.1 Pro returns '
                        + '0.8 and 0.2; Surya, Gemma and Chandra return essentially nothing. Those '
                        + 'are not bad transcriptions, they are scripts the models have never been '
                        + 'taught. IndicOCR reads them at **83.8** and **74.7**. Kashmiri, in '
                        + 'Perso-Arabic, is the same story with less distance: **52.2** against '
                        + '43.3 for the next best.',
                        'Where the field is already strong, so is IndicOCR — English at 97.0, Hindi '
                        + 'at 96.0, each within a point of the leader, and Konkani ahead of every '
                        + 'other system. It trails by seven to nine points on Sanskrit and Odia, and '
                        + 'by three to five on Bodo, Dogri, Maithili and Tamil.',
                    ],
                    charts: ['ocr-printed-languages'],
                },
                {
                    title: 'Handwriting',
                    content:
                        'Handwriting is the harder half, and here the ranking is honest about where '
                        + 'a 0.8B model stands: Gemini 3.1 Pro leads at **72.0**, IndicOCR follows '
                        + 'at **66.7**.',
                    paragraphs: [
                        'The distance to the rest of the field is the number worth reading. Sarvam '
                        + 'Vision manages 55.4, and Gemma-4-31B — nearly forty times the size — '
                        + 'manages 33.9, barely half. IndicOCR leads outright on Odia, and comes '
                        + 'within a few points of Gemini on Bengali, Punjabi, Kannada and Tamil. '
                        + 'Telugu and Urdu are the '
                        + 'weakest rows and the clearest place to put the next round of data.',
                    ],
                    charts: ['ocr-hw-overall', 'ocr-hw-languages'],
                },
            ],
        },

        // ── 8. Throughput ────────────────────────────────────────────────
        {
            id: 'throughput',
            title: 'Throughput',
            content: [
                'We benchmarked the end-to-end pipeline with vLLM on a single **NVIDIA H100 80GB** '
                + 'using a diverse mix of documents — maths, tables, handwritten notes, research '
                + 'papers, multi-column pages and complex newspaper layouts — from the OmniDocBench '
                + 'v1.6 English subset.',
                'Throughput saturates at 64 concurrent requests, at **6.26 pages per second**. '
                + 'Beyond that the pages-per-second curve is flat while latency keeps climbing, so '
                + '64 is the operating point rather than the ceiling of the hardware.',
            ],
            charts: ['ocr-throughput'],
            table: {
                headers: ['Concurrency', 'Pages / s', 'Output tokens / s', 'Median page', 'p95 page'],
                rows: THROUGHPUT.map((row) => [
                    String(row.concurrency),
                    row.pagesPerSecond.toFixed(2),
                    row.outputTokensPerSecond.toLocaleString('en-US'),
                    `${(row.medianMs / 1000).toFixed(1)} s`,
                    `${(row.p95Ms / 1000).toFixed(1)} s`,
                ]),
            },
            tableProps: {
                eyebrow: 'Serving',
                title: 'End-to-end throughput and latency',
                description:
                    'vLLM on one NVIDIA H100 80GB, OmniDocBench v1.6 English subset. Latencies are '
                    + 'per page, end to end.',
                caption:
                    'Throughput and latency by concurrency level on a single H100 80GB with vLLM.',
            },
        },

        // ── 9. Limitations and future work ───────────────────────────────
        {
            id: 'limitations',
            title: 'Limitations and Future Work',
            tocTitle: 'Limitations',
            content: [
                'Two things are not solved, and both show up in the numbers above rather than only '
                + 'in use.',
            ],
            subsectionLayout: 'cards',
            subsections: [
                {
                    title: 'Reading order',
                    content:
                        'Complex, multi-column layouts remain a challenge. Multi-column is where we '
                        + 'place lowest in the olmOCR matrix, eighth of nine, and our OmniDocBench '
                        + 'ReadOrderEdit of 0.11 is beaten by five of the other eight systems.',
                },
                {
                    title: 'Handwriting quality',
                    content:
                        'Recognition is still being improved, particularly across different writing '
                        + 'styles and writing characteristics. Telugu and Urdu are the two rows we '
                        + 'would fix first.',
                },
                {
                    title: 'Handwriting coverage',
                    content:
                        'Twelve Indic languages and English have handwriting support today. We are '
                        + 'extending it to the remaining scheduled languages.',
                },
            ],
        },

        // ── 10. Deployment / ecosystem ───────────────────────────────────
        {
            id: 'ecosystem',
            title: 'Where You Can Use It',
            tocTitle: 'Get started',
            content: [
                'The weights are open. Run a page through the hosted demo first if you just want to '
                + 'see the output shape, then pull the model when you are ready to serve it '
                + 'yourself.',
            ],
            code: [
                'pip install vllm',
                'vllm serve bodhan-ai/indic-doc-parser',
            ],
            citation: {
                heading: 'Cite this work',
                bibtex: `@misc{indic-ocr-2026,
  title  = {IndicOCR: Document Parsing for English and 22 Indian Languages},
  author = {Bodhan.AI and AI4Bharat},
  year   = {2026},
  url    = {https://huggingface.co/bodhan-ai/indic-doc-parser}
}`,
            },
            ecosystem: {
                title: 'Available across India’s AI ecosystem',
                description:
                    'Released under the Bodhan Open License 1.0. The base models — PP-DocLayoutV3, '
                    + 'Qwen3.5 and the Sarvam-30B tokenizer — carry their own licence terms, so '
                    + 'check that your use complies with both.',
                platforms: [
                    {
                        name: 'Hugging Face',
                        href: 'https://huggingface.co/bodhan-ai/indic-doc-parser',
                        note: 'Weights and inference',
                    },
                    { name: 'Live demo', href: '/developers/indic-doc-parser', note: 'Parse a page in the browser' },
                    { name: 'GitHub', note: 'Code and recipes — coming soon' },
                    { name: 'AI4Bharat', href: 'https://ai4bharat.iitm.ac.in', note: 'Joint release partner' },
                ],
            },
            links: [{ label: 'Contact', href: '/contact' }],
        },
    ],
};

export default indicOcrPost;
