const Eval = require('./eval')

exports.getEvents = () => {
  return Eval.execute(() => {
    const getEvents = (emitter) => {
      const events = {}
      Object.keys(emitter._events).sort().forEach((name) => {
        let listeners = emitter.listeners(name)
        if (listeners.length > 0) {
          events[name] = listeners.map(listener => listener.toString())
        }
      })
      return events
    }

    return {
      'electron.remote.getCurrentWindow()': getEvents(require('electron').remote.getCurrentWindow()),
      'electron.remote.getCurrentWebContents()': getEvents(require('electron').remote.getCurrentWebContents()),
      'electron.remote.app': getEvents(require('electron').remote.app),
      'electron.remote.ipcMain': getEvents(require('electron').remote.ipcMain),
      'electron.ipcRenderer': getEvents(require('electron').ipcRenderer),
      'global.process': getEvents(global.process),
    }
  })
}
