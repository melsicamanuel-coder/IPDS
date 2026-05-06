import './Button.css';

export default function Button({ children, variant = 'primary', onClick, disabled, type = 'button', size = 'md' }) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
