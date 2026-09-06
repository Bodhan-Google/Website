export const CHART = {
    series: {
        primary: '#FF6207',
        secondary: '#0F766E',
        tertiary: '#5C4033',
        muted: '#A89880',
        // The design system's brand blue, for a segment that should read apart from
        // the warm palette rather than as a third shade of it.
        brandBlue: '#314685',
        highlight: '#FF6207',
    },
    text: {
        primary: '#2C241C',
        secondary: '#5C534A',
        inverse: '#FBF6EE',
    },
    grid: '#E4D8C8',
    axis: '#C9BBA8',
    tooltip: '#2C241C',
    focus: '#FF6207',
    panel: '#FBF6EE',
    marker: {
        primary: 'circle',
        secondary: 'square',
        tertiary: 'diamond',
    },
};

export const SERIES_ROLES = {
    primary: { color: CHART.series.primary, marker: 'circle' },
    secondary: { color: CHART.series.secondary, marker: 'square' },
    tertiary: { color: CHART.series.tertiary, marker: 'diamond' },
    muted: { color: CHART.series.muted, marker: 'circle' },
};

export const resolveSeries = (series = []) =>
    series.map((item, index) => {
        const roles = ['primary', 'secondary', 'tertiary'];
        const role = item.role ?? roles[index] ?? 'muted';
        return {
            ...item,
            role,
            color: item.color ?? SERIES_ROLES[role].color,
            marker: item.marker ?? SERIES_ROLES[role].marker,
        };
    });

export const axisTick = {
    fill: CHART.text.secondary,
    fontSize: 12,
    fontFamily: 'Manrope, sans-serif',
};

// Added for the two chart types this post contributes to the library.
// Sequential ramp for the heatmap: one hue, light to dark. Diverging pairs the
// accent against the theme's secondary, with a neutral zero line between them.
export const HEAT = { lo: '#FBEEE3', hi: '#B33F00', missing: '#FFF4E6' };
export const DIVERGING = { positive: CHART.series.primary, negative: CHART.series.secondary };

const hexToRgb = (hex) => {
    const h = hex.replace('#', '');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

/** Interpolate between two hex colours. t is clamped to [0, 1]. */
export const lerpColor = (a, b, t) => {
    const clamped = Math.max(0, Math.min(1, t));
    const [ar, ag, ab] = hexToRgb(a);
    const [br, bg, bb] = hexToRgb(b);
    const mix = (x, y) => Math.round(x + (y - x) * clamped);
    return `rgb(${mix(ar, br)}, ${mix(ag, bg)}, ${mix(ab, bb)})`;
};

/**
 * Three axis ticks, formatted to a precision the data actually needs, deduplicated.
 *
 * The template rounded ticks to whole numbers, which is fine for the percentages it
 * shipped with but wrong here: the transliteration error-rate chart spans 0.09-0.81,
 * where Math.round collapses the low and mid ticks to a duplicate 0 -- mislabelling
 * the axis and colliding React keys.
 */
export const axisTicks = (min, max, digits) => {
    const span = Math.max(Math.abs(min), Math.abs(max));
    const d = digits ?? (span < 1 ? 2 : span < 10 ? 1 : 0);
    const raw = [min, (min + max) / 2, max].map((t) => Number(t.toFixed(d)));
    return [...new Set(raw)].map((value) => ({ value, label: value.toFixed(d) }));
};

export const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
