export default function AgentsSection() {

  const agents = [

    {
      title: 'Requirements AI',
      desc: 'Captures and structures product requirements.',
    },

    {
      title: 'Design AI',
      desc: 'Generates architecture and trade studies.',
    },

    {
      title: 'Test AI',
      desc: 'Builds validation and certification strategy.',
    },

    {
      title: 'Manufacturing AI',
      desc: 'Plans production and scalability workflows.',
    },

    {
      title: 'Supply Chain AI',
      desc: 'Analyzes sourcing and lifecycle risks.',
    },

    {
      title: 'Risk AI',
      desc: 'Maintains mitigation and probability models.',
    },

    {
      title: 'Program Manager AI',
      desc: 'Coordinates schedule, WBS, and execution.',
    },

    {
      title: 'Knowledge Graph AI',
      desc: 'Maintains organizational engineering memory.',
    },

  ];

  return (

    <section
      id="agents"
      className="landing-section"
    >

      <div className="section-container">

        <p className="section-label">
          AI AGENTS
        </p>

        <h2 className="section-title">
          Specialized engineering intelligence
        </h2>

        <div className="agents-grid">

          {agents.map((agent) => (

            <div
              key={agent.title}
              className="agent-preview-card"
            >

              <h3>{agent.title}</h3>

              <p>{agent.desc}</p>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}