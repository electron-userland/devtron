'use strict';

class ModuleView {
  constructor(module, table) {
    this.module = module
    this.element = document.importNode(document.querySelector('#js-requires-table-row').content, true)
    this.render()
    table.appendChild(this.element)
    this.children = this.module.children.map((child) => new ModuleView(child, table))
  }

  render() {
    this.element.querySelector('.js-row-module').textContent = this.module.getLibrary()
    this.element.querySelector('.js-row-size').textContent = this.module.getSize()

    var nameElement = this.element.querySelector('.js-row-file')
    var prefix = this.module.hasChildren() ? '+' : ''
    nameElement.textContent = `${prefix} ${this.module.getName()}`
    nameElement.style['padding-left'] = `${(this.module.getDepth()) * 15}px`
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const table = document.querySelector('.js-requires-table')
  getRequires().then((mainModule) => {
    new ModuleView(mainModule, table)
  })
});
