// Each model's blog button goes to that model's own post on this site. These
// are the `slug` values in src/features/research/data/, served by the
// /research/:slug route — the Cloudflare quick tunnels these replaced are gone.
const BLOGS = {
    transcribe: '/research/bodhan-asr',
    speak: '/research/indic-speak',
    ocr: '/research/indic-ocr',
    translate: '/research/indic-translate',
};

// One palette for the whole developer section: the site's primary warm
// gradient. Each model used to carry a colour of its own — emerald, blue,
// orange, violet — which read as four separate products rather than one
// family. Spread into every model, so `model.accent` / `model.gradient` /
// `model.viz` still resolve everywhere they are read.
//
// `viz` is the plain-hex pair, because an SVG gradient stop cannot take a CSS
// gradient or a var().
const PRIMARY = {
    accent: 'var(--text-orange-500)',
    gradient: 'linear-gradient(135deg, #E2691F 0%, #C2410C 52%, #A6410A 100%)',
    viz: { from: '#E2691F', to: '#B45309' },
};

/** Every model in the family is released under the same licence. */
export const LICENSE = 'Indic Open Model License v1.0';

// The two checkpoints Indic-Transcribe ships in, and the one it does not ship
// yet. They diverge only in post-training, which is why the parameter count and
// the language coverage are the same for both and only the output modes differ.
//
// A variant may carry its own `specs`; where it does not, the model's own specs
// are shown. `soon` marks a checkpoint that is announced but not yet shipped —
// its tab is present and labelled, but not selectable.
const TRANSCRIBE_VARIANTS = [
    {
        id: 'flex',
        label: 'Flex',
        summary:
            'All three output modes — native script, mixed script, and fully romanized — for about 1.6 OIWER on native-script accuracy.',
        specs: [
            { label: 'Languages', value: '27' },
            { label: 'Parameters', value: '1.2B' },
            { label: 'Output modes', value: '3' },
        ],
    },
    {
        id: 'core',
        label: 'Core',
        summary:
            "Transcribes into each language's own script, and it is the more accurate of the two. It will also identify the language for you when you do not pass one.",
        specs: [
            { label: 'Languages', value: '27' },
            { label: 'Parameters', value: '1.2B' },
            { label: 'Output mode', value: 'Native script' },
        ],
    },
];

export const models = [
    {
        id: 'indic-transcribe',
        name: 'Indic-Transcribe',
        codename: 'Speech to Text',
        icon: 'mic',
        glyph: 'wave',
        ...PRIMARY,
        tagline: 'Speech recognition for 27 Indian languages',
        summary:
            "27 languages, their dialects and accents, in the script each one is actually written in — with English mixed in mid-sentence, over classroom noise and phone lines.",
        specs: [
            { label: 'Languages', value: '27' },
            { label: 'Parameters', value: '1.2B' },
            { label: 'Output modes', value: '3' },
        ],
        variants: TRANSCRIBE_VARIANTS,
        blog: { label: 'Read the blog', href: BLOGS.transcribe },
        href: '/developers/indic-transcribe',
    },
    {
        id: 'indic-speak',
        name: 'Indic-Speak',
        codename: 'Text to Speech',
        icon: 'speaker',
        glyph: 'voice',
        ...PRIMARY,
        tagline: 'Text-to-speech for 22 Indian languages, built for the classroom',
        summary:
            'A voice engine that reads STEM content and code-mixed sentences the way a teacher would — with multiple voices per language.',
        specs: [
            { label: 'Languages', value: '22 + English' },
            { label: 'Voices', value: 'Multiple / language' },
            { label: 'Response time', value: '~200 ms' },
        ],
        blog: { label: 'Read the blog', href: BLOGS.speak },
        href: '/developers/indic-speak',
    },
    {
        id: 'indic-ocr',
        name: 'Indic-OCR',
        codename: 'Document Digitisation',
        icon: 'document',
        glyph: 'page',
        ...PRIMARY,
        tagline: 'Document parsing for English and 22 Indian languages',
        summary:
            'Layout detection with reading order, then block-level OCR — for printed and handwritten pages, with math as LaTeX and tables as HTML.',
        specs: [
            { label: 'Languages', value: '22 + English' },
            { label: 'Layout labels', value: '37' },
            { label: 'Parameters', value: '33M + 0.8B' },
        ],
        blog: { label: 'Read the blog', href: BLOGS.ocr },
        href: '/developers/indic-ocr',
    },
    {
        id: 'indic-translate',
        name: 'Indic-Translate',
        codename: 'Translation',
        icon: 'languages',
        glyph: 'bridge',
        ...PRIMARY,
        tagline: 'Document-length translation across 44 language directions',
        summary:
            'Translates between English and all 22 Eighth Schedule languages, preserving Markdown, LaTeX, and table structure — plus romanized and code-mixed text.',
        specs: [
            { label: 'Directions', value: '44' },
            { label: 'Parameters', value: '7.94B' },
            { label: 'Context', value: '32K tokens' },
        ],
        blog: { label: 'Read the blog', href: BLOGS.translate },
        href: '/developers/indic-translate',
    },
];

export function getModelById(id) {
    return models.find((model) => model.id === id);
}
