import { TEMPLATE_POST } from './postTemplate';
import { indicTranslatePost } from './indicTranslatePost';
import { indicOcrPost } from './indicOcrPost';
import { indicSpeakPost } from './indicSpeakPost';
import { flnDpiWhitepaperPost } from './flnDpiWhitepaperPost';
import { k12PolicyPaperPost } from './k12PolicyPaperPost';

export const researchAreas = [
    {
        title: 'Speech & Audio',
        description:
            'Multilingual ASR, child speech diagnostics, and voice-first interfaces for Indian languages and dialects.',
    },
    {
        title: 'Language & Literacy',
        description:
            'Pedagogy-aligned language models, code-mixed transcription, and foundational literacy tools.',
    },
    {
        title: 'Vision & Assessment',
        description:
            'Handwritten OCR, diagram understanding, and automated assessment for classroom workflows.',
    },
    {
        title: 'Learning Systems',
        description:
            'Adaptive tutoring, evidence generation, and AI systems designed for public education deployment.',
    },
];

/*
 * Every model-release post follows the eight-section structure documented in
 * postTemplate.js. Start from that template rather than from this post.
 */
export const posts = [
    // Newest release first: the listing and the featured card both read this
    // order rather than sorting by date.
    flnDpiWhitepaperPost,
    k12PolicyPaperPost,
    indicOcrPost,
    indicSpeakPost,
    indicTranslatePost,
    {
        // ── 1. Hero ──────────────────────────────────────────────────────
        slug: 'bodhan-asr',
        title: "Bodhan ASR: Accurate Speech Recognition for India's Languages and Dialects",
        category: 'Release',
        date: '2026-06-30',
        summary:
            'Introducing Bodhan Scribe — a 1.2B-parameter multilingual ASR model trained on 1.35M hours of speech, supporting 25 Indian languages with native-script, code-mixed, and romanized transcription.',
        featured: true,
        posterMotif: 'speech',
        tagline:
            'One model for 25 Indian languages — native script, code-mixed, or romanized, streaming or offline.',
        heroSummary:
            "Today we're releasing Bodhan Scribe, a 1.2B-parameter multilingual automatic speech recognition model trained on over 1.35 million hours of speech that supports 25 Indian languages, multiple transcription formats, and production-ready streaming and offline inference.",
        heroLinks: [
            { label: '🤗 Hugging Face', href: 'https://huggingface.co/bodhan-ai/models' },
            { label: '◉ GitHub', href: '#' },
            { label: '▶ Demo', href: 'https://value-candidates-oakland-capitol.trycloudflare.com' },
            { label: '📖 Documentation', href: '#' },
            { label: 'Paper', href: '#' },
            { label: 'Model Card', href: '#' },
        ],
        specs: [
            { label: 'Languages', value: '25' },
            { label: 'Parameters', value: '1.2B' },
            { label: 'Training', value: '1.35M hrs' },
            { label: 'Architecture', value: 'NVIDIA Canary' },
            { label: 'Output', value: 'Native · Mixed · Roman' },
            { label: 'Inference', value: 'Streaming + offline' },
        ],

        sections: [
            // ── 2. Motivation, opened without a heading ──────────────────
            {
                id: 'motivation',
                title: 'Introduction',
                tocTitle: 'Introduction',
                hideHeading: true,
                content: [
                    'India has many languages, and each of them has significant dialectal variation. A speaker in one district and a speaker two hundred kilometres away may share a language on paper and sound very little alike in practice.',
                    'Speech recognition has not kept up with that. Existing ASR systems perform well only on **high-resource languages**; dialects and low-resource languages remain underserved. *Code-mixed speech* — the ordinary way most people in India actually talk — is treated as an edge case rather than the norm. And systems that do work often cannot meet the latency a production deployment needs.',
                    '**Bodhan Scribe** was built to address these gaps in a *single multilingual model* rather than a fleet of per-language ones. It supports 22 constitutional languages alongside Indian English, Bhojpuri, and Bhili, and learns a unified multilingual representation instead of memorising each language separately.',
                    'This post covers what the model supports, how it behaves on the speech patterns people actually produce, how it was built and trained, where it performs well, and where it still does not. It is written for teams deciding whether to build on it.',
                ],
            },

            // ── 3. Languages across India ────────────────────────────────
            {
                id: 'languages',
                title: 'Languages Across India',
                content: [
                    'Bodhan Scribe covers 25 languages in one model. Rather than list them in a table, pick a language below to hear a clip and see what the model returns.',
                ],
                languages: [
                    {
                        region: 'Hindi belt',
                        language: 'Hindi',
                        themeKey: 'hindi',
                        langCode: 'hi',
                        input: 'Kal meeting hai at 5 PM',
                        output: 'कल मीटिंग है एट 5 पीएम',
                        romanized: 'Kal meeting hai at 5 PM',
                        note: 'A Hindi–English utterance, returned here in native script.',
                    },
                    { region: 'Karnataka', language: 'Kannada', themeKey: 'kannada', langCode: 'kn' },
                    { region: 'Tamil Nadu', language: 'Tamil', themeKey: 'tamil', langCode: 'ta' },
                    { region: 'Maharashtra', language: 'Marathi', themeKey: 'marathi', langCode: 'mr' },
                    { region: 'West Bengal', language: 'Bengali', themeKey: 'bengali', langCode: 'bn' },
                    { region: 'Kerala', language: 'Malayalam', themeKey: 'malayalam', langCode: 'ml' },
                    { region: 'Andhra & Telangana', language: 'Telugu', themeKey: 'telugu', langCode: 'te' },
                    { region: 'Bhojpuri region', language: 'Bhojpuri', themeKey: 'bhojpuri', langCode: 'bho' },
                    { region: 'Bhil belt', language: 'Bhili', themeKey: 'bhili', langCode: 'bhb' },
                ],
                bullets: [
                    '22 constitutional languages',
                    'Indian English',
                    'Bhojpuri',
                    'Bhili',
                ],
                slots: [
                    {
                        kind: 'audio',
                        label: 'One clip and transcription per language',
                        hint: 'Drop WAV files into public/examples/audio/, then fill `audio`, `input`, and `output` on each language entry in posts.js.',
                    },
                ],
                subsections: [
                    {
                        // Rendered by OutputModesDemo — see BlogContent.
                        title: 'Three Output Modes',
                    },
                ],
            },

            // ── 4. Key features ──────────────────────────────────────────
            {
                id: 'key-features',
                title: 'Key Features',
                content: [
                    'Each capability below is stated with the example that demonstrates it, rather than as a claim on its own.',
                ],
                features: [
                    {
                        title: 'Code-switching, in three formats',
                        description:
                            'Most Indian speech moves between languages mid-sentence. Bodhan Scribe transcribes the switch instead of forcing the whole utterance into one language, and can return the same audio in three different formats.',
                        variants: [
                            {
                                label: 'Native script',
                                input: 'Kal meeting hai at 5 PM',
                                output: 'कल मीटिंग है एट 5 पीएम',
                                script: 'native',
                                themeKey: 'hindi',
                                audioCaption: 'Hindi–English sample',
                            },
                            {
                                label: 'Code-mixed',
                                input: 'Kal meeting hai at 5 PM',
                                output: 'कल meeting hai at 5 PM',
                                script: 'native',
                                themeKey: 'hindi',
                                audioCaption: 'Hindi–English sample',
                            },
                            {
                                label: 'Romanized',
                                input: 'Kal meeting hai at 5 PM',
                                output: 'Kal meeting hai at 5 PM',
                                themeKey: 'hindi',
                                audioCaption: 'Hindi–English sample',
                            },
                        ],
                        matters:
                            'A search index wants romanized text, a subtitle track wants native script, and a chat log wants the mix as spoken. One transcription pass can serve all three.',
                    },
                    {
                        title: 'Accents across Indian English',
                        description:
                            'Indian English is not one accent. The Svarah benchmark covers 19 mother-tongue accents, and the live demo further down transcribes speakers from across India in a single pass.',
                        matters:
                            'A voice interface that only understands one accent quietly excludes most of the country from using it.',
                    },
                    {
                        title: 'Twenty-five Indian languages in one model',
                        description:
                            'Broad coverage across constitutional languages and underserved dialects, designed for *real-world Indian speech patterns* rather than read-aloud studio corpora.',
                        matters:
                            'One model means one deployment, one latency profile, and no language-detection step in front of it.',
                    },
                    {
                        title: 'Low-resource language support',
                        description:
                            'Bhili receives **dedicated support** despite limited public datasets — a gap that existing ASR systems for India leave open.',
                        matters:
                            'Speakers of low-resource languages are exactly the people least served by existing tools, and most helped by a working one.',
                    },
                    {
                        title: 'Production-ready inference',
                        description:
                            'Built for deployment from day one: offline inference, streaming, TensorRT acceleration, and batched inference.',
                        matters:
                            'A model that is only accurate in a notebook does not reach anyone.',
                    },
                ],
                demo: {
                    title: 'One Model. Every Mother Tongue.',
                    description:
                        "A live tour of speakers from the Svarah benchmark — watch Bodhan ASR transcribe Indian English across 19 accents as each speaker's home region lights up on the map.",
                    url: 'https://value-candidates-oakland-capitol.trycloudflare.com',
                    height: 680,
                },
                slots: [
                    {
                        kind: 'audio',
                        label: 'Dialect and noisy-speech examples',
                        hint: 'Reserved for paired clips: the same content across dialects, and across metro, street, office, and phone-call conditions. Add them as `variants` on the matching feature.',
                    },
                ],
            },

            // ── 5. Under the hood + training data ────────────────────────
            {
                id: 'under-the-hood',
                title: 'Under the Hood',
                content: [
                    'Bodhan Scribe is built on the NVIDIA Canary architecture, split evenly between a 600M-parameter encoder and a 600M-parameter decoder.',
                    'The encoder is a 32-layer Conformer, the decoder a 24-layer Transformer, over a 6K vocabulary sized for multilingual coverage without exploding the output layer.',
                ],
                bullets: [
                    '32-layer Conformer encoder',
                    '24-layer Transformer decoder',
                    '6K vocabulary',
                    'NVIDIA Canary architecture',
                ],
                table: {
                    headers: ['Specification', 'Value'],
                    rows: [
                        ['Languages', '25'],
                        ['Training Hours', '1.35M'],
                        ['Parameters', '1.2B'],
                        ['Architecture', 'NVIDIA Canary'],
                        ['Native Script', '✓'],
                        ['Code Mixed', '✓'],
                        ['Romanized', '✓'],
                        ['Streaming', '✓'],
                        ['Offline', '✓'],
                    ],
                },
                tableVariant: 'architecture',
                subsections: [
                    {
                        title: 'Training Data',
                        content:
                            'The architecture is only one part of the story. Building a model that works across India\'s linguistic diversity required 1.35 million hours of speech — one of the largest multilingual ASR training corpora assembled for Indian languages. Instead of letting the model memorise frequent words, synthetic speech exposes it to far more vocabulary and pronunciation variety than human-labelled data alone could cover.',
                        bullets: [
                            '1.30M hours weak / synthetic',
                            '40K hours zero-shot TTS synthetic',
                            '11K hours human labelled',
                        ],
                        charts: ['training-breakdown'],
                    },
                    {
                        title: 'Inference and Deployment',
                        content:
                            'The same weights serve batch and real-time workloads. Offline inference is a straight audio-to-transcript pass; streaming consumes chunks and emits partial transcripts before assembling the final one; TensorRT and batching are there for throughput.',
                        bullets: [
                            'Offline inference',
                            'Streaming with partial transcripts',
                            'TensorRT acceleration',
                            'Batched inference',
                        ],
                        experiment: 'streaming-timeline',
                    },
                ],
            },

            // ── 6. Evaluation ────────────────────────────────────────────
            {
                id: 'evaluation',
                title: 'Evaluation',
                content: [
                    'We evaluate Bodhan ASR across multiple public benchmarks spanning conversational speech, read speech, low-resource languages, and multilingual scenarios.',
                ],
                table: {
                    headers: ['Benchmark', 'Measures'],
                    rows: [
                        ['Voice of India', 'General multilingual'],
                        ['Svarah', 'Conversation'],
                        ['Lahaja', 'Dialects'],
                        ['Sruti', 'Read speech'],
                        ['LibriSpeech', 'English'],
                    ],
                },
                experiment: 'wer-playground',
                subsections: [
                    {
                        title: 'Voice of India',
                        content:
                            'Evaluated across WER metrics with competitive scores on multilingual Indian speech.',
                        charts: ['overall-wer'],
                    },
                    {
                        title: 'Low Resource Languages',
                        content:
                            'Bhili deserves dedicated evaluation — demonstrating that low-resource languages can achieve practical accuracy with targeted training data.',
                        charts: ['vistaar-cer'],
                    },
                    {
                        title: 'Cross Benchmark Generalization',
                        content:
                            'Strong performance across Svarah, Lahaja, Sruti, and LibriSpeech demonstrates robust generalization.',
                        charts: ['speaker-consistency'],
                    },
                    {
                        title: 'Hard Benchmarks',
                        content:
                            'Evaluation on IndicContextEval, FLEURS, Common Voice, MMS, IndicSUPERB, and OpenASR Leaderboards demonstrates robustness across diverse conditions.',
                    },
                ],
            },

            // ── 7. Future work ───────────────────────────────────────────
            {
                id: 'future-work',
                title: 'Future Work',
                content: [
                    'Transparent limitations build trust and set appropriate expectations, so it is worth being direct about what this release does not yet do well.',
                ],
                subsections: [
                    {
                        title: 'Known limitations today',
                        bullets: [
                            'Extremely noisy environments remain challenging.',
                            'Rare dialects continue to improve with more data.',
                            'Domain-specific vocabulary may require adaptation.',
                            'Long recordings benefit from chunked inference.',
                        ],
                    },
                ],
                slots: [
                    {
                        kind: 'text',
                        label: 'Roadmap',
                        hint: 'Reserved for what is next: additional languages and dialects, noise robustness, smaller distilled variants, and what will be released openly. Separate what is already in training from what is only planned.',
                    },
                ],
            },

            // ── 8. Deployment / ecosystem ────────────────────────────────
            {
                id: 'ecosystem',
                title: 'Where You Can Use It',
                content: [
                    'Reach your first transcription within 30 seconds.',
                    "Bodhan ASR brings multilingual speech recognition to 25 Indian languages, including underserved languages such as Bhili, while supporting native-script, code-mixed, and romanized transcription. With large-scale multilingual training, production-ready inference, and strong performance across public benchmarks, it provides a practical foundation for building speech applications across India's linguistic diversity.",
                ],
                code: ['pip install bodhan', 'from bodhan import Scribe'],
                bullets: [
                    'Streaming inference',
                    'Batch inference',
                    'TensorRT acceleration',
                    'Different output modes',
                    'Language forcing',
                    'Chunking for long audio',
                ],
                ecosystem: {
                    title: "Available across India's AI ecosystem",
                    description:
                        'Weights, code, and hosted endpoints — use whichever route fits your deployment.',
                    platforms: [
                        { name: 'Hugging Face', href: 'https://huggingface.co/bodhan-ai/models', note: 'Weights and inference' },
                        { name: 'GitHub', href: '#', note: 'Code and recipes' },
                        { name: 'Bhashini', href: '#', note: 'National language mission' },
                        { name: 'AIKosh', href: '#', note: 'Government AI repository' },
                    ],
                },
                links: [{ label: 'Contact', href: '/contact' }],
            },
        ],
    },

    // Reference implementation of the structure above. Hidden from the public
    // listing; reachable at /research/template-model-post for authors.
    TEMPLATE_POST,
];

/** Posts shown in the public listing — excludes authoring templates. */
export const visiblePosts = posts.filter((post) => !post.hidden);

export function getPostBySlug(slug) {
    return posts.find((post) => post.slug === slug);
}

// URL conventions: blog posts live under /research/blogs/<slug>, formal
// publications under /research/publication/<slug>. Build links with these so a
// post that changes category never leaves a stale link behind.
export const BLOG_LIST_PATH = '/research/blogs';
export const PUBLICATIONS_LIST_PATH = '/research/publications';
export const BLOG_POST_BASE = '/research/blogs';
export const PUBLICATION_BASE = '/research/publication';

export function postPath(post) {
    return `${post.category === 'Publication' ? PUBLICATION_BASE : BLOG_POST_BASE}/${post.slug}`;
}

export function postPathForSlug(slug) {
    const post = getPostBySlug(slug);
    return post ? postPath(post) : `${BLOG_POST_BASE}/${slug}`;
}

export function getFeaturedPost() {
    return visiblePosts.find((post) => post.featured) ?? visiblePosts[0];
}

export function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
