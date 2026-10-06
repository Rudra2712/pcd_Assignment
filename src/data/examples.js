/**
 * Example expressions shown in the UI.
 */

export const EXAMPLES = [
  { label: '3 + 5 * 2',         expr: '3 + 5 * 2',         expected: 13,     desc: 'Operator precedence' },
  { label: '(3 + 5) * 2',       expr: '(3 + 5) * 2',       expected: 16,     desc: 'Parentheses override' },
  { label: '-5 + 10',           expr: '-5 + 10',            expected: 5,      desc: 'Unary minus' },
  { label: '10 / 2 + 7',        expr: '10 / 2 + 7',        expected: 12,     desc: 'Mixed operators' },
  { label: '10 % 3',            expr: '10 % 3',             expected: 1,      desc: 'Modulo operator' },
  { label: '3.14 * 2',          expr: '3.14 * 2',           expected: 6.28,   desc: 'Decimal numbers' },
  { label: '-(3 + 2) * 4',      expr: '-(3 + 2) * 4',      expected: -20,    desc: 'Unary minus on group' },
  { label: '10 - 5 - 2',        expr: '10 - 5 - 2',        expected: 3,      desc: 'Left associativity' },
];

export const ERROR_EXAMPLES = [
  { label: '3 + * 5',   expr: '3 + * 5',   desc: 'Missing operand' },
  { label: '3 + (5',    expr: '3 + (5',    desc: 'Missing closing )' },
  { label: '3 + 5)',     expr: '3 + 5)',    desc: 'Unexpected )' },
  { label: '10 / 0',    expr: '10 / 0',    desc: 'Division by zero' },
  { label: '3 @ 5',     expr: '3 @ 5',     desc: 'Invalid character' },
];

export const CONCEPTS = [
  {
    title: 'What is Lexical Analysis?',
    body: `Lexical analysis (scanning) is the first phase of a compiler. The lexer reads source characters and groups them into meaningful units called tokens. For example, the string "3 + 5" is split into TOKEN(3), TOKEN(+), TOKEN(5). The lexer ignores whitespace and detects invalid characters.`,
  },
  {
    title: 'What is Syntax Analysis?',
    body: `Syntax analysis (parsing) is the second compiler phase. A parser takes the token stream produced by the lexer and checks whether it conforms to the formal grammar of the language. If valid, it builds a parse tree that captures the syntactic structure.`,
  },
  {
    title: 'What is LL(1) Parsing?',
    body: `LL(1) means: Left-to-right scan, Leftmost derivation, 1 token of lookahead. An LL(1) parser decides which production to apply by looking only at the next (one) token. This grammar is factored to be LL(1)-compatible — no ambiguity, no common left-factor, no left-recursion.`,
  },
  {
    title: 'What is Syntax-Directed Translation?',
    body: `Syntax-Directed Translation (SDT) attaches semantic rules (actions) to grammar productions. When the parser applies a production, it also computes semantic values — called attributes — associated with grammar symbols.`,
  },
  {
    title: 'What is a Synthesized Attribute?',
    body: `A synthesized attribute is computed at a parse-tree node from the attributes of its children. In this grammar, F.val, T.val, and E.val are synthesized — they combine values from sub-expressions to compute the parent's value.`,
  },
  {
    title: 'What is an Inherited Attribute?',
    body: `An inherited attribute is computed at a node from the attributes of its parent or siblings. E'.inh and T'.inh carry the accumulated left-hand value down the recursive tail productions — this is how left-associativity is modeled in a top-down parser.`,
  },
  {
    title: 'What is a Parse Tree?',
    body: `A parse tree (also called a concrete syntax tree) represents the complete derivation of an input string from the grammar's start symbol. Every grammar production corresponds to a node in the tree, making the parsing process fully transparent.`,
  },
  {
    title: 'Why is Operator Precedence Important?',
    body: `Without precedence, "3 + 5 * 2" could be interpreted as "(3 + 5) * 2 = 16" or "3 + (5 * 2) = 13". Precedence is encoded into the grammar hierarchy: the multiply/divide level (T) sits below the add/subtract level (E), forcing multiplication to bind tighter.`,
  },
  {
    title: "Why Should We Not Use eval()?",
    body: `JavaScript's eval() executes arbitrary code strings — it is a security risk and bypasses every compiler concept. More importantly, it hides all the interesting work: no lexer, no parser, no grammar, no attributes. A true compiler pipeline demonstrates how meaning is extracted from structure systematically.`,
  },
];
