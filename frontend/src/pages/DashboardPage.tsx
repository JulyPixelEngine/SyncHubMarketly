import { StatCard } from '../components/StatCard';
import { ChartPlaceholder } from '../components/ChartPlaceholder';
import { ActivityTable, ActivityItem } from '../components/ActivityTable';

const sampleActivities: ActivityItem[] = [
  { id: '1', user: 'Alice Kim', action: 'Added product', target: 'Wireless Headphones Pro', date: '2 min ago' },
  { id: '2', user: 'Bob Lee', action: 'Updated price', target: 'Smart Watch X200', date: '15 min ago' },
  { id: '3', user: 'Carol Park', action: 'Deleted listing', target: 'Old Keyboard Model', date: '1 hour ago' },
  { id: '4', user: 'David Choi', action: 'Synced inventory', target: 'Shopify Store', date: '3 hours ago' },
  { id: '5', user: 'Eve Yoon', action: 'Generated report', target: 'Monthly Analytics', date: '5 hours ago' },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"
            value="1,284"
            change="12.5%"
            changeType="up"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          <StatCard
            title="Revenue"
            value="$48,352"
            change="8.2%"
            changeType="up"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Active Customers"
            value="3,427"
            change="3.1%"
            changeType="down"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <StatCard
            title="Sync Sources"
            value="12"
            change="2"
            changeType="up"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          />
        </div>
      </section>

      {/* Analytics */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartPlaceholder title="Revenue Over Time" />
          <ChartPlaceholder title="Product Categories" />
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <ActivityTable items={sampleActivities} />
      </section>
    </div>
  );
}
