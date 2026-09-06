import { useRef } from 'react';
import { countUp, ensureSettled, useGsapAnimation } from '../devMotion';

// The values on the model pages are display strings, not numbers: "1.35M",
// "~200 ms", "₹30", "22 + English". Only the numeric middle is counted; the
// prefix and suffix are printed as they are, so the label never flickers
// through a half-formed version of itself.
const PARTS = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/s;

const CountUp = ({ value, className }) => {
    const ref = useRef(null);
    const match = typeof value === 'string' ? value.match(PARTS) : null;

    useGsapAnimation(
        (root) => {
            if (!match) return undefined;
            const [, prefix, digits, suffix] = match;
            const target = Number(digits.replace(/,/g, ''));
            if (!Number.isFinite(target)) return undefined;

            const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
            const grouped = digits.includes(',');

            const tween = countUp(root, target, {
                duration: 1.3,
                format: (n) => {
                    const fixed = n.toFixed(decimals);
                    const shown = grouped ? Number(fixed).toLocaleString('en-IN') : fixed;
                    return `${prefix}${shown}${suffix}`;
                },
            });

            return ensureSettled(tween, root, value);
        },
        ref,
        [value],
    );

    // Renders its final value first; the tween only ever counts up to what is
    // already on the page.
    return (
        <span ref={ref} className={className}>
            {value}
        </span>
    );
};

export default CountUp;
