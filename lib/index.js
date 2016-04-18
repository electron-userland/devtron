const Eval = require('./eval')
const EventsView = require('./events-view')
const IpcView = require('./ipc-view')
const ModulesView = require('./modules-view')
const SidebarView = require('./sidebar-view')

document.addEventListener('DOMContentLoaded', () => {
  const paneGroup = document.querySelector('#pane-group')

  const sidebarView = new SidebarView()
  paneGroup.appendChild(sidebarView.element)

  const modulesView = new ModulesView()
  paneGroup.appendChild(modulesView.element)

  const eventsView = new EventsView()
  paneGroup.appendChild(eventsView.element)

  const ipcView = new IpcView()
  paneGroup.appendChild(ipcView.element)
})

if (!window.chrome.devtools) {
  Eval.proxyToServer()
} else {
  Eval.isDebugMode().then(function (debugMode) {
    if (debugMode) Eval.startServer()
  })
}
