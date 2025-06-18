import { PORT_NAME, MSG_TYPE } from '../../common/constants';

let port;
function ensurePort() {
  if (!port || port.disconnected) {
    port = chrome.runtime.connect({ name: PORT_NAME.CONTENT_SCRIPT });
    port.onDisconnect.addListener(() => {
      console.warn('content: Port disconnected');
      port = null;
    });
  }
}
function startKeepAlivePing() {
  setInterval(() => {
    ensurePort();
    if (port) {
      port.postMessage({ type: MSG_TYPE.KEEP_ALIVE });
    }
  }, 10 * 1000); // 10 seconds
}

// Start the keep-alive ping
startKeepAlivePing();

window.addEventListener('message', (event) => {
  if (event.source !== window || event.data.source !== MSG_TYPE.SEND_TO_PANEL)
    return;

  ensurePort();
  if (port) {
    port.postMessage({ type: MSG_TYPE.ADD_IPC_EVENT, event: event.data.event });
  }
});
