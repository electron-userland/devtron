const app = require('electron').app
const BrowserWindow = require('electron').BrowserWindow
const path = require('path')

let window

app.on('ready', function () {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload'),
      nodeIntegration: false
    }
  })

  const indexPage = path.join(__dirname, '..', '..', '..', 'static', 'index.html')
  window.loadURL(`file://${indexPage}`)
})
