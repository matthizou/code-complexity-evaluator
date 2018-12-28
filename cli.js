#!/usr/bin/env node

const fs = require('fs')
const pathLib = require('path')
const { EOL } = require('os')

const { EXTENSIONS, getCodeComplexity } = require('./getCodeComplexity')

//
// Script that recursively inspects a folder structure and assesses the complexity of the files it contains
// The algorithm used to calculate complexity is trivial, it is mostly counting the number of 'relevant' lines.
//

function displayHelp() {
  console.log(`${EOL}Arguments: [-p path] [-e extensions] [-d]`)
  console.log('i.e: -p ./some/root/path -e coffescript,yaml -d')
  console.log('-d   with details, in JSON format')
  console.log(
    '-p   root path. Default value: the directory where the script is executed',
  )
  console.log('-e   extensions of the files that will by analysed')
}

const IGNORED_FOLDERS = [
  'node_modules',
  '.git',
  'tmp',
  'temp',
  'public',
  'bower_components',
]
let isDetailledAnalysis = false
let rootFolder = process.cwd()
let supportedExtensions = [EXTENSIONS.COFFEESCRIPT, EXTENSIONS.HAML]

const args = process.argv.slice(2)
if (args.includes('-h')) {
  displayHelp()
  return false
}

function getArgumentValue(optionName) {
  const index = args.indexOf(optionName)
  if (index === args.length - 1 || args[index + 1].startsWith('-')) {
    throw new Error(`Missing value for option:${optionName}`)
  }
  return args[index + 1]
}

try {
  args
    .filter(value => value.startsWith('-'))
    .forEach(arg => {
      switch (arg.toLowerCase()) {
        case '-d':
          isDetailledAnalysis = true
          break
        case '-p':
          rootFolder = getArgumentValue(arg)
          break
        case '-e':
          supportedExtensions = getArgumentValue(arg)
            .split(',')
            .map(
              extension =>
                `${
                  extension.startsWith('.') ? '' : '.'
                }${extension.toLocaleLowerCase()}`,
            )
          break
      }
    })
} catch (e) {
  console.error(e.toString())
  displayHelp()
  return false
}

function getComplexity(rootPath, withDetails = false) {
  const cwd = process.cwd()
  const rootFullPath = pathLib.resolve(cwd, rootPath)
  let data = walkRecur(rootFullPath)
  if (withDetails) {
    const rootParentFullPath = pathLib.dirname(rootFullPath)
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

let folderCounter = 1
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
      if (!supportedExtensions.includes(extension)) {
        return results
      }
      name = pathLib.basename(fullPath)
      const code = fs.readFileSync(fullPath, 'utf8')
      complexity = getCodeComplexity(code, extension)
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

console.log(getComplexity(rootFolder, isDetailledAnalysis))
