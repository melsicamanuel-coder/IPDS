import { AGENTS, AGENT_ORDER } from '../../data/agents';
import AgentCard from './AgentCard';
import './AgentGrid.css';

export default function AgentGrid({ phase, loadingAgents, outputs, errors }) {
  const allAgents = [...phase.activeAgents, ...phase.reducedAgents];

  const isMulti = allAgents.length > 1;

  return (
    <div className={`agent-grid ${isMulti ? 'agent-grid--multi' : ''}`}>
      {AGENT_ORDER.filter(id => allAgents.includes(id)).map((agentId) => {
        const agent = AGENTS[agentId];
        const isReduced = phase.reducedAgents.includes(agentId);
        return (
          <AgentCard
            key={agentId}
            agent={agent}
            isLoading={loadingAgents[agentId] ?? false}
            content={outputs[agentId] || null}
            error={errors[agentId] || null}
            isReduced={isReduced}
          />
        );
      })}
    </div>
  );
}
