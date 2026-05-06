import MarkdownRenderer from '../shared/MarkdownRenderer';
import './AgentCard.css';

function SkeletonLines() {
  return (
    <div className="agent-card__skeleton">
      {[90, 75, 85, 60, 80, 70].map((w, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{ width: `${w}%`, animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  );
}

export default function AgentCard({ agent, isLoading, content, error, isReduced }) {
  return (
    <div
      className={`agent-card ${isReduced ? 'agent-card--reduced' : ''} ${error ? 'agent-card--error' : ''}`}
      style={{ '--agent-color': agent.color }}
    >
      <div className="agent-card__header">
        <div className="agent-card__header-left">
          <span className="agent-card__dot" />
          <span className="agent-card__icon">{agent.icon}</span>
          <span className="agent-card__name">{agent.name}</span>
        </div>
        {isReduced && (
          <span className="agent-card__reduced-badge">Reduced</span>
        )}
        {isLoading && (
          <span className="agent-card__loading-badge">
            <span className="loading-dot" />
            Running
          </span>
        )}
      </div>

      <div className="agent-card__body">
        {isLoading && <SkeletonLines />}
        {!isLoading && error && (
          <div className="agent-card__error">
            <span>⚠️</span>
            <span>Agent unavailable: {error}</span>
          </div>
        )}
        {!isLoading && !error && content && (
          <MarkdownRenderer content={content} />
        )}
      </div>

      <div className="agent-card__footer">
        {agent.role}
      </div>
    </div>
  );
}
