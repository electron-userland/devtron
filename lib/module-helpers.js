'use strict'

const Eval = require('./eval')
const Module = require('./module')

const loadSizes = (mainModule) => {
  let totalSize = 0
  return Promise.all(mainModule.toArray().map((module) => {
    return Eval.getFileSize(module.path).then((size) => {
      totalSize += size
      return module.setSize(size)
    })
  })).then(() => {
    mainModule.totalSize = totalSize
    return mainModule
  })
}

const loadVersions = (mainModule) => {
  return Promise.all(mainModule.toArray().map((module) => {
    return Eval.getFileVersion(module.path).then((version) => module.setVersion(version))
  })).then(() => mainModule)
}

const createModules = (mainModule) => {
  const {resourcesPath, appName} = mainModule
  const processModule = (node) => {
    const module = new Module(node.path, resourcesPath, appName)
    node.children.forEach((childNode) => {
      module.addChild(processModule(childNode))
    })
    return module
  }

  const convertedMainModule = processModule(mainModule)
  convertedMainModule.count = mainModule.count
  return convertedMainModule
}

exports.getRenderModules = () => {
  return Eval.getRenderRequireGraph().then(createModules).then(loadSizes).then(loadVersions)
}

exports.getMainModules = () => {
  return Eval.getMainRequireGraph().then(createModules).then(loadSizes).then(loadVersions)
}
