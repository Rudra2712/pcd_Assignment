import { RotateCcw } from 'lucide-react';

function formatResult(val) {
  if (val === null || val === undefined) return '—';
  // Avoid floating-point noise: show up to 10 significant digits
  const num = parseFloat(val.toPrecision(10));
  return String(num);
}

function buildEvalString(evalSteps, source) {
  // Try to produce a meaningful evaluation string from steps
  if (!evalSteps || evalSteps.length === 0) return source;
  return evalSteps.map(s => s.operation).join(' → ');
}

export default function ResultCard({ result, onReset }) {
  const { source, result: val, evalSteps, success } = result;

  const display = formatResult(val);
  const lastStep = evalSteps && evalSteps.length > 0 ? evalSteps[evalSteps.length - 1] : null;

  return (
    <div className="animate-fade-in">
      <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>Final Result</h3>

      {success ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Big result */}
          <div style={{
            textAlign: 'center',
            padding: '48px 32px',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(99,102,241,0.08) 100%)',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 16,
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
              Evaluated Result
            </div>
            <div className="animate-number-pop" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
              marginBottom: 16,
            }}>
              {display}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              {source} = <span style={{ color: '#6ee7b7', fontWeight: 700 }}>{display}</span>
            </div>
          </div>

          {/* Evaluation chain */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 14 }}>
              Evaluation Chain
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {evalSteps && evalSteps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.85rem',
                    padding: '5px 12px',
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 6,
                    color: '#fcd34d',
                    fontWeight: 600,
                  }}>
                    {step.operation} = {step.result}
                  </div>
                  {i < evalSteps.length - 1 && (
                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            <MetaCard label="Original Expression" value={source} mono />
            <MetaCard label="Result" value={display} mono accent />
            <MetaCard label="Parser Used" value="LL(1) Recursive Descent" />
            <MetaCard label="Translation Method" value="Syntax-Directed Definition" />
          </div>

          <button className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={onReset}>
            <RotateCcw size={14} /> New Expression
          </button>
        </div>
      ) : (
        <div style={{
          padding: 32,
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 16,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fca5a5', marginBottom: 8 }}>
            Cannot compute result
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Fix the errors in the expression and try again.
          </div>
          <button className="btn-ghost" style={{ marginTop: 20 }} onClick={onReset}>
            <RotateCcw size={14} /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}

function MetaCard({ label, value, mono, accent }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{
        fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
        fontSize: '0.9rem',
        fontWeight: 600,
        color: accent ? '#6ee7b7' : 'var(--text-primary)',
        wordBreak: 'break-word',
      }}>
        {value}
      </div>
    </div>
  );
}
