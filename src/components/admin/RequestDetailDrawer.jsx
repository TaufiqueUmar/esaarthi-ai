import React, { useState } from 'react';

const technicians = ['Amit Kumar', 'Ramesh Yadav', 'Neha Sharma', 'Karan Singh', 'Priya Verma'];
const statuses = ['Pending', 'Verified', 'Assigned', 'Overdue', 'Resolved'];

function RequestDetailDrawer({ request, onClose }) {
    const [assignedTech, setAssignedTech] = useState('');
    const [deadline, setDeadline] = useState('');
    const [status, setStatus] = useState('');

    // Sync state when a new request is opened
    React.useEffect(() => {
        if (request) {
            setAssignedTech(request.tech === 'Unassigned' ? '' : request.tech);
            setDeadline(request.deadline || '');
            setStatus(request.status || '');
        }
    }, [request]);

    if (!request) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-full max-w-2xl z-50 bg-white flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200" style={{ backgroundColor: '#1a078a' }}>
                    <div>
                        <h2 className="text-lg font-bold text-white">{request.id}</h2>
                        <p className="text-white/80 text-2xl mt-0.5">{request.serviceType} - {request.requestType}</p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 gap-8">
                        {/* Left — Citizen Info */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Citizen Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-slate-400">Full Name</label>
                                    <p className="text-base font-medium text-slate-800">{request.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400">Phone</label>
                                    <p className="text-base font-medium text-slate-800">{request.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400">Consumer No.</label>
                                    <p className="text-base font-medium text-slate-800">{request.consumerNo || '—'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400">Address</label>
                                    <p className="text-base font-medium text-slate-800 leading-relaxed">{request.address}</p>
                                </div>
                            </div>

                            {/* Documents */}
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-8 mb-4">Documents</h3>
                            <div className="space-y-2">
                                {request.docs && request.docs.map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            <span className="text-base text-slate-700">{doc}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="text-sm text-blue-700 font-medium hover:underline">View</button>
                                            <span className="text-sm text-green-600 font-medium flex items-center gap-0.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                Verified
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — Actions */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Actions</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm text-slate-500 mb-1.5">Assign Technician</label>
                                    <select
                                        value={assignedTech}
                                        onChange={(e) => setAssignedTech(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Technician</option>
                                        {technicians.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-500 mb-1.5">Set Deadline</label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-500 mb-1.5">Change Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {statuses.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-slate-300 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-md text-base font-semibold text-white transition-colors"
                        style={{ backgroundColor: '#1a078a' }}
                    >
                        Save & Confirm
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.3s ease-out;
                }
            `}</style>
        </>
    );
}

export default RequestDetailDrawer;
