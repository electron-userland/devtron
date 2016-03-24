'use strict'

class View {
  constructor (viewId) {
    this.id = viewId
    this.element = this.createElement()
    this.element.view = this
    this.bindFields()
  }

  bindFields () {
    const fields = this.element.querySelectorAll('[data-field]')
    Array.prototype.forEach.call(fields, (propertyElement) => {
      this[propertyElement.dataset.field] = propertyElement
    })
  }

  createElement () {
    const template = document.querySelector(`#${this.id}`).content
    return document.importNode(template, true).firstElementChild
  }
}

module.exports = View
