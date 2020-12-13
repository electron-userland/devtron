import React, { FC, useContext, useState } from 'react'
import { Button, InputGroup } from '@blueprintjs/core'
import { GlobalContext } from './context'
import { Header } from './header'
import { sendMessage } from './utils'
import { Highlighter } from './highlighter'

export const EventListenersView: FC = () => {
  const { eventListeners } = useContext(GlobalContext)
  const [filter, setFilter] = useState('')

  return (
    <>
      <Header>
        <Button
          icon="refresh"
          onClick={() => {
            sendMessage({ type: 'event-listeners' })
          }}
        >
          Load Listeners
        </Button>
        <InputGroup
          placeholder="Filter events"
          leftIcon="filter"
          value={filter}
          onChange={(e: any) => {
            setFilter(e.target.value)
          }}
        />
      </Header>
      <div>
        {eventListeners &&
          Object.entries(eventListeners).map(([kind, data]) => {
            return (
              <div>
                {kind}
                {Object.entries(data).map(([name, fns]) => {
                  if (filter && !name.includes(filter)) return null
                  return (
                    <div>
                      {name}
                      {fns.map((fn) => (
                        <Highlighter>{fn}</Highlighter>
                      ))}
                    </div>
                  )
                })}
              </div>
            )
          })}
      </div>
    </>
  )
}
