'use strict'

const ExpandableView = require('./expandable-view')
const Loader = require('./loader')

class ModuleView extends ExpandableView {
  constructor (module, table, parent) {
    super('js-requires-table-row')

    this.parent = parent
    this.module = module
    this.table = table

    table.appendChild(this.element)
    this.render()
    this.children = this.module.children.map(child => new ModuleView(child, table, this))
    this.module.getDepth() === 1 ? this.expand() : this.collapse()
    this.handleEvents()
  }

  handleEvents () {
    this.disclosure.addEventListener('click', () => this.toggleExpansion())
    this.listenForSelection(this.table)
    this.listenForSelectionKeys(this.table.parentElement)
    this.listenForExpanderKeys(this.table.parentElement)
  }

  getHumanizedSize () {
    const size = this.module.getSize()
    if (size > 1024 * 1024) {
      return `${Math.round((size * 10) / (1024 * 1024)) / 10}M`
    } else if (size > 1024) {
      return `${Math.round((size * 10) / 1024) / 10}K`
    } else {
      return `${size}B`
    }
  }

  render () {
    this.moduleName.textContent = this.module.getLibrary()
    this.moduleVersion.textContent = this.module.getVersion()
    this.fileSize.textContent = this.getHumanizedSize()

    if (this.module.hasChildren()) this.element.classList.add('has-children')
    this.fileName.textContent = this.module.getName()
    this.moduleDirectory.textContent = this.module.getDirectory()
    this.pathSection.style['padding-left'] = `${(this.module.getDepth()) * 15}px`
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Loader.getRenderModules().then((mainModule) => {
    const table = document.querySelector('.js-render-requires-table')
    let selectedView = new ModuleView(mainModule, table)
    selectedView.select()
  }).catch((error) => {
    console.error('Loading render modules failed')
    console.error(error.stack || error)
  })

  Loader.getMainModules().then((mainModule) => {
    const table = document.querySelector('.js-main-requires-table')
    let selectedView = new ModuleView(mainModule, table)
    selectedView.select()
  }).catch((error) => {
    console.error('Loading main modules failed')
    console.error(error.stack || error)
  })
})
