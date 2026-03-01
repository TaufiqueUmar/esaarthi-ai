/**
 * useSarvamSTT.js — Sarvam AI Saaras v3 Speech-to-Text
 *
 * Records mic audio as 16-bit PCM WAV (via AudioContext) — WAV is
 * universally accepted by Sarvam with no format parsing issues.
 *
 * Flow:
 *   startListening() → AudioContext ScriptProcessor captures PCM samples
 *   Silence detection → auto-stop after 1.8s quiet
 *   Encodes PCM samples → WAV blob → POST to Sarvam REST → onResult(text)
 */

import { useRef, useState, useCallback } from 'react';

const SARVAM_STT_URL = 'https://api.sarvam.ai/speech-to-text';
const SAMPLE_RATE = 16000;          // 16kHz — Sarvam's preferred rate
const SILENCE_TIMEOUT_MS = 2500;
const MIN_RECORD_MS = 500;
const MAX_RECORD_MS = 25000;

// ── WAV encoder ────────────────────────────────────────────────────────────
function encodeWAV(samples, sampleRate) {
    const numSamples = samples.length;
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    function writeStr(offset, str) {
        for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }
    function writeU16(offset, val) { view.setUint16(offset, val, true); }
    function writeU32(offset, val) { view.setUint32(offset, val, true); }

    writeStr(0, 'RIFF');
    writeU32(4, 36 + numSamples * 2);     // file size
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    writeU32(16, 16);                      // chunk size
    writeU16(20, 1);                       // PCM format
    writeU16(22, 1);                       // mono
    writeU32(24, sampleRate);
    writeU32(28, sampleRate * 2);          // byte rate (16-bit mono)
    writeU16(32, 2);                       // block align
    writeU16(34, 16);                      // bits per sample
    writeStr(36, 'data');
    writeU32(40, numSamples * 2);

    // Convert Float32 [-1, 1] → Int16
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
    }
    return new Blob([buffer], { type: 'audio/wav' });
}
// ───────────────────────────────────────────────────────────────────────────

export function useSarvamSTT({ language = 'hi-IN', onResult, onError, onEnd }) {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');

    const audioCtxRef = useRef(null);
    const processorRef = useRef(null);
    const streamRef = useRef(null);
    const samplesRef = useRef([]);
    const silenceTimerRef = useRef(null);
    const maxTimerRef = useRef(null);
    const animFrameRef = useRef(null);
    const startTimeRef = useRef(0);
    const wantListeningRef = useRef(false);
    const isSendingRef = useRef(false);   // prevent double-send

    const apiKey = import.meta.env.VITE_SARVAM_API_KEY;

    const stopCapture = useCallback(() => {
        clearTimeout(silenceTimerRef.current);
        clearTimeout(maxTimerRef.current);
        cancelAnimationFrame(animFrameRef.current);

        try { processorRef.current?.disconnect(); } catch (_) { }
        try { audioCtxRef.current?.close(); } catch (_) { }
        streamRef.current?.getTracks().forEach(t => t.stop());

        processorRef.current = null;
        audioCtxRef.current = null;
        streamRef.current = null;
    }, []);

    const sendToSarvam = useCallback(async (wavBlob) => {
        if (isSendingRef.current) return;
        isSendingRef.current = true;
        setIsProcessing(true);

        try {
            const langCode = language === 'hi-IN' ? 'hi-IN' : 'en-IN';
            const formData = new FormData();
            formData.append('file', wavBlob, 'audio.wav');  // WAV — universally accepted
            formData.append('model', 'saaras:v3');
            formData.append('mode', 'transcribe');
            formData.append('language_code', langCode);

            const res = await fetch(SARVAM_STT_URL, {
                method: 'POST',
                headers: { 'api-subscription-key': apiKey },
                body: formData,
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Sarvam STT ${res.status}: ${errText}`);
            }

            const data = await res.json();
            const text = (data.transcript || data.text || '').trim();
            if (text) {
                setTranscript(text);
                onResult?.(text);
            } else {
                onEnd?.();
            }
        } catch (err) {
            console.error('Sarvam STT failed:', err);
            onError?.(err.message);
            onEnd?.();
        } finally {
            setIsProcessing(false);
            isSendingRef.current = false;
        }
    }, [language, apiKey, onResult, onError, onEnd]);

    const stopAndSubmit = useCallback(() => {
        clearTimeout(silenceTimerRef.current);
        clearTimeout(maxTimerRef.current);
        cancelAnimationFrame(animFrameRef.current);

        const allSamples = samplesRef.current;
        samplesRef.current = [];

        // Disconnect audio nodes
        try { processorRef.current?.disconnect(); } catch (_) { }
        try { audioCtxRef.current?.close(); } catch (_) { }
        streamRef.current?.getTracks().forEach(t => t.stop());
        processorRef.current = null;
        audioCtxRef.current = null;
        streamRef.current = null;

        setIsListening(false);

        const elapsed = Date.now() - startTimeRef.current;
        if (allSamples.length === 0 || elapsed < MIN_RECORD_MS) {
            onEnd?.();
            return;
        }

        // Concatenate all PCM chunks
        const totalLen = allSamples.reduce((n, c) => n + c.length, 0);
        const merged = new Float32Array(totalLen);
        let offset = 0;
        for (const chunk of allSamples) {
            merged.set(chunk, offset);
            offset += chunk.length;
        }

        const wavBlob = encodeWAV(merged, SAMPLE_RATE);
        sendToSarvam(wavBlob);
    }, [sendToSarvam, onEnd]);

    const startListening = useCallback(async () => {
        if (isListening || isProcessing || isSendingRef.current) return;
        if (!apiKey) { console.error('VITE_SARVAM_API_KEY not set'); return; }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { sampleRate: SAMPLE_RATE, channelCount: 1, echoCancellation: true }
            });
            streamRef.current = stream;
            samplesRef.current = [];
            wantListeningRef.current = true;
            startTimeRef.current = Date.now();

            // Create AudioContext at 16kHz for Sarvam
            const ctx = new AudioContext({ sampleRate: SAMPLE_RATE });
            audioCtxRef.current = ctx;

            const source = ctx.createMediaStreamSource(stream);

            // ScriptProcessor captures raw PCM (deprecated but widely supported)
            const processor = ctx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            let lastSoundTime = Date.now();

            processor.onaudioprocess = (e) => {
                if (!wantListeningRef.current) return;
                const data = e.inputBuffer.getChannelData(0);
                samplesRef.current.push(new Float32Array(data));

                const rms = Math.sqrt(data.reduce((s, v) => s + v * v, 0) / data.length);
                if (rms > 0.006) lastSoundTime = Date.now(); // 0.006: avoids fan/AC noise false triggers

                if (Date.now() - lastSoundTime > SILENCE_TIMEOUT_MS) {
                    wantListeningRef.current = false;
                    stopAndSubmit();
                }
            };

            source.connect(processor);
            processor.connect(ctx.destination);

            setIsListening(true);

            // Hard cap
            maxTimerRef.current = setTimeout(() => {
                wantListeningRef.current = false;
                stopAndSubmit();
            }, MAX_RECORD_MS);

        } catch (err) {
            console.error('Mic access error:', err);
            onError?.(err.message);
        }
    }, [isListening, isProcessing, apiKey, stopAndSubmit, onError]);

    const stopListening = useCallback(() => {
        wantListeningRef.current = false;
        stopCapture();
        setIsListening(false);
    }, [stopCapture]);

    const abortListening = useCallback(() => {
        wantListeningRef.current = false;
        isSendingRef.current = false;
        samplesRef.current = [];
        stopCapture();
        setIsListening(false);
        setIsProcessing(false);
    }, [stopCapture]);

    return {
        isSupported: typeof navigator !== 'undefined' && !!navigator.mediaDevices,
        isListening,
        isProcessing,
        transcript,
        startListening,
        stopListening,
        abortListening,
    };
}
