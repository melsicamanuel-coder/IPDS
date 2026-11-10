export function getPrompt(

  phaseId,

  agentId,

  classification,

  productDescription,

  phaseOutputs

) {

  /*
    KEEP CONTEXT VERY SMALL
  */

  const previousOutputs = '';

  const baseContext = `

Product:
${productDescription}

Type:
${classification?.type || 'PRODUCT'}

Intent:
${classification?.intent || ''}

Users:
${classification?.targetUsers || ''}

Constraints:
${classification?.constraints || ''}

${previousOutputs}

`;

  const prompts = {

    /*
      =========================================
      PHASE 1
      =========================================
    */

    1: {

      requirement: `

You are a Requirements Engineering Agent.

Generate:

- Functional requirements
- Non-functional requirements
- Product goals
- Technical assumptions

`,

    },

    /*
      =========================================
      PHASE 2
      =========================================
    */

    2: {

      design: `

You are a Product Design Agent.

Generate:

- Architecture
- Components
- Technical stack
- UX considerations

`,

    },

    /*
      =========================================
      PHASE 3
      =========================================
    */

    3: {

      test: `

You are a Testing Agent.

Generate:

- QA strategy
- Validation tests
- Reliability testing

`,

    },

    /*
      =========================================
      PHASE 4
      =========================================
    */

    4: {

      manufacturing: `

You are a Manufacturing Execution Agent.

Generate:

- Production workflow
- Assembly stages
- Resource planning

`,

    },

    /*
      =========================================
      PHASE 5
      =========================================
    */

    5: {

      'supply-chain': `

You are a Supply Chain Optimization Agent.

Generate:

- Vendor optimization
- Cost optimization
- Distribution planning
- Supplier dependencies
- Logistics planning

`,

    },

    /*
      =========================================
      PHASE 6
      =========================================
    */

    6: {

      risk: `

You are an Enterprise Risk Agent.

Generate:

- Strategic risks
- Regulatory concerns
- Operational risks
- Risk register with probability and impact scores
- Mitigation strategies

`,

    },

    /*
      =========================================
      PHASE 7
      =========================================
    */

    7: {

      program: `

You are a Program Manager and Final Lifecycle Review Agent.

Generate:

- Executive overview
- Work breakdown structure
- Integrated schedule
- Budget estimate
- Readiness summary
- Launch readiness checklist

`,

    },

  };

  const phasePrompts =
    prompts[phaseId] || {};

  const selectedPrompt =
    phasePrompts[agentId] ||

    'Generate concise engineering analysis.';

  return `

${selectedPrompt}

${baseContext}

IMPORTANT:

- Use markdown tables where appropriate
- Keep responses concise but thorough
- No markdown code blocks

Example table:

| Item | Details |
|------|---------|

`;

}