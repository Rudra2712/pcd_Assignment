/**
 * Main compiler pipeline orchestrator.
 * Runs: tokenize → parse → semantic evaluation
 * Returns a single result object used by the UI.
 */

import { tokenize, TokenType } from './lexer.js';
import { runParser } from './parser.js';

export function compile(source) {
  // ── Stage 1: Lexical Analysis ──────────────────────────────────────────────
  const { tokens, errors: lexErrors } = tokenize(source);

  const hasLexErrors = lexErrors.length > 0;

  // If we have lex errors and the only non-EOF tokens are problematic, stop.
  const validTokens = tokens.filter(t => t.type !== TokenType.EOF);
  const hasNoValidTokens = validTokens.length === 0;

  if (hasNoValidTokens) {
    return {
      source,
      tokens,
      parseTree: null,
      parseSteps: [],
      evalSteps: [],
      result: null,
      errors: lexErrors,
      success: false,
      stage: 'lexer',
    };
  }

  // ── Stage 2: Syntax Analysis + Attribute Evaluation ───────────────────────
  const { root, steps: parseSteps, evalSteps, errors: parseErrors } = runParser(tokens);

  const allErrors = [...lexErrors, ...parseErrors];
  const success = allErrors.length === 0 && root !== null;

  return {
    source,
    tokens,
    parseTree: root,
    parseSteps,
    evalSteps,
    result: success ? root?.val : null,
    errors: allErrors,
    success,
    stage: success ? 'complete' : (parseErrors.length > 0 ? 'parser' : 'lexer'),
  };
}
