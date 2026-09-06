import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { RESEARCH_VERTICALS, GRAND_CHALLENGES } from '../data';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center text-sm text-stone-600 mb-8 overflow-x-auto whitespace-nowrap">
      <Link to="/" className="hover:text-bodhan-orange transition-colors flex items-center">
        <Home size={16} className="mr-1" />
        Home
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        let displayName = value;
        
        // Resolve IDs to Titles
        if (pathnames[index-1] === 'vertical') {
            const vertical = RESEARCH_VERTICALS.find(v => v.id === value);
            if (vertical) displayName = vertical.shortTitle || vertical.title;
        } else if (pathnames[index-1] === 'grand-challenge') {
            const challenge = GRAND_CHALLENGES.find(c => c.id === value);
            if (challenge) displayName = challenge.title;
        } else if (pathnames[index-1] === 'problem') {
             const verticalId = pathnames[index-2];
             const vertical = RESEARCH_VERTICALS.find(v => v.id === verticalId);
             const problem = vertical?.problems.find(p => p.id === value);
             if (problem) displayName = problem.title.length > 20 ? problem.title.substring(0,20) + '...' : problem.title;
        } else if (value === 'vertical' || value === 'problem' || value === 'grand-challenge') {
            return null; // Skip connector routes
        }

        return (
          <React.Fragment key={to}>
            <ChevronRight size={16} className="mx-2 text-gray-600 flex-shrink-0" />
            {isLast ? (
              <span className="font-semibold text-gray-900">{displayName}</span>
            ) : (
              <Link to={to} className="hover:text-bodhan-orange transition-colors">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
