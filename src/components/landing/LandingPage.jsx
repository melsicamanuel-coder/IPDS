import Navbar from './Navbar';
import HeroSection from './HeroSection';

import PhasesSection from './PhasesSection';
import AgentsSection from './AgentsSection';
import PricingSection from './PricingSection';
import Footer from './Footer';

import './LandingPage.css';

export default function LandingPage({ onLaunch }) {

  return (

    <div className="landing-page">

      <Navbar onLaunch={onLaunch} />

      <HeroSection onLaunch={onLaunch} />

      <PhasesSection />

      <AgentsSection />

      <PricingSection />

      <Footer />

    </div>

  );

}