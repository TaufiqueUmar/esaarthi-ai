import React from 'react';

const statusBadge = {
    Completed: 'bg-green-100 text-green-700',
    'Not Feasible': 'bg-red-100 text-red-700',
    Rescheduled: 'bg-amber-100 text-amber-700',
};

function TechHistory({ tasks }) {
    return (
        <div className="p-4">
            <h2 className="text-base font-bold text-slate-800 mb-3">Completed Tasks</h2>
            {tasks.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">No completed tasks yet</div>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div key={task.id} className="bg-white border border-slate-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-1">
                                <div>
                                    <div className="text-sm font-bold text-slate-800">{task.id}</div>
                                    <div className="text-sm text-slate-500">{task.serviceType} · {task.requestType}</div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge[task.status] || 'bg-slate-100 text-slate-600'}`}>
                                    {task.status}
                                </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-2">
                                Completed: {new Date(task.completedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TechHistory;
