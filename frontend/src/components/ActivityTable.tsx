export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  date: string;
}

interface ActivityTableProps {
  items: ActivityItem[];
}

export function ActivityTable({ items }: ActivityTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                User
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Action
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Target
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-medium">
                      {item.user.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.user}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.action}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.target}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
