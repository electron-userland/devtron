const Eval = require('./eval')
const EventsView = require('./events-view')
const IpcView = require('./ipc-view')
const LintView = require('./lint-view')
const ModulesView = require('./modules-view')
const SidebarView = require('./sidebar-view')

document.addEventListener('DOMContentLoaded', () => {
  const sidebarView = new SidebarView()
  sidebarView.addPane(new ModulesView())
  sidebarView.addPane(new EventsView())
  sidebarView.addPane(new IpcView())
  sidebarView.addPane(new LintView())
})

if (!window.chrome.devtools) {
  Eval.proxyToServer()
} else {
  Eval.isDebugMode().then(function (debugMode) {
    if (debugMode) Eval.startServer()
  })
}
