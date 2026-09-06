import { useState } from 'react';
import {
    Bar,
    BarChart,
    Cell,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import ChartCard, {
    ChartLegend,
    ChartTooltipCard,
    useContainerSize,
} from './ChartCard';
import { CHART, axisTick, axisTicks, prefersReducedMotion, resolveSeries } from './chartTheme';
import Heatmap from './Heatmap';
import DivergingBar from './DivergingBar';
import GroupedBars from './GroupedBars';
import CiBar from './CiBar';

const formatValue = (value, digits = 1, suffix = '') => {
    if (typeof value !== 'number') return value;
    return `${value.toFixed(digits)}${suffix}`;
};

const Marker = ({ type, cx, cy, color, size = 7, focused = false }) => {
    const stroke = focused ? CHART.focus : color;
    const strokeWidth = focused ? 2 : 1.25;

    if (type === 'square') {
        const half = size;
        return (
            <rect
                x={cx - half}
                y={cy - half}
                width={half * 2}
                height={half * 2}
                fill={color}
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
        );
    }

    if (type === 'diamond') {
        const d = size + 1;
        return (
            <polygon
                points={`${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`}
                fill={color}
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
        );
    }

    return (
        <circle
            cx={cx}
            cy={cy}
            r={size}
            fill={color}
            stroke={CHART.panel}
            strokeWidth={focused ? 2 : 1.5}
        />
    );
};

const CompactRechartsTooltip = ({ active, payload, label, valueSuffix = '', digits = 1 }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="chart-tooltip chart-tooltip-static">
            <p className="chart-tooltip-title">{label}</p>
            {payload.map((entry) => (
                <div key={entry.name} className="chart-tooltip-row">
                    <span className="chart-tooltip-label">
                        <span className="chart-marker chart-marker-circle" style={{ color: entry.color }} />
                        {entry.name}
                    </span>
                    <span className="chart-tooltip-value">{formatValue(entry.value, digits, valueSuffix)}</span>
                </div>
            ))}
        </div>
    );
};

const DotPlot = ({ chart, series }) => {
    const [ref, size] = useContainerSize();
    const [active, setActive] = useState(null);
    const isMobile = size.width > 0 && size.width < 560;
    const rowHeight = isMobile ? 36 : 32;
    const plotHeight = Math.max(220, chart.data.length * rowHeight + 48);

    const margin = {
        top: 8,
        right: isMobile ? 12 : 20,
        bottom: 28,
        left: isMobile ? 72 : 86,
    };

    const values = chart.data.flatMap((row) => series.map((item) => row[item.key]));
    const max = Math.max(...values) * 1.12;
    const innerWidth = Math.max(0, size.width - margin.left - margin.right);
    const innerHeight = Math.max(0, plotHeight - margin.top - margin.bottom);
    const x = (value) => margin.left + (value / max) * innerWidth;
    const y = (index) => margin.top + (index + 0.5) * (innerHeight / chart.data.length);
    const ticks = axisTicks(0, max, chart.tickDigits);

    const activeRow = active != null ? chart.data[active] : null;

    return (
        <div ref={ref} className="chart-svg-wrap" style={{ height: plotHeight }}>
            {size.width > 0 && (
                <svg
                    width={size.width}
                    height={plotHeight}
                    role="img"
                    aria-label={chart.title}
                >
                    {chart.data.map((_, index) => (
                        <line
                            key={`grid-${index}`}
                            x1={margin.left}
                            x2={size.width - margin.right}
                            y1={y(index)}
                            y2={y(index)}
                            stroke={CHART.grid}
                            strokeWidth={1}
                        />
                    ))}

                    {ticks.map(({ value, label }) => (
                        <g key={label}>
                            <line
                                x1={x(value)}
                                x2={x(value)}
                                y1={margin.top}
                                y2={plotHeight - margin.bottom + 4}
                                stroke={value === 0 ? CHART.axis : 'transparent'}
                                strokeWidth={1}
                            />
                            <text
                                x={x(value)}
                                y={plotHeight - 8}
                                textAnchor="middle"
                                fill={CHART.text.secondary}
                                fontSize="12"
                                fontFamily="Manrope, sans-serif"
                            >
                                {label}
                            </text>
                        </g>
                    ))}

                    {chart.data.map((row, index) => (
                        <g key={row.category}>
                            <text
                                x={margin.left - 10}
                                y={y(index) + 4}
                                textAnchor="end"
                                fill={CHART.text.primary}
                                fontSize="12"
                                fontFamily="Manrope, sans-serif"
                            >
                                {row.category}
                            </text>
                            <rect
                                x={margin.left}
                                y={y(index) - rowHeight / 2}
                                width={innerWidth}
                                height={rowHeight}
                                fill="transparent"
                                tabIndex={0}
                                focusable="true"
                                role="button"
                                aria-label={`${row.category}: ${series
                                    .map((item) => `${item.label} ${formatValue(row[item.key], 1, chart.valueSuffix)}`)
                                    .join(', ')}`}
                                onMouseEnter={() => setActive(index)}
                                onMouseLeave={() => setActive(null)}
                                onFocus={() => setActive(index)}
                                onBlur={() => setActive(null)}
                            />
                            {series.map((item) => (
                                <Marker
                                    key={item.key}
                                    type={item.marker}
                                    cx={x(row[item.key])}
                                    cy={y(index)}
                                    color={item.color}
                                    size={isMobile ? 6 : 7}
                                    focused={active === index}
                                />
                            ))}
                        </g>
                    ))}
                </svg>
            )}

            {activeRow && (
                <ChartTooltipCard
                    title={activeRow.category}
                    rows={series.map((item) => ({
                        label: item.label,
                        value: formatValue(activeRow[item.key], 1, chart.valueSuffix),
                        color: item.color,
                        marker: item.marker,
                    }))}
                    hint="↓ Lower is better"
                    x={x(Math.max(...series.map((item) => activeRow[item.key])))}
                    y={y(active)}
                    bounds={{ width: size.width, height: plotHeight }}
                />
            )}
        </div>
    );
};

const DumbbellPlot = ({ chart, series }) => {
    const [ref, size] = useContainerSize();
    const [active, setActive] = useState(null);
    const left = series[0];
    const right = series[1];
    const isMobile = size.width > 0 && size.width < 560;
    const rowHeight = isMobile ? 38 : 34;
    const plotHeight = Math.max(220, chart.data.length * rowHeight + 48);
    const margin = { top: 8, right: 16, bottom: 28, left: isMobile ? 76 : 88 };

    const values = chart.data.flatMap((row) => [row[left.key], row[right.key]]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.35 || 0.02;
    const domainMin = min - pad;
    const domainMax = max + pad;
    const innerWidth = Math.max(0, size.width - margin.left - margin.right);
    const innerHeight = Math.max(0, plotHeight - margin.top - margin.bottom);
    const x = (value) => margin.left + ((value - domainMin) / (domainMax - domainMin)) * innerWidth;
    const y = (index) => margin.top + (index + 0.5) * (innerHeight / chart.data.length);
    const ticks = axisTicks(domainMin, domainMax, chart.tickDigits);
    const activeRow = active != null ? chart.data[active] : null;

    return (
        <div ref={ref} className="chart-svg-wrap" style={{ height: plotHeight }}>
            {size.width > 0 && (
                <svg width={size.width} height={plotHeight} role="img" aria-label={chart.title}>
                    {chart.data.map((_, index) => (
                        <line
                            key={`grid-${index}`}
                            x1={margin.left}
                            x2={size.width - margin.right}
                            y1={y(index)}
                            y2={y(index)}
                            stroke={CHART.grid}
                            strokeWidth={1}
                        />
                    ))}

                    {ticks.map(({ value, label }) => (
                        <text
                            key={label}
                            x={x(value)}
                            y={plotHeight - 8}
                            textAnchor="middle"
                            fill={CHART.text.secondary}
                            fontSize="12"
                            fontFamily="Manrope, sans-serif"
                        >
                            {label}
                        </text>
                    ))}

                    {chart.data.map((row, index) => {
                        const x1 = x(row[left.key]);
                        const x2 = x(row[right.key]);
                        return (
                            <g key={row.category}>
                                <text
                                    x={margin.left - 10}
                                    y={y(index) + 4}
                                    textAnchor="end"
                                    fill={CHART.text.primary}
                                    fontSize="12"
                                    fontFamily="Manrope, sans-serif"
                                >
                                    {row.category}
                                </text>
                                <rect
                                    x={margin.left}
                                    y={y(index) - rowHeight / 2}
                                    width={innerWidth}
                                    height={rowHeight}
                                    fill="transparent"
                                    tabIndex={0}
                                    focusable="true"
                                    role="button"
                                    aria-label={`${row.category}: ${left.label} ${row[left.key].toFixed(3)}, ${right.label} ${row[right.key].toFixed(3)}`}
                                    onMouseEnter={() => setActive(index)}
                                    onMouseLeave={() => setActive(null)}
                                    onFocus={() => setActive(index)}
                                    onBlur={() => setActive(null)}
                                />
                                <line
                                    x1={x1}
                                    x2={x2}
                                    y1={y(index)}
                                    y2={y(index)}
                                    stroke={CHART.axis}
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                />
                                <Marker type={left.marker} cx={x1} cy={y(index)} color={left.color} focused={active === index} />
                                <Marker type={right.marker} cx={x2} cy={y(index)} color={right.color} focused={active === index} />
                            </g>
                        );
                    })}
                </svg>
            )}

            {activeRow && (
                <ChartTooltipCard
                    title={activeRow.category}
                    rows={series.map((item) => ({
                        label: item.label,
                        value: activeRow[item.key].toFixed(3),
                        color: item.color,
                        marker: item.marker,
                    }))}
                    hint="↑ Higher is better"
                    x={x(activeRow[right.key])}
                    y={y(active)}
                    bounds={{ width: size.width, height: plotHeight }}
                />
            )}
        </div>
    );
};

const GroupedDotChart = ({ chart }) => {
    const series = resolveSeries(chart.series);

    return (
        <ChartCard
            title={chart.title}
            subtitle={chart.subtitle}
            note={chart.note}
            description={chart.description}
            legend={<ChartLegend series={series} />}
            table={{
                headers: [chart.categoryHeader ?? 'Language', ...series.map((item) => item.label)],
                rows: chart.data.map((row) => [
                    row.category,
                    ...series.map((item) =>
                        formatValue(row[item.key], chart.digits ?? 1, chart.valueSuffix)),
                ]),
            }}
        >
            <DotPlot chart={chart} series={series} />
        </ChartCard>
    );
};

const DumbbellChart = ({ chart }) => {
    const series = resolveSeries(chart.series);

    return (
        <ChartCard
            title={chart.title}
            subtitle={chart.subtitle}
            note={chart.note}
            description={chart.description}
            legend={<ChartLegend series={series} />}
            table={{
                headers: [chart.categoryHeader ?? 'Category', ...series.map((item) => item.label)],
                rows: chart.data.map((row) => [
                    row.category,
                    ...series.map((item) => row[item.key].toFixed(chart.digits ?? 2)),
                ]),
            }}
        >
            <DumbbellPlot chart={chart} series={series} />
        </ChartCard>
    );
};

const RankedBarPlot = ({ chart }) => {
    const reduceMotion = prefersReducedMotion();
    // Hovering one bar fades the others; the highlighted bar (ours) never fades, since it
    // is the reference every other bar is read against.
    const [hovered, setHovered] = useState(null);
    const highlightKey = chart.highlightKey ?? 'bodhan';
    const plotHeight = Math.max(200, chart.data.length * 42 + 36);

    return (
        <ChartCard
            title={chart.title}
            subtitle={chart.subtitle}
            note={chart.note}
            description={chart.description}
            plotHeight={plotHeight}
            table={{
                headers: ['System', chart.valueHeader ?? chart.yLabel ?? 'Value'],
                rows: chart.data.map((row) => [row.name, `${row.score}`]),
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chart.data}
                    layout="vertical"
                    margin={{ top: 4, right: 36, left: 4, bottom: 4 }}
                    barCategoryGap="32%"
                    maxBarSize={22}
                >
                    <XAxis
                        type="number"
                        domain={[0, 'auto']}
                        tick={axisTick}
                        axisLine={{ stroke: CHART.axis }}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={118}
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        content={
                            <CompactRechartsTooltip
                                valueSuffix={chart.valueSuffix ?? ''}
                                digits={chart.digits ?? 1}
                            />
                        }
                        cursor={{ fill: 'rgba(92, 83, 74, 0.06)' }}
                    />
                    <Bar
                        dataKey="score"
                        name={chart.seriesName ?? chart.yLabel ?? 'Value'}
                        radius={[0, 5, 5, 0]}
                        maxBarSize={22}
                        isAnimationActive={!reduceMotion}
                        onMouseEnter={(_, index) => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        {chart.data.map((entry, index) => {
                            const isOurs = entry.highlight || entry.key === highlightKey;
                            return (
                                <Cell
                                    key={entry.name}
                                    fill={isOurs ? CHART.series.primary : CHART.series.muted}
                                    fillOpacity={
                                        hovered === null || isOurs || hovered === index ? 1 : 0.28
                                    }
                                />
                            );
                        })}
                        <LabelList
                            dataKey="score"
                            position="right"
                            fill={CHART.text.secondary}
                            fontSize={12}
                            content={({ x, y, width, height, value, index }) => {
                                const entry = chart.data[index];
                                if (!entry?.highlight) return null;
                                return (
                                    <text
                                        x={x + width + 8}
                                        y={y + height / 2 + 4}
                                        fill={CHART.series.primary}
                                        fontSize="12"
                                        fontFamily="Manrope, sans-serif"
                                        fontWeight="650"
                                    >
                                        {value}
                                        {chart.valueSuffix ?? ''}
                                    </text>
                                );
                            }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

const CompositionChart = ({ chart }) => {
    const [active, setActive] = useState(null);
    // The template supplied exactly three colours and three markers. This post has a
    // four-segment composition (the human-evaluation verdict split), so the ramps are
    // extended and indexed modulo their length.
    const SEG_COLORS = [
        CHART.series.primary,
        CHART.series.secondary,
        CHART.series.tertiary,
        CHART.series.muted,
    ];
    const SEG_MARKERS = ['circle', 'square', 'diamond', 'circle'];
    const series = chart.segments.map((segment, index) => ({
        key: segment.label,
        label: segment.label,
        color: segment.color ?? SEG_COLORS[index % SEG_COLORS.length],
        marker: SEG_MARKERS[index % SEG_MARKERS.length],
        display: segment.display,
        value: segment.value,
    }));

    // Left edge of each slice as a percentage, so the readout can sit over its middle.
    const offsets = series.reduce(
        (acc, item) => [...acc, acc[acc.length - 1] + item.value],
        [0]
    );
    const activeItem = active === null ? null : series[active];

    return (
        <ChartCard
            title={chart.title}
            subtitle={chart.subtitle}
            note={chart.note}
            description={chart.description}
            legend={<ChartLegend series={series} />}
            plotHeight={88}
            table={{
                headers: chart.tableHeaders ?? ['Source', 'Amount', 'Share'],
                rows: chart.segments.map((segment) => [
                    segment.label,
                    segment.display,
                    `${segment.value}%`,
                ]),
            }}
        >
            <div className="chart-composition">
                {activeItem && (
                    <div
                        className="chart-tooltip chart-tooltip-static composition-readout"
                        role="status"
                        style={{
                            // Centre on the slice, then clamp so the readout stays in the card.
                            left: `${Math.min(88, Math.max(12, offsets[active] + activeItem.value / 2))}%`,
                        }}
                    >
                        <p className="chart-tooltip-title">{activeItem.label}</p>
                        <div className="chart-tooltip-row">
                            <span className="chart-tooltip-label">
                                {chart.tableHeaders?.[1] ?? 'Amount'}
                            </span>
                            <span className="chart-tooltip-value">{activeItem.display}</span>
                        </div>
                        <div className="chart-tooltip-row">
                            <span className="chart-tooltip-label">Share</span>
                            <span className="chart-tooltip-value">{activeItem.value}%</span>
                        </div>
                    </div>
                )}
                <div
                    className="chart-composition-bar"
                    role="img"
                    aria-label={chart.segments.map((segment) => `${segment.label} ${segment.display}`).join(', ')}
                >
                    {series.map((item, index) => (
                        <button
                            key={item.key}
                            type="button"
                            className="chart-composition-slice"
                            style={{
                                width: `${item.value}%`,
                                background: item.color,
                                opacity: active === null || active === index ? 1 : 0.45,
                            }}
                            aria-label={`${item.label}: ${item.display}, ${item.value}%`}
                            onMouseEnter={() => setActive(index)}
                            onMouseLeave={() => setActive(null)}
                            onFocus={() => setActive(index)}
                            onBlur={() => setActive(null)}
                        />
                    ))}
                </div>
                <ul className="chart-composition-stats">
                    {series.map((item, index) => (
                        <li key={item.key} className={active === index ? 'is-active' : undefined}>
                            <strong>{item.display}</strong>
                            <span>
                                {item.label} · {item.value}%
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </ChartCard>
    );
};

const CHART_REGISTRY = {
    groupedBar: GroupedDotChart,
    dotPlot: GroupedDotChart,
    dumbbell: DumbbellChart,
    rankedBar: RankedBarPlot,
    donut: CompositionChart,
    composition: CompositionChart,
    // Added for this post: a sortable value matrix, signed bars about a zero line, and
    // real grouped bars (the template's `groupedBar` is an alias for its dot plot, which
    // reads poorly for two categories whose values are far apart).
    heatmap: Heatmap,
    divergingBar: DivergingBar,
    bar: GroupedBars,
    // Added for the Indic-Speak post: a zoomed axis carrying each bar's
    // confidence interval, for a finding that is about ten values agreeing.
    ciBar: CiBar,
};

const BlogChart = ({ chart }) => {
    const Component = CHART_REGISTRY[chart.type];
    if (!Component) return null;
    return <Component chart={chart} />;
};

export default BlogChart;
