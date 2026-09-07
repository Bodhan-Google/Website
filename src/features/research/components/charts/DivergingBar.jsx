import { useState } from 'react';
import ChartCard, { ChartLegend, ChartTooltipCard } from './ChartCard';
import { CHART, DIVERGING } from './chartTheme';

/**
 * Signed values either side of a neutral zero line.
 *
 * Ported from the old page's `divergingBars()`. Two hues, one per direction, with
 * a grey zero rule between them -- never a single hue split by sign, which reads
 * as magnitude rather than polarity.
 */
const WIDTH = 900;
const LABEL_W = 90;
const PAD_R = 46;
const BAR_H = 11;
const ROW_H = 15.5;
const TOP = 6;
const BOTTOM = 22;

const DivergingBar = ({ chart }) => {
    const [tip, setTip] = useState(null);
    const items = chart.data;

    const plotW = WIDTH - LABEL_W * 2 - PAD_R + 44;
    const maxAbs = Math.max(...items.map((i) => Math.abs(i.value)));
    const height = TOP + items.length * ROW_H + BOTTOM;
    const cx = LABEL_W + plotW / 2;

    const legend = [
        { key: 'pos', label: chart.positiveLabel, color: DIVERGING.positive, marker: 'circle' },
        { key: 'neg', label: chart.negativeLabel, color: DIVERGING.negative, marker: 'square' },
    ];

    return (
        <ChartCard
            title={chart.title}
            subtitle={chart.subtitle}
            note={chart.note}
            description={chart.description}
            legend={<ChartLegend series={legend} />}
            table={{
                headers: ['Language', chart.valueHeader ?? 'Net'],
                rows: items.map((i) => [i.label, `${i.value >= 0 ? '+' : ''}${i.value}`]),
            }}
        >
            <div style={{ position: 'relative' }}>
                <svg
                    className="chart"
                    viewBox={`0 0 ${WIDTH} ${height}`}
                    role="img"
                    aria-label={chart.description ?? chart.title}
                >
                    <line
                        x1={cx}
                        x2={cx}
                        y1={TOP}
                        y2={height - BOTTOM}
                        stroke={CHART.axis}
                        strokeWidth={1}
                    />
                    {items.map((it, i) => {
                        const y = TOP + i * ROW_H;
                        const half = (Math.abs(it.value) / maxAbs) * (plotW / 2 - 8);
                        const isPos = it.value >= 0;
                        const color = isPos ? DIVERGING.positive : DIVERGING.negative;
                        return (
                            <g key={it.label}>
                                <text
                                    x={LABEL_W - 8}
                                    y={y + BAR_H - 1}
                                    className="row-label"
                                    textAnchor="end"
                                >
                                    {it.label}
                                </text>
                                <rect
                                    className="bar"
                                    x={isPos ? cx : cx - half}
                                    y={y}
                                    width={Math.max(1, half)}
                                    height={BAR_H}
                                    rx={3}
                                    fill={color}
                                    onMouseMove={(e) =>
                                        setTip({
                                            x: e.nativeEvent.offsetX,
                                            y: e.nativeEvent.offsetY,
                                            title: it.label,
                                            rows: [
                                                {
                                                    label: isPos
                                                        ? chart.positiveLabel
                                                        : chart.negativeLabel,
                                                    value: `${isPos ? '+' : ''}${it.value}`,
                                                    color,
                                                    marker: isPos ? 'circle' : 'square',
                                                },
                                            ],
                                        })
                                    }
                                    onMouseLeave={() => setTip(null)}
                                />
                                <text
                                    x={isPos ? cx + half + 6 : cx - half - 6}
                                    y={y + BAR_H - 1}
                                    className="bar-label"
                                    textAnchor={isPos ? 'start' : 'end'}
                                >
                                    {isPos ? '+' : ''}
                                    {it.value}
                                </text>
                            </g>
                        );
                    })}
                </svg>
                {tip && (
                    <ChartTooltipCard title={tip.title} rows={tip.rows} x={tip.x} y={tip.y} />
                )}
            </div>
        </ChartCard>
    );
};

export default DivergingBar;
