import { useNavigate } from 'react-router-dom'
import { MdAccessibility } from 'react-icons/md'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useVoiceFlowCtx } from '../voice-agent/VoiceFlowAgent.jsx'

const SERVICES = [
    { label: 'GAS', path: '/services/gas' },
    { label: 'ELECTRICITY', path: '/services/electricity' },
    { label: 'MUNICIPAL SERVICES', path: '/services/municipal' },
]

export default function Services() {
    const navigate = useNavigate()
    const { isActive, startSession, stopSession } = useVoiceFlowCtx()

    return (
        <div
            className="flex flex-col bg-white overflow-hidden"
            style={{ fontFamily: "'Noto Sans', sans-serif", height: '100vh' }}
        >
            <Header />

            {/* ── EMERGENCY ALERT STRIP ── */}
            <div
                className="w-full flex items-center px-8"
                style={{
                    backgroundColor: '#FFF8DC',
                    borderTop: '2px solid #D4A800',
                    borderBottom: '2px solid #D4A800',
                    minHeight: '44px',
                }}
            >
                <span
                    className="text-gray-900 font-medium"
                    style={{ fontSize: '1rem' }}
                >
                    ⚠️&nbsp;&nbsp;Important Notice: Water maintenance in Ward 12 till 5 PM
                </span>
            </div>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 flex flex-col px-12 pt-8 pb-4 overflow-hidden">

                {/* Page Title with 2 icons on right */}
                <div className="flex items-center justify-between">

                    <h1
                        className="font-extrabold text-gray-900"
                        style={{ fontSize: '2.2rem' }}
                    >
                        Select Service
                    </h1>

                    <div className="flex items-center gap-3">
                        {/* Icon 1 — Accessibility (static, green) */}
                        <button
                            aria-label="Accessibility"
                            className="flex items-center justify-center rounded-xl text-white flex-shrink-0"
                            style={{
                                backgroundColor: '#1E8B4F',
                                width: '64px',
                                height: '64px',
                                border: 'none',
                                cursor: 'default',
                            }}
                        >
                            <MdAccessibility size={36} color="white" />
                        </button>

                        {/* Icon 2 — Voice Agent (blue → red when active) */}
                        <button
                            aria-label="AI Voice Assistant"
                            onClick={isActive ? stopSession : startSession}
                            className="flex items-center justify-center rounded-xl text-white flex-shrink-0"
                            style={{
                                backgroundColor: isActive ? '#c0392b' : '#1565C0',
                                width: '64px',
                                height: '64px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="white">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-300 mt-4 mb-0" />

                {/* Service Buttons – horizontal row, vertically centered */}
                <div className="flex-1 flex flex-row items-center justify-center gap-10">
                    {SERVICES.map((service) => (
                        <button
                            key={service.label}
                            onClick={() => navigate(service.path)}
                            className="flex flex-col items-center justify-center font-bold text-gray-900 rounded-2xl cursor-pointer"
                            style={{
                                backgroundColor: '#F5E17A',
                                border: '2px solid #D4B800',
                                minHeight: '200px',
                                width: '280px',
                                fontSize: '1.25rem',
                                letterSpacing: '0.04em',
                                gap: '16px',
                            }}
                        >
                            <ServiceIcon name={service.label} />
                            {service.label}
                        </button>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    )
}

function ServiceIcon({ name }) {
    const style = { display: 'block' }

    if (name === 'GAS') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="#1A1A1A" style={style}>
                {/* Valve cap */}
                <rect x="24" y="4" width="16" height="4" rx="2" />
                {/* Valve neck */}
                <rect x="28" y="8" width="8" height="5" rx="1" />
                {/* Cylinder top ellipse */}
                <ellipse cx="32" cy="15" rx="14" ry="4" />
                {/* Cylinder body */}
                <rect x="18" y="15" width="28" height="30" />
                {/* Cylinder bottom ellipse */}
                <ellipse cx="32" cy="45" rx="14" ry="4" />
                {/* Base */}
                <rect x="20" y="47" width="24" height="5" rx="2" />
                {/* Label band (lighter stripe on body) */}
                <rect x="18" y="28" width="28" height="8" fill="#D4B800" />
            </svg>
        )
    }

    if (name === 'ELECTRICITY') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="#1A1A1A" style={style}>
                {/* Lightning bolt */}
                <path d="M7 2v11h3v9l7-12h-4l4-8z" />
            </svg>
        )
    }

    // MUNICIPAL SERVICES – building icon
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="#1A1A1A" style={style}>
            <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5v-2h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" />
        </svg>
    )
}
