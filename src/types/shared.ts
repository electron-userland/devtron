import type { MSG_TYPE } from '../common/constants';
/* ------------------ ELECTRON-PROCESS ------------------ */
export type Direction =
  | 'renderer-to-main'
  | 'main-to-renderer'
  | 'service-worker-to-main'
  | 'renderer'
  | 'main';
export interface IpcEventData {
  direction: Direction;
  channel: string;
  args: any[];
  timestamp: number;
  method?: string;
  responseTime?: number; // To track response time for `sendSync` and `invoke` methods
  uuid?: string; // UUID to match requests and responses (for `invoke` and `sendSync` methods on `ipcRenderer`)
}
/* ------------------------------------------------------ */

/* ---------------------- EXTENSION --------------------- */
export interface IpcEventDataIndexed extends IpcEventData {
  serialNumber: number;
  gotoSerialNumber?: number; // For navigating to a specific event in the grid 
}
export type MessagePanel =
  | { type: typeof MSG_TYPE.PONG }
  | { type: typeof MSG_TYPE.PING }
  | { type: typeof MSG_TYPE.GET_ALL_EVENTS }
  | { type: typeof MSG_TYPE.CLEAR_EVENTS }
  | { type: typeof MSG_TYPE.RENDER_EVENT; event: IpcEventDataIndexed };

export type MessageContentScript = {
  type: typeof MSG_TYPE.ADD_IPC_EVENT;
  event: IpcEventDataIndexed;
};
/* ------------------------------------------------------ */
