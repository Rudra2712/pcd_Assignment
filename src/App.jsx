import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import ExpressionInput from './components/ExpressionInput.jsx';
import OverviewDashboard from './components/OverviewDashboard.jsx';
import TokenTable from './components/TokenTable.jsx';
import GrammarViewer from './components/GrammarViewer.jsx';
import ParsingSteps from './components/ParsingSteps.jsx';
import ParseTreeView from './components/ParseTreeView.jsx';
import SemanticRules from './components/SemanticRules.jsx';
import AttributeEvaluation from './components/AttributeEvaluation.jsx';
import ResultCard from './components/ResultCard.jsx';
import ErrorPanel from './components/ErrorPanel.jsx';
import ConceptsPanel from './components/ConceptsPanel.jsx';
import { compile } from './compiler/compiler.js';

const TABS = [
  { id: 'overview',    label: 'Overview' },
  { id: 'tokens',      label: 'Tokens' },
  { id: 'grammar',     label: 'Grammar' },
  { id: 'parsing',     label: 'Parsing Steps' },
  { id: 'tree',        label: 'Parse Tree' },
  { id: 'attributes',  label: 'Attribute Eval' },
  { id: 'semantic',    label: 'Semantic Rules' },
  { id: 'result',      label: 'Result' },
  { id: 'errors',      label: 'Errors' },
  { id: 'concepts',    label: 'Concepts' },
];

export default function App() {
  const [activeTab, setActiveTab]       = useState('overview');
  const [compileResult, setCompileResult] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [theme, setTheme]               = useState(() => {
    return localStorage.getItem('sdt-theme') || 'dark';
  });

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sdt-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }

  function handleAnalyze(expr) {
    setLoading(true);
    setTimeout(() => {
      const result = compile(expr.trim());
      setCompileResult(result);
      setActiveTab('overview');
      setLoading(false);
    }, 50);
  }

  function handleReset() {
    setCompileResult(null);
    setActiveTab('overview');
  }

  const errorCount = compileResult?.errors?.length ?? 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: 10,
          }}>
            <span className="gradient-text">Syntax-Directed Translation System</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 600, margin: '0 auto' }}>
            Interactive Expression Evaluation using Syntax-Directed Definitions.
            Demonstrates the complete compiler pipeline from source to result.
          </p>

          {/* Pipeline breadcrumb */}
          <div style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4,
            marginTop: 14,
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {['Source', 'Lexer', 'Tokens', 'LL(1) Parser', 'Parse Tree', 'SDT', 'Attributes', 'Result']
              .map((s, i, arr) => (
                <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>{s}</span>
                  {i < arr.length - 1 && <span style={{ opacity: 0.4 }}>→</span>}
                </span>
              ))}
          </div>
        </div>

        {/* Expression input */}
        <ExpressionInput onAnalyze={handleAnalyze} loading={loading} />

        {/* Result tabs */}
        {compileResult ? (
          <div className="glass-card animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Tab bar */}
            <div style={{
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              overflowX: 'auto',
              padding: '0 8px',
              gap: 2,
              background: 'var(--bg-secondary)',
            }}>
              {TABS.map(tab => {
                const isErrors = tab.id === 'errors';
                return (
                  <button
                    key={tab.id}
                    className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                    {isErrors && errorCount > 0 && (
                      <span style={{
                        marginLeft: 5,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 16, height: 16,
                        borderRadius: 9999,
                        background: 'var(--accent-red)',
                        color: '#fff',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                      }}>
                        {errorCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div style={{ padding: '28px' }}>
              {activeTab === 'overview'   && <OverviewDashboard result={compileResult} />}
              {activeTab === 'tokens'     && <TokenTable tokens={compileResult.tokens} />}
              {activeTab === 'grammar'    && <GrammarViewer />}
              {activeTab === 'parsing'    && <ParsingSteps steps={compileResult.parseSteps} />}
              {activeTab === 'tree'       && <ParseTreeView root={compileResult.parseTree} />}
              {activeTab === 'attributes' && <AttributeEvaluation evalSteps={compileResult.evalSteps} />}
              {activeTab === 'semantic'   && <SemanticRules />}
              {activeTab === 'result'     && <ResultCard result={compileResult} onReset={handleReset} />}
              {activeTab === 'errors'     && <ErrorPanel errors={compileResult.errors} />}
              {activeTab === 'concepts'   && <ConceptsPanel />}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            <div className="glass-card" style={{ padding: 24 }}>
              <GrammarViewer />
            </div>
            <div className="glass-card" style={{ padding: 24 }}>
              <ConceptsPanel />
            </div>
          </div>
        )}
      </main>

      <footer style={{
        marginTop: 60,
        borderTop: '1px solid var(--border)',
        padding: '20px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.78rem',
      }}>
        Syntax-Directed Translation System · Principles of Compiler Design · Academic Project
        <br />
        <span style={{ fontSize: '0.72rem', opacity: 0.6 }}>
          LL(1) Grammar · Recursive Descent Parser · Synthesized &amp; Inherited Attributes · No eval() used
        </span>
      </footer>
    </div>
  );
}
