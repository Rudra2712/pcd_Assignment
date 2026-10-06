/**
 * Automated test suite for the compiler pipeline.
 * Run with: node src/compiler/tests.js
 * (Uses Node.js ESM — ensure "type": "module" in package.json or use .mjs)
 */

import { compile } from './compiler.js';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let passed = 0;
let failed = 0;

function approxEqual(a, b, eps = 1e-9) {
  if (a === null || b === null) return a === b;
  return Math.abs(a - b) < eps;
}

function test(expr, expected, shouldFail = false) {
  const result = compile(expr);
  const hasErrors = result.errors.length > 0;

  if (shouldFail) {
    if (hasErrors) {
      console.log(`${GREEN}✓${RESET} [ERROR EXPECTED] "${expr}" — ${result.errors[0].message}`);
      passed++;
    } else {
      console.log(`${RED}✗${RESET} [ERROR EXPECTED] "${expr}" — Expected an error but got result ${result.result}`);
      failed++;
    }
    return;
  }

  const got = result.result;
  const ok = approxEqual(got, expected);

  if (ok) {
    console.log(`${GREEN}✓${RESET} "${expr}" = ${got}`);
    passed++;
  } else {
    console.log(`${RED}✗${RESET} "${expr}" — Expected ${expected}, got ${got}${hasErrors ? ` [Errors: ${result.errors.map(e => e.message).join('; ')}]` : ''}`);
    failed++;
  }
}

console.log(`\n${BOLD}═══════════════════════════════════════════════════${RESET}`);
console.log(`${BOLD}  Compiler Pipeline Test Suite${RESET}`);
console.log(`${BOLD}═══════════════════════════════════════════════════${RESET}\n`);

console.log(`${YELLOW}── Valid Expressions ──────────────────────────────${RESET}`);
test('3 + 5',           8);
test('3 + 5 * 2',       13);
test('(3 + 5) * 2',     16);
test('10 / 2',          5);
test('10 % 3',          1);
test('-5 + 10',         5);
test('-(3 + 2)',        -5);
test('3.14 * 2',        6.28);
test('10 - 5 - 2',      3);
test('10 / 2 / 5',      1);
test('5',               5);
test('0',               0);
test('-0',              0);
test('100 + 200 + 300', 600);
test('2 * 3 + 4 * 5',   26);
test('2 * (3 + 4) * 5', 70);
test('-(3 + 2) * 4',   -20);
test('10 / 2 + 7',      12);
test('3.14 * 2',        6.28);
test('--5',             5);  // double unary minus

console.log(`\n${YELLOW}── Invalid Expressions (should produce errors) ─────${RESET}`);
test('3 + * 5',     null, true);
test('3 + (5',      null, true);
test('3 + 5)',      null, true);
test('10 / 0',      null, true);
test('10 % 0',      null, true);
test('3 @ 5',       null, true);
test('',            null, true);
test('+',           null, true);
test('()',          null, true);
test('3 +',         null, true);

console.log(`\n${BOLD}═══════════════════════════════════════════════════${RESET}`);
console.log(`Results: ${GREEN}${passed} passed${RESET}, ${failed > 0 ? RED : GREEN}${failed} failed${RESET}`);
console.log(`${BOLD}═══════════════════════════════════════════════════${RESET}\n`);

if (failed > 0) process.exit(1);
