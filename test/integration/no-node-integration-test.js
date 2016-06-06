'use strict'

const path = require('path')
const Application = require('spectron').Application
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const describe = global.describe
const it = global.it
const beforeEach = global.beforeEach
const afterEach = global.afterEach

const timeout = process.env.CI ? 60000 : 30000

chai.should()
chai.use(chaiAsPromised)

describe('when nodeIntegration is disabled in the app', function () {
  this.timeout(timeout)

  let app

  before(function () {
    let electronPath = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron')
    if (process.platform === 'win32') electronPath += '.cmd'

    app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..', 'fixtures', 'no-node-integration')]
    })

    return app.start().then(function () {
      chaiAsPromised.transferPromiseness = app.transferPromiseness
      return app.client.waitUntilWindowLoaded()
    })
  })

  after(function () {
    if (app.isRunning()) return app.stop()
  })

  describe('when require and process are set via a preload script', function () {
    it('displays a table of required files', function () {
      return app.client
        .click('.pane[data-pane=graph] button')
        .waitForVisible('.pane[data-pane=graph] .table-description', timeout, true)
        .isVisible('.pane[data-pane=graph] .row-module').should.eventually.have.length.above(0)
    })

    it('displays a table of emitters, events, and listeners', function () {
      return app.client
        .click('.list-group-item[data-pane-link=listeners]')
        .click('.pane[data-pane=listeners] button')
        .waitForVisible('.pane[data-pane=listeners] .table-description', timeout, true)
        .isVisible('.pane[data-pane=listeners] .row-emitter').should.eventually.have.length.above(0)
    })
  })
})
