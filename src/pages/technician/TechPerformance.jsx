import React from 'react';

// --- Mock Performance Data ---
const performanceData = {
    score: 82,
    onTimeRate: 88,
    rating: 'A',
    monthly: {
        assigned: 38,
        onTime: 33,
        overdue: 3,
        avgTime: '1.8 days',
    },
    weeklyTrend: [
        { week: 'Week 1', onTime: 78 },
        { week: 'Week 2', onTime: 84 },
        { week: 'Week 3', onTime: 90 },
        { week: 'Week 4', onTime: 88 },
    ],
    incentiveStatus: 'Eligible', // Eligible | Under Review | Not Eligible
};

const ratingColor = { A: 'text-green-600 bg-green-50 border-green-200', B: 'text-amber-600 bg-amber-50 border-amber-200', C: 'text-red-600 bg-red-50 border-red-200' };
const incentiveColor = { Eligible: 'bg-green-50 border-green-200 text-green-700', 'Under Review': 'bg-amber-50 border-amber-200 text-amber-700', 'Not Eligible': 'bg-red-50 border-red-200 text-red-700' };

function TechPerformance() {
    const d = performanceData;
    const maxOnTime = 100;

    // Determine trend: improving if last > second-last
    const lastTwo = d.weeklyTrend.slice(-2);
    const trending = lastTwo[1].onTime >= lastTwo[0].onTime ? 'up' : 'down';

    return (
        <div className="p-4 space-y-4">

            {/* === 1. Performance Score Card === */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="text-xl font-bold text-gray-900 tracking-normal mb-4">Performance Overview</div>

                <div className="flex items-center gap-5 mb-4">
                    {/* Score Circle */}
                    <div className="relative w-24 h-24 shrink-0">
                        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                            <circle cx="50" cy="50" r="42" fill="none" stroke={d.score >= 80 ? '#22c55e' : d.score >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(d.score / 100) * 264} 264`} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-slate-800">{d.score}</span>
                            <span className="text-[10px] text-slate-400">/100</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-2 ml-10">
                        <div>
                            <div className="text-xs text-slate-400">On-Time Rate</div>
                            <div className="text-xl font-bold text-slate-800">{d.onTimeRate}%</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400">Rating</div>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${ratingColor[d.rating]}`}>{d.rating}</span>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-slate-400 leading-relaxed">
                    Score based on deadline compliance and task completion.
                </div>
            </div>

            {/* === 2. Monthly Summary — 2×2 Grid === */}
            <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 px-1">This Month</div>
                <div className="grid grid-cols-2 gap-3">
                    <MetricCard label="Tasks Assigned" value={d.monthly.assigned} />
                    <MetricCard label="Completed On Time" value={d.monthly.onTime} highlight="green" />
                    <MetricCard label="Overdue Tasks" value={d.monthly.overdue} highlight={d.monthly.overdue > 0 ? 'red' : undefined} />
                    <MetricCard label="Avg Completion" value={d.monthly.avgTime} />
                </div>
            </div>

            {/* === 3. Weekly Trend === */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-slate-400 uppercase tracking-wider">On-Time % Trend</div>
                    <span className={`text-xs font-medium flex items-center gap-1 ${trending === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                        <svg className={`w-3.5 h-3.5 ${trending === 'down' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        {trending === 'up' ? 'Improving' : 'Declining'}
                    </span>
                </div>
                <div className="flex items-end gap-3 h-32">
                    {d.weeklyTrend.map((w, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-xs font-semibold text-slate-700">{w.onTime}%</span>
                            <div className="w-full bg-slate-100 rounded-t-md relative" style={{ height: '100px' }}>
                                <div
                                    className="absolute bottom-0 w-full rounded-t-md transition-all duration-500"
                                    style={{
                                        height: `${(w.onTime / maxOnTime) * 100}%`,
                                        backgroundColor: w.onTime >= 85 ? '#22c55e' : w.onTime >= 70 ? '#f59e0b' : '#ef4444',
                                    }}
                                />
                            </div>
                            <span className="text-[10px] text-slate-400">{w.week.replace('Week ', 'W')}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* === 4. Incentive Eligibility === */}
            <div className={`rounded-xl border p-5 ${incentiveColor[d.incentiveStatus]}`}>
                <div className="text-xs uppercase tracking-wider opacity-60 mb-2">Incentive Eligibility</div>
                <div className="text-xl font-bold mb-1">{d.incentiveStatus}</div>
                <div className="text-sm opacity-70">Minimum 85% on-time completion required.</div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, highlight }) {
    const bg = highlight === 'green' ? 'border-green-200 bg-green-50'
        : highlight === 'red' ? 'border-red-200 bg-red-50'
            : 'border-slate-200 bg-white';
    const textColor = highlight === 'green' ? 'text-green-700'
        : highlight === 'red' ? 'text-red-700'
            : 'text-slate-800';

    return (
        <div className={`rounded-lg border p-4 ${bg}`}>
            <div className="text-xs text-slate-500 mb-2">{label}</div>
            <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
        </div>
    );
}

export default TechPerformance;
