'use strict'

const Humanize = require('humanize-plus')
const modules = require('./module-helpers')
const ModuleView = require('./module-view')
const View = require('./view')

class ModulesView extends View {
  constructor () {
    super('modules-view')
    this.handleEvents()
  }

  handleEvents () {
    this.loadButton.addEventListener('click', () => this.loadGraph())
    this.searchBox.addEventListener('input', () => this.filterGraph())

    this.mainProcessTab.addEventListener('click', () => {
      this.mainProcessTab.classList.add('active')
      this.renderProcessTab.classList.remove('active')

      this.mainProcessTable.classList.remove('hidden')
      this.renderProcessTable.classList.add('hidden')

      this.mainProcessTable.focus()
    })

    this.renderProcessTab.addEventListener('click', () => {
      this.mainProcessTab.classList.remove('active')
      this.renderProcessTab.classList.add('active')

      this.mainProcessTable.classList.add('hidden')
      this.renderProcessTable.classList.remove('hidden')

      this.renderProcessTable.focus()
    })
  }

  getTabLabelSuffix (mainModule) {
    const count = mainModule.count.toLocaleString()
    const size = Humanize.fileSize(mainModule.totalSize)
    return `- ${count} files, ${size}`
  }

  loadGraph () {
    modules.getRenderModules().then((mainModule) => {
      const suffix = this.getTabLabelSuffix(mainModule)
      this.renderProcessTab.textContent = `Renderer Process ${suffix}`
      this.renderRequireRows.innerHTML = ''
      this.rootRenderView = new ModuleView(mainModule, this.renderRequireRows)
      this.rootRenderView.select()
    }).catch((error) => {
      console.error('Loading render modules failed')
      console.error(error.stack || error)
    })

    modules.getMainModules().then((mainModule) => {
      const suffix = this.getTabLabelSuffix(mainModule)
      this.mainProcessTab.textContent = `Main Process ${suffix}`
      this.mainRequireRows.innerHTML = ''
      this.rootMainView = new ModuleView(mainModule, this.mainRequireRows)
      this.rootMainView.select()
    }).catch((error) => {
      console.error('Loading main modules failed')
      console.error(error.stack || error)
    })
  }

  filterGraph () {
    const searchText = this.searchBox.value.toLowerCase()
    if (searchText) {
      this.rootRenderView.filter(searchText)
      this.rootMainView.filter(searchText)
    } else {
      this.rootRenderView.collapseAll()
      this.rootRenderView.expand()
      this.rootMainView.collapseAll()
      this.rootMainView.expand()
    }
  }
}

module.exports = ModulesView
