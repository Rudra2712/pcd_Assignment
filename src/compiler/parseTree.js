/**
 * Parse Tree Node Definitions
 * Represents the complete syntactic structure of a parsed expression.
 */

export class ParseTreeNode {
  constructor(type, label, token = null) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.type = type;         // 'nonterminal' | 'terminal' | 'epsilon'
    this.label = label;       // Grammar symbol (E, T, F, E', T', NUMBER, etc.)
    this.token = token;       // Token for terminals
    this.children = [];
    this.production = null;   // Production rule that created this node
    this.val = null;          // Synthesized attribute value
    this.evalOrder = null;    // Order in which this node was evaluated
  }

  addChild(node) {
    this.children.push(node);
    return node;
  }

  toString() {
    return this.label;
  }
}

export function makeNonTerminal(label) {
  return new ParseTreeNode('nonterminal', label);
}

export function makeTerminal(label, token) {
  const node = new ParseTreeNode('terminal', label, token);
  node.val = token?.value ?? null;
  return node;
}

export function makeEpsilon() {
  return new ParseTreeNode('epsilon', 'ε');
}
