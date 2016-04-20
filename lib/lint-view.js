const Lint = require('./lint-helpers')
const View = require('./view')

class LintView extends View {
  constructor () {
    super('lint-view')
    this.lint()
  }

  lint () {
    Lint.isUsingAsar().then((usingAsar) => {
      if (!usingAsar) {
        this.usingAsar.classList.remove('hidden')
      } else {
        this.usingAsar.classList.add('hidden')
      }
    })

    Lint.isListeningForCrashEvents().then((listening) => {
      if (!listening) {
        this.crashListener.classList.remove('hidden')
      } else {
        this.crashListener.classList.add('hidden')
      }
    })

    Lint.isListeningForUnresponsiveEvents().then((listening) => {
      if (!listening) {
        this.unresponsiveListener.classList.remove('hidden')
      } else {
        this.unresponsiveListener.classList.add('hidden')
      }
    })

    Lint.isListeningForUncaughtExceptionEvents().then((listening) => {
      if (!listening) {
        this.uncaughtListener.classList.remove('hidden')
      } else {
        this.uncaughtListener.classList.add('hidden')
      }
    })

    this.checkVersion()
  }

  checkVersion () {
    Lint.getCurrentElectronVersion().then((version) => {
      this.currentVersion = version
      this.updateVersion()
    })
    Lint.fetchLatestVersion()
    this.checkLatestVersion()
  }

  checkLatestVersion () {
    Lint.getLatestElectronVersion().then((version) => {
      if (version) {
        this.latestVersion = version
        this.updateVersion()
      } else {
        setTimeout(() => checkLatestVersion(), 250)
      }
    })
  }

  updateVersion () {
    if (!this.latestVersion || !this.currentVersion) return

    if (this.latestVersion !== this.currentVersion) {
      this.outdated.classList.remove('hidden')
    } else {
      this.outdated.classList.add('hidden')
    }
  }
}

module.exports = LintView
