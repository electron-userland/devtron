const ExpandableView = require('./expandable-view')
const EventListenerView = require('./event-listener-view')

class EventView extends ExpandableView {
  constructor (name, listeners, parent, table) {
    super('event-type-row')

    this.name = name
    this.count = listeners.length
    this.parent = parent

    table.appendChild(this.element)
    this.handleEvents(table)
    this.render()

    this.children = listeners.map((listener) => {
      return new EventListenerView(listener, table)
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

  filter (searchText) {
    this.collapse()

    let matches = this.name.includes(searchText)

    this.children.forEach((child) => {
      if (child.filter(searchText)) matches = true
    })

    if (matches) {
      this.markCollapsed()
      this.show()
      this.markExpanded()
    } else {
      this.hide()
    }
    return matches
  }
}

module.exports = EventView
