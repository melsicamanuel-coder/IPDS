import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 24, label = 'Loading…' }) {
  return (
    <div className="spinner-wrap" role="status" aria-label={label}>
      <svg
        className="spinner"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12" cy="12" r="10"
          stroke="var(--border-strong)"
          strokeWidth="2.5"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
