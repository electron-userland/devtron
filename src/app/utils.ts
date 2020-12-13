import { DEVTRON_CHANNEL, MessageContent } from '../constants'

export function sendMessage(message: MessageContent) {
  const json = JSON.stringify(message)

  const evalString = `(async () => {
    const payload = await require('electron').ipcRenderer.invoke('${DEVTRON_CHANNEL}', ${json})
    window.postMessage({
      type: '${message.type}',
      payload,
    }, '*');
  })()`

  chrome.devtools.inspectedWindow.eval(evalString, (result, exceptionInfo) => {
    // console.log(result, exceptionInfo)
  })
}
