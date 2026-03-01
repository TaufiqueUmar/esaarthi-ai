import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

/* ── Service schemes data ── */
const SERVICE_SCHEMES = {
    gas: [
        {
            title: 'Pradhan Mantri Ujjwala Yojana (PMUY)',
            date: 'Jan 2025',
            desc: 'Free LPG connections to women from BPL households to reduce dependence on solid fuels.',
            badge: 'Active',
        },
        {
            title: 'LPG Panchayat Scheme',
            date: 'Nov 2024',
            desc: 'Awareness campaigns at gram panchayat level for safe LPG usage and subsidy claims.',
            badge: 'Active',
        },
        {
            title: 'PAHAL – Direct Benefit Transfer',
            date: 'Oct 2024',
            desc: 'LPG subsidy transferred directly to Aadhaar-linked bank accounts of consumers.',
            badge: 'Active',
        },
        {
            title: 'Give It Up Campaign',
            date: 'Sep 2024',
            desc: 'Voluntarily surrender LPG subsidy so another BPL household can benefit.',
            badge: 'Ongoing',
        },
    ],
    electricity: [
        {
            title: 'PM Surya Ghar – Free Electricity Scheme',
            date: 'Feb 2025',
            desc: '300 units of free electricity per month for households installing rooftop solar panels.',
            badge: 'New',
        },
        {
            title: 'RDSS – Revamped Distribution Sector Scheme',
            date: 'Jan 2025',
            desc: 'Modernisation of electricity distribution infra to reduce AT&C losses across urban areas.',
            badge: 'Active',
        },
        {
            title: 'Saubhagya Scheme',
            date: 'Dec 2024',
            desc: 'Last-mile household electrification ensuring universal electricity access.',
            badge: 'Active',
        },
        {
            title: 'National Smart Grid Mission',
            date: 'Nov 2024',
            desc: 'Smart meters and automated grid management to improve power quality and billing accuracy.',
            badge: 'Ongoing',
        },
    ],
}

const BADGE_COLORS = {
    New: { bg: '#1A1A8C', text: '#FFFFFF' },
    Active: { bg: '#166534', text: '#FFFFFF' },
    Ongoing: { bg: '#92400E', text: '#FFFFFF' },
}

const GasIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 64 64" fill="#1A1A1A">
        <rect x="24" y="4" width="16" height="4" rx="2" />
        <rect x="28" y="8" width="8" height="5" rx="1" />
        <ellipse cx="32" cy="15" rx="14" ry="4" />
        <rect x="18" y="15" width="28" height="30" />
        <ellipse cx="32" cy="45" rx="14" ry="4" />
        <rect x="20" y="47" width="24" height="5" rx="2" />
        <rect x="18" y="28" width="28" height="8" fill="#D4B800" />
    </svg>
)

const ElectricityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#1A1A1A">
        <path d="M7 2v11h3v9l7-12h-4l4-8z" />
    </svg>
)

const SERVICE_CONFIG = {
    gas: {
        title: 'Gas Bill Payment',
        consumerLabel: 'Consumer Number',
        consumerPlaceholder: 'Enter Consumer Number',
        Icon: GasIcon,
    },
    electricity: {
        title: 'Electricity Bill Payment',
        consumerLabel: 'Consumer Number',
        consumerPlaceholder: 'Enter Consumer Number',
        Icon: ElectricityIcon,
    },
}

/* ── inline keyframes injected once ── */
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

export default function BillPaymentEntry() {
    const { service } = useParams()
    const navigate = useNavigate()

    const config = SERVICE_CONFIG[service] ?? SERVICE_CONFIG['gas']
    const { Icon } = config
    const schemes = SERVICE_SCHEMES[service] ?? SERVICE_SCHEMES['gas']

    const [consumerNumber, setConsumerNumber] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')

    const isFormValid = consumerNumber.trim() !== '' && mobileNumber.trim() !== ''

    const handleFetchBill = () => {
        navigate('/otp-verification', {
            state: { consumerNumber, serviceType: service },
        })
    }

    /* Build ticker text: duplicate so the loop is seamless */
    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

    return (
        <div
            className="flex flex-col bg-white overflow-hidden"
            style={{ fontFamily: "'Noto Sans', sans-serif", height: '100vh' }}
        >
            <style>{TICKER_STYLE}</style>

            <Header />

            {/* ── SCROLLING TICKER STRIP ── */}
            <div
                className="w-full flex items-center overflow-hidden"
                style={{
                    backgroundColor: '#FFF8DC',
                    borderTop: '2px solid #D4A800',
                    borderBottom: '2px solid #D4A800',
                    minHeight: '44px',
                }}
            >
                {/* "NOTICE" label badge */}
                <div
                    className="flex-shrink-0 flex items-center justify-center font-bold text-white px-4 self-stretch"
                    style={{ backgroundColor: '#D4A800', fontSize: '0.82rem', letterSpacing: '0.08em', minWidth: '88px' }}
                >
                    NOTICE
                </div>

                {/* Scrolling track */}
                <div className="flex-1 overflow-hidden" style={{ position: 'relative' }}>
                    <span
                        className="ticker-track text-gray-900 font-medium"
                        style={{ fontSize: '0.97rem' }}
                    >
                        {fullTrack}
                    </span>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 flex flex-col px-12 pt-6 pb-4 overflow-hidden">

                {/* Page Title */}
                <div className="flex items-center gap-3">
                    <Icon />
                    <h1 className="font-extrabold text-gray-900" style={{ fontSize: '2.2rem' }}>
                        {config.title}
                    </h1>
                </div>

                {/* Divider */}
                <hr className="border-gray-300 mt-3 mb-0" />

                {/* Two-column layout: Form | Schemes */}
                <div className="flex-1 flex flex-row items-center justify-center gap-10 overflow-hidden">

                    {/* ── LEFT: Form Card ── */}
                    <div
                        className="flex flex-col rounded-2xl flex-shrink-0"
                        style={{
                            width: '620px',
                            backgroundColor: '#F9F9F9',
                            border: '1.5px solid #D0D0D0',
                            padding: '28px 40px',
                            gap: '20px',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                        }}
                    >
                        {/* Consumer Number */}
                        <div className="flex flex-col" style={{ gap: '10px' }}>
                            <label
                                htmlFor="consumerNumber"
                                className="font-bold text-gray-800"
                                style={{ fontSize: '1.05rem' }}
                            >
                                {config.consumerLabel}
                                <span className="text-red-600 ml-1">*</span>
                            </label>
                            <input
                                id="consumerNumber"
                                type="text"
                                value={consumerNumber}
                                onChange={(e) => setConsumerNumber(e.target.value)}
                                placeholder={config.consumerPlaceholder}
                                className="w-full rounded-xl text-gray-900 font-medium outline-none"
                                style={{
                                    minHeight: '62px',
                                    fontSize: '1.15rem',
                                    padding: '0 20px',
                                    border: '2px solid #B0B0B0',
                                    backgroundColor: '#FFFFFF',
                                    letterSpacing: '0.03em',
                                    transition: 'border-color 0.15s',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = '#1A1A8C')}
                                onBlur={(e) => (e.target.style.borderColor = '#B0B0B0')}
                            />
                        </div>

                        {/* Mobile Number */}
                        <div className="flex flex-col" style={{ gap: '10px' }}>
                            <label
                                htmlFor="mobileNumber"
                                className="font-bold text-gray-800"
                                style={{ fontSize: '1.05rem' }}
                            >
                                Registered Mobile Number
                                <span className="text-red-600 ml-1">*</span>
                            </label>
                            <input
                                id="mobileNumber"
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                placeholder="Enter Registered Mobile Number"
                                className="w-full rounded-xl text-gray-900 font-medium outline-none"
                                style={{
                                    minHeight: '62px',
                                    fontSize: '1.15rem',
                                    padding: '0 20px',
                                    border: '2px solid #B0B0B0',
                                    backgroundColor: '#FFFFFF',
                                    letterSpacing: '0.03em',
                                    transition: 'border-color 0.15s',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = '#1A1A8C')}
                                onBlur={(e) => (e.target.style.borderColor = '#B0B0B0')}
                            />
                        </div>

                        {/* OTP note */}
                        <p className="text-gray-500 font-medium" style={{ fontSize: '0.92rem', lineHeight: '1.5' }}>
                            🔒&nbsp; OTP verification will be required before proceeding to payment.
                        </p>

                        {/* Fetch Bill Button */}
                        <button
                            onClick={handleFetchBill}
                            disabled={!isFormValid}
                            className="w-full rounded-xl font-extrabold"
                            style={{
                                minHeight: '72px',
                                fontSize: '1.35rem',
                                letterSpacing: '0.04em',
                                backgroundColor: isFormValid ? '#F5E17A' : '#E8E8E8',
                                border: isFormValid ? '2px solid #D4B800' : '2px solid #C0C0C0',
                                color: isFormValid ? '#1A1A1A' : '#888888',
                                cursor: isFormValid ? 'pointer' : 'not-allowed',
                            }}
                        >
                            Fetch Bill
                        </button>
                    </div>

                    {/* ── RIGHT: Recently Launched Schemes ── */}
                    <div
                        className="flex flex-col flex-shrink-0 overflow-hidden"
                        style={{ width: '500px', height: '100%', paddingTop: '10px', paddingBottom: '10px' }}
                    >
                        {/* Section header */}
                        <div
                            className="flex items-center gap-2 px-4 py-2 rounded-xl mb-3 flex-shrink-0"
                            style={{ backgroundColor: '#1A1A8C' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
                            </svg>
                            <span className="font-bold text-white" style={{ fontSize: '1rem', letterSpacing: '0.04em' }}>
                                Recently Launched Schemes
                            </span>
                            <span
                                className="ml-auto text-white font-semibold rounded-full px-2 py-0.5"
                                style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.25)' }}
                            >
                                {service === 'gas' ? 'Gas' : 'Electricity'}
                            </span>
                        </div>

                        {/* Scheme cards */}
                        <div className="flex flex-col gap-3 overflow-hidden">
                            {schemes.map((scheme, idx) => {
                                const badge = BADGE_COLORS[scheme.badge] ?? BADGE_COLORS['Active']
                                return (
                                    <div
                                        key={idx}
                                        className="rounded-xl flex flex-col"
                                        style={{
                                            backgroundColor: '#F9F9F9',
                                            border: '1.5px solid #E0E0E0',
                                            padding: '14px 18px',
                                            gap: '6px',
                                            boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                                        }}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span
                                                className="font-bold text-gray-900"
                                                style={{ fontSize: '0.95rem', lineHeight: '1.3' }}
                                            >
                                                {scheme.title}
                                            </span>
                                            <span
                                                className="flex-shrink-0 rounded-full px-2 py-0.5 font-bold"
                                                style={{
                                                    fontSize: '0.7rem',
                                                    backgroundColor: badge.bg,
                                                    color: badge.text,
                                                    letterSpacing: '0.06em',
                                                }}
                                            >
                                                {scheme.badge}
                                            </span>
                                        </div>
                                        <p className="text-gray-500" style={{ fontSize: '0.82rem', lineHeight: '1.45' }}>
                                            {scheme.desc}
                                        </p>
                                        <span className="text-gray-400 font-medium" style={{ fontSize: '0.75rem' }}>
                                            Launched: {scheme.date}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Footer note */}
                        <p
                            className="text-gray-400 mt-3 flex-shrink-0"
                            style={{ fontSize: '0.75rem' }}
                        >
                            Source: Government of India – Ministry of Petroleum &amp; Natural Gas / MoP
                        </p>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}
