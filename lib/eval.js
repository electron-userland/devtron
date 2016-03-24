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
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }

  static getFileSize (path) {
    return Eval.execute((path) => {
      const stats = require('fs').statSyncNoException(path)
      return stats ? stats.size : -1
    }, path)
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
      mainModule.appName = require('electron').remote.app.getName()
      return mainModule
    })
  }
}

module.exports = Eval
