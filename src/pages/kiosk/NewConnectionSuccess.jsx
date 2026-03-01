import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

/* ── Ticker notices ── */
const TICKER_NOTICES = [
    '⚠️  Important Notice: Scheduled maintenance today from 3 PM to 5 PM',
    '📢  New connections are processed within 7 working days',
    '🔒  DigiLocker integration ensures secure, paperless verification',
    '📋  Keep your Application ID handy for tracking',
    '📞  For emergencies, call 1800-XXX-XXXX (Toll Free)',
]

const INLINE_STYLE = `
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

@keyframes success-pop {
    0%   { transform: scale(0.6); opacity: 0; }
    70%  { transform: scale(1.08); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}
.success-icon-anim {
    animation: success-pop 0.55s cubic-bezier(.36,.07,.19,.97) both;
}
`

const AUTO_RESET_SEC = 15

/* ── Generate mock Application ID ── */
function generateAppId() {
    const prefix = 'APP'
    const ts = Date.now().toString().slice(-8).toUpperCase()
    const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
    return `${prefix}-${ts}-${rand}`
}

/* ── Format date ── */
function formatDate(d) {
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

/* ── Service label ── */
function serviceLabel(service) {
    if (!service) return 'New Connection'
    const map = {
        gas: 'Gas Connection',
        electricity: 'Electricity Connection',
        water: 'Water Connection',
    }
    return map[service.toLowerCase()] ?? `${service.charAt(0).toUpperCase() + service.slice(1)} Connection`
}

export default function NewConnectionSuccess() {
    const navigate = useNavigate()
    const { service } = useParams()
    useLocation() // keep location in scope for potential future use

    /* Stable values — generated once per mount */
    const appIdRef = useRef(generateAppId())
    const submittedAt = useRef(new Date())

    /* Auto-reset countdown */
    const [countdown, setCountdown] = useState(AUTO_RESET_SEC)
    const timerRef = useRef(null)

    const goHome = useCallback(() => navigate('/'), [navigate])

    const resetCountdown = useCallback(() => {
        setCountdown(AUTO_RESET_SEC)
    }, [])

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current)
                    goHome()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timerRef.current)
    }, [goHome])

    /* Ticker */
    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

    return (
        <div
            className="flex flex-col bg-white overflow-hidden"
            style={{ fontFamily: "'Noto Sans', sans-serif", height: '100vh' }}
            onClick={resetCountdown}
            onTouchStart={resetCountdown}
        >
            <style>{INLINE_STYLE}</style>

            <Header />

            {/* ── TICKER STRIP ── */}
            <div
                className="w-full flex items-center overflow-hidden bg-amber-50 border-t-2 border-b-2 border-yellow-500 flex-shrink-0"
                style={{ minHeight: '40px' }}
            >
                <div
                    className="flex-shrink-0 flex items-center justify-center font-bold text-white px-4 self-stretch bg-yellow-500"
                    style={{ fontSize: '0.82rem', letterSpacing: '0.08em', minWidth: '88px' }}
                >
                    NOTICE
                </div>
                <div className="flex-1 overflow-hidden">
                    <span className="ticker-track text-gray-900 font-medium" style={{ fontSize: '0.93rem' }}>
                        {fullTrack}
                    </span>
                </div>
            </div>

            {/* ── MAIN ── */}
            <main className="flex-1 flex flex-col items-center justify-evenly overflow-hidden px-20 py-4">

                {/* ── SUCCESS HEADING ── */}
                <div className="flex flex-col items-center gap-3 flex-shrink-0">
                    {/* Animated green tick */}
                    <div className="success-icon-anim w-16 h-16 rounded-full border-4 border-green-600 bg-green-50 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-9 h-9 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="font-extrabold text-gray-900 text-4xl tracking-tight leading-none text-center">
                        Application Submitted Successfully
                    </h1>
                </div>

                {/* ── SUMMARY CARD ── */}
                <div className="w-full max-w-2xl border-2 border-gray-200 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">

                    {/* Card header */}
                    <div className="bg-gray-50 border-b-2 border-gray-200 px-8 py-3 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600" />
                        <span className="font-bold text-gray-700 text-base tracking-wide uppercase">
                            Application Summary
                        </span>
                        <span className="ml-auto text-green-700 text-sm font-semibold uppercase tracking-wide">
                            ✔ Submitted
                        </span>
                    </div>

                    {/* Detail rows */}
                    <div className="px-8 py-2 flex flex-col divide-y divide-gray-100">

                        {/* Application ID — prominent */}
                        <div className="flex items-center justify-between py-4">
                            <span className="text-gray-500 font-semibold text-base w-52 flex-shrink-0">
                                Application ID
                            </span>
                            <span className="font-extrabold text-gray-900 text-xl tracking-wider">
                                {appIdRef.current}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <span className="text-gray-500 font-semibold text-base w-52 flex-shrink-0">
                                Service Type
                            </span>
                            <span className="font-semibold text-gray-800 text-base">
                                {serviceLabel(service)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <span className="text-gray-500 font-semibold text-base w-52 flex-shrink-0">
                                Submission Date
                            </span>
                            <span className="font-semibold text-gray-800 text-base">
                                {formatDate(submittedAt.current)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <span className="text-gray-500 font-semibold text-base w-52 flex-shrink-0">
                                Current Status
                            </span>
                            <span className="font-bold text-green-700 text-base">
                                Submitted
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── TIMELINE NOTE ── */}
                <div className="flex items-center gap-3 px-6 py-4 bg-blue-50 border-2 border-blue-200 rounded-2xl w-full max-w-2xl flex-shrink-0">
                    <span className="text-blue-500 text-2xl flex-shrink-0" aria-hidden>🕐</span>
                    <span className="text-blue-800 font-bold text-base">
                        Technician visit within 48 hours.
                    </span>
                </div>

                {/* ── ACTION BUTTONS ── */}
                <div className="w-full max-w-2xl flex gap-6 flex-shrink-0">
                    {/* Track Status */}
                    <button
                        onClick={() => navigate('/status')}
                        className="flex-1 rounded-xl font-bold text-lg border-2 border-gray-300 bg-white text-gray-800 hover:bg-gray-50 active:scale-95 transition-all focus:outline-none"
                        style={{ height: '68px', letterSpacing: '0.02em' }}
                    >
                        Track Status
                    </button>

                    {/* Done */}
                    <button
                        onClick={goHome}
                        className="flex-1 rounded-xl font-extrabold text-lg border-2 border-yellow-500 bg-yellow-400 text-gray-900 active:scale-95 transition-all focus:outline-none"
                        style={{ height: '68px', letterSpacing: '0.02em' }}
                    >
                        Done ✓
                    </button>
                </div>

                {/* ── AUTO-RETURN NOTICE ── */}
                <p className="text-gray-400 text-sm text-center flex-shrink-0">
                    🔄&nbsp; Returning to home screen in{' '}
                    <span className="font-bold text-gray-600">{countdown}</span> seconds . . .
                    &nbsp;
                    <button
                        onClick={resetCountdown}
                        className="underline text-gray-500 font-medium focus:outline-none"
                    >
                        Stay
                    </button>
                </p>

            </main>

            <Footer />
        </div>
    )
}
