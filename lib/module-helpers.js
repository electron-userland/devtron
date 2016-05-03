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
  const resourcesPath = mainModule.resourcesPath
  const appName = mainModule.appName
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

const getRenderRequireGraph = () => {
  return Eval.execute(() => {
    let count = 0
    const walkModule = (module) => {
      count++
      let modulePath = module.filename || module.id
      if (process.platform === 'win32') {
        modulePath = modulePath.replace(/\\/g, '/')
      }
      return {
        path: modulePath,
        children: module.children.map(walkModule)
      }
    }
    const mainModule = walkModule(process.mainModule)
    mainModule.resourcesPath = process.resourcesPath
    mainModule.appName = require('electron').remote.app.getName()
    mainModule.count = count
    return mainModule
  })
}

const getMainRequireGraph = () => {
  return Eval.execute(() => {
    let process = require('electron').remote.process
    let count = 0
    const walkModule = (module) => {
      count++
      let modulePath = module.filename || module.id
      if (process.platform === 'win32') {
        modulePath = modulePath.replace(/\\/g, '/')
      }
      return {
        path: modulePath,
        children: module.children.map(walkModule)
      }
    }
    const mainModule = walkModule(process.mainModule)
    mainModule.resourcesPath = process.resourcesPath
    mainModule.appName = require('electron').remote.app.getName()
    mainModule.count = count
    return mainModule
  })
}

exports.getRenderModules = () => {
  return getRenderRequireGraph().then(createModules).then(loadSizes).then(loadVersions)
}

exports.getMainModules = () => {
  return getMainRequireGraph().then(createModules).then(loadSizes).then(loadVersions)
}
