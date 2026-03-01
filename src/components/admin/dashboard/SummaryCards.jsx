import React from 'react';

const SummaryCard = ({ title, count, icon, borderColor = "border-yellow-400" }) => (
    <div className={`bg-white rounded-lg p-5 flex items-center gap-4 border-l-4 ${borderColor} flex-1 min-w-[200px]`}>
        <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-medium text-slate-500 tracking-wide">{title}</h3>
            <div className="text-3xl font-bold text-slate-800 mt-0.5">{count}</div>
        </div>
    </div>
);

function SummaryCards() {
    return (
        <div className="flex flex-row gap-5 h-25 w-full mb-8">
            <SummaryCard
                title="Total Requests"
                count="1,248"
                borderColor="border-blue-500"
                icon={(
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                )}
            />
            <SummaryCard
                title="Pending Verification"
                count="342"
                borderColor="border-yellow-400"
                icon={(
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
            />
            <SummaryCard
                title="Assigned to Tech"
                count="856"
                borderColor="border-indigo-500"
                icon={(
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                )}
            />
            <SummaryCard
                title="Deadline Today"
                count="45"
                borderColor="border-orange-500"
                icon={(
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                )}
            />
            <SummaryCard
                title="Overdue Requests"
                count="12"
                borderColor="border-red-500"
                icon={(
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                )}
            />
        </div>
    );
}

export default SummaryCards;
