import React from 'react';
import { FacebookIcon, LinkedinIcon, InstagramIcon } from 'lucide-react';

const XIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const RedditIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 0-.463.327.327 0 0 0-.462 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.231-.094z" />
    </svg>
);

const socialLinks = [
    { icon: LinkedinIcon, href: "https://www.linkedin.com/company/bodhan-ai", label: "LinkedIn", hoverColor: "hover:text-[#0A66C2]" },
    { icon: FacebookIcon, href: "https://www.facebook.com/profile.php?id=61587090951907", label: "Facebook", hoverColor: "hover:text-[#1877F2]" },
    { icon: XIcon, href: "https://x.com/Bodhan_AI", label: "X", hoverColor: "hover:text-black", isCustom: true },
    { icon: RedditIcon, href: "https://www.reddit.com/user/Bodhan-AI/", label: "Reddit", hoverColor: "hover:text-[#FF4500]", isCustom: true },
    { icon: InstagramIcon, href: "https://www.instagram.com/bodhan_ai/", label: "Instagram", hoverColor: "hover:text-[#E4405F]" },
];

const Footer = () => {
    return (
        <footer className="w-full bg-[var(--bg-cream-50)] py-4 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Top Section: Logo and Social Icons */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                    {/* Left: Logo + identity line */}
                    <div className="mb-2 md:mb-0 text-center md:text-left">
                        <div className="text-2xl font-400 text-gray-900">
                            Bodhan<span className="text-[var(--text-orange-500)]">.AI</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Centre of Excellence for AI in Education
                        </p>
                    </div>

                    {/* Right: Social Icons */}
                    <div className="flex space-x-3 pb-2 md:pb-0">
                        {socialLinks.map(({ icon: Icon, href, label, hoverColor, isCustom }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className={`text-gray-400 ${hoverColor} transition-colors duration-200 p-2 bg-white rounded-full shadow-sm hover:shadow-md group`}
                            >
                                {isCustom ? (
                                    <Icon size={20} />
                                ) : (
                                    <Icon size={20} className="group-hover:scale-110 transition-transform" />
                                )}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Separator Line */}
                <div className="w-full h-px bg-gray-300 mb-4"></div>

                {/* Bottom: Copyright */}
                <div className="text-center text-sm text-gray-500">
                    Copyright © 2026 bodhan.ai
                </div>
            </div>
        </footer>
    );
};

export default Footer;
