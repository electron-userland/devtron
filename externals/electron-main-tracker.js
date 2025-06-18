/**
 * This file patches the Electron IPCMain methods to track events
 * and send them to the renderer process.
 * It is required in the main process of the Electron app.
 */

import { ipcMain, webContents } from 'electron';
import { MSG_TYPE } from '../common/constants';

export function monitorMain() {
  function trackIpcEvent(direction, channel, args, senderId) {
    const eventData = {
      direction,
      channel,
      args,
      senderId,
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

  const patchIpc = (methodName) => {
    const original = ipcMain[methodName]; // accesses ipcMain.methodName
    /**
     * original example =
     *  function(eventName, listener) {
     *     console.log(`[${name}] One-time Event Registered: ${eventName}`);
     *     return originalOnce.apply(this, arguments);
     *  }
     */

    ipcMain[methodName] = function (channel, listener) {
      const wrapped =
        methodName === 'handle'
          ? async function (event, ...args) {
              trackIpcEvent('renderer-to-main', channel, args);
              return await listener(event, ...args);
            }
          : function (event, ...args) {
              trackIpcEvent('renderer-to-main', channel, args);
              return listener(event, ...args);
            };
      return original.call(ipcMain, channel, wrapped); // mimics this: ipcMain.on('some-channel', (event, arg1, arg2) => {}
    };
  };

  patchIpc('on');
  patchIpc('once');
  patchIpc('handle');
}
