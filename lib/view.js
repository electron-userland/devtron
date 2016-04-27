'use strict'

class View {
  static queryForEach (element, selector, callback) {
    const elements = element.querySelectorAll(selector)
    Array.prototype.forEach.call(elements, callback)
  }

  constructor (viewId) {
    this.id = viewId
    this.listeners = []
    this.element = this.createElement()
    this.element.view = this
    this.bindFields()
  }

  destroy () {
    this.listeners.forEach((destroy) => destroy())
    this.listeners = []
    this.destroyChildren()
  }

  destroyChildren () {
    if (this.children) {
      this.children.forEach((child) => child.destroy())
      this.children = []
    }
  }

  bindFields () {
    View.queryForEach(this.element, '[data-field]', (propertyElement) => {
      this[propertyElement.dataset.field] = propertyElement
    })
  }

  bindListener (emitter, event, callback) {
    emitter.addEventListener(event, callback)
    this.listeners.push(function () {
      emitter.removeEventListener(event, callback)
    })
  }

  createElement () {
    const template = document.querySelector(`#${this.id}`).content
    return document.importNode(template, true).firstElementChild
  }

  isHidden () {
    return this.element.classList.contains('hidden')
  }

  hide () {
    this.element.classList.add('hidden')
  }

  show () {
    this.element.classList.remove('hidden')
  }

  focus () {
    this.element.focus()
  }

  debounceInput (emitter, callback) {
    this.debounceEvent(emitter, 'input', 250, callback)
  }

  debounceEvent (emitter, eventName, interval, callback) {
    let timeoutId
    this.bindListener(emitter, eventName, (event) => {
      window.clearTimeout(timeoutId)
      timeoutId = setTimeout(() => callback(event), interval)
    })
  }

  reload () {
    // Does nothing, subclasses should reimplement
  }
}

module.exports = View
