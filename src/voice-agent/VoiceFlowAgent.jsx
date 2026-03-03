/**
 * VoiceFlowAgent.jsx
 *
 * Global voice agent for eSaarthi KIOSK.
 * - Mounted once in App.jsx (inside BrowserRouter)
 * - Uses Gemini Flash 2.0 (useLLMBrain) for NLU + dialog
 * - Uses Sarvam STT (useSarvamSTT) for mic → text
 * - Uses Sarvam TTS (useSarvamTTS) for text → speech
 * - DOM helpers: fillInput, fillTextarea, fillSelect, clickButton
 *
 * Exported:
 *   VoiceFlowProvider  — wraps App
 *   useVoiceFlowCtx    — context hook for pages
 */

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSarvamSTT } from './hooks/useSarvamSTT.js'
import { useSarvamTTS } from './hooks/useSarvamTTS.js'
import { useLLMBrain } from './useLLMBrain.js'

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────
const VoiceFlowCtx = createContext(null)
export const useVoiceFlowCtx = () => useContext(VoiceFlowCtx)

// ─────────────────────────────────────────────────────────────────────────────
// DOM helpers — fill React-controlled fields via native events
// ─────────────────────────────────────────────────────────────────────────────
function fillInput(id, value) {
    const el = document.getElementById(id)
    if (!el) return false
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    setter.call(el, value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
    return true
}

function fillTextarea(id, value) {
    const el = document.getElementById(id)
    if (!el) return false
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
    if (setter) setter.call(el, value)
    else el.value = value
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
    return true
}

function fillSelect(id, value) {
    const el = document.getElementById(id)
    if (!el) return false
    const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set
    if (setter) setter.call(el, value)
    else el.value = value
    el.dispatchEvent(new Event('change', { bubbles: true }))
    return true
}

function clickButton(text) {
    const btns = document.querySelectorAll('button')
    for (const btn of btns) {
        if (btn.textContent?.trim().toLowerCase().includes(text.toLowerCase()) && !btn.disabled) {
            btn.click()
            return true
        }
    }
    return false
}

// OTP keypad: click individual digit buttons sequentially
async function fillOTPKeypad(digits) {
    for (const digit of digits) {
        const btns = document.querySelectorAll('button')
        for (const btn of btns) {
            if (btn.textContent?.trim() === digit && !btn.disabled) {
                btn.click()
                break
            }
        }
        await new Promise(r => setTimeout(r, 60))
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Page prompts — spoken when agent first activates on a page
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_PROMPTS = {
    '/language': 'नमस्ते! मैं eSaarthi हूँ। आप बोलें — गैस, बिजली, या नगर पालिका सेवा।',
    '/services': 'कौन सी सेवा चाहिए? गैस, बिजली, या नगर पालिका बोलें।',
    '/services/gas': 'गैस सेवाएं — बिल भुगतान, नया कनेक्शन, या शिकायत — क्या चाहिए?',
    '/services/electricity': 'बिजली सेवाएं — बिल भुगतान, नया कनेक्शन, या शिकायत — क्या चाहिए?',
    '/services/municipal': 'नगर पालिका सेवाएं — पानी बिल, शिकायत, या सफाई शिकायत बोलें।',
    '/gas/bill': 'कृपया अपना Consumer Number बोलें।',
    '/electricity/bill': 'कृपया अपना Consumer Number बोलें।',
    '/otp-verification': 'आपके मोबाइल पर OTP आया होगा। कृपया छह अंकों का OTP बोलें।',
    '/complaint-otp': 'शिकायत OTP बोलें।',
    '/bill-details': 'बिल विवरण दिखाया जा रहा है। भुगतान के लिए \"हाँ\" बोलें।',
    '/payment-method': 'भुगतान का तरीका चुनें — UPI, Card, या Cash बोलें।',
    '/status': 'Reference ID या मोबाइल नंबर बोलें।',
    '/gas/complaint': 'शिकायत दर्ज करते हैं। पहले अपना Consumer Number बोलें।',
    '/electricity/complaint': 'शिकायत दर्ज करते हैं। पहले अपना Consumer Number बोलें।',
    '/complaint-success': 'बधाई! आपकी शिकायत सफलतापूर्वक दर्ज हो गई। मुख्य मेनू के लिए \"वापस\" बोलें।',
    '/payment-success': 'बधाई! भुगतान सफल हुआ। मुख्य मेनू के लिए \"वापस\" बोलें।',
    '/status-result': 'आपकी Application का Status दिखाया जा रहा है। मुख्य मेनू के लिए \"वापस\" बोलें।',
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Provider
// ─────────────────────────────────────────────────────────────────────────────
export function VoiceFlowProvider({ children }) {
    const navigate = useNavigate()
    const location = useLocation()
    const pathnameRef = useRef(location.pathname)
    pathnameRef.current = location.pathname

    const [isActive, setIsActive] = useState(false)
    const [agentStatus, setAgentStatus] = useState('idle') // idle|listening|thinking|speaking
    const [statusText, setStatusText] = useState('')

    const wantListeningRef = useRef(false)
    const startListeningRef = useRef(null)

    const { speak, stop: stopSpeaking } = useSarvamTTS({ language: 'hi-IN' })
    const brain = useLLMBrain()

    // ── Speak then re-arm listening ────────────────────────────────────────────
    const sayAndListen = useCallback(async (text) => {
        setAgentStatus('speaking')
        setStatusText(text)
        await speak(text, 'hi-IN')
        wantListeningRef.current = true
        await new Promise(r => setTimeout(r, 450)) // let room echo settle
        if (wantListeningRef.current) {
            setAgentStatus('listening')
            setStatusText('सुन रहा हूँ...')
            startListeningRef.current?.()
        }
    }, [speak])

    // ── STT callbacks ──────────────────────────────────────────────────────────
    const handleRecognitionEnd = useCallback(() => {
        if (wantListeningRef.current) {
            setTimeout(() => { if (wantListeningRef.current) startListeningRef.current?.() }, 300)
        }
    }, [])

    // ── Main input handler — LLM brain processes every utterance ──────────────
    const handleUserInput = useCallback(async (transcript) => {
        if (!transcript?.trim()) return
        wantListeningRef.current = false
        setAgentStatus('thinking')
        setStatusText(`"${transcript}"`)
        console.log('🎙️ Heard:', transcript)

        const path = pathnameRef.current

        // ── Special OTP handling (bypass LLM for speed, extract digits directly) ─
        const isOtpPage = path === '/otp-verification' || path === '/complaint-otp'
        if (isOtpPage) {
            const digits = transcript.replace(/[^0-9]/g, '')
            if (digits.length === 6) {
                await fillOTPKeypad(digits)
                const verifyBtn = path === '/complaint-otp' ? 'Verify & Submit' : 'Verify'
                await sayAndListen(`OTP ${digits} दर्ज किया। Verify करने के लिए "हाँ" बोलें।`)
                // Next user input will go through LLM which will click Verify on "हाँ"
                return
            }
        }

        // ── Call LLM brain ──────────────────────────────────────────────────────
        const response = await brain.process(transcript, path)

        // Normalise action — LLMs sometimes return wrong casing or synonyms
        const action = (response.action || 'none').toLowerCase().trim()
        const navRoute = response.navigate // may be set even when action !== 'navigate'

        console.log(`🤖 LLM | action:"${action}" | navigate:"${navRoute}" | field:"${response.field}" | value:"${response.value}" | speak:"${response.speak?.slice(0, 60)}..."`);

        // ── NAVIGATION — check navigate field directly, not just action ─────────
        // LLMs sometimes set action:'none' but populate the navigate field
        if (navRoute && (action === 'navigate' || action === 'navigation' || action === 'none')) {
            console.log('🗺️ Navigating to:', navRoute)
            setAgentStatus('speaking')
            setStatusText(response.speak)
            await speak(response.speak, 'hi-IN')
            navigate(navRoute)
            return // useEffect will speak the new page prompt on route change
        }

        // ── DOM ACTIONS ─────────────────────────────────────────────────────────
        if (action === 'fill_input' && response.field && response.value != null) {
            const ok = fillInput(response.field, String(response.value))
            console.log(`📝 fillInput("${response.field}", "${response.value}") →`, ok ? '✅' : '❌ field not found')
        }
        if (action === 'fill_textarea' && response.field && response.value != null) {
            const ok = fillTextarea(response.field, String(response.value))
            console.log(`📝 fillTextarea("${response.field}", "${response.value}") →`, ok ? '✅' : '❌ field not found')
        }
        if (action === 'fill_select' && response.field && response.value != null) {
            const ok = fillSelect(response.field, String(response.value))
            console.log(`📋 fillSelect("${response.field}", "${response.value}") →`, ok ? '✅' : '❌ field not found')
        }
        if (action === 'click_button' && response.value) {
            const ok = clickButton(String(response.value))
            console.log(`🖱️ clickButton("${response.value}") →`, ok ? '✅' : '❌ button not found')
        }

        // ── Done state ──────────────────────────────────────────────────────────
        if (response.done) {
            wantListeningRef.current = false
            setAgentStatus('idle')
            setStatusText(response.speak)
            await speak(response.speak, 'hi-IN')
            return
        }

        // ── Speak + listen for next turn ────────────────────────────────────────
        await sayAndListen(response.speak)
    }, [brain, speak, navigate, sayAndListen])

    // ── Wire STT ───────────────────────────────────────────────────────────────
    const { isListening, isProcessing, startListening, stopListening } = useSarvamSTT({
        language: 'hi-IN',
        onResult: handleUserInput,
        onEnd: handleRecognitionEnd,
        onError: (e) => {
            console.warn('STT error:', e)
            if (wantListeningRef.current) startListeningRef.current?.()
        },
    })
    useEffect(() => { startListeningRef.current = startListening }, [startListening])

    // ── Speak page prompt when route changes (agent active) ───────────────────
    const prevPathRef = useRef(location.pathname)
    useEffect(() => {
        if (location.pathname !== prevPathRef.current && isActive) {
            prevPathRef.current = location.pathname
            const prompt = PAGE_PROMPTS[location.pathname] || 'बोलें — क्या मदद चाहिए?'
            wantListeningRef.current = true
            setTimeout(() => sayAndListen(prompt), 700)
        }
    }, [location.pathname, isActive, sayAndListen])

    // ── Public API ─────────────────────────────────────────────────────────────
    const startSession = useCallback(async () => {
        setIsActive(true)
        brain.resetHistory()
        const prompt = PAGE_PROMPTS[location.pathname] || PAGE_PROMPTS['/language']
        wantListeningRef.current = true
        await sayAndListen(prompt)
    }, [location.pathname, sayAndListen, brain])

    const stopSession = useCallback(() => {
        wantListeningRef.current = false
        stopSpeaking()
        stopListening()
        setIsActive(false)
        setAgentStatus('idle')
        setStatusText('')
        brain.resetHistory()
    }, [stopSpeaking, stopListening, brain])

    const effectiveStatus = isProcessing ? 'thinking' : isListening ? 'listening' : agentStatus

    return (
        <VoiceFlowCtx.Provider value={{ isActive, agentStatus: effectiveStatus, statusText, startSession, stopSession }}>
            {children}
        </VoiceFlowCtx.Provider>
    )
}
