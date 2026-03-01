import { useState, useRef, useEffect, useCallback } from 'react'
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

const OTP_LENGTH = 6
const RESEND_SECONDS = 30

export default function OTPVerification() {
    const navigate = useNavigate()
    const location = useLocation()
    const { consumerNumber, serviceType } = location.state ?? {}

    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
    const inputRefs = useRef([])

    const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
    const timerRef = useRef(null)

    const startTimer = useCallback(() => {
        setSecondsLeft(RESEND_SECONDS)
        clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            setSecondsLeft((s) => {
                if (s <= 1) { clearInterval(timerRef.current); return 0 }
                return s - 1
            })
        }, 1000)
    }, [])

    useEffect(() => {
        startTimer()
        return () => clearInterval(timerRef.current)
    }, [startTimer])

    const focusBox = (index) => {
        if (index >= 0 && index < OTP_LENGTH) inputRefs.current[index]?.focus()
    }

    const handleBoxChange = (index, value) => {
        const digit = value.replace(/\D/g, '').slice(-1)
        const next = [...otp]
        next[index] = digit
        setOtp(next)
        if (digit && index < OTP_LENGTH - 1) focusBox(index + 1)
    }

    const handleBoxKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (otp[index]) {
                const next = [...otp]; next[index] = ''; setOtp(next)
            } else {
                focusBox(index - 1)
            }
        }
    }

    const handleKeypadPress = (digit) => {
        const emptyIndex = otp.findIndex((v) => v === '')
        if (emptyIndex === -1) return
        const next = [...otp]
        next[emptyIndex] = String(digit)
        setOtp(next)
        focusBox(emptyIndex + 1 < OTP_LENGTH ? emptyIndex + 1 : emptyIndex)
    }

    const handleKeypadDelete = () => {
        let lastFilled = -1
        for (let i = OTP_LENGTH - 1; i >= 0; i--) { if (otp[i] !== '') { lastFilled = i; break } }
        if (lastFilled === -1) return
        const next = [...otp]; next[lastFilled] = ''; setOtp(next)
        focusBox(lastFilled)
    }

    const handleResend = () => {
        if (secondsLeft > 0) return
        setOtp(Array(OTP_LENGTH).fill(''))
        focusBox(0)
        startTimer()
    }

    const isComplete = otp.every((v) => v !== '')

    const handleVerify = () => {
        if (!isComplete) return
        navigate('/bill-details', { state: { consumerNumber, serviceType, otp: otp.join('') } })
    }

    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

    const keypadRows = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

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
            <main className="flex-1 flex flex-col overflow-hidden px-16 pt-5 pb-3">

                {/* Page title */}
                <div className="flex-shrink-0 mb-2">
                    <h1 className="font-extrabold text-gray-900 text-4xl">OTP Verification</h1>
                    <hr className="border-gray-300 mt-3" />
                </div>

                {/* Centered layout */}
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <div className="flex flex-col items-center gap-2 py-2" style={{ width: '560px' }}>



                        {/* OTP boxes */}
                        <div className="flex gap-3 w-full justify-center">
                            {otp.map((val, idx) => (
                                <input
                                    key={idx}
                                    ref={(el) => (inputRefs.current[idx] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={val}
                                    onChange={(e) => handleBoxChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleBoxKeyDown(idx, e)}
                                    onFocus={(e) => e.target.select()}
                                    className={[
                                        'w-16 rounded-xl text-center font-extrabold text-gray-900 outline-none border-2 transition-colors duration-150',
                                        val ? 'border-indigo-800 bg-indigo-50' : 'border-gray-300 bg-white',
                                    ].join(' ')}
                                    style={{ height: '64px', fontSize: '2rem', caretColor: 'transparent' }}
                                />
                            ))}
                        </div>




                        {/* Resend row */}
                        <div className="flex items-center gap-4 justify-center">
                            <span className="text-gray-500 font-medium text-sm">
                                {secondsLeft > 0
                                    ? `Did not receive OTP? Resend in ${secondsLeft}s`
                                    : 'Did not receive OTP?'}
                            </span>
                            <button
                                onClick={handleResend}
                                disabled={secondsLeft > 0}
                                className={[
                                    'font-bold text-sm px-4 py-1.5 rounded-lg border-2 transition-colors duration-150',
                                    secondsLeft > 0
                                        ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                                        : 'border-indigo-800 text-indigo-800 bg-white',
                                ].join(' ')}
                            >
                                Resend OTP
                            </button>
                        </div>

                        {/* ── Numeric Keypad ── */}
                        <div className="w-full flex flex-col gap-1.5 mt-1">
                            {keypadRows.map((row, ri) => (
                                <div key={ri} className="flex gap-1.5 justify-center">
                                    {row.map((digit) => (
                                        <button
                                            key={digit}
                                            onClick={() => handleKeypadPress(digit)}
                                            className="flex-1 rounded-xl font-extrabold text-gray-900 bg-amber-50 border-2 border-yellow-400 active:bg-yellow-200 text-2xl"
                                            style={{ maxWidth: '172px', minHeight: '56px' }}
                                        >
                                            {digit}
                                        </button>
                                    ))}
                                </div>
                            ))}

                            {/* Last row: spacer | 0 | DEL */}
                            <div className="flex gap-1.5 justify-center">
                                <div className="flex-1" style={{ maxWidth: '172px', minHeight: '56px' }} />
                                <button
                                    onClick={() => handleKeypadPress(0)}
                                    className="flex-1 rounded-xl font-extrabold text-gray-900 bg-amber-50 border-2 border-yellow-400 active:bg-yellow-200 text-2xl"
                                    style={{ maxWidth: '172px', minHeight: '56px' }}
                                >
                                    0
                                </button>
                                <button
                                    onClick={handleKeypadDelete}
                                    className="flex-1 rounded-xl font-bold text-gray-700 bg-gray-100 border-2 border-gray-300 active:bg-gray-200 text-base"
                                    style={{ maxWidth: '172px', minHeight: '56px' }}
                                >
                                    ← DEL
                                </button>
                            </div>
                        </div>

                        {/* Verify button */}
                        <button
                            onClick={handleVerify}
                            disabled={!isComplete}
                            className={[
                                'w-full rounded-xl font-extrabold text-xl border-2 transition-colors duration-150 mt-2',
                                isComplete
                                    ? 'bg-yellow-300 border-yellow-500 text-gray-900 cursor-pointer'
                                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed',
                            ].join(' ')}
                            style={{ minHeight: '60px', letterSpacing: '0.04em' }}
                        >
                            Verify &amp; Continue
                        </button>

                    </div>
                </div>

            </main>

            <Footer />
        </div>
    )
}
