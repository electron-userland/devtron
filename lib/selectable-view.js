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

  listenForSelection (emitter, event) {
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
