'use strict'

const Eval = require('./eval')
const ipc = require('./ipc-helpers')
const IpcEventView = require('./ipc-event-view')
const View = require('./view')

class IpcView extends View {
  constructor () {
    super('ipc-view')
    this.children = []
    this.recording = false
    this.handleEvents()
  }

  handleEvents () {
    this.debounceInput(this.searchBox, () => this.filterEvents())
    this.clearButton.addEventListener('click', () => this.clear())
    this.recordButton.addEventListener('click', () => this.toggleRecording())
    this.docsButton.addEventListener('click', () => this.openDocs())
    this.hideInternalButton.addEventListener('click', () => this.toggleHideInternal())
  }

  toggleHideInternal () {
    if (this.hideInternal) {
      this.hideInternalButton.classList.remove('active')
      this.hideInternal = false
      this.children.forEach((child) => {
        if (child.internalEvent) child.show()
      })
    } else {
      this.hideInternalButton.classList.add('active')
      this.hideInternal = true
      this.children.forEach((child) => {
        if (child.internalEvent) child.hide()
      })
    }
  }

  toggleRecording () {
    if (this.recording) {
      this.stopRecording()
      this.recordButton.classList.remove('active')
    } else {
      this.startRecording()
      this.recordButton.classList.add('active')
    }
  }

  startRecording () {
    ipc.listenForEvents().then(() => {
      this.recording = true
      this.addNewEvents()
    }).catch((error) => {
      console.error('Listening for IPC events failed')
      console.error(error.stack || error)
    })
  }

  stopRecording () {
    clearTimeout(this.timeoutId)
    this.recording = false
  }

  openDocs () {
    Eval.openExternal('http://electron.atom.io/docs/latest/api/ipc-main')
  }

  clear () {
    this.ipcTable.innerHTML = ''
    this.destroyChildren()
  }

  addNewEvents () {
    ipc.getEvents().then((events) => {
      if (!this.recording) return
      events.forEach((event) => this.addEvent(event))
      this.timeoutId = setTimeout(() => this.addNewEvents(), 333)
    }).catch((error) => {
      console.error('Getting IPC events failed')
      console.error(error.stack || error)
    })
  }

  addEvent (event) {
    this.tableDescription.classList.add('hidden')
    const eventView = new IpcEventView(event, this.ipcTable)
    this.children.push(eventView)
    this.filterIncomingEvent(eventView)
  }

  filterIncomingEvent (view) {
    if (this.hideInternal && view.internalEvent) {
      view.hide()
    } else {
      const searchText = this.getFilterText()
      if (searchText) view.filter(searchText)
    }
  }

  filterEvents () {
    const searchText = this.getFilterText()
    if (searchText) {
      this.children.forEach((child) => child.filter(searchText))
    } else {
      this.children.forEach((child) => child.show())
    }
  }

  getFilterText () {
    return this.searchBox.value.toLowerCase()
  }
}

module.exports = IpcView
