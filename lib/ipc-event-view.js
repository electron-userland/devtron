'use strict'

const SelectableView = require('./selectable-view')

class IpcEventView extends SelectableView {
  constructor (event, table) {
    super('ipc-table-row')

    this.event = event
    table.appendChild(this.element)
    this.listenForSelection(table)
    this.listenForSelectionKeys(table.parentElement)
    this.render()
  }

  render () {
    this.eventName.textContent = this.event.channel

    if (this.event.sent) {
      this.eventIcon.classList.add('ipc-icon-sent')
    } else {
      this.eventIcon.classList.add('ipc-icon-received')
    }

    if (!this.event.sync) {
      this.syncIcon.style.display = 'none'
    }

    if (this.event.listenerCount > 0) {
      this.eventListenerCount.textContent = this.event.listenerCount
    }

    this.eventData.textContent = this.event.data
  }
}

module.exports = IpcEventView
