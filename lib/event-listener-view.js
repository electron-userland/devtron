'use strict'

const ExpandableView = require('./expandable-view')
const SelectableView = require('./selectable-view')
const events = require('./event-helpers')

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

class EventView extends ExpandableView {
  constructor (name, listeners, parent, table) {
    super('js-event-type-row')

    this.name = name
    this.count = listeners.length
    this.parent = parent

    table.appendChild(this.element)
    this.handleEvents(table)
    this.render()

    this.children = listeners.map((listener) => {
      return new ListenerView(listener, table)
    })
    this.collapse()
  }

  handleEvents (table) {
    this.listenForSelection(table)
    this.listenForSelectionKeys(table.parentElement)
    this.listenForExpanderKeys(table.parentElement)
  }

  render () {
    this.eventName.textContent = this.name
    this.listenerCount.textContent = `(${this.count})`
  }
}


class EmitterView extends ExpandableView {
  constructor (name, listeners, table) {
    super('js-emitter-row')

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
    this.disclosure.addEventListener('click', () => this.toggleExpansion())
    this.listenForSelection(table)
    this.listenForSelectionKeys(table.parentElement)
    this.listenForExpanderKeys(table.parentElement)
  }

  render () {
    this.emitterName.textContent = this.name
    this.listenerCount.textContent = `(${this.count})`
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.js-listeners-table')

  events.getEvents().then((events) => {
    const emitterViews = Object.keys(events).map((name) => {
      return new EmitterView(name, events[name], table)
    })
    emitterViews[0].select()
  }).catch((error) => {
    console.error('Getting event listeners failed')
    console.error(error.stack || error)
  })
})
