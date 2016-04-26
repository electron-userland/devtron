const View = require('./view')

class SelectableView extends View {
  select () {
    this.selected = true
    this.element.classList.add('active')
    this.element.scrollIntoViewIfNeeded()
  }

  deselect () {
    this.selected = false
    this.element.classList.remove('active')
  }

  selectNext () {
    let next = this.element.nextElementSibling
    while (next && (next.view instanceof SelectableView)) {
      if (next.view.isHidden()) {
        next = next.nextElementSibling
        continue
      }
      this.deselect()
      next.view.select()
      break
    }
  }

  selectPrevious () {
    let previous = this.element.previousElementSibling
    while (previous && (previous.view instanceof SelectableView)) {
      if (previous.view.isHidden()) {
        previous = previous.previousElementSibling
        continue
      }
      this.deselect()
      previous.view.select()
      break
    }
  }

  listenForSelection (emitter) {
    emitter.addEventListener('mousedown', (event) => {
      if (this.element.contains(event.target)) {
        this.select()
      } else {
        this.deselect()
      }
    })
  }

  listenForSelectionKeys (emitter) {
    emitter.addEventListener('keydown', (event) => {
      if (!this.selected) return
      if (event.altKey) return
      if (!emitter.contains(this.element)) return

      switch (event.code) {
        case 'ArrowDown':
          this.selectNext()
          event.stopImmediatePropagation()
          event.preventDefault()
          break
        case 'ArrowUp':
          this.selectPrevious()
          event.stopImmediatePropagation()
          event.preventDefault()
          break
      }
    })
  }
}

module.exports = SelectableView
