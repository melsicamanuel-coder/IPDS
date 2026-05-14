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

export default function App() {

  const {

    state,

    launchPlatform,

    setApiKey,

    setProduct,

    classify,

    runPhase,

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

          <PhaseContainer
            phase={currentPhaseData}
            phaseStatus={
              phaseStatus[currentPhase]
            }
            loadingAgents={
              phaseLoadingAgents[
                currentPhase
              ] || {}
            }
            outputs={
              phaseOutputs[
                currentPhase
              ] || {}
            }
            errors={
              phaseErrors[
                currentPhase
              ] || {}
            }
            gateDecision={
              gateDecisions[
                currentPhase
              ]
            }
            onConfirm={confirmGate}
            onHold={holdGate}
            onRerun={rerunPhase}
            runPhase={runPhase}
          />

        </>

      )}

    </div>

  );

}