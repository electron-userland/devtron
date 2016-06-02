'use strict'

const Eval = require('./eval')
const View = require('./view')
const metadata = require('../package')

class AboutView extends View {
  constructor () {
    super('about-view')
    this.handleEvents()
    this.apis = this.getChromeAPIs([], 'chrome', window.chrome)
    this.render()
  }

  render () {
    this.versionLabel.textContent = metadata.version
    this.chromeAPIs.textContent = this.apis.sort().join('\n')
  }

  getChromeAPIs (apis, parent, object) {
    for (const property in object) {
      const api = parent + '.' + property
      if (typeof object[property] === 'object') {
        this.getChromeAPIs(apis, api, object[property])
      } else {
        apis.push(api)
      }
    }
    return apis
  }

  handleEvents () {
    this.issueButton.addEventListener('click', () => this.reportIssue())
  }

  reportIssue () {
    Eval.openExternal('https://github.com/electron/devtron/issues')
  }
}

module.exports = AboutView
