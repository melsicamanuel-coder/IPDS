import { PHASES } from '../../data/phases';
import './PhaseProgressBar.css';

export default function PhaseProgressBar({ currentPhase, gateDecisions, onNavigate }) {
  return (
    <div className="progress-bar">
      <div className="container">
        <div className="progress-bar__steps">
          {PHASES.map((phase, index) => {
            const phaseNum = phase.id;
            const isCompleted = gateDecisions[phaseNum] === 'confirmed';
            const isCurrent = phaseNum === currentPhase;
            const isClickable = isCompleted;

            return (
              <button
                key={phaseNum}
                className={[
                  'progress-bar__step',
                  isCompleted ? 'progress-bar__step--completed' : '',
                  isCurrent ? 'progress-bar__step--current' : '',
                  !isCompleted && !isCurrent ? 'progress-bar__step--upcoming' : '',
                ].join(' ')}
                onClick={() => isClickable && onNavigate(phaseNum)}
                disabled={!isClickable && !isCurrent}
                title={phase.name}
              >
                <div className="progress-bar__circle">
                  {isCompleted ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span>{phaseNum}</span>
                  )}
                  {isCurrent && <span className="progress-bar__pulse" />}
                </div>
                <span className="progress-bar__label">{phase.subtitle}</span>
                {index < PHASES.length - 1 && (
                  <div className={`progress-bar__connector ${isCompleted ? 'progress-bar__connector--filled' : ''}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
