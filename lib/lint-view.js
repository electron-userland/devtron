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
  }
}

module.exports = LintView
