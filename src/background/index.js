import Denque from 'denque';
import { MSG_TYPE, PORT_NAME } from '../../common/constants';

/* ------------------------------------------------------ */
/**
 * This is used to keep the background script alive. More testing is needed to determine whether it is needed or not
 * since other KEEP_ALIVE methods are already implemented in the content script and panel script.
 * Code copied from: https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
 */
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();
/* ------------------------------------------------------ */

const MAX_EVENTS = 1000;
const ipcEvents = new Denque();

const connections = {
  panel: null,
  contentScript: null,
};

function handlePanelMessage(message) {
  switch (message.type) {
    case MSG_TYPE.PING:
      connections.panel.postMessage({ type: MSG_TYPE.PONG }); // (mimics `port.postMessage(...)`)
      break;
    case MSG_TYPE.KEEP_ALIVE:
      connections.panel.postMessage({ type: MSG_TYPE.KEEP_ALIVE }); // This message is not received anywhere: #REMOVE
      break;
    case MSG_TYPE.GET_ALL_EVENTS:
      for (let i = 0; i < ipcEvents.length; i++) {
        const event = ipcEvents.get(i);
        connections.panel.postMessage({ type: MSG_TYPE.RENDER_EVENT, event });
      }
      break;
    case MSG_TYPE.CLEAR_EVENTS:
      ipcEvents.clear();
      break;
  }
}

function handleContentMessage(message) {
  function addIpcEvent(event) {
    const last = ipcEvents.get(ipcEvents.length - 1);
    const newEvent = {
      serialNumber: (last?.serialNumber ?? 0) + 1,
      ...event,
    };
    ipcEvents.push(newEvent);
    /* Remove the oldest event if the length exceeds MAX_EVENTS */
    if (ipcEvents.length > MAX_EVENTS) ipcEvents.shift();
    if (connections.panel) {
      connections.panel.postMessage({
        type: MSG_TYPE.RENDER_EVENT,
        event: newEvent,
      });
    }
  }
  switch (message.type) {
    case MSG_TYPE.ADD_IPC_EVENT:
      addIpcEvent(message.event);
      break;
    case MSG_TYPE.KEEP_ALIVE:
      break;
  }
}

/**
 *  chrome.runtime.onConnect: Fired when a connection is made from either an extension process or a content script.
 *  This is used to listen for connections from the devtools panel and content scripts.
 */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === PORT_NAME.PANEL) {
    connections.panel = port;
    port.onMessage.addListener((message) => handlePanelMessage(message));
    port.onDisconnect.addListener(() => {
      console.warn('Devtron - Background script: Panel disconnected'); // #EDIT: Add better logging
      connections.panel = null;
    });
  } else if (port.name === PORT_NAME.CONTENT_SCRIPT) {
    connections.contentScript = port;
    port.onMessage.addListener((message) => handleContentMessage(message));
    port.onDisconnect.addListener(() => {
      console.log('Devtron - Background script: Content script disconnected'); // #EDIT: Add better logging
      connections.contentScript = null;
    });
  }
});
