export const DEVTRON_CHANNEL = 'DEVTRON_CHANNEL'

export interface LintPayload {
  asar: boolean
  crash: boolean
  unresponsive: boolean
  uncaughtException: boolean
  currentVersion: string
  latestVersion: string
}

export interface LintMessage {
  type: 'lint'
  payload?: LintPayload
}

type EventListenersItem = Record<string, string[]>

export interface EventListenersMessage {
  type: 'event-listeners'
  payload?: Record<string, EventListenersItem>
}

export type MessageContent = LintMessage | EventListenersMessage
