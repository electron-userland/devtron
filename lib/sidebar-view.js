const View = require('./view')

class SidebarView extends View {
  constructor () {
    super('sidebar-view')
    this.panes = []
    this.links = [this.requireLink, this.eventsLink, this.ipcLink, this.lintLink, this.aboutLink]
    this.panesElement = document.querySelector('#pane-group')
    this.panesElement.appendChild(this.element)
    this.handleEvents()
  }

  handleEvents () {
    document.body.addEventListener('keydown', (event) => {
      if (!event.altKey) return

      switch (event.code) {
        case 'ArrowDown':
          this.selectNext()
          event.stopImmediatePropagation()
          event.preventDefault()
          break
        case 'ArrowUp':
          this.selectPrevious()
          event.stopImmediatePropagation()
          event.preventDefault()
          break
      }
    })

    document.body.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.code === 'KeyE') {
        this.activePane.reload()
        this.activePane.focus()
        event.stopImmediatePropagation()
        event.preventDefault()
      }
    })

    this.element.addEventListener('mousedown', (event) => {
      let paneLink = event.target.dataset.paneLink
      if (paneLink) this.selectPane(paneLink)
    })
  }

  activateLink (name) {
    this.links.forEach((link) => {
      if (link.dataset.paneLink === name) {
        link.classList.add('active')
      } else {
        link.classList.remove('active')
      }
    })
  }

  addPane (view) {
    if (this.panes.length === 0) this.activePane = view
    this.panes.push(view)
    this.panesElement.appendChild(view.element)
  }

  findPane (name) {
    return this.panes.find((view) => view.element.dataset.pane === name)
  }

  selectPane (name) {
    this.panes.forEach((view) => view.hide())

    const pane = this.findPane(name)
    pane.show()
    pane.focus()
    this.activePane = pane

    this.activateLink(name)
  }

  selectPrevious () {
    const selectedIndex = this.panes.indexOf(this.activePane)
    const previousIndex = Math.max(selectedIndex - 1, 0)
    this.selectPane(this.panes[previousIndex].element.dataset.pane)
  }

  selectNext () {
    const selectedIndex = this.panes.indexOf(this.activePane)
    const nextIndex = Math.min(selectedIndex + 1, this.panes.length - 1)
    this.selectPane(this.panes[nextIndex].element.dataset.pane)
  }
}

module.exports = SidebarView
