import React, { useState } from 'react';
import UserDetailDrawer from '../../components/admin/UserDetailDrawer';

const allUsers = [
    {
        userId: "USR-001", name: "Rahul Sharma", mobile: "9876543210", serviceType: "Gas", consumerNo: "GJ-GAS-44821", totalRequests: 5, lastActivity: "2026-02-27", status: "Active",
        address: "12, Sector 5, Gandhinagar, Gujarat",
        linkedServices: [
            { type: "Gas", consumerNo: "GJ-GAS-44821", active: true },
        ],
        requestHistory: [
            { id: "REQ-2026-081", type: "New Connection", status: "Pending", date: "26 Feb 2026" },
            { id: "TXN-2026-001", type: "Bill Payment - ₹1,250", status: "Resolved", date: "27 Feb 2026" },
            { id: "TXN-2026-006", type: "Bill Payment - ₹450", status: "Resolved", date: "25 Feb 2026" },
        ]
    },
    {
        userId: "USR-002", name: "Priya Desai", mobile: "9812345678", serviceType: "Electricity", consumerNo: "GJ-ELEC-77650", totalRequests: 3, lastActivity: "2026-02-27", status: "Active",
        address: "34, MG Road, Ahmedabad, Gujarat",
        linkedServices: [
            { type: "Electricity", consumerNo: "GJ-ELEC-77650", active: true },
        ],
        requestHistory: [
            { id: "REQ-2026-082", type: "Complaint", status: "Assigned", date: "27 Feb 2026" },
            { id: "TXN-2026-002", type: "Bill Payment - ₹3,420", status: "Resolved", date: "27 Feb 2026" },
        ]
    },
    {
        userId: "USR-003", name: "Vikram Singh", mobile: "9988776655", serviceType: "Water", consumerNo: "—", totalRequests: 2, lastActivity: "2026-02-26", status: "Active",
        address: "56, Civil Lines, Surat, Gujarat",
        linkedServices: [
            { type: "Water", consumerNo: "GJ-WTR-55421", active: true },
            { type: "Electricity", consumerNo: "GJ-ELEC-90234", active: true },
        ],
        requestHistory: [
            { id: "REQ-2026-083", type: "New Connection", status: "Assigned", date: "26 Feb 2026" },
            { id: "TXN-2026-010", type: "Bill Payment - ₹4,100", status: "Resolved", date: "23 Feb 2026" },
        ]
    },
    {
        userId: "USR-004", name: "Anjali Gupta", mobile: "9871234567", serviceType: "Gas", consumerNo: "GJ-GAS-44900", totalRequests: 4, lastActivity: "2026-02-26", status: "Active",
        address: "78, Navrangpura, Ahmedabad, Gujarat",
        linkedServices: [
            { type: "Gas", consumerNo: "GJ-GAS-44900", active: true },
        ],
        requestHistory: [
            { id: "REQ-2026-084", type: "Complaint", status: "Pending", date: "28 Feb 2026" },
            { id: "TXN-2026-004", type: "Bill Payment - ₹870", status: "Resolved", date: "26 Feb 2026" },
        ]
    },
    {
        userId: "USR-005", name: "Suresh Patel", mobile: "9900112233", serviceType: "Electricity", consumerNo: "—", totalRequests: 1, lastActivity: "2026-02-24", status: "Active",
        address: "90, Vastrapur, Ahmedabad, Gujarat",
        linkedServices: [
            { type: "Electricity", consumerNo: "—", active: false },
        ],
        requestHistory: [
            { id: "REQ-2026-085", type: "New Connection", status: "Pending", date: "01 Mar 2026" },
        ]
    },
    {
        userId: "USR-006", name: "Meena Iyer", mobile: "9123456789", serviceType: "Water", consumerNo: "GJ-WTR-33100", totalRequests: 6, lastActivity: "2026-02-26", status: "Active",
        address: "23, Paldi, Ahmedabad, Gujarat",
        linkedServices: [
            { type: "Water", consumerNo: "GJ-WTR-33100", active: true },
        ],
        requestHistory: [
            { id: "REQ-2026-086", type: "Complaint", status: "Pending", date: "25 Feb 2026" },
            { id: "TXN-2026-003", type: "Bill Payment - ₹580", status: "Pending", date: "26 Feb 2026" },
        ]
    },
    {
        userId: "USR-007", name: "Deepak Joshi", mobile: "9876501234", serviceType: "Gas", consumerNo: "—", totalRequests: 1, lastActivity: "2026-02-25", status: "Inactive",
        address: "45, Satellite, Ahmedabad, Gujarat",
        linkedServices: [
            { type: "Gas", consumerNo: "—", active: false },
        ],
        requestHistory: [
            { id: "REQ-2026-087", type: "New Connection", status: "Assigned", date: "02 Mar 2026" },
        ]
    },
    {
        userId: "USR-008", name: "Kavita Mehta", mobile: "9854321098", serviceType: "Electricity", consumerNo: "GJ-ELEC-88012", totalRequests: 3, lastActivity: "2026-02-27", status: "Active",
        address: "67, Maninagar, Ahmedabad, Gujarat",
        linkedServices: [
            { type: "Electricity", consumerNo: "GJ-ELEC-88012", active: true },
        ],
        requestHistory: [
            { id: "REQ-2026-088", type: "Complaint", status: "Pending", date: "27 Feb 2026" },
            { id: "TXN-2026-005", type: "Bill Payment - ₹2,100", status: "Resolved", date: "26 Feb 2026" },
        ]
    },
];

const serviceColors = {
    Gas: 'text-orange-600',
    Electricity: 'text-amber-600',
    Water: 'text-teal-600',
};

function Users() {
    const [search, setSearch] = useState('');
    const [serviceFilter, setServiceFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedUser, setSelectedUser] = useState(null);

    const filtered = allUsers.filter((u) => {
        const q = search.toLowerCase();
        const matchSearch = !search ||
            u.name.toLowerCase().includes(q) ||
            u.mobile.includes(q) ||
            u.consumerNo.toLowerCase().includes(q);
        const matchService = serviceFilter === 'All' || u.serviceType === serviceFilter;
        const matchStatus = statusFilter === 'All' || u.status === statusFilter;
        return matchSearch && matchService && matchStatus;
    });

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Users</h1>
                    <p className="text-sm text-slate-500 mt-0.5">View registered citizens and service history</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-lg px-5 py-4 mb-5 flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    placeholder="Search Name / Mobile / Consumer No."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[240px]"
                />
                <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All">All Services</option>
                    <option value="Gas">Gas</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm tracking-wider">
                                <th className="px-5 py-3.5 font-semibold">User Id</th>
                                <th className="px-5 py-3.5 font-semibold">Full Name</th>
                                <th className="px-5 py-3.5 font-semibold">Mobile</th>
                                <th className="px-5 py-3.5 font-semibold">Service Type</th>
                                <th className="px-5 py-3.5 font-semibold">Consumer No.</th>
                                <th className="px-5 py-3.5 font-semibold">Total Requests</th>
                                <th className="px-5 py-3.5 font-semibold">Last Activity</th>
                                <th className="px-5 py-3.5 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((user) => (
                                <tr key={user.userId} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4 text-base font-medium text-slate-800">{user.userId}</td>
                                    <td className="px-5 py-4 text-base text-slate-700">{user.name}</td>
                                    <td className="px-5 py-4 text-base text-slate-600">{user.mobile}</td>
                                    <td className="px-5 py-4 text-base">
                                        <span className={`font-semibold ${serviceColors[user.serviceType] || ''}`}>{user.serviceType}</span>
                                    </td>
                                    <td className="px-5 py-4 text-base text-slate-600">{user.consumerNo}</td>
                                    <td className="px-5 py-4 text-base font-semibold text-slate-800 text-center">{user.totalRequests}</td>
                                    <td className="px-5 py-4 text-base text-slate-500">
                                        {new Date(user.lastActivity).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="text-base font-semibold py-2 px-6 rounded transition-colors"
                                            style={{ backgroundColor: '#1a078a', color: '#fff' }}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-sm">No users match filters</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-sm text-slate-500">
                    <div>Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of <span className="font-semibold text-slate-700">{allUsers.length}</span> users</div>
                </div>
            </div>

            <UserDetailDrawer
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
            />
        </div>
    );
}

export default Users;
