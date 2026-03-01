/**
 * VoiceFlowAgent.jsx
 *
 * Global voice agent for Suvidha-UI.
 * - Mounted once in App.jsx (inside BrowserRouter)
 * - Triggered by the existing AI/accessibility button in Language.jsx
 * - Uses useLocation to know which page the user is on
 * - Speaks page prompts + fills form fields via voice
 * - DOES NOT change any existing page UI
 *
 * Exported: useVoiceFlowCtx (context hook for pages to access)
 *           VoiceFlowProvider (wraps App)
 *           VoiceFlowTrigger  (the mic button logic — used by Language.jsx)
 */

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSarvamSTT } from './hooks/useSarvamSTT.js'
import { useSarvamTTS } from './hooks/useSarvamTTS.js'

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────
const VoiceFlowCtx = createContext(null)
export const useVoiceFlowCtx = () => useContext(VoiceFlowCtx)

// ─────────────────────────────────────────────────────────────────────────────
// NLU helpers
// ─────────────────────────────────────────────────────────────────────────────
function has(t, ...words) { return words.some(w => t.includes(w.normalize('NFC'))) }

// Convert Devanagari digits ०-९ to ASCII 0-9, then extract
function toAsciiDigits(text) {
    return text
        .replace(/[०-९]/g, d => String('०१२३४५६७८९'.indexOf(d)))
        // also handle spoken digit words
        .replace(/\bshunya\b|\bzero\b/gi, '0')
        .replace(/\bek\b|\bone\b/gi, '1')
        .replace(/\bdo\b|\btwo\b/gi, '2')
        .replace(/\bteen\b|\bthrее\b/gi, '3')
        .replace(/\bchaar\b|\bfour\b/gi, '4')
        .replace(/\bpaanch\b|\bfive\b/gi, '5')
        .replace(/\bchhe\b|\bchha\b|\bsix\b/gi, '6')
        .replace(/\bsaat\b|\bseven\b/gi, '7')
        .replace(/\baath\b|\beight\b/gi, '8')
        .replace(/\bnau\b|\bnine\b/gi, '9')
}

function extractNumbers(text) {
    return toAsciiDigits(text).replace(/[^0-9]/g, '')
}

function extractMobile(text) {
    const digits = toAsciiDigits(text).replace(/[^0-9]/g, '')
    return digits.length >= 10 ? digits.slice(-10) : digits
}

function matchNavIntent(t) {
    const isGas = has(t, 'gas', 'गैस', 'gaas')
    const isElec = has(t, 'electricity', 'bijli', 'बिजली', 'bijlee', 'light', 'electric', 'विद्युत')
    const isMuni = has(t, 'municipal', 'nagar', 'नगर', 'palika', 'पालिका', 'nagarsevika', 'नगरसेविका', 'pani', 'पानी', 'water', 'jal')
    const isBill = has(t, 'bill', 'बिल', 'bharna', 'भरना', 'payment', 'pay', 'jama', 'जमा', 'भुगतान')
    const isComp = has(t, 'complaint', 'shikayat', 'शिकायत', 'problem', 'issue', 'darj', 'दर्ज')
    const isNew = has(t, 'new', 'naya', 'नया', 'connect', 'कनेक्शन', 'jodna', 'जोड़ना', 'nayi')
    const isStat = has(t, 'status', 'track', 'स्टेटस', 'application', 'dekhna', 'देखना', 'pata', 'check')
    const isHome = has(t, 'home', 'wapas', 'वापस', 'back', 'shuru', 'शुरू', 'mukhya', 'मुख्य', 'cancel', 'रद्द')
    const isYes = has(t, 'haan', 'हाँ', 'yes', 'ha', 'correct', 'theek', 'ठीक', 'bilkul', 'okay', 'ok', 'submit', 'aage', 'आगे', 'next', 'verify')
    const isNo = has(t, 'nahi', 'नहीं', 'no', 'nhi', 'galat', 'गलत', 'cancel')

    if (isGas && isBill) return { route: '/gas/bill', intent: 'gas_bill' }
    if (isGas && isComp) return { route: '/gas/complaint', intent: 'gas_complaint' }
    if (isGas && isNew) return { route: '/gas/new-connection', intent: 'gas_new' }
    if (isGas) return { route: '/services/gas', intent: 'gas' }
    if (isElec && isBill) return { route: '/electricity/bill', intent: 'elec_bill' }
    if (isElec && isComp) return { route: '/electricity/complaint', intent: 'elec_complaint' }
    if (isElec && isNew) return { route: '/electricity/new-connection', intent: 'elec_new' }
    if (isElec) return { route: '/services/electricity', intent: 'electricity' }
    if (isMuni) return { route: '/services/municipal', intent: 'municipal' }
    if (isStat) return { route: '/status', intent: 'status' }
    if (isHome) return { route: '/language', intent: 'home' }
    if (isYes) return { intent: 'yes' }
    if (isNo) return { intent: 'no' }
    return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Page config: prompt + what to do with voice input on each route pattern
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_PROMPTS = {
    '/language': 'नमस्ते! मैं eSaarthi हूँ। आप बोलें — गैस, बिजली, या नगर पालिका सेवा।',
    '/services': 'कौन सी सेवा चाहिए? गैस, बिजली, या नगर पालिका बोलें।',
    '/services/gas': 'गैस सेवाएं — बिल भुगतान, नया कनेक्शन, या शिकायत — क्या चाहिए?',
    '/services/electricity': 'बिजली सेवाएं — बिल भुगतान, नया कनेक्शन, या शिकायत — क्या चाहिए?',
    '/services/municipal': 'नगर पालिका सेवाएं — बिल भुगतान, नया कनेक्शन, या शिकायत बोलें।',
    '/gas/bill': 'कृपया अपना Consumer Number बोलें।',
    '/electricity/bill': 'कृपया अपना Consumer Number बोलें।',
    '/otp-verification': 'आपके मोबाइल पर OTP आया होगा। कृपया छह अंकों का OTP बोलें।',
    '/complaint-otp': 'शिकायत OTP आया होगा। कृपया छह अंकों का OTP बोलें।',
    '/bill-details': 'बिल विवरण दिखाया जा रहा है। भुगतान के लिए आगे बढ़ना है तो "हाँ" बोलें।',
    '/payment-method': 'भुगतान का तरीका चुनें — UPI, कार्ड, या कैश बोलें।',
    '/status': 'स्टेटस देखने के लिए Reference ID या मोबाइल नंबर बोलें।',
    '/gas/complaint': 'शिकायत दर्ज करते हैं। पहले अपना Consumer Number बोलें।',
    '/electricity/complaint': 'शिकायत दर्ज करते हैं। पहले अपना Consumer Number बोलें।',
    '/complaint-success': 'बधाई हो! आपकी शिकायत सफलतापूर्वक दर्ज हो गई है। अपना Reference Number नोट कर लें। मुख्य मेनू पर जाने के लिए "वापस" बोलें।',
    '/payment-success': 'बधाई हो! आपका भुगतान सफलतापूर्वक हो गया है। धन्यवाद! मुख्य मेनू पर जाने के लिए "वापस" बोलें।',
    '/status-result': 'आपकी Application का Status दिखाया जा रहा है। मुख्य मेनू पर जाने के लिए "वापस" बोलें।',
    '/home': 'नमस्ते! मैं eSaarthi हूँ। शुरू करने के लिए "शुरू" बोलें।',
}

// ─────────────────────────────────────────────────────────────────────────────
// Fill a React-controlled input via native input event
// ─────────────────────────────────────────────────────────────────────────────
function fillInput(id, value) {
    const el = document.getElementById(id)
    if (!el) return false
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    nativeInputValueSetter.call(el, value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
    return true
}

// Click a button by matching its text
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

// Fill a <textarea> React-controlled field
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

// Fill a <select> React-controlled field
function fillSelect(id, value) {
    const el = document.getElementById(id)
    if (!el) return false
    const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set
    if (setter) setter.call(el, value)
    else el.value = value
    el.dispatchEvent(new Event('change', { bubbles: true }))
    return true
}

// Match a spoken category to the complaint category options
function matchCategory(t, service) {
    const cats = {
        gas: [
            { value: 'No Supply', words: ['supply nahi', 'gas nahi', 'no supply', 'band', 'आपूर्ति', 'nahi aa', 'supply'] },
            { value: 'Low Pressure', words: ['pressure', 'dhima', 'low pressure', 'kam aa', 'daba'] },
            { value: 'Gas Leakage', words: ['leakage', 'leak', 'gas nikal', 'smell', 'boo', 'गैस लीक'] },
            { value: 'Billing Issue', words: ['bill', 'billing', 'charge', 'paisa', 'बिल'] },
            { value: 'Meter Defect', words: ['meter', 'मीटर', 'kharab', 'faulty'] },
            { value: 'Other', words: ['other', 'anya', 'kuch aur', 'aur', 'अन्य'] },
        ],
        electricity: [
            { value: 'No Supply', words: ['supply nahi', 'light nahi', 'no supply', 'bijli nahi', 'band', 'current nahi'] },
            { value: 'Low Voltage', words: ['voltage', 'low', 'voltage kam', 'dhima current', 'fluctuat'] },
            { value: 'Frequent Tripping', words: ['trip', 'baar baar', 'frequently', 'bar bar', 'breaker', 'cut'] },
            { value: 'Billing Issue', words: ['bill', 'billing', 'charge', 'paisa', 'बिल'] },
            { value: 'Meter Defect', words: ['meter', 'मीटर', 'kharab', 'faulty'] },
            { value: 'Transformer Fault', words: ['transformer', 'ट्रांसफार्मर', 'substation'] },
            { value: 'Other', words: ['other', 'anya', 'kuch aur', 'अन्य'] },
        ],
        municipal: [
            { value: 'No Water Supply', words: ['pani nahi', 'water nahi', 'no water', 'supply nahi', 'पानी नहीं'] },
            { value: 'Pipe Leakage', words: ['pipe', 'leak', 'paani aa raha', 'pani bah raha', 'नल'] },
            { value: 'Garbage Not Collected', words: ['garbage', 'kachra', 'waste', 'safai', 'कचरा'] },
            { value: 'Sewer Overflow', words: ['sewer', 'nali', 'ganda paani', 'overflow', 'नाली'] },
            { value: 'Street Light Issue', words: ['light', 'lamp', 'street light', 'batti', 'बत्ती'] },
            { value: 'Billing Issue', words: ['bill', 'billing', 'charge', 'paisa', 'बिल'] },
            { value: 'Other', words: ['other', 'anya', 'kuch aur', 'अन्य'] },
        ],
    }
    const list = cats[service] || cats['gas']
    for (const cat of list) {
        if (cat.words.some(w => t.includes(w))) return cat.value
    }
    return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Provider
// ─────────────────────────────────────────────────────────────────────────────
export function VoiceFlowProvider({ children }) {
    const navigate = useNavigate()
    const location = useLocation()
    const pathnameRef = useRef(location.pathname)
    pathnameRef.current = location.pathname // always latest — avoids stale closure in STT callbacks

    const [isActive, setIsActive] = useState(false)
    const [agentStatus, setAgentStatus] = useState('idle') // idle|listening|thinking|speaking
    const [statusText, setStatusText] = useState('')

    // Form field state across pages
    const flowStateRef = useRef({ step: 'nav', field: null })
    const wantListeningRef = useRef(false)
    const startListeningRef = useRef(null)

    const { speak, stop: stopSpeaking } = useSarvamTTS({ language: 'hi-IN' })

    // ── Speak + then listen ──────────────────────────────────────────────────
    const sayAndListen = useCallback(async (text) => {
        setAgentStatus('speaking')
        setStatusText(text)
        await speak(text, 'hi-IN')
        // Always re-arm listening after speaking — stopSession() is what turns it off
        wantListeningRef.current = true
        // 450ms grace period — lets room echo die down before mic starts
        await new Promise(r => setTimeout(r, 450))
        // Re-check: stopSession may have been called during TTS playback
        if (wantListeningRef.current) {
            setAgentStatus('listening')
            setStatusText('सुन रहा हूँ...')
            startListeningRef.current?.()
        }
    }, [speak])


    // ── Handle what the user said ────────────────────────────────────────────
    const handleRecognitionEnd = useCallback(() => {
        if (wantListeningRef.current) {
            setTimeout(() => { if (wantListeningRef.current) startListeningRef.current?.() }, 300)
        }
    }, [])

    const handleUserInput = useCallback(async (transcript) => {
        if (!transcript?.trim()) return
        wantListeningRef.current = false
        setAgentStatus('thinking')
        console.log('🎙️ Heard:', transcript)
        setStatusText(`"${transcript}"`)

        const t = transcript.toLowerCase().trim().normalize('NFC') // normalize for Devanagari Unicode consistency
        const path = pathnameRef.current  // use ref — avoids stale closure from ScriptProcessor
        const fs = flowStateRef.current

        // ── Cancel always works ───────────────────────────────────
        if (has(t, 'band karo', 'stop', 'ruko', 'band', 'close')) {
            stopSession()
            return
        }

        // ── Complaint form: step-by-step voice filling ───────────
        const onComplaintPage = path.includes('/complaint') && !path.includes('otp') && !path.includes('success')
        if (onComplaintPage) {
            const svc = path.startsWith('/gas') ? 'gas' : path.startsWith('/electricity') ? 'electricity' : 'municipal'

            const catPrompt = svc === 'gas'
                ? 'Consumer Number दर्ज किया। अब शिकायत का प्रकार बोलें: गैस नहीं आ रही, प्रेशर कम है, गैस लीक, बिल की समस्या, मीटर खराब, या अन्य।'
                : svc === 'electricity'
                    ? 'Consumer Number दर्ज किया। शिकायत का प्रकार बोलें: बिजली नहीं है, वोल्टेज कम, बार-बार ट्रिप, बिल समस्या, मीटर खराब, या अन्य।'
                    : 'Consumer Number दर्ज किया। शिकायत का प्रकार बोलें: पानी नहीं, पाइप लीक, कचरा नहीं उठा, नाली भरी, बत्ती बंद, बिल समस्या, या अन्य।'

            // Step nav: page just loaded, user's first speech — try digits directly
            if (fs.step === 'nav') {
                const digits = extractNumbers(transcript)
                if (digits.length > 0) {
                    fillInput('consumerNo', digits)
                    flowStateRef.current = { step: 'comp_category', svc }
                    await sayAndListen(catPrompt)
                } else {
                    // Not digits — they said something else, prompt again
                    flowStateRef.current = { step: 'comp_consumer', svc }
                    await sayAndListen('कृपया अपना Consumer Number बोलें।')
                }
                return
            }

            // Step comp_consumer: waiting for consumer number
            if (fs.step === 'comp_consumer') {
                const digits = extractNumbers(transcript)
                if (digits.length > 0) {
                    fillInput('consumerNo', digits)
                    flowStateRef.current = { step: 'comp_category', svc: fs.svc || svc }
                    await sayAndListen(catPrompt)
                } else {
                    await sayAndListen('समझ नहीं आया। Consumer Number के अंक बोलें।')
                }
                return
            }

            if (fs.step === 'comp_category') {
                const cat = matchCategory(t, fs.svc)
                if (cat) {
                    fillSelect('category', cat)
                    flowStateRef.current = { step: 'comp_description', svc: fs.svc }
                    await sayAndListen(`"${cat}" चुना गया। अब अपनी शिकायत का विवरण बोलें।`)
                } else {
                    const catPrompt = fs.svc === 'gas'
                        ? 'कृपया बोलें: गैस नहीं आ रही, प्रेशर कम, गैस लीक, बिल, मीटर, या अन्य।'
                        : fs.svc === 'electricity'
                            ? 'कृपया बोलें: बिजली नहीं, वोल्टेज कम, ट्रिपिंग, बिल, मीटर, ट्रांसफार्मर, या अन्य।'
                            : 'कृपया बोलें: पानी नहीं, पाइप लीक, कचरा, नाली, बत्ती, बिल, या अन्य।'
                    await sayAndListen(catPrompt)
                }
                return
            }

            if (fs.step === 'comp_description') {
                if (transcript.trim().length >= 5) {
                    fillTextarea('description', transcript.trim())
                    flowStateRef.current = { step: 'comp_mobile', svc: fs.svc }
                    await sayAndListen('विवरण दर्ज किया गया। अब अपना 10 अंकों का मोबाइल नंबर बोलें।')
                } else {
                    await sayAndListen('कृपया अपनी समस्या का विवरण थोड़ा विस्तार से बोलें।')
                }
                return
            }

            if (fs.step === 'comp_mobile') {
                const mobile = extractMobile(transcript)
                if (mobile.length === 10) {
                    fillInput('mobile', mobile)
                    flowStateRef.current = { step: 'comp_submit', svc: fs.svc }
                    await sayAndListen(`मोबाइल नंबर ${mobile} दर्ज किया। शिकायत submit करने के लिए "हाँ" बोलें।`)
                } else {
                    await sayAndListen('10 अंकों का मोबाइल नंबर बोलें।')
                }
                return
            }

            if (fs.step === 'comp_submit') {
                const intent = matchNavIntent(t)
                if (intent?.intent === 'yes') {
                    clickButton('Submit Complaint')
                    flowStateRef.current = { step: 'nav', svc: null }
                    wantListeningRef.current = false
                    setAgentStatus('idle')
                    await speak('शिकायत submit हो रही है। OTP verification पर जा रहे हैं।', 'hi-IN')
                } else {
                    await sayAndListen('"हाँ" बोलें शिकायत submit करने के लिए।')
                }
                return
            }
        }

        // ── Bill payment page: fill consumer number first ─────────
        if ((path.includes('/bill')) && fs.step === 'nav') {
            flowStateRef.current = { step: 'consumer', field: 'consumerNumber' }
            await sayAndListen('आपका Consumer Number बोलें।')
            return
        }

        if (fs.step === 'consumer') {
            const digits = extractNumbers(transcript)
            if (digits.length > 0) {
                fillInput('consumerNumber', digits)
                flowStateRef.current = { step: 'mobile', field: 'mobileNumber' }
                await sayAndListen(`Consumer Number ${digits} दर्ज किया गया। अब अपना 10 अंकों का मोबाइल नंबर बोलें।`)
            } else {
                await sayAndListen('समझ नहीं आया। कृपया Consumer Number के अंक बोलें।')
            }
            return
        }

        if (fs.step === 'mobile') {
            const mobile = extractMobile(transcript)
            if (mobile.length === 10) {
                fillInput('mobileNumber', mobile)
                flowStateRef.current = { step: 'submit' }
                await sayAndListen(`मोबाइल नंबर ${mobile} दर्ज किया गया। बिल लाने के लिए "हाँ" बोलें।`)
            } else {
                await sayAndListen('10 अंकों का मोबाइल नंबर बोलें।')
            }
            return
        }

        if (fs.step === 'submit') {
            const intent = matchNavIntent(t)
            if (intent?.intent === 'yes') {
                clickButton('Fetch Bill')
                flowStateRef.current = { step: 'nav' }
                wantListeningRef.current = false
                setAgentStatus('idle')
                setStatusText('OTP verification पर जा रहे हैं।')
                await speak('बढ़िया! OTP verification पर जा रहे हैं।', 'hi-IN')
                return
            } else {
                await sayAndListen('बोलें — "हाँ" बिल लाने के लिए।')
                return
            }
        }

        // ── OTP pages: bill OTP and complaint OTP ────────────────
        const isOtpPage = path === '/otp-verification' || path === '/complaint-otp'
        const verifyBtnText = path === '/complaint-otp' ? 'Verify & Submit' : 'Verify'
        if (isOtpPage) {

            // If OTP already entered — waiting for confirm
            if (fs.step === 'otp_confirm') {
                const intent = matchNavIntent(t)
                if (intent?.intent === 'yes') {
                    clickButton(verifyBtnText)
                    flowStateRef.current = { step: 'nav' }
                    wantListeningRef.current = false
                    setAgentStatus('idle')
                    await speak('OTP सत्यापित हो रहा है।', 'hi-IN')
                } else {
                    await sayAndListen('"हाँ" बोलें Verify करने के लिए।')
                }
                return
            }

            // Enter OTP digits via keypad
            const digits = extractNumbers(transcript)
            if (digits.length === 6) {
                for (const digit of digits) {
                    const btns = document.querySelectorAll('button')
                    for (const btn of btns) {
                        const txt = btn.textContent?.trim()
                        if (txt === digit && !btn.disabled) { btn.click(); break }
                    }
                    await new Promise(r => setTimeout(r, 60))
                }
                flowStateRef.current = { step: 'otp_confirm' }
                await sayAndListen(`OTP ${digits} दर्ज किया। Verify करने के लिए "हाँ" बोलें।`)
            } else {
                await sayAndListen('6 अंकों का OTP बोलें।')
            }
            return
        }

        // ── Status tracking page ─────────────────────────────────
        if (path === '/status') {
            const digits = extractNumbers(transcript)
            if (digits.length === 10) {
                fillInput('mobile', digits)
                flowStateRef.current = { step: 'status_submit' }
                await sayAndListen(`मोबाइल नंबर ${digits} दर्ज किया। Status देखने के लिए "हाँ" बोलें।`)
            } else if (digits.length > 0) {
                fillInput('refId', transcript.trim())
                flowStateRef.current = { step: 'status_submit' }
                await sayAndListen('Reference ID दर्ज की गई। Status देखने के लिए "हाँ" बोलें।')
            } else {
                await sayAndListen('Reference ID या 10 अंकों का मोबाइल नंबर बोलें।')
            }
            return
        }

        if (fs.step === 'status_submit') {
            const intent = matchNavIntent(t)
            if (intent?.intent === 'yes') {
                clickButton('Track Status')
                flowStateRef.current = { step: 'nav' }
                wantListeningRef.current = false
                setAgentStatus('idle')
                await speak('Status खोजी जा रही है।', 'hi-IN')
            } else {
                await sayAndListen('"हाँ" बोलें Status देखने के लिए।')
            }
            return
        }

        // ── Bill details confirm ─────────────────────────────────
        if (path === '/bill-details') {
            const intent = matchNavIntent(t)
            if (intent?.intent === 'yes') {
                clickButton('Pay')
                wantListeningRef.current = false
                setAgentStatus('idle')
                await speak('भुगतान पेज पर जा रहे हैं।', 'hi-IN')
            } else {
                await sayAndListen('भुगतान करने के लिए "हाँ" बोलें।')
            }
            return
        }

        // ── Payment method ───────────────────────────────────────
        if (path === '/payment-method') {
            if (has(t, 'upi', 'यूपीआई', 'phonepe', 'gpay', 'paytm')) {
                clickButton('UPI')
            } else if (has(t, 'card', 'debit', 'कार्ड')) {
                clickButton('Card')
            } else if (has(t, 'cash', 'नकद', 'nakit')) {
                clickButton('Cash')
            } else {
                await sayAndListen('UPI, Card, या Cash बोलें।')
                return
            }
            wantListeningRef.current = false
            setAgentStatus('idle')
            await speak('भुगतान प्रक्रिया शुरू हो रही है।', 'hi-IN')
            return
        }

        // ── Context-aware: on service action page, no need to repeat service name ──
        // e.g. on /services/gas user says "bill bhugtan" → goes to /gas/bill directly
        const onGasService = path === '/services/gas'
        const onElecService = path === '/services/electricity'
        const onMuniService = path === '/services/municipal'

        const isBillWord = has(t,
            'bill', 'बिल', 'बील',
            'bhugtan', 'bhugtan', 'bhugtaan', 'bhugtan',
            'भुगतान', 'भुगतन', 'भुगतना', 'भुगत',
            'payment', 'pay', 'jama', 'जमा',
            'bharna', 'भरना', 'bharo', 'bharo',
            'bhar', 'भर', 'submit', 'jaama'
        )
        const isCompWord = has(t,
            'complaint', 'shikayat', 'shikaayat', 'shikait', 'shikayt',
            'शिकायत', 'शिकायत'.normalize('NFC'), 'शिकायत'.normalize('NFD'),
            'शिक़ायत',  // with nukta
            'problem', 'issue', 'darj', 'दर्ज',
            'pareshani', 'परेशानी', 'dikkat', 'दिक्कत',
            'taklif', 'तकलीफ', 'shika'
        )
        const isNewWord = has(t,
            'new', 'naya', 'नया', 'nayi', 'नयी',
            'connection', 'कनेक्शन', 'connect',
            'jodna', 'जोड़ना', 'jodo', 'jod'
        )
        const isStatWord = has(t, 'status', 'track', 'स्टेटस', 'pata', 'पता', 'dekhna', 'देखना', 'check', 'jaankari')

        console.log('🗺️ path:', path, '| onGas:', onGasService, '| bill:', isBillWord, '| comp:', isCompWord, '| new:', isNewWord)

        if (onGasService) {
            if (isBillWord) { flowStateRef.current = { step: 'nav' }; await speak('गैस बिल भुगतान पर जा रहे हैं।', 'hi-IN'); navigate('/gas/bill'); return }
            if (isCompWord) { flowStateRef.current = { step: 'nav' }; await speak('गैस शिकायत पर जा रहे हैं।', 'hi-IN'); navigate('/gas/complaint'); return }
            if (isNewWord) { flowStateRef.current = { step: 'nav' }; await speak('गैस नया कनेक्शन पर जा रहे हैं।', 'hi-IN'); navigate('/gas/new-connection'); return }
            if (isStatWord) { flowStateRef.current = { step: 'nav' }; await speak('Status tracking पर जा रहे हैं।', 'hi-IN'); navigate('/status'); return }
        }
        if (onElecService) {
            if (isBillWord) { flowStateRef.current = { step: 'nav' }; await speak('बिजली बिल भुगतान पर जा रहे हैं।', 'hi-IN'); navigate('/electricity/bill'); return }
            if (isCompWord) { flowStateRef.current = { step: 'nav' }; await speak('बिजली शिकायत पर जा रहे हैं।', 'hi-IN'); navigate('/electricity/complaint'); return }
            if (isNewWord) { flowStateRef.current = { step: 'nav' }; await speak('बिजली नया कनेक्शन पर जा रहे हैं।', 'hi-IN'); navigate('/electricity/new-connection'); return }
            if (isStatWord) { flowStateRef.current = { step: 'nav' }; await speak('Status tracking पर जा रहे हैं।', 'hi-IN'); navigate('/status'); return }
        }
        if (onMuniService) {
            if (isBillWord) { flowStateRef.current = { step: 'nav' }; await speak('नगर पालिका बिल पर जा रहे हैं।', 'hi-IN'); navigate('/services/municipal'); return }
            if (isCompWord) { flowStateRef.current = { step: 'nav' }; await speak('नगर पालिका शिकायत पर जा रहे हैं।', 'hi-IN'); navigate('/services/municipal'); return }
            if (isStatWord) { flowStateRef.current = { step: 'nav' }; await speak('Status tracking पर जा रहे हैं।', 'hi-IN'); navigate('/status'); return }
        }

        // Also handle generic /services page: if user says bill/complaint without service, ask which
        if (path === '/services') {
            if ((isBillWord || isCompWord || isNewWord) && !has(t, 'gas', 'गैस', 'bijli', 'बिजली', 'nagar', 'नगर')) {
                await sayAndListen('कौन सी सेवा के लिए? गैस बोलें या बिजली बोलें।')
                return
            }
        }

        // ── Navigation intent (works on any page) ────────────────

        const navResult = matchNavIntent(t)
        if (navResult?.route) {
            flowStateRef.current = { step: 'nav', field: null }
            const confirmText = {
                '/gas/bill': 'गैस बिल भुगतान पर जा रहे हैं।',
                '/electricity/bill': 'बिजली बिल भुगतान पर जा रहे हैं।',
                '/gas/complaint': 'गैस शिकायत पर जा रहे हैं।',
                '/electricity/complaint': 'बिजली शिकायत पर जा रहे हैं।',
                '/gas/new-connection': 'गैस नया कनेक्शन पर जा रहे हैं।',
                '/electricity/new-connection': 'बिजली नया कनेक्शन पर जा रहे हैं।',
                '/services/gas': 'गैस सेवाएं खुल रही हैं।',
                '/services/electricity': 'बिजली सेवाएं खुल रही हैं।',
                '/services/municipal': 'नगर पालिका सेवाएं खुल रही हैं।',
                '/status': 'Status tracking पर जा रहे हैं।',
                '/language': 'मुख्य मेनू पर वापस जा रहे हैं।',
            }[navResult.route] || 'जा रहे हैं।'
            setAgentStatus('speaking')
            await speak(confirmText, 'hi-IN')
            navigate(navResult.route)
            // After navigation, speak the page prompt
            setTimeout(async () => {
                const prompt = PAGE_PROMPTS[navResult.route] || 'बोलें — क्या मदद चाहिए?'
                if (wantListeningRef.current) await sayAndListen(prompt)
            }, 800)
            return
        }

        // ── Fallback ─────────────────────────────────────────────
        await sayAndListen('माफ़ करें, समझ नहीं आया। कृपया दोबारा बोलें।')
    }, [speak, navigate, sayAndListen])

    const { isListening, isProcessing, startListening, stopListening } = useSarvamSTT({
        language: 'hi-IN',
        onResult: handleUserInput,
        onEnd: handleRecognitionEnd,
        onError: (e) => { console.warn('STT:', e); if (wantListeningRef.current) startListeningRef.current?.() },
    })

    useEffect(() => { startListeningRef.current = startListening }, [startListening])

    // When route changes, if agent is active → speak new page prompt
    const prevPathRef = useRef(location.pathname)
    useEffect(() => {
        if (location.pathname !== prevPathRef.current && isActive) {
            prevPathRef.current = location.pathname
            flowStateRef.current = { step: 'nav', field: null }
            const prompt = PAGE_PROMPTS[location.pathname] || 'बोलें — क्या मदद चाहिए?'
            wantListeningRef.current = true
            setTimeout(() => sayAndListen(prompt), 600)
        }
    }, [location.pathname, isActive, sayAndListen])

    // ── Public API ───────────────────────────────────────────────────────────
    const startSession = useCallback(async () => {
        setIsActive(true)
        flowStateRef.current = { step: 'nav', field: null }
        const prompt = PAGE_PROMPTS[location.pathname] || PAGE_PROMPTS['/language']
        wantListeningRef.current = true
        await sayAndListen(prompt)
    }, [location.pathname, sayAndListen])

    const stopSession = useCallback(() => {
        wantListeningRef.current = false
        stopSpeaking()
        stopListening()
        setIsActive(false)
        setAgentStatus('idle')
        setStatusText('')
        flowStateRef.current = { step: 'nav', field: null }
    }, [stopSpeaking, stopListening])

    const effectiveStatus = isProcessing ? 'thinking' : isListening ? 'listening' : agentStatus

    return (
        <VoiceFlowCtx.Provider value={{ isActive, agentStatus: effectiveStatus, statusText, startSession, stopSession }}>
            {children}
        </VoiceFlowCtx.Provider>
    )
}
