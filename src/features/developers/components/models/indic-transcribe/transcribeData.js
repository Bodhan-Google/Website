// Copy, clips and demo configuration for the Indic-Transcribe page.
//
// Everything the page shows is either real audio with a real transcript, or is
// labelled as a sample. Nothing here fabricates model output: when no endpoint
// is configured the microphone records and visualises, and the page says so
// rather than inventing a transcription.

// Point this at your inference endpoint to run recordings through the model.
// It should accept a multipart POST (field `audio`) and answer with
// { native, mixed, romanized }.
export const TRANSCRIBE_API_URL = import.meta.env.VITE_TRANSCRIBE_API_URL ?? '';

export const HERO_STATS = [
    { value: 27, suffix: '', label: 'Languages' },
    { value: 1.2, suffix: 'B', label: 'Parameters', decimals: 1 },
    { value: 3, suffix: '', label: 'Output scripts' },
    { value: 1, suffix: 'M+ hrs', label: 'Audio trained on' },
];

// Drifting behind the hero. Kept sparse so the headline stays the loudest
// thing on the screen.
export const LANGUAGE_FIELD = [
    { text: 'हिन्दी', left: '5%', top: '22%', size: '2.1rem', tone: 'saffron' },
    { text: 'বাংলা', left: '14%', top: '62%', size: '1.7rem', tone: 'magenta' },
    { text: 'ਪੰਜਾਬੀ', left: '24%', top: '13%', size: '1.4rem', tone: 'violet' },
    { text: 'ગુજરાતી', left: '8%', top: '84%', size: '1.5rem', tone: 'teal' },
    { text: 'ଓଡ଼ିଆ', left: '31%', top: '80%', size: '1.35rem', tone: 'sky' },
    { text: 'தமிழ்', right: '6%', top: '20%', size: '2rem', tone: 'green' },
    { text: 'తెలుగు', right: '17%', top: '66%', size: '1.7rem', tone: 'saffron' },
    { text: 'ಕನ್ನಡ', right: '26%', top: '14%', size: '1.4rem', tone: 'violet' },
    { text: 'മലയാളം', right: '9%', top: '85%', size: '1.35rem', tone: 'magenta' },
    { text: 'اردو', right: '33%', top: '78%', size: '1.5rem', tone: 'teal' },
    { text: 'অসমীয়া', left: '40%', top: '8%', size: '1.3rem', tone: 'sky' },
    { text: 'ᱥᱟᱱᱛᱟᱲᱤ', right: '40%', top: '88%', size: '1.2rem', tone: 'green' },
];

export const PIPELINE = [
    {
        id: 'audio',
        step: '01',
        title: 'Audio arrives',
        detail: 'A phone recording in a noisy room, a broadcast feed, a lecture hall, a song. No studio assumptions.',
        tone: 'saffron',
    },
    {
        id: 'lid',
        step: '02',
        title: 'The language identifies itself',
        detail: 'Language identification runs inside the model across 27 languages — nobody has to pick from a dropdown first.',
        tone: 'sky',
    },
    {
        id: 'decode',
        step: '03',
        title: 'Words are decoded',
        detail: 'The streaming decoder emits partial words while you are still talking, and revises them as later context arrives.',
        tone: 'violet',
    },
    {
        id: 'scripts',
        step: '04',
        title: 'Three scripts come out',
        detail: 'Native, code-mixed and romanised forms from a single pass — so the same utterance suits a reader, a search index or a keyboard.',
        tone: 'teal',
    },
];

export const CAPABILITIES = [
    {
        id: 'languages',
        icon: 'languages',
        title: '27 languages, one model',
        detail: 'Every Eighth Schedule language plus English, with language identification built in rather than bolted on.',
    },
    {
        id: 'codemix',
        icon: 'shuffle',
        title: 'Code-mixing, kept intact',
        detail: 'Hinglish, Gujlish, Tanglish — each word is written in the script it was actually spoken in.',
    },
    {
        id: 'streaming',
        icon: 'zap',
        title: 'Streaming, not batch',
        detail: 'Partial words land while the speaker is mid-sentence, then settle as later context arrives.',
    },
    {
        id: 'scripts',
        icon: 'type',
        title: 'Native, mixed, romanised',
        detail: 'One pass, three renderings — pick the one your reader, your search index or your keyboard needs.',
    },
    {
        id: 'noise',
        icon: 'radio',
        title: 'Built for real rooms',
        detail: 'Trained on fans, traffic, crosstalk and phone mics, not on studio recordings of read prompts.',
    },
    {
        id: 'song',
        icon: 'music',
        title: 'Speech and song',
        detail: 'Bhajans, film songs and recited verse are handled by the same checkpoint as conversation.',
    },
];

export const SCRIPT_MODES = [
    { id: 'native', label: 'Native' },
    { id: 'mixed', label: 'Mixed' },
    { id: 'romanized', label: 'Roman' },
];

// Real recordings with real transcripts. `mixed` equals `native` for the two
// monolingual clips, which is itself worth showing — the mixed rendering only
// diverges when Latin words are actually spoken.
export const SAMPLE_CLIPS = [
    {
        id: 'sanskrit',
        label: 'Sanskrit',
        title: 'Recited shloka',
        meta: 'Manuscript tradition · recited verse',
        lang: 'sa',
        tone: 'amber',
        poster: '/examples/posters/sanskrit-shloka.png',
        audio: '/examples/speech/sanskrit-shloka.wav',
        transcripts: {
            native: 'राज्याभिषेके चलमानयन्त्या हस्ताचुका हेमघटो युवत्या',
            mixed: 'राज्याभिषेके चलमानयन्त्या हस्ताचुका हेमघटो युवत्या',
            romanized: 'rājyābhiṣeke calamānayantyā hastācukā hemaghaṭo yuvatyā',
        },
    },
    {
        id: 'bengali',
        label: 'Bengali',
        title: "Tagore's address",
        meta: 'Rabindranath Tagore · Mahajati Sadan',
        lang: 'bn',
        tone: 'green',
        poster: '/examples/posters/tagore-sermon.png',
        audio: '/examples/speech/tagore-sermon.wav',
        transcripts: {
            native: 'আজ এই মহাজাতি সদনে আমরা বাংলা জাতির যে শক্তির প্রতিষ্ঠা করবার সংকল্প করেছি',
            mixed: 'আজ এই মহাজাতি সদনে আমরা বাংলা জাতির যে শক্তির প্রতিষ্ঠা করবার সংকল্প করেছি',
            romanized:
                'aaj ei mahajati sadane amra bangla jatir je shaktir pratishtha karbar sankalpa korechhi',
        },
    },
    {
        id: 'tamil',
        label: 'Tamil',
        title: 'Thirukkural 1',
        meta: 'Thiruvalluvar · classical Tamil',
        lang: 'ta',
        tone: 'sky',
        poster: '/examples/posters/tamil-thirukkural.png',
        audio: '/examples/speech/tamil-thirukkural.wav',
        transcripts: {
            native: 'அகர முதல எழுத்தெல்லாம் ஆதிபகவன் முதற்றே உலகு.',
            mixed: 'அகர முதல எழுத்தெல்லாம் ஆதிபகவன் முதற்றே உலகு.',
            romanized: 'agara mudhala ezhuththellaam aadhibhagavan mudhatre ulagu.',
        },
    },
];

// The code-mixed showcase. This one is genuinely trilingual in rendering: the
// same sentence written three ways.
export const CODE_MIXED_CLIP = {
    id: 'gujarati-commentary',
    label: 'Gujarati × English',
    region: 'Gujarat',
    lang: 'gu',
    source: 'Cricket commentary, spoken the way it is actually spoken',
    video: '/examples/video/gujarati-commentary.mp4',
    transcripts: {
        mixed: 'એ જ movement ના થાય ફરી એકવાર એ જ કરવા ગયા અને in fact આ વખતે જે power એમને ના મળ્યો એ GSRTC-ની bus-ની જેમ એક passenger-એ બીજાને ધક્કો માર્યો અને speed વધી ગઈ ball-ની ફરી 4 run.',
        native: 'એ જ મૂવમેન્ટ ના થાય ફરી એકવાર એ જ કરવા ગયા અને ઇન ફેક્ટ આ વખતે જે પાવર એમને ના મળ્યો એ જીએસઆરટીસી-ની બસ-ની જેમ એક પેસેન્જર-એ બીજાને ધક્કો માર્યો અને સ્પીડ વધી ગઈ બોલ-ની ફરી ૪ રન.',
        romanized:
            'e ja movement na thaay fari ekvaar e ja karva gaya ane in fact aa vakhate je power emne na malyo e GSRTC-ni bus-ni jem ek passenger-e bijane dhakko maryo ane speed vadhi gai ball-ni fari 4 run.',
    },
};

export const SCRIPT_LEGEND = [
    { id: 'native', label: 'Native script' },
    { id: 'latin', label: 'Latin script' },
    { id: 'mixed', label: 'One word, both' },
];

// Songs. `audio` is empty for now, so the section presents lyrics as labelled
// sample output rather than pretending to a player that plays nothing. Drop a
// file into public/examples/songs/ and set `audio` and the transport appears.
export const SONGS = [
    {
        id: 'raghupati',
        title: 'Raghupati Raghav Raja Ram',
        type: 'Bhajan',
        monogram: 'रा',
        lang: 'hi',
        gradient: 'linear-gradient(145deg,#ff913d,#9b2c3d)',
        audio: '',
        lines: [
            'रघुपति राघव राजा राम',
            'पतित पावन सीताराम',
            'ईश्वर अल्लाह तेरे नाम',
            'सबको सन्मति दे भगवान',
        ],
    },
    {
        id: 'vaishnava',
        title: 'Vaishnava Jana To',
        type: 'Bhajan',
        monogram: 'વૈ',
        lang: 'gu',
        gradient: 'linear-gradient(145deg,#29567c,#0d2134)',
        audio: '',
        lines: [
            'વૈષ્ણવ જન તો તેને રે કહીએ',
            'જે પીડ પરાઈ જાણે રે',
            'પર દુઃખે ઉપકાર કરે તોયે',
            'મન અભિમાન ન આણે રે',
        ],
    },
    {
        id: 'mohe',
        title: 'Mohe Rang Do Laal',
        type: 'Film / classical',
        monogram: 'मो',
        lang: 'hi',
        gradient: 'linear-gradient(145deg,#ef5a37,#81142e)',
        audio: '',
        lines: [
            'मोहे रंग दो लाल',
            'नंद के लाल लाल',
            'छेड़ो नहीं बस रंग दो लाल',
            'मोहे रंग दो लाल',
        ],
    },
    {
        id: 'achyutam',
        title: 'Achyutam Keshavam',
        type: 'Stotram',
        monogram: 'अ',
        lang: 'sa',
        gradient: 'linear-gradient(145deg,#1f856d,#1f3c46)',
        audio: '',
        lines: [
            'अच्युतं केशवं कृष्ण दामोदरं',
            'राम नारायणं जानकी वल्लभम्',
            'कौन कहता है भगवान आते नहीं',
            'तुम मीरा के जैसे बुलाते नहीं',
        ],
    },
    {
        id: 'vande',
        title: 'Vande Mataram',
        type: 'Patriotic',
        monogram: 'व',
        lang: 'bn',
        gradient: 'linear-gradient(145deg,#f19e39,#236e56)',
        audio: '',
        lines: [
            'वन्दे मातरम्',
            'सुजलां सुफलां मलयजशीतलाम्',
            'शस्यश्यामलां मातरम्',
            'वन्दे मातरम्',
        ],
    },
    {
        id: 'carnatic',
        title: 'Vatapi Ganapatim',
        type: 'Carnatic',
        monogram: 'வா',
        lang: 'ta',
        gradient: 'linear-gradient(145deg,#8f4b69,#e99452)',
        audio: '',
        lines: [
            'வாதாபி கணபதிம் பஜேஹம்',
            'வாரண ஸ்யம் வர பிரதம்',
            'ஶ்ரீ புராந்தர்ஜ குரு குஹாக்ரஜம்',
            'ஶ்ரீ தீன ஸூர்ய கோடி ஸங்காஶம்',
        ],
    },
];
