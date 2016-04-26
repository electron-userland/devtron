const Eval = require('./eval')
const View = require('./view')

class AboutView extends View {
  constructor() {
    super('about-view')
    this.handleEvents()
  }

  handleEvents () {
    this.issueButton.addEventListener('click', () => this.reportIssue())
  }

  reportIssue () {
    Eval.openExternal('https://github.com/electron/devtron/issues')
  }
}

module.exports = AboutView
