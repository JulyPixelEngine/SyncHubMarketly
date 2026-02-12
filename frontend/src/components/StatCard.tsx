import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: ReactNode;
}

export function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="flex items-center gap-1 text-sm">
        {changeType === 'up' ? (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
        <span className={changeType === 'up' ? 'text-green-600' : 'text-red-600'}>
          {change}
        </span>
        <span className="text-gray-400">vs last month</span>
      </div>
    </div>
  );
}
