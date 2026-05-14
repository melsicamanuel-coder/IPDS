export default function PricingSection() {

  return (

    <section
      id="pricing"
      className="landing-section"
    >

      <div className="section-container">

        <p className="section-label">
          PRICING
        </p>

        <h2 className="section-title">
          Simple enterprise pricing
        </h2>

        <div className="pricing-grid">

          <div className="pricing-card">

            <h3>Starter</h3>

            <div className="price">
              Free
            </div>

            <p>
              Explore the orchestration platform.
            </p>

          </div>

          <div className="pricing-card featured">

            <h3>Professional</h3>

            <div className="price">
              $49/mo
            </div>

            <p>
              Full multi-agent orchestration suite.
            </p>

          </div>

          <div className="pricing-card">

            <h3>Enterprise</h3>

            <div className="price">
              Custom
            </div>

            <p>
              Advanced deployment and integrations.
            </p>

          </div>

        </div>

      </div>

    </section>

  );

}