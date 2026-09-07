import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { LANGUAGES } from './translateData';

/**
 * The 22-language selector. A listbox rather than a row of chips: twenty-two
 * unfamiliar scripts in a strip is a guessing game, so each option carries its
 * code, its English name and its own native spelling.
 */
const LangPicker = ({ value, onChange, label = 'Target language', exclude }) => {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);
    const options = exclude ? LANGUAGES.filter((l) => l.name !== exclude) : LANGUAGES;
    const current = LANGUAGES.find((l) => l.name === value) ?? LANGUAGES[5];

    useEffect(() => {
        if (!open) return undefined;
        const onDocDown = (event) => {
            if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
        };
        const onKey = (event) => {
            if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onDocDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <div className="itr-picker" ref={wrapRef}>
            <button
                type="button"
                className="itr-picker-btn"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-label={`${label}: ${current.name}`}
                onClick={() => setOpen((o) => !o)}
            >
                <span className="itr-picker-abbr">{current.abbr}</span>
                <span className="itr-picker-name">{current.name}</span>
                <span className="itr-picker-native" lang={current.code}>
                    {current.native}
                </span>
                <ChevronDown size={14} aria-hidden="true" className="itr-picker-chev" />
            </button>

            <ul className={`itr-picker-panel${open ? ' is-open' : ''}`} role="listbox" aria-label={label}>
                {options.map((lang) => (
                    <li key={lang.name} role="none">
                        <button
                            type="button"
                            role="option"
                            aria-selected={lang.name === value}
                            className="itr-picker-opt"
                            onClick={() => {
                                onChange(lang.name);
                                setOpen(false);
                            }}
                        >
                            <span className="itr-picker-opt-abbr">{lang.abbr}</span>
                            <span className="itr-picker-opt-name">{lang.name}</span>
                            <span className="itr-picker-opt-native" lang={lang.code}>
                                {lang.native}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LangPicker;
