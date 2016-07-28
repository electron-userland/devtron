'use strict'

const ExpandableView = require('./expandable-view')
const AccessibilityElementView = require('./accessibility-element-view')

class AccessibilityRuleView extends ExpandableView {
  constructor (rule, table) {
    super('rule-row')

    this.rule = rule
    this.count = rule.elements.length

    table.appendChild(this.element)
    this.handleEvents(table)
    this.render()

    this.children = rule.elements.map((element) => {
      return new AccessibilityElementView(element, table)
    })
    this.collapse()
  }

  handleEvents (table) {
    this.listenForSelection(table)
    this.listenForSelectionKeys(table.parentElement)
    this.listenForExpanderKeys(table.parentElement)
  }

  render () {
    this.status.textContent = this.rule.status
    this.severity.textContent = this.rule.severity
    this.ruleName.textContent = this.rule.title
    this.elementCount.textContent = `(${this.count})`
    if (this.count === 0) {
      this.disclosure.style.visibility = 'hidden'
    }
  }
}

module.exports = AccessibilityRuleView
