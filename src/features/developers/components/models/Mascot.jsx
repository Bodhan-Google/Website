const Mascot = ({ mood = 'read', accent = 'var(--text-orange-500)', size = 96, active = false }) => (
    <div
        className={`mascot mascot-${mood}${active ? ' is-active' : ''}`}
        style={{ '--mascot-accent': accent, width: size, height: size }}
        aria-hidden="true"
    >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle className="mascot-body" cx="50" cy="52" r="38" />
            {mood === 'listen' && (
                <>
                    <circle className="mascot-ring mascot-ring-1" cx="50" cy="52" r="38" />
                    <circle className="mascot-ring mascot-ring-2" cx="50" cy="52" r="38" />
                </>
            )}
            <g className="mascot-eye" style={{ transformOrigin: '38px 46px' }}>
                <circle cx="38" cy="46" r="5" />
                {mood === 'read' && <circle className="mascot-pupil" cx="38" cy="46" r="2" />}
            </g>
            <g className="mascot-eye" style={{ transformOrigin: '62px 46px', animationDelay: '0.15s' }}>
                <circle cx="62" cy="46" r="5" />
                {mood === 'read' && <circle className="mascot-pupil" cx="62" cy="46" r="2" style={{ animationDelay: '0.15s' }} />}
            </g>
            {mood === 'speak' ? (
                <ellipse className="mascot-mouth mascot-mouth-speak" cx="50" cy="66" rx="10" ry="6" />
            ) : (
                <path className="mascot-mouth mascot-mouth-still" d="M 40 66 Q 50 71 60 66" />
            )}
        </svg>
    </div>
);

export default Mascot;
