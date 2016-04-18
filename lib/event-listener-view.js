'use strict'

const SelectableView = require('./selectable-view')

class EventListenerView extends SelectableView {
  constructor (listener, parent) {
    super('js-listener-code-row')

    this.listener = listener
    parent.appendChild(this.element)
    this.render()
    this.handleEvents(parent)
  }

  handleEvents (parent) {
    this.listenForSelection(parent)
    this.listenForSelectionKeys(parent.parentElement)
  }

  render () {
    this.listenerValue.textContent = this.listener
  }
}

module.exports = EventListenerView
