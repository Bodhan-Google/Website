import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import { motion } from "motion/react";
import { Menu, X } from 'lucide-react';

import Icon from '../../../assets/Icon.png';
import LogoWithIcon from '../../../assets/Logo-with-icon.png';
import MoELogo from '../../../assets/Ministry_of_Education_India.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Animation variants
    const linkVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };

    const logoVariants = {
        hidden: { scale: 0.5, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20
            }
        }
    };

    const containerVariants = {
        visible: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.nav
            className="sticky top-0 z-50 w-full bg-[var(--navbar-bg)]"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 md:py-8 flex items-center justify-center lg:justify-between relative">

                {/* Desktop Left Links */}
                <div className="hidden lg:flex space-x-12">
                    <motion.div variants={linkVariants}>
                        <Link to="/" state={{ scrollTo: 'vision-mission' }} className="text-[var(--text-primary)]/90 hover:text-[var(--text-hover)] transition-colors font-medium">Vision</Link>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                        <a href="https://research.bodhan.ai" target="_blank" rel="noopener noreferrer" className="text-[var(--text-primary)]/90 hover:text-[var(--text-hover)] transition-colors font-medium">Research</a>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                        <Link to="/" state={{ scrollTo: 'team' }} className="text-[var(--text-primary)]/90 hover:text-[var(--text-hover)] transition-colors font-medium">Team</Link>
                    </motion.div>
                </div>

                {/* Mobile: Logo Center (justify-center) */}
                <motion.div
                    className={`flex flex-shrink-0 items-center justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2`}
                    variants={logoVariants}
                >
                    <div className="flex items-center gap-2 md:gap-3">
                        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                            <img src={MoELogo} alt="Ministry of Education" className="h-14 md:h-18 w-auto object-contain" />
                        </Link>
                        <div className="w-px h-10 md:h-14 bg-[var(--text-primary)]/20" />
                        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                            <img src={Icon} alt="Bodhan Icon" className="h-16 md:h-20 w-auto object-contain" />
                        </Link>
                    </div>
                </motion.div>

                {/* Desktop Right Links */}
                <div className="hidden lg:flex space-x-12">
                    <motion.div variants={linkVariants}>
                        <Link to="/careers" className="text-[var(--text-primary)]/90 hover:text-[var(--text-hover)] transition-colors font-medium" onClick={() => window.scrollTo(0, 0)}>Careers</Link>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                        <Link to="/contact" className="text-[var(--text-primary)]/90 hover:text-[var(--text-hover)] transition-colors font-medium" onClick={() => window.scrollTo(0, 0)}>Contact</Link>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                        <Link to="/tenders" className="text-[var(--text-primary)]/90 hover:text-[var(--text-hover)] transition-colors font-medium">Tenders</Link>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                        <Link to="/partners" className="text-[var(--text-primary)]/90 hover:text-[var(--text-hover)] transition-colors font-medium" onClick={() => window.scrollTo(0, 0)}>Partners</Link>
                    </motion.div>
                </div>

                {/* Mobile Hamburger Button */}
                <div className="lg:hidden absolute right-6">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-[var(--text-primary)] hover:text-orange-500 transition-colors p-2"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden overflow-hidden bg-[var(--navbar-bg)] border-t border-[var(--text-primary)]/5 absolute top-full left-0 w-full z-50 shadow-lg"
            >
                <div className="flex flex-col space-y-6 px-6 md:py-8 py-4 items-center text-lg font-medium">
                    <Link to="/" className="text-[var(--text-primary)]/90 hover:text-orange-500 transition-colors" onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}>Home</Link>
                    <Link to="/" state={{ scrollTo: 'vision-mission' }} className="text-[var(--text-primary)]/90 hover:text-orange-500 transition-colors" onClick={() => setIsOpen(false)}>Vision</Link>
                    <a href="https://research.bodhan.ai" target="_blank" rel="noopener noreferrer" className="text-[var(--text-primary)]/90 hover:text-orange-500 transition-colors" onClick={() => setIsOpen(false)}>Research</a>
                    <Link to="/" state={{ scrollTo: 'team' }} className="text-[var(--text-primary)]/90 hover:text-orange-500 transition-colors" onClick={() => setIsOpen(false)}>Team</Link>
                    <Link to="/careers" className="text-[var(--text-primary)]/90 hover:text-orange-500 transition-colors" onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}>Careers</Link>
                    <Link to="/contact" className="text-[var(--text-primary)]/90 hover:text-orange-500 transition-colors" onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}>Contact</Link>
                    <Link to="/tenders" className="text-[var(--text-primary)]/90 hover:text-orange-500 transition-colors" onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}>Tenders</Link>
                    <Link to="/partners" className="text-[var(--text-primary)]/90 hover:text-orange-500 transition-colors" onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}>Partners</Link>
                </div>
            </motion.div>
        
            <AnnouncementBar />
        </motion.nav>
    );
};

export default Navbar;
