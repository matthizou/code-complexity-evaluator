#!/usr/bin/env node

const pathLib = require('path')
const { EOL } = require('os')

const { getComplexityData } = require('./src/getComplexityData')
const { EXTENSIONS } = require('./src/assessCodeComplexity')

let extensions = [EXTENSIONS.COFFEESCRIPT, EXTENSIONS.HAML]

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

let isDetailledAnalysis = false
let rootFolder = process.cwd()

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
          extensions = getArgumentValue(arg)
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

const cwd = process.cwd()
const rootFullPath = pathLib.resolve(cwd, rootFolder)

console.log(
  getComplexityData(rootFullPath, {
    extensions,
    withDetails: isDetailledAnalysis,
  }),
)
