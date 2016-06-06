'use strict'

const Eval = require('./eval')

exports.isUsingAsar = () => {
  return Eval.execute(() => {
    const mainPath = require('electron').remote.process.mainModule.filename
    return /[\\/]app\.asar[\\/]/.test(mainPath)
  })
}

exports.isListeningForCrashEvents = () => {
  return Eval.execute(() => {
    const webContents = require('electron').remote.getCurrentWebContents()
    // For versions less than 1.x.y
    // Electron has an crashed listener, so look for more than 1
    const crashedForwarding = /^0/.test(process.versions.electron)
    const minCount = crashedForwarding ? 1 : 0
    return webContents.listenerCount('crashed') > minCount
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

exports.getCurrentElectronVersion = () => {
  return Eval.execute(() => {
    return process.versions.electron
  })
}

exports.getLatestElectronVersion = () => {
  return Eval.execute(() => {
    return window.__devtron.latestElectronVersion
  })
}

exports.fetchLatestVersion = () => {
  return Eval.execute(() => {
    window.fetch('https://atom.io/download/atom-shell/index.json')
      .then((response) => {
        return response.json()
      }).then((versions) => {
        window.__devtron.latestElectronVersion = versions[0].version
      }).catch(() => {
        window.__devtron.latestElectronVersion = 'unknown'
      })
  })
}
