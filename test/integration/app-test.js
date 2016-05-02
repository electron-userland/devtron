'use strict'

const path = require('path')
const Application = require('spectron').Application
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const describe = global.describe
const it = global.it
const beforeEach = global.beforeEach
const afterEach = global.afterEach

chai.should()
chai.use(chaiAsPromised)

describe.only('when opened in an app', function () {
  let app

  beforeEach(function () {
    var electronPath = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron')
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

  it('display the require graph pane', function () {
    return app.client.getText('.sidebar .active').should.eventually.equal('Require Graph')
  })
})
