/**
 * PhaseSummaryBlock.jsx
 *
 * A self-contained "Phase Summary" panel that fetches an AI-generated
 * natural-language summary of a given IPDS phase via the Anthropic API.
 *
 * @component
 * @param {Object}  props
 * @param {number}  props.phaseId        – Phase number (1–7) corresponding to PHASES index
 * @param {Object}  props.classification – Classification object from useIPDS state, containing:
 *   @param {string} props.classification.type        – Product type
 *   @param {string} props.classification.summary     – Product summary
 *   @param {string} props.classification.intent      – Product intent
 *   @param {string} props.classification.targetUsers – Target user description
 *   @param {string} props.classification.constraints – Known constraints
 *
 * @example
 *   <PhaseSummaryBlock phaseId={currentPhase} classification={classification} />
 *
 * Usage: Import and drop into App.jsx or PhaseContainer.jsx manually.
 * This file does NOT modify any existing project file.
 */

import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { PHASES } from '../data/phases';

/* ──────────────────────────────── Inline styles ──────────────────────────────── */

const styles = {
  wrapper: {
    background: 'linear-gradient(145deg, #161618 0%, #0f0f0f 100%)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '14px',
    padding: '28px 28px 22px',
    marginTop: '16px',
    marginBottom: '16px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    color: '#e4e4e7',
  },

  /* Decorative top accent bar */
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #B58B44 0%, #d4a95a 40%, #B58B44 100%)',
    borderRadius: '14px 14px 0 0',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },

  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  icon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(181, 139, 68, 0.12)',
    border: '1px solid rgba(181, 139, 68, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    flexShrink: 0,
  },

  title: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#ffffff',
    letterSpacing: '0.015em',
    margin: 0,
  },

  subtitle: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 400,
    marginTop: '2px',
  },

  regenerateBtn: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
    padding: '6px 14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'inherit',
    letterSpacing: '0.01em',
  },

  /* Markdown body area */
  markdownBody: {
    fontSize: '13.5px',
    lineHeight: 1.72,
    color: '#d1d1d6',
  },

  /* Skeleton loader */
  skeletonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  /* Error state */
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.18)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '13px',
    color: '#f87171',
  },

  retryBtn: {
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    borderRadius: '6px',
    color: '#f87171',
    fontSize: '12px',
    padding: '5px 12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    flexShrink: 0,
    marginLeft: '12px',
    transition: 'all 0.2s ease',
  },
};

/* ─────────────────── Skeleton line keyframe (injected once) ─────────────────── */

const SKELETON_KEYFRAME_ID = 'psb-skeleton-pulse';

function ensureKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(SKELETON_KEYFRAME_ID)) return;

  const sheet = document.createElement('style');
  sheet.id = SKELETON_KEYFRAME_ID;
  sheet.textContent = `
    @keyframes psbPulse {
      0%, 100% { opacity: 0.35; }
      50%      { opacity: 0.12; }
    }
    /* Scoped markdown overrides for PhaseSummaryBlock */
    .psb-markdown h1,
    .psb-markdown h2,
    .psb-markdown h3,
    .psb-markdown h4 {
      color: #ffffff;
      margin-top: 18px;
      margin-bottom: 6px;
      font-weight: 600;
    }
    .psb-markdown h2 { font-size: 15px; }
    .psb-markdown h3 { font-size: 14px; }
    .psb-markdown p {
      margin: 6px 0 10px;
      color: #d1d1d6;
    }
    .psb-markdown strong {
      color: #ffffff;
      font-weight: 600;
    }
    .psb-markdown ul,
    .psb-markdown ol {
      padding-left: 20px;
      margin: 6px 0 10px;
    }
    .psb-markdown li {
      margin-bottom: 4px;
    }
    .psb-markdown li::marker {
      color: rgba(181, 139, 68, 0.7);
    }
    .psb-markdown code {
      background: rgba(255,255,255,0.06);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12.5px;
    }
    .psb-markdown hr {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.06);
      margin: 14px 0;
    }
  `;
  document.head.appendChild(sheet);
}

/* ────────────────────── Skeleton component ────────────────────── */

function SkeletonLines() {
  const widths = ['92%', '78%', '85%', '60%'];
  return (
    <div style={styles.skeletonContainer}>
      {widths.map((w, i) => (
        <div
          key={i}
          style={{
            height: '14px',
            width: w,
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.06)',
            animation: 'psbPulse 1.8s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────── Regenerate icon (inline SVG) ─────────────────────── */

function RefreshIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

/* ═══════════════════════════ Main Component ═══════════════════════════ */

export default function PhaseSummaryBlock({ phaseId, classification }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inject keyframes + markdown styles on first render
  useEffect(() => {
    ensureKeyframes();
  }, []);

  /**
   * Fetches a phase summary from the Anthropic API.
   */
  const fetchSummary = useCallback(async () => {
    if (!phaseId || phaseId < 1 || phaseId > PHASES.length) return;

    const phase = PHASES[phaseId - 1];

    const prompt = `
You are summarizing Phase ${phase.id}: "${phase.name}" of an Integrated Product Development System.

Product Context:
- Type: ${classification?.type ?? 'N/A'}
- Summary: ${classification?.summary ?? 'N/A'}
- Intent: ${classification?.intent ?? 'N/A'}
- Target Users: ${classification?.targetUsers ?? 'N/A'}
- Constraints: ${classification?.constraints ?? 'N/A'}

Phase Details:
- Objective: ${phase.objective}
- Gate Criteria: ${phase.gateCriteria}
- Deliverables: ${phase.deliverables?.join(', ')}
- Active Agents: ${phase.activeAgents?.join(', ')}

Write a structured summary with these sections:
1. **Phase Purpose** – What this phase achieves and why it's critical
2. **What Happens** – Step-by-step of agent activity during this phase
3. **Key Deliverables** – What outputs are produced and their significance
4. **Gate Criteria** – What must be true before moving forward
5. **Tailored Insight** – One specific insight based on the product type and constraints above

Keep it concise but substantive. Use markdown formatting.
`;

    setLoading(true);
    setError(null);
    setSummary('');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-5',
          max_tokens: 1024,
          system:
            'You are an expert product development advisor embedded inside an IPDS workflow tool. Write clear, structured, developer-friendly summaries.',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`API error ${response.status}: ${errBody.slice(0, 200)}`);
      }

      const data = await response.json();
      const text = data.content?.[0]?.text ?? '';

      if (!text) {
        throw new Error('Empty response received from API.');
      }

      setSummary(text);
    } catch (err) {
      console.error('[PhaseSummaryBlock] Fetch failed:', err);
      setError(err.message || 'Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  }, [phaseId, classification]);

  // Trigger fetch whenever phaseId changes
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  /* ───── Hover helpers (inline since no external CSS) ───── */
  const handleRegenerateHover = (e, hovering) => {
    e.currentTarget.style.background = hovering
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(255, 255, 255, 0.04)';
    e.currentTarget.style.color = hovering
      ? 'rgba(255, 255, 255, 0.75)'
      : 'rgba(255, 255, 255, 0.5)';
    e.currentTarget.style.borderColor = hovering
      ? 'rgba(255, 255, 255, 0.14)'
      : 'rgba(255, 255, 255, 0.08)';
  };

  const handleRetryHover = (e, hovering) => {
    e.currentTarget.style.background = hovering
      ? 'rgba(239, 68, 68, 0.2)'
      : 'rgba(239, 68, 68, 0.12)';
  };

  const phase = phaseId >= 1 && phaseId <= PHASES.length ? PHASES[phaseId - 1] : null;

  return (
    <div style={styles.wrapper}>
      {/* Accent bar */}
      <div style={styles.accentBar} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <div style={styles.icon}>✦</div>
          <div>
            <h3 style={styles.title}>
              Phase Summary{phase ? ` — ${phase.name}` : ''}
            </h3>
            <div style={styles.subtitle}>AI-generated overview</div>
          </div>
        </div>

        {!loading && (
          <button
            style={styles.regenerateBtn}
            onClick={fetchSummary}
            onMouseEnter={(e) => handleRegenerateHover(e, true)}
            onMouseLeave={(e) => handleRegenerateHover(e, false)}
            aria-label="Regenerate summary"
          >
            <RefreshIcon />
            Regenerate
          </button>
        )}
      </div>

      {/* Body */}
      {loading && <SkeletonLines />}

      {!loading && error && (
        <div style={styles.errorBox}>
          <span>⚠ {error}</span>
          <button
            style={styles.retryBtn}
            onClick={fetchSummary}
            onMouseEnter={(e) => handleRetryHover(e, true)}
            onMouseLeave={(e) => handleRetryHover(e, false)}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && summary && (
        <div className="psb-markdown" style={styles.markdownBody}>
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
