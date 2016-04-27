'use strict'

const Eval = require('./eval')
const View = require('./view')
const metadata = require('../package')

class AboutView extends View {
  constructor () {
    super('about-view')
    this.handleEvents()
    this.render()
  }

  render () {
    this.versionLabel.textContent = metadata.version
  }

  handleEvents () {
    this.issueButton.addEventListener('click', () => this.reportIssue())
  }

  reportIssue () {
    Eval.openExternal('https://github.com/electron/devtron/issues')
  }
}

module.exports = AboutView
