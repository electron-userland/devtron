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
    this.ruleName.textContent = this.rule.title
    this.elementCount.textContent = `(${this.count})`
  }

  filter (searchText) {
    this.collapse()

    let matches = this.rule.title.toLowerCase().includes(searchText)

    this.children.forEach((child) => {
      if (child.filter(searchText)) matches = true
    })

    if (matches) {
      this.markCollapsed()
      this.show()
      this.markExpanded()
    } else {
      this.hide()
    }
    return matches
  }
}

module.exports = AccessibilityRuleView
