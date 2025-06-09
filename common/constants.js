const PORT_NAME = Object.freeze({
  PANEL: 'devt-panel',
  CONTENT_SCRIPT: 'devt-content-script',
});

const MSG_TYPE = Object.freeze({
  PING: 'ping',
  PONG: 'pong',
  KEEP_ALIVE: 'keep-alive',
  GET_ALL_EVENTS: 'get-all-events',
  RENDER_EVENT: 'render-event',
  CLEAR_EVENTS: 'clear-events',
  EVENTS_CLEARED_ACK: 'events-cleared-ack',
  ADD_IPC_EVENT: 'add-ipc-event',
  SEND_TO_PANEL: 'send-to-panel',
});

export { PORT_NAME, MSG_TYPE };
