'use strict'

const highlight = require('highlight.js')
const SelectableView = require('./selectable-view')

class IpcEventView extends SelectableView {
  constructor (event, table) {
    super('ipc-table-row')

    this.event = event
    this.internalEvent = event.channel.startsWith('ELECTRON_') || event.channel.startsWith('ATOM_')
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
    highlight.highlightBlock(this.eventData)
  }

  filter (searchText) {
    let matches = this.event.channel.toLowerCase().includes(searchText)
    matches = matches || this.event.data.toLowerCase().includes(searchText)
    matches ? this.show() : this.hide()
  }
}

module.exports = IpcEventView
