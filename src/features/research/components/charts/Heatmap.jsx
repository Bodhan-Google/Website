import { useMemo, useState } from 'react';
import ChartCard, { ChartTooltipCard } from './ChartCard';
import { CHART, HEAT, lerpColor } from './chartTheme';

/**
 * A sortable value matrix: languages down the side, systems across the top.
 *
 * Ported from the old page's `heatmap()` builder. Behaviour kept: click a column
 * header to sort by it (clicking again reverses), hover a cell to cross-highlight
 * its row and column, and a single light-to-dark ramp for the values. The old
 * builder also had a "vs. best other" pill column, but both call sites passed
 * showWin:false, so it never rendered and is not carried over.
 *
 * 22 x 14 does not fit the article column, so the SVG keeps a min-width and the
 * wrapper scrolls. That wrapper -- not the page body -- is what scrolls sideways.
 */
const LABEL_W = 118;
const CELL_W = 44;
const CELL_H = 21;
const PAD = 4;

const Heatmap = ({ chart }) => {
    // `rowHeader` names the first column of the accessible data table. It is
    // 'Language' for the per-language matrices and something else whenever the
    // rows are not languages (olmOCR's rows are test categories).
    const { rowLabels, colLabels, matrix, domainMax = 75, digits = 2, rowHeader = 'Language' } = chart;
    const [sort, setSort] = useState({ col: -1, dir: -1 });
    const [hover, setHover] = useState(null);
    const [tip, setTip] = useState(null);

    const rows = useMemo(() => {
        const paired = rowLabels.map((label, i) => ({ label, row: matrix[i] }));
        if (sort.col < 0) return paired;
        // Missing values sort below every real one in either direction.
        return [...paired].sort((a, b) => {
            const va = a.row[sort.col] ?? -1;
            const vb = b.row[sort.col] ?? -1;
            return sort.dir * (vb - va);
        });
    }, [rowLabels, matrix, sort]);

    const headHeight = Math.max(
        90,
        Math.min(230, Math.max(...colLabels.map((c) => c.label.length)) * 6.4 + 26)
    );
    const gridW = colLabels.length * CELL_W;
    const width = PAD + LABEL_W + gridW + 10;
    const height = PAD + headHeight + rows.length * CELL_H + 8;

    const toggle = (ci) =>
        setSort((s) => (s.col === ci ? { col: ci, dir: -s.dir } : { col: ci, dir: -1 }));

    const dim = (ri, ci) =>
        hover && hover.ri !== ri && hover.ci !== ci ? 0.32 : 1;

    return (
        <ChartCard
            title={chart.title}
            subtitle={chart.subtitle}
            note={chart.note}
            description={chart.description}
            table={{
                headers: [rowHeader, ...colLabels.map((c) => c.label)],
                rows: rowLabels.map((label, i) => [
                    label,
                    ...matrix[i].map((v) => (v == null ? '—' : v.toFixed(digits))),
                ]),
            }}
        >
            <div className="hchart-scroll" style={{ position: 'relative' }}>
                <svg
                    className="chart"
                    viewBox={`0 0 ${width} ${height}`}
                    style={{ minWidth: 900 }}
                    role="img"
                    aria-label={chart.description ?? chart.title}
                >
                    {colLabels.map((cl, ci) => {
                        const cx = PAD + LABEL_W + ci * CELL_W + CELL_W / 2;
                        const cy = PAD + headHeight - 10;
                        const active = sort.col === ci;
                        return (
                            <g key={cl.label} transform={`rotate(-90 ${cx} ${cy})`}>
                                <text
                                    x={cx}
                                    y={cy}
                                    className="heat-col-label"
                                    textAnchor="start"
                                    fontWeight={cl.isOurs || active ? 700 : undefined}
                                    fill={
                                        active || hover?.ci === ci ? CHART.series.primary : undefined
                                    }
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => toggle(ci)}
                                >
                                    {cl.label}
                                    {cl.dagger ? ' †' : ''}
                                    {active ? (sort.dir === -1 ? ' ▾' : ' ▴') : ''}
                                </text>
                            </g>
                        );
                    })}

                    {colLabels.map((cl, ci) =>
                        cl.isOurs ? (
                            <line
                                key={`rule-${cl.label}`}
                                x1={PAD + LABEL_W + ci * CELL_W + 3}
                                x2={PAD + LABEL_W + (ci + 1) * CELL_W - 3}
                                y1={PAD + headHeight - 2}
                                y2={PAD + headHeight - 2}
                                stroke={CHART.series.primary}
                                strokeWidth={2}
                            />
                        ) : null
                    )}

                    {rows.map(({ label, row }, ri) => {
                        const ry = PAD + headHeight + ri * CELL_H;
                        return (
                            <g key={label}>
                                <text
                                    x={PAD + LABEL_W - 8}
                                    y={ry + CELL_H / 2 + 4}
                                    className="row-label"
                                    textAnchor="end"
                                    fill={hover?.ri === ri ? CHART.series.primary : undefined}
                                    fontWeight={hover?.ri === ri ? 700 : undefined}
                                >
                                    {label}
                                </text>
                                {colLabels.map((cl, ci) => {
                                    const v = row[ci];
                                    const cx = PAD + LABEL_W + ci * CELL_W;
                                    if (v == null) {
                                        return (
                                            <g key={cl.label} opacity={dim(ri, ci)}>
                                                <rect
                                                    className="cell"
                                                    x={cx + 1}
                                                    y={ry + 1}
                                                    width={CELL_W - 2}
                                                    height={CELL_H - 2}
                                                    rx={2}
                                                    fill={HEAT.missing}
                                                />
                                                <text
                                                    x={cx + CELL_W / 2}
                                                    y={ry + CELL_H / 2 + 3}
                                                    className="heat-cell-text"
                                                    textAnchor="middle"
                                                    fill={CHART.text.secondary}
                                                >
                                                    –
                                                </text>
                                            </g>
                                        );
                                    }
                                    const t = (v - 0) / (domainMax - 0);
                                    return (
                                        <g
                                            key={cl.label}
                                            opacity={dim(ri, ci)}
                                            onMouseEnter={() => setHover({ ri, ci })}
                                            onMouseLeave={() => {
                                                setHover(null);
                                                setTip(null);
                                            }}
                                            onMouseMove={(e) =>
                                                setTip({
                                                    x: e.nativeEvent.offsetX,
                                                    y: e.nativeEvent.offsetY,
                                                    title: label,
                                                    rows: [
                                                        {
                                                            label: cl.label,
                                                            value: v.toFixed(digits),
                                                            color: lerpColor(HEAT.lo, HEAT.hi, t),
                                                        },
                                                    ],
                                                })
                                            }
                                        >
                                            <rect
                                                className="cell"
                                                x={cx + 1}
                                                y={ry + 1}
                                                width={CELL_W - 2}
                                                height={CELL_H - 2}
                                                rx={2}
                                                fill={lerpColor(HEAT.lo, HEAT.hi, t)}
                                            />
                                            <text
                                                x={cx + CELL_W / 2}
                                                y={ry + CELL_H / 2 + 3}
                                                className="heat-cell-text"
                                                textAnchor="middle"
                                                fill={t > 0.52 ? '#fff' : CHART.text.primary}
                                            >
                                                {Math.round(v)}
                                            </text>
                                        </g>
                                    );
                                })}
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

export default Heatmap;
