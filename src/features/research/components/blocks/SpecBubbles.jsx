/**
 * Hero stat bubbles — languages, parameters, modalities, licence.
 *
 * Kept to `{ label, value }` pairs so a team can list whatever is meaningful
 * for their model without the template prescribing a fixed set of fields.
 */
const SpecBubbles = ({ specs = [], className = '' }) => {
    if (!specs.length) return null;

    return (
        <div className={`bt-spec-row ${className}`}>
            {specs.map(({ label, value }) => (
                <span key={label} className="bt-spec">
                    <span className="bt-spec-label">{label}</span>
                    <span className="bt-spec-value">{value}</span>
                </span>
            ))}
        </div>
    );
};

export default SpecBubbles;
