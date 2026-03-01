import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

/* ── Ticker notices ── */
const TICKER_NOTICES = [
    '⚠️  Important Notice: Scheduled maintenance today from 3 PM to 5 PM',
    '📢  Register complaints 24×7 via the eSaarthi KIOSK system',
    '🔔  All complaints are resolved within 48 hours as per service guarantee',
    '📋  A unique Reference ID is generated after successful complaint submission',
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

/* ── Generate mock Reference ID ── */
function generateRefId() {
    const prefix = 'CMP'
    const timestamp = Date.now().toString().slice(-7)
    const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
    return `${prefix}-${timestamp}-${rand}`
}

/* ── Format current date ── */
function formatDate(d) {
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

/* ── Readable service type label ── */
function serviceLabel(s) {
    if (!s) return 'General Services'
    const map = {
        gas: 'Gas Services',
        electricity: 'Electricity Services',
        municipal: 'Municipal Services',
        water: 'Water Supply Services',
    }
    return map[s.toLowerCase()] ?? s
}

/* ── Readable category label ── */
function categoryLabel(c) {
    if (!c) return 'General Complaint'
    return c.charAt(0).toUpperCase() + c.slice(1)
}

export default function ComplaintSuccess() {
    const navigate = useNavigate()
    const location = useLocation()
    const { service, consumerNo, category, description, mobile } = location.state ?? {}

    /* Stable mock reference ID – generated once per mount */
    const refIdRef = useRef(generateRefId())
    const submittedAt = useRef(new Date())

    /* ── Auto-reset countdown ── */
    const [countdown, setCountdown] = useState(AUTO_RESET_SEC)
    const timerRef = useRef(null)

    const goHome = useCallback(() => navigate('/'), [navigate])

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

    /* Reset countdown on any touch / click */
    const resetCountdown = () => setCountdown(AUTO_RESET_SEC)

    /* ── Ticker ── */
    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

    /* ── Complaint detail rows ── */
    const rows = [
        { label: 'Service Type', value: serviceLabel(service) },
        { label: 'Complaint Category', value: categoryLabel(category) },
        { label: 'Consumer Number', value: consumerNo ?? 'N/A' },
        { label: 'Registered Mobile', value: mobile ? `+91 ${mobile}` : 'N/A' },
        { label: 'Submission Date', value: formatDate(submittedAt.current) },
        { label: 'Expected Resolution', value: 'Within 48 Hours' },
        { label: 'Current Status', value: 'Submitted' },
    ]

    return (
        <div
            className="flex flex-col bg-white overflow-hidden"
            style={{ fontFamily: "'Noto Sans', sans-serif", height: '100vh' }}
            onClick={resetCountdown}
            onTouchStart={resetCountdown}
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
            <main className="flex-1 flex flex-col items-center justify-evenly overflow-hidden px-20 py-3">

                {/* ── 1. SUCCESS HEADER ── */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    {/* Animated green tick */}
                    <div
                        className="success-icon-anim w-16 h-16 rounded-full border-4 border-green-600 bg-green-50 flex items-center justify-center"
                    >
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

                    <h1 className="font-extrabold text-gray-900 text-3xl tracking-tight leading-none text-center">
                        Complaint Registered Successfully
                    </h1>
                </div>

                {/* ── 2. COMPLAINT DETAILS CARD ── */}
                <div className="w-full max-w-3xl border-2 border-gray-300 rounded-2xl overflow-hidden flex-shrink-0">

                    {/* Card header strip */}
                    <div className="bg-gray-100 border-b-2 border-gray-300 px-8 py-2.5 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600" />
                        <span className="font-bold text-gray-700 text-base tracking-wide uppercase">
                            Complaint Details
                        </span>
                        <span className="ml-auto text-green-700 text-sm font-semibold uppercase tracking-wide">
                            ✔ Registered
                        </span>
                    </div>

                    {/* Reference ID – bold and prominent */}
                    <div className="px-8 py-3 bg-green-50 border-b-2 border-gray-200 flex items-center justify-between">
                        <span className="text-gray-500 font-medium text-sm uppercase tracking-wider">
                            Reference ID
                        </span>
                        <span
                            className="font-extrabold text-green-800 tracking-widest"
                            style={{ fontSize: '1.45rem', letterSpacing: '0.1em' }}
                        >
                            {refIdRef.current}
                        </span>
                    </div>

                    {/* Detail rows */}
                    <div className="px-8 py-0.5 flex flex-col divide-y divide-gray-100">
                        {rows.map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between py-1.5">
                                <span className="text-gray-500 font-medium text-sm w-52 flex-shrink-0">
                                    {label}
                                </span>
                                <span
                                    className={[
                                        'font-semibold text-sm text-right',
                                        label === 'Expected Resolution'
                                            ? 'text-amber-700'
                                            : label === 'Current Status'
                                                ? 'text-green-700'
                                                : 'text-gray-900',
                                    ].join(' ')}
                                >
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 3. STATUS MESSAGE ── */}
                <p className="text-gray-500 text-center text-sm font-medium leading-relaxed flex-shrink-0 max-w-2xl">
                    You can track the progress of your complaint using the reference ID.
                </p>

                {/* ── 4. ACTION BUTTONS ── */}
                <div className="w-full max-w-3xl flex gap-6 flex-shrink-0">
                    {/* Print Receipt */}
                    <button
                        onClick={() => window.print()}
                        className="flex-1 rounded-xl font-extrabold text-lg border-2 border-yellow-500 bg-yellow-300 text-gray-900 focus:outline-none active:scale-95 transition-transform"
                        style={{ height: '64px', letterSpacing: '0.02em' }}
                    >
                        🖨&nbsp; Print Receipt
                    </button>

                    {/* Track Status */}
                    <button
                        onClick={() => navigate('/status')}
                        className="flex-1 rounded-xl font-extrabold text-lg border-2 border-yellow-500 bg-yellow-400 text-gray-900 focus:outline-none active:scale-95 transition-transform"
                        style={{ height: '64px', letterSpacing: '0.02em' }}
                    >
                        Track Status →
                    </button>
                </div>

                {/* ── 5. AUTO-RETURN NOTICE ── */}
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
