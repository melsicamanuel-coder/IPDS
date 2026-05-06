import { useEffect } from 'react';
import PhaseHeader from './PhaseHeader';
import AgentGrid from './AgentGrid';
import DeliverablesPanel from './DeliverablesPanel';
import PhaseGate from './PhaseGate';
import './PhaseContainer.css';

export default function PhaseContainer({
  phase,
  phaseStatus,
  loadingAgents,
  outputs,
  errors,
  gateDecision,
  onConfirm,
  onHold,
  onRerun,
  runPhase,
}) {
  const isReadOnly = !!gateDecision;
  const isComplete = phaseStatus === 'complete' || phaseStatus === 'held' || !!gateDecision;
  const isRunning = phaseStatus === 'running';
  const notStarted = !phaseStatus || phaseStatus === 'pending';

  useEffect(() => {
    if (notStarted) {
      runPhase(phase.id);
    }
  }, [phase.id]);

  return (
    <div className="phase-container container">
      <PhaseHeader phase={phase} />

      <AgentGrid
        phase={phase}
        loadingAgents={loadingAgents || {}}
        outputs={outputs || {}}
        errors={errors || {}}
      />

      <DeliverablesPanel phase={phase} />

      {(isComplete || (isRunning && outputs && Object.keys(outputs).length > 0)) && (
        <PhaseGate
          phase={phase}
          gateDecision={gateDecision}
          onConfirm={() => onConfirm(phase.id)}
          onHold={(note) => onHold(phase.id, note)}
          onRerun={() => onRerun(phase.id)}
          isReadOnly={isReadOnly}
        />
      )}
    </div>
  );
}
