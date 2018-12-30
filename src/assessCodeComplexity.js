const { EOL } = require('os')

const EXTENSIONS = {
  COFFEESCRIPT: '.coffee',
  HAML: '.haml',
  SNAPSHOT: '.snap',
  JAVASCRIPT: '.js',
  JSX: '.jsx',
}

const { COFFEESCRIPT, SNAPSHOT, JAVASCRIPT, JSX } = EXTENSIONS

function assessCodeComplexity(code, extension) {
  switch (extension) {
    case COFFEESCRIPT:
      return getCoffeescriptComplexity(code)
    case JAVASCRIPT:
    case SNAPSHOT:
    case JSX:
      return getJavascriptComplexity(code)
    default:
      return getNonEmptyLinesLength(code)
  }
}

function getCoffeescriptComplexity(code) {
  const ignoredCharactersRegex = /[\s\{\}\(\)\[\]]/g // Characters: whitespace,{,},(,),[,]
  const significantLines = code
    .split(EOL)
    .map(line => line.replace(ignoredCharactersRegex, ''))
    .filter(line => line.length)
    .filter(line => !line.startsWith('#'))
    .filter(line => !line.startsWith('window.XTM.module'))
  return significantLines.length
}

function getJavascriptComplexity(code) {
  const ignoredCharactersRegex = /[\s\(\)\[\]<>//]/g // Characters: whitespace,{,},(,),[,],<,>,/
  const significantLines = code
    .split(EOL)
    .map(line => line.replace(ignoredCharactersRegex, ''))
    .filter(line => line.length)
    .filter(line => !line.startsWith('//'))
  return significantLines.length
}

function getNonEmptyLinesLength(code) {
  return code.split(EOL).filter(line => line.length).length
}

module.exports = {
  assessCodeComplexity,
  EXTENSIONS,
}
