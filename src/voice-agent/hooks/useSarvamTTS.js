/**
 * useSarvamTTS.js — Sarvam AI Bulbul v3 Text-to-Speech
 *
 * POST text → Sarvam → get WAV base64 audio → decode & play via AudioContext
 */

import { useRef, useState, useCallback } from 'react';

const SARVAM_TTS_URL = 'https://api.sarvam.ai/text-to-speech';

// Valid Bulbul v3 speakers (confirmed from API)
// Hindi female: priya, neha, kavya, ishita, shreya, ritu, suhani, rupali
// Hindi male:   aditya, rahul, rohan, amit, shubh, ashutosh
// English:      amelia, sophia
const HINDI_SPEAKER = 'shubh';
const ENGLISH_SPEAKER = 'amelia';

// Max chars per TTS call (Sarvam limit ~500 chars per request)
const MAX_CHARS = 490;

export function useSarvamTTS({ language = 'hi-IN' }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioCtxRef = useRef(null);
    const currentSourceRef = useRef(null);

    const apiKey = import.meta.env.VITE_SARVAM_API_KEY;

    // Decode base64 WAV → AudioBuffer and play it
    const playBase64Audio = useCallback((base64Audio) => {
        return new Promise((resolve) => {
            try {
                if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
                    audioCtxRef.current = new AudioContext();
                }
                const ctx = audioCtxRef.current;

                const binary = atob(base64Audio);
                const buffer = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) {
                    buffer[i] = binary.charCodeAt(i);
                }

                ctx.decodeAudioData(buffer.buffer, (decoded) => {
                    // Stop whatever is playing
                    currentSourceRef.current?.stop();

                    const source = ctx.createBufferSource();
                    source.buffer = decoded;
                    source.connect(ctx.destination);
                    source.onended = () => {
                        setIsSpeaking(false);
                        resolve();
                    };
                    currentSourceRef.current = source;
                    source.start(0);
                    setIsSpeaking(true);
                }, (err) => {
                    console.error('Audio decode error:', err);
                    setIsSpeaking(false);
                    resolve();
                });
            } catch (err) {
                console.error('AudioContext error:', err);
                setIsSpeaking(false);
                resolve();
            }
        });
    }, []);

    // Split long text into max-char chunks at sentence boundaries
    const splitText = (text, maxLen) => {
        if (text.length <= maxLen) return [text];
        const chunks = [];
        let start = 0;
        while (start < text.length) {
            let end = Math.min(start + maxLen, text.length);
            // Try to break at sentence boundary: ।, ., !, ?
            if (end < text.length) {
                const boundary = text.lastIndexOf('।', end) || text.lastIndexOf('.', end);
                if (boundary > start) end = boundary + 1;
            }
            chunks.push(text.slice(start, end).trim());
            start = end;
        }
        return chunks.filter(Boolean);
    };

    const speak = useCallback(async (text, overrideLang) => {
        if (!text?.trim()) return;
        if (!apiKey) {
            console.error('VITE_SARVAM_API_KEY not set');
            return;
        }

        const lang = overrideLang || language;
        const langCode = lang === 'hi-IN' || lang === 'hi' ? 'hi-IN' : 'en-IN';
        const speaker = langCode === 'hi-IN' ? HINDI_SPEAKER : ENGLISH_SPEAKER;

        const chunks = splitText(text, MAX_CHARS);

        setIsSpeaking(true);
        for (const chunk of chunks) {
            let lastErr = null;
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    if (attempt > 0) await new Promise(r => setTimeout(r, 800 * attempt));
                    const res = await fetch(SARVAM_TTS_URL, {
                        method: 'POST',
                        headers: {
                            'api-subscription-key': apiKey,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            inputs: [chunk],
                            target_language_code: langCode,
                            speaker,
                            model: 'bulbul:v3',
                            pace: 1.0,
                            enable_preprocessing: true,
                        }),
                    });

                    if (!res.ok) {
                        const err = await res.text();
                        throw new Error(`Sarvam TTS error ${res.status}: ${err}`);
                    }

                    const data = await res.json();
                    const base64 = data.audios?.[0];
                    if (base64) await playBase64Audio(base64);
                    lastErr = null;
                    break; // success — move to next chunk
                } catch (err) {
                    lastErr = err;
                    const isNetwork = err.message?.includes('fetch') || err.message?.includes('network');
                    if (!isNetwork) break; // don't retry API errors (bad params etc)
                    console.warn(`TTS attempt ${attempt + 1} failed, retrying...`, err.message);
                }
            }
            if (lastErr) {
                console.error('Sarvam TTS failed:', lastErr);
                setIsSpeaking(false);
                break;
            }
        }
        setIsSpeaking(false);
    }, [language, apiKey, playBase64Audio]);

    const stop = useCallback(() => {
        currentSourceRef.current?.stop();
        setIsSpeaking(false);
    }, []);

    return { isSpeaking, speak, stop };
}
