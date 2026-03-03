/**
 * useLLMBrain.js — Groq (llama-3.3-70b) powered NLU + Dialog Brain for eSaarthi
 *
 * Replaces intentEngine.js + dialogManager.js
 * Uses Groq's OpenAI-compatible API — ultra-fast LPU inference
 *
 * Flow per turn:
 *   user transcript + current page + conversation history
 *   → Groq llama-3.3-70b-versatile (JSON mode)
 *   → { speak, action, field, value, navigate, done, resetHistory }
 *   → caller executes action + speaks response
 */

import { useRef, useCallback } from 'react';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // Best Hindi + reasoning on Groq free tier

// ── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are eSaarthi, a helpful Hindi voice assistant at a government KIOSK in India.
You help citizens with gas, electricity, and municipal (water/sanitation) services.

LANGUAGE RULES:
- Always respond in Hindi (Devanagari script) — even if user speaks English or Hinglish
- Be concise — max 2 short sentences in "speak"
- Be warm and respectful — use "आप" not "तुम"

AVAILABLE SERVICES & ROUTES:
- Gas bill payment → navigate: /gas/bill
- Gas complaint → navigate: /gas/complaint
- Gas new connection → navigate: /gas/new-connection
- Electricity bill payment → navigate: /electricity/bill
- Electricity complaint → navigate: /electricity/complaint
- Electricity new connection → navigate: /electricity/new-connection
- Municipal / water services → navigate: /services/municipal
- Status tracking → navigate: /status
- Home / main menu → navigate: /language

FORM FIELD IDs (use exact spelling):
- consumerNumber  (bill payment pages)
- consumerNo      (complaint pages)
- mobileNumber    (bill payment pages)
- mobile          (complaint & status pages)
- category        (complaint category dropdown — use fill_select)
- description     (complaint description textarea — use fill_textarea)
- refId           (status tracking reference ID)

COMPLAINT CATEGORIES (exact values for fill_select on #category):
  Gas:         "No Supply" | "Low Pressure" | "Gas Leakage" | "Billing Issue" | "Meter Defect" | "Other"
  Electricity: "No Supply" | "Low Voltage" | "Frequent Tripping" | "Billing Issue" | "Meter Defect" | "Transformer Fault" | "Other"
  Municipal:   "No Water Supply" | "Pipe Leakage" | "Garbage Not Collected" | "Sewer Overflow" | "Street Light Issue" | "Billing Issue" | "Other"

BUTTON TEXTS (use exact text in "value" for click_button):
  "Fetch Bill" | "Submit Complaint" | "Verify" | "Verify & Submit" | "Track Status" | "Pay" | "UPI" | "Card" | "Cash"

ACTIONS YOU CAN TAKE (set "action" field):
  "navigate"      — go to a new page (set "navigate" to the route)
  "fill_input"    — fill a text input (set "field" to ID, "value" to content)
  "fill_select"   — fill a dropdown (set "field" to ID, "value" to option)
  "fill_textarea" — fill a textarea (set "field" to ID, "value" to content)
  "click_button"  — click a button (set "value" to button text)
  "none"          — just speak, no DOM action

DIGIT EXTRACTION RULES:
- Convert spoken Hindi number words to digits: एक=1, दो=2, तीन=3, चार=4, पाँच=5, छह=6, सात=7, आठ=8, नौ=9, शून्य=0
- Consumer numbers: typically 5–12 digits
- Mobile numbers: exactly 10 digits starting with 6–9
- OTP: exactly 6 digits

IMPORTANT:
- Return ONLY valid JSON — no markdown, no explanation, no extra text, no code fences
- If you don't understand, set action to "none" and ask the user to repeat
- If user says "वापस", "होम", "cancel", "रद्द" → navigate to /language and set resetHistory: true
- If user says "दोबारा", "फिर बोलो", "repeat" → set action "none" and re-speak the last question

JSON SCHEMA (return exactly this structure, all fields required):
{
  "speak": "Hindi text to speak aloud to the user",
  "action": "navigate|fill_input|fill_select|fill_textarea|click_button|none",
  "field": "fieldId or null",
  "value": "value to fill / button text or null",
  "navigate": "/route or null",
  "done": false,
  "resetHistory": false
}`;

// ── Page context descriptions ─────────────────────────────────────────────────
function getPageContext(path) {
    const map = {
        '/language': 'Home screen. Ask what service they need.',
        '/services': 'Service selection. Ask: Gas, Electricity, or Municipal?',
        '/services/gas': 'Gas services menu. Ask: Bill payment, new connection, or complaint?',
        '/services/electricity': 'Electricity services menu. Ask: Bill payment, new connection, or complaint?',
        '/services/municipal': 'Municipal services menu. Ask: Water bill, complaint, or sanitation?',
        '/gas/bill': 'Gas bill form. Collect: consumerNumber, mobileNumber. Button: "Fetch Bill".',
        '/electricity/bill': 'Electricity bill form. Collect: consumerNumber, mobileNumber. Button: "Fetch Bill".',
        '/otp-verification': 'OTP page. Collect 6-digit OTP. Button: "Verify".',
        '/complaint-otp': 'Complaint OTP page. Collect 6-digit OTP. Button: "Verify & Submit".',
        '/bill-details': 'Bill details shown. Ask user to confirm with "हाँ". Button: "Pay".',
        '/payment-method': 'Payment method page. Options: UPI, Card, Cash.',
        '/payment-success': 'Payment successful. Congratulate user. Offer to go home.',
        '/status': 'Status tracking. Collect: mobile or refId. Button: "Track Status".',
        '/status-result': 'Status is shown. Offer to go home.',
        '/complaint-success': 'Complaint registered. Tell user to note Reference Number. Offer to go home.',
        '/gas/complaint': 'Gas complaint form. Collect: consumerNo, category, description, mobile. Button: "Submit Complaint".',
        '/electricity/complaint': 'Electricity complaint form. Collect: consumerNo, category, description, mobile. Button: "Submit Complaint".',
    };
    for (const [key, val] of Object.entries(map)) {
        if (path === key) return val;
    }
    if (path.includes('/new-connection')) return 'New connection form. Guide user to fill required fields.';
    return 'KIOSK page. Ask the user what service they need.';
}

// ── Fallback on error ─────────────────────────────────────────────────────────
function fallbackResponse(reason = '') {
    console.warn('useLLMBrain fallback:', reason);
    return {
        speak: 'माफ़ करें, कुछ तकनीकी समस्या हुई। कृपया दोबारा बोलें।',
        action: 'none',
        field: null,
        value: null,
        navigate: null,
        done: false,
        resetHistory: false,
    };
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useLLMBrain() {
    // OpenAI-format message history: { role: 'user'|'assistant', content: string }[]
    const historyRef = useRef([]);
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    /**
     * process(transcript, currentPath) → response object
     */
    const process = useCallback(async (transcript, currentPath) => {
        if (!apiKey) {
            console.error('VITE_GROQ_API_KEY not set in .env');
            return fallbackResponse('No API key');
        }

        const pageCtx = getPageContext(currentPath);

        const userContent = `[Current page: ${currentPath}]
[Page context: ${pageCtx}]
User said: "${transcript}"`;

        // Append user turn
        historyRef.current.push({ role: 'user', content: userContent });

        // Build Groq request (OpenAI chat completions format)
        const requestBody = {
            model: GROQ_MODEL,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...historyRef.current,
            ],
            temperature: 0.2,
            max_tokens: 300,
            response_format: { type: 'json_object' }, // guaranteed valid JSON
        };

        try {
            const res = await fetch(GROQ_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error('Groq API error:', res.status, errText);
                historyRef.current.pop();
                return fallbackResponse(`HTTP ${res.status}`);
            }

            const data = await res.json();
            const rawText = data?.choices?.[0]?.message?.content || '';

            let parsed;
            try {
                parsed = JSON.parse(rawText);
            } catch {
                console.error('Groq JSON parse failed:', rawText);
                historyRef.current.pop();
                return fallbackResponse('JSON parse error');
            }

            const response = {
                speak: parsed.speak ?? 'माफ़ करें, समझ नहीं आया।',
                action: parsed.action ?? 'none',
                field: parsed.field ?? null,
                value: parsed.value ?? null,
                navigate: parsed.navigate ?? null,
                done: parsed.done ?? false,
                resetHistory: parsed.resetHistory ?? false,
            };

            console.log('🤖 Groq:', response);

            // Append assistant turn to history
            historyRef.current.push({ role: 'assistant', content: JSON.stringify(response) });

            // Reset history on home navigation
            if (response.resetHistory) {
                historyRef.current = [];
            }

            // Cap history at 40 messages (20 turns) to avoid token bloat
            if (historyRef.current.length > 40) {
                historyRef.current = historyRef.current.slice(-40);
            }

            return response;

        } catch (err) {
            console.error('Groq fetch failed:', err);
            historyRef.current.pop();
            return fallbackResponse(err.message);
        }
    }, [apiKey]);

    const resetHistory = useCallback(() => {
        historyRef.current = [];
    }, []);

    return { process, resetHistory };
}
