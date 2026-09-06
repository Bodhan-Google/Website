/**
 * The Bodhan.AI wordmark, exactly as the home hero sets it: "Bodhan" at normal
 * weight in ink, the dot and "AI" in brand orange with "AI" extralight.
 * Use this everywhere the name is typeset so weight and colour never drift.
 *
 * Size and spacing come from `className` (e.g. "text-2xl", "text-[6rem]").
 */
const Wordmark = ({ className = '', as: Tag = 'span' }) => (
    <Tag className={`font-poppins tracking-tight text-[#0a0a0a] ${className}`}>
        <span className="font-normal">Bodhan</span>
        <span className="text-[var(--primary-500)] font-normal">.</span>
        <span className="text-[var(--primary-500)] font-extralight">AI</span>
    </Tag>
);

export default Wordmark;
