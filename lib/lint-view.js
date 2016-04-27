const Lint = require('./lint-helpers')
const View = require('./view')

class LintView extends View {
  constructor () {
    super('lint-view')
    this.handleEvents()
  }

  reload () {
    this.lint()
  }

  handleEvents () {
    this.lintButton.addEventListener('click', () => this.lint())
  }

  updateAlert (alertElement, descriptionElement, passing) {
    if (passing) {
      alertElement.classList.add('alert-success')
      descriptionElement.classList.add('hidden')
    } else {
      alertElement.classList.add('alert-warning')
      descriptionElement.classList.remove('hidden')
    }
    alertElement.classList.remove('hidden')
    this.tableDescription.classList.add('hidden')
  }

  lint () {
    Lint.isUsingAsar().then((usingAsar) => {
      this.updateAlert(this.usingAsar, this.asarDescription, usingAsar)
    })

    Lint.isListeningForCrashEvents().then((listening) => {
      this.updateAlert(this.crashListener, this.crashDescription, listening)
    })

    Lint.isListeningForUnresponsiveEvents().then((listening) => {
      this.updateAlert(this.unresponsiveListener, this.unresponsiveDescription, listening)
    })

    Lint.isListeningForUncaughtExceptionEvents().then((listening) => {
      this.updateAlert(this.uncaughtListener, this.uncaughtDescription, listening)
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
        setTimeout(() => this.checkLatestVersion(), 250)
      }
    })
  }

  updateVersion () {
    if (!this.latestVersion || !this.currentVersion) return

    const upToDate = this.latestVersion === this.currentVersion
    this.updateAlert(this.outdated, this.outdatedDescription, upToDate)

    this.latestLabel.textContent = this.latestVersion
    this.versionLabel.textContent = this.currentVersion
  }
}

module.exports = LintView
