'use strict';

const evalInWindow = (expression) => {
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
  return evalInWindow('Object.keys(require.cache)')
}

const getRequires = () => {
  return getRequirePaths().then((paths) => {
    return Promise.all(paths.map((path) => {
      return loadRequire(path)
    }))
  })
}

const getRequireGraph = () => {
  var collector = '(' + (function () {
    var collectModules = function (module) {
      return {
        name: module.filename,
        children: module.children.map(collectModules)
      }
    }
    return collectModules(process.mainModule)
  }).toString() + ')()'
  return evalInWindow(collector)
}
