const SelectableView = require('./selectable-view')

class ExpandableView extends SelectableView {
  toggleExpansion () {
    if (this.expanded) {
      this.collapse()
    } else {
      this.expand()
    }
  }

  expand () {
    this.expanded = true
    this.disclosure.classList.add('disclosure-arrow-expanded')
    this.children.forEach((child) => child.show())
  }

  collapse () {
    this.expanded = false
    this.disclosure.classList.remove('disclosure-arrow-expanded')
    this.children.forEach((child) => child.hide())
  }

  hide () {
    super.hide()
    this.children.forEach((child) => child.hide())
  }

  show () {
    super.show()
    if (this.expanded) this.children.forEach((child) => child.show())
  }
}

module.exports = ExpandableView
