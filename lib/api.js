const electron = require('electron')
const path = require('path')

exports.install = () => {
  const modulePath = path.join(__dirname, '..')
  electron.remote.BrowserWindow.addDevToolsExtension(modulePath)
}
