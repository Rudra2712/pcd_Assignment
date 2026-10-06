import { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { treeToFlow } from '../utils/treeLayout.js';

// ── Custom node component ───────────────────────────────────────────────────

const NODE_STYLES = {
  nonterminal: { bg: 'rgba(99,102,241,0.15)', border: '#6366f1', color: '#a5b4fc' },
  terminal:    { bg: 'rgba(16,185,129,0.15)',  border: '#10b981', color: '#6ee7b7' },
  epsilon:     { bg: 'rgba(245,158,11,0.12)',  border: '#f59e0b', color: '#fcd34d' },
};

function ParseTreeNodeUI({ data, selected }) {
  const st = NODE_STYLES[data.type] || NODE_STYLES.nonterminal;
  return (
    <div
      style={{
        background: st.bg,
        border: `2px solid ${selected ? '#fff' : st.border}`,
        borderRadius: 10,
        padding: '8px 14px',
        minWidth: 56,
        textAlign: 'center',
        boxShadow: selected ? `0 0 0 3px rgba(255,255,255,0.2)` : `0 2px 8px rgba(0,0,0,0.4)`,
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: st.border, width: 8, height: 8 }} />
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '0.9rem', color: st.color }}>
        {data.label}
      </div>
      {data.val !== null && data.val !== undefined && data.type !== 'epsilon' && (
        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
          val={data.val}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: st.border, width: 8, height: 8 }} />
    </div>
  );
}

const nodeTypes = { parseTreeNode: ParseTreeNodeUI };

// ── Main component ──────────────────────────────────────────────────────────

export default function ParseTree({ root }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const { nodes: initNodes, edges: initEdges } = useMemo(() => treeToFlow(root), [root]);

  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [edges, , onEdgesChange] = useEdgesState(initEdges);

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node.data);
  }, []);

  if (!root) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 300, color: 'var(--text-muted)', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ fontSize: '2rem' }}>🌲</div>
        <div>No parse tree available — fix errors first.</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Parse Tree</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <LegendChip label="Non-terminal" color="#6366f1" />
          <LegendChip label="Terminal" color="#10b981" />
          <LegendChip label="ε (epsilon)" color="#f59e0b" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedNode ? '1fr 280px' : '1fr', gap: 16 }}>
        {/* Tree canvas */}
        <div style={{
          height: 500,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-left"
            style={{ background: 'transparent' }}
          >
            <Controls
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            />
            <MiniMap
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
              nodeColor={n => NODE_STYLES[n.data?.type]?.border || '#6366f1'}
            />
            <Background color="rgba(99,102,241,0.06)" gap={24} size={1} />
          </ReactFlow>
        </div>

        {/* Node info panel */}
        {selectedNode && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 12,
            padding: 20,
            alignSelf: 'start',
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 14, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
              Node Details
            </div>
            <InfoRow label="Symbol" value={selectedNode.label} mono accent />
            <InfoRow label="Node Type" value={selectedNode.type} />
            {selectedNode.production && <InfoRow label="Production" value={selectedNode.production} mono />}
            {selectedNode.val !== null && selectedNode.val !== undefined && (
              <InfoRow label="Attribute val" value={String(selectedNode.val)} mono accent />
            )}
            {selectedNode.token && (
              <>
                <InfoRow label="Lexeme" value={selectedNode.token.lexeme} mono />
                <InfoRow label="Token Type" value={selectedNode.token.type} />
                <InfoRow label="Position" value={`col ${selectedNode.token.position + 1}`} />
              </>
            )}
            <button
              className="btn-ghost"
              style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
              onClick={() => setSelectedNode(null)}
            >
              Deselect
            </button>
          </div>
        )}
      </div>

      {!selectedNode && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 10, textAlign: 'center' }}>
          Click any node to inspect its grammar symbol, production, and synthesized attribute value.
        </p>
      )}
    </div>
  );
}

function LegendChip({ label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
      <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
      {label}
    </div>
  );
}

function InfoRow({ label, value, mono, accent }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{
        fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: accent ? '#a5b4fc' : 'var(--text-primary)',
        wordBreak: 'break-all',
        background: 'rgba(10,14,26,0.5)',
        padding: '5px 10px',
        borderRadius: 6,
      }}>
        {value}
      </div>
    </div>
  );
}
