const ModulesView = require('./modules-view')
const EventsView = require('./events-view')
const IpcView = require('./ipc-view')
require('./pane-view')

document.addEventListener('DOMContentLoaded', () => {
  const modulesView = new ModulesView()
  document.querySelector('[data-pane=graph]').appendChild(modulesView.element)

  const paneGroup = document.querySelector('.js-pane-group')

  const eventsView = new EventsView()
  paneGroup.appendChild(eventsView.element)

  const ipcView = new IpcView()
  paneGroup.appendChild(ipcView.element)
})
