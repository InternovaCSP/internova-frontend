import { Outlet } from 'react-router-dom';
import TopNavbar from '../components/navigation/TopNavbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <TopNavbar />
      <main id="main-content">
        <Outlet />
      </main>
    </div>
  );
}
