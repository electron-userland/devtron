'use strict'

const devtools = require('./devtools')
const expect = require('chai').expect
const Lint = require('../../lib/lint-helpers')

const afterEach = global.afterEach
const beforeEach = global.beforeEach
const describe = global.describe
const it = global.it

describe('Lint Helpers', function () {
  this.timeout(process.env.CI ? 60000 : 30000)

  beforeEach(() => {
    global.window = devtools.create()
  })

  afterEach(() => {
    delete global.window
  })

  describe('isUsingAsar()', () => {
    it('returns false if the application is not in an asar archive', () => {
      return Lint.isUsingAsar().then((usingAsar) => {
        expect(usingAsar).to.equal(false)
      })
    })
  })

  describe('isListeningForCrashEvents()', () => {
    it('returns false if not listening for crash events', () => {
      return Lint.isListeningForCrashEvents().then((listening) => {
        expect(listening).to.equal(false)
      })
    })
  })

  describe('isListeningForUnresponsiveEvents()', () => {
    it('returns false if not listening for unresponsive events', () => {
      return Lint.isListeningForUnresponsiveEvents().then((listening) => {
        expect(listening).to.equal(false)
      })
    })
  })

  describe('isListeningForUncaughtExceptionEvents()', () => {
    it('returns false if not listening for uncaught exception events', () => {
      return Lint.isListeningForUncaughtExceptionEvents().then((listening) => {
        expect(listening).to.equal(false)
      })
    })
  })
})
