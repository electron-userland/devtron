'use strict'

const devtools = require('./devtools')
const Lint = require('../lib/lint-helpers')
const expect = require('chai').expect

const describe = global.describe
const it = global.it
const beforeEach = global.beforeEach
const afterEach = global.afterEach

describe('Lint Helpers', () => {
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
})
