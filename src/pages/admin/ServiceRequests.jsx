import React, { useState } from 'react';
import RequestDetailDrawer from '../../components/admin/RequestDetailDrawer';

const allRequests = [
    { id: "REQ-2026-081", name: "Rahul Sharma", serviceType: "Gas", requestType: "New Connection", status: "Pending", tech: "Unassigned", deadline: "2026-02-26", phone: "9876543210", address: "12, Sector 5, Gandhinagar, Gujarat", consumerNo: "GJ-GAS-44821", docs: ["Aadhaar Card", "Address Proof", "Photo"] },
    { id: "REQ-2026-082", name: "Priya Desai", serviceType: "Electricity", requestType: "Complaint", status: "Verified", tech: "Amit Kumar", deadline: "2026-02-27", phone: "9812345678", address: "34, MG Road, Ahmedabad, Gujarat", consumerNo: "GJ-ELEC-77650", docs: ["Aadhaar Card", "Electricity Bill"] },
    { id: "REQ-2026-083", name: "Vikram Singh", serviceType: "Water", requestType: "New Connection", status: "Assigned", tech: "Ramesh Yadav", deadline: "2026-02-26", phone: "9988776655", address: "56, Civil Lines, Surat, Gujarat", consumerNo: "—", docs: ["Aadhaar Card", "Property Tax Receipt", "Photo"] },
    { id: "REQ-2026-084", name: "Anjali Gupta", serviceType: "Gas", requestType: "Complaint", status: "Pending", tech: "Unassigned", deadline: "2026-02-28", phone: "9871234567", address: "78, Navrangpura, Ahmedabad, Gujarat", consumerNo: "GJ-GAS-44900", docs: ["Aadhaar Card", "Gas Bill"] },
    { id: "REQ-2026-085", name: "Suresh Patel", serviceType: "Electricity", requestType: "New Connection", status: "Verified", tech: "Neha Sharma", deadline: "2026-03-01", phone: "9900112233", address: "90, Vastrapur, Ahmedabad, Gujarat", consumerNo: "—", docs: ["Aadhaar Card", "Address Proof"] },
    { id: "REQ-2026-086", name: "Meena Iyer", serviceType: "Water", requestType: "Complaint", status: "Overdue", tech: "Karan Singh", deadline: "2026-02-25", phone: "9123456789", address: "23, Paldi, Ahmedabad, Gujarat", consumerNo: "GJ-WTR-33100", docs: ["Aadhaar Card", "Water Bill", "Complaint Letter"] },
    { id: "REQ-2026-087", name: "Deepak Joshi", serviceType: "Gas", requestType: "New Connection", status: "Assigned", tech: "Amit Kumar", deadline: "2026-03-02", phone: "9876501234", address: "45, Satellite, Ahmedabad, Gujarat", consumerNo: "—", docs: ["Aadhaar Card", "Photo"] },
    { id: "REQ-2026-088", name: "Kavita Mehta", serviceType: "Electricity", requestType: "Complaint", status: "Pending", tech: "Unassigned", deadline: "2026-02-27", phone: "9854321098", address: "67, Maninagar, Ahmedabad, Gujarat", consumerNo: "GJ-ELEC-88012", docs: ["Aadhaar Card", "Electricity Bill"] },
    { id: "REQ-2026-089", name: "Ritu Sharma", serviceType: "Waste", requestType: "Waste Segregation", status: "Pending", tech: "Unassigned", deadline: "2026-02-28", phone: "9773344556", address: "12, Chandkheda, Ahmedabad, Gujarat", consumerNo: "—", docs: ["Aadhaar Card", "Complaint Form"] },
    { id: "REQ-2026-090", name: "Arjun Nair", serviceType: "Waste", requestType: "Gutter Issue", status: "Assigned", tech: "Priya Verma", deadline: "2026-02-27", phone: "9845567890", address: "34, Gota, Ahmedabad, Gujarat", consumerNo: "—", docs: ["Aadhaar Card", "Site Photo", "Complaint Form"] },
    { id: "REQ-2026-091", name: "Sunita Rawat", serviceType: "Water", requestType: "Water Leakage", status: "Pending", tech: "Unassigned", deadline: "2026-02-26", phone: "9712233445", address: "78, Bopal, Ahmedabad, Gujarat", consumerNo: "GJ-WTR-44201", docs: ["Aadhaar Card", "Water Bill", "Photo"] },
    { id: "REQ-2026-092", name: "Harish Koli", serviceType: "Water", requestType: "Bad Water Quality", status: "Verified", tech: "Ramesh Yadav", deadline: "2026-03-01", phone: "9988001122", address: "45, Naroda, Ahmedabad, Gujarat", consumerNo: "GJ-WTR-55012", docs: ["Aadhaar Card", "Water Test Report", "Complaint Letter"] },
];

const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Verified: 'bg-blue-100 text-blue-800',
    Assigned: 'bg-indigo-100 text-indigo-800',
    Overdue: 'bg-red-100 text-red-800',
};

const serviceColors = {
    Gas: 'text-orange-600',
    Electricity: 'text-amber-600',
    Water: 'text-teal-600',
    Waste: 'text-green-600',
};

function ServiceRequests() {
    const [search, setSearch] = useState('');
    const [serviceFilter, setServiceFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('');
    const [sortByDeadline, setSortByDeadline] = useState('asc');
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Filter logic
    let filtered = allRequests.filter((req) => {
        const matchSearch = !search || req.id.toLowerCase().includes(search.toLowerCase()) || req.name.toLowerCase().includes(search.toLowerCase()) || (req.consumerNo && req.consumerNo.toLowerCase().includes(search.toLowerCase()));
        const matchService = serviceFilter === 'All' || req.serviceType === serviceFilter;
        const matchStatus = statusFilter === 'All' || req.status === statusFilter;
        const matchDate = !dateFilter || req.deadline === dateFilter;
        return matchSearch && matchService && matchStatus && matchDate;
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
        if (sortByDeadline === 'asc') return a.deadline.localeCompare(b.deadline);
        return b.deadline.localeCompare(a.deadline);
    });

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Service Requests</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Manage new connections and complaints requiring field action</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white border border-slate-200 rounded-lg px-5 py-4 mb-5 flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    placeholder="Search ID / Name / Consumer No."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1 min-w-[200px]"
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
                    <option value="Waste">Waste</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Overdue">Overdue</option>
                </select>
                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => setSortByDeadline(sortByDeadline === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                    Deadline
                    <svg className={`w-4 h-4 transition-transform ${sortByDeadline === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm tracking-wider">
                                <th className="px-5 py-3.5 font-semibold">Request Id</th>
                                <th className="px-5 py-3.5 font-semibold">Citizen Name</th>
                                <th className="px-5 py-3.5 font-semibold">Service Type</th>
                                <th className="px-5 py-3.5 font-semibold">Request Type</th>
                                <th className="px-5 py-3.5 font-semibold">Status</th>
                                <th className="px-5 py-3.5 font-semibold">Technician</th>
                                <th className="px-5 py-3.5 font-semibold">Deadline</th>
                                <th className="px-5 py-3.5 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4 text-base font-medium text-slate-800">{req.id}</td>
                                    <td className="px-5 py-4 text-base text-slate-700">{req.name}</td>
                                    <td className="px-5 py-4 text-base">
                                        <span className={`font-semibold ${serviceColors[req.serviceType] || ''}`}>{req.serviceType}</span>
                                    </td>
                                    <td className="px-5 py-4 text-base text-slate-600">{req.requestType}</td>
                                    <td className="px-5 py-4 text-base">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>{req.status}</span>
                                    </td>
                                    <td className="px-5 py-4 text-base text-slate-600">
                                        {req.tech === 'Unassigned' ? <span className="text-slate-400 italic">Unassigned</span> : req.tech}
                                    </td>
                                    <td className="px-5 py-4 text-base text-slate-600">{new Date(req.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td className="px-5 py-4 text-center">
                                        <button
                                            onClick={() => setSelectedRequest(req)}
                                            className="text-base font-semibold py-2 px-6 rounded transition-colors"
                                            style={{ backgroundColor: '#1a078a', color: '#fff' }}
                                        >
                                            Open
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-sm">No requests match filters</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-sm text-slate-500">
                    <div>Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of <span className="font-semibold text-slate-700">{allRequests.length}</span> requests</div>
                </div>
            </div>

            {/* Detail Drawer */}
            <RequestDetailDrawer
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
            />
        </div>
    );
}

export default ServiceRequests;
