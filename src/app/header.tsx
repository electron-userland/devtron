import React, { FC } from 'react'
import { ControlGroup } from '@blueprintjs/core'

export const Header: FC = ({ children }) => (
  <div style={{ padding: 10 }}>
    <ControlGroup>{children}</ControlGroup>
  </div>
)
