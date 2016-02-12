'use strict';

class Eval {
  static execute(expression, args) {
    if (typeof expression === 'function') {
      let expressionArgs = args != null ? JSON.stringify(args) : ''
      expression = `(${expression})(${expressionArgs})`
    }

    return new Promise((resolve, reject) => {
      chrome.devtools.inspectedWindow.eval(expression, (result, error) => {
        if (error)
          reject(error)
        else
          resolve(result)
      })
    })
  }

  static getFileSize(path) {
    return Eval.execute((path) => {
      const stats = require('fs').statSyncNoException(path)
      if (stats) {
        return stats.size
      } else {
        return -1
      }
    }, path)
  }

  static getRequireGraph() {
    return Eval.execute(() => {
      const walkModule = (module) => {
        return {
          path: module.filename,
          children: module.children.map(walkModule)
        }
      }
      const mainModule = walkModule(process.mainModule)
      mainModule.resourcesPath = process.resourcesPath
      return mainModule
    })
  }
}
