import { app, session } from 'electron';
import path from 'node:path';
import { createRequire } from 'node:module';
import type { Direction, IpcEventData } from './types/shared';

let isInstalled = false;
let isInstalledToDefaultSession = false;

/**
 * sends captured IPC events to the service-worker preload script
 */
function trackIpcEvent(
  direction: Direction,
  channel: string,
  args: any[],
  serviceWorker: Electron.ServiceWorkerMain,
) {
  const eventData: IpcEventData = {
    direction,
    channel,
    args,
    timestamp: Date.now(),
  };

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

async function install() {
  if (isInstalled) return;
  isInstalled = true;

  const installToSession = async (ses: Electron.Session) => {
    if (ses === session.defaultSession && isInstalledToDefaultSession) return;
    if (ses === session.defaultSession) isInstalledToDefaultSession = true;

    let devtron: Electron.Extension;
    try {
      // register service worker preload script
      const dirname = __dirname; // __dirname is replaced with import.meta.url in ESM builds using webpack
      const filePath = createRequire(dirname).resolve('@electron/devtron/service-worker-preload');

      ses.registerPreloadScript({
        filePath,
        type: 'service-worker',
        id: 'devtron-preload',
      });

      // load extension
      const extensionPath = path.resolve(filePath, '..', '..', 'extension');
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
