const app = require('electron').app
const BrowserWindow = require('electron').BrowserWindow
const path = require('path')

let window

app.on('ready', function () {
  window = new BrowserWindow({
    width: 500,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload')
    }
  })

  const indexPage = path.join(__dirname, '..', '..', '..', 'static', 'index.html')
  window.loadURL(`file://${indexPage}`)
})
