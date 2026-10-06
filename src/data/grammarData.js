/**
 * Grammar data – the formal LL(1) grammar used by this project.
 * Exposed in the UI's Grammar tab.
 */

export const GRAMMAR_PRODUCTIONS = [
  // Expression
  { id: 1, lhs: 'E',  rhs: "T E'",    explanation: "An expression is a term followed by optional addition/subtraction." },
  { id: 2, lhs: "E'", rhs: "+ T E'",  explanation: "Addition: consume '+', parse next term, continue with E'." },
  { id: 3, lhs: "E'", rhs: "- T E'",  explanation: "Subtraction: consume '-', parse next term, continue with E'." },
  { id: 4, lhs: "E'", rhs: 'ε',       explanation: "No more addition/subtraction operators." },
  // Term
  { id: 5, lhs: 'T',  rhs: "F T'",    explanation: "A term is a factor followed by optional multiplication/division/modulo." },
  { id: 6, lhs: "T'", rhs: "* F T'",  explanation: "Multiplication: consume '*', parse next factor, continue with T'." },
  { id: 7, lhs: "T'", rhs: "/ F T'",  explanation: "Division: consume '/', parse next factor, continue with T'." },
  { id: 8, lhs: "T'", rhs: "% F T'",  explanation: "Modulo: consume '%', parse next factor, continue with T'." },
  { id: 9, lhs: "T'", rhs: 'ε',       explanation: "No more multiplicative operators." },
  // Factor
  { id: 10, lhs: 'F', rhs: '( E )',   explanation: "Parenthesized sub-expression." },
  { id: 11, lhs: 'F', rhs: '- F',     explanation: "Unary minus: negate the following factor." },
  { id: 12, lhs: 'F', rhs: 'NUMBER',  explanation: "A numeric literal (integer or decimal)." },
];

export const TERMINALS = ['+', '-', '*', '/', '%', '(', ')', 'NUMBER', 'ε', 'EOF'];
export const NON_TERMINALS = ['E', "E'", 'T', "T'", 'F'];
export const START_SYMBOL = 'E';

export const SEMANTIC_RULES = [
  {
    production: 'E → T E\'',
    rule: "E.val = E'.val",
    detail: "The value of expression E is determined by E' (which accumulates additive operations starting from T.val).",
    type: 'synthesized',
  },
  {
    production: "E' → + T E'",
    rule: "E'.val = E''.val  where  E''.inh = E'.inh + T.val",
    detail: "Inherited attribute E'.inh is the accumulated left-hand value. Adding T.val gives the new accumulated value passed to the inner E'.",
    type: 'inherited',
  },
  {
    production: "E' → - T E'",
    rule: "E'.val = E''.val  where  E''.inh = E'.inh - T.val",
    detail: "Subtracting T.val from the inherited value gives a new accumulated value passed to the inner E'.",
    type: 'inherited',
  },
  {
    production: "E' → ε",
    rule: "E'.val = E'.inh",
    detail: "Base case: return the accumulated value unchanged.",
    type: 'synthesized',
  },
  {
    production: 'T → F T\'',
    rule: "T.val = T'.val  where  T'.inh = F.val",
    detail: "The term's value is determined by T' which accumulates multiplicative operations starting from F.val.",
    type: 'synthesized',
  },
  {
    production: "T' → * F T'",
    rule: "T'.val = T''.val  where  T''.inh = T'.inh × F.val",
    detail: "Multiply the inherited value by F.val; pass result as inherited value to inner T'.",
    type: 'inherited',
  },
  {
    production: "T' → / F T'",
    rule: "T'.val = T''.val  where  T''.inh = T'.inh ÷ F.val",
    detail: "Divide the inherited value by F.val; pass result to inner T'. Division by zero is a semantic error.",
    type: 'inherited',
  },
  {
    production: "T' → % F T'",
    rule: "T'.val = T''.val  where  T''.inh = T'.inh mod F.val",
    detail: "Compute modulo of inherited value and F.val; pass result to inner T'. Modulo by zero is a semantic error.",
    type: 'inherited',
  },
  {
    production: "T' → ε",
    rule: "T'.val = T'.inh",
    detail: "Base case: return the accumulated value unchanged.",
    type: 'synthesized',
  },
  {
    production: 'F → ( E )',
    rule: 'F.val = E.val',
    detail: "The value of a parenthesized expression is the value of the inner expression E.",
    type: 'synthesized',
  },
  {
    production: 'F → - F',
    rule: 'F.val = -(F₁.val)',
    detail: "Unary minus: negate the value of the sub-factor.",
    type: 'synthesized',
  },
  {
    production: 'F → NUMBER',
    rule: 'F.val = NUMBER.lexval',
    detail: "A numeric literal's value is its lexical value (the numeric constant).",
    type: 'synthesized',
  },
];

export const GRAMMAR_EXPLANATION = {
  nonTerminals: "Non-terminals are syntactic variables that represent sets of strings. In this grammar: E (expression), E' (expression continuation), T (term), T' (term continuation), F (factor).",
  terminals: "Terminals are the actual tokens of the language: +, -, *, /, %, (, ), NUMBER.",
  startSymbol: "The start symbol E represents the entire arithmetic expression.",
  epsilon: "ε (epsilon) represents the empty string. Productions using ε are base cases that terminate recursive descent.",
  precedence: "Operator precedence is encoded in the grammar hierarchy: F (highest: parentheses, unary) → T (multiplication, division, modulo) → E (addition, subtraction, lowest).",
  leftAssoc: "Left-associativity is handled through the E' and T' tail-recursive productions that accumulate values left-to-right.",
};
