import React, { useState, useRef, useEffect } from 'react';
import TechDashboard from '../../pages/technician/TechDashboard';
import TaskDetail from '../../pages/technician/TaskDetail';
import TechHistory from '../../pages/technician/TechHistory';
import TechPerformance from '../../pages/technician/TechPerformance';

// --- Shared mock data ---
export const allTasks = [
    { id: 'REQ-2026-081', serviceType: 'Gas', requestType: 'New Connection', address: '12, Sector 5, Gandhinagar', citizenName: 'Rahul Sharma', phone: '9876543210', deadline: '2026-02-27T14:00:00', status: 'Pending', notes: 'Ground floor, near main gate. Ask for Rahul.' },
    { id: 'REQ-2026-083', serviceType: 'Water', requestType: 'New Connection', address: '56, Civil Lines, Surat', citizenName: 'Vikram Singh', phone: '9988776655', deadline: '2026-02-27T10:00:00', status: 'Pending', notes: 'Old pipeline needs replacement first.' },
    { id: 'REQ-2026-086', serviceType: 'Water', requestType: 'Complaint', address: '23, Paldi, Ahmedabad', citizenName: 'Meena Iyer', phone: '9123456789', deadline: '2026-02-25T16:00:00', status: 'Overdue', notes: 'Leakage in kitchen pipe. Urgent.' },
    { id: 'REQ-2026-084', serviceType: 'Gas', requestType: 'Complaint', address: '78, Navrangpura, Ahmedabad', citizenName: 'Anjali Gupta', phone: '9871234567', deadline: '2026-02-28T12:00:00', status: 'Pending', notes: '' },
    { id: 'REQ-2026-087', serviceType: 'Gas', requestType: 'New Connection', address: '45, Satellite, Ahmedabad', citizenName: 'Deepak Joshi', phone: '9876501234', deadline: '2026-03-02T09:00:00', status: 'Pending', notes: 'Second floor apartment.' },
    { id: 'REQ-2026-088', serviceType: 'Electricity', requestType: 'Complaint', address: '67, Maninagar, Ahmedabad', citizenName: 'Kavita Mehta', phone: '9854321098', deadline: '2026-02-27T18:00:00', status: 'Pending', notes: 'Meter reading issue.' },
];

export const completedTasks = [
    { id: 'REQ-2026-075', serviceType: 'Electricity', requestType: 'New Connection', completedDate: '2026-02-26', status: 'Completed' },
    { id: 'REQ-2026-072', serviceType: 'Gas', requestType: 'Complaint', completedDate: '2026-02-25', status: 'Completed' },
    { id: 'REQ-2026-068', serviceType: 'Water', requestType: 'New Connection', completedDate: '2026-02-24', status: 'Completed' },
    { id: 'REQ-2026-065', serviceType: 'Electricity', requestType: 'Complaint', completedDate: '2026-02-23', status: 'Not Feasible' },
    { id: 'REQ-2026-060', serviceType: 'Gas', requestType: 'New Connection', completedDate: '2026-02-22', status: 'Completed' },
];

function TechLayout() {
    const [activePage, setActivePage] = useState('dashboard');
    const [selectedTask, setSelectedTask] = useState(null);
    const mainRef = useRef(null);

    // Reset scroll to top whenever the active page changes
    useEffect(() => {
        window.scrollTo(0, 0);
        if (mainRef.current) {
            mainRef.current.scrollTop = 0;
        }
    }, [activePage]);

    const handleOpenTask = (task) => {
        setSelectedTask(task);
        setActivePage('task-detail');
    };

    const handleBackToDashboard = () => {
        setSelectedTask(null);
        setActivePage('dashboard');
    };

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <TechDashboard tasks={allTasks} onOpenTask={handleOpenTask} />;
            case 'task-detail':
                return <TaskDetail task={selectedTask} onBack={handleBackToDashboard} />;
            case 'history':
                return <TechHistory tasks={completedTasks} />;
            case 'performance':
                return <TechPerformance />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans max-w-lg mx-auto relative">
            {/* Top Header */}
            <header className="h-16 flex items-center justify-between px-4 shrink-0 sticky top-0 z-20" style={{ backgroundColor: '#1a078a' }}>
                <div className="flex items-center gap-3">
                    <img src="/eSaarthi.svg" alt="eSaarthi" className="h-13 w-auto" />
                    <span className="text-white font-semibold text-base">eSaarthi</span>
                </div>
                <div className="text-right">
                    <div className="text-white text-sm font-medium">Amit Kumar</div>
                    <div className="text-white/50 text-xs">Technician</div>
                </div>
            </header>

            {/* Page Content */}
            <main ref={mainRef} className="flex-1 overflow-y-auto pb-20">
                {renderPage()}
            </main>

            {/* Bottom Navigation */}
            {activePage !== 'task-detail' && (
                <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-slate-200 flex z-30">
                    <button
                        onClick={() => { setActivePage('dashboard'); setSelectedTask(null); }}
                        className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${activePage === 'dashboard' ? 'text-blue-700' : 'text-slate-400'}`}
                    >
                        <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" /></svg>
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActivePage('history')}
                        className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${activePage === 'history' ? 'text-blue-700' : 'text-slate-400'}`}
                    >
                        <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        History
                    </button>
                    <button
                        onClick={() => setActivePage('performance')}
                        className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${activePage === 'performance' ? 'text-blue-700' : 'text-slate-400'}`}
                    >
                        <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Performance
                    </button>
                </nav>
            )}
        </div>
    );
}

export default TechLayout;
