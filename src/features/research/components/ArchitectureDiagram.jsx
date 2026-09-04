import { useId, useState } from 'react';
import EditorialCard, { InnerPanel } from './EditorialCard';

const STAGES = [
    {
        id: 'speech',
        role: 'input',
        name: 'Multilingual speech',
        meta: '25 languages · 1.35M hours',
        detail: 'Bodhan Scribe was trained on 1.35 million hours of speech covering 25 Indian languages, including underserved languages such as Bhili.',
    },
    {
        id: 'encoder',
        role: 'process',
        name: 'Conformer encoder',
        meta: '32 layers · 600M parameters',
        detail: 'A 32-layer Conformer encoder with 600M parameters, part of the NVIDIA Canary architecture used by Bodhan Scribe.',
    },
    {
        id: 'decoder',
        role: 'process',
        name: 'Transformer decoder',
        meta: '24 layers · 600M parameters',
        detail: 'A 24-layer Transformer decoder with 600M parameters, paired with the encoder as a 1.2B-parameter Canary model.',
    },
    {
        id: 'vocab',
        role: 'shared',
        name: '6K vocabulary',
        meta: 'Shared multilingual tokens',
        detail: 'A 6K vocabulary provides the shared multilingual representation used for transcription.',
    },
    {
        id: 'transcript',
        role: 'output',
        name: 'Transcript',
        meta: 'Native-script or Romanized',
        detail: 'Output can be native-script, code-mixed, or Romanized. The same model supports streaming and offline inference.',
    },
];

const CAPABILITIES = ['Native script', 'Code mixed', 'Romanized', 'Streaming', 'Offline'];

const ArchitectureDiagram = () => {
    const [activeId, setActiveId] = useState('encoder');
    const [hoverId, setHoverId] = useState(null);
    const labelId = useId();
    const active = STAGES.find((stage) => stage.id === activeId) ?? STAGES[1];
    const highlightId = hoverId ?? activeId;
    const highlightIndex = STAGES.findIndex((stage) => stage.id === highlightId);

    return (
        <EditorialCard
            eyebrow="Model architecture"
            title="NVIDIA Canary"
            description="Bodhan Scribe uses the NVIDIA Canary architecture: a 600M-parameter Conformer encoder and a 600M-parameter Transformer decoder sharing a 6K multilingual vocabulary."
            metrics={
                <dl className="editorial-summary">
                    <div>
                        <dt>Languages</dt>
                        <dd>25</dd>
                    </div>
                    <div>
                        <dt>Training hours</dt>
                        <dd>1.35M</dd>
                    </div>
                    <div>
                        <dt>Parameters</dt>
                        <dd>1.2B</dd>
                    </div>
                </dl>
            }
        >
            <InnerPanel>
                <p id={labelId} className="sr-only">
                    Architecture flow: multilingual speech enters a 32-layer Conformer encoder, then a 24-layer
                    Transformer decoder, then a 6K multilingual vocabulary, producing a native-script or Romanized
                    transcript. Native script, code mixed, Romanized, streaming, and offline are supported capabilities,
                    not extra model stages.
                </p>

                <ol className="arch-flow" aria-labelledby={labelId}>
                    {STAGES.map((stage, index) => {
                        const isActive = stage.id === activeId;
                        const isHighlight = stage.id === highlightId;
                        const onPath = Math.abs(index - highlightIndex) === 1 || isHighlight;
                        return (
                            <li key={stage.id} className="arch-step">
                                <button
                                    type="button"
                                    className={`arch-node arch-node-${stage.role}${isActive ? ' is-active' : ''}${onPath ? ' is-path' : ''}`}
                                    aria-pressed={isActive}
                                    aria-describedby="arch-stage-detail"
                                    onClick={() => setActiveId(stage.id)}
                                    onFocus={() => setActiveId(stage.id)}
                                    onMouseEnter={() => setHoverId(stage.id)}
                                    onMouseLeave={() => setHoverId(null)}
                                >
                                    <span className="arch-node-role">{stage.role}</span>
                                    <span className="arch-node-name">{stage.name}</span>
                                    <span className="arch-node-meta">{stage.meta}</span>
                                </button>
                                {index < STAGES.length - 1 && (
                                    <span
                                        className={`arch-connector${index === highlightIndex || index + 1 === highlightIndex ? ' is-path' : ''}`}
                                        aria-hidden="true"
                                    >
                                        <span />
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ol>

                <div id="arch-stage-detail" className="arch-detail" tabIndex={-1}>
                    <p className="arch-detail-kicker">Selected stage</p>
                    <p className="arch-detail-title">{active.name}</p>
                    <p>{active.detail}</p>
                </div>

                <div className="arch-capabilities">
                    <p className="arch-detail-kicker">Capabilities</p>
                    <ul>
                        {CAPABILITIES.map((capability) => (
                            <li key={capability}>{capability}</li>
                        ))}
                    </ul>
                </div>
            </InnerPanel>
        </EditorialCard>
    );
};

export default ArchitectureDiagram;
