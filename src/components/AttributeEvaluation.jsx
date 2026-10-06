import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

const OP_SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷', '%': 'mod', 'unary -': '−' };

export default function AttributeEvaluation({ evalSteps }) {
  const [current, setCurrent] = useState(-1); // -1 = show all
  const [playing, setPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  function reset() {
    setCurrent(-1);
    if (intervalId) { clearInterval(intervalId); setIntervalId(null); setPlaying(false); }
  }

  function togglePlay() {
    if (playing) {
      clearInterval(intervalId);
      setIntervalId(null);
      setPlaying(false);
    } else {
      setCurrent(0);
      setPlaying(true);
      const id = setInterval(() => {
        setCurrent(c => {
          if (c >= evalSteps.length - 1) {
            clearInterval(id);
            setPlaying(false);
            return c;
          }
          return c + 1;
        });
      }, 800);
      setIntervalId(id);
    }
  }

  if (!evalSteps || evalSteps.length === 0) {
    return <div style={{ color: 'var(--text-muted)', padding: 20 }}>No attribute evaluation data available.</div>;
  }

  const visibleSteps = current === -1 ? evalSteps : evalSteps.slice(0, current + 1);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Attribute Evaluation</h3>
        <span className="badge badge-green">{evalSteps.length} evaluation steps</span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <button className="btn-ghost" onClick={reset}><RotateCcw size={14} /> Show All</button>
        <button className="btn-ghost" onClick={() => setCurrent(c => Math.max(0, c === -1 ? evalSteps.length - 1 : c - 1))}>
          <ChevronLeft size={14} /> Prev
        </button>
        <button className="btn-ghost" onClick={() => setCurrent(c => Math.min(evalSteps.length - 1, c + 1))}>
          Next <ChevronRight size={14} />
        </button>
        <button className="btn-ghost" onClick={togglePlay}>
          {playing ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Animate</>}
        </button>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {current === -1 ? 'All steps' : `Step ${current + 1} of ${evalSteps.length}`}
        </span>
      </div>

      {/* Step visualization cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {evalSteps.map((step, i) => {
          const visible = current === -1 || i <= current;
          const isActive = i === current;
          return (
            <div
              key={i}
              style={{
                opacity: visible ? 1 : 0.15,
                transition: 'all 0.4s',
                transform: isActive ? 'scale(1.01)' : 'scale(1)',
              }}
            >
              <div style={{
                background: isActive ? 'rgba(16,185,129,0.08)' : 'var(--bg-card)',
                border: `1px solid ${isActive ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
                borderRadius: 10,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}>
                {/* Step number */}
                <div style={{
                  width: 32, height: 32,
                  borderRadius: 8,
                  background: isActive ? 'var(--accent-green)' : 'rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem',
                  color: isActive ? '#fff' : '#a5b4fc',
                  flexShrink: 0,
                }}>
                  {step.order}
                </div>

                {/* Node */}
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Node</div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: '#6ee7b7', fontSize: '0.88rem' }}>
                    {step.node}
                  </span>
                </div>

                {/* Production */}
                <div style={{ minWidth: 150 }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Production</div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#a5b4fc', fontSize: '0.82rem' }}>
                    {step.production}
                  </span>
                </div>

                {/* Operation */}
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Computation</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {step.operator ? (
                      step.operator === 'unary -' ? (
                        <span>
                          <span style={{ color: '#a5b4fc' }}>−</span>
                          <span style={{ color: '#fcd34d' }}>({step.right})</span>
                          <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>=</span>
                          <span style={{ color: '#f59e0b', fontWeight: 700 }}>{step.result}</span>
                        </span>
                      ) : (
                        <span>
                          <span style={{ color: '#fcd34d' }}>{step.left}</span>
                          <span style={{ color: '#a5b4fc', margin: '0 6px' }}>{OP_SYMBOLS[step.operator] || step.operator}</span>
                          <span style={{ color: '#fcd34d' }}>{step.right}</span>
                          <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>=</span>
                          <span style={{ color: '#f59e0b', fontWeight: 700 }}>{step.result}</span>
                        </span>
                      )
                    ) : step.operation}
                  </div>
                </div>

                {/* Result badge */}
                <div style={{
                  padding: '6px 16px',
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: 8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#fcd34d',
                  minWidth: 60,
                  textAlign: 'center',
                }}>
                  {step.result}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attribute evaluation table */}
      <h4 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 12 }}>Attribute Table</h4>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 48 }}>Order</th>
              <th>Node</th>
              <th>Production</th>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {evalSteps.map((step, i) => (
              <tr key={i} className={i === current ? 'highlighted' : ''}>
                <td style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', textAlign: 'center' }}>{step.order}</td>
                <td style={{ fontFamily: "'JetBrains Mono', monospace", color: '#6ee7b7', fontWeight: 600 }}>{step.node}</td>
                <td style={{ fontFamily: "'JetBrains Mono', monospace", color: '#a5b4fc', fontSize: '0.82rem' }}>{step.production}</td>
                <td>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#c4b5fd', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(139,92,246,0.3)' }}>
                    {step.attribute}
                  </span>
                </td>
                <td style={{ fontFamily: "'JetBrains Mono', monospace", color: '#fcd34d', fontWeight: 700 }}>{step.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
