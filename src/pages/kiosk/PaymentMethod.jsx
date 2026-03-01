import { useState } from 'react'
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
`

/* ── Payment Options ── */
const PAYMENT_OPTIONS = [
    {
        id: 'upi',
        label: 'UPI',
        badge: 'Recommended',
        subtext: 'Pay instantly using any UPI app',
        note: 'Google Pay · PhonePe · Paytm · BHIM',
    },
    {
        id: 'card',
        label: 'Debit / Credit Card',
        badge: null,
        subtext: 'Secure card payment via BBPS',
        note: 'Visa · Mastercard · RuPay',
    },
    {
        id: 'bbps',
        label: 'BBPS Direct',
        badge: null,
        subtext: 'Government integrated payment channel',
        note: 'Bharat Bill Payment System',
    },
]

export default function PaymentMethod() {
    const navigate = useNavigate()
    const location = useLocation()
    const { consumerNumber, serviceType, amount } = location.state ?? {}

    const [selected, setSelected] = useState(null)

    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

    const handleProceed = () => {
        if (!selected) return
        navigate('/payment-processing', {
            state: { consumerNumber, serviceType, amount, paymentMethod: selected },
        })
    }

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
            <main className="flex-1 flex flex-col overflow-hidden px-20 pt-5 pb-4">

                {/* Page Title */}
                <div className="flex-shrink-0 mb-5">
                    <h1 className="font-extrabold text-gray-900 text-3xl">Select Payment Method</h1>
                    <hr className="border-gray-300 mt-3" />
                </div>

                {/* ── Amount pill ── */}
                {amount && (
                    <div className="flex-shrink-0 flex items-center justify-center mb-5">
                        <div className="inline-flex items-center gap-3 border-2 border-yellow-400 bg-amber-50 rounded-xl px-8 py-3">
                            <span className="text-gray-500 font-medium text-base">Amount Payable</span>
                            <span className="font-extrabold text-gray-900 text-2xl">₹ {amount}</span>
                        </div>
                    </div>
                )}

                {/* ── Payment Options Grid ── */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="grid grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
                        {PAYMENT_OPTIONS.map((opt) => {
                            const isActive = selected === opt.id
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => setSelected(opt.id)}
                                    className={[
                                        'flex flex-col items-start justify-between text-left rounded-2xl border-2 px-8 py-7',
                                        'focus:outline-none',
                                        isActive
                                            ? 'border-yellow-500 bg-yellow-50'
                                            : 'border-gray-300 bg-white',
                                    ].join(' ')}
                                    style={{ minHeight: '160px' }}
                                >
                                    <div className="w-full">
                                        <div className="flex items-center justify-between mb-2">
                                            <span
                                                className={[
                                                    'font-extrabold text-xl',
                                                    isActive ? 'text-gray-900' : 'text-gray-800',
                                                ].join(' ')}
                                            >
                                                {opt.label}
                                            </span>
                                            {opt.badge && (
                                                <span className="text-xs font-bold uppercase tracking-wide bg-yellow-400 text-gray-900 border border-yellow-500 rounded px-2 py-0.5">
                                                    {opt.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm font-medium leading-snug">
                                            {opt.subtext}
                                        </p>
                                    </div>

                                    <div className="mt-4 w-full flex items-center justify-between">
                                        <span className="text-gray-400 text-xs font-medium">{opt.note}</span>
                                        {/* Selection indicator */}
                                        <div
                                            className={[
                                                'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                                                isActive
                                                    ? 'border-yellow-500 bg-yellow-400'
                                                    : 'border-gray-300 bg-white',
                                            ].join(' ')}
                                        >
                                            {isActive && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* ── Proceed Button ── */}
                <div className="flex-shrink-0 mt-5 flex flex-col items-center gap-3">
                    <button
                        onClick={handleProceed}
                        disabled={!selected}
                        className={[
                            'w-full max-w-5xl mx-auto rounded-xl font-extrabold text-xl border-2',
                            'focus:outline-none',
                            selected
                                ? 'border-yellow-500 bg-yellow-300 text-gray-900'
                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed',
                        ].join(' ')}
                        style={{ height: '76px', letterSpacing: '0.02em' }}
                    >
                        {selected ? 'Proceed to Pay →' : 'Select a Payment Method to Continue'}
                    </button>

                    {/* Security notice */}
                    <p className="text-gray-400 text-xs text-center font-medium">
                        🔒&nbsp; All payments are processed securely via BBPS and encrypted HTTPS channels.
                    </p>
                </div>

            </main>

            <Footer />
        </div>
    )
}
