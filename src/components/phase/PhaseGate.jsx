import './PhaseGate.css';

export default function PhaseGate({
  phase,
  gateDecision,
  onConfirm,
  onHold,
  onRerun,
  isReadOnly,
}) {

  return (
    <div className="phase-gate">

      <h2 className="phase-gate__title">
        Phase {phase.id} Gate Review
      </h2>

      <div className="phase-gate__review">

        <div className="phase-gate__review-title">
          Gate Criteria
        </div>

        <div className="phase-gate__review-list">

          {phase.gateCriteria.map((item, index) => (
            <div
              key={index}
              className="phase-gate__review-item"
            >

              <div className="phase-gate__review-text">

                <div className="phase-gate__review-check">
                  ✓
                </div>

                <span>{item}</span>

              </div>

              <div className="phase-gate__review-status">
                MET
              </div>

            </div>
          ))}

        </div>

      </div>

      {!isReadOnly && (

        <div className="phase-gate__actions">

          <button
            className="phase-gate__button phase-gate__button--hold"
            onClick={() => onHold('Needs further review')}
          >
            Hold — needs resolution
          </button>

          <button
            className="phase-gate__button phase-gate__button--confirm"
            onClick={onConfirm}
          >
            Confirm & Advance →
          </button>

    

        </div>

      )}

      {isReadOnly && gateDecision && (

  <div
    className={`phase-gate__decision ${
      gateDecision === 'approved'
        ? 'phase-gate__decision--approved'
        : 'phase-gate__decision--held'
    }`}
  >

    {phase.id === 7
      ? 'Project Completed Successfully'
      : gateDecision === 'approved'
        ? 'Phase Approved'
        : 'Phase On Hold'}

  </div>

)}

    </div>
  );
}