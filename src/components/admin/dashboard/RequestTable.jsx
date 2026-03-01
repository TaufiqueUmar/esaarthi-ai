import React, { useState } from 'react';

const allRequests = [
    { id: "REQ-2026-081", type: "Gas", name: "Rahul Sharma", status: "Pending", tech: "Unassigned", deadline: "26 Feb 2026" },
    { id: "REQ-2026-082", type: "Electricity", name: "Priya Desai", status: "Verified", tech: "Amit Kumar", deadline: "27 Feb 2026" },
    { id: "REQ-2026-083", type: "Water", name: "Vikram Singh", status: "Assigned", tech: "Ramesh Yadav", deadline: "26 Feb 2026" },
    { id: "REQ-2026-084", type: "Gas", name: "Anjali Gupta", status: "Pending", tech: "Unassigned", deadline: "28 Feb 2026" },
    { id: "REQ-2026-085", type: "Electricity", name: "Suresh Patel", status: "Verified", tech: "Neha Sharma", deadline: "01 Mar 2026" },
    { id: "REQ-2026-086", type: "Waste", name: "Meena Iyer", status: "Assigned", tech: "Karan Singh", deadline: "25 Feb 2026" },
];

const getStatusBadge = (status) => {
    switch (status) {
        case 'Pending':
            return <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Pending</span>;
        case 'Verified':
            return <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Verified</span>;
        case 'Assigned':
            return <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">Assigned</span>;
        case 'Overdue':
            return <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">Overdue</span>;
        default:
            return <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
};

const getServiceTypeBadge = (type) => {
    switch (type) {
        case 'Gas':
            return <span className="text-orange-600 font-semibold">{type}</span>;
        case 'Electricity':
            return <span className="text-amber-500 font-semibold">{type}</span>;
        case 'Water':
            return <span className="text-teal-600 font-semibold">{type}</span>;
        case 'Waste':
            return <span className="text-green-600 font-semibold">{type}</span>;
        case 'Municipal':
            return <span className="text-purple-600 font-semibold">{type}</span>;
        default:
            return <span>{type}</span>;
    }
};

function RequestTable() {
    const [search, setSearch] = useState('');
    const [serviceFilter, setServiceFilter] = useState('All');

    const filtered = allRequests.filter((req) => {
        const matchSearch = !search ||
            req.id.toLowerCase().includes(search.toLowerCase()) ||
            req.name.toLowerCase().includes(search.toLowerCase());
        const matchService = serviceFilter === 'All' || req.type === serviceFilter;
        return matchSearch && matchService;
    });

    return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center flex-wrap gap-3">
                <h2 className="text-xl font-bold text-slate-800 tracking-wide">Recent Service Requests</h2>
                <div className="flex gap-3 flex-1 ml-6 min-w-0">
                    <input
                        type="text"
                        placeholder="Search Request ID or Name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1 min-w-0 text-sm"
                    />
                    <select
                        value={serviceFilter}
                        onChange={(e) => setServiceFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
                    >
                        <option value="All">All Services</option>
                        <option value="Gas">Gas</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Water">Water</option>
                        <option value="Waste">Waste</option>
                        <option value="Municipal">Municipal</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-sm tracking-wider">
                            <th className="px-6 py-4 font-semibold">Request ID</th>
                            <th className="px-6 py-4 font-semibold">Service Type</th>
                            <th className="px-6 py-4 font-semibold">Applicant Name</th>
                            <th className="px-6 py-4 font-semibold">Current Status</th>
                            <th className="px-6 py-4 font-semibold">Assigned Technician</th>
                            <th className="px-6 py-4 font-semibold">Deadline</th>
                            <th className="px-6 py-4 font-semibold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {filtered.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{req.id}</td>
                                <td className="px-6 py-4">{getServiceTypeBadge(req.type)}</td>
                                <td className="px-6 py-4 text-slate-700">{req.name}</td>
                                <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    {req.tech === 'Unassigned' ? <span className="text-slate-400 italic">Unassigned</span> : req.tech}
                                </td>
                                <td className="px-6 py-4 text-slate-600">{req.deadline}</td>
                                <td className="px-6 py-4 text-center">
                                    <button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded shadow-sm touch-manipulation transition-colors w-full">
                                        Open
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-sm">No requests match filters</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-sm text-slate-600">
                <div>Showing <span className="font-semibold">{filtered.length}</span> of <span className="font-semibold">{allRequests.length}</span> requests</div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-200 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">Next</button>
                </div>
            </div>
        </div>
    );
}

export default RequestTable;
