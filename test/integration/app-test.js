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

describe('when opened in an app', function () {
  this.timeout(timeout)

  let app

  beforeEach(function () {
    let electronPath = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron')
    if (process.platform === 'win32') electronPath += '.cmd'

    app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..', 'fixtures', 'app')]
    })

    return app.start().then(function () {
      chaiAsPromised.transferPromiseness = app.transferPromiseness
      return app.client.waitUntilWindowLoaded()
    })
  })

  afterEach(function () {
    return app.stop()
  })

  describe('when a sidebar item is clicked', function () {
    it('displays the pane for the selected item', function () {
      return app.client
        .isVisible('.pane[data-pane=listeners]').should.eventually.be.false
        .click('.list-group-item[data-pane-link=listeners]')
        .isVisible('.pane[data-pane=graph]').should.eventually.be.false
        .isVisible('.pane[data-pane=listeners]').should.eventually.be.true
        .click('.list-group-item[data-pane-link=ipc]')
        .isVisible('.pane[data-pane=listeners]').should.eventually.be.false
        .isVisible('.pane[data-pane=ipc]').should.eventually.be.true
        .click('.list-group-item[data-pane-link=lint]')
        .isVisible('.pane[data-pane=ipc]').should.eventually.be.false
        .isVisible('.pane[data-pane=lint]').should.eventually.be.true
        .click('.list-group-item[data-pane-link=about]')
        .isVisible('.pane[data-pane=lint]').should.eventually.be.false
        .isVisible('.pane[data-pane=about]').should.eventually.be.true
    })
  })

  describe('Require Graph', function () {
    it('displays it initially', function () {
      return app.client
        .getText('.sidebar .active').should.eventually.equal('Require Graph')
        .isVisible('.pane[data-pane=graph]').should.eventually.be.true
        .getText('.pane[data-pane=graph] .tab-item.active').should.eventually.equal('Renderer Process')
    })

    describe('when the Load Graph button is clicked', function () {
      it('displays a table of required files', function () {
        return app.client
          .click('.pane[data-pane=graph] button')
          .waitForVisible('.pane[data-pane=graph] .table-description', timeout, true)
          .isVisible('.pane[data-pane=graph] .row-module').should.eventually.have.length.above(0)
      })
    })
  })

  describe('Event Listeners', function () {
    describe('when the Load Listeners button is clicked', function () {
      it('displays a table of emitters, events, and listeners', function () {
        return app.client
          .click('.list-group-item[data-pane-link=listeners]')
          .click('.pane[data-pane=listeners] button')
          .waitForVisible('.pane[data-pane=listeners] .table-description', timeout, true)
          .isVisible('.pane[data-pane=listeners] .row-emitter').should.eventually.have.length.above(0)
      })
    })
  })
})
