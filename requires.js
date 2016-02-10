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

const getRequirePaths = () => {
  return evalInWindow('Object.keys(require.cache)')
}

const getRequires = () => {
  return getRequirePaths().then((paths) => {
    return paths.map((path) => {
      return {
        name: getBasename(path),
        library: getLibraryName(path)
      }
    })
  })
}
