/**
 * useVoiceNav.js — Voice navigation for Suvidha-UI
 * Supports Devanagari (Hindi script) + Roman Hindi + English
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSarvamSTT } from './hooks/useSarvamSTT.js'
import { useSarvamTTS } from './hooks/useSarvamTTS.js'

// ── Route resolver — supports Devanagari + Roman Hindi + English ───────────
function resolveRoute(transcript) {
    const t = transcript.toLowerCase().trim()
    const has = (...words) => words.some(w => t.includes(w))

    const isGas = has('gas', 'गैस', 'gaas')
    const isElec = has('electricity', 'bijli', 'बिजली', 'bijlee', 'light', 'electric', 'vidyut', 'विद्युत')
    const isMuni = has('municipal', 'nagar', 'नगर', 'palika', 'पालिका', 'nagarsevika',
        'नगरसेविका', 'pani', 'पानी', 'water', 'municipality', 'jal', 'जल')
    const isBill = has('bill', 'बिल', 'bharna', 'भरना', 'payment', 'pay',
        'jama', 'जमा', 'bhugtan', 'भुगतान')
    const isComp = has('complaint', 'shikayat', 'शिकायत', 'problem', 'issue',
        'darj', 'दर्ज', 'pareshaani', 'परेशानी')
    const isNew = has('new', 'naya', 'नया', 'connection', 'connect',
        'कनेक्शन', 'jodna', 'जोड़ना', 'nayi', 'नयी')
    const isStatus = has('status', 'track', 'स्टेटस', 'application', 'dekhna',
        'देखना', 'tracking', 'pata', 'पता', 'check', 'jaankari', 'जानकारी')
    const isHome = has('home', 'wapas', 'वापस', 'back', 'shuru', 'शुरू',
        'mukhya', 'मुख्य', 'menu', 'मेनू')

    // Gas
    if (isGas && isBill) return '/gas/bill'
    if (isGas && isComp) return '/gas/complaint'
    if (isGas && isNew) return '/gas/new-connection'
    if (isGas) return '/services/gas'

    // Electricity
    if (isElec && isBill) return '/electricity/bill'
    if (isElec && isComp) return '/electricity/complaint'
    if (isElec && isNew) return '/electricity/new-connection'
    if (isElec) return '/services/electricity'

    // Municipal
    if (isMuni) return '/services/municipal'

    // Generic
    if (isStatus) return '/status'
    if (isHome) return '/language'
    if (isBill || isNew) return '/services'

    return null
}

// ── Response texts (Hindi) ────────────────────────────────────────────────
const ROUTE_RESPONSES = {
    '/gas/bill': 'गैस बिल भुगतान पेज पर जा रहे हैं।',
    '/gas/complaint': 'गैस शिकायत फॉर्म खुल रहा है।',
    '/gas/new-connection': 'गैस नए कनेक्शन के लिए जा रहे हैं।',
    '/services/gas': 'गैस सेवाएं खुल रही हैं।',
    '/electricity/bill': 'बिजली बिल भुगतान पेज पर जा रहे हैं।',
    '/electricity/complaint': 'बिजली शिकायत फॉर्म खुल रहा है।',
    '/electricity/new-connection': 'बिजली नए कनेक्शन के लिए जा रहे हैं।',
    '/services/electricity': 'बिजली सेवाएं खुल रही हैं।',
    '/services/municipal': 'नगर पालिका सेवाएं खुल रही हैं।',
    '/status': 'स्टेटस ट्रैकिंग पेज पर जा रहे हैं।',
    '/language': 'होम स्क्रीन पर वापस जा रहे हैं।',
    '/services': 'सेवाएं चुनें — गैस, बिजली, या नगर पालिका बोलें।',
}

const GREETING = 'नमस्ते! मैं eSaarthi हूँ। आप बोलें — गैस, बिजली, या नगर पालिका सेवा।'
const NOT_UNDERSTOOD = 'माफ़ करें, समझ नहीं आया। कृपया गैस, बिजली, या नगर पालिका बोलें।'

// ── Hook ─────────────────────────────────────────────────────────────────
export function useVoiceNav() {
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState(false)
    const [statusText, setStatusText] = useState('')
    const wantListeningRef = useRef(false)
    const startListeningRef = useRef(null)

    const { speak, stop: stopSpeaking } = useSarvamTTS({ language: 'hi-IN' })

    const handleRecognitionEnd = useCallback(() => {
        if (wantListeningRef.current) {
            setTimeout(() => { if (wantListeningRef.current) startListeningRef.current?.() }, 200)
        }
    }, [])

    const handleUserInput = useCallback(async (transcript) => {
        if (!transcript?.trim()) return
        wantListeningRef.current = false
        console.log('🎙️ Heard:', transcript)
        setStatusText(`"${transcript}"`)

        const route = resolveRoute(transcript)
        const responseText = route ? ROUTE_RESPONSES[route] : NOT_UNDERSTOOD
        await speak(responseText, 'hi-IN')

        if (route) {
            navigate(route)
            wantListeningRef.current = false
            setIsActive(false)
            setStatusText('')
        } else {
            // Didn't understand — keep listening
            wantListeningRef.current = true
            startListeningRef.current?.()
        }
    }, [speak, navigate])

    const { isListening, isProcessing, startListening, stopListening } = useSarvamSTT({
        language: 'hi-IN',
        onResult: handleUserInput,
        onEnd: handleRecognitionEnd,
        onError: (e) => console.warn('STT:', e),
    })

    useEffect(() => { startListeningRef.current = startListening }, [startListening])

    const startSession = useCallback(async () => {
        setIsActive(true)
        setStatusText('सुन रहा हूँ...')
        await speak(GREETING, 'hi-IN')
        wantListeningRef.current = true
        startListeningRef.current?.()
    }, [speak])

    const stopSession = useCallback(() => {
        wantListeningRef.current = false
        stopSpeaking()
        stopListening()
        setIsActive(false)
        setStatusText('')
    }, [stopSpeaking, stopListening])

    const agentStatus = isProcessing ? 'thinking'
        : isListening ? 'listening'
            : isActive ? 'speaking'
                : 'idle'

    return { isActive, agentStatus, statusText, startSession, stopSession }
}
