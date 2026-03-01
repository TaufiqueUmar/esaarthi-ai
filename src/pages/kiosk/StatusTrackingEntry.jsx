import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

@keyframes input-focus-glow {
    0%   { box-shadow: 0 0 0 0 rgba(234,179,8,0.4); }
    100% { box-shadow: 0 0 0 6px rgba(234,179,8,0); }
}
.input-focused {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 3px rgba(234,179,8,0.25);
}
`

export default function StatusTrackingEntry() {
    const navigate = useNavigate()

    const [refId, setRefId] = useState('')
    const [mobile, setMobile] = useState('')
    const [error, setError] = useState('')

    /* ── Ticker ── */
    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

    /* ── Validation & navigation ── */
    const handleTrack = () => {
        const trimRef = refId.trim()
        const trimMob = mobile.trim()

        if (!trimRef && !trimMob) {
            setError('Please enter a Reference ID or a Registered Mobile Number.')
            return
        }

        if (trimMob && !/^\d{10}$/.test(trimMob)) {
            setError('Mobile number must be exactly 10 digits.')
            return
        }

        setError('')
        navigate('/status-result', {
            state: { refId: trimRef || null, mobile: trimMob || null },
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
            <main className="flex-1 flex flex-col items-center justify-center overflow-hidden px-20 py-6 gap-0">

                {/* ── TITLE SECTION ── */}
                <div className="flex flex-col items-center gap-2 w-full max-w-2xl flex-shrink-0">
                    <h1
                        className="font-extrabold text-gray-900 text-center tracking-tight leading-tight"
                        style={{ fontSize: '2.6rem' }}
                    >
                        Track Service Status
                    </h1>


                    {/* Divider */}
                    <div className="w-full flex items-center gap-4 mt-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>
                </div>

                {/* ── INPUT SECTION ── */}
                <div className="flex flex-col items-center w-full max-w-2xl mt-10 gap-0 flex-shrink-0">

                    {/* Reference ID Input */}
                    <div className="w-full flex flex-col gap-2">
                        <label
                            htmlFor="refId"
                            className="font-bold text-gray-700 uppercase tracking-widest"
                            style={{ fontSize: '0.85rem' }}
                        >
                            Reference ID
                        </label>
                        <input
                            id="refId"
                            type="text"
                            value={refId}
                            onChange={(e) => { setRefId(e.target.value); setError('') }}
                            placeholder="e.g. BBPS1234567890"
                            className="w-full rounded-2xl border-2 border-gray-300 bg-gray-50 text-gray-900 font-semibold px-6
                                       focus:border-yellow-500 focus:bg-white transition-colors duration-150"
                            style={{ height: '72px', fontSize: '1.25rem' }}
                            autoComplete="off"
                            spellCheck="false"
                        />
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center gap-5 w-full my-5">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span
                            className="font-extrabold text-gray-400 uppercase tracking-widest flex-shrink-0"
                            style={{ fontSize: '0.9rem' }}
                        >
                            OR
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Mobile Number Input */}
                    <div className="w-full flex flex-col gap-2">
                        <label
                            htmlFor="mobile"
                            className="font-bold text-gray-700 uppercase tracking-widest"
                            style={{ fontSize: '0.85rem' }}
                        >
                            Registered Mobile Number
                        </label>
                        <div className="relative w-full">
                            {/* Country code prefix */}
                            <span
                                className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-500 select-none pointer-events-none"
                                style={{ fontSize: '1.25rem' }}
                            >
                                +91
                            </span>
                            <input
                                id="mobile"
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                value={mobile}
                                onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); setError('') }}
                                placeholder="10-digit mobile number"
                                className="w-full rounded-2xl border-2 border-gray-300 bg-gray-50 text-gray-900 font-semibold
                                           focus:border-yellow-500 focus:bg-white transition-colors duration-150"
                                style={{ height: '72px', fontSize: '1.25rem', paddingLeft: '72px', paddingRight: '24px' }}
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="w-full mt-4 flex items-center gap-3 rounded-xl border-2 border-red-200 bg-red-50 px-5 py-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                            <span className="text-red-700 font-semibold" style={{ fontSize: '1rem' }}>{error}</span>
                        </div>
                    )}

                    {/* ── TRACK STATUS BUTTON ── */}
                    <button
                        onClick={handleTrack}
                        className="w-full mt-8 rounded-2xl font-extrabold text-gray-900 bg-yellow-400 border-2 border-yellow-500
                                   focus:outline-none active:scale-95 transition-transform duration-100"
                        style={{ height: '72px', fontSize: '1.35rem', letterSpacing: '0.04em' }}
                    >
                        🔍&nbsp;&nbsp;Track Status
                    </button>

                    {/* Helper note */}
                    <p className="text-gray-400 text-center mt-4 font-medium" style={{ fontSize: '0.9rem' }}>
                        You can track Bill Payments, Complaints &amp; New Connection requests.
                    </p>
                </div>

            </main>

            <Footer />
        </div>
    )
}
