import React, { FC, useState } from 'react'
import { Menu, MenuItem, Divider, IconName } from '@blueprintjs/core'
import { RequireGraphView } from './require-graph'
import { EventListenersView } from './event-listeners'
import { IpcView } from './ipc'
import { LintView } from './lint'
import { AccessibilityView } from './accessibility'
import { AboutView } from './about'
import { GlobalProvider } from './context'

const tabs: { icon: IconName; name: string; component: FC }[] = [
  {
    icon: 'graph',
    name: 'Require Graph',
    component: RequireGraphView,
  },
  {
    icon: 'timeline-events',
    name: 'Event Listeners',
    component: EventListenersView,
  },
  {
    icon: 'mobile-phone',
    name: 'IPC',
    component: IpcView,
  },
  {
    icon: 'function',
    name: 'Lint',
    component: LintView,
  },
  {
    icon: 'globe',
    name: 'Accessibility',
    component: AccessibilityView,
  },
  {
    icon: 'info-sign',
    name: 'About',
    component: AboutView,
  },
]

export const App: FC = () => {
  const [active, setActive] = useState(0)
  const CurrentComponent = tabs[active].component

  return (
    <GlobalProvider>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Menu>
          {tabs.map((tab, i) => (
            <MenuItem
              icon={tab.icon}
              text={tab.name}
              key={i}
              active={i === active}
              onClick={() => {
                setActive(i)
              }}
            />
          ))}
        </Menu>
        <Divider />
        <div
          style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}
        >
          <CurrentComponent />
        </div>
      </div>
    </GlobalProvider>
  )
}
