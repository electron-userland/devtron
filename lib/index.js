const ModulesView = require('./modules-view')
require('./events-view')
require('./ipc-event-view')
require('./pane-view')

document.addEventListener('DOMContentLoaded', () => {
  const modulesView = new ModulesView()
  document.querySelector('[data-pane=graph]').appendChild(modulesView.element)
})
