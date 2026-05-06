import './Header.css';

export default function Header({ step, productDescription }) {
  const showProduct = step === 'phase' && productDescription;

  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__brand">
          <span className="header__logo">⬡</span>
          <span className="header__wordmark">IPDS</span>
          <span className="header__tagline">Integrated Product Development System</span>
        </div>
        {showProduct && (
          <div className="header__product">
            <span className="header__product-label">Building:</span>
            <span className="header__product-desc">{productDescription.slice(0, 60)}{productDescription.length > 60 ? '…' : ''}</span>
          </div>
        )}
      </div>
    </header>
  );
}
