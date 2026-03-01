import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

/* ── Ticker ── */
const TICKER_NOTICES = [
    '⚠️  Important Notice: Scheduled maintenance today from 3 PM to 5 PM',
    '📢  New connections are processed within 7 working days',
    '🔒  DigiLocker integration ensures secure, paperless verification',
    '📋  Keep your documents ready for service-specific configuration',
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
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
}
.fade-in { animation: fade-in 0.28s ease both; }
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
                            <div className={['flex-1 h-0.5 mx-3 transition-all', done ? 'bg-green-400' : 'bg-gray-200'].join(' ')} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

/* ════════════════════════════════
   GAS CONFIG
════════════════════════════════ */
function GasConfig({ state, onChange }) {
    return (
        <div className="fade-in flex flex-col gap-6">

            {/* Property Type */}
            <div>
                <label className="block text-gray-800 font-bold mb-4 text-lg">
                    Property Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-5">
                    {[
                        { label: 'Society / Flat', val: 'society', icon: '🏢' },
                        { label: 'Independent House', val: 'independent', icon: '🏠' },
                    ].map(({ label, val, icon }) => (
                        <button
                            key={val}
                            onClick={() => onChange('propertyType', val)}
                            className={[
                                'flex-1 rounded-2xl border-2 font-bold text-lg transition-all flex items-center justify-center gap-3',
                                state.propertyType === val
                                    ? 'bg-yellow-400 border-yellow-500 text-gray-900 shadow-md'
                                    : 'bg-white border-gray-300 text-gray-600 hover:border-yellow-400 hover:bg-amber-50',
                            ].join(' ')}
                            style={{ height: '80px' }}
                        >
                            <span className="text-2xl">{icon}</span> {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Society sub-fields */}
            {state.propertyType === 'society' && (
                <div className="fade-in flex flex-col gap-5">
                    {/* Society Name */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-base">
                            Society Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={state.societyName}
                            onChange={(e) => onChange('societyName', e.target.value)}
                            placeholder="e.g. Sunrise Residency"
                            className="w-full border-2 border-gray-300 rounded-xl bg-white px-5 font-medium text-gray-900 focus:outline-none focus:border-yellow-500 transition-colors text-lg"
                            style={{ height: '64px' }}
                        />
                    </div>

                    {/* Secretary Contact */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-base">
                            Secretary Contact Number <span className="text-red-500">*</span>
                        </label>
                        <div
                            className="flex items-center border-2 border-gray-300 rounded-xl bg-white overflow-hidden focus-within:border-yellow-500 transition-colors"
                            style={{ height: '64px' }}
                        >
                            <span className="px-4 text-gray-500 font-bold border-r-2 border-gray-200 h-full flex items-center text-lg">+91</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={state.secretaryContact}
                                onChange={(e) => onChange('secretaryContact', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="10-digit mobile"
                                className="flex-1 px-4 font-medium text-gray-900 focus:outline-none bg-transparent text-lg"
                            />
                        </div>
                    </div>

                    {/* Upload NOC */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-base">
                            Upload NOC (No Objection Certificate) <span className="text-red-500">*</span>
                        </label>
                        <label
                            className={[
                                'w-full border-2 border-dashed rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-colors',
                                state.nocFile
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-gray-300 bg-gray-50 hover:border-yellow-400 hover:bg-amber-50',
                            ].join(' ')}
                            style={{ height: '80px' }}
                        >
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => onChange('nocFile', e.target.files[0])}
                            />
                            {state.nocFile ? (
                                <>
                                    <span className="text-green-600 text-2xl">✔</span>
                                    <span className="text-green-700 font-bold text-base">{state.nocFile.name}</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-gray-400 text-2xl">📄</span>
                                    <span className="text-gray-500 font-medium text-base">Tap to upload NOC — PDF, JPG or PNG</span>
                                </>
                            )}
                        </label>
                    </div>
                </div>
            )}

            {/* Independent house — no NOC notice */}
            {state.propertyType === 'independent' && (
                <div className="fade-in flex items-center gap-4 px-6 py-5 bg-green-50 border-2 border-green-300 rounded-2xl">
                    <span className="text-green-500 text-3xl flex-shrink-0">✅</span>
                    <div>
                        <p className="text-green-800 font-extrabold text-lg leading-tight">No NOC Required</p>
                        <p className="text-green-700 font-medium text-sm mt-0.5">
                            Independent house connections do not need a No Objection Certificate.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ════════════════════════════════
   ELECTRICITY CONFIG
════════════════════════════════ */
function ElectricityConfig({ state, onChange }) {
    return (
        <div className="fade-in flex flex-col gap-6">

            {/* Connection Type */}
            <div>
                <label className="block text-gray-800 font-bold mb-4 text-lg">
                    Connection Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-5">
                    {[
                        { label: 'Domestic', val: 'domestic', icon: '🏠' },
                        { label: 'Commercial', val: 'commercial', icon: '🏢' },
                        { label: 'Industrial', val: 'industrial', icon: '🏭' },
                    ].map(({ label, val, icon }) => (
                        <button
                            key={val}
                            onClick={() => onChange('connectionType', val)}
                            className={[
                                'flex-1 rounded-2xl border-2 font-bold text-base transition-all flex flex-col items-center justify-center gap-2',
                                state.connectionType === val
                                    ? 'bg-yellow-400 border-yellow-500 text-gray-900 shadow-md'
                                    : 'bg-white border-gray-300 text-gray-600 hover:border-yellow-400 hover:bg-amber-50',
                            ].join(' ')}
                            style={{ height: '96px' }}
                        >
                            <span className="text-2xl">{icon}</span>
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Appliance Load */}
            <div>
                <label className="block text-gray-800 font-bold mb-2 text-lg">
                    Appliance Load <span className="text-red-500">*</span>
                </label>
                <div
                    className="flex items-center border-2 border-gray-300 rounded-xl bg-white overflow-hidden focus-within:border-yellow-500 transition-colors"
                    style={{ height: '72px' }}
                >
                    <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.1"
                        value={state.applianceLoad}
                        onChange={(e) => onChange('applianceLoad', e.target.value)}
                        placeholder="e.g.  5.0"
                        className="flex-1 px-5 font-medium text-gray-900 focus:outline-none bg-transparent text-xl"
                    />
                    <span className="px-5 text-gray-500 font-extrabold border-l-2 border-gray-200 h-full flex items-center text-xl">kW</span>
                </div>
                <p className="text-gray-500 text-sm mt-2 font-medium">
                    Total connected load from all appliances in kilowatts.
                </p>
            </div>
        </div>
    )
}

/* ════════════════════════════════
   WATER CONFIG
════════════════════════════════ */
function WaterConfig({ state, onChange }) {
    return (
        <div className="fade-in flex flex-col gap-6">

            {/* Connection Category */}
            <div>
                <label className="block text-gray-800 font-bold mb-4 text-lg">
                    Connection Category <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-5">
                    {[
                        { label: 'Residential', val: 'residential', icon: '🏠' },
                        { label: 'Commercial', val: 'commercial', icon: '🏢' },
                    ].map(({ label, val, icon }) => (
                        <button
                            key={val}
                            onClick={() => onChange('connectionCategory', val)}
                            className={[
                                'flex-1 rounded-2xl border-2 font-bold text-lg transition-all flex items-center justify-center gap-3',
                                state.connectionCategory === val
                                    ? 'bg-yellow-400 border-yellow-500 text-gray-900 shadow-md'
                                    : 'bg-white border-gray-300 text-gray-600 hover:border-yellow-400 hover:bg-amber-50',
                            ].join(' ')}
                            style={{ height: '80px' }}
                        >
                            <span className="text-2xl">{icon}</span> {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* GIS notice */}
            <div className="flex items-center gap-4 px-6 py-5 bg-teal-50 border-2 border-teal-300 rounded-2xl">
                <span className="text-teal-400 text-3xl flex-shrink-0">🗺️</span>
                <div>
                    <p className="text-teal-800 font-extrabold text-lg leading-tight">GIS Property Mapping</p>
                    <p className="text-teal-700 font-medium text-sm mt-0.5">
                        Property mapping will be verified via GIS system. Field survey within 3 working days.
                    </p>
                </div>
            </div>
        </div>
    )
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
export default function NewConnectionConfigure() {
    const navigate = useNavigate()
    const { service } = useParams()

    const [gasState, setGasState] = useState({
        propertyType: '', societyName: '', secretaryContact: '', nocFile: null,
    })
    const [elecState, setElecState] = useState({ connectionType: '', applianceLoad: '' })
    const [waterState, setWaterState] = useState({ connectionCategory: '' })

    const handleGas = (k, v) => setGasState(p => ({ ...p, [k]: v }))
    const handleElec = (k, v) => setElecState(p => ({ ...p, [k]: v }))
    const handleWater = (k, v) => setWaterState(p => ({ ...p, [k]: v }))

    const isValid = () => {
        if (service === 'gas') {
            if (!gasState.propertyType) return false
            if (gasState.propertyType === 'society')
                return gasState.societyName.trim() && gasState.secretaryContact.length === 10 && gasState.nocFile
            return true
        }
        if (service === 'electricity') return !!(elecState.connectionType && elecState.applianceLoad)
        if (service === 'water') return !!waterState.connectionCategory
        return false
    }

    const handleContinue = () => {
        if (!isValid()) return
        navigate(`/${service}/new-connection/review`, {
            state: {
                service,
                config: service === 'gas' ? gasState : service === 'electricity' ? elecState : waterState,
            },
        })
    }

    const tickerText = TICKER_NOTICES.join('          ·          ')
    const fullTrack = tickerText + '          ·          ' + tickerText

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
            <main className="flex-1 flex flex-col items-center justify-between overflow-hidden px-8 py-6">

                {/* ── Top section: title + progress ── */}
                <div className="w-full flex flex-col gap-4" style={{ maxWidth: '860px' }}>

                    {/* Title row */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-extrabold text-gray-900 text-4xl leading-tight">
                                New Connection Configuration
                            </h1>
                            <p className="text-gray-500 font-medium text-lg mt-1">
                                Step 2 of 4 — Configure your{' '}
                                <span className="font-bold text-gray-700 capitalize">{service}</span> connection
                            </p>
                        </div>

                        {/* Verified chip */}
                        <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-green-50 border-2 border-green-300 flex-shrink-0">
                            <span className="text-green-600 text-lg">✅</span>
                            <span className="font-bold text-green-800 text-sm uppercase tracking-wide">DigiLocker Verified</span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <ProgressBar current={2} />
                </div>

                {/* ── Centre: form card ── */}
                <div
                    className="w-full flex-1 flex flex-col justify-center"
                    style={{ maxWidth: '860px' }}
                >
                    <div className="w-full bg-white border-2 border-gray-200 rounded-2xl shadow-sm px-10 py-8">
                        {service === 'gas' && <GasConfig state={gasState} onChange={handleGas} />}
                        {service === 'electricity' && <ElectricityConfig state={elecState} onChange={handleElec} />}
                        {service === 'water' && <WaterConfig state={waterState} onChange={handleWater} />}
                        {!['gas', 'electricity', 'water'].includes(service) && (
                            <p className="text-gray-400 text-xl text-center font-medium">Unknown service: {service}</p>
                        )}
                    </div>
                </div>

                {/* ── Bottom: nav buttons ── */}
                <div className="w-full flex items-center justify-between" style={{ maxWidth: '860px' }}>
                    <button
                        onClick={() => navigate(`/${service}/new-connection/verify`)}
                        className="rounded-xl font-bold text-gray-600 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all"
                        style={{ height: '64px', width: '200px', fontSize: '1.05rem' }}
                    >
                        ← Back
                    </button>

                    <button
                        onClick={handleContinue}
                        disabled={!isValid()}
                        className={[
                            'btn-shine rounded-xl font-extrabold text-xl border-2 transition-all',
                            isValid()
                                ? 'bg-yellow-400 border-yellow-500 text-gray-900 active:scale-95 cursor-pointer'
                                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed',
                        ].join(' ')}
                        style={{ height: '64px', width: '280px' }}
                    >
                        Continue →
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    )
}
