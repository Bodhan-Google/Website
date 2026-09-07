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
import ChartCard, { ChartLegend } from './ChartCard';
import { CHART, axisTick, prefersReducedMotion, resolveSeries } from './chartTheme';

/**
 * Two or three series as real grouped bars.
 *
 * The template's `groupedBar` name is an alias for its dot plot, which reads well for
 * many categories with close values but poorly for two categories whose values are far
 * apart -- two lone dots on a wide axis give no sense of magnitude. Bars do.
 *
 * Horizontal, because the category labels are direction names rather than short codes.
 * Every value is labelled directly, so the chart is readable without hovering.
 */
const GroupedBars = ({ chart }) => {
    // Hovering one bar fades the others, so a single comparison is easy to isolate. Our
    // own series is never faded -- it is the reference every other bar is read against.
    const [hover, setHover] = useState(null);
    const reduceMotion = prefersReducedMotion();
    const series = resolveSeries(chart.series);
    const digits = chart.digits ?? 2;
    const suffix = chart.valueSuffix ?? '';
    // Bars get thinner as the category count grows, or 22 languages x 2 series would run
    // to well over 2,000px of chart.
    const many = chart.data.length > 8;
    const barSize = many ? 13 : 22;
    const rowHeight = (barSize + 4) * series.length + (many ? 10 : 16);
    const plotHeight = Math.max(180, chart.data.length * rowHeight + 44);

    const fmt = (v) => `${Number(v).toFixed(digits)}${suffix}`;

    const opacityFor = (key, index) => {
        if (!hover) return 1;
        if (key === 'ours') return 1;
        return hover.key === key && hover.index === index ? 1 : 0.28;
    };

    return (
        <ChartCard
            title={chart.title}
            subtitle={chart.subtitle}
            note={chart.note}
            description={chart.description}
            legend={<ChartLegend series={series} />}
            plotHeight={plotHeight}
            table={{
                headers: [chart.categoryHeader ?? 'Direction', ...series.map((s) => s.label)],
                rows: chart.data.map((row) => [row.category, ...series.map((s) => fmt(row[s.key]))]),
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chart.data}
                    layout="vertical"
                    margin={{ top: 4, right: 64, left: 4, bottom: 4 }}
                    barCategoryGap={many ? '22%' : '28%'}
                    // A 2px gap keeps adjacent fills from reading as one block.
                    barGap={2}
                >
                    <XAxis
                        type="number"
                        domain={[0, chart.maxValue ?? 'auto']}
                        tick={axisTick}
                        axisLine={{ stroke: CHART.axis }}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="category"
                        width={126}
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(92, 83, 74, 0.06)' }}
                        content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;
                            return (
                                <div className="chart-tooltip chart-tooltip-static">
                                    <p className="chart-tooltip-title">{label}</p>
                                    {payload.map((p) => (
                                        <div key={p.dataKey} className="chart-tooltip-row">
                                            <span className="chart-tooltip-label">
                                                <span
                                                    className="chart-marker chart-marker-circle"
                                                    style={{ color: p.fill }}
                                                />
                                                {series.find((s) => s.key === p.dataKey)?.label ?? p.dataKey}
                                            </span>
                                            <span className="chart-tooltip-value">{fmt(p.value)}</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        }}
                    />
                    {series.map((s) => (
                        <Bar
                            key={s.key}
                            dataKey={s.key}
                            name={s.label}
                            radius={[0, 4, 4, 0]}
                            maxBarSize={barSize}
                            isAnimationActive={!reduceMotion}
                            fill={s.color}
                            onMouseEnter={(_, index) => setHover({ key: s.key, index })}
                            onMouseLeave={() => setHover(null)}
                        >
                            {chart.data.map((row, index) => (
                                <Cell
                                    key={`${s.key}-${row.category}`}
                                    fill={s.color}
                                    fillOpacity={opacityFor(s.key, index)}
                                />
                            ))}
                            <LabelList
                                dataKey={s.key}
                                position="right"
                                formatter={fmt}
                                fill={CHART.text.secondary}
                                fontSize={many ? 10 : 11}
                                fontFamily="Manrope, sans-serif"
                            />
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default GroupedBars;
