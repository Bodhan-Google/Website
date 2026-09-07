import { useEffect, useId, useRef, useState } from 'react';

export const useContainerSize = () => {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        });

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return [ref, size];
};

export const ChartLegend = ({ series }) => {
    if (!series?.length) return null;

    return (
        <ul className="chart-legend" aria-label="Series legend">
            {series.map((item) => (
                <li key={item.key ?? item.label} className="chart-legend-item">
                    <span className={`chart-marker chart-marker-${item.marker}`} style={{ color: item.color }} />
                    <span>{item.label}</span>
                </li>
            ))}
        </ul>
    );
};

export const ChartTooltipCard = ({ title, rows, hint, x, y, bounds }) => {
    if (!title && !rows?.length) return null;

    const width = 220;
    const flipDown = y < 72;
    const left = bounds
        ? Math.min(Math.max(8, x - width / 2), Math.max(8, bounds.width - width - 8))
        : x;
    const top = bounds
        ? Math.min(Math.max(8, flipDown ? y + 10 : y - 8), bounds.height - 8)
        : y;

    return (
        <div
            className="chart-tooltip"
            role="status"
            style={{
                left,
                top,
                transform: flipDown ? 'none' : 'translateY(-100%)',
            }}
        >
            {title && <p className="chart-tooltip-title">{title}</p>}
            {rows?.map((row) => (
                <div key={row.label} className="chart-tooltip-row">
                    <span className="chart-tooltip-label">
                        <span className={`chart-marker chart-marker-${row.marker ?? 'circle'}`} style={{ color: row.color }} />
                        {row.label}
                    </span>
                    <span className="chart-tooltip-value">{row.value}</span>
                </div>
            ))}
            {hint && <p className="chart-tooltip-hint">{hint}</p>}
        </div>
    );
};

export const ChartDataTable = ({ caption, headers, rows }) => {
    const id = useId();

    return (
        <div className="chart-data sr-only">
            <div className="chart-data-panel">
                <table className="chart-data-table" aria-describedby={id}>
                    <caption id={id} className="sr-only">
                        {caption}
                    </caption>
                    <thead>
                        <tr>
                            {headers.map((header) => (
                                <th key={header} scope="col">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={row[0] ?? index}>
                                {row.map((cell, cellIndex) => (
                                    <td key={`${index}-${cellIndex}`} className={cellIndex === 0 ? 'chart-data-key' : undefined}>
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ChartCard = ({
    title,
    subtitle,
    note,
    description,
    legend,
    table,
    plotHeight,
    children,
}) => {
    const titleId = useId();
    const descId = useId();

    return (
        <figure className="chart-card" aria-labelledby={title ? titleId : undefined} aria-describedby={description ? descId : undefined}>
            {(title || subtitle) && (
                <figcaption className="chart-card-header">
                    {title && (
                        <h3 id={titleId} className="chart-card-title">
                            {title}
                        </h3>
                    )}
                    {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
                </figcaption>
            )}

            {description && (
                <p id={descId} className="sr-only">
                    {description}
                </p>
            )}

            <div className="chart-panel">
                {legend}
                <div className="chart-plot" style={plotHeight ? { height: plotHeight } : undefined}>
                    {children}
                </div>
            </div>

            {note && <p className="chart-card-note">{note}</p>}
            {table && <ChartDataTable caption={title} headers={table.headers} rows={table.rows} />}
        </figure>
    );
};

export default ChartCard;
