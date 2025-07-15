import { contextBridge, ipcRenderer } from 'electron';

ipcRenderer.on('devtron-render-event', (event, data) => {
  contextBridge.executeInMainWorld({
    func: (data) => {
      addIpcEvent(data); // addIpcEvent is available in the background service-worker
    },
    args: [data],
  });
});
