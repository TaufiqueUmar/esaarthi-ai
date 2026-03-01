import React, { useState } from 'react';

const allTransactions = [
    { txnId: "TXN-2026-001", consumerNo: "GJ-GAS-44821", name: "Rahul Sharma", serviceType: "Gas", amount: 1250, method: "UPI", status: "Success", dateTime: "2026-02-27T09:14:00" },
    { txnId: "TXN-2026-002", consumerNo: "GJ-ELEC-77650", name: "Priya Desai", serviceType: "Electricity", amount: 3420, method: "Card", status: "Success", dateTime: "2026-02-27T08:45:00" },
    { txnId: "TXN-2026-003", consumerNo: "GJ-WTR-33100", name: "Meena Iyer", serviceType: "Water", amount: 580, method: "Cash KIOSK", status: "Pending", dateTime: "2026-02-26T17:30:00" },
    { txnId: "TXN-2026-004", consumerNo: "GJ-GAS-44900", name: "Anjali Gupta", serviceType: "Gas", amount: 870, method: "UPI", status: "Failed", dateTime: "2026-02-26T15:10:00" },
    { txnId: "TXN-2026-005", consumerNo: "GJ-ELEC-88012", name: "Kavita Mehta", serviceType: "Electricity", amount: 2100, method: "UPI", status: "Success", dateTime: "2026-02-26T12:55:00" },
    { txnId: "TXN-2026-006", consumerNo: "GJ-GAS-44821", name: "Rahul Sharma", serviceType: "Gas", amount: 450, method: "Cash KIOSK", status: "Success", dateTime: "2026-02-25T11:20:00" },
    { txnId: "TXN-2026-007", consumerNo: "GJ-ELEC-77650", name: "Priya Desai", serviceType: "Electricity", amount: 1980, method: "Card", status: "Failed", dateTime: "2026-02-25T10:05:00" },
    { txnId: "TXN-2026-008", consumerNo: "GJ-WTR-55421", name: "Deepak Joshi", serviceType: "Water", amount: 320, method: "UPI", status: "Success", dateTime: "2026-02-24T16:40:00" },
    { txnId: "TXN-2026-009", consumerNo: "GJ-GAS-49120", name: "Suresh Patel", serviceType: "Gas", amount: 1650, method: "Card", status: "Pending", dateTime: "2026-02-24T14:22:00" },
    { txnId: "TXN-2026-010", consumerNo: "GJ-ELEC-90234", name: "Vikram Singh", serviceType: "Electricity", amount: 4100, method: "UPI", status: "Success", dateTime: "2026-02-23T09:10:00" },
];

const statusColors = {
    Success: 'bg-green-100 text-green-700',
    Failed: 'bg-red-100 text-red-700',
    Pending: 'bg-yellow-100 text-yellow-700',
};

const methodIcons = {
    UPI: '📲',
    Card: '💳',
    'Cash KIOSK': '🏧',
};

const serviceColors = {
    Gas: 'text-orange-600',
    Electricity: 'text-amber-600',
    Water: 'text-teal-600',
};

function BillPayments() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const filtered = allTransactions.filter((txn) => {
        const q = search.toLowerCase();
        const matchSearch = !search ||
            txn.txnId.toLowerCase().includes(q) ||
            txn.consumerNo.toLowerCase().includes(q) ||
            txn.name.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'All' || txn.status === statusFilter;
        const txnDate = txn.dateTime.slice(0, 10);
        const matchFrom = !fromDate || txnDate >= fromDate;
        const matchTo = !toDate || txnDate <= toDate;
        return matchSearch && matchStatus && matchFrom && matchTo;
    });

    const totalAmount = filtered.filter(t => t.status === 'Success').reduce((sum, t) => sum + t.amount, 0);

    const formatDate = (dt) => {
        const d = new Date(dt);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
            '  ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Bill & Payments</h1>
                    <p className="text-sm text-slate-500 mt-0.5">View and monitor financial transactions</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-lg px-5 py-4 mb-5 flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    placeholder="Search Consumer No. / Name / Transaction ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[240px]"
                />
                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 whitespace-nowrap">From</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 whitespace-nowrap">To</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All">All Status</option>
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm tracking-wider">
                                <th className="px-5 py-3.5 font-semibold">Transaction Id</th>
                                <th className="px-5 py-3.5 font-semibold">Consumer No.</th>
                                <th className="px-5 py-3.5 font-semibold">Citizen Name</th>
                                <th className="px-5 py-3.5 font-semibold">Service Type</th>
                                <th className="px-5 py-3.5 font-semibold">Amount Paid</th>
                                <th className="px-5 py-3.5 font-semibold">Payment Method</th>
                                <th className="px-5 py-3.5 font-semibold">Status</th>
                                <th className="px-5 py-3.5 font-semibold">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((txn) => (
                                <tr key={txn.txnId} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4 text-base font-medium text-slate-800">{txn.txnId}</td>
                                    <td className="px-5 py-4 text-base text-slate-600">{txn.consumerNo}</td>
                                    <td className="px-5 py-4 text-base text-slate-700">{txn.name}</td>
                                    <td className="px-5 py-4 text-base">
                                        <span className={`font-semibold ${serviceColors[txn.serviceType] || ''}`}>{txn.serviceType}</span>
                                    </td>
                                    <td className="px-5 py-4 text-base font-semibold text-slate-800">₹{txn.amount.toLocaleString('en-IN')}</td>
                                    <td className="px-5 py-4 text-base text-slate-600">
                                        <span className="flex items-center gap-1.5">
                                            <span>{methodIcons[txn.method]}</span>
                                            {txn.method}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-base">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[txn.status]}`}>{txn.status}</span>
                                    </td>
                                    <td className="px-5 py-4 text-base text-slate-500">{formatDate(txn.dateTime)}</td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-sm">No transactions match filters</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-sm text-slate-500">
                    <div>Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of <span className="font-semibold text-slate-700">{allTransactions.length}</span> transactions</div>
                    <div>Total Collected (Success): <span className="font-bold text-slate-800">₹{totalAmount.toLocaleString('en-IN')}</span></div>
                </div>
            </div>
        </div>
    );
}

export default BillPayments;
