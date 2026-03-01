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

/* ── Mock bill data (replace with real BBPS API response) ── */
const MOCK_BILLS = {
    electricity: {
        consumerName: 'Ramesh Kumar Verma',
        billingPeriod: 'January 2025',
        dueDate: '15 Feb 2025',
        amount: '1,245.00',
        utilityName: 'Delhi Electricity Distribution Ltd.',
        billNumber: 'DEL-2025-01-889432',
    },
    gas: {
        consumerName: 'Sunita Devi Sharma',
        billingPeriod: 'January 2025',
        dueDate: '20 Feb 2025',
        amount: '876.50',
        utilityName: 'Indraprastha Gas Limited',
        billNumber: 'IGL-2025-01-334521',
    },
}

export default function BillDetails() {
    const navigate = useNavigate()
    const location = useLocation()
    const { consumerNumber, serviceType } = location.state ?? {}

    const service = serviceType?.toLowerCase() === 'gas' ? 'gas' : 'electricity'
    const bill = MOCK_BILLS[service]

    const pageTitle =
        service === 'gas' ? 'Gas Bill Details' : 'Electricity Bill Details'

    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

    const rows = [
        { label: 'Consumer Name', value: bill.consumerName },
        { label: 'Consumer Number', value: consumerNumber ?? '1234567890' },
        { label: 'Utility / Provider', value: bill.utilityName },
        { label: 'Bill Number', value: bill.billNumber },
        { label: 'Billing Period', value: bill.billingPeriod },
        { label: 'Due Date', value: bill.dueDate },
    ]

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
            <main className="flex-1 flex flex-col overflow-hidden px-20 pt-4 pb-3">

                {/* Page Title */}
                <div className="flex-shrink-0 mb-3">
                    <h1 className="font-extrabold text-gray-900 text-3xl">{pageTitle}</h1>
                    <hr className="border-gray-300 mt-2" />
                </div>

                {/* Centered card area */}
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <div className="w-full max-w-3xl flex flex-col gap-3">

                        {/* ── Bill Details Card ── */}
                        <div className="border-2 border-gray-300 rounded-2xl overflow-hidden">

                            {/* Card header strip */}
                            <div className="bg-gray-100 border-b-2 border-gray-300 px-8 py-2 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500" />
                                <span className="font-bold text-gray-700 text-base tracking-wide uppercase">
                                    Bill Statement
                                </span>
                                <span className="ml-auto text-gray-500 text-sm font-medium">
                                    BBPS Verified
                                </span>
                            </div>

                            {/* Detail rows */}
                            <div className="px-8 py-1 flex flex-col gap-0 divide-y divide-gray-100">
                                {rows.map(({ label, value }) => (
                                    <div key={label} className="flex items-center justify-between py-2">
                                        <span className="text-gray-500 font-medium text-base w-52 flex-shrink-0">
                                            {label}
                                        </span>
                                        <span className="font-semibold text-gray-900 text-base text-right">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Amount section */}
                            <div className="border-t-2 border-gray-300 bg-amber-50 px-8 py-4 flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-0.5">
                                        Total Bill Amount
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        Amount payable before {bill.dueDate}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="font-extrabold text-gray-900" style={{ fontSize: '2.4rem', letterSpacing: '-0.01em' }}>
                                        ₹ {bill.amount}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── Action Button ── */}
                        <button
                            onClick={() =>
                                navigate('/payment-method', {
                                    state: { consumerNumber, serviceType, amount: bill.amount },
                                })
                            }
                            className="w-full rounded-xl font-extrabold text-xl border-2 border-yellow-500 bg-yellow-300 text-gray-900"
                            style={{ height: '80px', letterSpacing: '0.02em' }}
                        >
                            Proceed to Payment →
                        </button>

                    </div>
                </div>

            </main>

            <Footer />
        </div>
    )
}
