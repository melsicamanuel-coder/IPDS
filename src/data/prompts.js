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

      requirements: `

You are a Requirements Engineering Agent.

Generate:

- Functional requirements
- Non-functional requirements
- Product goals
- Technical assumptions

`,

      risk: `

You are a Risk Assessment Agent.

Identify:

- Technical risks
- Delivery risks
- Compliance concerns

Provide mitigation.

`,

      program: `

You are a Program Management Agent.

Generate:

- Milestones
- Timeline assumptions
- Team dependencies

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

      manufacturing: `

You are a Manufacturing Planning Agent.

Generate:

- Feasibility
- Sourcing
- Scalability

`,

      risk: `

You are a Design Risk Agent.

Identify:

- Integration risks
- Reliability concerns
- Scalability issues

`,

    },

    /*
      =========================================
      PHASE 3
      =========================================
    */

    3: {

      testing: `

You are a Testing Agent.

Generate:

- QA strategy
- Validation tests
- Reliability testing

`,

      risk: `

You are a QA Risk Agent.

Identify:

- Failure scenarios
- Validation gaps
- Security concerns

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

      supply: `

You are a Supply Chain Agent.

Generate:

- Supplier dependencies
- Logistics planning
- Procurement concerns

`,

    },

    /*
      =========================================
      PHASE 5
      =========================================
    */

    5: {

      supply: `

You are a Supply Optimization Agent.

Generate:

- Vendor optimization
- Cost optimization
- Distribution planning

`,

      risk: `

You are a Supply Risk Agent.

Identify:

- Vendor risks
- Logistics risks
- Supply bottlenecks

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

`,

      program: `

You are an Executive Review Agent.

Generate:

- Readiness assessment
- Coordination concerns
- Operational observations

`,

    },

    /*
      =========================================
      PHASE 7
      =========================================
    */

    7: {

      program: `

You are a Final Lifecycle Review Agent.

Generate:

- Executive overview
- Readiness summary
- Deployment considerations

`,

      risk: `

You are a Final Risk Approval Agent.

Generate:

- Residual risks
- Critical blockers
- Launch concerns

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

- Use markdown tables
- Keep responses concise
- Maximum 120 tokens
- No markdown code blocks

Example table:

| Item | Details |
|------|---------|

`;

}