const electron = require('electron')

exports.install = () => {
  console.log(`Installing Devtron from ${__dirname}`)
  return electron.remote.BrowserWindow.addDevToolsExtension(__dirname)
}

exports.uninstall = () => {
  return electron.remote.BrowserWindow.removeDevToolsExtension('devtron')
}

exports.path = __dirname
