const ModulesView = require('./modules-view')
const EventsView = require('./events-view')
const IpcView = require('./ipc-view')
require('./pane-view')

document.addEventListener('DOMContentLoaded', () => {
  const paneGroup = document.querySelector('.js-pane-group')

  const modulesView = new ModulesView()
  paneGroup.appendChild(modulesView.element)

  const eventsView = new EventsView()
  paneGroup.appendChild(eventsView.element)

  const ipcView = new IpcView()
  paneGroup.appendChild(ipcView.element)
})
