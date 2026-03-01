import React from 'react';

function TechnicianDetailDrawer({ technician, onClose }) {
    if (!technician) return null;

    const t = technician;
    const recColor = {
        Eligible: 'bg-green-100 text-green-700 border-green-200',
        'Needs Improvement': 'bg-amber-100 text-amber-700 border-amber-200',
        'Under Review': 'bg-red-100 text-red-700 border-red-200',
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

            <div className="fixed top-0 right-0 h-full w-full max-w-2xl z-50 bg-white flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200" style={{ backgroundColor: '#1a078a' }}>
                    <div>
                        <h2 className="text-lg font-bold text-white">{t.name}</h2>
                        <p className="text-white/70 text-sm mt-0.5">Performance Details</p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Recommendation Badge */}
                    <div className={`rounded-lg border p-4 ${recColor[t.recommendation] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        <div className="text-xs uppercase tracking-wider opacity-60 mb-1">Recommendation</div>
                        <div className="text-lg font-bold">{t.recommendation}</div>
                    </div>

                    {/* Monthly Performance Bar Chart */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Monthly On-Time %</h3>
                        <div className="flex items-end gap-3 h-36 bg-slate-50 border border-slate-200 rounded-lg p-4">
                            {t.monthlyTrend.map((w, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-xs font-semibold text-slate-700">{w.onTime}%</span>
                                    <div className="w-full bg-slate-200 rounded-t relative" style={{ height: '80px' }}>
                                        <div
                                            className="absolute bottom-0 w-full rounded-t transition-all duration-500"
                                            style={{
                                                height: `${(w.onTime / 100) * 100}%`,
                                                backgroundColor: w.onTime >= 85 ? '#22c55e' : w.onTime >= 70 ? '#f59e0b' : '#ef4444',
                                            }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-400">{w.week}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Task Breakdown */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Task Breakdown</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-700">{t.breakdown.completed}</div>
                                <div className="text-xs text-slate-500 mt-1">Completed</div>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-red-700">{t.breakdown.overdue}</div>
                                <div className="text-xs text-slate-500 mt-1">Overdue</div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-slate-700">{t.breakdown.notFeasible}</div>
                                <div className="text-xs text-slate-500 mt-1">Not Feasible</div>
                            </div>
                        </div>
                    </div>

                    {/* Overdue Reasons */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Overdue Reasons</h3>
                        <div className="space-y-2">
                            {t.overdueReasons.length === 0 ? (
                                <div className="text-sm text-slate-400 text-center py-4">No overdue tasks</div>
                            ) : (
                                t.overdueReasons.map((r, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                                        <div className="w-2 h-2 rounded-full bg-red-400 shrink-0 mt-1.5" />
                                        <div>
                                            <div className="text-base font-medium text-slate-800">{r.taskId}</div>
                                            <div className="text-sm text-slate-500">{r.reason}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2.5 border border-slate-300 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 transition-colors">
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

export default TechnicianDetailDrawer;
