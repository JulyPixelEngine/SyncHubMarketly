import { TabProvider } from '../components/Tabs';
import { DashboardLayout } from '../layouts/DashboardLayout';
import type { TabPanel } from '../components/Tabs';
import { DashboardPage } from '../pages/DashboardPage';
import { ProductsPage } from '../pages/ProductsPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { CustomersPage } from '../pages/CustomersPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ScraperPage } from '../pages/ScraperPage';

const tabPanels: TabPanel[] = [
  { code: 'DASHBOARD', component: DashboardPage },
  { code: 'PRODUCTS', component: ProductsPage },
  { code: 'ANALYTICS', component: AnalyticsPage },
  { code: 'CUSTOMERS', component: CustomersPage },
  { code: 'SETTINGS', component: SettingsPage },
  { code: 'SCRAPER', component: ScraperPage },
];

function App() {
  return (
    <TabProvider defaultTab={{ id: 'DASHBOARD', label: 'Dashboard' }}>
      <DashboardLayout tabPanels={tabPanels} />
    </TabProvider>
  );
}

export default App;
