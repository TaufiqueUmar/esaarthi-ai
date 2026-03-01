import React from 'react';

function getPriority(deadline) {
    const now = new Date();
    const dl = new Date(deadline);
    const hoursLeft = (dl - now) / (1000 * 60 * 60);
    if (hoursLeft < 0) return 'Overdue';
    if (hoursLeft < 24) return 'High';
    return 'Normal';
}

const priorityOrder = { Overdue: 0, High: 1, Normal: 2 };

const priorityBadge = {
    Overdue: 'bg-red-100 text-red-700',
    High: 'bg-amber-100 text-amber-700',
    Normal: 'bg-slate-100 text-slate-600',
};

function TechDashboard({ tasks, onOpenTask }) {
    // Compute priorities
    const tasksWithPriority = tasks.map(t => ({ ...t, priority: t.status === 'Overdue' ? 'Overdue' : getPriority(t.deadline) }));

    // Sort: Overdue → High → Normal
    const sorted = [...tasksWithPriority].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Summary counts
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const high = tasksWithPriority.filter(t => t.priority === 'High').length;
    const overdue = tasksWithPriority.filter(t => t.priority === 'Overdue').length;
    const completedToday = 3; // mock

    const formatDeadline = (dl) => {
        const d = new Date(dl);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) +
            ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div className="p-4">
            {/* Summary Cards — 2×2 grid, no scroll */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <SummaryCard label="Pending Visits" value={pending} />
                <SummaryCard label="High Priority" value={high} highlight="amber" />
                <SummaryCard label="Overdue" value={overdue} highlight="red" />
                <SummaryCard label="Done Today" value={completedToday} highlight="green" />
            </div>

            {/* Task Cards */}
            <h2 className="text-base font-bold text-slate-800 mb-3">Assigned Tasks</h2>
            <div className="space-y-3">
                {sorted.map((task) => (
                    <div key={task.id} className="bg-white border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <div className="text-sm font-bold text-slate-800">{task.id}</div>
                                <div className="text-sm text-slate-500">{task.serviceType} · {task.requestType}</div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityBadge[task.priority]}`}>
                                {task.priority}
                            </span>
                        </div>
                        <div className="text-sm text-slate-600 mb-1">
                            <svg className="w-4 h-4 inline mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {task.address}
                        </div>
                        <div className="text-sm text-slate-500 mb-3">
                            <svg className="w-4 h-4 inline mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {formatDeadline(task.deadline)}
                        </div>
                        <button
                            onClick={() => onOpenTask(task)}
                            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
                            style={{ backgroundColor: '#1a078a' }}
                        >
                            Open Task
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SummaryCard({ label, value, highlight }) {
    const bg = highlight === 'red' ? 'border-red-200 bg-red-50'
        : highlight === 'amber' ? 'border-amber-200 bg-amber-50'
            : highlight === 'green' ? 'border-green-200 bg-green-50'
                : 'border-slate-200 bg-white';
    const textColor = highlight === 'red' ? 'text-red-700'
        : highlight === 'amber' ? 'text-amber-700'
            : highlight === 'green' ? 'text-green-700'
                : 'text-slate-800';

    return (
        <div className={`rounded-lg border p-4 ${bg}`}>
            <div className="text-xs text-slate-500 mb-2">{label}</div>
            <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
        </div>
    );
}

export default TechDashboard;
