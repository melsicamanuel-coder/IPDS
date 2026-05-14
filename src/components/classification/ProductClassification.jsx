import './ProductClassification.css';

export default function ProductClassification({

  classification,

  isLoading,

  error,

  onBegin,

}) {

  if (isLoading) {

    return (

      <div className="product-classification">

        <h1 className="product-classification__title">
          Classifying Product...
        </h1>

      </div>

    );

  }

  if (error) {

    return (

      <div className="product-classification">

        <h1 className="product-classification__title">
          Classification Failed
        </h1>

        <p className="product-classification__description">
          {error}
        </p>

      </div>

    );

  }

  if (!classification) return null;

  const {

    type,

    summary,

    intent,

    targetUsers,

    constraints,

    agents,

  } = classification;

  return (

    <div className="product-classification">

      <div className="product-classification__type">
        {type || 'PRODUCT'}
      </div>

      <h1 className="product-classification__title">
        Product Classified
      </h1>

      <p className="product-classification__description">
        {summary || 'No summary generated.'}
      </p>

      <div className="product-classification__details">

        <div className="product-classification__row">

          <div className="product-classification__label">
            PRODUCT INTENT
          </div>

          <div className="product-classification__value">
            {intent || 'Not generated'}
          </div>

        </div>

        <div className="product-classification__row">

          <div className="product-classification__label">
            TARGET USERS
          </div>

          <div className="product-classification__value">

            {targetUsers ||

             classification.target_users ||

             classification.users ||

             'Target users not generated'}

          </div>

        </div>

        <div className="product-classification__row">

          <div className="product-classification__label">
            KEY CONSTRAINTS
          </div>

          <div className="product-classification__value">
            {constraints || 'No constraints generated'}
          </div>

        </div>

      </div>

      <div className="product-classification__agents">

        <h2 className="product-classification__agents-title">
          ACTIVE SUB-AGENTS
        </h2>

        <div className="product-classification__agent-list">

          {(agents || []).map((agent, index) => (

            <div
              key={index}
              className="product-classification__agent"
            >

              {agent.name}

              <span>
                {agent.mode}
              </span>

            </div>

          ))}

        </div>

      </div>

      <button

        className="product-classification__button"

        onClick={onBegin}

      >

        Begin Phase 1 →

      </button>

    </div>

  );

}