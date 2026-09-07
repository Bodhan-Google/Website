import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ResearchProblemsScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        const storedTarget = sessionStorage.getItem('bodhan-scroll-target');
        if (storedTarget) {
            sessionStorage.removeItem('bodhan-scroll-target');
            const element = document.getElementById(storedTarget);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }
        if (hash) {
            const targetId = hash.replace('#', '');
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }
        window.scrollTo(0, 0);
    }, [pathname, hash]);

    return null;
}
