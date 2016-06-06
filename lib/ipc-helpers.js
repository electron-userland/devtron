'use strict'

const Eval = require('./eval')

exports.listenForEvents = () => {
  return Eval.execute(() => {
    // Return if events are already being listened to to prevent duplicates
    // when reloading the extension
    if (window.__devtron.events != null) {
      window.__devtron.events = []
      return
    }

    window.__devtron.events = []

    const ipcRenderer = require('electron').ipcRenderer

    const ignoredEvents = {
      'ATOM_BROWSER_DEREFERENCE': true,
      'ELECTRON_BROWSER_DEREFERENCE': true
    }

    const trackEvent = (channel, args, sent, sync) => {
      if (window.__devtron.evaling) return
      if (ignoredEvents.hasOwnProperty(channel)) return

      let data
      try {
        data = JSON.stringify(args)
      } catch (error) {
        data = `Failed to serialize args to JSON: ${error.message || error}`
      }

      window.__devtron.events.push({
        channel: channel,
        data: data,
        listenerCount: ipcRenderer.listenerCount(channel),
        sent: !!sent,
        sync: !!sync
      })
    }

    const originalEmit = ipcRenderer.emit
    ipcRenderer.emit = function (channel, event) {
      const args = Array.prototype.slice.call(arguments, 2)
      trackEvent(channel, args)
      return originalEmit.apply(ipcRenderer, arguments)
    }

    const originalSend = ipcRenderer.send
    ipcRenderer.send = function (channel) {
      const args = Array.prototype.slice.call(arguments, 1)
      trackEvent(channel, args, true)
      return originalSend.apply(ipcRenderer, arguments)
    }

    const originalSendSync = ipcRenderer.sendSync
    ipcRenderer.sendSync = function (channel) {
      const args = Array.prototype.slice.call(arguments, 1)
      trackEvent(channel, args, true, true)
      const returnValue = originalSendSync.apply(ipcRenderer, arguments)
      trackEvent(channel, [returnValue], false, true)
      return returnValue
    }
  })
}

exports.getEvents = () => {
  return Eval.execute(() => {
    const events = window.__devtron.events
    if (events) window.__devtron.events = []
    return events
  }).then((events) => {
    if (events) return events

    // Start listening for events if array is missing meaning
    // the window was reloaded
    return exports.listenForEvents().then(() => [])
  })
}
