const View = require('./view')

class SidebarView extends View {
  constructor () {
    super('sidebar-view')
    this.panes = []
    this.panesElement = document.querySelector('#pane-group')
    this.panesElement.appendChild(this.element)
    this.handleEvents()
  }

  handleEvents () {
    this.element.addEventListener('mousedown', (event) => {
      let paneLink = event.target.dataset.paneLink
      if (!paneLink) return

      this.panes.forEach((view) => view.hide())

      const pane = this.findPane(paneLink)
      this.activePane = pane
      pane.show()
      pane.focus()

      this.deactivateLinks()
      event.target.classList.add('active')
    })
  }

  deactivateLinks () {
    this.requireLink.classList.remove('active')
    this.eventsLink.classList.remove('active')
    this.ipcLink.classList.remove('active')
  }

  addPane (view) {
    if (this.panes.length === 0) this.activePane = view
    this.panes.push(view)
    this.panesElement.appendChild(view.element)
  }

  findPane (name) {
    return this.panes.find((view) => view.element.dataset.pane === name)
  }
}

module.exports = SidebarView
