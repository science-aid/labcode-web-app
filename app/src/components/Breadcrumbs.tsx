import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbLabels: { [key: string]: string } = {
    operations: 'Operation list',
    runs: 'Run list',
    processes: 'Process View'
  };

  // Determine if a breadcrumb segment should be clickable
  const isClickable = (index: number): boolean => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;

    // Last segment is never clickable
    if (isLast) return false;

    // Define valid routes that can be navigated to
    const validRoutes = [
      '/runs',
      '/operations'
    ];

    // Check if it's a valid route
    if (validRoutes.includes(routeTo)) return true;

    // For /runs/:id or /runs/:id/processes patterns, make "runs" clickable
    if (pathnames[0] === 'runs' && index === 0) {
      return true;
    }

    // Check if it's a detail page pattern like /runs/:id
    if (pathnames[0] === 'runs' && pathnames.length >= 2 && index <= 1) {
      return true;
    }

    // Otherwise, not clickable
    return false;
  };

  // Get the actual route to navigate to
  const getRouteTarget = (index: number): string => {
    return `/${pathnames.slice(0, index + 1).join('/')}`;
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link
        to="/"
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      {pathnames.map((name, index) => {
        const isLast = index === pathnames.length - 1;
        const label = breadcrumbLabels[name] || name;
        const clickable = isClickable(index);
        const routeTo = getRouteTarget(index);

        return (
          <React.Fragment key={`${routeTo}-${index}`}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast || !clickable ? (
              <span className={isLast ? 'font-medium text-gray-900' : 'text-gray-500'}>
                {label}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-blue-600 transition-colors"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};