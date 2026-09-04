import { LANGUAGES, OVERALL, VOICES } from './indic-speak/speakEvals';

/**
 * The Indic-Speak post.
 *
 * Written by the speech team and carried over here unchanged in substance; only
 * the shape was adapted to the section structure the rest of posts.js follows.
 *
 * Three keys are specific to this post and handled by BlogContent's widget
 * registry rather than by the generic renderers:
 *
 *   component: 'hearIt'             the token figure and the long-form chapter
 *   component: 'voiceLibrary'       the voice field, the A/B pair, the table
 *   component: 'speakCapabilities'  the capability cards, clips, tags, normaliser
 *
 * Every figure in this file comes out of data/indic-speak/speakEvals.js, which is
 * generated from the speech team's own review page. Numbers are interpolated
 * rather than typed, so a re-import moves the prose with the evidence.
 */

const VOICE_COUNT = Object.keys(VOICES).length;
const SCRIPTS = new Set(LANGUAGES.map((lang) => lang.script)).size;
const pct = (value) => `${value.toFixed(1)}%`;

export const indicSpeakPost = {
    // ── 1. Hero ──────────────────────────────────────────────────────────
    slug: 'indic-speak',
    title: 'Indic-Speak: The Way India Writes, Spoken Aloud',
    category: 'Release',
    date: '2026-09-04',
    featured: true,
    posterMotif: 'speech',
    tagline:
        `One model, ${LANGUAGES.length} languages, ${VOICE_COUNT} voices — text read exactly as it is `
        + 'written, script switches and all.',
    summary:
        'A 3.36B-parameter text-to-speech model for 22 Indian languages and 12 scripts, built to read '
        + 'code-mixed text with no language tag and no phoneme frontend. Forty-five voices, every one of '
        + 'them able to read every language, measured over 30,000 scored readings.',
    heroSummary:
        'A text-to-speech model built to read text exactly as it is written — the Hindi sentence that '
        + 'keeps *Blue Whale* in Latin script, the Tamil explainer that keeps *alveolar capillaries* in '
        + 'English — across 22 Indian languages, 12 scripts and 45 voices, with no language flag to set '
        + 'and no phoneme dictionary to maintain.',
    heroLinks: [
        { label: '🤗 Hugging Face', href: 'https://huggingface.co/bodhan-ai/models' },
        { label: '▶ Try the model', href: '/developers/indic-speak' },
        { label: '◉ GitHub', href: '#' },
        { label: '📖 Documentation', href: '#' },
    ],
    specs: [
        { label: 'Parameters', value: '3.36B' },
        { label: 'Languages', value: `${LANGUAGES.length} / ${SCRIPTS} scripts` },
        { label: 'Voices', value: `${VOICE_COUNT}` },
        { label: 'Styles', value: '14 tags' },
        { label: 'Per request', value: '~30 s audio' },
        { label: 'Scored readings', value: OVERALL.rows.toLocaleString('en-US') },
    ],

    sections: [
        // ── 2. Motivation, opened without a heading ──────────────────────
        {
            id: 'motivation',
            title: 'Introduction',
            tocTitle: 'Introduction',
            hideHeading: true,
            content: [
                'Think of the last message, lesson or support reply you read in an Indian language. '
                + 'Chances are, it did not stay in one script. A Hindi science lesson keeps *mammal* and '
                + '*Blue Whale* in Latin script inside a Devanagari sentence; a Tamil explainer keeps '
                + '*alveolar capillaries* in English. That is not messy text. It is how millions of us write.',
                'Most speech systems treat that ordinary sentence as an edge case: they want a language '
                + 'flag for every span and a phoneme frontend for every language. **Indic-Speak** needs '
                + 'neither. Give it the sentence as written, choose a voice, and it reads the whole thing. '
                + 'Its 3.36B-parameter stack extends a language model with audio codes, so the same network '
                + 'that models Hindi and English in one token stream can also model how they sound.',
                'At AI4Bharat we have worked on Indian language AI for years, and have open-sourced '
                + 'translation, speech recognition and speech generation across all 22 languages. Speech '
                + 'itself was never the missing piece. Reading *that* sentence was — the one that changes '
                + 'script mid-clause, the way people actually write. That is the gap we set out to close.',
                'Today, as a joint effort between Bodhan AI and AI4Bharat, we are introducing Indic-Speak: '
                + `a text-to-speech model built to read text exactly as it is written, across `
                + `${LANGUAGES.length} Indian languages and ${SCRIPTS} scripts.`,
                `The ${VOICE_COUNT} voices retain where they come from: a Kashmiri voice reading Tamil `
                + 'sounds like a Kashmiri speaker reading Tamil. For some products, that travelling accent '
                + 'is the point; for others, it is the reason to choose one of the recommended native '
                + 'voices. Either way, the identity of the speaker does not disappear when the language '
                + 'changes.',
            ],
        },

        // ── 3. The clip before the argument ──────────────────────────────
        {
            id: 'hear-it',
            title: 'Hear It First',
            tocTitle: 'Hear it first',
            component: 'hearIt',
            content: [
                'Do not take our word for it. Listen first; everything after this section is the evidence '
                + 'behind what you hear.',
                'One request, drawn as it is generated, and five and a half minutes of Tamil narration. '
                + 'Both came out of the deployed model at its default settings.',
            ],
        },

        // ── 4. The voices, and how to choose between them ────────────────
        {
            id: 'voices',
            title: 'Forty-Five Voices, and Which One to Pick',
            tocTitle: 'The voices',
            component: 'voiceLibrary',
            content: [
                'One female and one male voice are recommended per language. Every voice below reads every '
                + 'language, and you can hear any of them: click a point to play it, then hear the same '
                + 'sentence from a native and a non-native voice further down. Ten of the '
                + `${LANGUAGES.length} languages are in the public benchmark, and those carry measured `
                + 'scores.',
            ],
        },

        // ── 5. What it does, each claim carrying its clip ────────────────
        {
            id: 'capabilities',
            title: 'What It Does, With Audio',
            tocTitle: 'Capabilities',
            component: 'speakCapabilities',
            content: [
                'Four capabilities, and under each one the output that shows it. Every clip carries the '
                + 'judge’s top content score, and the text is shown exactly as it was sent.',
            ],
        },

        // ── 6. Evaluation ────────────────────────────────────────────────
        {
            id: 'evaluation',
            title: 'How Well It Reads',
            tocTitle: 'Evaluation',
            content: [
                'Fifteen thousand code-mixed sentences across ten languages, each read twice by different '
                + `voices: ${OVERALL.rows.toLocaleString('en-US')} readings spread over all `
                + `${VOICE_COUNT} voices, mostly cross-lingual casting. Every reading was transcribed by an `
                + 'Indic speech recogniser, then scored by an independent judge model on a 0 to 5 '
                + 'content-fidelity scale that treats script, spelling and number-format differences as '
                + 'correct.',
                'The benchmark doubled as a load test against the production deployment, so accuracy and '
                + 'throughput were measured on the same requests.',
            ],
            stats: [
                {
                    label: 'Native vs cross-lingual',
                    value: `${OVERALL.native.toFixed(2)} vs ${OVERALL.cross.toFixed(2)}`,
                },
                { label: 'Readings scored ≤ 2', value: `${OVERALL.pctLe2.toFixed(2)}%` },
                { label: 'Sustained request starts', value: `${OVERALL.rpm.toLocaleString('en-US')} / min` },
            ],
            charts: ['speak-top-band'],
            subsections: [
                {
                    title: 'Casting, failures, and behaviour under load',
                    content:
                        'Cross-lingual casting costs about three points of the top-band rate '
                        + `(${pct(OVERALL.nativePct5)} against ${pct(OVERALL.crossPct5)}). The rows the judge `
                        + 'scored at or below 2 divide roughly evenly between a repeated phrase, a clause '
                        + 'dropped or cut short, and other content slips.',
                    paragraphs: [
                        `The load test started ${OVERALL.requests.toLocaleString('en-US')} requests in an hour `
                        + `at a first-byte latency of ${OVERALL.ttfbP50Ms} ms median and ${OVERALL.ttfbP95Ms} ms `
                        + `at the 95th percentile, with no server or network errors; ${OVERALL.r429Pct}% of `
                        + 'starts were asked to back off and every one of them succeeded on a retry. Accuracy '
                        + 'did not move with load: the busiest minutes scored 4.902 against 4.887 in the '
                        + 'quietest.',
                    ],
                },
                {
                    title: 'Why not word error rate?',
                    content:
                        'The recogniser writes English words in native script, so *mammal* in a Bengali '
                        + 'sentence comes back as ম্যামাল and counts as an error against the Latin-script '
                        + 'source even when it was spoken cleanly. Across the readings in the judge’s top '
                        + 'band, string word error rate still averages 48.8 and character error rate 52.9: on '
                        + 'code-mixed text those numbers measure the script mismatch, not the speech. We keep '
                        + 'both in the data and let the judge give the verdict.',
                    paragraphs: [
                        'Judge: `Gemma-4-31B-IT` with a content-fidelity rubric. Recogniser: `IndicCanary`. '
                        + 'Reference text is the normalised input, so number expansion is scored as spoken '
                        + 'rather than as written.',
                    ],
                },
                {
                    title: 'Coming soon: preference ranking',
                    content:
                        'Preference ranking tests are ongoing and will land soon. Content fidelity is one '
                        + 'axis; human preference against other Indian-language systems, on naturalness and '
                        + 'voice quality, is in progress and this post will be updated with the results.',
                },
            ],
        },

        // ── 7. Limitations, before a reader finds them ───────────────────
        {
            id: 'limitations',
            title: 'What to Know Before You Use It',
            tocTitle: 'Limitations',
            content: [
                'The demos and results above show where Indic-Speak is strong. These boundaries show where '
                + 'voice choice, a retry or extra handling still matters. Each comes from the same benchmark '
                + 'run as the numbers above.',
            ],
            bullets: [
                '**Voice quality varies.** Across the library the judge mean runs from 4.53 to 4.96. The '
                + 'weakest voice earns the top band on 68% of its readings against 97% for the strongest, and '
                + 'needs a second take on 2.7% of them against 0.3% — about nine times as often. The '
                + 'recommended voice for each language stays out of the thin end of that range, so start '
                + 'there rather than picking at random.',
                '**Native casting remains the most accurate choice.** A voice reading its own language '
                + `scores ${OVERALL.native.toFixed(2)}, with ${pct(OVERALL.nativePct5)} of readings in the top `
                + `band and 0.4% needing a retake. The same voices reading other languages score `
                + `${OVERALL.cross.toFixed(2)}, ${pct(OVERALL.crossPct5)} and ${OVERALL.pctLe2.toFixed(1)}%. `
                + 'Cross-lingual casting still works well; this is the small tradeoff behind the accent you hear.',
                '**Benchmark coverage currently spans ten languages.** The other twelve have voices and '
                + 'playable audio, but not yet the same scored evidence. Treat them as supported and still '
                + 'being measured, rather than assuming they match the benchmarked set.',
                '**The headline measures content fidelity.** Automatic transcription struggles with this '
                + 'code-mixed text: character error rate lands within two points of itself for the voice that '
                + 'scores 4.96 and the voice that scores 4.53, which means it is measuring the recogniser '
                + 'rather than the model. We therefore publish an LLM judge’s fidelity score; its top band '
                + 'means “no meaningful content error”, not “word-perfect”.',
                '**Naturalness testing is still in progress.** Every figure here measures whether the text '
                + 'was read correctly. We are not yet making a comparative claim about listening preference '
                + 'or voice quality; those tests are running and will be published separately.',
                `**Most readings work first time; ${OVERALL.pctLe2.toFixed(1)}% need a retry.** That is 211 of `
                + `${OVERALL.rows.toLocaleString('en-US')}: a repeated phrase, a dropped clause or a number `
                + 'that drifts. The API exposes no seed parameter, so a retry draws a fresh sample rather '
                + 'than reproducing the first one.',
                '**Long passages currently need splitting.** One request covers about thirty seconds of '
                + 'audio. The five-and-a-half-minute chapter above is seven requests, split at punctuation '
                + 'and joined by the caller; single-pass multi-minute generation is on the roadmap.',
            ],
        },

        // ── 8. Future work ───────────────────────────────────────────────
        {
            id: 'future-work',
            title: 'What’s Next',
            content: [
                'This release is a starting point, not a victory lap. These are the gaps we are working on '
                + 'next — the first two are research, the rest are product. We are not attaching dates; each '
                + 'improvement lands here when it holds up to the same evidence as this release.',
            ],
            subsectionLayout: 'cards',
            subsections: [
                {
                    title: 'Thinking TTS',
                    content:
                        'Today the prosody of a reading comes from what you send: the punctuation carries the '
                        + 'breaths and a style tag sets the register. Next the model reasons about the context '
                        + 'before it speaks and decides those for itself — where the emphasis belongs, which '
                        + 'clause to slow down, what register the passage is actually in — so one sentence '
                        + 'reads differently as a news bulletin, as a bedtime story, and as an answer to '
                        + 'someone who sounds worried.',
                },
                {
                    title: 'Preference study',
                    content:
                        'Preference ranking against other Indian-language speech systems, on the code-mixed '
                        + 'text these voices are built for. This is the naturalness evidence the limitations '
                        + 'above say we do not yet have; it is running now and will be published here '
                        + 'whichever way it comes out.',
                },
                {
                    title: 'Smaller model',
                    content:
                        'A smaller, cheaper Indic-Speak: the same voices and the same languages at a fraction '
                        + 'of the cost per second of audio, so speech can sit inside an interactive product or '
                        + 'a modest deployment budget rather than only inside a batch job.',
                },
                {
                    title: 'Expressive voices',
                    content:
                        'Voices built for range rather than neutrality — laughter, hesitation, warmth, '
                        + 'urgency, and the shifts inside a single passage that separate a person talking from '
                        + 'a narrator reading. More voices in each language arrive with them.',
                },
                {
                    title: 'Long form',
                    content:
                        'Single-pass generation of multi-minute passages, so a chapter is one request instead '
                        + 'of a split-and-join by the caller.',
                },
                {
                    title: 'Timestamps',
                    content:
                        'Word-level timestamps in the response, for subtitling, read-along and anything that '
                        + 'has to line text up against audio.',
                },
            ],
        },

        // ── 9. Where to use it ───────────────────────────────────────────
        {
            id: 'ecosystem',
            title: 'Where You Can Use It',
            tocTitle: 'Availability',
            content: [
                'The fastest first result is the hosted demo: pick a voice, paste a sentence in whatever mix '
                + 'of scripts you actually write in, and listen. Weights and recipes follow the same routes '
                + 'as the rest of our models.',
                'India does not speak one language at a time. Its speech technology should not ask people to '
                + 'flatten a sentence, hide an accent or rewrite themselves for the machine. Indic-Speak is '
                + 'our step towards the opposite: meet people in the words they already use, then let those '
                + 'words sound like someone they know.',
            ],
            ecosystem: {
                title: 'Available across India’s AI ecosystem',
                description:
                    'A joint release by Bodhan AI and AI4Bharat — hosted endpoints for a first result, '
                    + 'weights and recipes for a deployment of your own.',
                platforms: [
                    { name: 'Hugging Face', href: 'https://huggingface.co/bodhan-ai/models', note: 'Weights and inference' },
                    { name: 'GitHub', href: '#', note: 'Code and recipes' },
                    { name: 'Bhashini', href: '#', note: 'National language mission' },
                    { name: 'AIKosh', href: '#', note: 'Government AI repository' },
                ],
            },
            links: [
                { label: 'Try the model', href: '/developers/indic-speak' },
                { label: 'Contact', href: '/contact' },
            ],
        },
    ],
};

export default indicSpeakPost;
