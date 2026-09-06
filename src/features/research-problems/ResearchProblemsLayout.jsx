import { Outlet } from 'react-router-dom';
import Navbar from '../home/components/Navbar';
import Footer from '../home/components/Footer';
import ResearchProblemsScrollToTop from './ResearchProblemsScrollToTop';

export default function ResearchProblemsLayout() {
    return (
        <div className="research-problems-scope min-h-screen flex flex-col bg-cream-100 text-gray-900">
            <ResearchProblemsScrollToTop />
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
