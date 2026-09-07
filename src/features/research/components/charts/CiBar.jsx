import { useState } from 'react';
import ChartCard, { ChartTooltipCard, useContainerSize } from './ChartCard';
import { CHART } from './chartTheme';

/**
 * Bars on a zoomed axis, each with its confidence interval at the tip.
 *
 * Added for the Indic-Speak post, where the whole finding is that ten languages
 * land in the same place: on a 0-100 axis the bars are identical, and on a zoomed
 * one they look dramatically different unless the reader is told the axis is cut
 * and how big the measurement error is. So the axis starts at `baseline`, every
 * bar carries a hatched break at its base to say so, and the 95% interval is drawn
 * on top of the value rather than buried in a footnote.
 *
 * Horizontal, because the categories are language names.
 */
const CiBar = ({ chart }) => {
    const [ref, size] = useContainerSize();
    const [active, setActive] = useState(null);

    const baseline = chart.baseline ?? 0;
    const max = chart.max ?? 100;
    const suffix = chart.valueSuffix ?? '';
    const digits = chart.digits ?? 1;
    const fmt = (value) => `${Number(value).toFixed(digits)}${suffix}`;

    const isMobile = size.width > 0 && size.width < 560;
    const rowHeight = isMobile ? 30 : 28;
    const barHeight = isMobile ? 13 : 12;
    const plotHeight = chart.data.length * rowHeight + 44;
    const margin = { top: 10, right: isMobile ? 52 : 62, bottom: 26, left: isMobile ? 74 : 92 };

    /*
     * The chart draws into a viewBox rather than into raw pixels, so it survives a
     * container it has not been able to measure — a hidden tab, a print preview, the
     * frame before ResizeObserver reports. It lays itself out at `width` and then
     * scales to whatever the container actually is; once the measurement arrives the
     * two are the same number and the scale is 1:1.
     */
    const width = size.width || 640;
    const innerWidth = Math.max(0, width - margin.left - margin.right);
    const x = (value) => margin.left + ((value - baseline) / (max - baseline)) * innerWidth;
    const y = (index) => margin.top + (index + 0.5) * rowHeight;

    const ticks = chart.ticks ?? [baseline, (baseline + max) / 2, max];
    const activeRow = active != null ? chart.data[active] : null;

    return (
        <ChartCard
            title={chart.title}
            subtitle={chart.subtitle}
            note={chart.note}
            description={chart.description}
            table={{
                headers: chart.tableHeaders ?? ['Language', 'Top band', '95% CI', 'Readings'],
                rows: chart.data.map((row) => [
                    row.category,
                    fmt(row.value),
                    `±${row.ci.toFixed(2)}`,
                    row.n?.toLocaleString('en-US') ?? '—',
                ]),
            }}
        >
            <div ref={ref} className="chart-svg-wrap" style={{ height: plotHeight }}>
                <svg
                    width="100%"
                    height={plotHeight}
                    viewBox={`0 0 ${width} ${plotHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label={chart.description ?? chart.title}
                >
                    {ticks.map((tick) => (
                        <g key={tick}>
                            <line
                                x1={x(tick)}
                                x2={x(tick)}
                                y1={margin.top - 4}
                                y2={plotHeight - margin.bottom + 2}
                                stroke={CHART.grid}
                                strokeWidth={1}
                            />
                            <text
                                x={x(tick)}
                                y={plotHeight - 8}
                                textAnchor="middle"
                                fill={CHART.text.secondary}
                                fontSize="11"
                                fontFamily="Manrope, sans-serif"
                            >
                                {fmt(tick)}
                            </text>
                        </g>
                    ))}

                    {chart.reference && (
                        <g>
                            <line
                                x1={x(chart.reference.value)}
                                x2={x(chart.reference.value)}
                                y1={margin.top - 6}
                                y2={plotHeight - margin.bottom + 2}
                                stroke={CHART.series.tertiary}
                                strokeWidth={1}
                                strokeDasharray="3 3"
                            />
                            <text
                                x={x(chart.reference.value)}
                                y={margin.top - 10}
                                textAnchor="middle"
                                fill={CHART.series.tertiary}
                                fontSize="10.5"
                                fontFamily="Manrope, sans-serif"
                            >
                                {chart.reference.label}
                            </text>
                        </g>
                    )}

                    {chart.data.map((row, index) => {
                        const tip = x(row.value);
                        const centre = y(index);
                        const focused = active === index;

                        return (
                            <g key={row.category}>
                                <text
                                    x={margin.left - 10}
                                    y={centre + 4}
                                    textAnchor="end"
                                    fill={CHART.text.primary}
                                    fontSize="12"
                                    fontFamily="Manrope, sans-serif"
                                >
                                    {row.category}
                                </text>

                                <rect
                                    x={margin.left}
                                    y={centre - barHeight / 2}
                                    width={Math.max(0, tip - margin.left)}
                                    height={barHeight}
                                    rx={2}
                                    fill={CHART.series.primary}
                                    fillOpacity={active === null || focused ? 1 : 0.35}
                                />

                                {/* The axis break: two slashes where the bar leaves the
                                    cut edge, so no one reads its length as its value. */}
                                <path
                                    d={`M${margin.left + 1} ${centre - barHeight / 2} l-4 ${barHeight} M${margin.left + 5} ${centre - barHeight / 2} l-4 ${barHeight}`}
                                    stroke={CHART.panel}
                                    strokeWidth={1.6}
                                    fill="none"
                                />

                                <line
                                    x1={x(row.value - row.ci)}
                                    x2={x(row.value + row.ci)}
                                    y1={centre}
                                    y2={centre}
                                    stroke={CHART.text.primary}
                                    strokeWidth={1.2}
                                />
                                {[row.value - row.ci, row.value + row.ci].map((end) => (
                                    <line
                                        key={end}
                                        x1={x(end)}
                                        x2={x(end)}
                                        y1={centre - 4}
                                        y2={centre + 4}
                                        stroke={CHART.text.primary}
                                        strokeWidth={1.2}
                                    />
                                ))}

                                <text
                                    x={x(row.value + row.ci) + 8}
                                    y={centre + 4}
                                    fill={focused ? CHART.series.primary : CHART.text.secondary}
                                    fontSize="11.5"
                                    fontFamily="Manrope, sans-serif"
                                    fontWeight={focused ? 700 : 500}
                                >
                                    {fmt(row.value)}
                                </text>

                                <rect
                                    x={margin.left}
                                    y={centre - rowHeight / 2}
                                    width={Math.max(0, innerWidth)}
                                    height={rowHeight}
                                    fill="transparent"
                                    tabIndex={0}
                                    focusable="true"
                                    role="button"
                                    aria-label={`${row.category}: ${fmt(row.value)} of readings in the top band, plus or minus ${row.ci.toFixed(2)} points`}
                                    onMouseEnter={() => setActive(index)}
                                    onMouseLeave={() => setActive(null)}
                                    onFocus={() => setActive(index)}
                                    onBlur={() => setActive(null)}
                                />
                            </g>
                        );
                    })}
                </svg>

                {activeRow && (
                    <ChartTooltipCard
                        title={activeRow.category}
                        rows={[
                            {
                                label: chart.valueLabel ?? 'Top band',
                                value: fmt(activeRow.value),
                                color: CHART.series.primary,
                            },
                            {
                                label: '95% interval',
                                value: `±${activeRow.ci.toFixed(2)}`,
                                color: CHART.text.primary,
                                marker: 'square',
                            },
                        ]}
                        hint={activeRow.n ? `${activeRow.n.toLocaleString('en-US')} readings` : undefined}
                        x={x(activeRow.value)}
                        y={y(active)}
                        bounds={{ width: size.width || width, height: plotHeight }}
                    />
                )}
            </div>
        </ChartCard>
    );
};

export default CiBar;
