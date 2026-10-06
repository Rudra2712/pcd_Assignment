import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

function getActionType(action) {
  if (action.startsWith('Match')) return 'match';
  if (action.startsWith('Apply')) return 'production';
  return 'other';
}

export default function ParsingSteps({ steps }) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying]   = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  function prev() { setCurrent(c => Math.max(0, c - 1)); }
  function next() { setCurrent(c => Math.min(steps.length - 1, c + 1)); }
  function reset() {
    setCurrent(0);
    if (intervalId) { clearInterval(intervalId); setIntervalId(null); setPlaying(false); }
  }
  function togglePlay() {
    if (playing) {
      clearInterval(intervalId); setIntervalId(null); setPlaying(false);
    } else {
      setPlaying(true);
      const id = setInterval(() => {
        setCurrent(c => {
          if (c >= steps.length - 1) { clearInterval(id); setPlaying(false); return c; }
          return c + 1;
        });
      }, 700);
      setIntervalId(id);
    }
  }

  if (!steps || steps.length === 0) {
    return <div style={{ color: 'var(--text-muted)', padding: 20 }}>No parsing steps available.</div>;
  }

  const step = steps[current];
  const atype = getActionType(step.action);

  const actionStyle = atype === 'match'
    ? { color: 'var(--accent-green)', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)' }
    : { color: 'var(--text-primary)', bg: 'var(--bg-card-hover)', border: 'var(--border-light)' };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Parsing Steps</h3>
        <span className="badge badge-white">{steps.length} steps</span>
      </div>

      {/* Current step card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.88rem',
            color: 'var(--bg-primary)',
          }}>
            {step.step}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Step {step.step} of {steps.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current parsing action</div>
          </div>
          <span style={{
            marginLeft: 'auto',
            padding: '3px 10px',
            borderRadius: 9999,
            fontSize: '0.72rem',
            fontWeight: 600,
            color: actionStyle.color,
            background: actionStyle.bg,
            border: `1px solid ${actionStyle.border}`,
          }}>
            {atype === 'match' ? 'Match' : 'Production'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <InfoBox label="Grammar Symbol"    value={step.symbol}      mono bold />
          <InfoBox label="Production/Action" value={step.production}  mono />
          <InfoBox label="Consumed Token"    value={step.token || '—'} mono />
          <InfoBox label="Remaining Input"   value={step.remaining || 'ε (end)'} mono />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <button className="btn-ghost" onClick={reset}><RotateCcw size={13} /> Reset</button>
        <button className="btn-ghost" onClick={prev} disabled={current === 0}><ChevronLeft size={13} /> Prev</button>
        <button className="btn-ghost" onClick={next} disabled={current === steps.length - 1}>Next <ChevronRight size={13} /></button>
        <button className="btn-ghost" onClick={togglePlay}>
          {playing ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Play</>}
        </button>
        <div style={{ flex: 1, height: 3, background: 'var(--border)', borderRadius: 2, position: 'relative', minWidth: 80 }}>
          <div style={{
            position: 'absolute', left: 0, top: 0,
            height: '100%', borderRadius: 2,
            background: 'var(--accent-primary)',
            width: `${((current + 1) / steps.length) * 100}%`,
            transition: 'width 0.3s',
          }} />
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: 56 }}>
          {current + 1} / {steps.length}
        </span>
      </div>

      {/* Full table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', maxHeight: 400, overflowY: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 56 }}>Step</th>
              <th>Symbol</th>
              <th>Production / Action</th>
              <th>Token</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((s, i) => {
              const at = getActionType(s.action);
              const isActive = i === current;
              return (
                <tr key={i} className={isActive ? 'highlighted' : ''} onClick={() => setCurrent(i)} style={{ cursor: 'pointer' }}>
                  <td style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    textAlign: 'center',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: isActive ? 700 : 400,
                  }}>
                    {s.step}
                  </td>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--text-primary)' }}>
                      {s.symbol}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>
                    <span style={{
                      color: at === 'match' ? 'var(--accent-green)' : 'var(--text-secondary)',
                      background: at === 'match' ? 'rgba(34,197,94,0.06)' : 'transparent',
                      padding: '2px 6px',
                      borderRadius: 4,
                      border: at === 'match' ? '1px solid rgba(34,197,94,0.2)' : 'none',
                    }}>
                      {s.production}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent-green)', fontSize: '0.83rem' }}>
                    {s.token || '—'}
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {s.remaining || 'ε (end)'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InfoBox({ label, value, mono, bold }) {
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{
        fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
        fontSize: '0.88rem',
        fontWeight: bold ? 700 : 500,
        color: 'var(--text-primary)',
        wordBreak: 'break-all',
      }}>
        {value}
      </div>
    </div>
  );
}
