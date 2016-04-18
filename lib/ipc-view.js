'use strict'

const ipc = require('./ipc-helpers')
const IpcEventView = require('./ipc-event-view')
const View = require('./view')

class IpcView extends View {
  constructor () {
    super('js-ipc-view')
    this.handleEvents()
  }

  handleEvents () {
    ipc.listenForEvents().then(() => {
      setInterval(() => {
        this.addNewEvents()
      }, 333)
    }).catch((error) => {
      console.error('Listening for IPC events failed')
      console.error(error.stack || error)
    })
  }

  addNewEvents () {
    ipc.getEvents().then((events) => {
      events.forEach((event) => new IpcEventView(event, this.ipcTable))
    }).catch((error) => {
      console.error('Getting IPC events failed')
      console.error(error.stack || error)
    })
  }
}

module.exports = IpcView
