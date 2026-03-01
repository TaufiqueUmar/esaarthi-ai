import React, { useState } from 'react';

function TaskDetail({ task, onBack }) {
    const [actionDone, setActionDone] = useState(false);

    if (!task) return null;

    const formatDeadline = (dl) => {
        const d = new Date(dl);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
            '  ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const isOverdue = new Date(task.deadline) < new Date();
    const hoursLeft = ((new Date(task.deadline) - new Date()) / (1000 * 60 * 60)).toFixed(0);

    const handleAction = (action) => {
        setActionDone(true);
        setTimeout(() => {
            setActionDone(false);
            onBack();
        }, 1200);
    };

    return (
        <div className="flex flex-col min-h-full">
            {/* Back Button */}
            <div className="px-4 pt-4">
                <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to Tasks
                </button>
            </div>

            {/* Top Info */}
            <div className="px-4 pb-4">
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <div className="text-lg font-bold text-slate-800">{task.id}</div>
                            <div className="text-sm text-slate-500">{task.serviceType} · {task.requestType}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {isOverdue ? 'Overdue' : `${hoursLeft}h left`}
                        </span>
                    </div>

                    <div className={`rounded-lg p-3 mb-4 ${isOverdue ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                        <div className="text-xs text-slate-500 mb-0.5">Deadline</div>
                        <div className={`text-base font-bold ${isOverdue ? 'text-red-700' : 'text-amber-700'}`}>
                            {formatDeadline(task.deadline)}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="mb-3">
                        <div className="text-xs text-slate-400 mb-1">Address</div>
                        <div className="text-base text-slate-800 flex items-start gap-2">
                            <svg className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {task.address}
                        </div>
                    </div>

                    {/* Citizen Contact */}
                    <div className="mb-3">
                        <div className="text-xs text-slate-400 mb-1">Citizen</div>
                        <div className="text-base font-medium text-slate-800">{task.citizenName}</div>
                        <a href={`tel:${task.phone}`} className="text-sm text-blue-600 font-medium flex items-center gap-1 mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            {task.phone}
                        </a>
                    </div>

                    {/* Notes */}
                    {task.notes && (
                        <div>
                            <div className="text-xs text-slate-400 mb-1">Notes</div>
                            <div className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
                                {task.notes}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons — Fixed Bottom */}
            <div className="mt-auto px-4 pb-6 space-y-3">
                {actionDone ? (
                    <div className="text-center py-6">
                        <svg className="w-12 h-12 mx-auto text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <div className="text-base font-semibold text-slate-700">Action Recorded</div>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => handleAction('completed')}
                            className="w-full py-4 rounded-lg text-base font-bold text-white bg-green-600 active:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Mark Completed
                        </button>
                        <button
                            onClick={() => handleAction('not-feasible')}
                            className="w-full py-4 rounded-lg text-base font-bold text-white bg-red-500 active:bg-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            Not Feasible
                        </button>
                        <button
                            onClick={() => handleAction('reschedule')}
                            className="w-full py-4 rounded-lg text-base font-bold text-amber-700 bg-amber-100 border border-amber-300 active:bg-amber-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Reschedule Required
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default TaskDetail;
