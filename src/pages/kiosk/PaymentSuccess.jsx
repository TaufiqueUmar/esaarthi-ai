import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

/* ── Ticker notices ── */
const TICKER_NOTICES = [
    '⚠️  Important Notice: Scheduled maintenance today from 3 PM to 5 PM',
    '📢  Citizens can now pay bills 24×7 via BBPS integrated KIOSK system',
    '🔔  New: OTP-based secure authentication enabled for all bill payments',
    '📋  BBPS Reference Number is generated instantly after successful payment',
    '💳  Accepted: UPI | Debit Card | Net Banking | Cash at KIOSK counter',
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

/* ── Generate mock IDs ── */
function generateTxnId() {
    return 'TXN' + Date.now().toString().slice(-10).toUpperCase()
}
function generateBbpsRef() {
    return 'BBPS' + Math.random().toString(36).slice(2, 10).toUpperCase()
}

/* ── Format date ── */
function formatDateTime(d) {
    return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    })
}

/* ── Label for payment method ── */
function paymentLabel(id) {
    if (!id) return 'UPI'
    const map = { upi: 'UPI', card: 'Debit / Credit Card', bbps: 'BBPS Direct' }
    return map[id] ?? id
}

/* ── Label for service type ── */
function serviceLabel(s) {
    if (!s) return 'Electricity Bill'
    const map = { gas: 'Gas Bill', electricity: 'Electricity Bill', municipal: 'Municipal Services' }
    return map[s.toLowerCase()] ?? s
}

export default function PaymentSuccess() {
    const navigate = useNavigate()
    const location = useLocation()
    const { consumerNumber, serviceType, amount, paymentMethod } = location.state ?? {}

    /* Stable mock IDs – generated once per mount */
    const txnIdRef = useRef(generateTxnId())
    const bbpsRef = useRef(generateBbpsRef())
    const paidAt = useRef(new Date())

    /* Auto-reset countdown */
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
    const resetCountdown = () => {
        setCountdown(AUTO_RESET_SEC)
    }

    /* ── Ticker ── */
    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

    /* ── Transaction rows ── */
    const rows = [
        { label: 'Service Type', value: serviceLabel(serviceType) },
        { label: 'Consumer Number', value: consumerNumber ?? '1234567890' },
        { label: 'Transaction ID', value: txnIdRef.current },
        { label: 'BBPS Reference ID', value: bbpsRef.current },
        { label: 'Payment Method', value: paymentLabel(paymentMethod) },
        { label: 'Date & Time', value: formatDateTime(paidAt.current) },
    ]

    const displayAmount = amount ?? '876.50'

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
            <main className="flex-1 flex flex-col items-center justify-evenly overflow-hidden px-20 py-3 gap-0">

                {/* ── SUCCESS HEADING ── */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    {/* Green tick icon */}
                    <div
                        className="success-icon-anim w-12 h-12 rounded-full border-4 border-green-600 bg-green-50 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-7 h-7 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="font-extrabold text-gray-900 text-3xl tracking-tight leading-none">
                        Payment Successful
                    </h1>
                </div>

                {/* ── TRANSACTION DETAILS CARD ── */}
                <div className="w-full max-w-3xl border-2 border-gray-300 rounded-2xl overflow-hidden flex-shrink-0">

                    {/* Card header strip */}
                    <div className="bg-gray-100 border-b-2 border-gray-300 px-8 py-2 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600" />
                        <span className="font-bold text-gray-700 text-base tracking-wide uppercase">
                            Transaction Details
                        </span>
                        <span className="ml-auto text-green-700 text-sm font-semibold uppercase tracking-wide">
                            ✔ BBPS Verified
                        </span>
                    </div>

                    {/* Detail rows */}
                    <div className="px-8 py-0.5 flex flex-col gap-0 divide-y divide-gray-100">
                        {rows.map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between py-1.5">
                                <span className="text-gray-500 font-medium text-sm w-48 flex-shrink-0">
                                    {label}
                                </span>
                                <span className="font-semibold text-gray-900 text-sm text-right">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Amount row */}
                    <div className="border-t-2 border-gray-300 bg-green-50 px-8 py-3 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-0.5">
                                Amount Paid
                            </p>
                            <p className="text-gray-400 text-xs">Payment received &amp; confirmed</p>
                        </div>
                        <div className="text-right">
                            <span
                                className="font-extrabold text-green-700"
                                style={{ fontSize: '2rem', letterSpacing: '-0.01em' }}
                            >
                                ₹ {displayAmount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── ACKNOWLEDGEMENT ── */}
                <p className="text-gray-500 text-center text-sm font-medium leading-relaxed flex-shrink-0 max-w-2xl">
                    You may track this transaction anytime using the reference number.
                </p>

                {/* ── ACTION BUTTONS ── */}
                <div className="w-full max-w-3xl flex gap-6 flex-shrink-0">
                    {/* Print Receipt */}
                    <button
                        onClick={() => window.print()}
                        className="flex-1 rounded-xl font-extrabold text-lg border-2 border-yellow-500 bg-yellow-300 text-gray-900 focus:outline-none"
                        style={{ height: '64px', letterSpacing: '0.02em' }}
                    >
                        🖨&nbsp; Print Receipt
                    </button>

                    {/* Done */}
                    <button
                        onClick={goHome}
                        className="flex-1 rounded-xl font-extrabold text-lg border-2 border-yellow-500 bg-yellow-400 text-gray-900 focus:outline-none"
                        style={{ height: '64px', letterSpacing: '0.02em' }}
                    >
                        Done ✓
                    </button>
                </div>

                {/* ── AUTO-RESET NOTICE ── */}
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
