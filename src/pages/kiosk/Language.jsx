import { useState } from 'react'
import { MdAccessibility } from 'react-icons/md'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const LANGUAGES = [
    'English',
    'हिंदी',
    'मराठी',
    'తెలుగు',
    'বাংলা',
    'தமிழ்',
    'ગુજરાતી',
    'ಕನ್ನಡ',
    'മലയാളം',
    'ਪੰਜਾਬੀ',
    'অসমীয়া',
    'ଓଡ଼ିଆ',
    'اردو',
    'संस्कृत',
    'नेपाली',
    'कोंकणी',
    'मैथिली',
    'डोगरी',
    'बोडो',
    'মণিপুরি',
    'संताली',
    'कश्मीरी',
]

const ITEMS_PER_PAGE = 12

export default function Language() {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(LANGUAGES.length / ITEMS_PER_PAGE)

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const currentLanguages = LANGUAGES.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
    }

    return (
        <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Noto Sans', sans-serif" }}>

            <Header />

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 flex flex-col px-12 pt-8 pb-4">

                {/* Title row */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="font-extrabold text-gray-900" style={{ fontSize: '2.2rem' }}>
                        Select Language
                    </h1>
                    {/* Accessibility / AI Assistant button */}
                    <button
                        aria-label="Accessibility"
                        className="flex items-center justify-center rounded-xl text-white"
                        style={{
                            backgroundColor: '#1E8B4F',
                            width: '72px',
                            height: '72px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <MdAccessibility size={40} color="white" />
                    </button>
                </div>

                {/* Divider */}
                <hr className="border-gray-300 mb-8" />

                {/* Language grid – 4 columns */}
                <div
                    className="grid gap-5 mx-auto w-full"
                    style={{ gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: '1200px' }}
                >
                    {currentLanguages.map((lang) => (
                        <button
                            key={lang}
                            className="flex items-center justify-center rounded-2xl font-semibold text-gray-900 cursor-pointer"
                            style={{
                                backgroundColor: '#F5E17A',
                                border: '2px solid #D4B800',
                                minHeight: '90px',
                                fontSize: '1.35rem',
                                wordBreak: 'break-word',
                            }}
                        >
                            {lang}
                        </button>
                    ))}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* ── PAGINATION ── */}
                <div className="flex items-center justify-center gap-8 py-6">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                        className="flex items-center justify-center rounded-xl text-white font-bold text-xl transition-opacity"
                        style={{
                            backgroundColor: currentPage === 1 ? '#9391C4' : '#1A1A8C',
                            width: '68px',
                            height: '68px',
                            border: 'none',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 1 ? 0.6 : 1,
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>

                    <span className="text-gray-800 font-semibold text-xl select-none">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                        className="flex items-center justify-center rounded-xl text-white font-bold text-xl transition-opacity"
                        style={{
                            backgroundColor: currentPage === totalPages ? '#9391C4' : '#1A1A8C',
                            width: '68px',
                            height: '68px',
                            border: 'none',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            opacity: currentPage === totalPages ? 0.6 : 1,
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    )
}
