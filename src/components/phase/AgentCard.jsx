import ReactMarkdown from 'react-markdown';

import './AgentCard.css';

export default function AgentCard({

  agent,

  loading,

  output,

  error,

  reduced,

}) {

  const safeOutput =

    typeof output === 'string'
      ? output
      : 'No output generated.';

  return (

    <div className="agent-card">

      <div className="agent-card__header">

        <div className="agent-card__header-left">

          <div

            className="agent-card__dot"

            style={{

              '--agent-color':
                agent.color || '#B58B44',

            }}

          />

          <div className="agent-card__name">

            {agent.name}

          </div>

        </div>

        {loading && (

          <div className="agent-card__loading-badge">

            Generating

          </div>

        )}

        {!loading && reduced && (

          <div className="agent-card__reduced-badge">

            Reduced Capacity

          </div>

        )}

      </div>

      <div className="agent-card__body">

        {loading && (

          <div className="agent-card__skeleton">

            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />

          </div>

        )}

        {!loading && error && (

          <div className="agent-card__error">

            {error}

          </div>

        )}

        {!loading && !error && (

          <div className="agent-markdown">

            <ReactMarkdown>

              {safeOutput}

            </ReactMarkdown>

          </div>

        )}

      </div>

      <div className="agent-card__footer">

        {agent.department || 'IPDS Agent'}

      </div>

    </div>

  );

}