'use strict';

const evalInWindow = (expression) => {
  if (typeof expression === 'function') {
    expression = `(${expression})()`
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

const getBasename = (path) => {
  return /\/([^\/]+)$/.exec(path)[1]
}

const getLibraryName = (path) => {
  if (/\/atom\.asar\/browser\//.test(path)) return 'electron-browser'
  if (/\/atom\.asar\/common\//.test(path)) return 'electron-common'
  if (/\/atom\.asar\/renderer\//.test(path)) return 'electron-renderer'

  const libraryPattern = /\/node_modules\/[^\/]+\//g
  let library = libraryPattern.exec(path)
  while(library != null) {
    library = libraryPattern.exec(path)
  }
  return library
}

const getFileSize = (path) => {
  return evalInWindow(`require('fs').statSyncNoException("${path}")`).then((stats) => {
    if (stats) {
      return stats.size
    } else {
      return -1
    }
  })
}

const loadRequire = (path) => {
  return getFileSize(path).then(function (size) {
    return {
      name: getBasename(path),
      library: getLibraryName(path),
      path: path,
      size: size
    }
  })
}

const getRequirePaths = () => {
  return evalInWindow(() => {
    return Object.keys(require.cache)
  })
}

const getRequires = () => {
  return getRequirePaths().then((paths) => {
    return Promise.all(paths.map((path) => {
      return loadRequire(path)
    }))
  })
}

const getRequireGraph = () => {
  return evalInWindow(() => {
    var collectModules = function (module) {
      var name = module.filename
      if (name.indexOf(process.resourcesPath) === 0) {
        name = name.substring(process.resourcesPath.length + 1)
      }
      return {
        name: name,
        children: module.children.map(collectModules)
      }
    }
    return collectModules(process.mainModule)
  })
}
