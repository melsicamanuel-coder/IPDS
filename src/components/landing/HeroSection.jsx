export default function HeroSection({ onLaunch }) {

  return (

    <section className="hero-section">

      <div className="hero-grid">

        {/* LEFT */}

        <div className="hero-left">

          <span className="hero-badge">
            AI-Driven Product Development
          </span>

          <h1 className="hero-title">
            Multi-Agent Engineering Intelligence Platform
          </h1>

          <p className="hero-description">
            IPDS orchestrates specialized AI agents across
            requirements engineering, architecture,
            testing, manufacturing, supply-chain analysis,
            risk assessment, and program management.
          </p>

          <div className="hero-actions">

            <button
              className="hero-primary-btn"
              onClick={onLaunch}
            >
              Launch IPDS
            </button>

            <button
              className="hero-secondary-btn"
              onClick={() => {

                document
                  .getElementById('phases')
                  ?.scrollIntoView({
                    behavior: 'smooth',
                  });

              }}
            >
              View Workflow
            </button>

          </div>

          <div className="hero-stats">

            <div className="hero-stat-card">
              <h3>7</h3>
              <span>Engineering Phases</span>
            </div>

            <div className="hero-stat-card">
              <h3>8</h3>
              <span>AI Agents</span>
            </div>

            <div className="hero-stat-card">
              <h3>Live</h3>
              <span>LLM Orchestration</span>
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="hero-right">

          <div className="workflow-card">

            <div className="workflow-header">
              Active Workflow
            </div>

            <div className="workflow-phases">

              <div className="workflow-phase active">
                Requirements
              </div>

              <div className="workflow-phase active">
                Design
              </div>

              <div className="workflow-phase active">
                Testing
              </div>

              <div className="workflow-phase">
                Manufacturing
              </div>

              <div className="workflow-phase">
                Supply Chain
              </div>

              <div className="workflow-phase">
                Risk
              </div>

              <div className="workflow-phase">
                Program Mgmt
              </div>

            </div>

            <div className="workflow-terminal">

              <div className="terminal-line">
                Initializing orchestration engine...
              </div>

              <div className="terminal-line">
                Running Requirements AI agent...
              </div>

              <div className="terminal-line success">
                Requirements complete.
              </div>

              <div className="terminal-line">
                Running Design AI agent...
              </div>

              <div className="terminal-line success">
                Architecture generated.
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}