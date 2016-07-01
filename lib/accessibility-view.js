'use strict'

const Chrome = require('./chrome-helpers')
const Eval = require('./eval')
const View = require('./view')
const accessibility = require('./accessibility')

class AccessibilityView extends View {
  constructor () {
    console.log("a-view")
    super('accessibility-view')
    this.handleEvents()
    // this.apis = Chrome.getChromeAPIs()
    // this.render()
  }

  handleEvents () {
    this.accessibilityButton.addEventListener('click', () => this.audit())
  }

  audit () {
    accessibility.audit().then(this.render)
  }

  render(results) {
    console.error(JSON.stringify(results, null, 2))


    // var output = Object.keys(results.warnings).map(code => {
    //   var warning = results.warnings[code]
    //   console.error(warning)
    //   console.error('\n\n')
    //   `
    //     <tr>
    //       <td>${warning.code}</td>
    //       <td>${warning.title}</td>
    //       <td>${warning.url}</td>
    //     </tr>
    //   `
    // }).join('\n\n')

    this.auditResults.innerHTML = 'Hello'
  }
}

module.exports = AccessibilityView
