// https://developer.chrome.com/extensions/devtools#evaluated-scripts-to-devtools
window.addEventListener('message', (event) => {
  if (event.source === window) {
    console.log('content-script', event.data)
    chrome.runtime.sendMessage(event.data)
  }
})
