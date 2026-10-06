import { SEMANTIC_RULES } from '../data/grammarData.js';

const TYPE_COLORS = {
  synthesized: { color: '#6ee7b7', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
  inherited:   { color: '#a5b4fc', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)' },
};

export default function SemanticRules() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Semantic Rules</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, color: '#6ee7b7', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
            Synthesized
          </span>
          <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, color: '#a5b4fc', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
            Inherited
          </span>
        </div>
      </div>

      {/* Explanation */}
      <div style={{
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 10,
        padding: 16,
        marginBottom: 20,
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.7,
      }}>
        <strong style={{ color: '#a5b4fc' }}>Syntax-Directed Translation</strong> attaches semantic rules to grammar
        productions. When the parser applies a production, the associated semantic rule computes an{' '}
        <em style={{ color: '#6ee7b7' }}>attribute value</em> for the grammar symbol.
        <strong style={{ color: '#6ee7b7' }}> Synthesized attributes</strong> are computed bottom-up from children.
        <strong style={{ color: '#a5b4fc' }}> Inherited attributes</strong> flow top-down from parent/sibling nodes.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
        {SEMANTIC_RULES.map((rule, i) => {
          const tc = TYPE_COLORS[rule.type];
          return (
            <div
              key={i}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {/* Header */}
              <div style={{
                padding: '10px 16px',
                borderBottom: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.88rem', fontWeight: 700, color: '#a5b4fc' }}>
                  {rule.production}
                </span>
                <span style={{
                  fontSize: '0.68rem', fontWeight: 700,
                  color: tc.color, background: tc.bg, border: `1px solid ${tc.border}`,
                  borderRadius: 9999, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {rule.type}
                </span>
              </div>
              {/* Body */}
              <div style={{ padding: 16 }}>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                    Semantic Rule
                  </div>
                  <div className="code-block" style={{ fontSize: '0.82rem', color: '#6ee7b7' }}>
                    {rule.rule}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {rule.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
