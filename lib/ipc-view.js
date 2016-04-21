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
    } else {
      this.hideInternalButton.classList.add('active')
      this.hideInternal = true
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
    this.children = []
  }

  isInternalEvent (event) {
    return event.channel.startsWith('ELECTRON_') || event.channel.startsWith('ATOM_')
  }

  addNewEvents () {
    ipc.getEvents().then((events) => {
      if (this.recording) {
        events.forEach((event) => {
          if (this.hideInternal && this.isInternalEvent(event)) return
          this.children.push(new IpcEventView(event, this.ipcTable))
        })

        this.timeoutId = setTimeout(() => {
          this.addNewEvents()
        }, 333)
      }
    }).catch((error) => {
      console.error('Getting IPC events failed')
      console.error(error.stack || error)
    })
  }

  filterEvents () {
    const searchText = this.searchBox.value.toLowerCase()
    if (searchText) {
      this.children.forEach((child) => child.filter(searchText))
    } else {
      this.children.forEach((child) => child.show())
    }
  }
}

module.exports = IpcView
