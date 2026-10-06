/**
 * LL(1) Recursive Descent Parser
 *
 * Grammar:
 *   E  → T E'
 *   E' → + T E' | - T E' | ε
 *   T  → F T'
 *   T' → * F T' | / F T' | % F T' | ε
 *   F  → ( E ) | - F | NUMBER
 *
 * Each parse function:
 *   - Consumes tokens from the token stream
 *   - Builds parse-tree nodes
 *   - Records parsing steps
 *   - Evaluates synthesized attributes (val)
 */

import { TokenType } from './lexer.js';
import { makeNonTerminal, makeTerminal, makeEpsilon } from './parseTree.js';

export class ParserError extends Error {
  constructor(message, position, token, expected) {
    super(message);
    this.name = 'ParserError';
    this.position = position;
    this.token = token;
    this.expected = expected;
  }
}

export class Parser {
  constructor(tokens) {
    this.tokens = tokens.filter(t => t.type !== TokenType.EOF);
    // Add EOF back at end
    const eof = tokens.find(t => t.type === TokenType.EOF);
    if (eof) this.tokens.push(eof);

    this.pos = 0;
    this.steps = [];
    this.stepNum = 0;
    this.evalSteps = [];
    this.errors = [];
    this.evalOrder = 0;
  }

  // ── Token helpers ───────────────────────────────────────────────────────────

  peek() {
    return this.tokens[this.pos] || { type: TokenType.EOF, lexeme: 'EOF', position: -1 };
  }

  consume(expectedType) {
    const tok = this.peek();
    if (tok.type !== expectedType) {
      const expectedNames = [expectedType];
      throw new ParserError(
        `Expected ${expectedType} but found '${tok.lexeme}' at position ${tok.position + 1}.`,
        tok.position,
        tok,
        expectedNames
      );
    }
    this.pos++;
    return tok;
  }

  remainingInput() {
    return this.tokens
      .slice(this.pos)
      .map(t => t.lexeme)
      .join(' ');
  }

  recordStep(symbol, production, action, token = null) {
    this.stepNum++;
    this.steps.push({
      step: this.stepNum,
      symbol,
      production,
      action,
      token: token ? token.lexeme : null,
      remaining: this.remainingInput(),
    });
  }

  // ── Entry point ─────────────────────────────────────────────────────────────

  parse() {
    try {
      const root = this.parseExpression();
      const tok = this.peek();
      if (tok.type !== TokenType.EOF) {
        throw new ParserError(
          `Unexpected token '${tok.lexeme}' at position ${tok.position + 1}. Expected end of expression.`,
          tok.position,
          tok,
          ['EOF']
        );
      }
      return { root, steps: this.steps, evalSteps: this.evalSteps, errors: this.errors };
    } catch (err) {
      if (err instanceof ParserError) {
        this.errors.push({
          type: 'SYNTAX_ERROR',
          message: err.message,
          position: err.position,
          token: err.token?.lexeme,
          expected: err.expected,
          suggestion: this.buildSuggestion(err),
        });
      } else {
        this.errors.push({
          type: 'PARSER_ERROR',
          message: err.message,
          position: -1,
        });
      }
      return { root: null, steps: this.steps, evalSteps: this.evalSteps, errors: this.errors };
    }
  }

  buildSuggestion(err) {
    if (err.expected) {
      return `Expected one of: ${err.expected.join(', ')}`;
    }
    return 'Check expression syntax.';
  }

  // ── E → T E' ────────────────────────────────────────────────────────────────

  parseExpression() {
    const node = makeNonTerminal('E');
    this.recordStep('E', 'E → T E\'', 'Apply production E → T E\'');

    const tNode = this.parseTerm();
    node.addChild(tNode);

    const ePrimeNode = this.parseExpressionPrime(tNode.val);
    node.addChild(ePrimeNode);

    node.val = ePrimeNode.val;
    node.production = "E → T E'";
    return node;
  }

  // ── E' → + T E' | - T E' | ε ───────────────────────────────────────────────

  parseExpressionPrime(inheritedVal) {
    const node = makeNonTerminal("E'");
    const tok = this.peek();

    if (tok.type === TokenType.PLUS) {
      this.recordStep("E'", "E' → + T E'", "Apply production E' → + T E'");
      const plusTok = this.consume(TokenType.PLUS);
      const plusTerminal = makeTerminal('+', plusTok);
      plusTerminal.production = "E' → + T E'";
      node.addChild(plusTerminal);
      this.recordStep('+', 'Match', `Match terminal '+'`, plusTok);

      const tNode = this.parseTerm();
      node.addChild(tNode);

      const newVal = inheritedVal + tNode.val;
      this.evalOrder++;
      this.evalSteps.push({
        order: this.evalOrder,
        node: "E'",
        production: "E' → + T E'",
        operation: `${inheritedVal} + ${tNode.val}`,
        left: inheritedVal,
        operator: '+',
        right: tNode.val,
        result: newVal,
        attribute: 'val',
      });

      const ePrimeNode = this.parseExpressionPrime(newVal);
      node.addChild(ePrimeNode);

      node.val = ePrimeNode.val;
      node.production = "E' → + T E'";

    } else if (tok.type === TokenType.MINUS) {
      this.recordStep("E'", "E' → - T E'", "Apply production E' → - T E'");
      const minusTok = this.consume(TokenType.MINUS);
      const minusTerminal = makeTerminal('-', minusTok);
      minusTerminal.production = "E' → - T E'";
      node.addChild(minusTerminal);
      this.recordStep('-', 'Match', `Match terminal '-'`, minusTok);

      const tNode = this.parseTerm();
      node.addChild(tNode);

      const newVal = inheritedVal - tNode.val;
      this.evalOrder++;
      this.evalSteps.push({
        order: this.evalOrder,
        node: "E'",
        production: "E' → - T E'",
        operation: `${inheritedVal} - ${tNode.val}`,
        left: inheritedVal,
        operator: '-',
        right: tNode.val,
        result: newVal,
        attribute: 'val',
      });

      const ePrimeNode = this.parseExpressionPrime(newVal);
      node.addChild(ePrimeNode);

      node.val = ePrimeNode.val;
      node.production = "E' → - T E'";

    } else {
      // ε production
      this.recordStep("E'", "E' → ε", "Apply production E' → ε (no + or -)");
      const epsNode = makeEpsilon();
      node.addChild(epsNode);
      node.val = inheritedVal;
      node.production = "E' → ε";
    }

    return node;
  }

  // ── T → F T' ────────────────────────────────────────────────────────────────

  parseTerm() {
    const node = makeNonTerminal('T');
    this.recordStep('T', 'T → F T\'', 'Apply production T → F T\'');

    const fNode = this.parseFactor();
    node.addChild(fNode);

    const tPrimeNode = this.parseTermPrime(fNode.val);
    node.addChild(tPrimeNode);

    node.val = tPrimeNode.val;
    node.production = "T → F T'";
    return node;
  }

  // ── T' → * F T' | / F T' | % F T' | ε ─────────────────────────────────────

  parseTermPrime(inheritedVal) {
    const node = makeNonTerminal("T'");
    const tok = this.peek();

    if (tok.type === TokenType.MULTIPLY) {
      this.recordStep("T'", "T' → * F T'", "Apply production T' → * F T'");
      const mulTok = this.consume(TokenType.MULTIPLY);
      const mulTerminal = makeTerminal('*', mulTok);
      mulTerminal.production = "T' → * F T'";
      node.addChild(mulTerminal);
      this.recordStep('*', 'Match', `Match terminal '*'`, mulTok);

      const fNode = this.parseFactor();
      node.addChild(fNode);

      const newVal = inheritedVal * fNode.val;
      this.evalOrder++;
      this.evalSteps.push({
        order: this.evalOrder,
        node: "T'",
        production: "T' → * F T'",
        operation: `${inheritedVal} × ${fNode.val}`,
        left: inheritedVal,
        operator: '*',
        right: fNode.val,
        result: newVal,
        attribute: 'val',
      });

      const tPrimeNode = this.parseTermPrime(newVal);
      node.addChild(tPrimeNode);

      node.val = tPrimeNode.val;
      node.production = "T' → * F T'";

    } else if (tok.type === TokenType.DIVIDE) {
      this.recordStep("T'", "T' → / F T'", "Apply production T' → / F T'");
      const divTok = this.consume(TokenType.DIVIDE);
      const divTerminal = makeTerminal('/', divTok);
      divTerminal.production = "T' → / F T'";
      node.addChild(divTerminal);
      this.recordStep('/', 'Match', `Match terminal '/'`, divTok);

      const fNode = this.parseFactor();
      node.addChild(fNode);

      if (fNode.val === 0) {
        throw new ParserError(
          `Division by zero: cannot divide by 0.`,
          fNode.token?.position ?? tok.position,
          fNode.token,
          []
        );
      }

      const newVal = inheritedVal / fNode.val;
      this.evalOrder++;
      this.evalSteps.push({
        order: this.evalOrder,
        node: "T'",
        production: "T' → / F T'",
        operation: `${inheritedVal} ÷ ${fNode.val}`,
        left: inheritedVal,
        operator: '/',
        right: fNode.val,
        result: newVal,
        attribute: 'val',
      });

      const tPrimeNode = this.parseTermPrime(newVal);
      node.addChild(tPrimeNode);

      node.val = tPrimeNode.val;
      node.production = "T' → / F T'";

    } else if (tok.type === TokenType.MODULO) {
      this.recordStep("T'", "T' → % F T'", "Apply production T' → % F T'");
      const modTok = this.consume(TokenType.MODULO);
      const modTerminal = makeTerminal('%', modTok);
      modTerminal.production = "T' → % F T'";
      node.addChild(modTerminal);
      this.recordStep('%', 'Match', `Match terminal '%'`, modTok);

      const fNode = this.parseFactor();
      node.addChild(fNode);

      if (fNode.val === 0) {
        throw new ParserError(
          `Modulo by zero: cannot compute modulo with divisor 0.`,
          fNode.token?.position ?? tok.position,
          fNode.token,
          []
        );
      }

      const newVal = inheritedVal % fNode.val;
      this.evalOrder++;
      this.evalSteps.push({
        order: this.evalOrder,
        node: "T'",
        production: "T' → % F T'",
        operation: `${inheritedVal} % ${fNode.val}`,
        left: inheritedVal,
        operator: '%',
        right: fNode.val,
        result: newVal,
        attribute: 'val',
      });

      const tPrimeNode = this.parseTermPrime(newVal);
      node.addChild(tPrimeNode);

      node.val = tPrimeNode.val;
      node.production = "T' → % F T'";

    } else {
      // ε production
      this.recordStep("T'", "T' → ε", "Apply production T' → ε (no *, /, %)");
      const epsNode = makeEpsilon();
      node.addChild(epsNode);
      node.val = inheritedVal;
      node.production = "T' → ε";
    }

    return node;
  }

  // ── F → ( E ) | - F | NUMBER ────────────────────────────────────────────────

  parseFactor() {
    const node = makeNonTerminal('F');
    const tok = this.peek();

    if (tok.type === TokenType.LPAREN) {
      this.recordStep('F', 'F → ( E )', 'Apply production F → ( E )');
      const lp = this.consume(TokenType.LPAREN);
      const lpTerminal = makeTerminal('(', lp);
      node.addChild(lpTerminal);
      this.recordStep('(', 'Match', `Match terminal '('`, lp);

      const eNode = this.parseExpression();
      node.addChild(eNode);

      const rp = this.peek();
      if (rp.type !== TokenType.RPAREN) {
        throw new ParserError(
          `Missing closing parenthesis ')' at position ${rp.position + 1}.`,
          rp.position,
          rp,
          ['RPAREN']
        );
      }
      const rpTok = this.consume(TokenType.RPAREN);
      const rpTerminal = makeTerminal(')', rpTok);
      node.addChild(rpTerminal);
      this.recordStep(')', 'Match', `Match terminal ')'`, rpTok);

      node.val = eNode.val;
      node.production = 'F → ( E )';

    } else if (tok.type === TokenType.MINUS) {
      this.recordStep('F', 'F → - F', 'Apply production F → - F (unary minus)');
      const minusTok = this.consume(TokenType.MINUS);
      const minusTerminal = makeTerminal('-', minusTok);
      node.addChild(minusTerminal);
      this.recordStep('-', 'Match', `Match unary minus '-'`, minusTok);

      const fNode = this.parseFactor();
      node.addChild(fNode);

      const newVal = -fNode.val;
      this.evalOrder++;
      this.evalSteps.push({
        order: this.evalOrder,
        node: 'F',
        production: 'F → - F',
        operation: `-( ${fNode.val} )`,
        left: null,
        operator: 'unary -',
        right: fNode.val,
        result: newVal,
        attribute: 'val',
      });

      node.val = newVal;
      node.production = 'F → - F';

    } else if (tok.type === TokenType.NUMBER) {
      this.recordStep('F', 'F → NUMBER', 'Apply production F → NUMBER');
      const numTok = this.consume(TokenType.NUMBER);
      const numTerminal = makeTerminal(numTok.lexeme, numTok);
      numTerminal.production = 'F → NUMBER';
      node.addChild(numTerminal);
      this.recordStep('NUMBER', 'Match', `Match NUMBER '${numTok.lexeme}'`, numTok);

      node.val = numTok.value;
      node.production = 'F → NUMBER';

      this.evalOrder++;
      this.evalSteps.push({
        order: this.evalOrder,
        node: `NUMBER(${numTok.lexeme})`,
        production: 'F → NUMBER',
        operation: numTok.lexeme,
        left: null,
        operator: null,
        right: null,
        result: numTok.value,
        attribute: 'val',
      });

    } else {
      const expectedList = ['NUMBER', '(', '-'];
      throw new ParserError(
        `Unexpected token '${tok.lexeme}' at position ${tok.position + 1}. Expected a number, '(' or '-'.`,
        tok.position,
        tok,
        expectedList
      );
    }

    return node;
  }
}

/**
 * High-level function: run lexer + parser on a source string.
 * Returns a full compiler result object.
 */
export function runParser(tokens) {
  const parser = new Parser(tokens);
  return parser.parse();
}
