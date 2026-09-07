/* ══════════════════════════════════════════════════════════════════════════
   UNIVERSAL MODEL-RELEASE BLOG TEMPLATE
   ══════════════════════════════════════════════════════════════════════════

   Copy this whole object into `posts.js`, change the slug, and replace every
   [SQUARE-BRACKET] placeholder. Delete the blocks you do not need — every key
   is optional except `slug`, `title`, `category`, `date`, and `sections`.

   Preview the unfilled template at /research/template-model-post.

   ── The eight sections, and why they are in this order ───────────────────

   1. HERO              Top-level fields, not a section. Name, one-line
                        positioning, short description, link bubbles, specs.
   2. MOTIVATION        `hideHeading: true`. Opens on the problem, not on a
                        heading. Diversity → gap → what we built → who it's for.
   3. LANGUAGES         The `languages` block. A picker, never a table.
   4. KEY FEATURES      The `features` block. Claim → example → result → why.
   5. UNDER THE HOOD    Architecture and training data as one story.
   6. EVALUATION        Numbers, with the benchmark named.
   7. FUTURE WORK       What is not solved yet.
   8. ECOSYSTEM         The `ecosystem` block. Where it can be used today.

   ── Block reference ──────────────────────────────────────────────────────

   Per section:
     id                 required, kebab-case, becomes the anchor
     title              heading text
     tocTitle           label in the sidebar when it differs from `title`
     hideHeading        render the body without a visible heading
     content            string[] of paragraphs; **bold** and *italic* work
     bullets            string[]
     stats              [{ label, value }]
     languages          [{ region, language, themeKey, audio?, input, output,
                           romanized?, note?, langCode? }]
     features           [{ title, description, matters,
                           variants: [{ label, audio?, input, output,
                                        script?: 'native', themeKey? }] }]
     charts             string[] of chart ids from charts.js
     table              { headers, rows }
     experiment         'wer-playground' | 'streaming-timeline'
     demo               { title, description?, url, height? }
     subsections        nested blocks; add subsectionLayout: 'cards' for a grid
     slots              [{ kind, label, hint }] — reserved, visibly unfilled space
     code               string[] of lines
     ecosystem          { title?, description?, platforms: [{ name, href?, note? }] }
     links              [{ label, href }]

   `slots` is the important one while drafting. Use it to book space for a
   chart, demo, or clip that does not exist yet — a dashed placeholder cannot
   be shipped by accident the way lorem-ipsum prose can.

   `themeKey` picks the region's colour and motif from
   src/features/developers/data/cultureThemes.js. Available keys: assamese,
   bengali, bhili, bhojpuri, bodo, dogri, english, gujarati, hindi, kannada,
   kashmiri, konkani, maithili, malayalam, manipuri, marathi, nepali, odia,
   punjabi, sanskrit, santali, sindhi, tamil, telugu, urdu.

   Audio paths are public-folder URLs, e.g. '/examples/audio/kannada-01.wav'.
   ═══════════════════════════════════════════════════════════════════════ */

export const TEMPLATE_POST = {
    // ── 1. Hero ──────────────────────────────────────────────────────────
    slug: 'template-model-post',
    title: '[Model Name]: [What It Does] for [Who It Serves]',
    category: 'Release', // 'Publication' | 'Release' | 'Milestone'
    date: '2026-01-01',
    hidden: true, // keeps the template out of the public listing
    featured: false,

    // One line of positioning. Not a description — a claim about where this
    // model sits relative to everything else.
    tagline: '[One line: the single thing this model does better than the alternatives.]',

    // Card blurb on /research/blog.
    summary:
        '[Two sentences for the listing card. What the model is, and the one number or capability that makes it worth clicking.]',

    // The dek under the title. Longer than the tagline, shorter than a paragraph.
    heroSummary:
        "[Three or four lines. What you are releasing, its size and scope, what it supports, and what someone can do with it today. Write it as though it's the only sentence a reader will finish.]",

    heroLinks: [
        { label: '🤗 Hugging Face', href: '#' },
        { label: '◉ GitHub', href: '#' },
        { label: '▶ Demo', href: '#' },
        { label: '📖 Documentation', href: '#' },
        { label: 'Paper', href: '#' },
    ],

    // Bubbles under the hero. Use whichever are meaningful; drop the rest.
    specs: [
        { label: 'Languages', value: '[25]' },
        { label: 'Parameters', value: '[1.2B]' },
        { label: 'Modality', value: '[Speech → Text]' },
        { label: 'Licence', value: '[Apache 2.0]' },
        { label: 'Context', value: '[30s]' },
    ],

    sections: [
        // ── 2. Motivation + introduction, no heading ─────────────────────
        {
            id: 'motivation',
            title: 'Introduction',
            tocTitle: 'Introduction',
            hideHeading: true,
            content: [
                '[Open on the scale of the problem. One concrete, checkable fact about Indian linguistic diversity that matters for this model — number of languages, speakers, scripts, or dialects in the domain you are working in.]',
                '[Now the gap. What do existing models actually do when they meet this? Be specific: which languages degrade, by how much, under what conditions. A named failure is more persuasive than a general complaint.]',
                '[Then the pivot. **[Model Name]** was built to close that gap — say in one sentence what design decision follows directly from the problem above.]',
                '[Close on scope and audience. What the model does, what it does not do, and who should be reading the rest of this post.]',
            ],
        },

        // ── 3. Languages across India ────────────────────────────────────
        {
            id: 'languages',
            title: 'Languages Across India',
            content: [
                '[One short paragraph. Say how many languages are supported and how they were chosen. Then let the examples do the work — pick a language below.]',
            ],
            // Aim for six to ten entries. More than that and the rail stops
            // being browsable; fewer and the coverage claim rings hollow.
            languages: [
                {
                    region: 'Karnataka',
                    language: 'Kannada',
                    themeKey: 'kannada',
                    langCode: 'kn',
                    audio: '', // '/examples/audio/kannada-01.wav'
                    input: '[What the speaker actually said, in plain description or romanization]',
                    output: '[Model output in the native script]',
                    romanized: '[Optional: the same output, romanized]',
                },
                {
                    region: 'Tamil Nadu',
                    language: 'Tamil',
                    themeKey: 'tamil',
                    langCode: 'ta',
                    audio: '',
                    input: '[Spoken content]',
                    output: '[Native-script output]',
                },
                {
                    region: 'Maharashtra',
                    language: 'Marathi',
                    themeKey: 'marathi',
                    langCode: 'mr',
                    audio: '',
                    input: '[Spoken content]',
                    output: '[Native-script output]',
                },
                {
                    region: 'West Bengal',
                    language: 'Bengali',
                    themeKey: 'bengali',
                    langCode: 'bn',
                    audio: '',
                    input: '[Spoken content]',
                    output: '[Native-script output]',
                },
                {
                    region: 'Hindi belt',
                    language: 'Hindi',
                    themeKey: 'hindi',
                    langCode: 'hi',
                    audio: '',
                    input: '[Spoken content]',
                    output: '[Native-script output]',
                },
                {
                    region: 'Kerala',
                    language: 'Malayalam',
                    themeKey: 'malayalam',
                    langCode: 'ml',
                    audio: '',
                    input: '[Spoken content]',
                    output: '[Native-script output]',
                },
            ],
            languagesCaption: '[Optional caption: where these clips came from.]',
            slots: [
                {
                    kind: 'interactive',
                    label: 'Full language coverage',
                    hint: 'Optional: a map or searchable list for the languages that did not fit on the rail. Link out to the model card instead if that is simpler.',
                },
            ],
        },

        // ── 4. Key features ──────────────────────────────────────────────
        {
            id: 'key-features',
            title: 'Key Features',
            content: [
                '[One line of framing. Every capability below is shown with a real example rather than asserted.]',
            ],
            // Adapt this list to what the model actually does. Keep the shape:
            // description → switchable examples → "why it matters".
            features: [
                {
                    title: '[Accents]',
                    description:
                        '[What varies across these examples, and what stays the same. Here: one English sentence, several mother tongues.]',
                    variants: [
                        { label: 'Indian English', audio: '', input: '[Sentence]', output: '[Transcription]' },
                        { label: 'American English', audio: '', input: '[Same sentence]', output: '[Transcription]' },
                        { label: 'British English', audio: '', input: '[Same sentence]', output: '[Transcription]' },
                        { label: 'Australian English', audio: '', input: '[Same sentence]', output: '[Transcription]' },
                    ],
                    matters:
                        '[Why a reader should care. Tie it to a real situation — a support line, a classroom, a field survey — not to a benchmark.]',
                },
                {
                    title: '[Dialects]',
                    description:
                        '[Same language, different variety. Name the varieties and where they are spoken.]',
                    variants: [
                        {
                            label: '[Variety A]',
                            audio: '',
                            input: '[Spoken]',
                            output: '[Transcription]',
                            script: 'native',
                            themeKey: 'hindi',
                        },
                        {
                            label: '[Variety B]',
                            audio: '',
                            input: '[Spoken]',
                            output: '[Transcription]',
                            script: 'native',
                            themeKey: 'bhojpuri',
                        },
                    ],
                    matters: '[Why dialect coverage changes who can actually use this.]',
                },
                {
                    title: '[Code-switching]',
                    description:
                        '[How the model handles a sentence that moves between languages mid-utterance, and which output format it produces.]',
                    variants: [
                        {
                            label: 'Native script',
                            audio: '',
                            input: '[Mixed-language utterance]',
                            output: '[Output, everything in native script]',
                            script: 'native',
                            themeKey: 'kannada',
                        },
                        {
                            label: 'Code-mixed',
                            audio: '',
                            input: '[Same utterance]',
                            output: '[Output preserving the switch]',
                            script: 'native',
                            themeKey: 'kannada',
                        },
                        {
                            label: 'Romanized',
                            audio: '',
                            input: '[Same utterance]',
                            output: '[Output, fully romanized]',
                            themeKey: 'kannada',
                        },
                    ],
                    matters: '[Why forcing a single script would lose information here.]',
                },
                {
                    title: '[Noisy and real-world speech]',
                    description:
                        '[The conditions tested. Only list conditions you have clips for.]',
                    variants: [
                        { label: 'Metro platform', audio: '', input: '[Spoken]', output: '[Transcription]' },
                        { label: 'Street', audio: '', input: '[Spoken]', output: '[Transcription]' },
                        { label: 'Phone call', audio: '', input: '[Spoken]', output: '[Transcription]' },
                        { label: 'Crosstalk', audio: '', input: '[Spoken]', output: '[Transcription]' },
                    ],
                    matters: '[Why clean-studio accuracy is not the number that decides deployment.]',
                },
            ],
        },

        // ── 5. Under the hood + training data, combined ──────────────────
        {
            id: 'under-the-hood',
            title: 'Under the Hood',
            content: [
                '[Architecture in one paragraph: family, parameter split, what is standard and what is not.]',
                '[Anything you changed and why. If a technique was chosen to handle something specific to Indian languages, say so here — it is the most interesting sentence in this section.]',
            ],
            bullets: [
                '[Encoder: layers, type, parameters]',
                '[Decoder: layers, type, parameters]',
                '[Vocabulary and tokenizer]',
                '[Context window / chunking]',
                '[Inference modes supported]',
            ],
            slots: [
                {
                    kind: 'image',
                    label: 'Architecture diagram',
                    hint: 'One diagram, readable at mobile width. Label the parts you refer to in the prose above.',
                },
            ],
            subsections: [
                {
                    title: 'Training Data',
                    content:
                        '[The transition sentence: the architecture is only one part of the story — building something that works across this much diversity required a corpus that looks like this. Then: total size, how it splits, and where it came from.]',
                    bullets: [
                        '[Source and hours]',
                        '[Source and hours]',
                        '[Human-labelled hours, and how they were labelled]',
                    ],
                    slots: [
                        {
                            kind: 'chart',
                            label: 'Corpus composition',
                            hint: 'Add the chart id to charts.js, then reference it from `charts: [...]` on this subsection.',
                        },
                    ],
                },
                {
                    title: 'Data Quality and Filtering',
                    content:
                        '[What you threw away and why. Filtering decisions are usually the difference between two models with the same architecture.]',
                },
            ],
        },

        // ── 6. Evaluation ────────────────────────────────────────────────
        {
            id: 'evaluation',
            title: 'Evaluation',
            content: [
                '[Which benchmarks, and what each one is actually measuring. A reader who does not know these benchmarks should still be able to read the table.]',
            ],
            table: {
                headers: ['Benchmark', 'What it measures', '[Metric]'],
                rows: [
                    ['[Benchmark]', '[Conversational speech]', '[00.0]'],
                    ['[Benchmark]', '[Read speech]', '[00.0]'],
                    ['[Benchmark]', '[Dialects]', '[00.0]'],
                    ['[Benchmark]', '[Low-resource languages]', '[00.0]'],
                ],
            },
            tableProps: {
                caption: '[Say which public benchmarks these are and which split you used.]',
            },
            slots: [
                {
                    kind: 'chart',
                    label: 'Comparison against baselines',
                    hint: 'Name the baselines and their versions. A chart without a named baseline is decoration.',
                },
            ],
            subsections: [
                {
                    title: '[Where the model does well]',
                    content: '[The honest version, with the number.]',
                },
                {
                    title: '[Where it does not]',
                    content:
                        '[Say this before a user discovers it. It costs one paragraph and buys the rest of the post its credibility.]',
                },
            ],
        },

        // ── 7. Future work ───────────────────────────────────────────────
        {
            id: 'future-work',
            title: 'Future Work',
            content: [
                '[What is next, and roughly when. Distinguish "in training" from "would like to".]',
            ],
            subsectionLayout: 'cards',
            subsections: [
                { title: '[Coverage]', content: '[Languages or dialects not yet supported.]' },
                { title: '[Quality]', content: '[The failure mode you most want to fix.]' },
                { title: '[Efficiency]', content: '[Size, latency, or cost work planned.]' },
                { title: '[Openness]', content: '[Data, weights, or evaluation you intend to release.]' },
            ],
        },

        // ── 8. Deployment / ecosystem ────────────────────────────────────
        {
            id: 'ecosystem',
            title: 'Where You Can Use It',
            content: [
                '[One or two lines on how to get started, and the fastest path to a first result.]',
            ],
            code: ['pip install [package]', 'from [package] import [Model]'],
            ecosystem: {
                title: "Available across India's AI ecosystem",
                description:
                    '[One line on availability — hosted, self-hosted, or both — and the licence.]',
                platforms: [
                    { name: 'Bhashini', href: '#', note: 'National language mission' },
                    { name: 'AIKosh', href: '#', note: 'Government AI repository' },
                    { name: 'Hugging Face', href: '#', note: 'Weights and inference' },
                    { name: 'GitHub', href: '#', note: 'Code and recipes' },
                ],
            },
            links: [{ label: 'Contact', href: '/contact' }],
        },
    ],
};

export default TEMPLATE_POST;
