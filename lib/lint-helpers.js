const Eval = require('./eval')

exports.isUsingAsar = () => {
  return Eval.execute(() => {
    const mainPath = require('electron').remote.getGlobal('process').mainModule.filename
    return /[\\/]app\.asar[\\/]/.test(mainPath)
  })
}

exports.isListeningForCrashEvents = () => {
  return Eval.execute(() => {
    const webContents = require('electron').remote.getCurrentWebContents()
    // Electron has a crashed listener, so look for more than 1
    return webContents.listenerCount('crashed') > 1
  })
}

exports.isListeningForUnresponsiveEvents = () => {
  return Eval.execute(() => {
    const browserWindow = require('electron').remote.getCurrentWindow()
    return browserWindow.listenerCount('unresponsive') > 0
  })
}


exports.isListeningForUncaughtExceptionEvents = () => {
  return Eval.execute(() => {
    const mainProcess = require('electron').remote.process
    // Electron has an uncaughtException listener, so look for more than 1
    return mainProcess.listenerCount('uncaughtException') > 1
  })
}

exports.getElectronVersion = () => {
  return Eval.execute(() => {
    return process.versions.electron
  })
}
