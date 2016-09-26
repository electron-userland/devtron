'use strict'

const SelectableView = require('./selectable-view')

class AccessibilityElementView extends SelectableView {
  constructor (element, parent) {
    super('element-row')

    this.path = element
    parent.appendChild(this.element)
    this.render()
    this.handleEvents(parent)
  }

  handleEvents (parent) {
    this.listenForSelection(parent)
    this.listenForSelectionKeys(parent.parentElement)
  }

  render () {
    this.selectorPath.textContent = this.path

    // Add a click-handler that will select the element
    this.selectorPath.onclick = (evt) => {
      evt.preventDefault()
      chrome.devtools.inspectedWindow.eval(
        "inspect($$(\"" + this.path.replace('"', '\\"') + "\")[0])",
        function(result, isException) { }
      );
    }
  }

  filter (searchText) {
    let matches = this.path.toLowerCase().includes(searchText)
    matches ? this.show() : this.hide()
    return matches
  }
}

module.exports = AccessibilityElementView
