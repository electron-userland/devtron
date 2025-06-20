/**
 * This file patches the Electron IPCMain methods to track events
 * and send them to the renderer process.
 * It is required in the main process of the Electron app.
 */

import type { Direction, IpcEventData } from '../types/shared';
import { ipcMain, webContents } from 'electron';
import { MSG_TYPE } from '../common/constants';

export function monitorMain() {
  function trackIpcEvent(direction: Direction, channel: string, args: any[]) {
    const eventData: IpcEventData = {
      direction,
      channel,
      args,
      timestamp: Date.now(),
    };

    /**
     * webContents.getAllWebContents() returns an array of all webContents instances.
     * This will contain web contents for all windows, webviews, opened devtools, and devtools extension background pages.
     * We send event to renderer process, which then sends it to the devtools.
     */
    webContents.getAllWebContents().forEach((wc) => {
      wc.send(MSG_TYPE.RENDER_EVENT, eventData);
    });
  }

  // Patch ipcMain.on
  const originalOn = ipcMain.on.bind(ipcMain);
  ipcMain.on = function (
    channel: string,
    listener: (event: Electron.IpcMainEvent, ...args: any[]) => void
  ): Electron.IpcMain {
    return originalOn(channel, (event, ...args) => {
      trackIpcEvent('renderer-to-main', channel, args);
      listener(event, ...args);
    });
  };

  // Patch ipcMain.once
  const originalOnce = ipcMain.once.bind(ipcMain);
  ipcMain.once = function (
    channel: string,
    listener: (event: Electron.IpcMainEvent, ...args: any[]) => void
  ): Electron.IpcMain {
    return originalOnce(channel, (event, ...args) => {
      trackIpcEvent('renderer-to-main', channel, args);
      listener(event, ...args);
    });
  };

  // Patch ipcMain.handle
  const originalHandle = ipcMain.handle.bind(ipcMain);
  ipcMain.handle = function (
    channel: string,
    listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any
  ): void {
    originalHandle(channel, async (event, ...args) => {
      trackIpcEvent('renderer-to-main', channel, args);
      return await listener(event, ...args);
    });
  };
}
