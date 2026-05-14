import './LandingPage.css';

export default function Navbar({ onLaunch }) {

  return (

    <nav className="landing-navbar">

      <div className="landing-navbar__logo">
        IPDS
      </div>

      <div className="landing-navbar__actions">

        <button
          className="landing-navbar__button"
          onClick={onLaunch}
        >
          Launch App
        </button>

      </div>

    </nav>

  );

}