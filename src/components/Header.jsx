export default function Header() {
    return (
        <header
            className="w-full flex items-center justify-between px-8"
            style={{ backgroundColor: '#1A1A8C', minHeight: '100px' }}
        >
            {/* Left – eSaarthi logo */}
            <div className="flex items-center">
                <img
                    src="/eSaarthi.svg"
                    alt="eSaarthi"
                    style={{ height: '100px', width: 'auto', objectFit: 'contain' }}
                />
            </div>

            {/* Right – Ministry + Digital India + CDAC */}
            <div className="flex items-center" style={{ gap: '48px' }}>
                <img
                    src="/Ministry.svg"
                    alt="Ministry of Electronics and Information Technology"
                    style={{ height: '100px', width: 'auto', objectFit: 'contain' }}
                />
                <img
                    src="/DigitalIndia.svg"
                    alt="Digital India"
                    style={{ height: '100px', width: 'auto', objectFit: 'contain' }}
                />
                <img
                    src="/CDAC.svg"
                    alt="CDAC"
                    style={{ height: '80px', width: 'auto', objectFit: 'contain' }}
                />
            </div>
        </header>
    )
}
