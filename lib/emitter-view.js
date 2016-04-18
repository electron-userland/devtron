'use strict'

const EventView = require('./event-view')
const ExpandableView = require('./expandable-view')

class EmitterView extends ExpandableView {
  constructor (name, listeners, table) {
    super('emitter-row')

    this.name = name
    this.count = Object.keys(listeners).reduce((count, name) => {
      return count + listeners[name].length
    }, 0)

    table.appendChild(this.element)
    this.render()
    this.handleEvents(table)

    this.children = Object.keys(listeners).map((name) => {
      return new EventView(name, listeners[name], this, table)
    })
    this.collapse()
  }

  handleEvents (table) {
    this.listenForSelection(table)
    this.listenForSelectionKeys(table.parentElement)
    this.listenForExpanderKeys(table.parentElement)
  }

  render () {
    this.emitterName.textContent = this.name
    this.listenerCount.textContent = `(${this.count})`
  }
}

module.exports = EmitterView
