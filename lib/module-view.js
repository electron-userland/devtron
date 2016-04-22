'use strict'

const ExpandableView = require('./expandable-view')
const Humanize = require('humanize-plus')

class ModuleView extends ExpandableView {
  constructor (module, table, parent) {
    super('requires-table-row')

    this.parent = parent
    this.module = module
    this.table = table

    table.appendChild(this.element)
    this.render()
    this.children = this.module.children.map((child) => {
      return new ModuleView(child, table, this)
    })
    this.module.getDepth() === 1 ? this.expand() : this.collapse()

    if (!this.module.hasChildren()) this.disclosure.style.display = 'none'

    this.handleEvents()
  }

  handleEvents () {
    this.listenForSelection(this.table)
    this.listenForSelectionKeys(this.table.parentElement)
    this.listenForExpanderKeys(this.table.parentElement)
  }

  getHumanizedSize () {
    const size = this.module.getSize()
    return Humanize.fileSize(size).replace('bytes', 'B')
  }

  render () {
    this.moduleName.textContent = this.module.getLibrary()
    this.moduleName.title = this.module.getLibrary()
    this.moduleVersion.textContent = this.module.getVersion()
    this.fileSize.textContent = this.getHumanizedSize()
    this.fileName.textContent = this.module.getName()
    this.fileName.title = this.module.path
    this.moduleDirectory.textContent = this.module.getDirectory()
    this.moduleDirectory.title = this.module.path
    this.pathSection.style['padding-left'] = `${(this.module.getDepth()) * 15}px`
  }

  filter (searchText) {
    this.collapse()

    let matches = this.module.getId().includes(searchText)
    matches = matches || this.module.getName().toLowerCase().includes(searchText)

    this.children.forEach((child) => {
      if (child.filter(searchText)) matches = true
    })

    if (matches) {
      this.markCollapsed()
      this.show()
      this.markExpanded()
    } else {
      this.hide()
    }
    return matches
  }
}

module.exports = ModuleView
