import { useReducer, useCallback } from 'react';
import { callGroq, callGroqJSON } from '../api/groq';
import { PHASES } from '../data/phases';
import { AGENT_ORDER } from '../data/agents';
import { getPrompt } from '../data/prompts';

const GROQ_API_KEY = "enter your api";

const initialState = {
  step: 'product-input',
  apiKey: GROQ_API_KEY,
  productDescription: '',
  classification: null,
  currentPhase: 1,
  phaseOutputs: {},      // { [phaseId]: { [agentId]: string } }
  phaseLoadingAgents: {},// { [phaseId]: { [agentId]: boolean } }
  phaseErrors: {},       // { [phaseId]: { [agentId]: string } }
  phaseStatus: {},       // { [phaseId]: 'pending'|'running'|'complete'|'held' }
  gateDecisions: {},     // { [phaseId]: 'confirmed'|'held' }
  isClassifying: false,
  classificationError: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload, step: 'product-input' };

    case 'SET_PRODUCT':
      return { ...state, productDescription: action.payload };

    case 'START_CLASSIFICATION':
      return { ...state, isClassifying: true, classificationError: null, step: 'classification' };

    case 'SET_CLASSIFICATION':
      return { ...state, classification: action.payload, isClassifying: false };

    case 'CLASSIFICATION_ERROR':
      return { ...state, classificationError: action.payload, isClassifying: false };

    case 'START_PHASE': {
      const phaseId = action.payload;
      const loadingAgents = {};
      PHASES[phaseId - 1].activeAgents.concat(PHASES[phaseId - 1].reducedAgents).forEach(id => {
        loadingAgents[id] = true;
      });
      return {
        ...state,
        step: 'phase',
        currentPhase: phaseId,
        phaseStatus: { ...state.phaseStatus, [phaseId]: 'running' },
        phaseLoadingAgents: { ...state.phaseLoadingAgents, [phaseId]: loadingAgents },
        phaseErrors: { ...state.phaseErrors, [phaseId]: {} },
      };
    }

    case 'SET_AGENT_OUTPUT': {
      const { phaseId, agentId, content } = action.payload;
      const newOutputs = {
        ...state.phaseOutputs,
        [phaseId]: { ...(state.phaseOutputs[phaseId] || {}), [agentId]: content },
      };
      const newLoading = {
        ...state.phaseLoadingAgents,
        [phaseId]: { ...(state.phaseLoadingAgents[phaseId] || {}), [agentId]: false },
      };
      const allDone = Object.values(newLoading[phaseId] || {}).every(v => !v);
      return {
        ...state,
        phaseOutputs: newOutputs,
        phaseLoadingAgents: newLoading,
        phaseStatus: allDone
          ? { ...state.phaseStatus, [phaseId]: 'complete' }
          : state.phaseStatus,
      };
    }

    case 'SET_AGENT_ERROR': {
      const { phaseId, agentId, error } = action.payload;
      const newErrors = {
        ...state.phaseErrors,
        [phaseId]: { ...(state.phaseErrors[phaseId] || {}), [agentId]: error },
      };
      const newLoading = {
        ...state.phaseLoadingAgents,
        [phaseId]: { ...(state.phaseLoadingAgents[phaseId] || {}), [agentId]: false },
      };
      const allDone = Object.values(newLoading[phaseId] || {}).every(v => !v);
      return {
        ...state,
        phaseErrors: newErrors,
        phaseLoadingAgents: newLoading,
        phaseStatus: allDone
          ? { ...state.phaseStatus, [phaseId]: 'complete' }
          : state.phaseStatus,
      };
    }

    case 'CONFIRM_GATE':
      return {
        ...state,
        gateDecisions: { ...state.gateDecisions, [action.payload]: 'confirmed' },
      };

    case 'HOLD_GATE':
      return {
        ...state,
        gateDecisions: { ...state.gateDecisions, [action.payload]: 'held' },
        phaseStatus: { ...state.phaseStatus, [action.payload]: 'held' },
      };

    case 'ADVANCE_PHASE': {
      const next = state.currentPhase + 1;
      if (next > 7) return state;
      return { ...state, currentPhase: next };
    }

    case 'NAVIGATE_TO_PHASE':
      return { ...state, currentPhase: action.payload };

    default:
      return state;
  }
}

export function useIPDS() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setApiKey = useCallback((key) => dispatch({ type: 'SET_API_KEY', payload: key }), []);
  const setProduct = useCallback((desc) => dispatch({ type: 'SET_PRODUCT', payload: desc }), []);

  const classify = useCallback(async (apiKey, productDescription) => {
    dispatch({ type: 'START_CLASSIFICATION' });
    const systemPrompt = `You are the IPDS Classification Engine. Given a product description, classify it using EXACTLY this decision tree:

- If physical hardware is involved:
  - If embedded logic/microcontroller code is also present:
    - If there is also a host-side app or cloud layer: return "HARDWARE + FIRMWARE + SOFTWARE"
    - Else: return "HARDWARE + FIRMWARE"
  - Else: return "HARDWARE ONLY"
- If no hardware:
  - If low-level embedded or real-time logic exists: return "FIRMWARE + SOFTWARE"
  - Else: return "SOFTWARE ONLY"

Return a JSON object with exactly these keys:
{
  "classification": "<one of the 5 types above>",
  "summary": "<2-sentence explanation of why>",
  "agents_at_full_capacity": ["list of agent names"],
  "agents_at_reduced_capacity": ["list of agent names"],
  "product_intent": "<what problem does this solve>",
  "target_users": "<who is this for>",
  "key_constraints": "<any constraints identified>"
}`;

    try {
      const result = await callGroqJSON(apiKey, systemPrompt, productDescription);
      dispatch({ type: 'SET_CLASSIFICATION', payload: result });
    } catch (err) {
      dispatch({ type: 'CLASSIFICATION_ERROR', payload: err.message });
    }
  }, []);

  const runPhase = useCallback(async (phaseId) => {
    dispatch({ type: 'START_PHASE', payload: phaseId });
    const phase = PHASES[phaseId - 1];
    const allAgents = [...phase.activeAgents, ...phase.reducedAgents];

    await Promise.all(
      allAgents.map(async (agentId) => {
        try {
          const systemPrompt = getPrompt(
            phaseId,
            agentId,
            state.classification,
            state.productDescription,
            state.phaseOutputs
          );
          const content = await callGroq(
            state.apiKey,
            systemPrompt,
            `Product: ${state.productDescription}`
          );
          dispatch({ type: 'SET_AGENT_OUTPUT', payload: { phaseId, agentId, content } });
        } catch (err) {
          dispatch({ type: 'SET_AGENT_ERROR', payload: { phaseId, agentId, error: err.message } });
        }
      })
    );
  }, [state.apiKey, state.classification, state.productDescription, state.phaseOutputs]);

  const confirmGate = useCallback((phaseId) => {
    dispatch({ type: 'CONFIRM_GATE', payload: phaseId });
    if (phaseId < 7) dispatch({ type: 'ADVANCE_PHASE' });
  }, []);

  const holdGate = useCallback((phaseId) => {
    dispatch({ type: 'HOLD_GATE', payload: phaseId });
  }, []);

  const navigateToPhase = useCallback((phaseId) => {
    dispatch({ type: 'NAVIGATE_TO_PHASE', payload: phaseId });
  }, []);

  const rerunPhase = useCallback((phaseId) => {
    dispatch({ type: 'HOLD_GATE', payload: phaseId });
    runPhase(phaseId);
  }, [runPhase]);

  return {
    state,
    setApiKey,
    setProduct,
    classify,
    runPhase,
    confirmGate,
    holdGate,
    navigateToPhase,
    rerunPhase,
  };
}
