const portMap: Record<string, chrome.runtime.Port> = {}

// Handle messages from devtools page
// Initialize connection port and set tab id
chrome.runtime.onConnect.addListener((port) => {
  const extensionListener = (message: { tabId: number }) => {
    portMap[message.tabId] = port
    console.log('portMap', portMap)
  }
  port.onMessage.addListener(extensionListener)
  port.onDisconnect.addListener((port) => {
    port.onMessage.removeListener(extensionListener)
    Object.keys(portMap).forEach((id) => {
      if (port === portMap[id]) {
        delete portMap[id]
      }
    })
  })
})

// Handle messages from content script
// Send it to devtools page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('onMessage', message)
  const tabId = sender.tab?.id
  if (tabId) {
    portMap[tabId]?.postMessage(message)
  }
})
