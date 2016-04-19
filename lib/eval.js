'use strict'

class Eval {
  static execute (expression) {
    if (typeof expression === 'function') {
      expression = `(${expression})`
      if (arguments.length > 1) {
        let expressionArgs = JSON.stringify(Array.prototype.slice.call(arguments, 1))
        expression += `.apply(this, ${expressionArgs})`
      } else {
        expression += '()'
      }
    }

    expression = `
      (function () {
        global.__devtron = global.__devtron || {}
        global.__devtron.evaling = true
        try {
          return ${expression}
        } finally {
          global.__devtron.evaling = false
        }
      })()
    `

    return new Promise((resolve, reject) => {
      window.chrome.devtools.inspectedWindow.eval(expression, (result, error) => {
        if (error) {
          if (error.isException && error.value) {
            let stack = error.value
            error = new Error(stack.split('\n')[0])
            error.stack = stack
          }
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }

  static getFileSize (path) {
    return Eval.execute((path) => {
      try {
        return require('fs').statSync(path).size
      } catch (error) {
        return -1
      }
    }, path)
  }

  static getFileVersion (filePath) {
    return Eval.execute((filePath) => {
      if (/\/atom\.asar\/(browser|common|renderer)\//.test(filePath)) return process.versions.electron

      const fs = require('fs')
      const path = require('path')
      const appVersion = require('electron').remote.app.getVersion()

      let directory = path.dirname(filePath)
      while (path.basename(directory) !== 'node_modules') {
        try {
          let metadataPath = path.join(directory, 'package.json')
          let version = JSON.parse(fs.readFileSync(metadataPath)).version
          if (version) return version
        } catch (error) {
          // Ignore and continue
        }

        let nextDirectory = path.dirname(directory)
        if (nextDirectory === directory) break
        directory = nextDirectory
      }
      return appVersion
    }, filePath)
  }

  static getRenderRequireGraph () {
    return Eval.execute(() => {
      let count = 0
      const walkModule = (module) => {
        count++
        return {
          path: module.filename,
          children: module.children.map(walkModule)
        }
      }
      const mainModule = walkModule(process.mainModule)
      mainModule.resourcesPath = process.resourcesPath
      mainModule.appName = require('electron').remote.app.getName()
      mainModule.count = count
      return mainModule
    })
  }

  static getMainRequireGraph () {
    return Eval.execute(() => {
      let process = require('electron').remote.process
      let count = 0
      const walkModule = (module) => {
        count++
        return {
          path: module.filename,
          children: module.children.map(walkModule)
        }
      }
      const mainModule = walkModule(process.mainModule)
      mainModule.resourcesPath = process.resourcesPath
      mainModule.appName = require('electron').remote.app.getName()
      mainModule.count = count
      return mainModule
    })
  }

  static isDebugMode () {
    return Eval.execute(() => {
      return !!process.env.DEVTRON_DEBUG_PATH
    })
  }

  // Start a local http server in the currently running app that will
  // listen to requests sent by a browser
  static startServer () {
    return Eval.execute(() => {
      const path = require('path')
      const serverPath = path.join(process.env.DEVTRON_DEBUG_PATH, 'test', 'server.js')
      require(serverPath)
    })
  }

  // Implement the window.chrome.devtools.inspectedWindow.eval API via
  // window.fetch talking to a local http server running in an opened
  // Electron app
  static proxyToServer () {
    window.chrome.devtools = {
      inspectedWindow: {
        eval: function (expression, callback) {
          fetch('http://localhost:3948', {
            body: JSON.stringify({expression: expression}),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST'
          }).then((response) => {
            return response.json()
          }).then((json) => {
            callback(json.result)
          }).catch((error) => {
            callback(null, error)
          })
        }
      }
    }
  }
}

module.exports = Eval
