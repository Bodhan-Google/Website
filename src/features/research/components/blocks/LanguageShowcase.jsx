import { useState } from 'react';
import CultureBackdrop from '../../../developers/components/models/CultureBackdrop';
import { getTheme } from '../../../developers/data/cultureThemes';
import SampleAudio from './SampleAudio';

/**
 * Section 3 — languages across India, as a picker rather than a table.
 *
 * A long language table is unreadable and unmemorable; one region at a time,
 * with its own script and motif, is neither. Each entry:
 *   { region, language, themeKey, audio?, input, output, romanized?, note? }
 */
const LanguageShowcase = ({ entries = [], caption }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!entries.length) return null;

    const active = entries[Math.min(activeIndex, entries.length - 1)];
    const theme = getTheme(active.themeKey ?? active.language);

    return (
        <div className="bt-lang" style={{ '--bt-accent': theme.accent }}>
            <div className="bt-lang-rail" role="tablist" aria-label="Languages">
                {entries.map((entry, index) => {
                    const entryTheme = getTheme(entry.themeKey ?? entry.language);
                    const selected = index === activeIndex;

                    return (
                        <button
                            key={`${entry.region}-${entry.language}`}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            className="bt-lang-chip"
                            style={{ '--bt-accent': entryTheme.accent }}
                            onClick={() => setActiveIndex(index)}
                        >
                            <span className="bt-lang-chip-glyph" aria-hidden="true">
                                {entryTheme.glyphs?.[0]}
                            </span>
                            {entry.language}
                        </button>
                    );
                })}
            </div>

            <div className="bt-card bt-lang-panel">
                <CultureBackdrop theme={theme} />

                <div className="culture-content">
                    <div className="bt-lang-panel-head">
                        <p className="bt-lang-region">
                            {active.language}
                            <small>{active.region}</small>
                        </p>
                        <SampleAudio
                            src={active.audio}
                            accent={theme.accent}
                            caption={active.audioCaption ?? 'Source audio'}
                            label={`Play ${active.language} sample`}
                        />
                    </div>

                    <div className="bt-io">
                        {active.input && (
                            <div className="bt-io-row">
                                <span className="bt-io-label">Spoken</span>
                                <span className="bt-io-value" data-muted="true">
                                    {active.input}
                                </span>
                            </div>
                        )}

                        <div className="bt-io-row">
                            <span className="bt-io-label">Transcription</span>
                            {active.output ? (
                                <span className="bt-io-value" data-script="native" lang={active.langCode}>
                                    {active.output}
                                </span>
                            ) : (
                                <span className="bt-io-value" data-muted="true">
                                    Clip and transcription being prepared for this language.
                                </span>
                            )}
                        </div>

                        {active.romanized && (
                            <div className="bt-io-row">
                                <span className="bt-io-label">Romanized</span>
                                <span className="bt-io-value">{active.romanized}</span>
                            </div>
                        )}

                        {active.note && (
                            <div className="bt-io-row">
                                <span className="bt-io-label">Note</span>
                                <span className="bt-io-value" data-muted="true">
                                    {active.note}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {caption && (
                <p className="bt-eyebrow" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                    {caption}
                </p>
            )}
        </div>
    );
};

export default LanguageShowcase;
