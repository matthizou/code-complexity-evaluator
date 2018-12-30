const fs = require('fs')
const pathLib = require('path')
const { assessCodeComplexity } = require('./assessCodeComplexity')

let folderCounter = 1

const IGNORED_FOLDERS = [
  'node_modules',
  '.git',
  'tmp',
  'temp',
  'public',
  'bower_components',
]

function walkRecur(fullPath, options, parentFolderId, results = []) {
  try {
    const stat = fs.statSync(fullPath)
    const isDirectory = stat.isDirectory()
    let name,
      complexity,
      folderId,
      childrenComplexity = []

    // DIRECTORY
    if (isDirectory) {
      name = pathLib.basename(fullPath)
      if (IGNORED_FOLDERS.includes(name)) {
        return results
      }
      folderId = folderCounter
      folderCounter += 1
      // Continue recursion
      const children = fs.readdirSync(fullPath)

      childrenComplexity = children
        .map(childName =>
          walkRecur(
            pathLib.join(fullPath, childName),
            options,
            folderId,
            results,
          ),
        )
        // flatten
        .reduce((res, val) => res.concat(val), [])

      complexity = childrenComplexity
        .filter(item => item.parentFolderId === folderId)
        .reduce((total, item) => total + item.complexity, 0)
    } else {
      // FILE
      const extension = pathLib.extname(fullPath).toLowerCase()
      if (options.extensions && !options.extensions.includes(extension)) {
        return results
      }
      name = pathLib.basename(fullPath)
      const code = fs.readFileSync(fullPath, 'utf8')
      complexity = assessCodeComplexity(code, extension)
    }
    if (complexity === 0) {
      return results
    }

    return [
      ...results,
      {
        name,
        parentFolderId,
        folderId,
        fullPath,
        complexity,
      },
      ...childrenComplexity,
    ]
  } catch (ex) {
    console.error(`walkRecur() error when processing: ${fullPath}`)
    console.error(`${ex.message}`)
    return
  }
}

module.exports = {
  walkRecur,
}
