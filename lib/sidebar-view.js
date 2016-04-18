const View = require('./view')

class SidebarView extends View {
  constructor () {
    super('js-sidebar-view')
    this.handleEvents()
  }

  handleEvents () {
    this.element.addEventListener('mousedown', (event) => {
      let paneLink = event.target.dataset.paneLink
      if (!paneLink) return

      View.queryForEach(document, '[data-pane]', (pane) => {
        pane.classList.add('hidden')
      })

      const pane = document.querySelector(`[data-pane=${paneLink}]`)
      pane.classList.remove('hidden')
      pane.focus()

      View.queryForEach(document, '[data-pane-link]', (paneLink) => {
        paneLink.classList.remove('active')
      })
      event.target.classList.add('active')
    })
  }
}

module.exports = SidebarView
