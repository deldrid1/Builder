/**
 * Source parser
 * @author Mikhail Yurasov <me@yurasov.me>
 */

'use strict';

// token types
const tokens = {
  INCLUDE: 'include',
  SET: 'set',
  IF: 'if',
  ELSE: 'else',
  ELSEIF: 'elseif',
  ENDIF: 'endif',
  SOURCE_LINE: 'source_line'
};

class SourceParser {

  /**
   * Tokenize a string
   * @param {string} content
   * @return {Array}
   */
  static parse(content) {
    const res = [];

    for (const line of content.toString().split(/\n|\r\n/)) {
      res.push(this.parseLine(line));
    }

    return res;
  }

  /**
   * Tokenize a single line
   * @param {string} line
   * @return {{value, token}}
   */
  static parseLine(line) {
    let m;

    if (m = line.trim().match(/^@(include|set|if|else|elseif|endif)\b(.*)$/)) {

      const keyword = m[1];
      const value = m[2].trim();

      switch (keyword) {

        // @include <source:expression>
        case 'include':
          return {token: tokens.INCLUDE, source: value};

        // @set <variable:varname> <value:expression>
        case 'set':

          if (m = value.match(/^([_A-Za-z][_A-Za-z0-9]*)\s+(.*)$/)) {
            return {token: tokens.SET, variable: m[1], value: m[2]};
          } else {
            throw new Error('Syntax error in @set');
          }

          break;

      }

    } else {
      return {
        token: tokens.SOURCE_LINE,
        line
      };
    }
  }
}

module.exports = SourceParser;
module.exports.tokens = tokens;
