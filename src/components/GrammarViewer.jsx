import { GRAMMAR_PRODUCTIONS, NON_TERMINALS, TERMINALS, START_SYMBOL, GRAMMAR_EXPLANATION } from '../data/grammarData.js';

export default function GrammarViewer() {
  const groups = [
    { title: 'Expression Rules', ids: [1, 2, 3, 4] },
    { title: 'Term Rules', ids: [5, 6, 7, 8, 9] },
    { title: 'Factor Rules', ids: [10, 11, 12] },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Formal Grammar</h3>
        <span className="badge badge-white">LL(1) Compatible</span>
      </div>

      {/* Productions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
        {groups.map(group => (
          <div key={group.title} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '9px 16px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
            }}>
              <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{group.title}</span>
            </div>
            <div style={{ padding: 16 }}>
              {group.ids.map((id, idx) => {
                const prod = GRAMMAR_PRODUCTIONS.find(p => p.id === id);
                const isLast = idx === group.ids.length - 1;
                return (
                  <div key={id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom: !isLast ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', minWidth: 20, paddingTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
                      {id}.
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.88rem' }}>
                        {/* LHS */}
                        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{prod.lhs}</span>
                        <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>→</span>
                        {/* RHS tokens */}
                        {prod.rhs.split(' ').map((sym, si) => (
                          <span key={si} style={{ marginRight: 4 }}>
                            {sym === 'ε' ? (
                              <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{sym}</span>
                            ) : NON_TERMINALS.includes(sym) ? (
                              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{sym}</span>
                            ) : (
                              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{sym}</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5 }}>
                        {prod.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Symbol legend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 24 }}>
        <LegendCard title="Non-Terminals" items={NON_TERMINALS} bold />
        <LegendCard title="Terminals" items={TERMINALS} />
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Start Symbol</div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{START_SYMBOL}</span>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 6 }}>E represents the complete arithmetic expression.</div>
        </div>
      </div>

      {/* Explanation cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
        {Object.entries(GRAMMAR_EXPLANATION).map(([key, text]) => (
          <div key={key} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 600, fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegendCard({ title, items, bold }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
      <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {items.map(sym => (
          <span key={sym} className="tag-number" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.82rem',
            fontWeight: bold ? 700 : 500,
            borderRadius: 6,
            padding: '3px 10px',
          }}>
            {sym}
          </span>
        ))}
      </div>
    </div>
  );
}
