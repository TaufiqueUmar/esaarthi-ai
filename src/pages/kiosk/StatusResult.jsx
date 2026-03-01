import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import {
    FaCheckCircle,
    FaClock,
    FaCircle,
    FaHome,
    FaPrint,
    FaPhoneAlt,
    FaUser,
    FaCalendarAlt,
    FaExclamationTriangle,
    FaInfoCircle,
} from 'react-icons/fa'
import { MdOutlineVerified, MdAssignmentInd, MdEvent, MdDone } from 'react-icons/md'

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

@keyframes step-fill {
    from { width: 0%; }
    to   { width: 100%; }
}
.step-line-done {
    animation: step-fill 0.6s ease forwards;
}
`

/* ── Mock data ── */
const MOCK = {
    refId: 'BBPS7489203641',
    serviceType: 'Electricity Services',
    requestType: 'New Connection',
    submissionDate: '22 Feb 2026',
    currentStatus: 'Technician Assigned',
    technician: {
        name: 'Ramesh Kumar Yadav',
        contact: '+91 98765 43210',
        visitDate: '28 Feb 2026, 10:00 AM – 12:00 PM',
        deadline: '01 Mar 2026, 10:00 AM',
    },
}

/* ── Progress Steps ── */
const STEPS = [
    { label: 'Request\nSubmitted', key: 'submitted', Icon: FaCheckCircle },
    { label: 'Verified by\nDepartment', key: 'verified', Icon: MdOutlineVerified },
    { label: 'Technician\nAssigned', key: 'assigned', Icon: MdAssignmentInd },
    { label: 'Visit\nScheduled', key: 'scheduled', Icon: MdEvent },
    { label: 'Completed', key: 'completed', Icon: MdDone },
]

const STATUS_INDEX = {
    'Request Submitted': 0,
    'Verified by Department': 1,
    'Technician Assigned': 2,
    'Visit Scheduled': 3,
    'Completed': 4,
}

/* ── Horizontal ProgressStep ── */
function HProgressStep({ label, state, isLast }) {
    const isDone = state === 'done'
    const isCurrent = state === 'current'

    const iconColor = isDone ? '#16a34a' : isCurrent ? '#d97706' : '#9ca3af'
    const labelColor = isDone ? 'text-green-700' : isCurrent ? 'text-yellow-700' : 'text-gray-400'
    const lineColor = isDone ? 'bg-green-400' : 'bg-gray-200'

    return (
        <div className="flex items-start flex-1 min-w-0">
            {/* Step node */}
            <div className="flex flex-col items-center flex-shrink-0" style={{ width: '72px' }}>
                {/* Circle icon */}
                <div
                    className="flex items-center justify-center rounded-full border-2 mb-1"
                    style={{
                        width: '44px',
                        height: '44px',
                        borderColor: iconColor,
                        background: isDone ? '#f0fdf4' : isCurrent ? '#fffbeb' : '#f9fafb',
                        color: iconColor,
                    }}
                >
                    {isDone ? (
                        <FaCheckCircle size={22} color="#16a34a" />
                    ) : isCurrent ? (
                        <FaClock size={20} color="#d97706" />
                    ) : (
                        <FaCircle size={10} color="#d1d5db" />
                    )}
                </div>

                {/* Label */}
                <p
                    className={`text-center font-semibold leading-tight whitespace-pre-line ${labelColor}`}
                    style={{ fontSize: '0.72rem' }}
                >
                    {label}
                </p>


            </div>

            {/* Connector line (between steps) */}
            {!isLast && (
                <div className="flex-1 self-start mt-5 mx-1 h-0.5 rounded-full overflow-hidden bg-gray-200">
                    <div className={`h-full ${lineColor} ${isDone ? 'step-line-done' : ''}`} style={{ width: isDone ? '100%' : '0%' }} />
                </div>
            )}
        </div>
    )
}

/* ── Main Component ── */
export default function StatusResult() {
    const navigate = useNavigate()
    const location = useLocation()
    const { refId } = location.state ?? {}

    const data = { ...MOCK, refId: refId ?? MOCK.refId }
    const currentIdx = STATUS_INDEX[data.currentStatus] ?? 2

    const stepState = (idx) => {
        if (idx < currentIdx) return 'done'
        if (idx === currentIdx) return 'current'
        return 'pending'
    }

    /* Ticker */
    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

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
                style={{ minHeight: '40px' }}
            >
                <div
                    className="flex-shrink-0 flex items-center justify-center font-bold text-white px-4 self-stretch bg-yellow-500"
                    style={{ fontSize: '0.78rem', letterSpacing: '0.08em', minWidth: '88px' }}
                >
                    NOTICE
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <span className="ticker-track text-gray-900 font-medium" style={{ fontSize: '0.93rem' }}>
                        {fullTrack}
                    </span>
                </div>
            </div>

            {/* ── MAIN ── */}
            <main className="flex-1 flex flex-col overflow-hidden px-16 py-3 gap-0">

                {/* ── PAGE TITLE ── */}
                <div className="flex flex-col items-center flex-shrink-0 mb-3">
                    <h1
                        className="font-extrabold text-gray-900 text-center tracking-tight leading-tight"
                        style={{ fontSize: '2rem' }}
                    >
                        Service Status Details
                    </h1>

                    {/* Divider */}
                    <div className="w-full flex items-center gap-4 mt-1.5">
                        <div className="flex-1 h-px bg-gray-200" />
                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>
                </div>

                {/* ── HORIZONTAL PROGRESS TRACKER ── */}
                <div className="flex-shrink-0 mb-4">
                    {/* Step count label */}
                    <div className="flex items-center justify-between mb-2 px-1">
                        <span className="font-bold text-gray-500 uppercase tracking-widest" style={{ fontSize: '0.72rem' }}>
                            Progress Tracker
                        </span>
                        <span className="font-bold text-gray-400 uppercase tracking-wide" style={{ fontSize: '0.7rem' }}>
                            Step {currentIdx + 1} of {STEPS.length}
                        </span>
                    </div>

                    {/* Steps row */}
                    <div className="flex items-start w-full">
                        {STEPS.map((step, idx) => (
                            <HProgressStep
                                key={step.key}
                                label={step.label}
                                state={stepState(idx)}
                                isLast={idx === STEPS.length - 1}
                            />
                        ))}
                    </div>
                </div>

                {/* ── TWO CARDS SIDE BY SIDE ── */}
                <div className="flex gap-5 flex-1 min-h-0">

                    {/* ── REQUEST SUMMARY CARD ── */}
                    <div className="flex-1 border-2 border-gray-200 rounded-2xl overflow-hidden flex flex-col">
                        {/* Card header */}
                        <div className="bg-gray-100 border-b-2 border-gray-200 px-5 py-2 flex items-center gap-2.5">
                            <FaInfoCircle className="text-blue-500" size={14} />
                            <span className="font-bold text-gray-700 text-sm tracking-wide uppercase">Request Summary</span>
                            <span className="ml-auto text-blue-700 text-xs font-semibold uppercase tracking-wide">📄 GOV KIOSK</span>
                        </div>

                        {/* Rows */}
                        <div className="px-6 py-2 flex flex-col divide-y divide-gray-100 flex-1 justify-center">
                            {[
                                { label: 'Reference ID', value: data.refId, bold: true },
                                { label: 'Service Type', value: data.serviceType },
                                { label: 'Request Type', value: data.requestType },
                                { label: 'Submission Date', value: data.submissionDate },
                                { label: 'Current Status', value: data.currentStatus, badge: true },
                            ].map(({ label, value, bold, badge }) => (
                                <div key={label} className="flex items-center justify-between py-2">
                                    <span className="text-gray-500 font-medium text-sm w-40 flex-shrink-0">{label}</span>
                                    {badge ? (
                                        <span className="inline-flex items-center gap-1 rounded-full px-3 py-0.5 bg-yellow-100 border border-yellow-400 text-yellow-800 font-bold text-xs uppercase tracking-wide">
                                            <FaClock size={10} /> {value}
                                        </span>
                                    ) : (
                                        <span className={`text-right text-sm ${bold ? 'font-extrabold text-gray-900' : 'font-semibold text-gray-800'}`}>
                                            {value}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── TECHNICIAN DETAILS CARD ── */}
                    <div className="flex-1 border-2 border-green-200 rounded-2xl overflow-hidden flex flex-col">
                        {/* Card header */}
                        <div className="bg-green-50 border-b-2 border-green-200 px-5 py-2 flex items-center gap-2.5">
                            <FaUser className="text-green-600" size={13} />
                            <span className="font-bold text-green-800 text-sm tracking-wide uppercase">Technician Details</span>
                            <span className="ml-auto text-green-700 text-xs font-semibold uppercase tracking-wide">✔ Assigned</span>
                        </div>

                        {/* Rows */}
                        <div className="px-6 py-2 flex flex-col divide-y divide-green-50 flex-1 justify-center">
                            {[
                                { label: 'Technician Name', Icon: FaUser, value: data.technician.name },
                                { label: 'Contact Number', Icon: FaPhoneAlt, value: data.technician.contact },
                                { label: 'Visit Date/Time', Icon: FaCalendarAlt, value: data.technician.visitDate },
                                { label: 'Deadline (48h)', Icon: FaExclamationTriangle, value: data.technician.deadline, warn: true },
                            ].map(({ label, Icon, value, warn }) => (
                                <div key={label} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2 w-44 flex-shrink-0">
                                        <Icon size={12} className={warn ? 'text-red-400' : 'text-gray-400'} />
                                        <span className="text-gray-500 font-medium text-sm">{label}</span>
                                    </div>
                                    <span className={`text-right text-sm font-semibold ${warn ? 'text-red-700' : 'text-gray-800'}`}>
                                        {value}
                                    </span>
                                </div>
                            ))}

                            {/* 48-hour notice */}
                            <div className="mt-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2 flex items-start gap-2">
                                <FaExclamationTriangle size={12} className="text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-red-700 text-xs font-medium leading-snug">
                                    Request must be resolved within <strong>48 hours</strong> of technician assignment as per department norms.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── HELP NOTICE ── */}
                <div className="rounded-2xl bg-blue-50 border-2 border-blue-200 px-5 py-2 flex items-center gap-3 flex-shrink-0 mt-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center flex-shrink-0">
                        <FaPhoneAlt size={12} className="text-blue-600" />
                    </div>
                    <p className="text-blue-700 text-sm leading-snug">
                        <strong className="text-blue-800">Need Help?</strong>&nbsp; Visit your nearest{' '}
                        <strong>Citizen Service Centre</strong> or call the helpline:&nbsp;<strong>1916</strong>.
                        Grievances can also be raised via the <strong>eSaarthi</strong> portal.
                    </p>
                </div>

                {/* ── ACTION BUTTONS ── */}
                <div className="flex gap-5 flex-shrink-0 mt-3">
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 rounded-xl font-extrabold text-gray-900 border-2 border-gray-300 bg-white focus:outline-none active:scale-95 transition-transform duration-100 flex items-center justify-center gap-3"
                        style={{ height: '58px', fontSize: '1.05rem', letterSpacing: '0.02em' }}
                    >
                        <FaHome size={18} />
                        Back to Home
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="flex-1 rounded-xl font-extrabold text-gray-900 border-2 border-yellow-500 bg-yellow-400 focus:outline-none active:scale-95 transition-transform duration-100 flex items-center justify-center gap-3"
                        style={{ height: '58px', fontSize: '1.05rem', letterSpacing: '0.02em' }}
                    >
                        <FaPrint size={18} />
                        Print Status
                    </button>
                </div>

            </main>

            <Footer />
        </div>
    )
}
