'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const mainProcessTab = document.querySelector('.js-main-process-tab')
  const renderProcessTab = document.querySelector('.js-render-process-tab')

  const mainProcessTable = document.querySelector('.js-main-process-table')
  const renderProcessTable = document.querySelector('.js-render-process-table')

  mainProcessTab.addEventListener('click', () => {
    mainProcessTab.classList.add('active')
    renderProcessTab.classList.remove('active')

    mainProcessTable.classList.remove('hidden')
    renderProcessTable.classList.add('hidden')
  })

  renderProcessTab.addEventListener('click', () => {
    mainProcessTab.classList.remove('active')
    renderProcessTab.classList.add('active')

    mainProcessTable.classList.add('hidden')
    renderProcessTable.classList.remove('hidden')
  })
})
