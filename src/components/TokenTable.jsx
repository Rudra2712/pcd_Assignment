export default function TokenTable({ tokens }) {
  const display = tokens.filter(t => t.type !== 'EOF');

  function getTagClass(type) {
    if (type === 'NUMBER')   return 'tag-number';
    if (type === 'LPAREN' || type === 'RPAREN') return 'tag-paren';
    return 'tag-op';
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Token Stream</h3>
        <span className="badge badge-white">{display.length} tokens</span>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
      }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 48 }}>#</th>
              <th>Lexeme</th>
              <th>Token Type</th>
              <th>Numeric Value</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {display.map((tok, i) => {
              const tagClass = getTagClass(tok.type);
              return (
                <tr key={i} className="animate-slide-in" style={{ animationDelay: `${i * 35}ms` }}>
                  <td style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center' }}>
                    {i + 1}
                  </td>
                  <td>
                    <span className={tagClass} style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '1rem',
                      fontWeight: 700,
                      borderRadius: 6,
                      padding: '2px 10px',
                    }}>
                      {tok.lexeme}
                    </span>
                  </td>
                  <td>
                    <span className={tagClass} style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      borderRadius: 9999,
                      padding: '3px 10px',
                      letterSpacing: '0.04em',
                    }}>
                      {tok.type}
                    </span>
                  </td>
                  <td style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: tok.value !== null ? 'var(--accent-green)' : 'var(--text-muted)',
                  }}>
                    {tok.value !== null ? tok.value : '—'}
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    col {tok.position + 1}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          Token Categories
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { label: 'NUMBER', cls: 'tag-number' },
            { label: 'Operators (+  −  ×  ÷  %)', cls: 'tag-op' },
            { label: 'Parentheses (  )', cls: 'tag-paren' },
          ].map(g => (
            <div key={g.label} className={g.cls} style={{ padding: '4px 12px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>
              {g.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
