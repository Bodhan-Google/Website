const KIND_LABELS = {
    chart: 'Chart',
    interactive: 'Interactive',
    image: 'Image / diagram',
    audio: 'Audio examples',
    table: 'Table',
    video: 'Video',
    text: 'Text passage',
};

/**
 * A reserved, visibly unfinished area.
 *
 * Templates that ship with plausible-looking filler get published with the
 * filler still in them. A dashed slot cannot be mistaken for finished work,
 * and it tells the author exactly what kind of thing belongs there.
 */
const SectionSlot = ({ kind = 'text', label, hint }) => (
    <div className="bt-slot" role="note">
        <span className="bt-slot-kind">Reserved · {KIND_LABELS[kind] ?? kind}</span>
        {label && <span className="bt-slot-label">{label}</span>}
        {hint && <span className="bt-slot-hint">{hint}</span>}
    </div>
);

export default SectionSlot;
