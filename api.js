const electron = require('electron')

exports.install = () => {
  if (!electron.remote) {
    throw new Error('Devtron cannot be installed from within the main process.')
  }
  console.log(`Installing Devtron from ${__dirname}`)
  return electron.remote.BrowserWindow.addDevToolsExtension(__dirname)
}

exports.uninstall = () => {
  return electron.remote.BrowserWindow.removeDevToolsExtension('devtron')
}

exports.path = __dirname
