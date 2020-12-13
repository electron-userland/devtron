import React, { FC, useContext } from 'react'
import { Button, HTMLTable, Callout } from '@blueprintjs/core'
import { Header } from './header'
import { sendMessage } from './utils'
import { GlobalContext } from './context'
import { Highlighter } from './highlighter'

export const LintView: FC = () => {
  const { lint } = useContext(GlobalContext)
  return (
    <>
      <Header>
        <Button
          small
          icon="refresh"
          onClick={() => {
            sendMessage({ type: 'lint' })
          }}
        >
          Lint App
        </Button>
      </Header>

      {lint && (
        <HTMLTable>
          <tbody>
            {[
              {
                status: lint.currentVersion === lint.latestVersion,
                title: 'Using latest Electron version',
                errorText: (
                  <>
                    Your application is using version {lint.currentVersion} and
                    the latest version released is {lint.latestVersion}. View
                    the{' '}
                    <a href="http://electron.atom.io/releases.html">
                      Electron release notes
                    </a>
                    .
                  </>
                ),
              },
              {
                status: lint.asar,
                title: 'Using an asar archive',
                errorText: (
                  <>
                    Your application is not bundled in an <code>.asar</code>{' '}
                    archive. Asar bundles your entire application into a single
                    file which makes your app quicker to install/update as well
                    as improves the code loading performance in many
                    environments. View the{' '}
                    <a href="http://electron.atom.io/docs/tutorial/application-packaging">
                      asar instructions
                    </a>
                    .
                  </>
                ),
              },
              {
                status: lint.crash,
                title: 'Listening for crash events',
                errorText: (
                  <>
                    Your application is not listening for the{' '}
                    <code>crashed</code> event on the <code>webContents</code>{' '}
                    property of the <code>BrowserWindow</code>. It is important
                    to listen for this event to report when it happens and
                    notify the user about what happened. View the{' '}
                    <a href="http://electron.atom.io/docs/api/web-contents/#event-crashed">
                      <code>webContents</code> docs
                    </a>
                    .
                    <br />
                    Listen for this event by adding the following to the{' '}
                    <code>webContents</code>:
                    <Highlighter>
                      {`myWindow.webContents.on('crashed', function () {})`}
                    </Highlighter>
                  </>
                ),
              },
              {
                status: lint.unresponsive,
                title: 'Listening for unresponsive events',
                errorText: (
                  <>
                    Your application is not listening for the{' '}
                    <code>unresponsive</code> event on the{' '}
                    <code>BrowserWindow</code>. It is important to listen for
                    this event to report when it happens and to notify the user
                    about what has happened. View the{' '}
                    <a href="http://electron.atom.io/docs/api/browser-window/#event-unresponsive">
                      <code>BrowserWindow</code> docs
                    </a>
                    .
                    <br />
                    Listen for this event by adding the following to the{' '}
                    <code>BrowserWindow</code>:
                    <Highlighter>
                      {`myWindow.on('unresponsive', function () {})`}
                    </Highlighter>
                  </>
                ),
              },
              {
                status: lint.uncaughtException,
                title: 'Listening for uncaughtException events',
                errorText: (
                  <>
                    Your application is not listening for the{' '}
                    <code>uncaughtException</code> event on the main{' '}
                    <code>process</code>. Electron shows a dialog with a stack
                    trace by default if you do not provide a listener for this
                    event. It is important to listen for this event to report
                    when it happens and possibly notify the user about what has
                    happened. View the{' '}
                    <a href="https://nodejs.org/api/process.html#process_event_uncaughtexception">
                      <code>process</code> docs
                    </a>
                    .
                    <br />
                    Listen for this event by adding the following to the main{' '}
                    <code>process</code>:
                    <Highlighter>
                      {`process.on('uncaughtException', function () {})`}
                    </Highlighter>
                  </>
                ),
              },
            ].map(({ status, title, errorText }) => (
              <tr>
                <td>
                  <Callout
                    title={title}
                    intent={status ? 'success' : 'warning'}
                  >
                    {status || errorText}
                  </Callout>
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}
    </>
  )
}
