'use strict'

class Module {
  constructor (path, resourcesPath, appName) {
    this.path = path
    this.resourcesPath = resourcesPath
    this.appName = appName
    this.size = -1
    this.version = ''
    this.children = []
  }

  setVersion (version) {
    this.version = version
    return this
  }

  getVersion () {
    return this.version
  }

  setSize (size) {
    this.size = size
    return this
  }

  getSize () {
    return this.size
  }

  hasChildren () {
    return this.children.length > 0
  }

  addChild (child) {
    this.children.push(child)
    child.parent = this
  }

  getPath () {
    return this.path
  }

  getDepth () {
    let depth = 1
    let parent = this.parent
    while (parent != null) {
      depth++
      parent = parent.parent
    }
    return depth
  }

  getName () {
    return /\/([^\/]+)$/.exec(this.path)[1]
  }

  getDirectory () {
    let directoryPath = /(.+)\/[^\/]+$/.exec(this.path)[1]
    if (directoryPath.indexOf(this.resourcesPath) === 0) {
      directoryPath = directoryPath.substring(this.resourcesPath.length + 1)
    }
    return directoryPath
  }

  computeLibrary () {
    if (/\/atom\.asar\/(browser|common|renderer)\//.test(this.path)) return 'Electron'

    const libraryPattern = /\/node_modules\/([^\/]+)(?=\/)/g
    let match = libraryPattern.exec(this.path)
    while (match != null) {
      let library = match[1]
      match = libraryPattern.exec(this.path)
      if (match == null) return library
    }

    return this.appName
  }

  getLibrary () {
    if (!this.library) this.library = this.computeLibrary()
    return this.library
  }

  getId() {
    if (!this.id) this.id = this.getLibrary().toLowerCase()
    return this.id
  }

  visit (callback) {
    callback(this)
    this.children.forEach((child) => child.visit(callback))
  }

  toArray () {
    const modules = []
    this.visit((module) => modules.push(module))
    return modules
  }
}

module.exports = Module
