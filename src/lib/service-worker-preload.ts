import { contextBridge, ipcRenderer } from 'electron';

ipcRenderer.on('devtron-render-event', (event, data) => {
  contextBridge.executeInMainWorld({
    func: (data) => {
      // @ts-expect-error: addIpcEvent is available in the background service-worker
      addIpcEvent(data);
    },
    args: [data],
  });
});
