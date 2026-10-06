import { AlertTriangle, XCircle, AlertCircle, Lightbulb } from 'lucide-react';

const ERROR_TYPE_META = {
  LEXER_ERROR:  { icon: <AlertCircle size={16} />, label: 'Lexical Error',  color: '#fcd34d', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
  SYNTAX_ERROR: { icon: <XCircle size={16} />,     label: 'Syntax Error',   color: '#fca5a5', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)' },
  PARSER_ERROR: { icon: <AlertTriangle size={16} />, label: 'Parser Error', color: '#fca5a5', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)' },
};

export default function ErrorPanel({ errors }) {
  if (!errors || errors.length === 0) {
    return (
      <div style={{
        padding: 32,
        background: 'rgba(16,185,129,0.06)',
        border: '1px solid rgba(16,185,129,0.25)',
        borderRadius: 12,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✅</div>
        <div style={{ fontWeight: 700, color: '#6ee7b7', fontSize: '1rem', marginBottom: 4 }}>No Errors</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Expression parsed and evaluated successfully.
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <AlertTriangle size={18} style={{ color: '#fca5a5' }} />
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Errors Detected</h3>
        <span className="badge badge-red">{errors.length}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {errors.map((err, i) => {
          const meta = ERROR_TYPE_META[err.type] || ERROR_TYPE_META.PARSER_ERROR;
          return (
            <div key={i} style={{
              background: meta.bg,
              border: `1px solid ${meta.border}`,
              borderRadius: 12,
              overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                padding: '10px 16px',
                borderBottom: `1px solid ${meta.border}`,
                display: 'flex', alignItems: 'center', gap: 8,
                color: meta.color,
                fontWeight: 700,
                fontSize: '0.85rem',
              }}>
                {meta.icon}
                {meta.label}
                {err.position !== undefined && err.position >= 0 && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                    Position {err.position + 1}
                  </span>
                )}
              </div>
              {/* Body */}
              <div style={{ padding: 16 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.88rem', color: meta.color, marginBottom: 10 }}>
                  {err.message}
                </div>

                {err.token && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    Offending token: <span style={{ fontFamily: "'JetBrains Mono', monospace", color: meta.color }}>{err.token}</span>
                  </div>
                )}

                {err.expected && err.expected.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                      Expected
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {err.expected.map(ex => (
                        <span key={ex} style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.78rem', fontWeight: 600,
                          color: '#6ee7b7', background: 'rgba(16,185,129,0.1)',
                          border: '1px solid rgba(16,185,129,0.3)',
                          borderRadius: 4, padding: '2px 8px',
                        }}>
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {err.suggestion && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 8, padding: '8px 12px',
                    fontSize: '0.8rem', color: '#a5b4fc',
                  }}>
                    <Lightbulb size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                    {err.suggestion}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
