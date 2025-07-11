import type { IpcEventData } from './src/types/shared';

declare global {
  function addIpcEvent(data: IpcEventData): void;
}
export {};
