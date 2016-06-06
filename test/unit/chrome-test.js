'use strict'

const Chrome = require('../../lib/chrome-helpers')
const devtools = require('./devtools')
const expect = require('chai').expect

const describe = global.describe
const it = global.it
const beforeEach = global.beforeEach
const afterEach = global.afterEach

describe('Chrome', function () {
  this.timeout(process.env.CI ? 60000 : 30000)

  beforeEach(() => {
    global.window = devtools.create()
  })

  afterEach(() => {
    delete global.window
  })

  describe('getChromeAPIs()', () => {
    it('returns an array of string API signatures ', () => {
      const apis = Chrome.getChromeAPIs()
      expect(apis).to.deep.equal([
        'chrome.devtools.inspectedWindow.eval',
        'chrome.devtools.tabId',
        'chrome.extension.getURL'
      ])
    })
  })
})
