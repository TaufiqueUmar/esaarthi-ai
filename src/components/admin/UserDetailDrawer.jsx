import React from 'react';

function UserDetailDrawer({ user, onClose }) {
    if (!user) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

            <div className="fixed top-0 right-0 h-full w-full max-w-2xl z-50 bg-white flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200" style={{ backgroundColor: '#1a078a' }}>
                    <div>
                        <h2 className="text-lg font-bold text-white">{user.userId}</h2>
                        <p className="text-white/80 text-2xl mt-0.5">{user.name}</p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Profile Info */}
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Profile Information</h3>
                    <div className="space-y-3 mb-8">
                        <div>
                            <label className="text-sm text-slate-400">Full Name</label>
                            <p className="text-base font-medium text-slate-800">{user.name}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400">Mobile Number</label>
                            <p className="text-base font-medium text-slate-800">{user.mobile}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400">Address</label>
                            <p className="text-base font-medium text-slate-800 leading-relaxed">{user.address}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400">Status</label>
                            <p className="text-base font-medium">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{user.status}</span>
                            </p>
                        </div>
                    </div>

                    {/* Linked Services */}
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Linked Services</h3>
                    <div className="space-y-2 mb-8">
                        {user.linkedServices && user.linkedServices.map((svc, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-4 py-3">
                                <div>
                                    <div className="text-base font-medium text-slate-800">{svc.type}</div>
                                    <div className="text-sm text-slate-500">Consumer No: {svc.consumerNo}</div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${svc.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {svc.active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Request History */}
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Request History</h3>
                    <div className="space-y-2">
                        {user.requestHistory && user.requestHistory.map((req, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${req.status === 'Resolved' ? 'bg-green-500' :
                                            req.status === 'Pending' ? 'bg-yellow-500' :
                                                req.status === 'Assigned' ? 'bg-indigo-500' : 'bg-slate-400'
                                        }`} />
                                    <div>
                                        <div className="text-base font-medium text-slate-800">{req.type}</div>
                                        <div className="text-sm text-slate-500">{req.id} · {req.date}</div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${req.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                        req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            req.status === 'Assigned' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {req.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-slate-300 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        Close
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

export default UserDetailDrawer;
