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

  listenForExpanderKeys (emitter, viewClass) {
    emitter.addEventListener('keydown', (event) => {
      if (!this.selected) return

      switch (event.code) {
        case 'ArrowDown':
          this.selectNext(viewClass)
          event.stopImmediatePropagation()
          event.preventDefault()
          break
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
        case 'ArrowUp':
          this.selectPrevious(viewClass)
          event.stopImmediatePropagation()
          event.preventDefault()
          break
      }
    })
  }
}

module.exports = ExpandableView
