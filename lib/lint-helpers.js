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
    let isPositiveNumber = (x) => {
      return /^\d+$/.test(x)
    }

    let semverComparer = (semver1, semver2) => {
      let version1segments = semver1.split('.')
      let version2segments = semver2.split('.')

      let validateSegments = (segment) => {
        for (var i = 0; i < segment.length; ++i) {
          if (!isPositiveNumber(segment[i])) {
            return false
          }
        }
        return true
      }

      if (!validateSegments(version1segments) || !validateSegments(version2segments)) {
        return NaN
      }

      for (var i = 0; i < version1segments.length; ++i) {
        if (version2segments.length === i) {
          return 1
        }

        if (version1segments[i] === version2segments[i]) {
          continue
        }
        if (version1segments[i] > version2segments[i]) {
          return 1
        }
        return -1
      }

      if (version1segments.length !== version2segments.length) {
        return -1
      }
      return 0
    }

    window.fetch('https://atom.io/download/atom-shell/index.json')
      .then((response) => {
        return response.json()
      }).then((versions) => {
        return versions.map((release) => {
          return release.version
        }).sort(semverComparer)[versions.length - 1]
      }).then((latestVersion) => {
        window.__devtron.latestElectronVersion = latestVersion
      }).catch(() => {
        window.__devtron.latestElectronVersion = 'unknown'
      })
  })
}
