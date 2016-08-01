'use strict'

const AboutView = require('./about-view')
const Eval = require('./eval')
const EventsView = require('./events-view')
const IpcView = require('./ipc-view')
const LintView = require('./lint-view')
const AccessibilityView = require('./accessibility-view')
const ModulesView = require('./modules-view')
const NodeIntegrationView = require('./node-integration-view')
const SidebarView = require('./sidebar-view')

document.addEventListener('DOMContentLoaded', () => {
  Eval.isApiAvailable().then(function (apiAvailable) {
    const sidebarView = new SidebarView()

    if (apiAvailable) {
      sidebarView.addPane(new ModulesView())
      sidebarView.addPane(new EventsView())
      sidebarView.addPane(new IpcView())
      sidebarView.addPane(new LintView())
      sidebarView.addPane(new AccessibilityView())
      sidebarView.addPane(new AboutView())

      listenForLinkClicks()
    } else {
      sidebarView.addPane(new NodeIntegrationView())
    }
  })
})

if (!window.chrome.devtools) {
  Eval.proxyToServer()
} else {
  Eval.isDebugMode().then(function (debugMode) {
    if (debugMode) Eval.startServer()
  })
}

const listenForLinkClicks = () => {
  document.body.addEventListener('click', (event) => {
    const href = event.target.href
    if (href) {
      Eval.openExternal(href)
      event.stopImmediatePropagation()
      event.preventDefault()
    }
  })
}
