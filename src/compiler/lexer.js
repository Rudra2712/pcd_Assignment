/**
 * Lexical Analyzer (Lexer)
 * Scans source expression character by character and produces a token stream.
 */

export const TokenType = {
  NUMBER: 'NUMBER',
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  MULTIPLY: 'MULTIPLY',
  DIVIDE: 'DIVIDE',
  MODULO: 'MODULO',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  EOF: 'EOF',
};

export const TOKEN_DISPLAY = {
  NUMBER: 'NUMBER',
  PLUS: 'PLUS (+)',
  MINUS: 'MINUS (-)',
  MULTIPLY: 'MULTIPLY (*)',
  DIVIDE: 'DIVIDE (/)',
  MODULO: 'MODULO (%)',
  LPAREN: 'LPAREN ( ( )',
  RPAREN: 'RPAREN ( ) )',
  EOF: 'EOF',
};

export class Token {
  constructor(type, lexeme, value, position) {
    this.type = type;
    this.lexeme = lexeme;
    this.value = value; // numeric value for NUMBER tokens
    this.position = position; // 0-based index in source
  }

  toString() {
    return `${this.type}(${this.lexeme})`;
  }
}

export class LexerError extends Error {
  constructor(message, position, char) {
    super(message);
    this.name = 'LexerError';
    this.position = position;
    this.char = char;
  }
}

/**
 * Tokenize the input expression.
 * Returns { tokens, errors }
 */
export function tokenize(source) {
  const tokens = [];
  const errors = [];
  let pos = 0;

  if (!source || source.trim() === '') {
    errors.push({
      type: 'LEXER_ERROR',
      message: 'Empty expression. Please enter an arithmetic expression.',
      position: 0,
      suggestion: 'Try: 3 + 5 * 2',
    });
    tokens.push(new Token(TokenType.EOF, '', null, 0));
    return { tokens, errors };
  }

  while (pos < source.length) {
    const ch = source[pos];

    // Skip whitespace
    if (/\s/.test(ch)) {
      pos++;
      continue;
    }

    // Numbers (integers and decimals)
    if (/[0-9]/.test(ch)) {
      let numStr = '';
      const startPos = pos;
      let hasDecimal = false;

      while (pos < source.length && /[0-9]/.test(source[pos])) {
        numStr += source[pos++];
      }
      if (pos < source.length && source[pos] === '.') {
        hasDecimal = true;
        numStr += source[pos++];
        while (pos < source.length && /[0-9]/.test(source[pos])) {
          numStr += source[pos++];
        }
        if (numStr.endsWith('.')) {
          errors.push({
            type: 'LEXER_ERROR',
            message: `Incomplete decimal number '${numStr}' at position ${startPos + 1}.`,
            position: startPos,
            suggestion: `Did you mean ${numStr}0?`,
          });
          numStr += '0';
        }
      }

      const numVal = hasDecimal ? parseFloat(numStr) : parseInt(numStr, 10);
      tokens.push(new Token(TokenType.NUMBER, numStr, numVal, startPos));
      continue;
    }

    // Single-character tokens
    const startPos = pos;
    switch (ch) {
      case '+':
        tokens.push(new Token(TokenType.PLUS, '+', null, startPos));
        pos++;
        break;
      case '-':
        tokens.push(new Token(TokenType.MINUS, '-', null, startPos));
        pos++;
        break;
      case '*':
        tokens.push(new Token(TokenType.MULTIPLY, '*', null, startPos));
        pos++;
        break;
      case '/':
        tokens.push(new Token(TokenType.DIVIDE, '/', null, startPos));
        pos++;
        break;
      case '%':
        tokens.push(new Token(TokenType.MODULO, '%', null, startPos));
        pos++;
        break;
      case '(':
        tokens.push(new Token(TokenType.LPAREN, '(', null, startPos));
        pos++;
        break;
      case ')':
        tokens.push(new Token(TokenType.RPAREN, ')', null, startPos));
        pos++;
        break;
      default:
        errors.push({
          type: 'LEXER_ERROR',
          message: `Unexpected character '${ch}' at position ${startPos + 1}.`,
          position: startPos,
          char: ch,
          suggestion: `Remove '${ch}' from the expression.`,
        });
        pos++;
        break;
    }
  }

  tokens.push(new Token(TokenType.EOF, 'EOF', null, pos));
  return { tokens, errors };
}
