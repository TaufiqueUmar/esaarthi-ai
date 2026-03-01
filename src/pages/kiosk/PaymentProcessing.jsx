import { useEffect, useState } from 'react'
import { BsShieldLock, BsLockFill } from 'react-icons/bs'
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

@keyframes spin-ring {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.spinner-ring {
    animation: spin-ring 1.1s linear infinite;
}

@keyframes status-fade {
    0%   { opacity: 0; transform: translateY(6px); }
    15%  { opacity: 1; transform: translateY(0); }
    80%  { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-6px); }
}
.status-fade {
    animation: status-fade 2s ease-in-out forwards;
}

@keyframes dot-pulse {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40%            { opacity: 1;   transform: scale(1); }
}
.dot-1 { animation: dot-pulse 1.4s ease-in-out infinite 0s; }
.dot-2 { animation: dot-pulse 1.4s ease-in-out infinite 0.2s; }
.dot-3 { animation: dot-pulse 1.4s ease-in-out infinite 0.4s; }
`

/* ── Processing status messages (cycle every 2 s) ── */
const STATUS_MESSAGES = [
    'Connecting to BBPS Secure Gateway...',
    'Verifying transaction details...',
    'Processing payment...',
    'Finalising and generating receipt...',
]

export default function PaymentProcessing() {
    const navigate = useNavigate()
    const location = useLocation()
    const { consumerNumber, serviceType, amount, paymentMethod } =
        location.state ?? {}

    const [statusIdx, setStatusIdx] = useState(0)
    const [animKey, setAnimKey] = useState(0)   // forces re-mount for fade

    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

    /* ── Cycle status messages every 2 s ── */
    useEffect(() => {
        const interval = setInterval(() => {
            setStatusIdx(prev => {
                const next = (prev + 1) % STATUS_MESSAGES.length
                setAnimKey(k => k + 1)
                return next
            })
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    /* ── Auto-redirect after ~5 s ── */
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/payment-success', {
                state: { consumerNumber, serviceType, amount, paymentMethod },
            })
        }, 5000)
        return () => clearTimeout(timer)
    }, [navigate, consumerNumber, serviceType, amount, paymentMethod])

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
            <main className="flex-1 flex flex-col items-center justify-center overflow-hidden px-20 py-8">

                {/* ── Processing Container ── */}
                <div className="w-full max-w-3xl flex flex-col items-center border-2 border-gray-200 rounded-2xl bg-white px-16 py-14">

                    {/* Heading */}
                    <h1
                        className="font-extrabold text-gray-900 text-center leading-tight mb-3"
                        style={{ fontSize: '2.4rem' }}
                    >
                        Processing Your Payment
                    </h1>

                    <p className="text-gray-500 font-medium text-lg text-center mb-10">
                        Please do not press back or close the session.
                    </p>

                    {/* ── Spinner ── */}
                    <div className="mb-10 relative flex items-center justify-center" style={{ width: '96px', height: '96px' }}>
                        {/* Outer static ring */}
                        <div
                            className="absolute inset-0 rounded-full border-4 border-gray-100"
                        />
                        {/* Spinning arc */}
                        <div
                            className="absolute inset-0 rounded-full border-4 border-transparent spinner-ring"
                            style={{
                                borderTopColor: '#ca8a04',   /* yellow-600 */
                                borderRightColor: '#fde68a',   /* yellow-200 */
                            }}
                        />
                        {/* Centre shield icon */}
                        <BsShieldLock className="text-yellow-600" style={{ fontSize: '2rem' }} />
                    </div>

                    {/* ── Animated Status Message ── */}
                    <div className="mb-2 flex items-center justify-center gap-2" style={{ minHeight: '36px' }}>
                        <span
                            key={animKey}
                            className="status-fade font-semibold text-gray-700 text-xl text-center"
                        >
                            {STATUS_MESSAGES[statusIdx]}
                        </span>
                    </div>

                    {/* Pulsing dots */}
                    <div className="flex items-center gap-2 mb-10">
                        <span className="dot-1 w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                        <span className="dot-2 w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                        <span className="dot-3 w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                    </div>

                    {/* ── Divider ── */}
                    <hr className="w-full border-gray-200 mb-8" />

                    {/* ── Security Notice ── */}
                    <p className="text-gray-400 text-sm font-medium text-center leading-relaxed">
                        <BsLockFill className="inline-block mr-1 text-gray-400" style={{ verticalAlign: 'middle' }} />
                        Your transaction is protected using secure HTTPS encryption and BBPS verified channels.
                    </p>

                    {/* ── Payment detail pill (if amount passed) ── */}
                    {amount && (
                        <div className="mt-6 inline-flex items-center gap-3 border border-gray-200 bg-gray-50 rounded-xl px-6 py-3">
                            <span className="text-gray-400 font-medium text-sm">Amount</span>
                            <span className="font-extrabold text-gray-900 text-xl">₹ {amount}</span>
                            {paymentMethod && (
                                <>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-400 font-medium text-sm capitalize">{paymentMethod}</span>
                                </>
                            )}
                        </div>
                    )}
                </div>

            </main>

            <Footer />
        </div>
    )
}
