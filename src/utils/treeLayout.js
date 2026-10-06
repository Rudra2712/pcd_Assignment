/**
 * Utility: convert a ParseTreeNode into React Flow nodes/edges for visualization.
 */

export function treeToFlow(root) {
  if (!root) return { nodes: [], edges: [] };

  const nodes = [];
  const edges = [];
  let idCounter = 0;

  function assignIds(node, parentId = null, depth = 0, siblingIndex = 0, totalSiblings = 1) {
    const id = `n${idCounter++}`;
    node._flowId = id;

    nodes.push({
      id,
      data: {
        label: node.label,
        type: node.type,
        val: node.val,
        production: node.production,
        token: node.token,
      },
      position: { x: 0, y: depth * 100 },
      type: 'parseTreeNode',
    });

    if (parentId) {
      edges.push({
        id: `e${parentId}-${id}`,
        source: parentId,
        target: id,
        type: 'smoothstep',
        style: { stroke: '#6366f1', strokeWidth: 2 },
        animated: false,
      });
    }

    node.children.forEach((child, i) => {
      assignIds(child, id, depth + 1, i, node.children.length);
    });
  }

  assignIds(root);

  // Compute x positions using a simple Reingold-Tilford-inspired layout
  layoutTree(root, nodes);

  return { nodes, edges };
}

function layoutTree(root, nodesArr) {
  // Compute subtree widths
  function computeWidth(node) {
    if (node.children.length === 0) {
      node._width = 1;
      return 1;
    }
    let total = 0;
    for (const c of node.children) total += computeWidth(c);
    node._width = Math.max(total, 1);
    return node._width;
  }

  function assignX(node, startX) {
    const nodeEntry = nodesArr.find(n => n.id === node._flowId);
    if (!nodeEntry) return;
    const centerX = startX + (node._width * 90) / 2;
    nodeEntry.position.x = centerX;

    let childX = startX;
    for (const c of node.children) {
      assignX(c, childX);
      childX += c._width * 90;
    }
  }

  computeWidth(root);
  assignX(root, 0);
}
