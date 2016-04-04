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
      const walkModule = (module) => {
        return {
          path: module.filename,
          children: module.children.map(walkModule)
        }
      }
      const mainModule = walkModule(process.mainModule)
      mainModule.resourcesPath = process.resourcesPath
      mainModule.appName = require('electron').remote.app.getName()
      return mainModule
    })
  }

  static getMainRequireGraph () {
    return Eval.execute(() => {
      let process = require('electron').remote.process
      const walkModule = (module) => {
        return {
          path: module.filename,
          children: module.children.map(walkModule)
        }
      }
      const mainModule = walkModule(process.mainModule)
      mainModule.resourcesPath = process.resourcesPath
      mainModule.appName = require('electron').app.getName()
      return mainModule
    })
  }
}

module.exports = Eval
