import { AudioLines, FileText, Languages, Mic } from 'lucide-react';

const ICONS = {
    mic: Mic,
    speaker: AudioLines,
    document: FileText,
    languages: Languages,
};

const ModelIcon = ({ name, size = 18 }) => {
    const Icon = ICONS[name] ?? FileText;
    return <Icon size={size} aria-hidden="true" />;
};

export default ModelIcon;
