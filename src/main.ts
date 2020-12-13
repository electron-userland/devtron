import path from 'path'
import { ipcMain, BrowserWindow, app } from 'electron'
import fetch from 'node-fetch'
import {
  DEVTRON_CHANNEL,
  MessageContent,
  LintPayload,
  EventListenersMessage,
} from './constants'

const extdir = path.resolve(__dirname, '..')

function getEvents(ee: NodeJS.EventEmitter) {
  return ee.eventNames().reduce<Record<string, string[]>>((record, name) => {
    record[name.toString()] = ee.listeners(name).map((f) => f.toString())
    return record
  }, {})
}

async function handleMessage(e: any, message: MessageContent) {
  console.log('message', message)
  // TODO:
  switch (message.type) {
    case 'lint': {
      let latestVersion = 'unknown'
      try {
        const res = await fetch(
          'https://atom.io/download/atom-shell/index.json'
        )
        const json = await res.json()
        latestVersion = json[0].version
      } catch (err) {}

      const wins = BrowserWindow.getAllWindows()

      const res: LintPayload = {
        asar: /[\\/]app\.asar[\\/]/.test(process.mainModule?.filename ?? ''),
        crash: wins.every((w) => w.listenerCount('crash') > 0),
        unresponsive: wins.every((w) => w.listenerCount('unresponsive') > 0),
        uncaughtException: process.listenerCount('uncaughtException') > 0,
        currentVersion: process.versions.electron,
        latestVersion,
      }
      return res
    }
    case 'event-listeners': {
      console.log(ipcMain.eventNames())
      const res: EventListenersMessage['payload'] = {
        process: getEvents(process),
        app: getEvents(app),
        ipcMain: getEvents(ipcMain),
      }
      return res
    }
    default:
  }
}

async function onWebContentsCreated(
  e: Electron.Event,
  webContents: Electron.webContents
) {
  await webContents.session.loadExtension(extdir)
}

export function install() {
  console.log(`Installing Devtron from ${extdir}`)

  ipcMain.removeHandler(DEVTRON_CHANNEL)
  ipcMain.handle(DEVTRON_CHANNEL, handleMessage)

  app.on('web-contents-created', onWebContentsCreated)
}

export function uninstall() {
  console.log(`Uninstalling Devtron from ${extdir}`)

  ipcMain.removeHandler(DEVTRON_CHANNEL)

  app.removeListener('web-contents-created', onWebContentsCreated)
}
