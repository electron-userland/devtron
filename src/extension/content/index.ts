import { PORT_NAME, MSG_TYPE } from '../../common/constants';
import type { MessageContentScript } from '../../types/shared';

let port: chrome.runtime.Port | null = null;
function ensurePort() {
  if (!port) {
    port = chrome.runtime.connect({ name: PORT_NAME.CONTENT_SCRIPT });
    port.onDisconnect.addListener(() => {
      console.warn('Devtron - Content script: Port disconnected');
      port = null;
    });
  }
}
function startKeepAlivePing() {
  setInterval(() => {
    ensurePort();
    if (port) {
      port.postMessage({
        type: MSG_TYPE.KEEP_ALIVE,
      } satisfies MessageContentScript);
    }
  }, 10 * 1000); // 10 seconds
}

// Start the keep-alive ping
startKeepAlivePing();

if (!(window as any).__DEVTRON_CONTENT_SCRIPT_MSG_LISTENER__) {
  window.addEventListener('message', (event) => {
    if (event.source !== window || event.data.source !== MSG_TYPE.SEND_TO_PANEL) return;
    ensurePort();
    if (port) {
      port.postMessage({
        type: MSG_TYPE.ADD_IPC_EVENT,
        event: event.data.event,
      } satisfies MessageContentScript);
    }
  });
  (window as any).__DEVTRON_CONTENT_SCRIPT_MSG_LISTENER__ = true;
}
