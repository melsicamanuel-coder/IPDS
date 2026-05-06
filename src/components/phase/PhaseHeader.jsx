import './PhaseHeader.css';

export default function PhaseHeader({ phase }) {
  return (
    <div className="phase-header">
      <div className="phase-header__meta">
        <span className="phase-header__num">Phase {phase.id} of 7</span>
        <span className="phase-header__separator">·</span>
        <span className="phase-header__subtitle">{phase.subtitle}</span>
      </div>
      <h2 className="phase-header__title">
        <span className="phase-header__emoji">{phase.emoji}</span>
        {phase.name}
      </h2>
      <p className="phase-header__objective">{phase.objective}</p>

      <div className="phase-header__inputs">
        <span className="phase-header__inputs-label">Inputs:</span>
        {phase.inputs.map((input, i) => (
          <span key={i} className="phase-header__input-chip">{input}</span>
        ))}
      </div>
    </div>
  );
}
