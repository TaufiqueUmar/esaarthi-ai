import React, { useState } from 'react';
import DashboardHeader from '../../components/admin/dashboard/DashboardHeader';
import SummaryCards from '../../components/admin/dashboard/SummaryCards';
import RequestTable from '../../components/admin/dashboard/RequestTable';
import Sidebar from '../../components/admin/Sidebar';
import ServiceRequests from './ServiceRequests';
import BillPayments from './BillPayments';
import Users from './Users';
import Reports from './Reports';
import TechnicianPerformance from './TechnicianPerformance';

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState('dashboard');

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return (
                    <>
                        <SummaryCards />
                        <RequestTable />
                    </>
                );
            case 'service-requests':
                return <ServiceRequests />;
            case 'bill-payments':
                return <BillPayments />;
            case 'users':
                return <Users />;
            case 'reports':
                return <Reports />;
            case 'technician-performance':
                return <TechnicianPerformance />;
            default:
                return null;
        }
    };

    return (
        <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
            <DashboardHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activePage={activePage}
                onPageChange={setActivePage}
            />
            <main className="flex-1 p-8 flex flex-col max-w-[1920px] mx-auto w-full overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
}

export default Dashboard;