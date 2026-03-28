import { Outlet } from 'react-router';
import { FinancialHeader } from './FinancialHeader';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <FinancialHeader />
      <main className="pt-14 pb-20 lg:pb-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}