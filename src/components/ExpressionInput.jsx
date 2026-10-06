import { useState } from 'react';
import { Play, Zap, AlertCircle } from 'lucide-react';
import { EXAMPLES, ERROR_EXAMPLES } from '../data/examples.js';

export default function ExpressionInput({ onAnalyze, loading }) {
  const [expr, setExpr] = useState('3 + 5 * 2');

  function handleSubmit(e) {
    e.preventDefault();
    onAnalyze(expr);
  }

  function loadExample(ex) {
    setExpr(ex.expr);
    onAnalyze(ex.expr);
  }

  return (
    <div className="glass-card animate-fade-in" style={{ padding: 28, marginBottom: 24 }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Zap size={18} style={{ color: 'var(--accent-primary)' }} />
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Expression Input</h2>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <input
              id="expression-input"
              type="text"
              value={expr}
              onChange={e => setExpr(e.target.value)}
              placeholder="Enter arithmetic expression…"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(10,14,26,0.8)',
                border: '1px solid var(--border-light)',
                borderRadius: 8,
                color: 'var(--text-primary)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--accent-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border-light)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: 160 }}>
            <Play size={16} />
            {loading ? 'Analyzing…' : 'Analyze Expression'}
          </button>
        </div>
      </form>

      {/* Example buttons */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Valid Examples
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EXAMPLES.map(ex => (
            <button
              key={ex.label}
              className="btn-ghost"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}
              onClick={() => loadExample(ex)}
              title={ex.desc}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error examples */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-red)', marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertCircle size={12} />
          Error Examples
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ERROR_EXAMPLES.map(ex => (
            <button
              key={ex.label}
              className="btn-ghost"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.8rem',
                borderColor: 'rgba(239,68,68,0.3)',
                color: '#fca5a5',
              }}
              onClick={() => loadExample(ex)}
              title={ex.desc}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
