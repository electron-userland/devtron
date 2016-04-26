const SelectableView = require('./selectable-view')

class ExpandableView extends SelectableView {
  constructor (viewId) {
    super(viewId)
    this.listenForArrowClicks()
  }

  toggleExpansion () {
    if (this.expanded) {
      this.collapse()
    } else {
      this.expand()
    }
  }

  markExpanded () {
    this.expanded = true
    this.disclosure.classList.add('disclosure-arrow-expanded')
  }

  expand () {
    this.markExpanded()
    this.children.forEach((child) => child.show())
  }

  markCollapsed () {
    this.expanded = false
    this.disclosure.classList.remove('disclosure-arrow-expanded')
  }

  collapse () {
    this.markCollapsed()
    this.children.forEach((child) => child.hide())
  }

  collapseAll () {
    this.collapse()
    this.children.forEach((child) => child.collapse())
  }

  hide () {
    super.hide()
    this.children.forEach((child) => child.hide())
  }

  show () {
    super.show()
    if (this.expanded) this.children.forEach((child) => child.show())
  }

  listenForArrowClicks () {
    this.disclosure.addEventListener('click', () => this.toggleExpansion())
  }

  listenForExpanderKeys (emitter) {
    this.bindListener(emitter, 'keydown', (event) => {
      if (!this.selected) return
      if (!emitter.contains(this.element)) return

      switch (event.code) {
        case 'ArrowLeft':
          if (this.expanded) {
            this.collapse()
          } else if (this.parent && this.parent.expanded) {
            this.deselect()
            this.parent.collapse()
            this.parent.select()
          }
          event.stopImmediatePropagation()
          event.preventDefault()
          break
        case 'ArrowRight':
          this.expand()
          event.stopImmediatePropagation()
          event.preventDefault()
          break
      }
    })
  }
}

module.exports = ExpandableView
