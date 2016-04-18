'use strict'

const Loader = require('./loader')
const ModuleView = require('./module-view')

let rootRenderView
let rootMainView
let loadButton
let searchBox

document.addEventListener('DOMContentLoaded', () => {
  loadButton = document.querySelector('.js-load-graph')
  loadButton.addEventListener('click', loadGraph)

  searchBox = document.querySelector('.js-search-graph')
  searchBox.addEventListener('input', filterGraph)
})

const filterGraph = (event) => {
  const searchText = event.target.value
  if (searchText) {
    if (rootRenderView) rootRenderView.filter(searchText)
    if (rootMainView) rootMainView.filter(searchText)
  } else {
    if (rootRenderView)  {
      rootRenderView.collapseAll()
      rootRenderView.expand()
    }
    if (rootMainView) {
      rootMainView.collapseAll()
      rootMainView.expand()
    }
  }
}

const loadGraph = () => {
  Loader.getRenderModules().then((mainModule) => {
    const table = document.querySelector('.js-render-requires-table')
    table.innerHTML = ''
    rootRenderView = new ModuleView(mainModule, table)
    rootRenderView.select()
  }).catch((error) => {
    console.error('Loading render modules failed')
    console.error(error.stack || error)
  })

  Loader.getMainModules().then((mainModule) => {
    const table = document.querySelector('.js-main-requires-table')
    table.innerHTML = ''
    rootMainView = new ModuleView(mainModule, table)
    rootMainView.select()
  }).catch((error) => {
    console.error('Loading main modules failed')
    console.error(error.stack || error)
  })
}
