const { EOL } = require('os')

const EXTENSIONS = {
  COFFEESCRIPT: '.coffee',
  HAML: '.haml',
  SNAPSHOT: '.snap',
}

const { COFFEESCRIPT, HAML, SNAPSHOT } = EXTENSIONS

function getCodeComplexity(code, extension) {
  switch (extension) {
    case COFFEESCRIPT:
      return getCoffeescriptComplexity(code)
    case SNAPSHOT:
      return getSnapShotComplexity(code)
    case HAML:
      return getNonEmptyLinesLength(code)
    default:
      throw `getComplexity() - Unsupported extension:${extension}`
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

function getSnapShotComplexity(code) {
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
  getCodeComplexity,
  EXTENSIONS,
}
