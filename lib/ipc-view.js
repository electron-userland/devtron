'use strict'

const ipc = require('./ipc-helpers')
const IpcEventView = require('./ipc-event-view')
const View = require('./view')

class IpcView extends View {
  constructor () {
    super('ipc-view')
    this.recording = false
    this.handleEvents()
  }

  handleEvents () {
    this.recordButton.addEventListener('click', () => {
      if (this.recording) {
        this.stopRecording()
        this.recordButton.classList.remove('active')
      } else {
        this.startRecording()
        this.recordButton.classList.add('active')
      }
    })
  }

  startRecording () {
    if (this.recording) return

    ipc.listenForEvents().then(() => {
      this.recording = true
      this.intervalId = setInterval(() => {
        this.addNewEvents()
      }, 333)
    }).catch((error) => {
      console.error('Listening for IPC events failed')
      console.error(error.stack || error)
    })
  }

  stopRecording () {
    clearInterval(this.intervalId)
    this.recording = false
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
