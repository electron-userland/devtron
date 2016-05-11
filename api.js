const electron = require('electron')

exports.install = () => {
  console.log(`Installing Devtron from ${__dirname}`)
  electron.remote.BrowserWindow.addDevToolsExtension(__dirname)
}

exports.uninstall = () => {
  electron.remote.BrowserWindow.removeDevToolsExtension('devtron')
}
