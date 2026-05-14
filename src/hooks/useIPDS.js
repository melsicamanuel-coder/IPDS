import { useReducer, useCallback } from 'react';

import { callGroq, callGroqJSON } from '../api/groq';

import { PHASES } from '../data/phases';

import { getPrompt } from '../data/prompts';

const GROQ_API_KEY = 'enter your api key';

const initialState = {

  step: 'landing',

  apiKey: GROQ_API_KEY,

  productDescription: '',

  classification: null,

  currentPhase: 1,

  phaseOutputs: {},

  phaseLoadingAgents: {},

  phaseErrors: {},

  phaseStatus: {},

  gateDecisions: {},

  isClassifying: false,

  classificationError: null,

};

function reducer(state, action) {

  switch (action.type) {

    case 'LAUNCH_PLATFORM':

      return {

        ...state,

        step: 'product-input',

      };

    case 'SET_API_KEY':

      return {

        ...state,

        apiKey: action.payload,

      };

    case 'SET_PRODUCT':

      return {

        ...state,

        productDescription: action.payload,

      };

    case 'START_CLASSIFICATION':

      return {

        ...state,

        isClassifying: true,

        classificationError: null,

        step: 'classification',

      };

    case 'SET_CLASSIFICATION':

      return {

        ...state,

        classification: action.payload,

        isClassifying: false,

      };

    case 'CLASSIFICATION_ERROR':

      return {

        ...state,

        classificationError: action.payload,

        isClassifying: false,

      };

    case 'START_PHASE': {

      const phaseId = action.payload;

      const loadingAgents = {};

      PHASES[phaseId - 1]
        .activeAgents
        .concat(PHASES[phaseId - 1].reducedAgents)
        .forEach((id) => {

          loadingAgents[id] = true;

        });

      return {

        ...state,

        step: 'phase',

        currentPhase: phaseId,

        phaseStatus: {

          ...state.phaseStatus,

          [phaseId]: 'running',

        },

        phaseLoadingAgents: {

          ...state.phaseLoadingAgents,

          [phaseId]: loadingAgents,

        },

        phaseErrors: {

          ...state.phaseErrors,

          [phaseId]: {},

        },

      };

    }

    case 'SET_AGENT_OUTPUT': {

      const {

        phaseId,

        agentId,

        content,

      } = action.payload;

      const newOutputs = {

        ...state.phaseOutputs,

        [phaseId]: {

          ...(state.phaseOutputs[phaseId] || {}),

          [agentId]: content,

        },

      };

      const newLoading = {

        ...state.phaseLoadingAgents,

        [phaseId]: {

          ...(state.phaseLoadingAgents[phaseId] || {}),

          [agentId]: false,

        },

      };

      const allDone =
        Object.values(newLoading[phaseId] || {})
          .every((v) => !v);

      return {

        ...state,

        phaseOutputs: newOutputs,

        phaseLoadingAgents: newLoading,

        phaseStatus: allDone

          ? {

              ...state.phaseStatus,

              [phaseId]: 'complete',

            }

          : state.phaseStatus,

      };

    }

    case 'SET_AGENT_ERROR': {

      const {

        phaseId,

        agentId,

        error,

      } = action.payload;

      const newErrors = {

        ...state.phaseErrors,

        [phaseId]: {

          ...(state.phaseErrors[phaseId] || {}),

          [agentId]: error,

        },

      };

      const newLoading = {

        ...state.phaseLoadingAgents,

        [phaseId]: {

          ...(state.phaseLoadingAgents[phaseId] || {}),

          [agentId]: false,

        },

      };

      const allDone =
        Object.values(newLoading[phaseId] || {})
          .every((v) => !v);

      return {

        ...state,

        phaseErrors: newErrors,

        phaseLoadingAgents: newLoading,

        phaseStatus: allDone

          ? {

              ...state.phaseStatus,

              [phaseId]: 'complete',

            }

          : state.phaseStatus,

      };

    }

    case 'CONFIRM_GATE':

      return {

        ...state,

        gateDecisions: {

          ...state.gateDecisions,

          [action.payload]: 'confirmed',

        },

      };

    case 'HOLD_GATE':

      return {

        ...state,

        gateDecisions: {

          ...state.gateDecisions,

          [action.payload]: 'held',

        },

      };

    case 'ADVANCE_PHASE': {

      const next = state.currentPhase + 1;

      if (next > 7) return state;

      return {

        ...state,

        currentPhase: next,

      };

    }

    case 'NAVIGATE_TO_PHASE':

      return {

        ...state,

        currentPhase: action.payload,

      };

    default:

      return state;

  }

}

export function useIPDS() {

  const [state, dispatch] =
    useReducer(reducer, initialState);

  const launchPlatform = useCallback(() => {

    dispatch({
      type: 'LAUNCH_PLATFORM',
    });

  }, []);

  const setApiKey = useCallback((key) => {

    dispatch({

      type: 'SET_API_KEY',

      payload: key,

    });

  }, []);

  const setProduct = useCallback((desc) => {

    dispatch({

      type: 'SET_PRODUCT',

      payload: desc,

    });

  }, []);

  const classify = useCallback(async (
    apiKey,
    productDescription
  ) => {

    dispatch({
      type: 'START_CLASSIFICATION',
    });

    const systemPrompt = `

You are the IPDS Classification Engine.

Return ONLY valid json.

{
  "classification": "",
  "summary": "",
  "product_intent": "",
  "target_users": "",
  "key_constraints": "",
  "agents_at_full_capacity": [],
  "agents_at_reduced_capacity": []
}

`;

    try {

      const result = await callGroqJSON(
        apiKey,
        systemPrompt,
        productDescription
      );

      const formattedClassification = {

        type:
          result.classification || 'PRODUCT',

        summary:
          result.summary || '',

        intent:
          result.product_intent || '',

        targetUsers:
          result.target_users || '',

        constraints:
          result.key_constraints || '',

        agents: [

          ...(result.agents_at_full_capacity || [])
            .map((name) => ({

              name,

              mode: 'FULL',

            })),

          ...(result.agents_at_reduced_capacity || [])
            .map((name) => ({

              name,

              mode: 'REDUCED',

            })),

        ],

      };

      dispatch({

        type: 'SET_CLASSIFICATION',

        payload: formattedClassification,

      });

    }

    catch (err) {

      dispatch({

        type: 'CLASSIFICATION_ERROR',

        payload: err.message,

      });

    }

  }, []);

  const runPhase = useCallback(async (phaseId) => {

    dispatch({

      type: 'START_PHASE',

      payload: phaseId,

    });

    const phase = PHASES[phaseId - 1];

    const allAgents = [

      ...phase.activeAgents,

      ...phase.reducedAgents,

    ];

    for (const agentId of allAgents) {

      try {

        const systemPrompt = getPrompt(

          phaseId,

          agentId,

          state.classification,

          state.productDescription,

          state.phaseOutputs

        );

        const result = await callGroq(

          state.apiKey,

          systemPrompt,

          `Product: ${state.productDescription}`

        );

        const content =

          typeof result === 'string'

            ? result

            : JSON.stringify(result);

        dispatch({

          type: 'SET_AGENT_OUTPUT',

          payload: {

            phaseId,

            agentId,

            content,

          },

        });

      }

      catch (err) {

        dispatch({

          type: 'SET_AGENT_ERROR',

          payload: {

            phaseId,

            agentId,

            error: err.message,

          },

        });

      }

    }

  }, [

    state.apiKey,

    state.classification,

    state.productDescription,

    state.phaseOutputs,

  ]);

  const confirmGate = useCallback(async (
    phaseId
  ) => {

    dispatch({

      type: 'CONFIRM_GATE',

      payload: phaseId,

    });

    if (phaseId < 7) {

      dispatch({
        type: 'ADVANCE_PHASE',
      });

    }

  }, []);

  const holdGate = useCallback((phaseId) => {

    dispatch({

      type: 'HOLD_GATE',

      payload: phaseId,

    });

  }, []);

  const navigateToPhase = useCallback((phaseId) => {

    dispatch({

      type: 'NAVIGATE_TO_PHASE',

      payload: phaseId,

    });

  }, []);

  const rerunPhase = useCallback((phaseId) => {

    runPhase(phaseId);

  }, [runPhase]);

  return {

    state,

    launchPlatform,

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