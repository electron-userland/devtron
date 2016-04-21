const Eval = require('./eval')

exports.listenForEvents = () => {
  return Eval.execute(() => {
    // Return if events are already being listened to to prevent duplicates
    // when reloading the extension
    if (global.__devtron.events != null) {
      global.__devtron.events = []
      return
    }

    global.__devtron.events = []

    const ipcRenderer = require('electron').ipcRenderer

    const ignoredEvents = {
      'ATOM_BROWSER_DEREFERENCE': true
    }

    const trackEvent = (channel, args, sent, sync) => {
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
        sent: sent,
        sync: sync
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
      trackEvent(channel, args, true, true)
      const returnValue = originalSendSync.apply(ipcRenderer, arguments)
      trackEvent(channel, [returnValue], false, true)
      return returnValue
    }
  })
}

exports.getEvents = () => {
  return Eval.execute(() => {
    const events = global.__devtron.events
    if (events) global.__devtron.events = []
    return events
  }).then((events) => {
    if (events) return events

    // Start listening for events if array is missing meaning
    // the window was reloaded
    return exports.listenForEvents().then(() => [])
  })
}
