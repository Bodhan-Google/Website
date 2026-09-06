import { useCallback, useEffect, useRef } from 'react';

/**
 * One AudioContext and one AnalyserNode shared by the whole demo.
 *
 * The visualiser is fed by whatever is currently making sound: the microphone,
 * or an <audio>/<video> element. A media element may only ever be wrapped in a
 * MediaElementAudioSourceNode once, so those are cached per element.
 *
 * Playback is routed analyser → destination; the microphone deliberately is
 * not, or the page would howl.
 */
export default function useAudioAnalyser() {
    const ctxRef = useRef(null);
    const analyserRef = useRef(null);
    const elementSources = useRef(new WeakMap());
    const activeSource = useRef(null);
    const micStream = useRef(null);

    const ensure = useCallback(() => {
        if (!ctxRef.current) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return null;
            ctxRef.current = new Ctx();
            const analyser = ctxRef.current.createAnalyser();
            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = 0.72;
            analyserRef.current = analyser;
        }
        if (ctxRef.current.state === 'suspended') ctxRef.current.resume().catch(() => {});
        return ctxRef.current;
    }, []);

    const detach = useCallback(() => {
        try {
            activeSource.current?.disconnect();
        } catch {
            /* already disconnected */
        }
        activeSource.current = null;
        try {
            analyserRef.current?.disconnect();
        } catch {
            /* nothing connected */
        }
    }, []);

    const connectElement = useCallback(
        (element) => {
            const ctx = ensure();
            if (!ctx || !element) return;
            detach();

            let source = elementSources.current.get(element);
            if (!source) {
                source = ctx.createMediaElementSource(element);
                elementSources.current.set(element, source);
            }
            source.connect(analyserRef.current);
            analyserRef.current.connect(ctx.destination);
            activeSource.current = source;
        },
        [ensure, detach]
    );

    const connectStream = useCallback(
        (stream) => {
            const ctx = ensure();
            if (!ctx || !stream) return;
            detach();
            micStream.current = stream;
            const source = ctx.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
            activeSource.current = source;
        },
        [ensure, detach]
    );

    useEffect(
        () => () => {
            detach();
            micStream.current?.getTracks().forEach((track) => track.stop());
            ctxRef.current?.close().catch(() => {});
        },
        [detach]
    );

    return { analyserRef, ensure, connectElement, connectStream, detach };
}
