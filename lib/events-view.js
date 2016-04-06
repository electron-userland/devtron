'use strict'

const ExpandableView = require('./expandable-view')
const SelectableView = require('./selectable-view')
const events = require('./event-helpers')

class ListenerView extends SelectableView {
  constructor (listener, parent) {
    super('js-listener-code-row')

    this.listener = listener
    parent.appendChild(this.element)
    this.render()
    this.listenForSelection(parent, 'mousedown')
  }

  render () {
    this.listenerValue.textContent = this.listener
  }
}

class EventView extends ExpandableView {
  constructor (name, listeners, parent) {
    super('js-event-type-row')

    this.name = name
    parent.appendChild(this.element)
    this.handleEvents()
    this.render()
    this.children = listeners.map((listener) => {
      return new ListenerView(listener, parent)
    })
    this.collapse()
    this.listenForSelection(parent, 'mousedown')
  }

  handleEvents () {
    this.disclosure.addEventListener('click', () => this.toggleExpansion())
  }

  render () {
    this.eventName.textContent = this.name
  }
}


class EmitterView extends ExpandableView {
  constructor (name, listeners, parent) {
    super('js-emitter-row')

    this.name = name
    parent.appendChild(this.element)
    this.render()
    this.handleEvents()
    this.children = Object.keys(listeners).map((name) => {
      return new EventView(name, listeners[name], parent)
    })
    this.collapse()
    this.listenForSelection(parent, 'mousedown')
  }

  handleEvents () {
    this.disclosure.addEventListener('click', () => this.toggleExpansion())
  }

  render () {
    this.emitterName.textContent = this.name
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.js-listeners-table')

  events.getEvents().then((events) => {
    Object.keys(events).forEach((name) => {
      new EmitterView(name, events[name], table)
    })
  }).catch((error) => {
    console.error('Getting event listeners failed')
    console.error(error.stack || error)
  })
})
