'use strict';

class Module {
  constructor(path, resourcesPath) {
    this.path = path
    this.resourcesPath = resourcesPath
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

  hasChildren() {
    return this.children.length > 0
  }

  addChild(child) {
    this.children.push(child)
    child.parent = this
  }

  getPath() {
    return this.path
  }

  getDepth() {
    let depth = 1
    let parent = this.parent
    while(parent != null) {
      depth++
      parent = parent.parent
    }
    return depth
  }

  getName() {
    return /\/([^\/]+)$/.exec(this.path)[1]
  }

  getDirectory() {
    let directoryPath = /(.+)\/[^\/]+$/.exec(this.path)[1]
    if (directoryPath.indexOf(this.resourcesPath) === 0) {
      directoryPath = directoryPath.substring(this.resourcesPath.length + 1)
    }
    return directoryPath
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
    const resourcesPath = mainModule.resourcesPath
    const processModule = (node) => {
      const module = new Module(node.path, resourcesPath)
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
