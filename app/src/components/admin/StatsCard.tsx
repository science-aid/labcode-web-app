import React from 'react';
import { Link } from 'react-router-dom';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor: string;
  link?: string;
  loading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  link,
  loading = false,
}) => {
  const content = (
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${iconBgColor}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        {loading ? (
          <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );

  if (link) {
    return (
      <Link
        to={link}
        className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
      >
        {content}
      </Link>
    );
  }

  return <div className="bg-white rounded-lg shadow p-6">{content}</div>;
};
