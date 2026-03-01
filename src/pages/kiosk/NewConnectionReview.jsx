import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

/* ── Ticker notices ── */
const TICKER_NOTICES = [
    '⚠️  Important Notice: Scheduled maintenance today from 3 PM to 5 PM',
    '📢  New connections are processed within 7 working days',
    '🔒  DigiLocker integration ensures secure, paperless verification',
    '📋  Review your application carefully before submitting',
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
`

/* ── Progress bar ── */
const STEPS = ['Personal Details', 'Configuration', 'Address', 'Review']

function ProgressBar({ current }) {
    return (
        <div className="w-full flex items-center">
            {STEPS.map((label, idx) => {
                const n = idx + 1
                const done = n < current
                const active = n === current
                const last = idx === STEPS.length - 1
                return (
                    <div key={label} className="flex items-center flex-1 min-w-0">
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className={[
                                'w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-base border-2 transition-all',
                                done ? 'bg-green-500 border-green-600 text-white'
                                    : active ? 'bg-yellow-400 border-yellow-500 text-gray-900'
                                        : 'bg-gray-100 border-gray-300 text-gray-400',
                            ].join(' ')}>
                                {done ? '✓' : n}
                            </div>
                            <span className={[
                                'font-semibold whitespace-nowrap text-xs',
                                active ? 'text-yellow-700' : done ? 'text-green-600' : 'text-gray-400',
                            ].join(' ')}>
                                {label}
                            </span>
                        </div>
                        {!last && (
                            <div className={[
                                'flex-1 h-0.5 mx-3 transition-all',
                                done ? 'bg-green-400' : 'bg-gray-200',
                            ].join(' ')} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

/* ── Single summary row ── */
function SummaryRow({ label, value }) {
    if (!value) return null
    return (
        <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">
            <span className="text-gray-500 font-semibold text-base w-52 flex-shrink-0">{label}</span>
            <span className="text-gray-900 font-bold text-base flex-1">{value}</span>
        </div>
    )
}

/* ── Helper: derive readable config values ── */
function deriveConfig(service, config = {}) {
    if (service === 'gas') {
        const propType = config.propertyType === 'society'
            ? 'Society / Flat'
            : config.propertyType === 'independent'
                ? 'Independent House'
                : config.propertyType || '—'
        const noc = config.propertyType === 'society'
            ? (config.nocFile ? 'Uploaded' : 'Not uploaded')
            : 'Not required'
        return { label: 'Property Type', value: propType, nocStatus: noc }
    }
    if (service === 'electricity') {
        const connType = config.connectionType
            ? config.connectionType.charAt(0).toUpperCase() + config.connectionType.slice(1)
            : '—'
        return { label: 'Connection Type', value: connType, load: config.applianceLoad ? `${config.applianceLoad} kW` : null }
    }
    if (service === 'water') {
        const cat = config.connectionCategory
            ? config.connectionCategory.charAt(0).toUpperCase() + config.connectionCategory.slice(1)
            : '—'
        return { label: 'Connection Category', value: cat }
    }
    return {}
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
export default function NewConnectionReview() {
    const navigate = useNavigate()
    const { service } = useParams()
    const { state } = useLocation()

    const personal = state?.personal ?? {}
    const address = state?.address ?? {}
    const config = deriveConfig(service, state?.config ?? {})

    const serviceLabel = service
        ? service.charAt(0).toUpperCase() + service.slice(1)
        : '—'

    /* Build address string */
    const addressStr = [
        address.houseNo,
        address.streetName,
        address.landmark,
        address.city,
        address.pinCode,
    ].filter(Boolean).join(', ') || '—'

    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

    return (
        <div
            className="flex flex-col bg-white overflow-hidden"
            style={{ fontFamily: "'Noto Sans', sans-serif", height: '100vh' }}
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
            <main className="flex-1 flex flex-col items-center justify-between overflow-hidden px-8 py-6">

                {/* ── Title + progress ── */}
                <div className="w-full flex flex-col gap-4" style={{ maxWidth: '860px' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-extrabold text-gray-900 text-4xl leading-tight">
                                Review Application
                            </h1>
                            <p className="text-gray-500 font-medium text-lg mt-1">
                                Step 4 of 4 — Confirm your{' '}
                                <span className="font-bold text-gray-700 capitalize">{service}</span> connection request
                            </p>
                        </div>

                        {/* Verified chip */}
                        <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-green-50 border-2 border-green-300 flex-shrink-0">
                            <span className="text-green-600 text-lg">✅</span>
                            <span className="font-bold text-green-800 text-sm uppercase tracking-wide">DigiLocker Verified</span>
                        </div>
                    </div>

                    <ProgressBar current={4} />
                </div>

                {/* ── Summary card ── */}
                <div className="w-full flex-1 flex flex-col justify-center" style={{ maxWidth: '860px' }}>
                    <div className="w-full bg-white border-2 border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                        {/* Card header */}
                        <div className="bg-gray-50 border-b-2 border-gray-200 px-8 py-4 flex items-center gap-3">
                            <span className="text-yellow-500 text-2xl">📋</span>
                            <span className="font-extrabold text-gray-800 text-lg uppercase tracking-wide">
                                Application Summary
                            </span>
                            <span className="ml-auto text-gray-500 font-semibold text-sm capitalize">
                                {serviceLabel} Connection
                            </span>
                        </div>

                        {/* Rows */}
                        <div className="px-8 py-2">
                            <SummaryRow label="Name" value={personal.fullName || '—'} />
                            <SummaryRow label="Mobile" value={personal.mobileNumber ? `+91 ${personal.mobileNumber}` : null} />
                            <SummaryRow label="Address" value={addressStr} />
                            <SummaryRow label="Service Type" value={`${serviceLabel} Connection`} />
                            <SummaryRow label={config.label || 'Configuration'} value={config.value || '—'} />
                            {config.load && <SummaryRow label="Appliance Load" value={config.load} />}
                            {config.nocStatus && <SummaryRow label="NOC Status" value={config.nocStatus} />}
                        </div>
                    </div>

                    {/* ── Timeline note ── */}
                    <div className="mt-5 flex items-center gap-3 px-6 py-4 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                        <span className="text-blue-500 text-2xl flex-shrink-0" aria-hidden>🕐</span>
                        <span className="text-blue-800 font-bold text-base">
                            Technician visit within 48 hours.
                        </span>
                    </div>
                </div>

                {/* ── Nav buttons ── */}
                <div className="w-full flex items-center justify-between" style={{ maxWidth: '860px' }}>
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-xl font-bold text-gray-600 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all"
                        style={{ height: '64px', width: '200px', fontSize: '1.05rem' }}
                    >
                        ← Back
                    </button>

                    <button
                        onClick={() => navigate(`/${service}/new-connection/success`, { state })}
                        className="btn-shine rounded-xl font-extrabold text-xl border-2 bg-yellow-400 border-yellow-500 text-gray-900 active:scale-95 transition-all"
                        style={{ height: '64px', width: '280px' }}
                    >
                        Submit Application →
                    </button>
                </div>

            </main>

            <Footer />
        </div>
    )
}
