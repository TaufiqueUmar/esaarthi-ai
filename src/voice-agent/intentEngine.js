/**
 * intentEngine.js — Rule-based NLU for Hindi, English, and Hinglish
 * No external API required — pure keyword/pattern matching
 */

import { dialogFlows } from '../data/dialogFlows.js';

// Normalise input for matching
function normalise(text) {
    return text
        .toLowerCase()
        .replace(/[।,.!?;:]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Special intents (not flows)
const specialIntents = {
    greet: {
        hi: ['नमस्ते', 'हेलो', 'हाय', 'नमस्कार', 'प्रणाम'],
        en: ['hello', 'hi', 'namaste', 'hey', 'good morning', 'good evening'],
    },
    home: {
        hi: ['मुख्य', 'मेनू', 'वापस', 'होम', 'शुरू', 'मुख्य मेनू'],
        en: ['home', 'main menu', 'go back', 'start over', 'restart', 'back'],
    },
    yes: {
        hi: ['हाँ', 'हां', 'हा', 'जी', 'जी हाँ', 'हाँ जी', 'ठीक है', 'बिल्कुल'],
        en: ['yes', 'yeah', 'yep', 'ok', 'okay', 'sure', 'correct', 'right'],
    },
    no: {
        hi: ['नहीं', 'नही', 'ना', 'नहीं जी', 'मत करो'],
        en: ['no', 'nope', 'nah', 'cancel', 'not now', 'stop'],
    },
    repeat: {
        hi: ['दोबारा', 'फिर', 'दोहराओ', 'समझ नहीं', 'क्या बोला'],
        en: ['repeat', 'say again', 'what', 'did not understand', 'again'],
    },
    help: {
        hi: ['मदद', 'सहायता', 'क्या क्या', 'कैसे', 'बताओ'],
        en: ['help', 'what can you do', 'options', 'services'],
    },
};

/**
 * detectIntent(transcript, language) → { intent, flowId, confidence, type }
 * type: 'flow' | 'special' | 'unknown'
 * confidence: 0–1
 */
export function detectIntent(transcript, language = 'hi') {
    const norm = normalise(transcript);

    // 1. Check special intents first
    for (const [intent, keywords] of Object.entries(specialIntents)) {
        const words = keywords[language] || keywords.en;
        for (const kw of words) {
            if (norm.includes(kw.toLowerCase())) {
                return { intent, flowId: null, type: 'special', confidence: 0.9 };
            }
        }
    }

    // Also check cross-language specials (Hinglish)
    for (const [intent, keywords] of Object.entries(specialIntents)) {
        for (const lang of ['hi', 'en']) {
            const words = keywords[lang] || [];
            for (const kw of words) {
                if (norm.includes(kw.toLowerCase())) {
                    return { intent, flowId: null, type: 'special', confidence: 0.85 };
                }
            }
        }
    }

    // 2. Score each dialog flow
    const scores = [];
    for (const [flowId, flow] of Object.entries(dialogFlows)) {
        let score = 0;
        const primaryKw = flow.keywords[language] || [];
        const secondaryKw = flow.keywords[language === 'hi' ? 'en' : 'hi'] || [];

        for (const kw of primaryKw) {
            if (norm.includes(kw.toLowerCase())) {
                score += kw.split(' ').length + 1; // multi-word → higher weight
            }
        }
        for (const kw of secondaryKw) {
            if (norm.includes(kw.toLowerCase())) {
                score += 1; // cross-language match, lower weight
            }
        }

        if (score > 0) scores.push({ flowId, score });
    }

    if (scores.length === 0) {
        return { intent: 'unknown', flowId: null, type: 'unknown', confidence: 0 };
    }

    scores.sort((a, b) => b.score - a.score);
    const best = scores[0];
    const maxPossible = 10; // rough normaliser
    const confidence = Math.min(best.score / maxPossible, 1);

    return {
        intent: best.flowId,
        flowId: best.flowId,
        type: 'flow',
        confidence,
    };
}

/**
 * detectDepartment(transcript, language) → DEPARTMENT id | null
 */
export function detectDepartment(transcript, language = 'hi') {
    const norm = normalise(transcript);
    const deptKeywords = {
        gas: {
            hi: ['गैस', 'सिलेंडर', 'एलपीजी', 'पीएनजी', 'सीएनजी', 'उज्ज्वला'],
            en: ['gas', 'cylinder', 'lpg', 'png', 'cng', 'ujjwala'],
        },
        electricity: {
            hi: ['बिजली', 'लाइट', 'करंट', 'इलेक्ट्रिक', 'मीटर', 'विद्युत'],
            en: ['electricity', 'electric', 'power', 'light', 'meter', 'bijli'],
        },
        municipal: {
            hi: ['पानी', 'नगर', 'सफाई', 'कचरा', 'पालिका', 'म्युनिसिपल'],
            en: ['water', 'municipal', 'sanitation', 'garbage', 'waste', 'paani'],
        },
    };

    for (const [dept, kwMap] of Object.entries(deptKeywords)) {
        const kws = [...(kwMap[language] || []), ...(kwMap[language === 'hi' ? 'en' : 'hi'] || [])];
        for (const kw of kws) {
            if (norm.includes(kw.toLowerCase())) return dept;
        }
    }
    return null;
}

/**
 * parseConfirmation(transcript, language) → 'yes' | 'no' | null
 */
export function parseConfirmation(transcript, language = 'hi') {
    const result = detectIntent(transcript, language);
    if (result.type === 'special' && result.intent === 'yes') return 'yes';
    if (result.type === 'special' && result.intent === 'no') return 'no';
    return null;
}
