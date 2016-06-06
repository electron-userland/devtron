'use strict'

const highlight = require('highlight.js')
const View = require('./view')

class NodeIntegrationView extends View {
  constructor () {
    super('node-integration-view')
    this.highlightBlocks()
  }

  highlightBlocks () {
    highlight.highlightBlock(this.browserWindowExample)
    highlight.highlightBlock(this.devtronExample)
    highlight.highlightBlock(this.envCheckExample)
  }
}

module.exports = NodeIntegrationView
