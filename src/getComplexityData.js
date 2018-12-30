const pathLib = require('path')
const { EOL } = require('os')
const { walkRecur } = require('./walkRecur')

/**
 *
 * @param {string} rootPath
 * @param {Object} options
 * @param {string[]} options.extensions
 * @param {boolean} options.withDetails
 */
function getComplexityData(rootPath, options = {}) {
  let data = walkRecur(rootPath, options)
  if (options.withDetails) {
    const rootParentFullPath = pathLib.dirname(rootPath)
    data = data.map(({ fullPath, ...rest }) => ({
      ...rest,
      path: fullPath.replace(rootParentFullPath, ''),
    }))
    data = data.map(item => JSON.stringify(item)).join(`,${EOL}  `)
    data = `[${EOL}  ${data}${EOL}]`
  } else {
    data = data && data.length ? data[0].complexity : '0'
  }
  return data
}

module.exports = {
  getComplexityData,
}
