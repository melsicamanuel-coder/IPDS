export default function PhasesSection() {

  const phases = [

    {
      number: '01',
      title: 'Requirements',
      desc:
        'Capture functional and non-functional requirements, stakeholder expectations, compliance constraints, and product objectives.',
      agents:
        'Requirements AI • Risk AI • Program Manager AI',
    },

    {
      number: '02',
      title: 'Design',
      desc:
        'Generate architecture options, trade studies, interfaces, scalability decisions, and technical system design.',
      agents:
        'Design AI • Requirements AI • Knowledge Graph AI',
    },

    {
      number: '03',
      title: 'Testing',
      desc:
        'Define validation strategy, certification planning, quality assurance, and automated testing workflows.',
      agents:
        'Test AI • Risk AI • Program Manager AI',
    },

    {
      number: '04',
      title: 'Manufacturing',
      desc:
        'Plan deployment readiness, operational scalability, production workflows, and delivery pipelines.',
      agents:
        'Manufacturing AI • Supply Chain AI',
    },

    {
      number: '05',
      title: 'Supply Chain',
      desc:
        'Analyze sourcing dependencies, lifecycle health, procurement risk, and supplier reliability.',
      agents:
        'Supply Chain AI • Risk AI',
    },

    {
      number: '06',
      title: 'Risk',
      desc:
        'Continuously identify technical, operational, compliance, security, and program-level risks.',
      agents:
        'Risk AI • Program Manager AI',
    },

    {
      number: '07',
      title: 'Program Management',
      desc:
        'Coordinate schedule, budgeting, governance, launch readiness, and execution tracking.',
      agents:
        'Program Manager AI • Knowledge Graph AI',
    },

  ];

  return (

    <section
      id="phases"
      className="landing-section"
    >

      <div className="section-container">

        <p className="section-label">
          PHASES
        </p>

        <h2 className="section-title">
          Seven phases, zero guesswork
        </h2>

        <p className="section-description">
          Every phase is AI-assisted, gate-driven,
          and connected through orchestration logic.
        </p>

        <div className="phase-list">

          {phases.map((phase) => (

            <div
              key={phase.number}
              className="phase-card"
            >

              <span className="phase-number">
                {phase.number}
              </span>

              <h3>{phase.title}</h3>

              <p className="phase-desc">
                {phase.desc}
              </p>

              <div className="phase-agents">
                {phase.agents}
              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}