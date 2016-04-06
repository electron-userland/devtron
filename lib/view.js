'use strict'

class View {
  static queryForEach (element, selector, callback) {
    const elements = element.querySelectorAll(selector)
    Array.prototype.forEach.call(elements, callback)
  }

  constructor (viewId) {
    this.id = viewId
    this.element = this.createElement()
    this.element.view = this
    this.bindFields()
  }

  bindFields () {
    View.queryForEach(this.element, '[data-field]', (propertyElement) => {
      this[propertyElement.dataset.field] = propertyElement
    })
  }

  createElement () {
    const template = document.querySelector(`#${this.id}`).content
    return document.importNode(template, true).firstElementChild
  }
}

module.exports = View
