// Copy, language table and demo configuration for the Indic-Translate page.
//
// Every figure and every translated string on this page comes from the model's
// own technical write-up and its recorded evaluation runs — the outputs live in
// translateExamples.json (402 KB of real predictions across 22 languages, lazy
// loaded so it stays off the page's critical path).

import { postPathForSlug } from '../../../../research/data/posts';

// Point this at an inference endpoint to run visitor-typed text through the real
// model. It should accept `POST { text, source, target, task }` and answer with
// `{ output }`. While it is empty the demo replays recorded output instead, and
// says so on the surface rather than implying live inference.
export const TRANSLATE_API_URL = '';

export const HERO_STATS = [
    { value: 44, suffix: '', label: 'Directions' },
    { value: 22, suffix: ' / 12', label: 'Languages / scripts' },
    { value: 32, suffix: 'k', label: 'Token context' },
    { value: 4, suffix: 'B', label: 'Effective params' },
];

export const HERO_COPY = {
    eyebrow: 'Developers · Translation',
    tagline: 'A document goes in whole. It comes out whole.',
    body:
        'One model covers English and all twenty-two Eighth Schedule languages in both directions — a '
        + 'sentence or a 32k-token document in a single request, in native script or Roman, and the '
        + 'mixed-script text that sits between them. At 4B effective parameters it is small enough to '
        + 'actually serve.',
};

// The five capabilities the single model is trained for, in the order the blog
// states them. `demo` names the mode each card jumps to.
export const CAPABILITIES = [
    {
        id: 'sentence',
        tag: '44 directions',
        title: 'Sentence translation',
        detail: 'English ↔ 22 Indian languages, both directions, evaluated on IN22-Gen.',
        tone: 'saffron',
        demo: 'sentence',
    },
    {
        id: 'document',
        tag: 'up to 32k tokens',
        title: 'Document translation',
        detail:
            'A whole document in one request, with headings, lists, tables, LaTeX and code fences '
            + 'keeping their structure across the translation.',
        tone: 'teal',
        demo: 'document',
    },
    {
        id: 'romanized',
        tag: 'en ↔ Roman',
        title: 'Romanized translation',
        detail: 'Translates English straight into Latin-script Indic text, for people who don’t type in their own script.',
        tone: 'violet',
        demo: 'romanized',
    },
    {
        id: 'translit',
        tag: 'native ↔ Roman',
        title: 'Transliteration',
        detail: 'Converts between a language’s native script and its Roman rendering, both directions, without changing the words.',
        tone: 'magenta',
        demo: 'translit',
    },
    {
        id: 'codemix',
        tag: 'code-mix ↔ en',
        title: 'Code-mixed translation',
        detail: 'Handles text that mixes English and an Indic language in the same sentence, the way people actually type.',
        tone: 'amber',
        demo: 'codemix',
    },
];

export const SPEC_STRIP = [
    { label: 'Base model', value: 'Gemma 4 E4B IT' },
    { label: 'Training tokens', value: '~28.7B' },
    { label: 'Document dchrF++', value: '69.44', note: 'vs 57.96 next best' },
    { label: 'Document dBLEU', value: '58.97', note: 'vs 47.44 next best' },
];

// The demo modes, each with its own signature motion. `hint` is the one line
// under the mode tabs that says what you are about to watch.
export const MODES = [
    {
        id: 'sentence',
        label: 'Sentence',
        title: 'English → {lang}',
        hint: 'Words leave the source line, cross, and land in a different order. Indic clauses run subject–object–verb; English does not.',
    },
    {
        id: 'document',
        label: 'Document',
        title: 'A whole document, one request',
        hint: 'The frame is detected first and then pinned. Only the words inside it change — headings stay headings, tables stay tables.',
    },
    {
        id: 'romanized',
        label: 'Romanized',
        title: 'English → Roman {lang}',
        hint: 'The native line is produced first; the Roman rendering settles out of it, token by token.',
    },
    {
        id: 'translit',
        label: 'Transliteration',
        title: 'Same words, new script',
        hint: 'Character by character, not word by word. Nothing is translated here — watch the error rate land.',
    },
    {
        id: 'codemix',
        label: 'Code-mixed',
        title: 'English + {lang}, one sentence',
        hint: 'The mixed line assembles from two sources at once: English tokens fly in from one rail, Indic tokens from the other.',
    },
    {
        id: 'indic',
        label: 'Indic → Indic',
        title: '{from} → {lang}',
        hint: 'Straight across, with no pivot through English. Watch the pivot node get struck out before the direct arc draws.',
    },
];

export const DOC_TYPES = [
    { id: 'markdown', label: 'Markdown', icon: 'hash' },
    { id: 'latex', label: 'LaTeX', icon: 'sigma' },
    { id: 'code', label: 'Code', icon: 'code' },
    { id: 'tables', label: 'Tables', icon: 'table' },
    { id: 'mixed', label: 'Mixed-lang', icon: 'languages' },
];

// One initial per language in that language's own script. Keying off the script
// instead would print 'अ' nine times — nine of the 22 share Devanagari.
export const LANGUAGES = [
    { name: 'Assamese', abbr: 'AS', code: 'as', glyph: 'অ', native: 'অসমীয়া', script: 'Bengali-Assamese' },
    { name: 'Bengali', abbr: 'BN', code: 'bn', glyph: 'বা', native: 'বাংলা', script: 'Bengali' },
    { name: 'Bodo', abbr: 'BRX', code: 'brx', glyph: 'बड़', native: 'बड़ो', script: 'Devanagari' },
    { name: 'Dogri', abbr: 'DOI', code: 'doi', glyph: 'डो', native: 'डोगरी', script: 'Devanagari' },
    { name: 'Gujarati', abbr: 'GU', code: 'gu', glyph: 'ગુ', native: 'ગુજરાતી', script: 'Gujarati' },
    { name: 'Hindi', abbr: 'HI', code: 'hi', glyph: 'हि', native: 'हिन्दी', script: 'Devanagari' },
    { name: 'Kannada', abbr: 'KN', code: 'kn', glyph: 'ಕ', native: 'ಕನ್ನಡ', script: 'Kannada' },
    { name: 'Kashmiri', abbr: 'KS', code: 'ks', glyph: 'کٲ', native: 'کٲشُر', script: 'Perso-Arabic', rtl: true },
    { name: 'Konkani', abbr: 'KOK', code: 'kok', glyph: 'को', native: 'कोंकणी', script: 'Devanagari' },
    { name: 'Maithili', abbr: 'MAI', code: 'mai', glyph: 'मै', native: 'मैथिली', script: 'Devanagari' },
    { name: 'Malayalam', abbr: 'ML', code: 'ml', glyph: 'മ', native: 'മലയാളം', script: 'Malayalam' },
    { name: 'Manipuri', abbr: 'MNI', code: 'mni', glyph: 'ꯃ', native: 'ꯃꯤꯇꯩꯂꯣꯟ', script: 'Meetei Mayek' },
    { name: 'Marathi', abbr: 'MR', code: 'mr', glyph: 'म', native: 'मराठी', script: 'Devanagari' },
    { name: 'Nepali', abbr: 'NE', code: 'ne', glyph: 'ने', native: 'नेपाली', script: 'Devanagari' },
    { name: 'Odia', abbr: 'OR', code: 'or', glyph: 'ଓ', native: 'ଓଡ଼ିଆ', script: 'Odia' },
    { name: 'Punjabi', abbr: 'PA', code: 'pa', glyph: 'ਪੰ', native: 'ਪੰਜਾਬੀ', script: 'Gurmukhi' },
    { name: 'Sanskrit', abbr: 'SA', code: 'sa', glyph: 'सं', native: 'संस्कृतम्', script: 'Devanagari' },
    { name: 'Santali', abbr: 'SAT', code: 'sat', glyph: 'ᱥ', native: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki' },
    { name: 'Sindhi', abbr: 'SD', code: 'sd', glyph: 'सि', native: 'سنڌي', script: 'Devanagari' },
    { name: 'Tamil', abbr: 'TA', code: 'ta', glyph: 'த', native: 'தமிழ்', script: 'Tamil' },
    { name: 'Telugu', abbr: 'TE', code: 'te', glyph: 'తె', native: 'తెలుగు', script: 'Telugu' },
    { name: 'Urdu', abbr: 'UR', code: 'ur', glyph: 'اُ', native: 'اُردُو', script: 'Perso-Arabic', rtl: true },
];

export const LANG_BY_NAME = Object.fromEntries(LANGUAGES.map((l) => [l.name, l]));

export const getLang = (name) => LANG_BY_NAME[name] ?? LANG_BY_NAME.Hindi;

// Scripts, once each, for the coverage strip.
export const SCRIPTS = [
    'Devanagari',
    'Bengali',
    'Bengali-Assamese',
    'Gujarati',
    'Gurmukhi',
    'Kannada',
    'Malayalam',
    'Meetei Mayek',
    'Odia',
    'Ol Chiki',
    'Perso-Arabic',
    'Tamil',
    'Telugu',
];

export const CLOSING = {
    heading: 'Wire it into something real',
    body:
        'A document pipeline, a support desk, a classroom. The weights are on Hugging Face and the '
        + 'technical write-up carries the full evaluation — 22 languages, per direction, against every '
        + 'system we could run under the same harness.',
    links: [
        { label: 'Hugging Face', href: 'https://huggingface.co/bodhan-ai/indic-translate', primary: true },
        { label: 'Technical overview', href: postPathForSlug('indic-translate') },
        { label: 'Contact', href: '/contact' },
    ],
    // Named in the write-up as the platforms the model is distributed through.
    ecosystem: ['Bhashini', 'AIKosh', 'Bodhan', 'Hugging Face'],
    known: [
        'Kashmiri, Sanskrit, Santali, Sindhi and Manipuri still trail the widely-resourced languages in both directions.',
        'Translation into English is currently stronger than translation out of it.',
        'Inside code, short string literals and inline comments sometimes stay in English.',
        'Digit rendering is not yet consistent across scripts — Kannada produces both native and Latin digits.',
    ],
};
