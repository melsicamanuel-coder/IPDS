import './DeliverablesPanel.css';

export default function DeliverablesPanel({ phase }) {
  return (
    <div className="deliverables-panel">
      <h3 className="deliverables-panel__title">Phase {phase.id} Deliverables</h3>
      <ul className="deliverables-panel__list">
        {phase.deliverables.map((item, i) => (
          <li key={i} className="deliverables-panel__item">
            <span className="deliverables-panel__icon">📄</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
