const Lint = require('./lint-helpers')
const View = require('./view')

class LintView extends View {
  constructor () {
    super('lint-view')
    this.lint()
  }

  updateAlert (element, passing) {
    if (passing) {
      element.classList.add('alert-success')
    } else {
      element.classList.add('alert-danger')
    }
    element.classList.remove('hidden')
  }

  lint () {
    Lint.isUsingAsar().then((usingAsar) => {
      this.updateAlert(this.usingAsar, usingAsar)
    })

    Lint.isListeningForCrashEvents().then((listening) => {
      this.updateAlert(this.crashListener, listening)
    })

    Lint.isListeningForUnresponsiveEvents().then((listening) => {
      this.updateAlert(this.unresponsiveListener, listening)
    })

    Lint.isListeningForUncaughtExceptionEvents().then((listening) => {
      this.updateAlert(this.uncaughtListener, listening)
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

    const upToDate = this.latestVersion === this.currentVersion
    this.updateAlert(this.outdated, upToDate)
  }
}

module.exports = LintView
