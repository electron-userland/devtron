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

  selectNext (viewClass) {
    let next = this.element.nextElementSibling
    while (next && (next.view instanceof viewClass)) {
      if (next.view.isHidden()) {
        next = next.nextElementSibling
        continue
      }
      this.deselect()
      next.view.select()
      break
    }
  }

  selectPrevious (viewClass) {
    let previous = this.element.previousElementSibling
    while (previous && (previous.view instanceof viewClass)) {
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
}

module.exports = SelectableView
