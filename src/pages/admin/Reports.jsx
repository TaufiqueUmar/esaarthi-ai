import React, { useState } from 'react';

// --- Mock Data ---
const servicePerformance = {
    totalRequests: 1248, completed: 890, pending: 342, overdue: 16, avgResolutionTime: '2.4 days',
};

const technicianData = [
    { name: 'Amit Kumar', assigned: 185, completed: 162, overdue: 4, avgTime: '1.8 days' },
    { name: 'Ramesh Yadav', assigned: 170, completed: 145, overdue: 6, avgTime: '2.1 days' },
    { name: 'Neha Sharma', assigned: 160, completed: 150, overdue: 2, avgTime: '1.5 days' },
    { name: 'Karan Singh', assigned: 155, completed: 130, overdue: 3, avgTime: '2.3 days' },
    { name: 'Priya Verma', assigned: 140, completed: 128, overdue: 1, avgTime: '1.9 days' },
];

const paymentData = {
    totalTransactions: 3420, totalRevenue: 1856000, failedTransactions: 87,
    serviceBreakdown: [
        { service: 'Gas', revenue: 620000, count: 1150 },
        { service: 'Electricity', revenue: 890000, count: 1580 },
        { service: 'Water', revenue: 346000, count: 690 },
    ],
};

const requestTypeBreakdown = [
    { label: 'New Connections', count: 520 },
    { label: 'Complaints', count: 480 },
    { label: 'Bill Queries', count: 248 },
];

const totalBreakdown = requestTypeBreakdown.reduce((s, d) => s + d.count, 0);

// --- Horizontal Bar (minimal, monochrome) ---
function HorizontalBar({ data, maxValue }) {
    return (
        <div className="space-y-4">
            {data.map((item, i) => (
                <div key={i}>
                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>{item.label}</span>
                        <span className="font-semibold text-slate-800">{item.count} <span className="font-normal text-slate-400">({((item.count / totalBreakdown) * 100).toFixed(1)}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-100 h-5 rounded">
                        <div
                            className="h-full rounded bg-slate-500 transition-all duration-500"
                            style={{ width: `${(item.count / maxValue) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- Summary Stat (no border color, just structure) ---
function Stat({ label, value, sub }) {
    return (
        <div className="bg-white border border-slate-200 rounded p-4 flex-1 min-w-[160px]">
            <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{value}</div>
            {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
        </div>
    );
}

// --- Section Header with Export ---
function SectionHeader({ title, onExport }) {
    return (
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">{title}</h2>
            {onExport && (
                <button
                    onClick={onExport}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-300 rounded px-3 py-1.5 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export
                </button>
            )}
        </div>
    );
}

// --- Export helper (CSV download) ---
function exportCSV(filename, headers, rows) {
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function Reports() {
    const [fromDate, setFromDate] = useState('2026-02-01');
    const [toDate, setToDate] = useState('2026-02-27');

    const maxBreakdown = Math.max(...requestTypeBreakdown.map(d => d.count));

    return (
        <div className="flex-1 flex flex-col overflow-y-auto gap-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Monitor service performance and technician efficiency</p>
                </div>
            </div>

            {/* Date Range */}
            <div className="bg-white border border-slate-200 rounded px-5 py-3 flex items-center gap-4 flex-wrap">
                <span className="text-sm font-medium text-slate-600">Period:</span>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500">From</label>
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400" />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500">To</label>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400" />
                </div>
                <button className="ml-auto text-sm text-slate-500 hover:text-slate-700 border border-slate-300 rounded px-3 py-1.5 flex items-center gap-1.5 transition-colors"
                    onClick={() => window.print()}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Print
                </button>
            </div>

            {/* ===== 1. Request Type Breakdown (Chart First) ===== */}
            <section>
                <SectionHeader title="Request Type Breakdown" />
                <div className="bg-white border border-slate-200 rounded p-5">
                    <HorizontalBar data={requestTypeBreakdown} maxValue={maxBreakdown} />
                </div>
            </section>

            {/* ===== 2. Service Performance Summary ===== */}
            <section>
                <SectionHeader title="Service Performance" onExport={() => exportCSV('service_performance.csv',
                    ['Metric', 'Value'],
                    [['Total Requests', servicePerformance.totalRequests], ['Completed', servicePerformance.completed], ['Pending', servicePerformance.pending], ['Overdue', servicePerformance.overdue], ['Avg Resolution Time', servicePerformance.avgResolutionTime]]
                )} />
                <div className="flex gap-4 flex-wrap">
                    <Stat label="Total Requests" value={servicePerformance.totalRequests.toLocaleString()} />
                    <Stat label="Completed" value={servicePerformance.completed.toLocaleString()} />
                    <Stat label="Pending" value={servicePerformance.pending.toLocaleString()} />
                    <Stat label="Overdue" value={servicePerformance.overdue.toLocaleString()} />
                    <Stat label="Avg Resolution" value={servicePerformance.avgResolutionTime} />
                </div>
            </section>

            {/* ===== 3. Technician Performance ===== */}
            <section>
                <SectionHeader title="Technician Performance" onExport={() => exportCSV('technician_performance.csv',
                    ['Name', 'Assigned', 'Completed', 'Overdue', 'Avg Time'],
                    technicianData.map(t => [t.name, t.assigned, t.completed, t.overdue, t.avgTime])
                )} />
                <div className="bg-white border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-5 py-3 font-semibold">Name</th>
                                <th className="px-5 py-3 font-semibold text-center">Assigned</th>
                                <th className="px-5 py-3 font-semibold text-center">Completed</th>
                                <th className="px-5 py-3 font-semibold text-center">Overdue</th>
                                <th className="px-5 py-3 font-semibold text-center">Avg Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {technicianData.map((tech) => (
                                <tr key={tech.name} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3.5 text-base font-medium text-slate-800">{tech.name}</td>
                                    <td className="px-5 py-3.5 text-base text-slate-700 text-center">{tech.assigned}</td>
                                    <td className="px-5 py-3.5 text-base text-slate-700 text-center">{tech.completed}</td>
                                    <td className="px-5 py-3.5 text-base text-slate-700 text-center">{tech.overdue}</td>
                                    <td className="px-5 py-3.5 text-base text-slate-600 text-center">{tech.avgTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ===== 4. Payment Report ===== */}
            <section className="mb-4">
                <SectionHeader title="Payment Summary" onExport={() => exportCSV('payment_report.csv',
                    ['Service', 'Transactions', 'Revenue'],
                    paymentData.serviceBreakdown.map(s => [s.service, s.count, s.revenue])
                )} />
                <div className="flex gap-4 flex-wrap mb-4">
                    <Stat label="Total Transactions" value={paymentData.totalTransactions.toLocaleString()} />
                    <Stat label="Total Revenue" value={`₹${paymentData.totalRevenue.toLocaleString('en-IN')}`} />
                    <Stat label="Failed" value={paymentData.failedTransactions.toLocaleString()} />
                </div>
                <div className="bg-white border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-5 py-3 font-semibold">Service</th>
                                <th className="px-5 py-3 font-semibold text-right">Transactions</th>
                                <th className="px-5 py-3 font-semibold text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paymentData.serviceBreakdown.map((svc) => (
                                <tr key={svc.service} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3.5 text-base font-medium text-slate-800">{svc.service}</td>
                                    <td className="px-5 py-3.5 text-base text-slate-700 text-right">{svc.count.toLocaleString()}</td>
                                    <td className="px-5 py-3.5 text-base font-semibold text-slate-800 text-right">₹{svc.revenue.toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Reports;
