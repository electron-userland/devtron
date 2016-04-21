const electron = require('electron')

exports.install = () => {
  electron.remote.BrowserWindow.addDevToolsExtension(__dirname)
}

exports.uninstall = () => {
  electron.remote.BrowserWindow.removeDevToolsExtension('devtron')
}
