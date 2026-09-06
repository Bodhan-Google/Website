// `audio` is the full path under /public, extension included — the files differ
// in format, so name each one exactly. Drop files into: public/examples/speech/
export const AUDIO_EXAMPLES = [
    {
        id: 'bhojpuri',
        label: 'Bhojpuri',
        kind: 'Bank details',
        note: 'Spoken account number, thirteen digits',
        audio: '/examples/speech/bhojpuri-bank-details.mp3',
        lang: 'bho',
        modes: {
            native:
                'हम आपन खाता के विवरण सौराष्ट्र ग्रामीण बैंक में भरल चाहत बानी हमार खाता नंबर बा जीरो एक चार दुई जीरो जीरो पांच जीरो चार आठ दुई जीरो जीरो',
            mixed: 'हम आपन खाता के विवरण सौराष्ट्र ग्रामीण बैंक में भरल चाहत बानी हमार खाता number बा 0142005048200.',
            romanized:
                'Ham apan khaata ke vivaran Saurashtra Gramin Bank mein bharal chahat baani hamar khaata number ba zero ek chaar do zero zero paanch zero chaar aath do zero zero',
        },
    },
    {
        id: 'sanskrit',
        label: 'Sanskrit',
        kind: 'Shloka',
        note: 'Metrical Sanskrit recitation',
        audio: '/examples/speech/sanskrit-shlok.wav',
        lang: 'sa',
        modes: {
            native:
                'राज्याभिषेके चलमानयन्त्या हस्ताचुकाहे न घटो युवत्या',
            mixed:
                'राज्याभिषेके चलवान् अयंत्या हस्ताचुका हे न घटो युवत्या',
            romanized:
                'Raajyaabhisheke chalavaanayantya hasta chukahe na ghato yuvatya',
        },
    },
    {
        id: 'tamil',
        label: 'Tamil',
        kind: 'Thirukkural',
        note: 'Classical Tamil verse',
        audio: '/examples/speech/tamil-thirukkural.wav',
        lang: 'ta',
        // The recording is the couplet only — the gloss that follows it is not
        // spoken on the clip, so it is not in the transcript either. All three
        // modes cover the same words.
        modes: {
            native: 'அகர முதல எழுத்தெல்லாம் ஆதிபகவன் உதற்றே உலகு',
            mixed: 'Agara முதல எழுத்தெல்லாம் Adi Bhagavan உதற்றே உலகு',
            romanized: 'Agara mudhala ezhuthellaam Adi Bhagavan udhatre ulagu',
        },
    },
    {
        id: 'santali',
        label: 'Santali',
        kind: 'Conversation',
        note: 'Spontaneous speech, Ol Chiki script',
        audio: '/examples/speech/santali-parcel.wav',
        lang: 'sat',
        modes: {
            native:
                'ᱛᱚ ᱡᱚᱦᱟᱨ ᱜᱟᱛᱮ ᱠᱚ ᱛᱤᱦᱤᱧ ᱥᱮᱛᱟᱜ ᱥᱮᱛᱟᱜ ᱯᱟᱨᱥᱮᱞ ᱵᱟᱞᱟ ᱦᱮᱡ ᱮᱱᱟᱭ ᱯᱷᱞᱤᱯᱠᱟᱨᱴ ᱠᱷᱚᱱ ᱚᱰᱟᱨ ᱠᱟᱜ ᱛᱟᱦᱮᱱᱟ ᱥᱩᱴ',
            mixed:
                'ᱛᱚ ᱡᱚᱦᱟᱨ ᱜᱟᱛᱮ ᱠᱚ ᱛᱤᱦᱤᱧ ᱥᱮᱛᱟᱜ ᱥᱮᱛᱟᱜ parcel ᱵᱟᱞᱟ ᱦᱮᱡ ᱮᱱᱟ Flipkart ᱠᱷᱚᱱ ᱚᱰᱟᱨ ᱠᱟᱜ ᱛᱟᱦᱮᱱᱟ suit',
            romanized:
                'To johar gate ko tehenj taste parcel bala hej ena Flipkart koy order kag tahena suit',
        },
    },
    {
        id: 'song',
        label: 'Hindi',
        kind: 'Film song',
        note: 'Sung, with music behind the vocal',
        audio: '/examples/speech/hindi-song-clip.wav',
        lang: 'hi',
        modes: {
            native:
                'कोई जो मिला तो मुझे ऐसा लगता था जैसे मेरी सारी दुनिया में गीतों की रुत और रंगों की बरखा है खुशबू की आंधी है महकी हुई सी अब सारी फिजाएं हैं महकी हुई सी अब सारी हवाएं हैं खोई हुई सी अब सारी दिशाएं हैं बदली हुई सी अब सारी अदाएं',
            mixed:
                'कोई जो मिला तो मुझे ऐसा लगता था जैसे मेरी सारी दुनिया में गीतों की रुत और रंगों की बरखा है खुशबू की आंधी है महकी हुई सी अब सारी फिजाएं हैं महकी हुई सी अब सारी हवाएं हैं खोई हुई सी अब सारी दिशाएं हैं बदली हुई सी अब सारी अदाएं हैं',
            romanized:
                'Koi jo mila to mujhe aisa lagta tha jaise meri saari duniya mein geeton ki rutu aur rangon ki barkha hai khushbu ki aandhi hai mehki hui si ab saari fizayein hai mehki hui si ab saari hawaayein hai koi hui si ab saari dishayein hai badli hui si ab saari adaayein',
        },
    },
    {
        id: 'child',
        label: 'Hindi',
        kind: 'Child speaker',
        note: 'A younger voice, higher pitch',
        audio: '/examples/speech/hindi-child-voice.wav',
        lang: 'hi',
        modes: {
            native: 'बात इधर उधर फैलने लगी लोग लड़के की न्याय बुद्धि की चर्चा करने लगे और कहने लगे',
            mixed: 'बात इधर उधर फैलने लगी लोग लड़के की न्याय बुद्धि की चर्चा करने लगे और कहने लगे',
            romanized:
                'Baat idhar udhar phailne lagi log ladke ki nyay buddhi ki charcha karne lage aur kehne lage',
        },
    },
    {
        id: 'punjabi-stem',
        label: 'Punjabi',
        kind: 'STEM classroom',
        note: 'Physics terms code-switched into English',
        audio: '/examples/speech/punjabi-stem.wav',
        lang: 'pa',
        modes: {
            native:
                'ਵਿੱਚੋਂ ਸੱਤ ਰੰਗ ਤੁਹਾਨੂੰ ਨਜ਼ਰ ਆਉਣਗੇ ਉਹ ਸੱਤ ਰੰਗ ਕਿਹੜੇ ਕਿਹੜੇ ਹੁੰਦੇ ਵਾਇਲਟ ਇੰਡੀਗੋ ਬਲਿਊ ਗ੍ਰੀਨ ਯੈਲੋ ਔਰੇਂਜ ਅਤੇ ਰੈੱਡ ਨਿਊਟਨ ਨੇ ਇੱਕ ਡਿਸਕ ਬਣਾਈ ਸਾਡੇ ਕੋਲ ਉਹਨੂੰ ਨਿਊਟਨ ਡਿਸਕ ਕਿਹਾ ਜਾਂਦਾ',
            mixed:
                'ਵਿੱਚੋਂ 7 ਰੰਗ ਤੁਹਾਨੂੰ ਨਜ਼ਰ ਆਉਣਗੇ ਉਹ 7 ਰੰਗ ਕਿਹੜੇ ਕਿਹੜੇ ਹੁੰਦੇ violet, indigo, blue, green, yellow, orange ਅਤੇ red. Newton ਨੇ 1 disk ਬਣਾਈ ਸਾਡੇ ਕੋਲ ਉਹਨੂੰ Newton disk ਕਿਹਾ ਜਾਂਦਾ',
            romanized:
                'Vichon satt rang tuhanu nazar aaunge oh satt rang kehre kehre hunde violet indigo blue green yellow orange ate red Newton ne ek disk banayi sade kol ohnu Newton disk kiha janda',
        },
    },
    {
        id: 'assamese-english',
        label: 'English',
        kind: 'Assamese accent',
        note: 'English spoken with an Assamese accent',
        audio: '/examples/speech/english-assamese-accent.wav',
        lang: 'en',
        modes: {
            native: 'Visitors from different part of the world come to Majuli to witness this art',
            mixed: 'Visitors from different part of the world come to Majuli to witness this art',
            romanized: 'Visitors from different part of the world come to Majuli to witness this art',
        },
    },
];

export const MODE_LABELS = [
    { id: 'native', label: 'Native script' },
    { id: 'mixed', label: 'Mixed script' },
    { id: 'romanized', label: 'Romanized' },
];
