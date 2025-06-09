import { ipcRenderer } from 'electron';
import { MSG_TYPE } from '../common/constants';

export function monitorRenderer() {
  const originalSend = ipcRenderer.send.bind(ipcRenderer);
  const originalInvoke = ipcRenderer.invoke.bind(ipcRenderer);
  const originalSendSync = ipcRenderer.sendSync.bind(ipcRenderer);
  const originalOn = ipcRenderer.on.bind(ipcRenderer);
  const originalOnce = ipcRenderer.once.bind(ipcRenderer);

  ipcRenderer.send = (channel, ...args) => {
    track('renderer-to-main', channel, args);
    return originalSend(channel, ...args);
  };

  ipcRenderer.invoke = (channel, ...args) => {
    track('renderer-to-main', channel, args);
    return originalInvoke(channel, ...args);
  };

  ipcRenderer.sendSync = (channel, ...args) => {
    track('renderer-to-main', channel, args);
    return originalSendSync(channel, ...args);
  };

  ipcRenderer.on = (channel, listener) => {
    return originalOn(channel, (_event, ...args) => {
      track('main-to-renderer', channel, args);
      listener(_event, ...args);
    });
  };

  ipcRenderer.once = (channel, listener) => {
    return originalOnce(channel, (_event, ...args) => {
      track('main-to-renderer', channel, args);
      listener(_event, ...args);
    });
  };
}

function track(direction, channel, args) {
  const event = {
    timestamp: Date.now(),
    direction,
    channel,
    args: copyArgs(args),
    processId: process.pid,
  };

  window.postMessage(
    {
      source: MSG_TYPE.SEND_TO_PANEL,
      event,
    },
    '*',
  );
}

function copyArgs(args) {
  try {
    return JSON.parse(JSON.stringify(args));
  } catch (err) {
    return [`[Could not stringify args: ${err.message}]`];
  }
}
