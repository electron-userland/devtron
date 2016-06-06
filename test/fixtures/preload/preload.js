const vm = require('vm')

const devtron = {
  require: require,
  process: process
}

window.chrome = {
  devtools: {
    inspectedWindow: {
      eval: (expression, callback) => {
        expression = `'use strict';\n${expression}`
        try {
          let sandbox = {
            window: {
              __devtron: devtron
            }
          }
          callback(vm.runInNewContext(expression, sandbox))
        } catch (error) {
          callback(null, error)
        }
      }
    }
  }
}
