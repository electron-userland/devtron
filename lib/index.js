const EventsView = require('./events-view')
const IpcView = require('./ipc-view')
const ModulesView = require('./modules-view')
const SidebarView = require('./sidebar-view')

document.addEventListener('DOMContentLoaded', () => {
  const paneGroup = document.querySelector('.js-pane-group')

  const sidebarView = new SidebarView()
  paneGroup.appendChild(sidebarView.element)

  const modulesView = new ModulesView()
  paneGroup.appendChild(modulesView.element)

  const eventsView = new EventsView()
  paneGroup.appendChild(eventsView.element)

  const ipcView = new IpcView()
  paneGroup.appendChild(ipcView.element)
})
