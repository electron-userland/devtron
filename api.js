const electron = require('electron')
const path = require('path')

exports.install = () => {
  electron.remote.BrowserWindow.addDevToolsExtension(__dirname)
}

exports.uninstall = () => {
  electron.remote.BrowserWindow.removeDevToolsExtension('devtron')
}
