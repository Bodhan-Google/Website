/**
 * The Indic-Translate post.
 *
 * Written by the translation team and carried over here unchanged in substance;
 * only the shape was adapted to the eight-section structure the rest of
 * posts.js follows.
 *
 * Two keys are specific to this post and handled by BlogContent's widget
 * registry rather than by the generic renderers:
 *
 *   section.component  names a widget that owns everything below the intro
 *                      ('coverage', 'tryIt', 'specimens', 'results')
 *   section.tiles      the four evaluation categories the results hub switches
 *                      between, each with its own copy and chart list
 *
 * Dispatching on an explicit key rather than on a matched heading string means
 * an editor can reword a heading without silently losing the widget under it.
 */

export const indicTranslatePost = {
    // ── 1. Hero ──────────────────────────────────────────────────────────
    slug: 'indic-translate',
    title: 'Indic-Translate: Document-Level Translation for 22 Indian Languages',
    category: 'Release',
    date: '2026-09-05',
    summary:
        'A 4B-parameter translation model covering English and all 22 Eighth Schedule '
        + 'languages in both directions — built to translate whole documents in a single '
        + 'request, in native script, Roman script, or a mix of the two.',
    featured: true,
    posterMotif: 'script',
    tagline:
        'One model, 22 languages, 12 scripts — a sentence or a 32K-token document, in a single request.',
    heroSummary:
        'A translation model for English and 22 Indian languages, built to translate whole '
        + 'documents, not just sentences, in a single request, preserving the structure around '
        + 'the words.',
    heroLinks: [
        { label: '🤗 Hugging Face', href: 'https://huggingface.co/bodhan-ai/indic-translate' },
        { label: '▶ Try the model', href: '/developers/indic-translate' },
        { label: '◉ GitHub', href: '#' },
        { label: '📖 Documentation', href: '#' },
    ],
    specs: [
        { label: 'Base model', value: 'Gemma 4 E4B' },
        { label: 'Parameters', value: '4B effective' },
        { label: 'Training', value: '~28.7B tokens' },
        { label: 'Languages', value: '22 / 12 scripts' },
        { label: 'Context', value: '32K tokens' },
        { label: 'Capabilities', value: 'Sentence · Doc · Roman' },
    ],

    sections: [
        // ── 2. Motivation, opened without a heading ──────────────────────
        {
            id: 'motivation',
            title: 'Introduction',
            tocTitle: 'Introduction',
            hideHeading: true,
            // The one piece of copy on this page still pending a final editorial
            // pass. Delete this flag when the wording is signed off.
            draftNote: 'Pending a final editorial pass; not the published wording.',
            content: [
                'Building translation systems for India means going beyond language coverage. It '
                + 'means supporting the many ways people communicate across languages, scripts, and '
                + 'formats, while preserving the structure and context of the original content.',
                'India does not have a single language. **Twenty-two languages** are included in the '
                + 'Eighth Schedule of the Indian Constitution, written across *twelve different '
                + 'scripts*, and multilingual communication is woven into everyday life. A government '
                + 'form may be in Hindi, a message may blend English with another language, a textbook '
                + 'may be in Kannada, while a person’s name may exist primarily in the Latin '
                + 'script. Indian languages are also frequently written in Roman script, reflecting '
                + 'how many people actually type.',
                'Translation systems, however, are still largely built around a single sentence. Give '
                + 'them a real document with headings, a table, a code block, or a footnote, and the '
                + 'structure often does not survive the trip. Ask for an Indian language in Latin '
                + 'script, or for text that mixes scripts and languages, and support becomes even '
                + 'more limited.',
                '**Indic-Translate** was built to address these gaps. One model covers English and all '
                + 'twenty-two languages in both directions, handling a sentence or a 32K-token '
                + 'document in a single request, in native script or Roman script, as well as '
                + 'mixed-script text. At 4B effective parameters, it is small enough to actually '
                + 'serve, and designed for people putting translation into something real: a document '
                + 'pipeline, a support desk, a classroom.',
                'The single model can translate source text, whether a sentence or a full document, '
                + 'across five different capabilities, using a consistent prompt structure.',
            ],
        },

        // ── 3. Linguistic coverage ───────────────────────────────────────
        {
            id: 'coverage',
            title: 'Linguistic Coverage',
            component: 'coverage',
            content: [
                'Every language in the Eighth Schedule, in its own script. Select a language '
                + 'in the constellation below to read one of its translations.',
            ],
        },

        // ── 4. The five capabilities, stated and then demonstrated ───────
        {
            id: 'capabilities',
            title: 'Key Capabilities',
            tocTitle: 'Capabilities',
            component: 'tryIt',
            content: [
                'One model, one prompt shape. The cards below say what each capability does; '
                + 'under them, pick a language and a capability and watch the model work on real '
                + 'recorded output.',
            ],
            subsections: [
                {
                    tag: '44 directions',
                    title: 'Sentence translation',
                    mode: 'sentence',
                    content: 'English ↔ 22 Indian languages, both directions, evaluated on IN22-Gen.',
                },
                {
                    tag: 'up to 32K tokens',
                    title: 'Document translation',
                    mode: 'document',
                    content:
                        'A whole document in one request, with headings, lists, tables, LaTeX and code '
                        + 'fences keeping their structure across the translation.',
                },
                {
                    tag: 'en → Roman',
                    title: 'Romanized translation',
                    mode: 'romanized',
                    content:
                        'Translates English straight into Latin-script Indic text, for users who don’t '
                        + 'type in their own script.',
                },
                {
                    tag: 'native ↔ Roman',
                    title: 'Transliteration',
                    mode: 'translit',
                    content:
                        'Converts between a language’s native script and its Roman rendering, both '
                        + 'directions, without changing the words.',
                },
                {
                    tag: 'code-mix ↔ en',
                    title: 'Code-mixed translation',
                    mode: 'codemix',
                    content:
                        'Handles text that mixes English and an Indic language in the same sentence, the '
                        + 'way people actually type.',
                },
                {
                    tag: 'zero-shot',
                    title: 'Indic → Indic',
                    mode: 'indic',
                    content:
                        'One Indian language straight into another, on pairs the model was never '
                        + 'trained on as pairs.',
                },
            ],
        },

        // ── 5. The specimen sheet ────────────────────────────────────────
        {
            id: 'specimens',
            title: 'One Language, Every Capability',
            tocTitle: 'Specimen sheet',
            component: 'specimens',
            content: [
                'The demo above shows one capability at a time. This is the other view: pick a '
                + 'single language and read everything the model produced for it side by side, '
                + 'including the full document pair with its structure intact.',
            ],
        },

        // ── 6. Architecture and training data ────────────────────────────
        {
            id: 'under-the-hood',
            title: 'Under the Hood',
            content: [
                'Indic-Translate is a translation-specialised fine-tune of the `Gemma 4 E4B IT` model, '
                + 'focused on a simple task: given an instruction and a piece of source text, produce '
                + 'the translation and nothing else.',
                'The same model is trained to handle sentence translation, document translation, '
                + 'Romanized text, transliteration, and code-mixed input.',
            ],
            subsections: [
                {
                    title: 'Training data',
                    content:
                        'Roughly **28.7 billion tokens**, from several sources. The largest part is '
                        + 'parallel translation data: cleaned and mined bitext, plus a broad '
                        + 'sentence-translation corpus covering news, conversational, idiomatic, and '
                        + 'encyclopedic text. Sentence pairs and long documents make up the large majority '
                        + 'of the mix; romanization, transliteration and code-mixed data were added to '
                        + 'reach the newer capabilities without touching the core translation share.',
                    paragraphs: [
                        'For longer inputs, we built a dedicated document corpus focused on preserving the '
                        + 'structure of the original document. It includes LaTeX, Markdown, tables, and '
                        + 'code, across scientific, technical, and encyclopedic documents. Translation data '
                        + 'makes up the majority of the training mix by design.',
                        'We also built a dedicated Romanization and transliteration corpus from scratch. It '
                        + 'contains **1.85 million** generation requests, created from a stratified sample of '
                        + 'the translation data and then filtered extensively for quality.',
                        'Finally, a smaller code-mixed corpus was created in a similar way. It contains '
                        + 'examples where English and an Indic language are mixed within the same sentence, '
                        + 'reflecting how people commonly type when they switch between languages or do not '
                        + 'use an Indic keyboard.',
                    ],
                },
                {
                    title: 'Training process',
                    content:
                        'Quality control was an important part of the training process, not just the amount '
                        + 'of data. We filter data to maintain high quality across datasets.',
                    paragraphs: [
                        'We also use *temperature-based sampling* for the sentence-translation data to keep '
                        + 'the training mix balanced, so that high-resource language pairs do not dominate '
                        + 'the training process.',
                    ],
                },
            ],
        },

        // ── 7. Evaluation ────────────────────────────────────────────────
        {
            id: 'evaluation',
            title: 'Evaluation',
            component: 'results',
            content: [
                'Full evaluation detail behind the examples above, one category at a time.',
            ],
            tiles: [
                {
                    id: 'document',
                    label: 'Document',
                    sub: 'dBLEU · dchrF++ · LLM judge',
                    heading: 'Document translation',
                    content: [
                        'The model is trained with a 32K context window, allowing it to translate a wide '
                        + 'variety of documents between English and all 22 Indian languages. It can handle '
                        + 'complex documents such as LaTeX files, code files, and web pages in a single turn.',
                        'We evaluate the model on an in-house test dataset spanning a diverse set of '
                        + 'document types and writing styles. On this evaluation, the model outperforms '
                        + 'Sarvam Translate and IndicTrans2 on both metrics across all 22 languages, rather '
                        + 'than only leading on the average score.',
                    ],
                    charts: ['doc-dbleu', 'doc-dchrf', 'doc-judge-mean', 'doc-judge-dims'],
                    humanEval: {
                        heading: 'Human evaluation',
                        previousModel: true,
                        note:
                            'Measured on an earlier checkpoint (pre-romanization) by human annotators, not '
                            + 'an LLM judge. Human evaluation for the current release is in progress.',
                        charts: ['doc-human-mean', 'doc-human-dims', 'doc-human-verdict'],
                        collapsedCharts: ['doc-human-by-lang', 'doc-human-by-cat'],
                    },
                },
                {
                    id: 'sentence',
                    label: 'Sentence',
                    sub: 'IN22-Gen · chrF++',
                    heading: 'Sentence translation',
                    content: [
                        'Leading on documents didn’t come at the cost of sentences. Evaluated on '
                        + '**IN22-Gen**, all 22 languages, 1,024 test sentences per direction, greedy '
                        + 'decoding, chrF++, full pass, no sampling. Every system we could run under the '
                        + 'same harness is shown below, macro and per language.',
                    ],
                    charts: ['sent-rank-en2xx', 'sent-rank-xx2en'],
                    collapsedCharts: ['sent-heat-en2xx', 'sent-heat-xx2en'],
                    humanEval: {
                        heading: 'Human evaluation',
                        previousModel: true,
                        note:
                            'Measured on an earlier checkpoint (pre-romanization). Human evaluation for the '
                            + 'current release is in progress.',
                        charts: ['sent-human-verdict', 'sent-human-netwins'],
                    },
                },
                {
                    id: 'roman',
                    label: 'Romanized',
                    sub: 'chrF++ by direction',
                    heading: 'Romanized translation',
                    content: [
                        'The model supports translation not only into native Indic scripts, but also into '
                        + 'their Romanized forms. It can translate both to and from Romanized Indic text, '
                        + 'in addition to the native scripts.',
                        'This is a distinct capability of the model, allowing users to work with Indic '
                        + 'languages even when they prefer to read or write them using the Latin script.',
                    ],
                    subViews: [
                        {
                            id: 'sentence',
                            label: 'Sentence',
                            charts: ['roman-sentence'],
                            note:
                                'LLM-judge evaluation of romanized and code-mixed output is currently running. '
                                + 'Results will be added when it completes.',
                        },
                        { id: 'document', label: 'Document', charts: ['roman-document'] },
                    ],
                },
                {
                    id: 'translit',
                    label: 'Transliteration',
                    sub: 'CER · WER · chrF++',
                    heading: 'Transliteration',
                    content: [
                        'The model can also transliterate between an Indic language’s native script and '
                        + 'its Roman representation, while preserving the words themselves rather than '
                        + 'translating their meaning.',
                        'This makes it useful for cases where someone wants to type an Indic language '
                        + 'using a Latin keyboard, or read Indic text in Roman script.',
                    ],
                    charts: ['translit-cer', 'translit-wer', 'translit-chrf'],
                },
            ],
        },

        // ── 8. Future work and where to get it ───────────────────────────
        {
            id: 'future-work',
            title: 'Future Work',
            content: [
                'Five things we know the model does not do well enough yet, and are working on.',
            ],
            bullets: [
                '**Closing the gap for lower-resource languages.** Kashmiri, Sanskrit, Santali, Sindhi '
                + 'and Manipuri trail the widely-resourced languages in both directions today; '
                + 'narrowing that gap is a priority.',
                '**Bringing English → Indic up to the same level as the reverse.** Translation into '
                + 'English is currently stronger than out of it; closing that gap is ongoing work.',
                '**Full translation coverage inside mixed documents.** Surrounding prose translates '
                + 'cleanly, but fragments inside code, such as docstrings, inline comments and short '
                + 'string literals, sometimes stay in English; extending coverage to these fragments '
                + 'is next.',
                '**Consistent digit rendering across scripts.** Targets currently mix native-script and '
                + 'Latin digits, and Kannada produces both; standardizing this is planned.',
                '**Expanding beyond single-shot translation.** Today the model does one job: one '
                + 'instruction, one piece of source text, one translation back. Broader task support is '
                + 'a direction we’re exploring.',
            ],
            citation: {
                heading: 'Cite this work',
                bibtex: `@misc{indic-translate-2026,
  title  = {Indic-Translate: Document-Level Machine Translation for 22 Indian Languages},
  author = {Bodhan.ai},
  year   = {2026},
  url    = {https://huggingface.co/bodhan-ai/indic-translate}
}`,
            },
            ecosystem: {
                title: 'Available across India’s AI ecosystem',
                description:
                    'The weights are open. These are the places you can reach the model without '
                    + 'standing one up yourself.',
                platforms: [
                    { name: 'Bhashini', mark: 'bhashini', note: 'Coming soon' },
                    { name: 'AIKosh', mark: 'aikosh', href: 'https://aikosh.indiaai.gov.in/web/models/details/indic_translate.html', note: 'India AI model repository' },
                    { name: 'Bodhan', mark: 'bodhan', href: '/developers/indic-translate', note: 'Live demo' },
                    {
                        name: 'Hugging Face',
                        mark: 'huggingface',
                        href: 'https://huggingface.co/bodhan-ai/indic-translate',
                        note: 'Weights + model card',
                    },
                ],
            },
            links: [
                { label: 'Try the model', href: '/developers/indic-translate' },
                { label: 'Hugging Face', href: 'https://huggingface.co/bodhan-ai/indic-translate' },
            ],
        },
    ],
};

export default indicTranslatePost;
