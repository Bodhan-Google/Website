import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';

const fields = ['Name', 'Organization', 'Contact details', 'Message'];

const ContactPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[var(--bg-cream-50)]">
            <Navbar />

            <div className="pt-10 md:pt-16 pb-16 md:pb-24 px-4 md:px-6">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-10 md:mb-14"
                    >
                        <h1 className="text-3xl md:text-5xl font-semibold text-[#1A1A1A] mb-3 md:mb-4">
                            Get in <span className="text-[var(--text-orange-500)]">Touch</span>
                        </h1>
                        <p className="text-stone-600 text-base md:text-lg max-w-xl mx-auto">
                            Have a question or want to collaborate? We'd love to hear from you.
                        </p>
                    </motion.div>

                    {/* Contact Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[var(--text-orange-500)]">
                                <Mail size={20} />
                            </div>
                            <p className="text-gray-600 text-base">Reach us at</p>
                        </div>

                        <a
                            href="mailto:contact@bodhan.ai"
                            className="text-2xl md:text-3xl font-semibold text-[var(--text-orange-500)] hover:underline break-all"
                        >
                            contact@bodhan.ai
                        </a>

                        <p className="text-stone-600 text-base mt-6 mb-4">with the following information:</p>

                        <ul className="space-y-3">
                            {fields.map((field) => (
                                <li key={field} className="flex items-center gap-3 text-gray-700 text-base">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-orange-500)] flex-shrink-0" />
                                    {field}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ContactPage;
