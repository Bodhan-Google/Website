// Caption timing for the Indic-Speak page.
//
// The model returns audio, not word timestamps, so the read-head here is
// *paced* rather than force-aligned: every caption unit gets a share of the
// clip proportional to how long it takes to say, anchored to whatever real
// timings we do have — the podcast's per-turn end marks, the isolated news
// headline, and the measured opening/closing marks on the two long reads.
//
// Weight = characters, plus a fixed cost per unit for the breath between
// units, plus a little for each sentence-ending mark. Without those two
// corrections short lines flash past and long ones lag behind the voice.

const PUNCTUATION = /[।॥,.;:?!—…]/g;

const weigh = (text, pause) => {
    const chars = text.replace(/\s+/g, '').length;
    const stops = (text.match(PUNCTUATION) || []).length;
    return chars + pause + stops * 3;
};

// Splits [start, end] between `texts` by weight. Returns one span per text.
export function distribute(texts, start, end, pause = 7) {
    const weights = texts.map((text) => weigh(text, pause));
    const total = weights.reduce((sum, w) => sum + w, 0) || 1;
    const span = Math.max(0, end - start);

    let cursor = start;
    return weights.map((w) => {
        const from = cursor;
        cursor += (w / total) * span;
        return { start: from, end: cursor };
    });
}

const splitWords = (text) => text.split(/(\s+)/).filter((part) => part.length > 0);

// Marks the words that the text normaliser rewrote, so they can be lit
// differently from the rest of the line. `phrases` are matched as word
// sequences, which is how they are written in the shot list.
// Compared without the punctuation hanging off either end, so a phrase that
// happens to land on a sentence stop still matches its last word.
const bare = (word) => word.replace(/^[\s"'([{]+|[\s"')\]}।॥,.;:?!—…]+$/g, '');

const markFocus = (words, phrases) => {
    const focus = new Array(words.length).fill(false);
    if (!phrases?.length) return focus;

    for (const phrase of phrases) {
        const needle = phrase.trim().split(/\s+/);
        for (let i = 0; i < words.length; i += 1) {
            let j = i;
            let k = 0;
            while (k < needle.length && j < words.length) {
                if (/^\s+$/.test(words[j])) {
                    j += 1;
                    continue;
                }
                if (bare(words[j]) !== bare(needle[k])) break;
                j += 1;
                k += 1;
            }
            if (k === needle.length) {
                for (let m = i; m < j; m += 1) focus[m] = true;
                i = j - 1;
            }
        }
    }
    return focus;
};

// One entry per word, each with the slice of the clip it is spoken in.
// Whitespace is kept as its own zero-width entry so the original spacing
// survives — Indic scripts are unforgiving about lost joiners.
export function paceWords(text, start, end, focusPhrases) {
    const parts = splitWords(text);
    const focus = markFocus(parts, focusPhrases);
    const spoken = parts
        .map((part, index) => ({ part, index }))
        .filter(({ part }) => !/^\s+$/.test(part));

    const spans = distribute(
        spoken.map(({ part }) => part),
        start,
        end,
        1
    );

    const timing = new Map();
    spoken.forEach(({ index }, i) => timing.set(index, spans[i]));

    return parts.map((part, index) => ({
        text: part,
        space: /^\s+$/.test(part),
        focus: focus[index],
        start: timing.get(index)?.start ?? start,
        end: timing.get(index)?.end ?? start,
    }));
}

// Which unit is being spoken at `time`. -1 before the first, length-1 once the
// clip has run past the last.
export function activeIndex(spans, time) {
    if (!spans.length) return -1;
    if (time < spans[0].start) return -1;
    for (let i = spans.length - 1; i >= 0; i -= 1) {
        if (time >= spans[i].start) return i;
    }
    return -1;
}

export const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const total = Math.max(0, Math.floor(seconds));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};
