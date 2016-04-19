'use strict'

const SelectableView = require('./selectable-view')

class EventListenerView extends SelectableView {
  constructor (listener, parent) {
    super('listener-code-row')

    this.listener = listener
    parent.appendChild(this.element)
    this.render()
    this.handleEvents(parent)
  }

  handleEvents (parent) {
    this.listenForSelection(parent)
    this.listenForSelectionKeys(parent.parentElement)
  }

  getFormattedCode () {
    let lines = this.listener.split('\n')
    if (lines.length === 1) return this.listener

    let lastLine = lines[lines.length - 1]
    let lastLineMatch = /^(\s+)}/.exec(lastLine)
    if (!lastLineMatch) return this.listener

    let whitespaceRegex = new RegExp('^' + lastLineMatch[1])
    return lines.map((line) => {
      return line.replace(whitespaceRegex, '')
    }).join('\n')
  }

  render () {
    this.listenerValue.textContent = this.getFormattedCode()
  }

  filter (searchText) {
    let matches = this.listener.toLowerCase().includes(searchText)
    matches ? this.show() : this.hide()
    return matches
  }
}

module.exports = EventListenerView
