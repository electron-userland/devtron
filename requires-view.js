'use strict';

class ModuleView {
  constructor(module, table) {
    this.module = module
    this.expanded = false
    this.element = document.importNode(document.querySelector('#js-requires-table-row').content, true).firstElementChild
    this.disclosure = this.element.querySelector('.js-disclosure')
    table.appendChild(this.element)
    this.render()
    this.handleEvents()
    this.children = this.module.children.map((child) => new ModuleView(child, table))

    if (this.module.getDepth() === 1) {
      this.expand()
    } else {
      this.collapse()
    }
  }

  handleEvents() {
    this.element.querySelector('.js-disclosure').addEventListener('click', () => this.toggleExpansion())
  }

  hide() {
    this.element.classList.add('hidden')
    this.children.forEach((child) => child.hide())
  }

  show() {
    this.element.classList.remove('hidden')
    if (this.expanded) {
      this.children.forEach((child) => child.show())
    }
  }

  toggleExpansion() {
    if (this.expanded) {
      this.collapse()
    } else {
      this.expand()
    }
  }

  expand() {
    this.expanded = true
    this.disclosure.classList.add('disclosure-arrow-expanded')
    this.children.forEach((child) => child.show())
  }

  collapse() {
    this.expanded = false
    this.disclosure.classList.remove('disclosure-arrow-expanded')
    this.children.forEach((child) => child.hide())
  }

  render() {
    this.element.querySelector('.js-row-module').textContent = this.module.getLibrary()
    this.element.querySelector('.js-row-size').textContent = this.module.getSize()

    if (this.module.hasChildren()) this.element.classList.add('has-children')
    this.element.querySelector('.js-row-name').textContent = this.module.getName()
    this.element.querySelector('.js-row-file').style['padding-left'] = `${(this.module.getDepth()) * 15}px`
  }
}

document.addEventListener("DOMContentLoaded", function () {
  getRequires().then((mainModule) => {
    const table = document.querySelector('.js-requires-table')
    new ModuleView(mainModule, table)
  })
});
