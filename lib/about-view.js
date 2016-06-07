'use strict'

const Chrome = require('./chrome-helpers')
const Eval = require('./eval')
const View = require('./view')
const metadata = require('../package')

class AboutView extends View {
  constructor () {
    super('about-view')
    this.handleEvents()
    this.apis = Chrome.getChromeAPIs()
    this.render()
  }

  render () {
    this.versionLabel.textContent = metadata.version

    this.tabID.textContent = chrome.devtools.inspectedWindow.tabId
    this.runtimeID.textContent = chrome.runtime.id

    this.chromeAPIs.textContent = this.apis.sort().join('\n')
  }

  handleEvents () {
    this.issueButton.addEventListener('click', () => this.reportIssue())
  }

  reportIssue () {
    Eval.openExternal('https://github.com/electron/devtron/issues')
  }
}

module.exports = AboutView
