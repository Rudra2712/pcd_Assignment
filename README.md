# Syntax-Directed Translation System for Expression Evaluation

> **Principles of Compiler Design (PCD) – Academic Project**

An interactive web application demonstrating the complete compiler pipeline for arithmetic expression evaluation — from source characters to a computed result — using genuine compiler design techniques.

---

## Problem Statement

Build an educational tool that demonstrates every stage of a compiler when evaluating an arithmetic expression:

```
Source → Lexer → Tokens → LL(1) Parser → Parse Tree → SDT → Attributes → Result
```

The implementation must **not** use `eval()`, `Function()`, or any external parser library. Every stage must be implemented manually so the source code can be explained at a PCD viva.

---

## Objectives

- Implement a **custom lexer** that tokenizes input character by character.
- Implement a **recursive-descent LL(1) parser** based on a formal context-free grammar.
- Build a **parse tree** from grammar productions.
- Apply **syntax-directed definitions** to compute semantic attributes.
- Display every stage interactively in a polished UI.
- Provide clear error messages for lexical and syntax errors.
- Support **unary minus**, **decimals**, **left-associativity**, and correct **operator precedence**.

---

## Features

| Feature | Details |
|---|---|
| Lexical Analyzer | Custom character-by-character scanner |
| Token Types | NUMBER, PLUS, MINUS, MULTIPLY, DIVIDE, MODULO, LPAREN, RPAREN, EOF |
| Parser | LL(1) recursive descent |
| Grammar | Formal LL(1) grammar (12 productions) |
| Parse Tree | Interactive React Flow visualization |
| SDT | Synthesized & inherited attributes on all nodes |
| Error Handling | Lexical errors, syntax errors, division/modulo by zero |
| Animations | Step-by-step parsing & evaluation playback |
| Viva Guide | In-app Q&A covering all PCD concepts |

---

## System Architecture

```
src/
├── compiler/
│   ├── lexer.js          # Tokenizer (character-by-character)
│   ├── parser.js         # LL(1) recursive-descent parser + SDT
│   ├── parseTree.js      # Parse tree node definitions
│   ├── compiler.js       # Pipeline orchestrator (lexer → parser)
│   └── tests.js          # Automated test suite
├── components/
│   ├── Header.jsx
│   ├── ExpressionInput.jsx
│   ├── OverviewDashboard.jsx
│   ├── TokenTable.jsx
│   ├── GrammarViewer.jsx
│   ├── ParsingSteps.jsx
│   ├── ParseTreeView.jsx
│   ├── SemanticRules.jsx
│   ├── AttributeEvaluation.jsx
│   ├── ResultCard.jsx
│   ├── ErrorPanel.jsx
│   └── ConceptsPanel.jsx
├── data/
│   ├── grammarData.js    # Productions, semantic rules, explanations
│   └── examples.js       # Example expressions & concept Q&A
└── utils/
    └── treeLayout.js     # Tree → React Flow node/edge layout
```

---

## Compiler Pipeline

### 1. Lexical Analysis (`lexer.js`)

The lexer scans the input string one character at a time. It produces **Token** objects with:
- `type` – one of the TokenType enum values
- `lexeme` – the original string
- `value` – numeric value (for NUMBER tokens)
- `position` – 0-based source position

Whitespace is ignored. Invalid characters produce `LEXER_ERROR` entries.

### 2. Token Stream

Example: `3 + 5 * (2 - 1)` → `NUMBER(3) PLUS(+) NUMBER(5) MULTIPLY(*) LPAREN(() NUMBER(2) MINUS(-) NUMBER(1) RPAREN()) EOF`

### 3. Formal Grammar (LL(1))

```
E  → T E'
E' → + T E'  |  - T E'  |  ε

T  → F T'
T' → * F T'  |  / F T'  |  % F T'  |  ε

F  → ( E )  |  - F  |  NUMBER
```

This grammar:
- Has **no left recursion** (required for LL(1))
- Is **unambiguous**
- Encodes **operator precedence** in the hierarchy F > T > E
- Handles **left-associativity** through the tail-recursive E′/T′ productions

### 4. LL(1) Parser (`parser.js`)

Implements `parseExpression()`, `parseExpressionPrime()`, `parseTerm()`, `parseTermPrime()`, `parseFactor()`.

Each function:
1. Consumes tokens using one token of **lookahead**
2. Creates a **parse tree node**
3. Records a **parsing step** (symbol, production, action, remaining input)
4. Computes the **synthesized attribute** (`val`)

### 5. Syntax-Directed Translation

Semantic rules are embedded in each parser function:

| Production | Semantic Rule | Attribute Type |
|---|---|---|
| `F → NUMBER` | `F.val = NUMBER.lexval` | Synthesized |
| `F → ( E )` | `F.val = E.val` | Synthesized |
| `F → - F` | `F.val = -(F₁.val)` | Synthesized |
| `T → F T'` | `T.val = T'.val, T'.inh = F.val` | Synthesized + Inherited |
| `T' → * F T'` | `T'.val = T''.val, T''.inh = T'.inh × F.val` | Inherited |
| `E → T E'` | `E.val = E'.val, E'.inh = T.val` | Synthesized + Inherited |
| `E' → + T E'` | `E'.val = E''.val, E''.inh = E'.inh + T.val` | Inherited |

### 6. Attribute Evaluation

Every parse tree node has a `val` attribute. The evaluation order follows the recursive descent traversal (post-order for synthesized attributes, pre-order for inherited attributes flowing down).

### 7. Error Handling

| Error Type | Example | Detection Stage |
|---|---|---|
| Invalid character | `3 @ 5` | Lexer |
| Empty expression | _(empty)_ | Lexer |
| Missing operand | `3 + * 5` | Parser |
| Missing closing `)` | `3 + (5` | Parser |
| Unexpected `)` | `3 + 5)` | Parser |
| Division by zero | `10 / 0` | Semantic (in parser) |
| Modulo by zero | `10 % 0` | Semantic (in parser) |

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS v4 | Styling |
| React Flow | Parse tree visualization |
| Lucide React | Icons |
| JavaScript (ESM) | Implementation language |

---

## Installation

```bash
# Clone / navigate to project
cd path/to/Assignment

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Running Tests

```bash
node --input-type=module < src/compiler/tests.js
```

Or add a script to `package.json`:
```json
"scripts": {
  "test": "node src/compiler/tests.js"
}
```

---

## Example Expressions

| Expression | Result | Feature Demonstrated |
|---|---|---|
| `3 + 5 * 2` | 13 | Operator precedence |
| `(3 + 5) * 2` | 16 | Parentheses override |
| `-5 + 10` | 5 | Unary minus |
| `10 % 3` | 1 | Modulo operator |
| `3.14 * 2` | 6.28 | Decimal support |
| `10 - 5 - 2` | 3 | Left associativity |
| `-(3 + 2) * 4` | -20 | Compound unary minus |

---

## Screenshots

_(Add screenshots of each tab here)_

---

## Future Enhancements

- Support for variables and assignments
- Export parse tree as PNG/SVG
- Side-by-side comparison of two expressions
- Three-address code generation
- Assembly code output
- Support for boolean expressions and comparisons

---

## Team Members

| Name | Role |
|---|---|
| _(Add name)_ | Developer |
| _(Add name)_ | Developer |

---

## Important Implementation Decisions

1. **No eval()**: The result is computed exclusively from the `val` attribute propagated through the parse tree during recursive descent.
2. **Inherited attributes via function arguments**: Since this is a top-down parser, inherited attributes (E'.inh, T'.inh) are passed as function arguments rather than stored on nodes directly — this correctly models the semantic flow.
3. **Error recovery**: The parser does not attempt error recovery (panic mode) — it stops at the first syntax error. This keeps the educational flow clear.
4. **Division by zero**: Detected during semantic evaluation inside the parser, raising a `ParserError` with a specific message.
5. **Tree layout**: A custom Reingold-Tilford-inspired width-based layout is used to compute x positions for React Flow nodes.
