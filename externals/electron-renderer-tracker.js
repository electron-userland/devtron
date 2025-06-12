import { ipcRenderer } from 'electron';
import { MSG_TYPE } from '../common/constants';

export function monitorRenderer() {
  ipcRenderer.on(MSG_TYPE.RENDER_EVENT, (event, data) => {
    track('renderer-to-main', data.channel, data.args);
  });

  const originalOn = ipcRenderer.on.bind(ipcRenderer);
  const originalOnce = ipcRenderer.once.bind(ipcRenderer);
  const originalAddListener = ipcRenderer.addListener.bind(ipcRenderer);

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

  ipcRenderer.addListener = (channel, listener) => {
    return originalAddListener(channel, (_event, ...args) => {
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
