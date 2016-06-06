'use strict'

const vm = require('vm')

exports.create = () => {
  const devtron = {}
  return {
    chrome: {
      devtools: {
        inspectedWindow: {
          eval: (expression, callback) => {
            expression = `'use strict';\n${expression}`
            try {
              const sandbox = {
                require: require,
                console: console,
                process: process,
                global: {
                  process: process,
                  __devtron: devtron
                },
                window: {
                  process: process,
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
  }
}
