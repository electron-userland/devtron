'use strict'

const vm = require('vm')

exports.create = () => {
  return {
    chrome: {
      devtools: {
        inspectedWindow: {
          eval: (expression, callback) => {
            expression = `'use strict';\n${expression}`
            try {
              let sandbox = {
                require: require,
                console: console,
                process: process,
                global: {
                  process: process
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
  }
}
