'use strict'

const path = require('path')
const Application = require('spectron').Application
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const describe = global.describe
const it = global.it
const before = global.before
const after = global.after

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
      args: [path.join(__dirname, '..', 'fixtures', 'node-integration-instructions')]
    })

    return app.start().then(function () {
      chaiAsPromised.transferPromiseness = app.transferPromiseness
      return app.client.waitUntilWindowLoaded()
    })
  })

  after(function () {
    if (app.isRunning()) return app.stop()
  })

  describe('when require and process are not set via a preload script', function () {
    it('displays instructions for exposing them', function () {
      return app.client
        .waitForVisible('.node-integration-view', timeout)
        .getText('.error-heading').should.eventually.equal('Node Integration Disabled')
    })
  })
})
