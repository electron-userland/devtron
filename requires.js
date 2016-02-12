'use strict';

class Module {
  constructor(path) {
    this.path = path
    this.size = -1
    this.children = []
  }

  setSize(size) {
    this.size = size
    return this
  }

  getSize() {
    return this.size
  }

  addChild(child) {
    this.children.push(child)
    child.parent = this
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
    let match = libraryPattern.exec(this.path)
    while (match != null) {
      let library = match[1]
      match = libraryPattern.exec(this.path)
      if (match == null) return library
    }

    return 'app'
  }

  getParentLibrary() {
    this.parent ? this.parent.getLibrary() : undefined
  }

  visit(callback) {
    callback(this)
    this.children.forEach((child) => child.visit(callback))
  }

  toArray() {
    const modules = []
    this.visit((module) => modules.push(module))
    return modules
  }
}

const initModules = () => {
  return Eval.getRequirePaths().then((paths) => {
    const modules = {}
    paths.forEach((path) => modules[path] = new Module(path))
    return modules
  })
}

const loadSizes = (mainModule) => {
  return Promise.all(mainModule.toArray().map((module) => {
    return Eval.getFileSize(module.path).then((size) => module.setSize(size))
  })).then(() => mainModule)
}

const loadRequireGraph = () => {
  return Eval.getRequireGraph().then((mainModule) => {
    const processModule = (node) => {
      const module = new Module(node.path)
      node.children.forEach((childNode) => {
        module.addChild(processModule(childNode))
      })
      return module
    }

    return processModule(mainModule)
  })
}

const getRequires = () => {
  return loadRequireGraph().then(loadSizes)
}
