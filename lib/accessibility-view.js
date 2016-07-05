'use strict'

const Chrome = require('./chrome-helpers')
const Eval = require('./eval')
const EmitterView = require('./emitter-view')
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
    this.children = Object.keys(results.warnings).map(code => {
      var warning = results.warnings[code]
      return new EmitterView(code, warning, this.accessibilityResultsTable)
    })
    this.children[0].select()
  }
}

module.exports = AccessibilityView
