/**
 * dialogManager.js — Conversation State Machine for eSaarthi
 * createDialogManager() → manager instance
 */

import { dialogFlows } from '../data/dialogFlows.js';
import { detectIntent, parseConfirmation } from './intentEngine.js';

// Mock bill amounts for demo (in prod, replace with real API call)
function getMockBillAmount() {
    return (Math.floor(Math.random() * 900) + 100).toString();
}
function getMockMonth() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return months[new Date().getMonth()];
}

function fillTemplate(text, data) {
    return text
        .replace('_AMOUNT_', data._AMOUNT_ || '847')
        .replace('_MONTH_', data._MONTH_ || getMockMonth())
        .replace('_STATUS_', data._STATUS_ || 'प्रक्रिया में')
        .replace('_DATE_', data._DATE_ || '5 दिन');
}

/**
 * createDialogManager()
 * Returns an object with methods to advance the conversation.
 */
export function createDialogManager() {
    let state = {
        phase: 'greeting',        // greeting | dept_select | flow_active | done
        language: 'hi',
        currentFlowId: null,
        currentStepIndex: 0,
        collectedData: {},
        failCount: 0,
    };

    const listeners = [];
    function emit(event) {
        listeners.forEach(fn => fn(event));
    }

    function getFlow() {
        return state.currentFlowId ? dialogFlows[state.currentFlowId] : null;
    }

    function getStep() {
        const flow = getFlow();
        if (!flow) return null;
        return flow.steps[state.currentStepIndex] || null;
    }

    function getPrompt(stepOrFlow, lang) {
        const l = lang || state.language;
        if (!stepOrFlow) return '';
        const raw = stepOrFlow.prompt?.[l] || stepOrFlow.prompt?.hi || '';
        return fillTemplate(raw, {
            _AMOUNT_: getMockBillAmount(),
            _MONTH_: getMockMonth(),
            _STATUS_: l === 'hi' ? 'प्रक्रिया में' : 'In Progress',
            _DATE_: l === 'hi' ? '3–5 दिन' : '3–5 days',
        });
    }

    // ─── Public API ───

    function getGreeting(lang) {
        const l = lang || state.language;
        return l === 'hi'
            ? 'नमस्ते! मैं eSaarthi हूँ — आपकी सेवा में। आज आपको क्या सहायता चाहिए?'
            : 'Hello! I am eSaarthi — at your service. How can I help you today?';
    }

    function startFlow(flowId) {
        state = {
            ...state,
            phase: 'flow_active',
            currentFlowId: flowId,
            currentStepIndex: 0,
            collectedData: {},
            failCount: 0,
        };
        const step = getStep();
        return {
            type: 'prompt',
            stepType: step?.type,
            stepId: step?.id,
            text: getPrompt(step),
            collectAs: step?.collectAs,
            choices: step?.choices?.[state.language],
            inputLabel: step?.inputLabel?.[state.language],
            flowTitle: getFlow()?.title?.[state.language],
            stepIndex: state.currentStepIndex,
            totalSteps: getFlow()?.steps?.length,
        };
    }

    function advanceToNextStep() {
        state.currentStepIndex += 1;
        state.failCount = 0;
        const step = getStep();
        if (!step) {
            state.phase = 'done';
            return {
                type: 'done',
                text: state.language === 'hi'
                    ? 'धन्यवाद! क्या और कोई सेवा चाहिए? मुख्य मेनू के लिए "होम" बोलें।'
                    : 'Thank you! Need anything else? Say "Home" for main menu.',
                stepIndex: state.currentStepIndex,
                totalSteps: getFlow()?.steps?.length,
            };
        }

        if (step.type === 'navigate') {
            return {
                type: 'navigate',
                navigateTo: step.navigateTo,
                text: getPrompt(step),
                stepIndex: state.currentStepIndex,
                totalSteps: getFlow()?.steps?.length,
            };
        }

        if (step.type === 'done') {
            state.phase = 'done';
            return {
                type: 'done',
                text: getPrompt(step),
                stepIndex: state.currentStepIndex,
                totalSteps: getFlow()?.steps?.length,
            };
        }

        return {
            type: 'prompt',
            stepType: step.type,
            stepId: step.id,
            text: getPrompt(step),
            collectAs: step?.collectAs,
            choices: step?.choices?.[state.language],
            inputLabel: step?.inputLabel?.[state.language],
            flowTitle: getFlow()?.title?.[state.language],
            stepIndex: state.currentStepIndex,
            totalSteps: getFlow()?.steps?.length,
        };
    }

    /**
     * process(userInput) → response object
     * This is the main entry point for user input.
     */
    function process(userInput) {
        const lang = state.language;
        const norm = userInput.trim();

        // Always allow going home
        const homeCheck = detectIntent(norm, lang);
        if (homeCheck.type === 'special' && homeCheck.intent === 'home') {
            return reset();
        }
        if (homeCheck.type === 'special' && homeCheck.intent === 'repeat') {
            return getCurrentPrompt();
        }

        // ─── Greeting phase ───
        if (state.phase === 'greeting') {
            const intent = detectIntent(norm, lang);
            if (intent.type === 'flow' && intent.flowId) {
                return startFlow(intent.flowId);
            }
            if (intent.type === 'special' && intent.intent === 'greet') {
                return {
                    type: 'greeting',
                    text: getGreeting(lang),
                };
            }
            if (intent.type === 'special' && intent.intent === 'help') {
                return {
                    type: 'help',
                    text: lang === 'hi'
                        ? 'मैं आपकी मदद कर सकता हूँ: गैस बिल, बिजली बिल, पानी बिल, नया कनेक्शन, शिकायत, आवेदन स्थिति।'
                        : 'I can help with: Gas bill, Electricity bill, Water bill, New connection, Complaint, Application status.',
                };
            }
            // Unknown → show departments
            state.failCount += 1;
            if (state.failCount >= 2) {
                state.failCount = 0;
                return {
                    type: 'show_departments',
                    text: lang === 'hi'
                        ? 'कृपया विभाग चुनें या माइक दबाकर बोलें।'
                        : 'Please select a department or press the mic to speak.',
                };
            }
            return {
                type: 'unknown',
                text: lang === 'hi'
                    ? 'क्षमा करें, मैं समझ नहीं पाया। कृपया दोबारा बोलें — जैसे "बिजली का बिल भरना है"।'
                    : 'Sorry, I did not understand. Please try again — e.g. "pay electricity bill".',
            };
        }

        // ─── Flow active phase ───
        if (state.phase === 'flow_active') {
            const step = getStep();
            if (!step) return advanceToNextStep();

            if (step.type === 'confirm') {
                const answer = parseConfirmation(norm, lang);
                if (answer === 'yes') {
                    state.collectedData[step.collectAs] = true;
                    return advanceToNextStep();
                }
                if (answer === 'no') {
                    state.collectedData[step.collectAs] = false;
                    // On no-confirm for payment, go home
                    return reset(
                        lang === 'hi' ? 'ठीक है, रद्द किया। मुख्य मेनू पर वापस।' : 'Okay, cancelled. Back to main menu.'
                    );
                }
                // Not understood — retry once
                state.failCount += 1;
                if (state.failCount >= 3) {
                    return reset(
                        lang === 'hi' ? 'कृपया स्क्रीन से विकल्प चुनें।' : 'Please choose an option on screen.'
                    );
                }
                return {
                    type: 'retry',
                    text: lang === 'hi' ? 'कृपया "हाँ" या "नहीं" बोलें।' : 'Please say "Yes" or "No".',
                    stepIndex: state.currentStepIndex,
                    totalSteps: getFlow()?.steps?.length,
                };
            }

            if (step.type === 'choice') {
                const inputLower = norm.toLowerCase();
                const choices = step.choices?.en || [];
                const found = choices.find(c => inputLower.includes(c.toLowerCase()));
                if (found) {
                    state.collectedData[step.collectAs] = found;
                    return advanceToNextStep();
                }
                state.failCount += 1;
                if (state.failCount >= 3) {
                    state.collectedData[step.collectAs] = choices[0]; // default
                    return advanceToNextStep();
                }
                return {
                    type: 'retry',
                    text: lang === 'hi'
                        ? `कृपया ${choices.join(', ')} में से एक बोलें।`
                        : `Please say one of: ${choices.join(', ')}.`,
                    stepIndex: state.currentStepIndex,
                    totalSteps: getFlow()?.steps?.length,
                };
            }

            if (step.type === 'input') {
                if (norm.length > 0) {
                    state.collectedData[step.collectAs] = norm;
                    return advanceToNextStep();
                }
                return {
                    type: 'retry',
                    text: lang === 'hi' ? 'कृपया जानकारी बोलें।' : 'Please say or type the information.',
                    stepIndex: state.currentStepIndex,
                    totalSteps: getFlow()?.steps?.length,
                };
            }
        }

        // ─── Done phase ───
        if (state.phase === 'done') {
            const intent = detectIntent(norm, lang);
            if (intent.type === 'flow' && intent.flowId) {
                return startFlow(intent.flowId);
            }
            return reset();
        }

        return reset();
    }

    function getCurrentPrompt() {
        const step = getStep();
        if (!step) return { type: 'greeting', text: getGreeting() };
        return {
            type: 'prompt',
            stepType: step.type,
            text: getPrompt(step),
            stepIndex: state.currentStepIndex,
            totalSteps: getFlow()?.steps?.length,
        };
    }

    function reset(text) {
        const lang = state.language;
        state = {
            phase: 'greeting',
            language: lang,
            currentFlowId: null,
            currentStepIndex: 0,
            collectedData: {},
            failCount: 0,
        };
        return {
            type: 'greeting',
            text: text || getGreeting(lang),
        };
    }

    function setLanguage(lang) {
        state.language = lang;
    }

    function getState() {
        return { ...state };
    }

    function getCollectedData() {
        return { ...state.collectedData };
    }

    return {
        getGreeting,
        startFlow,
        process,
        reset,
        setLanguage,
        getState,
        getCollectedData,
    };
}
