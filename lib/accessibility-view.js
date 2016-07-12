'use strict'

const Chrome = require('./chrome-helpers')
const Eval = require('./eval')
const AccessibilityRuleView = require('./accessibility-rule-view')
const View = require('./view')
const accessibility = require('./accessibility')

class AccessibilityView extends View {
  constructor () {
    super('accessibility-view')
    this.handleEvents()
  }

  handleEvents () {
    this.docsButton.addEventListener('click', () => this.openDocs())
    this.accessibilityButton.addEventListener('click', () => this.audit())
  }

  audit () {
    accessibility.audit().then(results => {
      return this.render(results)
    })
  }

  render(results) {
    this.tableDescription.classList.add('hidden')
    this.accessibilityResultsTable.innerHTML = ''
    this.children = results.map((result) => {
      return new AccessibilityRuleView(result, this.accessibilityResultsTable)
    })
    this.children[0].select()
  }

  openDocs () {
    Eval.openExternal('https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules')
  }
}

module.exports = AccessibilityView
