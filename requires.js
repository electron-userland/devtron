'use strict';

class Module {
  constructor(path) {
    this.path = path
    this.size = -1
    this.children = []
  }

  setSize(size) {
    this.size = size
  }

  getSize() {
    return this.size
  }

  addChild(child) {
    this.children.push(child)
  }

  getPath() {
    return this.path
  }

  getName() {
    return /\/([^\/]+)$/.exec(this.path)[1]
  }

  getLibrary() {
    if (/\/atom\.asar\/browser\//.test(this.path)) return 'electron-browser'
    if (/\/atom\.asar\/common\//.test(this.path)) return 'electron-common'
    if (/\/atom\.asar\/renderer\//.test(this.path)) return 'electron-renderer'

    const libraryPattern = /\/node_modules\/([^\/]+)(?=\/)/g
    let match = libraryPattern.exec(path)
    while (match != null) {
      let library = match[1]
      match = libraryPattern.exec(path)
      if (match == null) return library
    }
  }
}

const initModules = () => {
  return Eval.getRequirePaths().then((paths) => {
    return paths.map((path) => new Module(path))
  })
}

const loadSizes = (modules) => {
  return Promise.all(modules.map((module) => {
    return Eval.getFileSize(module.path).then((size) => {
      module.setSize(size)
      return module
    })
  }))
}

const getRequires = () => {
  return initModules().then(loadSizes)
}
