import { useState } from 'react';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';
import './ProductInput.css';

const EXAMPLES = [
  'A smart home air quality monitor with IoT sensors and mobile app',
  'A B2B SaaS tool for automating accounts payable workflows',
  'An embedded firmware system for an industrial motor controller',
];

export default function ProductInput({ onSubmit, isLoading }) {
  const [desc, setDesc] = useState('');
  const minLength = 50;
  const isValid = desc.trim().length >= minLength;

  function handleSubmit(e) {
    e.preventDefault();
    if (isValid && !isLoading) onSubmit(desc.trim());
  }

  return (
    <div className="onboarding-screen">
      <div className="onboarding-card onboarding-card--wide fade-in">
        <div className="onboarding-card__logo">
          <span className="onboarding-card__logo-icon">⬡</span>
          <span className="onboarding-card__logo-text">IPDS</span>
        </div>
        <h1 className="onboarding-card__title">What are you building?</h1>
        <p className="onboarding-card__subtitle">
          Describe your product idea. Include the problem it solves, who it's for, features, constraints,
          and whether it involves hardware, software, firmware, or a combination.
        </p>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="product-textarea-wrap">
            <textarea
              className="product-textarea"
              rows={6}
              placeholder="Describe your product idea in detail. Include the problem it solves, who it's for, any features you have in mind, constraints, and whether it involves hardware, software, firmware, or a combination."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              disabled={isLoading}
            />
            <span className={`char-count ${isValid ? 'char-count--ok' : ''}`}>
              {desc.length} / {minLength} min
            </span>
          </div>

          <div className="example-chips">
            <span className="example-chips__label">Try an example:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                className="example-chip"
                onClick={() => setDesc(ex)}
                disabled={isLoading}
              >
                {ex}
              </button>
            ))}
          </div>

          <Button type="submit" disabled={!isValid || isLoading} size="lg">
            {isLoading ? (
              <>
                <LoadingSpinner size={16} />
                Analyzing…
              </>
            ) : (
              'Analyze & Begin →'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
