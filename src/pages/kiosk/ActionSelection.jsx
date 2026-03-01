import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { MdOutlineAddHomeWork, MdPayment, MdOutlineReportProblem, MdOutlineTrackChanges } from 'react-icons/md'

const ACTION_CONFIG = {
    gas: {
        title: 'Gas Services',
        actions: [
            { label: 'New Connection', path: '/gas/new-connection', icon: MdOutlineAddHomeWork },
            { label: 'Bill Payment', path: '/gas/bill', icon: MdPayment },
            { label: 'Register Complaint', path: '/gas/complaint', icon: MdOutlineReportProblem },
            { label: 'Track Status', path: '/status', icon: MdOutlineTrackChanges },
        ],
    },
    electricity: {
        title: 'Electricity Services',
        actions: [
            { label: 'New Connection', path: '/electricity/new', icon: MdOutlineAddHomeWork },
            { label: 'Bill Payment', path: '/electricity/bill', icon: MdPayment },
            { label: 'Register Complaint', path: '/electricity/complaint', icon: MdOutlineReportProblem },
            { label: 'Track Status', path: '/status', icon: MdOutlineTrackChanges },
        ],
    },
}

export default function ActionSelection() {
    const { service } = useParams()
    const navigate = useNavigate()

    const config = ACTION_CONFIG[service] ?? ACTION_CONFIG['gas']

    return (
        <div
            className="flex flex-col bg-white overflow-hidden"
            style={{ fontFamily: "'Noto Sans', sans-serif", height: '100vh' }}
        >
            <Header />

            {/* ── EMERGENCY ALERT STRIP ── */}
            <div
                className="w-full flex items-center px-8"
                style={{
                    backgroundColor: '#FFF8DC',
                    borderTop: '2px solid #D4A800',
                    borderBottom: '2px solid #D4A800',
                    minHeight: '44px',
                }}
            >
                <span
                    className="text-gray-900 font-medium"
                    style={{ fontSize: '1rem' }}
                >
                    ⚠️&nbsp;&nbsp;Important Notice: Scheduled maintenance today from 3 PM to 5 PM
                </span>
            </div>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 flex flex-col px-12 pt-8 pb-4 overflow-hidden">

                {/* Page Title */}
                <h1
                    className="font-extrabold text-gray-900"
                    style={{ fontSize: '2.2rem' }}
                >
                    {config.title}
                </h1>

                {/* Subtitle */}
                <p
                    className="text-gray-600 font-medium mt-1"
                    style={{ fontSize: '1.1rem' }}
                >
                    Select Action
                </p>

                {/* Divider */}
                <hr className="border-gray-300 mt-3 mb-0" />

                {/* Action Buttons – 2x2 grid, vertically centered */}
                <div className="flex-1 flex items-center justify-center">
                    <div
                        className="grid grid-cols-2 gap-8"
                        style={{ width: '720px' }}
                    >
                        {config.actions.map((action) => {
                            const Icon = action.icon
                            return (
                                <button
                                    key={action.label}
                                    onClick={() => navigate(action.path)}
                                    className="flex flex-col items-center justify-center gap-3 font-bold text-gray-900 rounded-2xl cursor-pointer"
                                    style={{
                                        backgroundColor: '#F5E17A',
                                        border: '2px solid #D4B800',
                                        minHeight: '140px',
                                        fontSize: '1.35rem',
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    <Icon size={52} />
                                    {action.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
