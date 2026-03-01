import React, { useState } from 'react';
import TechnicianDetailDrawer from '../../components/admin/TechnicianDetailDrawer';

const technicians = [
    {
        name: 'Amit Kumar', assigned: 38, onTimePercent: 88, overdue: 3, score: 82, incentive: 'Eligible', recommendation: 'Eligible',
        monthlyTrend: [{ week: 'W1', onTime: 78 }, { week: 'W2', onTime: 84 }, { week: 'W3', onTime: 92 }, { week: 'W4', onTime: 88 }],
        breakdown: { completed: 33, overdue: 3, notFeasible: 2 },
        overdueReasons: [
            { taskId: 'REQ-2026-071', reason: 'Citizen not available at location' },
            { taskId: 'REQ-2026-079', reason: 'Material shortage — pipeline not available' },
            { taskId: 'REQ-2026-086', reason: 'Rain delay — site inaccessible' },
        ],
    },
    {
        name: 'Ramesh Yadav', assigned: 35, onTimePercent: 82, overdue: 5, score: 74, incentive: 'Under Review', recommendation: 'Needs Improvement',
        monthlyTrend: [{ week: 'W1', onTime: 80 }, { week: 'W2', onTime: 76 }, { week: 'W3', onTime: 85 }, { week: 'W4', onTime: 82 }],
        breakdown: { completed: 28, overdue: 5, notFeasible: 2 },
        overdueReasons: [
            { taskId: 'REQ-2026-062', reason: 'Incorrect address provided' },
            { taskId: 'REQ-2026-069', reason: 'Equipment failure on site' },
            { taskId: 'REQ-2026-074', reason: 'Citizen not available' },
            { taskId: 'REQ-2026-078', reason: 'Site blocked — construction ongoing' },
            { taskId: 'REQ-2026-085', reason: 'Heavy rain — postponed' },
        ],
    },
    {
        name: 'Neha Sharma', assigned: 32, onTimePercent: 94, overdue: 1, score: 91, incentive: 'Eligible', recommendation: 'Eligible',
        monthlyTrend: [{ week: 'W1', onTime: 90 }, { week: 'W2', onTime: 92 }, { week: 'W3', onTime: 96 }, { week: 'W4', onTime: 94 }],
        breakdown: { completed: 30, overdue: 1, notFeasible: 1 },
        overdueReasons: [
            { taskId: 'REQ-2026-080', reason: 'Citizen rescheduled appointment' },
        ],
    },
    {
        name: 'Karan Singh', assigned: 30, onTimePercent: 72, overdue: 7, score: 58, incentive: 'Not Eligible', recommendation: 'Under Review',
        monthlyTrend: [{ week: 'W1', onTime: 68 }, { week: 'W2', onTime: 72 }, { week: 'W3', onTime: 70 }, { week: 'W4', onTime: 72 }],
        breakdown: { completed: 21, overdue: 7, notFeasible: 2 },
        overdueReasons: [
            { taskId: 'REQ-2026-058', reason: 'Late arrival at site' },
            { taskId: 'REQ-2026-063', reason: 'Equipment not carried' },
            { taskId: 'REQ-2026-067', reason: 'Site inaccessible' },
            { taskId: 'REQ-2026-073', reason: 'Citizen unavailable' },
            { taskId: 'REQ-2026-076', reason: 'Incorrect task assignment' },
            { taskId: 'REQ-2026-082', reason: 'Rain delay' },
            { taskId: 'REQ-2026-089', reason: 'Material shortage' },
        ],
    },
    {
        name: 'Priya Verma', assigned: 28, onTimePercent: 89, overdue: 2, score: 84, incentive: 'Eligible', recommendation: 'Eligible',
        monthlyTrend: [{ week: 'W1', onTime: 85 }, { week: 'W2', onTime: 88 }, { week: 'W3', onTime: 92 }, { week: 'W4', onTime: 89 }],
        breakdown: { completed: 25, overdue: 2, notFeasible: 1 },
        overdueReasons: [
            { taskId: 'REQ-2026-070', reason: 'Address not found' },
            { taskId: 'REQ-2026-083', reason: 'Citizen rescheduled' },
        ],
    },
];

const incentiveColors = {
    Eligible: 'bg-green-100 text-green-700',
    'Under Review': 'bg-amber-100 text-amber-700',
    'Not Eligible': 'bg-red-100 text-red-700',
};

function TechnicianPerformance() {
    const [selectedTech, setSelectedTech] = useState(null);

    // Summary
    const totalTechs = technicians.length;
    const avgOnTime = Math.round(technicians.reduce((s, t) => s + t.onTimePercent, 0) / totalTechs);
    const above85 = technicians.filter(t => t.onTimePercent >= 85).length;
    const below60 = technicians.filter(t => t.onTimePercent < 60).length;

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Technician Performance</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Monitor technician efficiency and incentive eligibility</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-5">
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Total Technicians</div>
                    <div className="text-2xl font-bold text-slate-800 mt-1">{totalTechs}</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Avg On-Time</div>
                    <div className="text-2xl font-bold text-slate-800 mt-1">{avgOnTime}%</div>
                </div>
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Above 85%</div>
                    <div className="text-2xl font-bold text-green-700 mt-1">{above85}</div>
                </div>
                <div className={`rounded-lg p-4 ${below60 > 0 ? 'bg-red-50 border border-red-200' : 'bg-white border border-slate-200'}`}>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Below 60%</div>
                    <div className={`text-2xl font-bold mt-1 ${below60 > 0 ? 'text-red-700' : 'text-slate-800'}`}>{below60}</div>
                </div>
            </div>

            {/* Performance Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm tracking-wider">
                                <th className="px-5 py-3.5 font-semibold">Technician Name</th>
                                <th className="px-5 py-3.5 font-semibold text-center">Assigned</th>
                                <th className="px-5 py-3.5 font-semibold text-center">On-Time %</th>
                                <th className="px-5 py-3.5 font-semibold text-center">Overdue</th>
                                <th className="px-5 py-3.5 font-semibold text-center">Score</th>
                                <th className="px-5 py-3.5 font-semibold">Incentive Status</th>
                                <th className="px-5 py-3.5 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {technicians.map((tech) => (
                                <tr key={tech.name} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4 text-base font-medium text-slate-800">{tech.name}</td>
                                    <td className="px-5 py-4 text-base text-slate-700 text-center">{tech.assigned}</td>
                                    <td className="px-5 py-4 text-base text-center">
                                        <span className={`font-semibold ${tech.onTimePercent >= 85 ? 'text-green-600' : tech.onTimePercent >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                                            {tech.onTimePercent}%
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-base text-slate-700 text-center">{tech.overdue}</td>
                                    <td className="px-5 py-4 text-base font-semibold text-slate-800 text-center">{tech.score}</td>
                                    <td className="px-5 py-4 text-base">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${incentiveColors[tech.incentive]}`}>
                                            {tech.incentive}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <button
                                            onClick={() => setSelectedTech(tech)}
                                            className="text-base font-semibold py-2 px-6 rounded transition-colors"
                                            style={{ backgroundColor: '#1a078a', color: '#fff' }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 text-sm text-slate-500">
                    Showing <span className="font-semibold text-slate-700">{technicians.length}</span> technicians
                </div>
            </div>

            <TechnicianDetailDrawer
                technician={selectedTech}
                onClose={() => setSelectedTech(null)}
            />
        </div>
    );
}

export default TechnicianPerformance;
