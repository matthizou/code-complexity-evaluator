# code-complexity-evaluator

Simple library and CLI tool that help you tracking the number of significant lines of code of your application.

## Why ?
Getting metrics is important and helps studying the evolution of the code base over time.
This tool was initially written to visualize the progress of the migration of the old code base (in Coffeescript) to the new one (in Javascript).
Regularly ran by a reporting tool, it would spit a number that we can see going down over time, in a graph.

## Significant lines of code ?
Blank and comment lines will never be counted.
After, the rules of what is a 'significant line of code' are subjective and depend on languages.
Do we count the imports at the beginning of the file? Is a line with 3 characters worth as much as one with 100?
Ultimately, it doesn't really matter: it is a relative value that will be compared to other relative values over time. What matters is that the exact same rules are used to calculate all those values.

## Installation
```
yarn add --dev @xingternal/eval-code-complexity
```
Notes: You may need to add a `.npmrc` file to help your package manager to find the xingternal registry.

## How to use it ?
### In Node:
```javascript
const { getComplexityData } = require('code-complexity-evaluator')

const complexityData = getComplexityData(someInputPath, {
  extensions: ['.coffee', '.haml'],
  withDetails: true,
})
```

### In a terminal

```
 > npx eval-code-complexity
 # OR
 > yarn run eval-code-complexity
 # OR
 > node_modules/.bin/eval-code-complexity
```

### In package.json
```
"frontend-legacy-code-size": "eval-code-complexity -e .coffee,.haml",
```

## Options
| Parameter        |            | Default  |
| ------------- |:-------------:| --------:|
| -p     | Path | ./  |
| -e      | Extensions considered <br>(coma-separated. ie: `.coffee,.haml` )     |   All files |
| -d | with Details      |    false |
