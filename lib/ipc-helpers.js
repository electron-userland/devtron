const Eval = require('./eval')

exports.listenForEvents = () => {
  return Eval.execute(() => {
    // Return if events are already being listened to to prevent duplicates
    // when reloading the extension
    if (global.__devtron.events != null) return
    global.__devtron.events = []

    const ipcRenderer = require('electron').ipcRenderer

    const ignoredEvents = {
      'ATOM_BROWSER_DEREFERENCE': true
    }

    const trackEvent = (channel, args, sent) => {
      if (global.__devtron.evaling) return
      if (ignoredEvents.hasOwnProperty(channel)) return

      let data
      try {
        data = JSON.stringify(args)
      } catch (error) {
        data = `Failed to serialize args to JSON: ${error.message || error}`
      }

      global.__devtron.events.push({
        channel: channel,
        data: data,
        listenerCount: ipcRenderer.listenerCount(channel),
        sent: sent
      })
    }

    const originalEmit = ipcRenderer.emit
    ipcRenderer.emit = function (channel, event, ...args) {
      trackEvent(channel, args)
      return originalEmit.apply(ipcRenderer, arguments)
    }

    const originalSend = ipcRenderer.send
    ipcRenderer.send = function (channel, ...args) {
      trackEvent(channel, args, true)
      return originalSend.apply(ipcRenderer, arguments)
    }

    const originalSendSync = ipcRenderer.sendSync
    ipcRenderer.sendSync = function (channel, ...args) {
      trackEvent(channel, args, true)
      const returnValue = originalSendSync.apply(ipcRenderer, arguments)
      trackEvent(channel, [returnValue])
      return returnValue
    }
  })
}

exports.getEvents = () => {
  return Eval.execute(() => {
    const events = global.__devtron.events.slice()
    global.__devtron.events = []
    return events
  })
}
