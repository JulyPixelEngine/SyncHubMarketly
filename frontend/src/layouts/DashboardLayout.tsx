import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useSidebar } from '../hooks/useSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { collapsed, toggle } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <TopNav sidebarCollapsed={collapsed} onMenuToggle={toggle} />
      <main
        className={`pt-16 transition-all duration-300 ${
          collapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
