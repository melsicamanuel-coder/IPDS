import { useState } from 'react';
import Button from '../shared/Button';
import './PhaseGate.css';

export default function PhaseGate({ phase, gateDecision, onConfirm, onHold, onRerun, isReadOnly }) {
  const [holdNote, setHoldNote] = useState('');
  const [showHoldInput, setShowHoldInput] = useState(false);

  if (isReadOnly && gateDecision === 'confirmed') {
    return (
      <div className="phase-gate phase-gate--confirmed">
        <div className="phase-gate__status">
          <span className="phase-gate__check">✓</span>
          <span>Phase {phase.id} Gate — Confirmed & Advanced</span>
        </div>
      </div>
    );
  }

  if (gateDecision === 'held') {
    return (
      <div className="phase-gate phase-gate--held">
        <div className="phase-gate__status">
          <span>⏸</span>
          <span>Phase {phase.id} Gate — On Hold</span>
        </div>
        {!isReadOnly && (
          <Button onClick={onRerun} variant="secondary" size="sm">
            Re-run Phase →
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="phase-gate fade-in">
      <div className="phase-gate__header">
        <span className="phase-gate__icon">✅</span>
        <h3 className="phase-gate__title">Phase {phase.id} Gate Review</h3>
      </div>

      <div className="phase-gate__criteria">
        <p className="phase-gate__criteria-label">Gate Criteria</p>
        {phase.gateCriteria.map((criterion, i) => (
          <div key={i} className="phase-gate__criterion">
            <span className="phase-gate__criterion-icon">✓</span>
            <span className="phase-gate__criterion-text">{criterion}</span>
            <span className="phase-gate__criterion-status">MET</span>
          </div>
        ))}
      </div>

      {!isReadOnly && (
        <>
          {!showHoldInput ? (
            <div className="phase-gate__actions">
              <Button variant="secondary" onClick={() => setShowHoldInput(true)}>
                Hold — needs resolution
              </Button>
              <Button onClick={onConfirm}>
                Confirm & Advance →
              </Button>
            </div>
          ) : (
            <div className="phase-gate__hold-form">
              <textarea
                className="phase-gate__hold-input"
                placeholder="Describe what needs to be resolved before advancing…"
                value={holdNote}
                onChange={(e) => setHoldNote(e.target.value)}
                rows={3}
              />
              <div className="phase-gate__actions">
                <Button variant="secondary" onClick={() => setShowHoldInput(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => onHold(holdNote)}>
                  Hold Phase
                </Button>
                <Button onClick={() => { onHold(holdNote); onRerun(); }}>
                  Hold & Re-run →
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
