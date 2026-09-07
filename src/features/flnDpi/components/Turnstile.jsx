import { useEffect, useRef } from 'react';

// Cloudflare Turnstile, rendered explicitly so the widget lives inside React's
// tree and can be reset after a failed submit (a token is single-use).
// The script is loaded once per page load and shared between instances.
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let scriptPromise = null;

const loadTurnstile = () => {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (!scriptPromise) {
        scriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = SCRIPT_SRC;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve(window.turnstile);
            script.onerror = () => {
                scriptPromise = null;
                script.remove();
                reject(new Error('Could not load the verification widget.'));
            };
            document.head.appendChild(script);
        });
    }
    return scriptPromise;
};

/**
 * @param {object} props
 * @param {string} props.siteKey       Turnstile site key (public).
 * @param {(token: string) => void} props.onToken  Called with a token on success, '' on expiry/error.
 * @param {(message: string) => void} [props.onError]
 * @param {number} [props.resetKey]    Bump to force a fresh challenge.
 * @param {'light'|'dark'|'auto'} [props.theme]
 * @param {string} [props.action]      Free-form label echoed back by siteverify.
 * @param {string} [props.className]
 */
const Turnstile = ({ siteKey, onToken, onError, resetKey = 0, theme = 'light', action, className }) => {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const onTokenRef = useRef(onToken);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onTokenRef.current = onToken;
        onErrorRef.current = onError;
    });

    useEffect(() => {
        let cancelled = false;

        loadTurnstile()
            .then((turnstile) => {
                if (cancelled || !containerRef.current) return;
                widgetIdRef.current = turnstile.render(containerRef.current, {
                    sitekey: siteKey,
                    theme,
                    action,
                    callback: (token) => onTokenRef.current?.(token),
                    'expired-callback': () => onTokenRef.current?.(''),
                    'timeout-callback': () => onTokenRef.current?.(''),
                    'error-callback': (code) => {
                        onTokenRef.current?.('');
                        onErrorRef.current?.(`Verification error (${code}). Please retry.`);
                    },
                });
            })
            .catch((err) => {
                if (!cancelled) onErrorRef.current?.(err.message);
            });

        return () => {
            cancelled = true;
            if (widgetIdRef.current !== null && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch {
                    // Widget already gone (e.g. container unmounted first). Nothing to do.
                }
                widgetIdRef.current = null;
            }
        };
    }, [siteKey, theme, action]);

    useEffect(() => {
        if (!resetKey || widgetIdRef.current === null || !window.turnstile) return;
        window.turnstile.reset(widgetIdRef.current);
        onTokenRef.current?.('');
    }, [resetKey]);

    return <div ref={containerRef} className={className} />;
};

export default Turnstile;
