const vm = require('vm')


window.chrome = {
  devtools: {
    inspectedWindow: {
      eval: (expression, callback) => {
        expression = `'use strict';\n${expression}`
        try {
          let sandbox = {
            window: {}
          }
          callback(vm.runInNewContext(expression, sandbox))
        } catch (error) {
          callback(null, error)
        }
      }
    }
  }
}
