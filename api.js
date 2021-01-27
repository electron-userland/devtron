const { session } = require('electron')

exports.install = () => {
  const ses = session.defaultSession

  if (process.type === 'renderer') {
    console.log(`Installing [renderer] Devtron from ${__dirname}`)
    if (ses.getAllExtensions && ses.getAllExtensions().devtron) return true
    return ses.loadExtension(__dirname)
  } else if (process.type === 'browser') {
    console.log(`Installing [browser] Devtron from ${__dirname}`)
    if (ses.getAllExtensions && ses.getAllExtensions().devtron) return true
    return ses.loadExtension(__dirname)
  } else {
    throw new Error('Devtron can only be installed from an Electron process.')
  }
}

exports.uninstall = () => {
  const ses = session.defaultSession

  if (process.type === 'renderer') {
    console.log(`Uninstalling [renderer] Devtron from ${__dirname}`)
    return ses.removeExtension('devtron')
  } else if (process.type === 'browser') {
    console.log(`Uninstalling [browser] Devtron from ${__dirname}`)
    return ses.removeExtension('devtron')
  } else {
    throw new Error('Devtron can only be uninstalled from an Electron process.')
  }
}

exports.path = __dirname
