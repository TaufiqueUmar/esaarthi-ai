import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const TICKER_NOTICES = [
    '⚠️  Important Notice: Scheduled maintenance today from 3 PM to 5 PM',
    '📢  New connections are processed within 7 working days',
    '🔒  DigiLocker integration ensures secure, paperless verification',
    '📋  Keep your Aadhaar-linked mobile number handy for OTP verification',
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

@keyframes shine {
    0%   { left: -75%; }
    100% { left: 150%; }
}
.btn-shine { position: relative; overflow: hidden; }
.btn-shine::after {
    content: '';
    position: absolute;
    top: 0; left: -75%;
    width: 50%; height: 100%;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%);
    animation: shine 2.4s ease-in-out infinite;
}

@keyframes fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
}
.fade-in { animation: fade-in 0.35s ease both; }
`

const OTP_LENGTH = 6
const RESEND_SECONDS = 30
const keypadRows = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

export default function NewConnectionVerify() {
    const navigate = useNavigate()
    const { service } = useParams()

    const [phase, setPhase] = useState('mobile')
    const [mobile, setMobile] = useState('')
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

    useEffect(() => () => clearInterval(timerRef.current), [])

    const focusOtp = (i) => { if (i >= 0 && i < OTP_LENGTH) inputRefs.current[i]?.focus() }

    const handleBoxChange = (i, v) => {
        const d = v.replace(/\D/g, '').slice(-1)
        const n = [...otp]; n[i] = d; setOtp(n)
        if (d && i < OTP_LENGTH - 1) focusOtp(i + 1)
    }
    const handleBoxKeyDown = (i, e) => {
        if (e.key === 'Backspace') {
            if (otp[i]) { const n = [...otp]; n[i] = ''; setOtp(n) }
            else focusOtp(i - 1)
        }
    }

    const handleMobileKeypad = (d) => { if (mobile.length < 10) setMobile((m) => m + String(d)) }
    const handleMobileDelete = () => setMobile((m) => m.slice(0, -1))

    const handleOtpKeypad = (d) => {
        const ei = otp.findIndex((v) => v === '')
        if (ei === -1) return
        const n = [...otp]; n[ei] = String(d); setOtp(n)
        focusOtp(ei + 1 < OTP_LENGTH ? ei + 1 : ei)
    }
    const handleOtpDelete = () => {
        let lf = -1
        for (let i = OTP_LENGTH - 1; i >= 0; i--) { if (otp[i] !== '') { lf = i; break } }
        if (lf === -1) return
        const n = [...otp]; n[lf] = ''; setOtp(n); focusOtp(lf)
    }

    const handleSendOtp = () => {
        if (mobile.length !== 10) return
        setPhase('otp'); startTimer(); setTimeout(() => focusOtp(0), 50)
    }
    const handleResend = () => {
        if (secondsLeft > 0) return
        setOtp(Array(OTP_LENGTH).fill('')); focusOtp(0); startTimer()
    }

    const isComplete = otp.every((v) => v !== '')
    const handleVerify = () => {
        if (!isComplete) return
        navigate(`/${service}/new-connection/configure`, { state: { mobile, otp: otp.join('') } })
    }

    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

    const Keypad = ({ onPress, onDelete }) => (
        <div className="w-full flex flex-col gap-2">
            {keypadRows.map((row, ri) => (
                <div key={ri} className="flex gap-2">
                    {row.map((d) => (
                        <button
                            key={d}
                            onClick={() => onPress(d)}
                            className="flex-1 rounded-xl font-extrabold text-gray-900 bg-amber-50 border-2 border-yellow-400 active:bg-yellow-200 text-2xl transition-colors"
                            style={{ height: '62px' }}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            ))}
            <div className="flex gap-2">
                <div className="flex-1" style={{ height: '62px' }} />
                <button
                    onClick={() => onPress(0)}
                    className="flex-1 rounded-xl font-extrabold text-gray-900 bg-amber-50 border-2 border-yellow-400 active:bg-yellow-200 text-2xl transition-colors"
                    style={{ height: '62px' }}
                >
                    0
                </button>
                <button
                    onClick={onDelete}
                    className="flex-1 rounded-xl font-bold text-gray-700 bg-gray-100 border-2 border-gray-300 active:bg-gray-200 text-sm transition-colors"
                    style={{ height: '62px' }}
                >
                    ← DEL
                </button>
            </div>
        </div>
    )

    return (
        <div
            className="flex flex-col bg-white overflow-hidden"
            style={{ fontFamily: "'Noto Sans', sans-serif", height: '100vh' }}
        >
            <style>{INLINE_STYLE}</style>
            <Header />

            {/* TICKER */}
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

            {/* MAIN */}
            <main className="flex-1 flex items-center justify-center overflow-hidden px-8 py-4">
                <div className="w-full overflow-hidden" style={{ maxWidth: '520px' }}>

                    {phase === 'mobile' ? (
                        /* ═══════ MOBILE PHASE ═══════ */
                        <div className="fade-in flex flex-col gap-3">

                            <div>
                                <label className="block text-gray-700 font-bold mb-2" style={{ fontSize: '1rem' }}>
                                    Enter Aadhaar-linked Mobile Number
                                </label>
                                <div
                                    className="w-full border-2 border-gray-300 rounded-xl bg-gray-50 flex items-center px-4 gap-3"
                                    style={{ height: '68px' }}
                                >
                                    <span className="text-gray-400 font-semibold text-xl flex-shrink-0">+91</span>
                                    <div className="w-px h-8 bg-gray-300 flex-shrink-0" />
                                    <span
                                        className="font-extrabold text-gray-900 tracking-widest flex-1 overflow-hidden"
                                        style={{ fontSize: '1.9rem' }}
                                    >
                                        {mobile || (
                                            <span className="text-gray-300 font-normal tracking-normal" style={{ fontSize: '1rem' }}>
                                                _ _ _ _ _ _ _ _ _ _
                                            </span>
                                        )}
                                    </span>
                                    {mobile.length > 0 && (
                                        <span className="text-gray-400 font-medium text-sm flex-shrink-0">
                                            {mobile.length}/10
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Keypad onPress={handleMobileKeypad} onDelete={handleMobileDelete} />

                            <button
                                onClick={handleSendOtp}
                                disabled={mobile.length !== 10}
                                className={[
                                    'btn-shine w-full rounded-xl font-extrabold text-xl border-2 transition-all',
                                    mobile.length === 10
                                        ? 'bg-yellow-400 border-yellow-500 text-gray-900 active:scale-95 cursor-pointer'
                                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed',
                                ].join(' ')}
                                style={{ height: '64px' }}
                            >
                                Send OTP →
                            </button>

                            <button
                                onClick={() => navigate(`/${service}/new-connection`)}
                                className="w-full rounded-xl font-bold text-lg text-gray-500 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all"
                                style={{ height: '52px' }}
                            >
                                ← Back
                            </button>
                        </div>

                    ) : (
                        /* ═══════ OTP PHASE ═══════ */
                        <div className="fade-in flex flex-col gap-3">

                            <div className="w-full bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3 flex items-center gap-3">
                                <span className="text-yellow-600 text-xl flex-shrink-0">📱</span>
                                <span className="text-gray-700 font-medium" style={{ fontSize: '0.93rem' }}>
                                    OTP sent to <strong>+91 {mobile}</strong>
                                </span>
                                <button
                                    onClick={() => {
                                        setPhase('mobile')
                                        setOtp(Array(OTP_LENGTH).fill(''))
                                        clearInterval(timerRef.current)
                                    }}
                                    className="ml-auto text-blue-600 font-semibold text-sm underline hover:no-underline flex-shrink-0"
                                >
                                    Change
                                </button>
                            </div>

                            {/* OTP boxes */}
                            <div className="flex gap-2 w-full justify-center">
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
                                            'flex-1 rounded-xl text-center font-extrabold text-gray-900 outline-none border-2 transition-colors duration-150',
                                            val ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-white',
                                        ].join(' ')}
                                        style={{ height: '64px', fontSize: '1.8rem', caretColor: 'transparent', maxWidth: '70px' }}
                                    />
                                ))}
                            </div>

                            {/* Resend */}
                            <div className="flex items-center gap-3 justify-center">
                                <span className="text-gray-500 font-medium text-sm">
                                    {secondsLeft > 0 ? `Resend OTP in ${secondsLeft}s` : 'Did not receive OTP?'}
                                </span>
                                <button
                                    onClick={handleResend}
                                    disabled={secondsLeft > 0}
                                    className={[
                                        'font-bold text-sm px-4 py-1.5 rounded-lg border-2 transition-colors',
                                        secondsLeft > 0
                                            ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                                            : 'border-yellow-500 text-yellow-700 bg-white hover:bg-yellow-50',
                                    ].join(' ')}
                                >
                                    Resend OTP
                                </button>
                            </div>

                            <Keypad onPress={handleOtpKeypad} onDelete={handleOtpDelete} />

                            <button
                                onClick={handleVerify}
                                disabled={!isComplete}
                                className={[
                                    'btn-shine w-full rounded-xl font-extrabold text-xl border-2 transition-all',
                                    isComplete
                                        ? 'bg-yellow-400 border-yellow-500 text-gray-900 active:scale-95 cursor-pointer'
                                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed',
                                ].join(' ')}
                                style={{ height: '64px' }}
                            >
                                ✔ Verify &amp; Fetch Details
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
