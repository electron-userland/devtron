import { ipcRenderer } from 'electron';
import { MSG_TYPE } from '../common/constants';

type Direction = 'renderer-to-main' | 'main-to-renderer';

interface IpcEvent {
  timestamp: number;
  direction: Direction;
  channel: string;
  args: any[];
}

interface PanelMessage {
  source: typeof MSG_TYPE.SEND_TO_PANEL;
  event: IpcEvent;
}

export function monitorRenderer(): void {
  ipcRenderer.on(MSG_TYPE.RENDER_EVENT, (_event, data: { channel: string; args: any[] }) => {
    track('renderer-to-main', data.channel, data.args);
  });

  const originalOn = ipcRenderer.on.bind(ipcRenderer);
  const originalOnce = ipcRenderer.once.bind(ipcRenderer);
  const originalAddListener = ipcRenderer.addListener.bind(ipcRenderer);

  ipcRenderer.on = function (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) {
    return originalOn(channel, (event, ...args) => {
      track('main-to-renderer', channel, args);
      listener(event, ...args);
    });
  };

  ipcRenderer.once = function (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) {
    return originalOnce(channel, (event, ...args) => {
      track('main-to-renderer', channel, args);
      listener(event, ...args);
    });
  };

  ipcRenderer.addListener = function (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) {
    return originalAddListener(channel, (event, ...args) => {
      track('main-to-renderer', channel, args);
      listener(event, ...args);
    });
  };
}

function track(direction: Direction, channel: string, args: any[]): void {
  const event: IpcEvent = {
    timestamp: Date.now(),
    direction,
    channel,
    args: copyArgs(args),
  };

  const message: PanelMessage = {
    source: MSG_TYPE.SEND_TO_PANEL,
    event,
  };

  window.postMessage(message, '*');
}

function copyArgs(args: any[]): any[] {
  try {
    return structuredClone(args);
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Error cloning args: ${message}`);
    return [`[Could not clone args: ${message}]`];
  }
}
