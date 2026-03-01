export default function Footer() {
    return (
        <footer
            className="w-full flex items-center justify-center gap-4 text-white text-sm"
            style={{ backgroundColor: '#3A3A3A', minHeight: '48px' }}
        >
            <span>Helpline 1800-3846-2986</span>
            <span className="opacity-50">|</span>
            <span className="cursor-pointer hover:underline">Privacy</span>
            <span className="opacity-50">|</span>
            <span className="cursor-pointer hover:underline">Terms</span>
            <span className="opacity-50">|</span>
            <span>Version 1.0</span>
        </footer>
    )
}
