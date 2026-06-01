import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function SummaryPanel({
  summaryOutput,
  onGenerate,
}) {

  return (

    <div className="agent-card">

      <div className="agent-card-header">

        <div className="agent-status-dot" />

        <h3>
          Executive Summary AI
        </h3>

      </div>

      {!summaryOutput && (

        <div
          style={{
            padding: '20px',
          }}
        >

          <button
            className="summary-btn"
            onClick={onGenerate}
          >
            Generate Executive Summary
          </button>

        </div>

      )}

      {summaryOutput && (

        <div className="agent-card-body">

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
          >
            {summaryOutput}
          </ReactMarkdown>

        </div>

      )}

      <div className="agent-card-footer">

        IPDS AGENT

      </div>

    </div>

  );

}
