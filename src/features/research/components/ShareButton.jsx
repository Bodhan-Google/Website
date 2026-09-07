import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

const ShareButton = ({ title }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            } catch {
                // fall through to copy
            }
        }

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard unavailable
        }
    };

    return (
        <button
            type="button"
            onClick={handleShare}
            aria-label={copied ? 'Link copied' : 'Share publication'}
            className={`research-share-button ${copied ? 'is-copied' : ''}`}
        >
            {copied ? <Check size={15} strokeWidth={2.5} /> : <Share2 size={15} strokeWidth={2} />}
        </button>
    );
};

export default ShareButton;
