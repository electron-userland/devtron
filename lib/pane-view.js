'use strict'

const View = require('./view')

document.addEventListener('DOMContentLoaded', () => {
  const paneSidebar = document.querySelector('.js-pane-sidebar')

  paneSidebar.addEventListener('click', (event) => {
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
})
