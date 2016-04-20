'use strict'

const events = require('./event-helpers')
const EmitterView = require('./emitter-view')
const View = require('./view')

class EventsView extends View {
  constructor () {
    super('events-view')
    this.children = []
    this.handleEvents()
  }

  handleEvents () {
    this.loadButton.addEventListener('click', () => this.loadEvents())
    this.debounceInput(this.searchBox, () => this.filterEvents())
  }

  filterEvents () {
    const searchText = this.searchBox.value.toLowerCase()
    if (searchText) {
      this.children.forEach((child) => {
        child.filter(searchText)
      })
    } else {
      this.children.forEach((child) => {
        child.show()
        child.collapse()
      })
    }
  }

  loadEvents () {
    events.getEvents().then((events) => {
      this.listenersTable.innerHTML = ''
      this.children = Object.keys(events).map((name) => {
        return new EmitterView(name, events[name], this.listenersTable)
      })
      this.children[0].select()
    }).catch((error) => {
      console.error('Getting event listeners failed')
      console.error(error.stack || error)
    })
  }
}

module.exports = EventsView
