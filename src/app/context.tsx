import React, { createContext, FC, useEffect, useState } from 'react'
import {
  MessageContent,
  LintPayload,
  EventListenersMessage,
} from '../constants'

function noop() {}

export const GlobalContext = createContext<{
  lint?: LintPayload
  eventListeners?: EventListenersMessage['payload']
}>({})

export const GlobalProvider: FC = ({ children }) => {
  const [lint, setLint] = useState<LintPayload>()
  const [eventListeners, setEventListeners] = useState<
    EventListenersMessage['payload']
  >()

  useEffect(() => {
    const listener = (message: MessageContent) => {
      console.log('context', message)
      switch (message.type) {
        case 'lint':
          setLint(message.payload)
          break
        case 'event-listeners':
          setEventListeners(message.payload)
          break
        default:
      }
    }

    const port = chrome.runtime.connect()
    port.onMessage.addListener(listener)

    port.postMessage({
      tabId: chrome.devtools.inspectedWindow.tabId,
    })

    return () => {
      port.onMessage.removeListener(listener)
      port.disconnect()
    }
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        lint,
        eventListeners,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
