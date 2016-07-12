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
    this.accessibilityButton.addEventListener('click', () => this.audit())
  }

  audit () {
    accessibility.audit().then(results => {
      return this.render(results)
    })
  }

  render(results) {
    this.accessibilityResultsTable.innerHTML = ''
    this.children = results.map((result) => {
      return new AccessibilityRuleView(result, this.accessibilityResultsTable)
    })
    this.children[0].select()
  }
}

module.exports = AccessibilityView
