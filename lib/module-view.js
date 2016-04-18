'use strict'

const ExpandableView = require('./expandable-view')

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

    this.fileName.textContent = this.module.getName()
    this.moduleDirectory.textContent = this.module.getDirectory()
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
