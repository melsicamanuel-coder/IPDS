import { AGENTS, AGENT_ORDER } from '../../data/agents';
import { getClassificationMeta } from '../../utils/classifier';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';
import './ProductClassification.css';

export default function ProductClassification({ classification, isLoading, error, onBegin }) {
  if (isLoading) {
    return (
      <div className="classification-screen">
        <div className="classification-loading fade-in">
          <LoadingSpinner size={40} />
          <p>Analyzing your product and classifying…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="classification-screen">
        <div className="classification-error fade-in">
          <p>Classification failed: {error}</p>
          <p>Please check your API key and try again.</p>
        </div>
      </div>
    );
  }

  if (!classification) return null;

  const meta = getClassificationMeta(classification.classification);
  const fullCapacity = classification.agents_at_full_capacity || [];
  const reducedCapacity = classification.agents_at_reduced_capacity || [];

  return (
    <div className="classification-screen">
      <div className="classification-card fade-in">
        <div className="classification-badge" style={{ background: meta.color + '15', borderColor: meta.color + '40' }}>
          <span className="classification-badge__dot" style={{ background: meta.color }} />
          <span className="classification-badge__text" style={{ color: meta.color }}>{classification.classification}</span>
        </div>

        <h2 className="classification-title">Product Classified</h2>
        <p className="classification-summary">{classification.summary}</p>

        <div className="classification-meta">
          <div className="classification-meta__row">
            <span className="classification-meta__label">Product Intent</span>
            <span className="classification-meta__value">{classification.product_intent}</span>
          </div>
          <div className="classification-meta__row">
            <span className="classification-meta__label">Target Users</span>
            <span className="classification-meta__value">{classification.target_users}</span>
          </div>
          <div className="classification-meta__row">
            <span className="classification-meta__label">Key Constraints</span>
            <span className="classification-meta__value">{classification.key_constraints}</span>
          </div>
        </div>

        <div className="classification-agents">
          <h3 className="classification-agents__title">Active Sub-Agents</h3>
          <div className="classification-agents__grid">
            {AGENT_ORDER.map((agentId) => {
              const agent = AGENTS[agentId];
              const isFull = fullCapacity.some(n => n.toLowerCase().includes(agentId) || agentId.includes(n.toLowerCase().split(' ')[0]));
              const isReduced = !isFull;
              return (
                <div
                  key={agentId}
                  className={`agent-pill ${isFull ? 'agent-pill--full' : 'agent-pill--reduced'}`}
                  style={{ borderColor: isFull ? agent.color : 'var(--border)' }}
                >
                  <span className="agent-pill__icon">{agent.icon}</span>
                  <span className="agent-pill__name">{agent.shortName}</span>
                  <span className={`agent-pill__status ${isFull ? 'agent-pill__status--full' : 'agent-pill__status--reduced'}`}>
                    {isFull ? 'Full' : 'Reduced'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <Button onClick={onBegin} size="lg">
          Begin Phase 1 →
        </Button>
      </div>
    </div>
  );
}
