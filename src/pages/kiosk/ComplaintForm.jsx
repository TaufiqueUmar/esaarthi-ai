import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

/* ── Complaint categories per service ── */
const CATEGORY_MAP = {
    gas: [
        'No Supply',
        'Low Pressure',
        'Gas Leakage',
        'Billing Issue',
        'Meter Defect',
        'Other',
    ],
    electricity: [
        'No Supply',
        'Low Voltage',
        'Frequent Tripping',
        'Billing Issue',
        'Meter Defect',
        'Transformer Fault',
        'Other',
    ],
    municipal: [
        'No Water Supply',
        'Pipe Leakage',
        'Garbage Not Collected',
        'Sewer Overflow',
        'Street Light Issue',
        'Billing Issue',
        'Other',
    ],
}

/* ── Inline styles for ticker + focus glow ── */
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

/* ── Service display names ── */
const SERVICE_LABEL = {
    gas: 'Gas',
    electricity: 'Electricity',
    municipal: 'Municipal Services',
}

export default function ComplaintForm() {
    const { service } = useParams()
    const navigate = useNavigate()

    const serviceKey = service in CATEGORY_MAP ? service : 'gas'
    const categories = CATEGORY_MAP[serviceKey]
    const serviceLabel = SERVICE_LABEL[serviceKey] ?? 'Service'

    /* ── Form state ── */
    const [consumerNo, setConsumerNo] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [mobile, setMobile] = useState('')
    const [errors, setErrors] = useState({})

    /* ── Ticker ── */
    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

    /* ── Validation ── */
    const validate = () => {
        const errs = {}
        if (!consumerNo.trim())
            errs.consumerNo = 'Consumer number is required.'
        if (!category)
            errs.category = 'Please select a complaint category.'
        if (!description.trim() || description.trim().length < 10)
            errs.description = 'Description must be at least 10 characters.'
        if (!mobile.trim())
            errs.mobile = 'Mobile number is required.'
        else if (!/^\d{10}$/.test(mobile))
            errs.mobile = 'Mobile number must be exactly 10 digits.'
        return errs
    }

    const handleSubmit = () => {
        const errs = validate()
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        setErrors({})
        navigate('/complaint-otp', {
            state: {
                service: serviceKey,
                consumerNo: consumerNo.trim(),
                category,
                description: description.trim(),
                mobile,
            },
        })
    }

    const clearError = (field) =>
        setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })

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
            <main className="flex-1 flex flex-col items-center justify-center overflow-hidden px-20 py-2">

                {/* ── TITLE SECTION ── */}
                <div className="flex flex-col items-center w-full max-w-5xl flex-shrink-0">
                    {/* Service badge */}
                    <span
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-full font-semibold text-yellow-800 bg-yellow-100 border border-yellow-300"
                        style={{ fontSize: '0.85rem' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M5 20h14a2 2 0 002-2V6l-5-5H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {serviceLabel}
                    </span>

                    <h1
                        className="font-extrabold text-gray-900 text-center tracking-tight leading-tight mt-1"
                        style={{ fontSize: '2.4rem' }}
                    >
                        Register Complaint
                    </h1>

                    {/* Decorative divider */}
                    <div className="w-full flex items-center gap-4 mt-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>
                </div>

                {/* ── FORM SECTION – 2-column layout ── */}
                <div className="w-full max-w-5xl mt-4 flex flex-col gap-3 flex-shrink-0">

                    {/* Two-column grid: left = Consumer No + Category; right = Description + Mobile */}
                    <div className="grid grid-cols-2 gap-5">

                        {/* ── LEFT COLUMN ── */}
                        <div className="flex flex-col gap-4">

                            {/* A – Consumer Number */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="consumerNo"
                                    className="font-bold text-gray-700 uppercase tracking-widest"
                                    style={{ fontSize: '0.78rem' }}
                                >
                                    Consumer Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="consumerNo"
                                    type="text"
                                    value={consumerNo}
                                    onChange={(e) => { setConsumerNo(e.target.value); clearError('consumerNo') }}
                                    placeholder="e.g. 101234567890"
                                    className={`w-full rounded-2xl border-2 bg-gray-50 text-gray-900 font-semibold px-6
                                        focus:bg-white transition-colors duration-150
                                        ${errors.consumerNo ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-yellow-500'}`}
                                    style={{ height: '64px', fontSize: '1.18rem' }}
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                                {errors.consumerNo && (
                                    <p className="text-red-600 font-semibold" style={{ fontSize: '0.8rem' }}>
                                        {errors.consumerNo}
                                    </p>
                                )}
                            </div>

                            {/* B – Complaint Category */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="category"
                                    className="font-bold text-gray-700 uppercase tracking-widest"
                                    style={{ fontSize: '0.78rem' }}
                                >
                                    Complaint Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => { setCategory(e.target.value); clearError('category') }}
                                    className={`w-full rounded-2xl border-2 bg-gray-50 text-gray-900 font-semibold px-6
                                        focus:bg-white transition-colors duration-150 appearance-none cursor-pointer
                                        ${errors.category ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-yellow-500'}`}
                                    style={{ height: '64px', fontSize: '1.18rem' }}
                                >
                                    <option value="" disabled>Select category…</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-red-600 font-semibold" style={{ fontSize: '0.8rem' }}>
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Info card */}
                            <div className="rounded-2xl bg-blue-50 border border-blue-200 px-5 py-3 flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                                </svg>
                                <p className="text-blue-700 font-medium leading-snug" style={{ fontSize: '0.9rem' }}>
                                    All complaints are resolved within <strong>48 hours</strong> as per the service guarantee.
                                    A unique Reference ID will be generated after submission.
                                </p>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN ── */}
                        <div className="flex flex-col gap-4">

                            {/* C – Description */}
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label
                                    htmlFor="description"
                                    className="font-bold text-gray-700 uppercase tracking-widest"
                                    style={{ fontSize: '0.78rem' }}
                                >
                                    Complaint Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => { setDescription(e.target.value); clearError('description') }}
                                    placeholder="Describe your complaint in detail…"
                                    rows={4}
                                    className={`w-full rounded-2xl border-2 bg-gray-50 text-gray-900 font-semibold px-6 py-4
                                        focus:bg-white transition-colors duration-150 resize-none
                                        ${errors.description ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-yellow-500'}`}
                                    style={{ fontSize: '1.1rem', lineHeight: '1.65' }}
                                />
                                {errors.description && (
                                    <p className="text-red-600 font-semibold" style={{ fontSize: '0.8rem' }}>
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* D – Mobile Number */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="mobile"
                                    className="font-bold text-gray-700 uppercase tracking-widest"
                                    style={{ fontSize: '0.78rem' }}
                                >
                                    Registered Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative w-full">
                                    <span
                                        className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-500 select-none pointer-events-none"
                                        style={{ fontSize: '1.18rem' }}
                                    >
                                        +91
                                    </span>
                                    <input
                                        id="mobile"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        value={mobile}
                                        onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); clearError('mobile') }}
                                        placeholder="10-digit mobile number"
                                        className={`w-full rounded-2xl border-2 bg-gray-50 text-gray-900 font-semibold
                                            focus:bg-white transition-colors duration-150
                                            ${errors.mobile ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-yellow-500'}`}
                                        style={{ height: '64px', fontSize: '1.18rem', paddingLeft: '72px', paddingRight: '24px' }}
                                        autoComplete="off"
                                    />
                                </div>
                                {errors.mobile && (
                                    <p className="text-red-600 font-semibold" style={{ fontSize: '0.8rem' }}>
                                        {errors.mobile}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── SUBMIT BUTTON – full width below the grid ── */}
                    <button
                        onClick={handleSubmit}
                        className="w-full rounded-2xl font-extrabold text-gray-900 bg-yellow-400 border-2 border-yellow-500
                                   focus:outline-none active:scale-95 transition-transform duration-100"
                        style={{ height: '68px', fontSize: '1.3rem', letterSpacing: '0.04em' }}
                    >
                        📋&nbsp;&nbsp;Submit Complaint
                    </button>

                    {/* OTP notice */}
                    <p className="text-gray-400 text-center font-medium" style={{ fontSize: '0.85rem' }}>
                        An OTP will be sent to your registered mobile number for verification.
                    </p>
                </div>

            </main>

            <Footer />
        </div>
    )
}
