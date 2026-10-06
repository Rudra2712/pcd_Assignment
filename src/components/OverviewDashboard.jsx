import { Hash, Code, CheckCircle2, XCircle, FileCode, Layers } from 'lucide-react';

export default function OverviewDashboard({ result }) {
  const { source, tokens, success, errors, stage } = result;
  const displayTokens = tokens.filter(t => t.type !== 'EOF');

  const cards = [
    { icon: <FileCode size={18} />, label: 'Input Expression', value: source || '—', mono: true },
    { icon: <Hash size={18} />,     label: 'Token Count',      value: displayTokens.length },
    { icon: <Layers size={18} />,   label: 'Grammar',          value: 'LL(1)' },
    { icon: <Code size={18} />,     label: 'Parser',           value: 'Recursive Descent' },
    {
      icon: success ? <CheckCircle2 size={18} /> : <XCircle size={18} />,
      label: 'Status',
      value: success ? 'Successfully Parsed' : 'Parse Failed',
      statusColor: success ? 'var(--accent-green)' : 'var(--accent-red)',
    },
    { icon: <Hash size={18} />, label: 'Final Result', value: result.result !== null ? String(result.result) : '—', mono: true, big: true },
  ];

  return (
    <div className="animate-fade-in">
      <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 20, color: 'var(--text-primary)' }}>
        Compilation Overview
      </h3>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14, marginBottom: 28 }}>
        {cards.map((c, i) => (
          <div key={i} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 55}ms` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: c.statusColor || 'var(--text-muted)' }}>
              {c.icon}
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {c.label}
              </span>
            </div>
            <div style={{
              fontFamily: c.mono ? "'JetBrains Mono', monospace" : 'inherit',
              fontSize: c.big ? '1.6rem' : (c.mono && c.value.length > 10 ? '0.82rem' : '1rem'),
              fontWeight: c.big ? 800 : 600,
              color: c.statusColor || (c.big ? 'var(--text-primary)' : 'var(--text-primary)'),
              wordBreak: 'break-all',
              lineHeight: 1.3,
            }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
          Compilation Pipeline
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { name: 'Source',         done: true },
            { name: 'Lexer',          done: true },
            { name: 'Tokens',         done: true },
            { name: 'LL(1) Parser',   done: stage === 'complete' || stage === 'parser' },
            { name: 'Parse Tree',     done: stage === 'complete' },
            { name: 'Attribute Eval', done: stage === 'complete' },
            { name: 'Result',         done: stage === 'complete' && success },
          ].map((step, i, arr) => (
            <div key={step.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                padding: '5px 11px',
                borderRadius: 6,
                fontSize: '0.73rem',
                fontWeight: 600,
                background: step.done
                  ? (success ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.07)')
                  : 'var(--bg-card)',
                border: `1px solid ${step.done
                  ? (success ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)')
                  : 'var(--border)'}`,
                color: step.done
                  ? (success ? 'var(--accent-green)' : 'var(--accent-red)')
                  : 'var(--text-muted)',
                transition: 'all 0.3s',
              }}>
                {step.name}
              </div>
              {i < arr.length - 1 && (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error summary */}
      {errors.length > 0 && (
        <div style={{
          padding: 16,
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 10,
        }}>
          <div style={{ fontWeight: 600, color: 'var(--accent-red)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem' }}>
            <XCircle size={15} />
            {errors.length} Error{errors.length > 1 ? 's' : ''} Detected
          </div>
          {errors.map((err, i) => (
            <div key={i} style={{ fontSize: '0.82rem', color: 'var(--accent-red)', marginTop: 4, fontFamily: "'JetBrains Mono', monospace", opacity: 0.85 }}>
              {err.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
