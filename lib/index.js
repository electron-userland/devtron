const ModulesView = require('./modules-view')
require('./events-view')
const IpcView = require('./ipc-view')
require('./pane-view')

document.addEventListener('DOMContentLoaded', () => {
  const modulesView = new ModulesView()
  document.querySelector('[data-pane=graph]').appendChild(modulesView.element)

  const ipcView = new IpcView()
  document.querySelector('.js-pane-group').appendChild(ipcView.element)
})
