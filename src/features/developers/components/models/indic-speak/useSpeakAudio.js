import { useCallback, useEffect, useRef, useState } from 'react';

// Audio plumbing shared by every player on the page.
//
// Three jobs: keep exactly one clip playing at a time, hand the orb a real
// analyser node so the waveform is the audio rather than a decoration, and
// drive time-based visuals from a single requestAnimationFrame loop that
// writes to the DOM directly. Captions run to a few hundred words on the
// long reads, so re-rendering React on every frame is not an option.

let audioContext = null;
const analysers = new WeakMap();

// One MediaElementSource per element, ever — a second one throws, and the
// first silently steals the audio. Created lazily inside the click that starts
// playback, which is also the gesture that is allowed to resume the context.
export function getAnalyser(element) {
    if (!element) return null;
    if (analysers.has(element)) return analysers.get(element);

    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        audioContext = audioContext || new Ctx();

        const source = audioContext.createMediaElementSource(element);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.72;
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analysers.set(element, analyser);
        return analyser;
    } catch {
        // No Web Audio (or the element is cross-origin without CORS): the orb
        // falls back to its idle wave and the clip still plays normally.
        analysers.set(element, null);
        return null;
    }
}

// Shared context, also used for decoding waveform peaks. Created suspended
// until a gesture resumes it.
export function getAudioContext() {
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        audioContext = audioContext || new Ctx();
        return audioContext;
    } catch {
        return null;
    }
}

export function resumeAudioContext() {
    if (audioContext?.state === 'suspended') audioContext.resume().catch(() => {});
}

// Pausing every other <audio> on the page when one starts. Cheaper and more
// reliable than threading a "currently playing" id through every section.
export function useSoloPlayback(rootRef) {
    useEffect(() => {
        const root = rootRef?.current ?? document;
        const onPlay = (event) => {
            root.querySelectorAll('audio').forEach((other) => {
                if (other !== event.target && !other.paused) other.pause();
            });
        };
        // Capture: `play` does not bubble.
        document.addEventListener('play', onPlay, true);
        return () => document.removeEventListener('play', onPlay, true);
    }, [rootRef]);
}

export function useClipPlayer(src) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [failed, setFailed] = useState(false);

    // A new clip resets the transport. Adjusting state during render is the
    // documented way to do this without an extra pass.
    const [loaded, setLoaded] = useState(src);
    if (src !== loaded) {
        setLoaded(src);
        setPlaying(false);
        setDuration(0);
        setFailed(false);
    }

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return undefined;

        const onPlay = () => setPlaying(true);
        const onStop = () => setPlaying(false);
        const onMeta = () => setDuration(el.duration || 0);
        const onError = () => {
            setFailed(true);
            setPlaying(false);
        };

        el.addEventListener('play', onPlay);
        el.addEventListener('pause', onStop);
        el.addEventListener('ended', onStop);
        el.addEventListener('loadedmetadata', onMeta);
        el.addEventListener('error', onError);

        return () => {
            el.removeEventListener('play', onPlay);
            el.removeEventListener('pause', onStop);
            el.removeEventListener('ended', onStop);
            el.removeEventListener('loadedmetadata', onMeta);
            el.removeEventListener('error', onError);
        };
    }, [src]);

    const play = useCallback((from) => {
        const el = audioRef.current;
        if (!el) return;
        getAnalyser(el);
        resumeAudioContext();
        if (typeof from === 'number') el.currentTime = from;
        el.play().catch(() => setFailed(true));
    }, []);

    const pause = useCallback(() => audioRef.current?.pause(), []);

    const toggle = useCallback(() => {
        const el = audioRef.current;
        if (!el) return;
        if (el.paused) play();
        else el.pause();
    }, [play]);

    const restart = useCallback(() => play(0), [play]);

    const seek = useCallback((seconds) => {
        const el = audioRef.current;
        if (!el) return;
        el.currentTime = Math.max(0, seconds);
        if (el.paused) play(Math.max(0, seconds));
    }, [play]);

    return { audioRef, playing, duration, failed, play, pause, toggle, restart, seek };
}

// One rAF loop per player, running only while the clip is playing. `onTick`
// is read from a ref so callers can pass an inline closure without
// restarting the loop every render.
export function useAudioTicker(audioRef, playing, onTick) {
    const tickRef = useRef(onTick);
    useEffect(() => {
        tickRef.current = onTick;
    });

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return undefined;

        let frame = 0;
        const step = () => {
            tickRef.current?.(el.currentTime, el.duration || 0, playing);
            if (playing) frame = window.requestAnimationFrame(step);
        };
        step();

        return () => window.cancelAnimationFrame(frame);
    }, [audioRef, playing]);
}
