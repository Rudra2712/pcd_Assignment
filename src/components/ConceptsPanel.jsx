import { CONCEPTS } from '../data/examples.js';
import { BookOpen, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function ConceptsPanel() {
  const [open, setOpen] = useState(null);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <BookOpen size={18} style={{ color: 'var(--accent-primary)' }} />
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Concepts & Viva Guide</h3>
        <span className="badge badge-indigo">PCD</span>
      </div>

      <div style={{
        marginBottom: 20,
        padding: '12px 16px',
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 10,
        fontSize: '0.84rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
      }}>
        This section covers core compiler design concepts relevant to this project.
        Expand each question to see a clear answer useful for PCD viva examinations.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CONCEPTS.map((c, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${open === i ? 'var(--border-light)' : 'var(--border)'}`,
              borderRadius: 10,
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
          >
            <button
              style={{
                width: '100%',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: open === i ? '#a5b4fc' : 'var(--text-primary)',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'left',
                transition: 'color 0.2s',
              }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>Q{i + 1}. {c.title}</span>
              <ChevronDown
                size={16}
                style={{
                  color: 'var(--text-muted)',
                  transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  flexShrink: 0,
                  marginLeft: 8,
                }}
              />
            </button>
            {open === i && (
              <div style={{
                padding: '0 18px 16px',
                fontSize: '0.84rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                borderTop: '1px solid var(--border)',
                paddingTop: 14,
                animation: 'fadeIn 0.25s ease both',
              }}>
                {c.body}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
