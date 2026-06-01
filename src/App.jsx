import { useCallback } from 'react';

import LandingPage from './components/landing/LandingPage';

import { useIPDS } from './hooks/useIPDS';

import { PHASES } from './data/phases';

import Header from './components/layout/Header';

import PhaseProgressBar from './components/layout/PhaseProgressBar';

import ApiKeyInput from './components/onboarding/ApiKeyInput';

import ProductInput from './components/onboarding/ProductInput';

import ProductClassification from './components/classification/ProductClassification';

import PhaseContainer from './components/phase/PhaseContainer';

import './styles/global.css';

import ReactMarkdown from 'react-markdown';

import remarkGfm from 'remark-gfm';

export default function App() {

  const {

    state,

    launchPlatform,

    setApiKey,

    setProduct,

    classify,

    runPhase,

    generateSummary,

    confirmGate,

    holdGate,

    navigateToPhase,

    rerunPhase,

  } = useIPDS();

  const {

    step,

    apiKey,

    productDescription,

    classification,

    isClassifying,

    classificationError,

    currentPhase,

    phaseOutputs,

    phaseLoadingAgents,

    phaseErrors,

    phaseStatus,

    gateDecisions,

    summaryOutput,

  } = state;

  const handleProduct =
    useCallback((desc) => {

      setProduct(desc);

      classify(apiKey, desc);

    }, [

      apiKey,

      classify,

      setProduct,

    ]);

  const currentPhaseData =
    PHASES[currentPhase - 1];

  /*
    LANDING PAGE
  */

  if (step === 'landing') {

    return (

      <LandingPage
        onLaunch={launchPlatform}
      />

    );

  }

  /*
    MAIN APP
  */

  return (

    <div className="app-shell">

      <Header
        step={step}
        productDescription={
          productDescription
        }
      />

      {step === 'api-key' && (

        <ApiKeyInput
          onSubmit={setApiKey}
        />

      )}

      {step === 'product-input' && (

        <ProductInput
          onSubmit={handleProduct}
          isLoading={isClassifying}
        />

      )}

      {step === 'classification' && (

        <ProductClassification
          classification={classification}
          isLoading={isClassifying}
          error={classificationError}
          onBegin={() => runPhase(1)}
        />

      )}

      {step === 'phase' && (

        <>

          <PhaseProgressBar
            currentPhase={currentPhase}
            gateDecisions={gateDecisions}
            onNavigate={navigateToPhase}
          />

          <>
            <PhaseContainer
              phase={currentPhaseData}
              phaseStatus={phaseStatus[currentPhase]}
              loadingAgents={phaseLoadingAgents[currentPhase] || {}}
              outputs={phaseOutputs[currentPhase] || {}}
              errors={phaseErrors[currentPhase] || {}}
              gateDecision={gateDecisions[currentPhase]}
              onConfirm={confirmGate}
              onHold={holdGate}
              onRerun={rerunPhase}
              runPhase={runPhase}
            />

            {currentPhase === 7 && (
              <div className="phase-container container">
                <div
                  className="agent-card-header"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 24px',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      minWidth: '12px',
                      borderRadius: '50%',
                      background: '#6c63ff',
                    }}
                  />

                  <h3>Executive Summary AI</h3>
                </div>
{!summaryOutput && (
                  <div style={{ padding: '24px', textAlign: 'center' }}>
                    <button className="summary-btn" onClick={generateSummary}>
                      Generate Executive Summary
                    </button>
                  </div>
                )}
                {summaryOutput && (
                  <>
                    <div className="summary-banner">
                      <h2>Integrated Product Development Report</h2>
                      <p>Executive Review & Launch Readiness Assessment</p>
                    </div>

                    <div style={{ padding: '24px' }}>
                      <div className="summary-report">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{summaryOutput}</ReactMarkdown>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </>

        </>

      )}

    </div>

  );
}