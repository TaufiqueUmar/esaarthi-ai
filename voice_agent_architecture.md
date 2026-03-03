# eSaarthi Voice Agent — Architecture & Full Flow

## Overview

The eSaarthi voice agent is a **fully client-side, Hindi-first voice assistant** embedded in the KIOSK application. It enables citizens to navigate pages and fill forms entirely by speaking — with no cloud AI/LLM dependency. The pipeline is:

**Mic Audio → Sarvam STT → Rule-based NLU → Dialog State Machine → Sarvam TTS + DOM Action**

---

## System Architecture

```mermaid
graph TB
    subgraph Browser["🖥️ Browser / React App"]
        subgraph App["App.jsx (BrowserRouter)"]
            VFP["VoiceFlowProvider\n(VoiceFlowAgent.jsx)\n— Global Context —"]
            subgraph Pages["Kiosk Pages (React Router)"]
                PG1["/language\nLanguage.jsx"]
                PG2["/services\nServices.jsx"]
                PG3["/gas/bill\nBillPaymentEntry"]
                PG4["/electricity/bill\nBillPaymentEntry"]
                PG5["/:service/complaint\nComplaintForm"]
                PG6["/otp-verification\nOTPVerification"]
                PG7["/complaint-otp\nComplaintOTP"]
                PG8["/bill-details\nBillDetails"]
                PG9["/payment-method\nPaymentMethod"]
                PG10["/status\nStatusTracking"]
            end
        end

        subgraph VoiceLayer["Voice Layer (src/voice-agent/)"]
            STT["useSarvamSTT.js\n— Mic capture, WAV encoder\n— Silence detection\n— POST to Sarvam API"]
            TTS["useSarvamTTS.js\n— POST text to Sarvam\n— Decode base64 WAV\n— Play via AudioContext"]
            NLU["intentEngine.js\n— Rule-based NLU\n— Hindi + English + Hinglish\n— Keyword/pattern scoring"]
            DM["dialogManager.js\n— Conversation state machine\n— greeting|flow_active|done\n— Template filling"]
            VN["useVoiceNav.js\n— Simple page navigator\n— Route resolver\n— Used on Language.jsx only"]
        end

        DOM["DOM Manipulation\n— fillInput(id, value)\n— fillTextarea(id, value)\n— fillSelect(id, value)\n— clickButton(text)"]
    end

    subgraph SarvamCloud["☁️ Sarvam AI Cloud"]
        STTAPI["Speech-to-Text API\nModel: saaras:v3\nPOST /speech-to-text\nLanguage: hi-IN / en-IN"]
        TTSAPI["Text-to-Speech API\nModel: bulbul:v3\nPOST /text-to-speech\nSpeaker: shubh (Hindi)"]
    end

    subgraph Data["src/data/"]
        DF["dialogFlows.js\n— Flow definitions\n— Keywords per language\n— Step sequences"]
    end

    %% Connections
    VFP -->|"mounts & provides context"| Pages
    VFP -->|"uses"| STT
    VFP -->|"uses"| TTS
    VFP -->|"uses"| NLU
    VFP -->|"DOM injection"| DOM
    DOM -->|"fills fields in"| Pages

    NLU -->|"reads"| DF
    DM -->|"reads"| DF
    DM -->|"uses"| NLU

    STT -->|"WAV audio upload"| STTAPI
    STTAPI -->|"transcript JSON"| STT
    TTS -->|"text + lang"| TTSAPI
    TTSAPI -->|"base64 WAV audio"| TTS

    VN -->|"uses"| STT
    VN -->|"uses"| TTS
```

---

## Component Breakdown

| File | Role |
|------|------|
| [VoiceFlowAgent.jsx](file:///c:/Users/taufi/Desktop/esaarthi-ai/src/voice-agent/VoiceFlowAgent.jsx) | Root provider. Orchestrates the entire voice loop — speak prompt → listen → process → DOM action → navigate |
| [useSarvamSTT.js](file:///c:/Users/taufi/Desktop/esaarthi-ai/src/voice-agent/hooks/useSarvamSTT.js) | Mic recording hook. Captures 16kHz mono PCM via `AudioContext ScriptProcessor`, encodes WAV, POSTs to Sarvam Saaras v3 |
| [useSarvamTTS.js](file:///c:/Users/taufi/Desktop/esaarthi-ai/src/voice-agent/hooks/useSarvamTTS.js) | Speech synthesis hook. POSTs text to Sarvam Bulbul v3, decodes base64 WAV, plays via `AudioContext` |
| [intentEngine.js](file:///c:/Users/taufi/Desktop/esaarthi-ai/src/voice-agent/intentEngine.js) | Rule-based NLU. Scores transcripts against keyword lists in Hindi + English + Hinglish. No external ML |
| [dialogManager.js](file:///c:/Users/taufi/Desktop/esaarthi-ai/src/voice-agent/dialogManager.js) | Conversation state machine. States: `greeting → flow_active → done`. Drives multi-turn dialogs |
| [useVoiceNav.js](file:///c:/Users/taufi/Desktop/esaarthi-ai/src/voice-agent/useVoiceNav.js) | Lightweight navigation-only hook for the Language/home page. Resolves routes from transcript keywords |
| `dialogFlows.js` (data) | Flow definitions — keywords, step sequences, prompts, and choices for each service flow |

---

## STT Pipeline (Mic → Text)

```mermaid
sequenceDiagram
    participant User as 👤 User (speaks)
    participant Mic as 🎤 Mic (getUserMedia)
    participant AP as AudioContext ScriptProcessor
    participant WAV as WAV Encoder
    participant Sarvam as Sarvam Saaras v3 API
    participant App as VoiceFlowAgent

    User->>Mic: Speaks (Hindi / English / Hinglish)
    Mic->>AP: 16kHz PCM stream (Float32)
    AP->>AP: RMS silence detection (threshold 0.006)
    Note over AP: Auto-stop after 2.5s silence OR 25s max
    AP->>WAV: Float32 samples → 16-bit PCM WAV blob
    WAV->>Sarvam: POST /speech-to-text\n(model: saaras:v3, language: hi-IN)
    Sarvam-->>App: { transcript: "बिजली का बिल भरना है" }
    App->>App: handleUserInput(transcript)
```

---

## TTS Pipeline (Text → Audio)

```mermaid
sequenceDiagram
    participant App as VoiceFlowAgent
    participant Chunk as Text Chunker (≤490 chars)
    participant Sarvam as Sarvam Bulbul v3 API
    participant AC as AudioContext
    participant Speaker as 🔊 Speaker

    App->>Chunk: speak("कृपया Consumer Number बोलें।")
    Chunk->>Sarvam: POST /text-to-speech\n(model: bulbul:v3, speaker: shubh, lang: hi-IN)
    Sarvam-->>AC: { audios: ["base64_wav_data..."] }
    AC->>AC: atob() → ArrayBuffer → decodeAudioData()
    AC->>Speaker: BufferSourceNode.start()
    Speaker-->>App: onended → resolve Promise
```

---

## Conversation State Machine (dialogManager.js)

```mermaid
stateDiagram-v2
    [*] --> greeting: createDialogManager()
    
    greeting --> greeting: greet intent
    greeting --> greeting: help intent
    greeting --> greeting: unknown (failCount < 2)
    greeting --> show_departments: unknown (failCount ≥ 2)
    greeting --> flow_active: flow intent detected
    
    flow_active --> flow_active: input / choice / confirm step
    flow_active --> flow_active: retry (failCount < 3)
    flow_active --> done: all steps complete
    flow_active --> greeting: home / cancel intent
    flow_active --> navigate: navigate step type
    
    done --> flow_active: new flow intent
    done --> greeting: home / any other input
    
    greeting --> greeting: repeat → re-speak current prompt
    flow_active --> flow_active: repeat → re-speak current prompt
```

> **States**: `greeting` (idle, waiting for intent) → `flow_active` (multi-step guided flow) → `done` (flow completed)

---

## NLU Intent Detection (intentEngine.js)

```mermaid
flowchart TD
    T[User Transcript] --> N[Normalise: lowercase, strip punctuation]
    N --> S1{Check Special Intents}
    S1 -->|Match| SI[Return: greet / home / yes / no / repeat / help\nconfidence: 0.9]
    S1 -->|No Match| S2[Score Dialog Flows]
    S2 --> S3{Any score > 0?}
    S3 -->|No| UK[Return: unknown, confidence: 0]
    S3 -->|Yes| S4[Sort by score, pick best]
    S4 --> FI[Return: flowId, confidence = score/10]

    subgraph Keywords["Scoring Logic"]
        K1["Primary lang keywords: +N points (multi-word = higher)"]
        K2["Cross-lang keywords: +1 point each"]
    end
```

**Supported Special Intents:** `greet`, `home`, `yes`, [no](file:///c:/Users/taufi/Desktop/esaarthi-ai/src/voice-agent/intentEngine.js#8-16), `repeat`, `help`  
**Supported Dialog Flow Intents:** `gas_bill`, `gas_complaint`, `gas_new`, `elec_bill`, `elec_complaint`, `elec_new`, `status`, etc.

---

## Full End-to-End User Journey

### 🧾 Bill Payment Flow

```mermaid
flowchart LR
    A([User taps Mic Button]) --> B[Agent speaks: 'नमस्ते! गैस, बिजली, या नगर पालिका बोलें']
    B --> C[User: 'बिजली का बिल भरना है']
    C --> D[STT → Sarvam → transcript]
    D --> E[matchNavIntent → route: /electricity/bill]
    E --> F[TTS: 'बिजली बिल भुगतान पर जा रहे हैं']
    F --> G[navigate /electricity/bill]
    G --> H[Agent: 'Consumer Number बोलें']
    H --> I[User speaks numbers]
    I --> J[extractNumbers → fillInput#consumerNumber]
    J --> K[Agent: 'मोबाइल नंबर बोलें']
    K --> L[User speaks 10 digits]
    L --> M[extractMobile → fillInput#mobileNumber]
    M --> N[Agent: 'हाँ बोलें बिल लाने के लिए']
    N --> O[User: 'हाँ']
    O --> P[clickButton 'Fetch Bill' → navigate /otp-verification]
    P --> Q[Agent: 'OTP बोलें']
    Q --> R[User speaks 6 digits]
    R --> S[Click each OTP keypad digit]
    S --> T[Agent: 'Verify करें, हाँ बोलें']
    T --> U[User: 'हाँ']
    U --> V[clickButton 'Verify' → navigate /bill-details]
    V --> W[Agent: 'भुगतान के लिए हाँ बोलें']
    W --> X[clickButton 'Pay' → navigate /payment-method]
    X --> Y[User: 'UPI']
    Y --> Z([✅ Payment Complete])
```

---

### 📝 Complaint Registration Flow

```mermaid
flowchart LR
    A([Mic Active]) --> B[User: 'बिजली शिकायत दर्ज करनी है']
    B --> C[matchNavIntent → route: /electricity/complaint]
    C --> D[navigate, speak page prompt]
    D --> E[Agent: 'Consumer Number बोलें']
    E --> F[User speaks digits]
    F --> G[fillInput#consumerNo]
    G --> H[Agent asks complaint category]
    H --> I[User: 'मीटर खराब है']
    I --> J[matchCategory → 'Meter Defect']
    J --> K[fillSelect#category, ask description]
    K --> L[User speaks description]
    L --> M[fillTextarea#description]
    M --> N[Agent: 'मोबाइल नंबर बोलें']
    N --> O[User speaks 10 digits]
    O --> P[fillInput#mobile]
    P --> Q[Agent: 'Submit के लिए हाँ बोलें']
    Q --> R[User: 'हाँ']
    R --> S[clickButton 'Submit Complaint']
    S --> T[navigate /complaint-otp]
    T --> U[OTP entry via voice]
    U --> V([✅ Complaint Registered])
```

---

### 📡 Status Tracking Flow

```mermaid
flowchart LR
    A([User: 'application status dekhna hai']) --> B[matchNavIntent → route: /status]
    B --> C[navigate /status]
    C --> D[Agent: 'Reference ID या Mobile Number बोलें']
    D --> E{What user says}
    E -->|10 digits| F[fillInput#mobile]
    E -->|other digits| G[fillInput#refId]
    F --> H[Agent: 'हाँ बोलें']
    G --> H
    H --> I[User: 'हाँ']
    I --> J[clickButton 'Track Status']
    J --> K([✅ Status Displayed])
```

---

## Agent Status States

| Status | Meaning | Visual |
|--------|---------|--------|
| `idle` | Agent inactive | Mic button shown |
| `listening` | STT recording mic | Pulsing mic animation |
| `thinking` | Sarvam STT API call in progress | Processing indicator |
| `speaking` | Sarvam TTS playing audio | Speaker animation |

---

## Language Support

| Language | Coverage |
|----------|----------|
| Hindi (Devanagari) | Primary — all prompts spoken in Hindi |
| Hinglish (Roman Hindi) | Understood by NLU keyword matching |
| English | Understood by NLU, responses in Hindi |

The [normalise()](file:///c:/Users/taufi/Desktop/esaarthi-ai/src/voice-agent/intentEngine.js#8-16) function strips Hindi punctuation (`।`) and normalises whitespace before matching.

---

## Key Design Decisions

> [!NOTE]
> **No LLM / No Cloud AI for NLU** — All intent detection is pure keyword matching in [intentEngine.js](file:///c:/Users/taufi/Desktop/esaarthi-ai/src/voice-agent/intentEngine.js). This means zero latency for NLU, full offline-capable logic, and no API costs for understanding.

> [!IMPORTANT]
> **Sarvam AI is the ONLY external dependency** — Used for STT (`saaras:v3`) and TTS (`bulbul:v3`). API key is stored in [.env](file:///c:/Users/taufi/Desktop/esaarthi-ai/.env) as `VITE_SARVAM_API_KEY`.

> [!TIP]
> **DOM injection pattern** — Rather than lifting all form state to a global store, `VoiceFlowAgent` uses [fillInput()](file:///c:/Users/taufi/Desktop/esaarthi-ai/src/voice-agent/VoiceFlowAgent.jsx#110-122), [fillTextarea()](file:///c:/Users/taufi/Desktop/esaarthi-ai/src/voice-agent/VoiceFlowAgent.jsx#135-146), [fillSelect()](file:///c:/Users/taufi/Desktop/esaarthi-ai/src/voice-agent/VoiceFlowAgent.jsx#147-157), and [clickButton()](file:///c:/Users/taufi/Desktop/esaarthi-ai/src/voice-agent/VoiceFlowAgent.jsx#123-134) to directly manipulate React-controlled DOM elements via native input event dispatching. This avoids coupling the voice agent to each page's state.

> [!NOTE]
> **Silence detection threshold** — Set to RMS `0.006` to ignore ambient fan/AC noise. Auto-stops after `2.5s` of silence or a hard cap of `25s`.
