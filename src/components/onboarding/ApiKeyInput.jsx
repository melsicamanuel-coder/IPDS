import { useState } from 'react';
import Button from '../shared/Button';
import './ApiKeyInput.css';

export default function ApiKeyInput({ onSubmit }) {
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);

  const isValid = key.trim().startsWith('gsk_') && key.trim().length > 20;

  function handleSubmit(e) {
    e.preventDefault();
    if (isValid) onSubmit(key.trim());
  }

  return (
    <div className="onboarding-screen">
      <div className="onboarding-card fade-in">
        <div className="onboarding-card__logo">
          <span className="onboarding-card__logo-icon">⬡</span>
          <span className="onboarding-card__logo-text">IPDS</span>
        </div>
        <h1 className="onboarding-card__title">Connect your Groq API</h1>
        <p className="onboarding-card__subtitle">
          Your key is stored only in your browser session and never sent anywhere except Groq's servers.
        </p>

        <form className="onboarding-card__form" onSubmit={handleSubmit}>
          <div className="api-key-field">
            <input
              type={show ? 'text' : 'password'}
              className="api-key-input"
              placeholder="gsk_..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              className="api-key-toggle"
              onClick={() => setShow(!show)}
              tabIndex={-1}
            >
              {show ? '🙈' : '👁️'}
            </button>
          </div>

          <Button type="submit" disabled={!isValid} size="lg">
            Continue →
          </Button>
        </form>

        <a
          href="https://console.groq.com"
          target="_blank"
          rel="noreferrer"
          className="onboarding-card__link"
        >
          Get a free Groq API key →
        </a>
      </div>
    </div>
  );
}
