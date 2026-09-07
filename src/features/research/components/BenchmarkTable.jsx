import EditorialCard, { InnerPanel } from './EditorialCard';

const BenchmarkTable = ({
    eyebrow = 'Evaluation',
    title = 'Benchmarks',
    description = 'Public datasets used to evaluate Bodhan ASR across conversational speech, read speech, low-resource languages, and multilingual scenarios.',
    caption,
    headers,
    rows,
}) => (
    <EditorialCard eyebrow={eyebrow} title={title} description={description}>
        <InnerPanel className="benchmark-panel">
            <div className="benchmark-scroll">
                <table className="benchmark-table">
                    {caption && <caption className="sr-only">{caption}</caption>}
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
                        {rows.map((row) => (
                            <tr key={row[0]}>
                                {row.map((cell, index) => {
                                    const Tag = index === 0 ? 'th' : 'td';
                                    return (
                                        <Tag key={`${row[0]}-${index}`} scope={index === 0 ? 'row' : undefined}>
                                            {cell}
                                        </Tag>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </InnerPanel>
    </EditorialCard>
);

export default BenchmarkTable;
