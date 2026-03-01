import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

/* ── Ticker notices ── */
const TICKER_NOTICES = [
    '⚠️  Important Notice: Scheduled maintenance today from 3 PM to 5 PM',
    '📢  New connections are processed within 7 working days',
    '🔔  DigiLocker integration ensures secure, paperless verification',
    '📋  Keep your Aadhaar number handy for quick identity verification',
    '📞  For emergencies, call 1800-XXX-XXXX (Toll Free)',
]

const TICKER_STYLE = `
@keyframes ticker-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.ticker-track {
    display: inline-flex;
    white-space: nowrap;
    animation: ticker-scroll 36s linear infinite;
}
.ticker-track:hover { animation-play-state: paused; }

@keyframes card-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-4px); }
}
.digilocker-card {
    animation: card-float 4s ease-in-out infinite;
}

@keyframes shine {
    0%   { left: -75%; }
    100% { left: 150%; }
}
.btn-shine {
    position: relative;
    overflow: hidden;
}
.btn-shine::after {
    content: '';
    position: absolute;
    top: 0; left: -75%;
    width: 50%; height: 100%;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%);
    animation: shine 2.4s ease-in-out infinite;
}
`

const BENEFITS = [
    { icon: '✔', text: 'Personal details will be auto-fetched via DigiLocker' },
    { icon: '✔', text: 'Aadhaar-based secure verification' },
    { icon: '✔', text: 'No manual paperwork required' },
    { icon: '✔', text: 'Faster approval process' },
]

export default function NewConnectionStart() {
    const navigate = useNavigate()
    const { service } = useParams()

    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

    return (
        <div
            className="flex flex-col bg-white overflow-hidden"
            style={{ fontFamily: "'Noto Sans', sans-serif", height: '100vh' }}
        >
            <style>{TICKER_STYLE}</style>

            <Header />

            {/* ── TICKER STRIP ── */}
            <div
                className="w-full flex items-center overflow-hidden bg-amber-50 border-t-2 border-b-2 border-yellow-500"
                style={{ minHeight: '44px' }}
            >
                <div
                    className="flex-shrink-0 flex items-center justify-center font-bold text-white px-4 self-stretch bg-yellow-500"
                    style={{ fontSize: '0.82rem', letterSpacing: '0.08em', minWidth: '88px' }}
                >
                    NOTICE
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <span className="ticker-track text-gray-900 font-medium" style={{ fontSize: '0.97rem' }}>
                        {fullTrack}
                    </span>
                </div>
            </div>

            {/* ── MAIN ── */}
            <main className="flex-1 flex flex-col items-center justify-evenly overflow-hidden px-20 py-4">

                {/* ── 1. TITLE ── */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <h1 className="font-extrabold text-gray-900 text-4xl tracking-tight leading-none text-center">
                        Apply for New Connection
                    </h1>
                    <p className="text-gray-500 text-lg font-medium text-center">
                        Verify your identity to continue
                    </p>
                </div>

                {/* ── 2. INFORMATION CARD ── */}
                <div className="digilocker-card w-full max-w-2xl border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">

                    {/* Card header */}
                    <div className="bg-gray-100 border-b-2 border-gray-200 px-8 py-3 flex items-center gap-3">
                        {/* DigiLocker logo-ish badge */}
                        <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M12 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM4 12C4 7.582 7.582 4 12 4s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" />
                            </svg>
                        </div>
                        <span className="font-bold text-gray-700 text-base tracking-wide uppercase">
                            Identity Verification
                        </span>
                        <span className="ml-auto text-blue-700 text-sm font-semibold uppercase tracking-wide">
                            🔒 Secured by DigiLocker
                        </span>
                    </div>

                    {/* Benefits list */}
                    <div className="px-8 py-5 bg-white flex flex-col gap-4">
                        {BENEFITS.map(({ icon, text }) => (
                            <div key={text} className="flex items-center gap-4">
                                <span
                                    className="w-7 h-7 rounded-full bg-green-100 border border-green-400 flex items-center justify-center flex-shrink-0 font-bold text-green-700 text-base"
                                >
                                    {icon}
                                </span>
                                <span className="text-gray-800 font-medium text-base">{text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Bottom disclaimer row */}
                    <div className="bg-blue-50 border-t-2 border-blue-100 px-8 py-2.5 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                        </svg>
                        <span className="text-blue-700 text-sm font-medium">
                            Your data is fetched directly from government servers and is never stored on this kiosk.
                        </span>
                    </div>
                </div>

                {/* ── 3. PRIMARY BUTTON ── */}
                <button
                    onClick={() => navigate(`/${service}/new-connection/verify`)}
                    className="btn-shine w-full max-w-2xl rounded-xl font-extrabold text-xl text-gray-900 bg-yellow-400 border-2 border-yellow-500 focus:outline-none active:scale-95 transition-transform flex items-center justify-center gap-3 flex-shrink-0"
                    style={{ height: '72px', letterSpacing: '0.02em' }}
                >
                    {/* DigiLocker icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-gray-900" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Verify with DigiLocker
                </button>

                {/* ── 4. SECONDARY BUTTON ── */}
                <button
                    onClick={() => navigate('/services')}
                    className="w-full max-w-2xl rounded-xl font-bold text-lg text-gray-600 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 focus:outline-none active:scale-95 transition-all flex-shrink-0"
                    style={{ height: '56px' }}
                >
                    ← Cancel
                </button>

            </main>

            <Footer />
        </div>
    )
}
