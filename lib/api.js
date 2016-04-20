const electron = require('electron')
const path = require('path')

const modulePath = path.join(__dirname, '..')

exports.install = () => {
  electron.remote.BrowserWindow.addDevToolsExtension(modulePath)
}

exports.uninstall = () => {
  electron.remote.BrowserWindow.removeDevToolsExtension('devtron')
}
