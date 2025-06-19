import type { MSG_TYPE } from '../common/constants';
/* ------------------ ELECTRON-PROCESS ------------------ */
export type Direction = 'renderer-to-main' | 'main-to-renderer';
export interface IpcEventData {
  direction: Direction;
  channel: string;
  args: any[];
  timestamp: number;
}
/* ------------------------------------------------------ */

/* ---------------------- EXTENSION --------------------- */
export interface IpcEventDataIndexed extends IpcEventData {
  serialNumber: number;
}
export type MessagePanel =
  | { type: typeof MSG_TYPE.PONG }
  | { type: typeof MSG_TYPE.PING }
  | { type: typeof MSG_TYPE.KEEP_ALIVE }
  | { type: typeof MSG_TYPE.GET_ALL_EVENTS }
  | { type: typeof MSG_TYPE.CLEAR_EVENTS }
  | { type: typeof MSG_TYPE.RENDER_EVENT; event: IpcEventDataIndexed };

export type MessageContentScript =
  | { type: typeof MSG_TYPE.ADD_IPC_EVENT; event: IpcEventDataIndexed }
  | { type: typeof MSG_TYPE.KEEP_ALIVE };
/* ------------------------------------------------------ */
