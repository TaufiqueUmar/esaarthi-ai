import React, { useState, useEffect } from 'react';

function DashboardHeader({ onMenuToggle }) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <header className="w-full h-20 flex items-center justify-between px-8 shrink-0 sticky top-0 z-30" style={{ backgroundColor: '#1a078a' }}>
            <div className="flex items-center gap-4">
                {/* Hamburger button */}
                <button
                    onClick={onMenuToggle}
                    className="text-white/80 hover:text-white transition-colors p-1"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <img src="/eSaarthi.svg" alt="eSaarthi Logo" className="h-18 w-auto" />
                <span className="text-white/70 text-lg border-l border-white/20 pl-4 ml-2">
                    Admin Control Center
                </span>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-white text-lg font-medium tracking-wide">
                    {formatTime(time)}
                </div>
                <div className="text-right border-l border-white/20 pl-6">
                    <div className="font-semibold text-sm text-white">Welcome, Admin</div>
                    <div className="text-xs text-white/60">{formatDate(time)}</div>
                </div>
            </div>
        </header>
    );
}

export default DashboardHeader;
