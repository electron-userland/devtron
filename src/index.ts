import { app, ipcMain, session } from 'electron';
import path from 'node:path';
import { createRequire } from 'node:module';
import type { Direction, IpcEventData } from './types/shared';

let isInstalled = false;
let isInstalledToDefaultSession = false;
let devtronSW: Electron.ServiceWorkerMain;
/**
 * sends captured IPC events to the service-worker preload script
 */
function trackIpcEvent(
  direction: Direction,
  channel: string,
  args: any[],
  serviceWorker: Electron.ServiceWorkerMain,
  method?: string,
) {
  let uuid = '';
  let newArgs = args;
  // extract the UUID if it exists
  if (args[0] && typeof args[0] === 'object' && args[0].__uuid__devtron) {
    uuid = args[0].__uuid__devtron;
    newArgs = args[0].args;
  }

  const eventData: IpcEventData = {
    direction,
    channel,
    args: newArgs,
    timestamp: Date.now(),
  };
  if (method) eventData.method = method;
  if (uuid) eventData.uuid = uuid;

  if (serviceWorker === null) {
    console.error('The service-worker for Devtron is not registered yet. Cannot track IPC event.');
    return;
  }
  serviceWorker.send('devtron-render-event', eventData);
}

function registerIpcListeners(ses: Electron.Session, serviceWorker: Electron.ServiceWorkerMain) {
  ses.on(
    // @ts-expect-error: '-ipc-message' is an internal event
    '-ipc-message',
    (
      event: Electron.IpcMainEvent | Electron.IpcMainServiceWorkerEvent,
      channel: string,
      args: any[],
    ) => {
      if (event.type === 'frame') trackIpcEvent('renderer-to-main', channel, args, serviceWorker);
      else if (event.type === 'service-worker')
        trackIpcEvent('service-worker-to-main', channel, args, serviceWorker);
    },
  );

  ses.on(
    // @ts-expect-error: '-ipc-invoke' is an internal event
    '-ipc-invoke',
    (
      event: Electron.IpcMainInvokeEvent | Electron.IpcMainServiceWorkerInvokeEvent,
      channel: string,
      args: any[],
    ) => {
      if (event.type === 'frame') trackIpcEvent('renderer-to-main', channel, args, serviceWorker);
      else if (event.type === 'service-worker')
        trackIpcEvent('service-worker-to-main', channel, args, serviceWorker);
    },
  );
  ses.on(
    // @ts-expect-error: '-ipc-message-sync' is an internal event
    '-ipc-message-sync',
    (
      event: Electron.IpcMainEvent | Electron.IpcMainServiceWorkerEvent,
      channel: string,
      args: any[],
    ) => {
      if (event.type === 'frame') trackIpcEvent('renderer-to-main', channel, args, serviceWorker);
      else if (event.type === 'service-worker')
        trackIpcEvent('service-worker-to-main', channel, args, serviceWorker);
    },
  );
}

async function startServiceWorker(ses: Electron.Session, extension: Electron.Extension) {
  try {
    const sw = await ses.serviceWorkers.startWorkerForScope(extension.url);
    sw.startTask();
    devtronSW = sw;
    registerIpcListeners(ses, sw);
  } catch (error) {
    console.warn(`Failed to start Devtron service-worker (${error}), trying again...`);
    /**
     * This is a workaround for the issue where the Devtron service-worker fails to start
     * when the Electron app is launched for the first time, or when the service worker
     * hasn't been cached yet.
     */
    try {
      const handleDetails = async (
        event: Electron.Event,
        details: Electron.RegistrationCompletedDetails,
      ) => {
        if (details.scope === extension.url) {
          const sw = await ses.serviceWorkers.startWorkerForScope(extension.url);
          sw.startTask();
          devtronSW = sw;
          registerIpcListeners(ses, sw);
          ses.serviceWorkers.removeListener('registration-completed', handleDetails);
          console.log(`Devtron service-worker started successfully`);
        }
      };
      ses.serviceWorkers.on('registration-completed', handleDetails);
    } catch (error) {
      console.error('Failed to start Devtron service-worker:', error);
    }
  }
}

function patchIpcMain() {
  const listenerMap = new Map<string, Map<any, any>>(); // channel -> (originalListener -> tracked/cleaned Listener)

  const storeTrackedListener = (channel: string, original: any, tracked: any): void => {
    if (!listenerMap.has(channel)) {
      listenerMap.set(channel, new Map());
    }
    listenerMap.get(channel)!.set(original, tracked);
  };

  const getArgsFromPayload = (payload: any[]): any[] => {
    if (payload[0] && typeof payload[0] === 'object' && payload[0].__uuid__devtron) {
      // If the first argument is an object with __uuid__devtron, return its args property
      return payload[0].args || [];
    }
    // Otherwise, return the payload as is
    return payload;
  };

  const originalOn = ipcMain.on.bind(ipcMain);
  const originalOff = ipcMain.off.bind(ipcMain);
  const originalOnce = ipcMain.once.bind(ipcMain);
  const originalAddListener = ipcMain.addListener.bind(ipcMain);
  const originalRemoveListener = ipcMain.removeListener.bind(ipcMain);
  const originalRemoveAllListeners = ipcMain.removeAllListeners.bind(ipcMain);
  const originalHandle = ipcMain.handle.bind(ipcMain);
  const originalHandleOnce = ipcMain.handleOnce.bind(ipcMain);
  const originalRemoveHandler = ipcMain.removeHandler.bind(ipcMain);

  ipcMain.on = (
    channel: string,
    listener: (event: Electron.IpcMainEvent, ...args: any[]) => void,
  ) => {
    const cleanedListener = (event: Electron.IpcMainEvent, ...args: any[]) => {
      const newArgs = getArgsFromPayload(args);
      listener(event, ...newArgs);
    };
    storeTrackedListener(channel, listener, cleanedListener);
    return originalOn(channel, cleanedListener);
  };

  ipcMain.off = (
    channel: string,
    listener: (event: Electron.IpcMainEvent, ...args: any[]) => void,
  ) => {
    const channelMap = listenerMap.get(channel);
    const cleanedListener = channelMap?.get(listener);

    if (!cleanedListener) return ipcMain;

    channelMap?.delete(listener);
    if (channelMap && channelMap.size === 0) {
      listenerMap.delete(channel);
    }

    trackIpcEvent('main', channel, [], devtronSW, 'off');
    return originalOff(channel, cleanedListener);
  };

  ipcMain.once = (
    channel: string,
    listener: (event: Electron.IpcMainEvent, ...args: any[]) => void,
  ) => {
    const cleanedListener = (event: Electron.IpcMainEvent, ...args: any[]) => {
      const newArgs = getArgsFromPayload(args);
      listener(event, ...newArgs);
    };
    return originalOnce(channel, cleanedListener);
  };

  ipcMain.addListener = (
    channel: string,
    listener: (event: Electron.IpcMainEvent, ...args: any[]) => void,
  ) => {
    const cleanedListener = (event: Electron.IpcMainEvent, ...args: any[]) => {
      const newArgs = getArgsFromPayload(args);
      listener(event, ...newArgs);
    };
    storeTrackedListener(channel, listener, cleanedListener);
    return originalAddListener(channel, cleanedListener);
  };

  ipcMain.removeListener = (
    channel: string,
    listener: (event: Electron.IpcMainEvent, ...args: any[]) => void,
  ) => {
    const channelMap = listenerMap.get(channel);
    const cleanedListener = channelMap?.get(listener);

    if (!cleanedListener) return ipcMain;

    // Remove the listener from the map
    channelMap?.delete(listener);
    // If no listeners left for this channel, remove the channel from the map
    if (channelMap && channelMap.size === 0) {
      listenerMap.delete(channel);
    }
    trackIpcEvent('main', channel, [], devtronSW, 'removeListener');
    return originalRemoveListener(channel, cleanedListener);
  };

  ipcMain.removeAllListeners = (channel?: string) => {
    if (channel) {
      listenerMap.delete(channel);
      trackIpcEvent('main', channel, [], devtronSW, 'removeAllListeners');
      return originalRemoveAllListeners(channel);
    } else {
      listenerMap.clear();
      trackIpcEvent('main', '', [], devtronSW, 'removeAllListeners');
      listenerMap.clear();
      return originalRemoveAllListeners();
    }
  };

  ipcMain.handle = (
    channel: string,
    listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any,
  ) => {
    const cleanedListener = async (event: Electron.IpcMainInvokeEvent, ...args: any[]) => {
      const newArgs = getArgsFromPayload(args);
      const result = await listener(event, ...newArgs);
      return result;
    };
    return originalHandle(channel, cleanedListener);
  };

  ipcMain.handleOnce = (
    channel: string,
    listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any,
  ) => {
    const cleanedListener = async (event: Electron.IpcMainInvokeEvent, ...args: any[]) => {
      const newArgs = getArgsFromPayload(args);
      const result = await listener(event, ...newArgs);
      return result;
    };
    return originalHandleOnce(channel, cleanedListener);
  };

  ipcMain.removeHandler = (channel: string) => {
    listenerMap.delete(channel);
    trackIpcEvent('main', channel, [], devtronSW, 'removeHandler');
    return originalRemoveHandler(channel);
  };
}

async function install() {
  if (isInstalled) return;
  isInstalled = true;

  patchIpcMain();

  const installToSession = async (ses: Electron.Session) => {
    if (ses === session.defaultSession && isInstalledToDefaultSession) return;
    if (ses === session.defaultSession) isInstalledToDefaultSession = true;

    let devtron: Electron.Extension;
    try {
      // register service worker preload script
      const dirname = __dirname; // __dirname is replaced with import.meta.url in ESM builds using webpack
      const serviceWorkerPreloadPath = createRequire(dirname).resolve(
        '@electron/devtron/service-worker-preload',
      );
      const rendererPreloadPath = createRequire(dirname).resolve(
        '@electron/devtron/renderer-preload',
      );

      ses.registerPreloadScript({
        filePath: serviceWorkerPreloadPath,
        type: 'service-worker',
        id: 'devtron-sw-preload',
      });

      ses.registerPreloadScript({
        filePath: rendererPreloadPath,
        type: 'frame',
        id: 'devtron-renderer-preload',
      });

      // load extension
      const extensionPath = path.resolve(serviceWorkerPreloadPath, '..', '..', 'extension');
      devtron = await ses.extensions.loadExtension(extensionPath, { allowFileAccess: true });
      await startServiceWorker(ses, devtron);
      console.log('Devtron loaded successfully');
    } catch (error) {
      console.error('Failed to load Devtron:', error);
    }
  };

  app.on('session-created', installToSession);

  // explicitly install Devtron to the defaultSession in case the app is already ready
  if (!isInstalledToDefaultSession && app.isReady()) await installToSession(session.defaultSession);
}

export const devtron = {
  install,
};
