import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useSidebar } from '../hooks/useSidebar';
import { TabBar, TabContent, type TabPanel } from '../components/Tabs';

interface DashboardLayoutProps {
  tabPanels: TabPanel[];
}

export function DashboardLayout({ tabPanels }: DashboardLayoutProps) {
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
        <TabBar />
        <div className="p-6">
          <TabContent panels={tabPanels} />
        </div>
      </main>
    </div>
  );
}
